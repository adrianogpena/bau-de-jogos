"""Sintetiza falas do narrador (vozes neurais da Microsoft) e grava MP3 mono.

Em lote:  python narrador_falar.py --voz pt-BR-ThalitaMultilingualNeural --lote falas.json
          (lista de {"saida": ..., "texto": ...}; o que já existe em "saida" não é refeito)
Opções:   --voz-curta OUTRA_VOZ --palavras-curta 4  --ritmo -5%  --tom +10Hz  --paralelo 3  --tentativas 6

Para trocar o serviço (edge-tts -> Azure Speech) basta reescrever `sintetizar_frase`: ela recebe o texto e devolve os
bytes de um MP3 (ou de qualquer áudio que o ffmpeg leia). O resto (paralelismo, nova tentativa, retomada, corte do
silêncio, MP3 mono) é igual para qualquer serviço.
"""
import argparse
import asyncio
import json
import random
import re
import subprocess
import sys
from pathlib import Path

import edge_tts
import imageio_ffmpeg

def _ssml_na_lingua_da_voz(tc, texto):
    """O edge-tts fixa xml:lang='en-US' no SSML; a voz multilíngue (Thalita) então fala palavras curtas com som de
    inglês. Aqui a língua é a da própria voz (pt-BR, pt-PT)."""
    if isinstance(texto, bytes):
        texto = texto.decode("utf-8")
    lingua = "-".join(tc.voice.split("-")[:2])
    return (
        f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{lingua}'>"
        f"<voice name='{tc.voice}'><prosody pitch='{tc.pitch}' rate='{tc.rate}' volume='{tc.volume}'>{texto}</prosody></voice>"
        "</speak>"
    )


edge_tts.communicate.mkssml = _ssml_na_lingua_da_voz

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
# Corta o silêncio do começo e do fim (limite -45 dB), deixando um respiro curto; MP3 mono de 64k.
FILTRO_SILENCIO = (
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,"
    "areverse"
)


async def sintetizar_frase(texto: str, voz: str, args) -> bytes:
    """O único ponto que depende do serviço de voz: texto -> bytes de áudio. (Azure: trocar só esta função.)"""
    palavra_isolada = len(re.findall(r"[\w'-]+", texto)) == 1
    ritmo = args.ritmo_palavra if args.ritmo_palavra and palavra_isolada else args.ritmo
    # Palavra solta sai traquejada (o "R") nas vozes multilíngues: fala-se dentro de uma frase e recorta-se só a palavra.
    em_frase = bool(args.frase_palavra and palavra_isolada and "{palavra}" in args.frase_palavra)
    falado = args.frase_palavra.replace("{palavra}", texto) if em_frase else texto
    comunicar = edge_tts.Communicate(falado, voz, rate=ritmo, pitch=args.tom, boundary="WordBoundary")
    pedacos = []
    palavras = []
    async for parte in comunicar.stream():
        if parte["type"] == "audio":
            pedacos.append(parte["data"])
        elif parte["type"] == "WordBoundary":
            palavras.append(parte)
    audio = b"".join(pedacos)
    if not audio:
        raise RuntimeError("serviço não devolveu áudio")
    if not em_frase:
        return audio, None
    def _limpa(t: str) -> str:
        return re.sub(r"[^\w'-]+", "", t).lower()

    alvo = [w for w in palavras if _limpa(w["text"]) == _limpa(texto)]
    if not alvo:
        raise RuntimeError(f"não achei a palavra {texto!r} na frase")
    w = alvo[-1]
    inicio = w["offset"] / 1e7
    return audio, (max(0.0, inicio - 0.03), w["duration"] / 1e7 + 0.08)


def finalizar(audio: bytes, recorte=None) -> bytes:
    """Corta silêncio nas pontas (e, se houver, recorta o trecho (início, duração) em segundos) e devolve MP3 mono."""
    trecho = ["-ss", f"{recorte[0]:.3f}", "-t", f"{recorte[1]:.3f}"] if recorte else []
    r = subprocess.run(
        [FFMPEG, "-loglevel", "error", "-i", "pipe:0", *trecho, "-af", FILTRO_SILENCIO, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", "-f", "mp3", "pipe:1"],
        input=audio,
        capture_output=True,
    )
    if r.returncode != 0 or len(r.stdout) < 500:
        raise RuntimeError(f"ffmpeg falhou: {r.stderr.decode(errors='replace')[:200]}")
    return r.stdout


def voz_da_fala(texto: str, args) -> str:
    """Frase curta (até --palavras-curta palavras) usa --voz-curta: a voz multilíngue mistura inglês em palavra solta."""
    if args.voz_curta and len(re.findall(r"[\w'-]+", texto)) <= args.palavras_curta:
        return args.voz_curta
    return args.voz


async def uma_fala(fala, args, semaforo, estado):
    saida = Path(fala["saida"])
    if saida.exists() and saida.stat().st_size >= 500:
        estado["puladas"] += 1
        return
    async with semaforo:
        for tentativa in range(1, args.tentativas + 1):
            try:
                audio, recorte = await asyncio.wait_for(sintetizar_frase(fala["texto"].strip(), voz_da_fala(fala["texto"], args), args), timeout=60)
                mp3 = await asyncio.to_thread(finalizar, audio, recorte)
                saida.parent.mkdir(parents=True, exist_ok=True)
                temporario = saida.with_suffix(".tmp.mp3")
                temporario.write_bytes(mp3)
                temporario.replace(saida)  # só aparece pronto: uma interrupção nunca deixa arquivo pela metade
                estado["feitas"] += 1
                break
            except Exception as erro:  # noqa: BLE001 - qualquer falha de rede/serviço entra na nova tentativa
                if tentativa == args.tentativas:
                    estado["falhas"].append((fala["texto"], str(erro)))
                    print(f"  FALHOU: {fala['texto'][:60]!r}: {erro}", flush=True)
                else:
                    await asyncio.sleep(min(2**tentativa, 30) + random.random())
        total = estado["feitas"] + estado["puladas"] + len(estado["falhas"])
        if total % 50 == 0:
            print(f"  {total}/{estado['total']}", flush=True)


async def principal(args):
    falas = json.loads(Path(args.lote).read_text(encoding="utf-8"))
    estado = {"feitas": 0, "puladas": 0, "falhas": [], "total": len(falas)}
    semaforo = asyncio.Semaphore(args.paralelo)
    await asyncio.gather(*(uma_fala(f, args, semaforo, estado) for f in falas))
    print(f"{estado['feitas']} geradas, {estado['puladas']} já existiam, {len(estado['falhas'])} falharam", flush=True)
    return 1 if estado["falhas"] else 0


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--voz", required=True)
    p.add_argument("--lote", required=True)
    p.add_argument("--voz-curta", default=None)
    p.add_argument("--palavras-curta", type=int, default=4)
    p.add_argument("--ritmo", default="-5%")
    p.add_argument("--ritmo-palavra", default=None, help="ritmo de uma palavra isolada (mais lento, para quem aprende a ler)")
    p.add_argument("--frase-palavra", default=None, help="frase com {palavra}: a palavra isolada é falada nela e recortada")
    p.add_argument("--tom", default="+0Hz")
    p.add_argument("--paralelo", type=int, default=3)
    p.add_argument("--tentativas", type=int, default=6)
    sys.exit(asyncio.run(principal(p.parse_args())))
