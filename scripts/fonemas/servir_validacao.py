"""Servidor local da página de validação de fonemas: serve referencias-fonemas/validacao-ajustes/ e grava cada
resposta em respostas.json na hora (a página manda a cada mudança). Não depende do localStorage do navegador.

  python scripts/fonemas/servir_validacao.py                      # rodada 1, em http://localhost:5198/
  python scripts/fonemas/servir_validacao.py validacao-rodada2    # outra pasta de referencias-fonemas/

Qualquer python 3 serve (não precisa do Piper). Guia: docs/VALIDACAO-FONEMAS.md"""
import json
import os
import sys
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PASTA = Path(__file__).resolve().parents[2] / "referencias-fonemas" / (sys.argv[1] if len(sys.argv) > 1 else "validacao-ajustes")
ARQUIVO = PASTA / "respostas.json"
PORTA = 5198


class Pagina(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] == "/respostas":
            corpo = ARQUIVO.read_bytes() if ARQUIVO.exists() else b"{}"
            return self.responder(200, corpo)
        super().do_GET()

    def do_POST(self):
        if self.path != "/respostas":
            return self.responder(404, b"{}")
        corpo = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        try:
            dados = json.loads(corpo)
        except ValueError:
            return self.responder(400, b'{"erro":"json"}')
        if ARQUIVO.exists():  # cópia da versão anterior, para nunca perder respostas por engano
            ARQUIVO.replace(ARQUIVO.with_suffix(".anterior.json"))
        temp = ARQUIVO.with_suffix(".tmp")
        temp.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
        os.replace(temp, ARQUIVO)
        self.responder(200, json.dumps({"salvo": datetime.now().strftime("%H:%M:%S")}).encode())

    def responder(self, codigo, corpo):
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(corpo)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


print(f"Página: http://localhost:{PORTA}/   respostas em {ARQUIVO}")
ThreadingHTTPServer(("localhost", PORTA), partial(Pagina, directory=str(PASTA))).serve_forever()
