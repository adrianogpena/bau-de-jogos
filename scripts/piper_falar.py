"""Sintetiza falas com o Piper e grava MP3.
Uma fala:  python piper_falar.py modelo.onnx saida.mp3   (texto na entrada padrão)
Em lote:   python piper_falar.py modelo.onnx --lote falas.json   (lista de {"saida": ..., "texto": ...})

Ajustes para a fala ficar mais clara para crianças:
- ritmo um pouco mais lento e com menos variação (CONFIG), MP3 de 96k;
- na voz pt-BR, o espeak gera fonemas que o modelo pronuncia mal: o "e" fraco de "espelho" some ("spew") e o "lh"
  (ʎ) não se ouve. `corrigir_fonemas` troca esses fonemas (testado ouvindo amostras)."""
import json
import subprocess
import sys
import tempfile
import unicodedata
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

CONFIG = SynthesisConfig(length_scale=1.15, noise_scale=0.4, noise_w_scale=0.5)
PAUSA_ENTRE_FRASES = 0.25  # segundos


def corrigir_fonemas(fonemas, pt_br):
    if not pt_br:
        return fonemas
    saida = []
    inicio_palavra = True
    i = 0
    while i < len(fonemas):
        f = fonemas[i]
        # "e" fraco antes de "s" no começo da palavra (espelho, escola): vira "e" tônico e longo
        if inicio_palavra and fonemas[i : i + 3] == ["ˌ", "e", "s"]:
            saida += ["ˈ", "e", "ː", "s"]
            i += 3
        elif f == "ʎ":
            saida += ["l", "j"]
            i += 1
        else:
            saida.append(f)
            i += 1
        inicio_palavra = f == " "
    return saida


def sem_nasal(fonemas):
    decomposto = unicodedata.normalize("NFD", "".join(fonemas)).replace("̃", "")
    return list(unicodedata.normalize("NFC", decomposto))


# Números e palavras soltas da voz pt-BR que o modelo fala mal (testado ouvindo amostras). Por texto:
# (comprimento, pausa antes, tira a nasal das vogais, fonemas fixos ou None para os do espeak).
# Palavra isolada sai rápida e com o começo comido; o ritmo mais lento e a pausa corrigem.
AJUSTES_PT_BR = {
    "zero": (1.5, True, True, None),
    "vinte": (1.5, True, True, None),
    "trinta": (1.5, True, False, None),
    "quatro": (1.5, True, False, None),
    "onze": (1.5, True, False, None),
    "cinquenta e dois": (1.5, True, False, None),
    "cem": (1.5, True, False, "sˈẽĩ"),
    "quinze": (1.5, True, False, "kˈĩzi"),
}


def sintetizar(voz, texto, pt_br):
    pedacos = []
    silencio = np.zeros(int(voz.config.sample_rate * PAUSA_ENTRE_FRASES), dtype=np.int16)
    ajuste = AJUSTES_PT_BR.get(texto.strip().lower()) if pt_br else None
    config = CONFIG
    for fonemas in voz.phonemize(texto):
        fonemas = corrigir_fonemas(fonemas, pt_br)
        if ajuste:
            comprimento, pausa, tira_nasal, fixos = ajuste
            config = SynthesisConfig(length_scale=comprimento, noise_scale=0.4, noise_w_scale=0.5)
            if fixos:
                fonemas = list(unicodedata.normalize("NFD", fixos))
            elif tira_nasal:
                fonemas = sem_nasal(fonemas)
            if pausa:
                fonemas = [",", " "] + fonemas
        ids = voz.phonemes_to_ids(fonemas)
        audio = voz.phoneme_ids_to_audio(ids, syn_config=config)
        if audio.dtype != np.int16:
            audio = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        if pedacos:
            pedacos.append(silencio)
        pedacos.append(audio)
    return np.concatenate(pedacos) if pedacos else np.zeros(1, dtype=np.int16)


modelo = sys.argv[1]
if sys.argv[2] == "--lote":
    falas = json.loads(Path(sys.argv[3]).read_text(encoding="utf-8"))
else:
    falas = [{"saida": sys.argv[2], "texto": sys.stdin.read()}]

pt_br = "pt_BR" in Path(modelo).name
voz = PiperVoice.load(modelo)
with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "fala.wav"
    for n, fala in enumerate(falas, 1):
        saida = Path(fala["saida"])
        pcm = sintetizar(voz, fala["texto"].strip(), pt_br)
        with wave.open(str(wav), "wb") as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(voz.config.sample_rate)
            f.writeframes(pcm.tobytes())
        saida.parent.mkdir(parents=True, exist_ok=True)
        temporario = saida.with_suffix(".tmp.mp3")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "96k", str(temporario)],
            check=True,
        )
        temporario.replace(saida)
        if len(falas) > 1 and n % 50 == 0:
            print(f"  {n}/{len(falas)}", flush=True)
