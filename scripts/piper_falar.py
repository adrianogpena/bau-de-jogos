"""Lê uma fala da entrada padrão e grava um MP3 com a voz do Piper.
Uso: python piper_falar.py modelo.onnx saida.mp3  (texto na entrada padrão)"""
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice

modelo, saida = sys.argv[1], Path(sys.argv[2])
texto = sys.stdin.read().strip()
voz = PiperVoice.load(modelo)
with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "fala.wav"
    with wave.open(str(wav), "wb") as f:
        voz.synthesize_wav(texto, f)
    saida.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "48k", str(saida)],
        check=True,
    )
