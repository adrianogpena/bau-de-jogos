"""Sintetiza falas do narrador (vozes neurais da Microsoft, serviço do edge-tts) e grava MP3 mono.

Uma voz:  python narrador_falar.py --voz pt-BR-ThalitaMultilingualNeural --lote falas.json
          (lista de {"saida": ..., "texto": ..., "falado"?: ...}; o que já existe em "saida" não é refeito)
          opções da voz: --voz-curta OUTRA_VOZ --palavras-curta 4  --ritmo -5%  --tom +10Hz ...
Várias:   python narrador_falar.py --lote lote.json
          ({"vozes": {id: config de vozes-narrador.json}, "falas": [{"voz": id, "saida", "texto", "falado"?}]});
          as vozes dividem as mesmas conexões: quando uma acaba, as conexões passam todas para a outra.
Opções:   --paralelo 8 (conexões no total)  --frases-por-pedido 8  --tentativas 6  --eventos

Velocidade: o serviço leva ~2 s para começar a responder cada pedido, e abrir conexão custa ~1 s (e é limitado
quando se abrem muitas). Por isso:
- cada vaga de --paralelo mantém UMA conexão aberta e manda por ela todos os seus pedidos;
- cada pedido leva até --frases-por-pedido falas como texto corrido; o serviço informa onde começa cada frase
  (SentenceBoundary) e o áudio é recortado por fala. Se as frases devolvidas não baterem com as falas, o lote é
  refeito uma fala por pedido. --frases-por-pedido 1 desliga o lote.
Marcas SSML (<break>, <bookmark>) não servem: o serviço fecha a conexão.
"""
import argparse
import asyncio
import json
import random
import re
import subprocess
import sys
from pathlib import Path
from xml.sax.saxutils import escape, unescape

import aiohttp
import imageio_ffmpeg
from edge_tts import communicate as _edge
from edge_tts.constants import SEC_MS_GEC_VERSION, WSS_HEADERS, WSS_URL
from edge_tts.drm import DRM

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
# Corta o silêncio do começo e do fim (limite -45 dB), deixando um respiro curto; MP3 mono de 64k.
FILTRO_SILENCIO = (
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,"
    "areverse"
)
# Rampa de volume curta no começo e no fim (o fim é feito com o áudio invertido, sem precisar saber a duração).
FILTRO_RAMPAS = ",afade=t=in:d=0.015,areverse,afade=t=in:d=0.06,areverse"
TICKS = 1e7  # o serviço mede o tempo em unidades de 100 ns
MAX_CARACTERES_PEDIDO = 1200
SILENCIO_MAXIMO = 20  # segundos sem nenhuma mensagem do serviço: o pedido é dado como perdido


class FrasesNaoBatem(Exception):
    """As frases que o serviço devolveu não correspondem às falas do lote."""


def palavras(texto: str):
    return re.findall(r"[\w'-]+", texto)


def _limpa(t: str) -> str:
    return re.sub(r"[^\w]+", "", t).lower()


class Conexao:
    """Uma conexão WebSocket com o serviço, reaproveitada pedido após pedido (reabre sozinha se cair)."""

    def __init__(self):
        self.sessao = None
        self.ws = None

    async def _abrir(self):
        await self.fechar()
        self.sessao = aiohttp.ClientSession(trust_env=True, timeout=aiohttp.ClientTimeout(total=None, connect=20, sock_read=60))
        self.ws = await self.sessao.ws_connect(
            f"{WSS_URL}&ConnectionId={_edge.connect_id()}"
            f"&Sec-MS-GEC={DRM.generate_sec_ms_gec()}&Sec-MS-GEC-Version={SEC_MS_GEC_VERSION}",
            compress=15,
            headers=DRM.headers_with_muid(WSS_HEADERS),
            ssl=_edge._SSL_CTX,
        )
        await self.ws.send_str(
            f"X-Timestamp:{_edge.date_to_string()}\r\n"
            "Content-Type:application/json; charset=utf-8\r\n"
            "Path:speech.config\r\n\r\n"
            '{"context":{"synthesis":{"audio":{"metadataoptions":{'
            '"sentenceBoundaryEnabled":"true","wordBoundaryEnabled":"true"},'
            '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n'
        )

    async def fechar(self):
        if self.ws is not None:
            await self.ws.close()
        if self.sessao is not None:
            await self.sessao.close()
        self.ws = self.sessao = None

    async def sintetizar(self, texto: str, voz: str, ritmo: str, tom: str):
        """texto -> (bytes MP3, marcas). Marcas: {"tipo": "SentenceBoundary"|"WordBoundary", "inicio", "duracao", "texto"},
        tempos em segundos a partir do começo do áudio deste pedido."""
        if self.ws is None or self.ws.closed:
            await self._abrir()
        try:
            return await self._pedido(texto, voz, ritmo, tom)
        except BaseException:
            # Estado incerto (inclusive o cancelamento do tempo limite, que não é Exception): a próxima tentativa abre
            # outra conexão. Antes, depois de um tempo limite, a nova tentativa ia pela mesma conexão e o serviço mandava
            # os dois pedidos intercalados: a fala saía repetida frase a frase e a sobra caía no pedido seguinte.
            await self.fechar()
            raise

    async def _pedido(self, texto, voz, ritmo, tom):
        # Língua da própria voz (pt-BR, pt-PT): com en-US a voz multilíngue fala palavras curtas com som de inglês.
        lingua = "-".join(voz.split("-")[:2])
        ssml = (
            f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{lingua}'>"
            f"<voice name='{voz}'><prosody pitch='{tom}' rate='{ritmo}' volume='+0%'>"
            f"{escape(_edge.remove_incompatible_characters(texto))}</prosody></voice></speak>"
        )
        pedido = _edge.connect_id()
        meu = f"X-RequestId:{pedido}".encode()
        await self.ws.send_str(_edge.ssml_headers_plus_data(pedido, _edge.date_to_string(), ssml))
        pedacos, marcas = [], []
        while True:
            # Desiste só se o serviço ficar SILENCIO_MAXIMO sem mandar nada: um lote grande com o serviço lento leva mais
            # de um minuto, mas continua chegando (com um limite total, o lote estourava sempre e nunca terminava).
            try:
                msg = await asyncio.wait_for(self.ws.receive(), SILENCIO_MAXIMO)
            except asyncio.TimeoutError:
                raise RuntimeError(f"o serviço ficou {SILENCIO_MAXIMO} s sem responder") from None
            if msg.type == aiohttp.WSMsgType.TEXT:
                bruto = msg.data.encode("utf-8")
                fim_cabecalho = bruto.find(b"\r\n\r\n")
                if meu not in bruto[:fim_cabecalho]:
                    continue  # resto de um pedido anterior nesta conexão
                cabecalho, dados = _edge.get_headers_and_data(bruto, fim_cabecalho)
                caminho = cabecalho.get(b"Path")
                if caminho == b"audio.metadata":
                    for m in json.loads(dados)["Metadata"]:
                        if m["Type"] in ("SentenceBoundary", "WordBoundary"):
                            d = m["Data"]
                            marcas.append({"tipo": m["Type"], "inicio": d["Offset"] / TICKS, "duracao": d["Duration"] / TICKS, "texto": unescape(d["text"]["Text"])})
                elif caminho == b"turn.end":
                    break
            elif msg.type == aiohttp.WSMsgType.BINARY:
                tamanho = int.from_bytes(msg.data[:2], "big")
                if meu not in msg.data[: tamanho + 2]:
                    continue  # resto de um pedido anterior nesta conexão
                cabecalho, dados = _edge.get_headers_and_data(msg.data, tamanho)
                if cabecalho.get(b"Content-Type") == b"audio/mpeg" and dados:
                    pedacos.append(dados)
            else:
                raise RuntimeError(f"conexão encerrada pelo serviço antes do fim do áudio ({msg.type.name})")
        audio = b"".join(pedacos)
        if not audio:
            raise RuntimeError("serviço não devolveu áudio")
        marcas.sort(key=lambda m: m["inicio"])
        return audio, marcas


def finalizar(audio: bytes, recorte=None, rampas=False) -> bytes:
    """Recorta o trecho (início, duração|None) em segundos, corta o silêncio nas pontas e devolve MP3 mono."""
    trecho, saida_trecho = "", []
    if recorte and rampas:
        # Palavra recortada de "Isto é {palavra}.": aqui o -ss/-t age DEPOIS do corte de silêncio do começo, o que leva o
        # corte ~0,1 s para depois da marca do serviço. É assim que a palavra sai sem o fim do "é" ("rede", não "arede").
        saida_trecho = ["-ss", f"{recorte[0]:.3f}", "-t", f"{recorte[1]:.3f}"]
    elif recorte:
        # Fala de um lote: o recorte vem antes do corte de silêncio, no próprio filtro; senão a pausa entre as frases
        # ficava no áudio (~1 s a mais).
        trecho = f"atrim=start={recorte[0]:.3f}" + (f":duration={recorte[1]:.3f}" if recorte[1] is not None else "") + ",asetpts=PTS-STARTPTS,"
    # um recorte no meio de uma palavra cai no meio da onda: sem rampa de volume nas pontas, ouve-se um estalo
    filtro = trecho + FILTRO_SILENCIO + (FILTRO_RAMPAS if rampas else "")
    r = subprocess.run(
        [FFMPEG, "-loglevel", "error", "-i", "pipe:0", *saida_trecho, "-af", filtro, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", "-f", "mp3", "pipe:1"],
        input=audio,
        capture_output=True,
    )
    if r.returncode != 0 or len(r.stdout) < 500:
        raise RuntimeError(f"ffmpeg falhou: {r.stderr.decode(errors='replace')[:200]}")
    return r.stdout


class Voz:
    """Configuração de uma voz: a de src/compartilhado/vozes-narrador.json (lote com "vozes") ou a das opções da linha
    de comando (lote em lista)."""

    def __init__(self, id_voz, voz, voz_curta=None, palavras_curta=4, ritmo="-5%", ritmo_palavra=None, frase_palavra=None, tom="+0Hz"):
        self.id, self.voz, self.voz_curta, self.palavras_curta = id_voz, voz, voz_curta, palavras_curta
        self.ritmo, self.ritmo_palavra, self.frase_palavra, self.tom = ritmo, ritmo_palavra, frase_palavra, tom

    @classmethod
    def do_json(cls, id_voz, v):
        return cls(id_voz, v["voz"], v.get("vozCurta"), v.get("palavrasCurta", 4), v.get("ritmo", "+0%"),
                   v.get("ritmoPalavra"), v.get("frasePalavra"), v.get("tom", "+0Hz"))

    @classmethod
    def das_opcoes(cls, args):
        return cls("", args.voz, args.voz_curta, args.palavras_curta, args.ritmo, args.ritmo_palavra, args.frase_palavra, args.tom)


class Fala:
    """Uma fala do lote, já com a voz, o ritmo e o texto que vai de fato ao serviço."""

    def __init__(self, item, cfg: Voz):
        self.saida = Path(item["saida"])
        self.texto = item["texto"].strip()
        self.id_voz = cfg.id
        self.tom = cfg.tom
        quantas = len(palavras(self.texto))
        self.voz = cfg.voz_curta if cfg.voz_curta and quantas <= cfg.palavras_curta else cfg.voz
        isolada = quantas == 1
        self.ritmo = cfg.ritmo_palavra if cfg.ritmo_palavra and isolada else cfg.ritmo
        # Palavra solta sai traquejada (o "R") nas vozes multilíngues: fala-se dentro de uma frase e recorta-se só a palavra.
        self.em_frase = bool(cfg.frase_palavra and isolada and "{palavra}" in cfg.frase_palavra)
        # "falado": texto dito quando difere do da tela (ver faladoDiferente em gerar-audio-narrador.mjs)
        falado = cfg.frase_palavra.replace("{palavra}", self.texto) if self.em_frase else item.get("falado", self.texto).strip()
        self.falado_sozinho = falado  # pedido de uma fala só: o texto como está
        # No lote, cada fala precisa terminar numa frase completa para o serviço não a emendar na seguinte.
        if not re.search(r"[.!?…]\s*$", falado):
            falado = re.sub(r"[\s,;:]*$", "", falado) + "."
        self.falado = falado

    @property
    def grupo(self):
        return (self.id_voz, self.voz, self.ritmo, self.tom)


def recortes(falas, marcas, total_segundos):
    """Para cada fala do pedido, o trecho (início, duração|None, rampas) dentro do áudio, pelas frases devolvidas."""
    frases = [m for m in marcas if m["tipo"] == "SentenceBoundary"]
    inicios = []
    i = 0
    for fala in falas:
        if i >= len(frases):
            raise FrasesNaoBatem(f"faltam frases para {fala.texto!r}")
        inicios.append(frases[i]["inicio"])
        juntas, alvo = "", _limpa(fala.falado)
        while i < len(frases) and len(juntas) < len(alvo):
            juntas += _limpa(frases[i]["texto"])
            i += 1
        if juntas != alvo:
            raise FrasesNaoBatem(f"{fala.texto!r} saiu como {juntas!r}")
    if i != len(frases):
        raise FrasesNaoBatem("sobraram frases")
    resultado = []
    for n, fala in enumerate(falas):
        inicio = inicios[n]
        fim = inicios[n + 1] - 0.05 if n + 1 < len(falas) else None
        if fala.em_frase:
            alvo = [w for w in marcas if w["tipo"] == "WordBoundary" and inicio - 0.01 <= w["inicio"] < (fim or total_segundos)
                    and _limpa(w["texto"]) == _limpa(fala.texto)]
            if not alvo:
                raise FrasesNaoBatem(f"não achei a palavra {fala.texto!r} na frase")
            w = alvo[-1]
            # folga no fim: palavras curtas ("uma", "duas") têm a duração marcada curta demais e saíam cortadas
            resultado.append((max(0.0, w["inicio"] - 0.03), w["duracao"] + 0.15, True))
        else:
            comeco = max(0.0, inicio - 0.05)
            resultado.append((comeco, None if fim is None else fim - comeco, False))
    return resultado


def conferir_frases(texto, marcas):
    """O áudio de uma fala sozinha tem de trazer exatamente as frases do texto (nem repetidas, nem de outro pedido)."""
    frases = [m for m in marcas if m["tipo"] == "SentenceBoundary"]
    if frases and "".join(_limpa(f["texto"]) for f in frases) != _limpa(texto):
        raise FrasesNaoBatem(f"{texto[:60]!r} saiu como {' | '.join(f['texto'] for f in frases)[:120]!r}")


def evento(args, nome: str, voz: str = ""):
    """Com --eventos, avisa quem chamou ("@feita raquel"); gerar-audio-narrador.mjs desenha a barra com isso."""
    if args.eventos:
        print(f"@{nome} {voz}".rstrip(), flush=True)


def gravar(saida: Path, mp3: bytes):
    saida.parent.mkdir(parents=True, exist_ok=True)
    temporario = saida.with_suffix(".tmp.mp3")
    temporario.write_bytes(mp3)
    temporario.replace(saida)  # só aparece pronto: uma interrupção nunca deixa arquivo pela metade


async def pedido_com_tentativas(conexao, falas, args, estado):
    """Sintetiza as falas num pedido só e grava cada uma. Devolve False se as frases não bateram (refazer separadas)."""
    texto = falas[0].falado_sozinho if len(falas) == 1 else " ".join(f.falado for f in falas)
    for tentativa in range(1, args.tentativas + 1):
        try:
            audio, marcas = await asyncio.wait_for(
                conexao.sintetizar(texto, falas[0].voz, falas[0].ritmo, falas[0].tom), timeout=120 + 0.3 * len(texto)  # rede de segurança: quem desiste antes é o SILENCIO_MAXIMO
            )
            if len(falas) == 1 and not falas[0].em_frase:
                conferir_frases(falas[0].falado_sozinho, marcas)
                trechos = [None]  # fala sozinha: o áudio inteiro
            else:
                total = len(audio) * 8 / 48000  # MP3 de 48 kbps constante
                trechos = recortes(falas, marcas, total)
            for fala, trecho in zip(falas, trechos):
                recorte, rampas = (None, False) if trecho is None else (trecho[:2], trecho[2])
                mp3 = await asyncio.to_thread(finalizar, audio, recorte, rampas)
                gravar(fala.saida, mp3)
                estado["feitas"] += 1
                evento(args, "feita", fala.id_voz)
            return True
        except FrasesNaoBatem as erro:
            if len(falas) > 1:
                estado["separadas"] += 1
                return False
            ultimo = erro
        except Exception as erro:  # noqa: BLE001 - qualquer falha de rede/serviço entra na nova tentativa
            ultimo = erro
        if tentativa < args.tentativas:
            evento(args, "nova-tentativa", falas[0].id_voz)
            print(f"  nova tentativa ({tentativa}/{args.tentativas - 1}): {type(ultimo).__name__}: {str(ultimo)[:120]}", flush=True)
            await asyncio.sleep(min(2**tentativa, 30) + random.random())
    for fala in falas:
        estado["falhas"].append((fala.texto, str(ultimo)))
        evento(args, "falha", fala.id_voz)
        print(f"  FALHOU{' (' + fala.id_voz + ')' if fala.id_voz else ''}: {fala.texto[:60]!r}: {ultimo}", flush=True)
    return True


async def trabalhador(fila: asyncio.Queue, args, estado):
    conexao = Conexao()
    try:
        while True:
            try:
                falas = fila.get_nowait()
            except asyncio.QueueEmpty:
                return
            if not await pedido_com_tentativas(conexao, falas, args, estado):
                for fala in falas:  # o serviço dividiu as frases de outro jeito: uma fala por pedido
                    await pedido_com_tentativas(conexao, [fala], args, estado)
    finally:
        await conexao.fechar()


def montar_pedidos(falas, por_pedido):
    """Agrupa as falas por voz e ritmo (um pedido tem uma voz e um ritmo) em pedidos de até `por_pedido` falas."""
    grupos = {}
    pedidos = []
    for f in falas:
        if f.em_frase:
            pedidos.append([f])  # palavra recortada de uma frase: sempre sozinha (no lote saía com o "a" do "é")
        else:
            grupos.setdefault(f.grupo, []).append(f)
    for lista in grupos.values():
        atual, caracteres = [], 0
        for f in lista:
            if atual and (len(atual) >= por_pedido or caracteres + len(f.falado) > MAX_CARACTERES_PEDIDO):
                pedidos.append(atual)
                atual, caracteres = [], 0
            atual.append(f)
            caracteres += len(f.falado) + 1
        if atual:
            pedidos.append(atual)
    return pedidos


def intercalar(listas):
    """[[a1, a2, a3], [b1]] -> [a1, b1, a2, a3]: as vozes andam juntas e, quando uma acaba, as conexões ficam com a outra."""
    resultado = []
    for i in range(max((len(l) for l in listas), default=0)):
        resultado.extend(l[i] for l in listas if i < len(l))
    return resultado


async def principal(args):
    lote = json.loads(Path(args.lote).read_text(encoding="utf-8"))
    if isinstance(lote, list):  # uma voz, das opções da linha de comando
        if not args.voz:
            sys.exit("--voz é obrigatório quando o lote é uma lista de falas")
        vozes = {"": Voz.das_opcoes(args)}
        itens = [{**item, "voz": ""} for item in lote]
    else:  # {"vozes": {id: config de vozes-narrador.json}, "falas": [{"voz": id, ...}]}: todas dividem as conexões
        vozes = {i: Voz.do_json(i, v) for i, v in lote["vozes"].items()}
        itens = lote["falas"]
    estado = {"feitas": 0, "puladas": 0, "separadas": 0, "falhas": [], "total": len(itens)}
    por_voz = {i: [] for i in vozes}
    for item in itens:
        saida = Path(item["saida"])
        if saida.exists() and saida.stat().st_size >= 500:
            estado["puladas"] += 1
            evento(args, "pulada", item["voz"])
        else:
            por_voz[item["voz"]].append(Fala(item, vozes[item["voz"]]))
    fila = asyncio.Queue()
    for p in intercalar([montar_pedidos(f, max(1, args.frases_por_pedido)) for f in por_voz.values()]):
        fila.put_nowait(p)
    await asyncio.gather(*(trabalhador(fila, args, estado) for _ in range(max(1, args.paralelo))))
    print(
        f"{estado['feitas']} geradas, {estado['puladas']} já existiam, {len(estado['falhas'])} falharam"
        + (f", {estado['separadas']} lote(s) refeitos fala a fala" if estado["separadas"] else ""),
        flush=True,
    )
    return 1 if estado["falhas"] else 0


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--voz", default=None, help="voz do lote em lista (o lote com \"vozes\" traz a configuração de cada voz)")
    p.add_argument("--lote", required=True)
    p.add_argument("--voz-curta", default=None)
    p.add_argument("--palavras-curta", type=int, default=4)
    p.add_argument("--ritmo", default="-5%")
    p.add_argument("--ritmo-palavra", default=None, help="ritmo de uma palavra isolada (mais lento, para quem aprende a ler)")
    p.add_argument("--frase-palavra", default=None, help="frase com {palavra}: a palavra isolada é falada nela e recortada")
    p.add_argument("--tom", default="+0Hz")
    p.add_argument("--paralelo", type=int, default=8, help="conexões abertas ao mesmo tempo (divididas entre as vozes)")
    p.add_argument("--frases-por-pedido", type=int, default=8, help="falas por pedido ao serviço (1 = sem lote)")
    p.add_argument("--tentativas", type=int, default=6)
    p.add_argument("--eventos", action="store_true", help="imprime @feita/@falha/... por fala (para a barra de progresso)")
    sys.exit(asyncio.run(principal(p.parse_args())))
