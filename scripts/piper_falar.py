"""Sintetiza falas com o Piper e grava MP3.
Uma fala:  python piper_falar.py modelo.onnx saida.mp3   (texto na entrada padrão)
Em lote:   python piper_falar.py modelo.onnx --lote falas.json   (lista de {"saida": ..., "texto": ...})"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice

modelo = sys.argv[1]
if sys.argv[2] == "--lote":
    falas = json.loads(Path(sys.argv[3]).read_text(encoding="utf-8"))
else:
    falas = [{"saida": sys.argv[2], "texto": sys.stdin.read()}]

voz = PiperVoice.load(modelo)
with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "fala.wav"
    for n, fala in enumerate(falas, 1):
        saida = Path(fala["saida"])
        with wave.open(str(wav), "wb") as f:
            voz.synthesize_wav(fala["texto"].strip(), f)
        saida.parent.mkdir(parents=True, exist_ok=True)
        temporario = saida.with_suffix(".tmp.mp3")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "48k", str(temporario)],
            check=True,
        )
        temporario.rename(saida)
        if len(falas) > 1 and n % 50 == 0:
            print(f"  {n}/{len(falas)}", flush=True)
