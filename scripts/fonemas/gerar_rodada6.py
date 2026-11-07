"""Rodada 6 da validação de fonemas pt-BR (voz Faber): confere as regras da rodada 5 e testa o que ficou sem solução
(docs/VALIDACAO-FONEMAS.md). Cada item tem 2 a 6 versões de áudio (A, B, C...) e a pessoa escolhe a melhor.

  $PIPER_PYTHON scripts/fonemas/gerar_rodada6.py              # --listar: só mostra itens e fonemas, sem gerar áudio
  python scripts/fonemas/servir_validacao.py validacao-rodada6      # abre em http://localhost:5198/

Saída (fora do git): referencias-fonemas/validacao-rodada6/index.html, dados.json e audio/*.mp3.
Os textos vêm do site (referencias-fonemas/frases-todas-pt-BR.json, de extrair-palavras.mjs), menos as frases marcadas
"frase nova", que são só para o teste (não entram no site).

Como nas rodadas 3 a 5, a versão testada troca a palavra depois de todas as correções do app, e a mudança vale para todas
as ocorrências da palavra no texto; uma versão pode mudar outra palavra do texto (`alvo`), a palavra anterior
(`anterior`) ou trocar o texto todo (`texto`). No grupo 0, a versão A roda o scripts/piper_falar.py do commit d1b414d
(antes da rodada 5). Novidade: o item pode mostrar a palavra anterior junto (`junto`, para "sua voz")."""
import hashlib
import html
import json
import random
import re
import subprocess
import sys
import tempfile
import unicodedata
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PASTA = RAIZ / "referencias-fonemas"
SAIDA = PASTA / "validacao-rodada6"
COMMIT_ANTES = "d1b414d"
LISTAR = "--listar" in sys.argv


def carregar(fonte):
    n = {"__name__": "piper_falar"}
    exec(compile(fonte.split("modelo = sys.argv[1]")[0], "piper_falar.py", "exec"), n)
    return n


ns = carregar((RAIZ / "scripts" / "piper_falar.py").read_text(encoding="utf-8"))
ANTES = carregar(subprocess.run(["git", "show", f"{COMMIT_ANTES}:scripts/piper_falar.py"], cwd=RAIZ, capture_output=True,
                                check=True).stdout.decode("utf-8"))
from piper import PiperVoice  # noqa: E402

NFD = lambda s: unicodedata.normalize("NFD", s)  # noqa: E731
NFC = lambda s: unicodedata.normalize("NFC", s)  # noqa: E731
TOKEN = r"[\wÀ-ÿ'-]+"
VOGAL = "aeiouɛɔɐɪʊ"
PONT = ns["PONTUACAO"]
ORIGINAL = {k: ns[k] for k in ("corrigir_fonemas", "reforcar_r", "reforcar_grupo", "ajuste_palavra_solta", "TONICA_R_FINAL",
                               "O_CONSOANTE", "S_GRUPO", "OCLUSIVA_DEPOIS_DE_R", "TROCAS_PALAVRA_PT_BR",
                               "TROCAS_PALAVRA_SOLTA_PT_BR", "TROCAS_ANTES_DE_PT_BR", "TROCAS_TEXTO_PT_BR") if k in ns}
NUNCA = re.compile(r"(?!x)(x)")  # nunca casa; o grupo é para o "\1" das regras
LETRAS = "ABCDEF"
TEXTOS_SITE = [t.strip() for t in json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))]
_r5 = PASTA / "validacao-rodada5" / "respostas.json"
OUVIDOS_RODADA5 = {r["texto"] for r in json.loads(_r5.read_text(encoding="utf-8"))["respostas"]} if _r5.exists() else set()


# ---------- mudanças nos fonemas da palavra testada (recebem os fonemas finais do app, em NFD) ----------
def fixo(fonemas):  # a palavra inteira trocada
    return lambda f: NFD(fonemas)


def mesmo(f):
    return f


def virgula_depois(f):
    return f + ","


def grupo_duplo(f):  # "ɾɾ" no grupo, como em todas as palavras fora de GRUPO_SIMPLES_PT_BR
    return ns["R_GRUPO"].sub("ɾɾ", f)


def nh_nj(f):  # "ɲ" → "nj", como o "ʎ" → "lj"
    return f.replace("ɲ", "nj")


def vogal_antes_nh_longa(f):  # caminhão → kˌamiːɲˈɐ̃ʊ̃
    return re.sub(r"([aeiouɛɔɐ]̃?)(?=ɲ)", r"\1ː", f, count=1)


def a_final_pleno(f):
    return re.sub(r"ɐ$", "a", f)


def tonica_longa(f):
    return re.sub(r"ˈ([aeiouɛɔ]̃?)(?!ː)", r"ˈ\1ː", f, count=1)


S_DEPOIS = r"(?<=s[pbtdkɡfv])"


def s_grupo(novo):
    return lambda f: re.sub(S_DEPOIS + r"ɾɾ(?!ɾ)", novo, f)


def s_grupo_consoante_dobrada(f):  # mestre → mˈɛsttɾɾɪ
    return re.sub(r"(?<=s)([pbtdkɡfv])(?!\1)(?=ɾ)", r"\1\1", f, count=1)


ATUAL = {"rot": "Atual", "desc": "como o app fala hoje"}


# ---------- síntese ----------
def aplicar(posicoes=None, muda=None, anterior=None, ajuste=None, virgula=False):
    """Põe os remendos em `ns` (o mesmo código que piper_falar.py roda) e devolve uma função que os tira."""
    if ajuste is not None:
        ns["ajuste_palavra_solta"] = lambda t: ajuste
    if posicoes is not None:
        cont = [0]

        def corrigir(fonemas, pt_br):
            palavras = "".join(ORIGINAL["corrigir_fonemas"](fonemas, pt_br)).split(" ")
            for j, p in enumerate(palavras):
                if not p:  # o espeak às vezes deixa um espaço no fim ("pˈɛdɾa: ")
                    continue
                if cont[0] in posicoes:
                    nucleo = NFD(p.rstrip(PONT))
                    palavras[j] = (muda or mesmo)(nucleo) + p[len(p.rstrip(PONT)):]
                    if j > 0 and anterior:
                        q = palavras[j - 1]
                        palavras[j - 1] = anterior(NFD(q.rstrip(PONT))) + q[len(q.rstrip(PONT)):]
                    if virgula and j > 0 and not palavras[j - 1].endswith(tuple(PONT)):
                        palavras[j - 1] += ","
                cont[0] += 1
            return list(" ".join(palavras))

        ns["corrigir_fonemas"] = corrigir

    def desfazer():
        ns.update(ORIGINAL)

    return desfazer


def fonemas_finais(voz, texto, antes=False, **kw):
    if antes:
        return [NFC("".join(ANTES["corrigir_fonemas"](s, True))) for s in voz.phonemize(texto)]
    texto = ns["TROCAS_TEXTO_PT_BR"].get(texto, texto)
    desfazer = aplicar(**kw)
    try:
        return [NFC("".join(ns["corrigir_fonemas"](s, True))) for s in voz.phonemize(texto)]
    finally:
        desfazer()


def sintetizar(voz, texto, antes=False, **kw):
    if antes:
        return ANTES["sintetizar"](voz, texto, True)
    desfazer = aplicar(**kw)
    try:
        return ns["sintetizar"](voz, texto, True)
    finally:
        desfazer()


def gravar(voz, pcm, caminho):
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "f.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(voz.config.sample_rate)
            w.writeframes(pcm.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "64k", str(caminho)], check=True)


def ajuste_efetivo(texto, v):
    if "ajuste" in v:
        return v["ajuste"]
    if v.get("antes"):
        return ANTES["AJUSTES_PT_BR"].get(texto.strip().lower()) or ANTES["ajuste_palavra_solta"](texto)
    texto = ns["TROCAS_TEXTO_PT_BR"].get(texto, texto)
    return ns["AJUSTES_PT_BR"].get(texto.strip().lower()) or ns["ajuste_palavra_solta"](texto)


def descrever_ritmo(aj):
    if not aj:
        return "ritmo normal (1.15)"
    return f"ritmo {aj[0]}" + (", pausa antes" if aj[1] else "")


def alinhar(voz, texto):
    """Tokens do texto, se batem um a um com as palavras dos fonemas; senão None."""
    toks = [t.lower() for t in re.findall(TOKEN, texto)]
    n_fon = sum(len("".join(s).split()) for s in voz.phonemize(texto))
    return toks if len(toks) == n_fon else None


def posicoes_de(voz, texto, palavra):
    toks = alinhar(voz, texto)
    if not toks or palavra not in toks:
        return None
    return {i for i, t in enumerate(toks) if t == palavra}


def item(voz, grupo, palavra, texto, variantes, rotulo=None, junto=False):
    """Gera os áudios de um item. `palavra` None = o texto todo; se a palavra se repete, a mudança vale para todas.
    Uma versão pode ter `texto` (outro texto), `alvo` (outra palavra do texto) e `anterior` (muda a palavra de antes).
    `junto` mostra também a palavra anterior nos fonemas de todas as versões.
    Versões iguais a uma anterior (mesmos fonemas e ritmo) ou cujo alvo não está no texto são puladas; o item é pulado
    se o texto não alinha ou se sobra uma versão só."""
    if palavra is not None and posicoes_de(voz, texto, palavra) is None:
        print(f"  pulado (não alinha): {palavra} | {texto}")
        return None
    iid = grupo + "-" + hashlib.md5((grupo + "|" + (palavra or "") + "|" + texto + "|" + (rotulo or "")).encode()).hexdigest()[:8]
    saida, vistos = [], []
    for v in variantes:
        txt = v.get("texto", texto)
        alvo = v.get("alvo", palavra)
        kw = {"antes": v.get("antes", False)}
        if "ajuste" in v:
            kw["ajuste"] = v["ajuste"]
        posicoes = None
        if alvo is not None:
            posicoes = posicoes_de(voz, txt, alvo)
            if posicoes is None:
                continue  # a palavra desta versão não está no texto
        if any(k in v for k in ("muda", "anterior", "virgula")):
            kw.update(posicoes=posicoes, muda=v.get("muda"), anterior=v.get("anterior"), virgula=v.get("virgula", False))
        fon = fonemas_finais(voz, txt, **kw)
        chave = (tuple(fon), ajuste_efetivo(txt, v))
        if chave in vistos:
            continue  # igual a uma versão anterior: a mudança não se aplica a esta palavra
        vistos.append(chave)
        if alvo is None:
            mostrado = " / ".join(fon)
        else:
            pal = " ".join(fon).split()
            ini = min(posicoes)
            if junto and alvo != palavra:  # a versão mexe na palavra anterior: mostra as duas a partir dela
                ini = min(posicoes_de(voz, txt, palavra))
            ver_antes = v.get("virgula") or v.get("anterior") or junto
            depois = v.get("mostra_pont") or v.get("depois")
            fim = ini + (2 if v.get("depois") else 1)
            trecho = " ".join(pal[max(ini - 1, 0) if ver_antes else ini: fim])
            mostrado = NFC(trecho if depois or ver_antes else trecho.rstrip(PONT))
        letra = LETRAS[len(saida)]
        caminho = SAIDA / "audio" / f"{iid}-{letra}.mp3"
        if not LISTAR and not caminho.exists():
            gravar(voz, sintetizar(voz, txt, **kw), caminho)
        desc = v["desc"] + (f" — texto: «{txt}»" if txt != texto else "")
        saida.append({"letra": letra, "rot": v["rot"], "desc": desc, "fon": mostrado, "texto": txt,
                      "ritmo": descrever_ritmo(chave[1]), "audio": f"audio/{caminho.name}"})
    if len(saida) < 2:
        print(f"  pulado (uma versão só): {palavra} | {texto}")
        return None
    return {"id": iid, "palavra": palavra or "", "rotulo": rotulo or palavra, "texto": texto, "variantes": saida}


# ---------- grupo 0: textos do site que mudaram com as regras da rodada 5 ----------
def sem_chaves(tabela, *chaves):
    tirar = {NFD(c) if isinstance(c, str) else tuple(NFD(x) for x in c) for c in chaves}
    return {tabela: {k: v for k, v in ORIGINAL[tabela].items() if k not in tirar}}


def grupo_antigo(p):  # R_GRUPO como era antes da rodada 5 (dobrar_grupo): "ɾ" simples entre vogais antes da tônica
    def dobrar(m):
        antes, depois = m.string[: m.start()], m.string[m.end():]
        return "ɾ" if len(antes) >= 2 and antes[-2] in VOGAL + "̃" and "ˈ" in depois else "ɾɾ"
    return ns["R_GRUPO"].sub(dobrar, p)


REGRAS = {
    "OCLUSIVA_DEPOIS_DE_R": {"OCLUSIVA_DEPOIS_DE_R": NUNCA},
    "S_GRUPO": {"S_GRUPO": NUNCA},
    "R_GRUPO «ɾɾ» de volta": {"reforcar_grupo": grupo_antigo},
    "TONICA_R_FINAL sem «o»": {"TONICA_R_FINAL": re.compile(r"ˈ([aeiouɛɔ])ɾ(?=[" + re.escape(PONT) + r"]*$)")},
    "Goblin": sem_chaves("TROCAS_PALAVRA_PT_BR", "ɡoblˈĩn", "ɡoblˈĩm"),
    "chave": sem_chaves("TROCAS_PALAVRA_PT_BR", "ʃˈavɪ", "ʃˈavj"),
    "esfregou/rastro": sem_chaves("TROCAS_PALAVRA_PT_BR", "ˌesfɾeɡˈow", "xˈastɾʊ"),
    "tartaruga sozinha": sem_chaves("TROCAS_PALAVRA_SOLTA_PT_BR", "tˌaɾtaɾˈuɡɐ"),
    "De repente": {"TROCAS_ANTES_DE_PT_BR": {}},
    "título da tartaruga": {"TROCAS_TEXTO_PT_BR": {}},
}


def fonemas_app(voz, texto):
    texto = ns["TROCAS_TEXTO_PT_BR"].get(texto, texto)
    return ["".join(ns["corrigir_fonemas"](s, True)) for s in voz.phonemize(texto)]


def regras_que_mudaram(voz, texto):
    atual = fonemas_app(voz, texto)
    mudaram = []
    for nome, remendo in REGRAS.items():
        ns.update(remendo)
        try:
            if fonemas_app(voz, texto) != atual:
                mudaram.append(nome)
        finally:
            ns.update(ORIGINAL)
    return mudaram


def palavras_mudadas(voz, texto):
    antes = " ".join(fonemas_finais(voz, texto, antes=True)).split(" ")
    hoje = " ".join(fonemas_finais(voz, texto)).split(" ")
    if len(antes) != len(hoje):
        return " / ".join(fonemas_finais(voz, texto))
    return ", ".join(f"{a.rstrip(PONT)} → {h.rstrip(PONT)}" for a, h in zip(antes, hoje) if a != h)


# Escolhas de propósito: (regra, expressão que o texto deve ter). Entre os textos do site que casam, fica o que mudou
# com menos regras (para não misturar efeitos) e que não foi ouvido na rodada 5.
OBRIGATORIOS = [
    ("OCLUSIVA_DEPOIS_DE_R", r"^O Golem Guardião apareceu!$"),
    ("OCLUSIVA_DEPOIS_DE_R", r"\bacorda\s"),
    ("OCLUSIVA_DEPOIS_DE_R", r"\bacordou\s"),
    ("OCLUSIVA_DEPOIS_DE_R", r"\bparte\s"),
    ("OCLUSIVA_DEPOIS_DE_R", r"\b(mordeu|pergunt\w*|jardim|verdade)\s"),
    ("OCLUSIVA_DEPOIS_DE_R", r"\bperde\s"),
    ("S_GRUPO", r"\bestranha\.$"),
    ("S_GRUPO", r"\b[Ee]strelas!$"),
    ("S_GRUPO", r"\bdistribuir\b"),
    ("S_GRUPO", r"\bmostrava\b"),
    ("S_GRUPO", r"\bconstruir\b"),
    ("R_GRUPO «ɾɾ» de volta", r"\bcobria\b"),
    ("R_GRUPO «ɾɾ» de volta", r"\bagradeceu\b"),
    ("R_GRUPO «ɾɾ» de volta", r"\bdescobriram\b"),
    ("chave", r"^chave inglesa!$"),
    ("chave", r"^Havia uma chave"),
    ("chave", r"^Procure uma chave!$"),
    ("Goblin", r"^O Goblin Chefe$"),
    ("Goblin", r"^«A Pedra da Lua foi roubada"),
    ("De repente", r"^De repente, a porta"),
    ("tartaruga sozinha", r"^tartaruga$"),
    ("título da tartaruga", r"^A Lebre e a Tartaruga$"),
]
QUANTOS = {"R_GRUPO «ɾɾ» de volta": 2}


def sortear_textos_do_site(voz):
    por_regra, regras_de = {}, {}
    for t in TEXTOS_SITE:
        if len(t) > 110 or t.lower() in ns["AJUSTES_PT_BR"]:
            continue
        regras_de[t] = regras_que_mudaram(voz, t)
        for regra in regras_de[t]:
            por_regra.setdefault(regra, []).append(t)
    for chave, lista in sorted(por_regra.items()):
        print(f"  {chave}: {len(lista)} textos do site mudaram")
    escolhidos = []
    for regra, padrao in OBRIGATORIOS:
        candidatos = [t for t in por_regra.get(regra, []) if re.search(padrao, t) and t not in escolhidos]
        candidatos.sort(key=lambda t: (t in OUVIDOS_RODADA5, len(regras_de[t]), len(t)))
        if candidatos:
            escolhidos.append(candidatos[0])
        else:
            print(f"  obrigatório não achado: {regra} {padrao}")
    sorteio = random.Random(60)
    for regra, n in QUANTOS.items():
        resto = sorted(t for t in por_regra.get(regra, []) if t not in escolhidos and t not in OUVIDOS_RODADA5)
        escolhidos += sorteio.sample(resto, min(n, len(resto)))
    return [(t, " + ".join(regras_de[t])) for t in escolhidos]


V_REGRAS = [
    {"rot": "Antes da rodada 5", "desc": f"scripts/piper_falar.py do commit {COMMIT_ANTES}", "antes": True},
    ATUAL,
]
# Exceção do grupo (GRUPO_SIMPLES_PT_BR) em frases ainda não ouvidas: não mudou na rodada 5, então compara com «ɾɾ».
V_EXCECAO = [ATUAL, {"rot": "ɾɾ", "desc": "«ɾɾ» no grupo, como nas outras palavras", "muda": grupo_duplo}]
# TONICA_R_FINAL sem «o»: só a palavra do fim volta a ter a vogal longa (o texto de flor mudou também por outras regras).
V_TONICA = [{"rot": "Antes da rodada 5", "desc": "vogal tônica longa («oː», «ɔː»), só nesta palavra",
             "muda": lambda f: re.sub(r"ˈ([oɔ])ɾ$", r"ˈ\1ːɾ", f)}, ATUAL]
TONICA = [
    ("flor", "Elas encolhem e a porta fica livre, sem estragar nenhuma flor."),
    ("melhor", "— São para ver você melhor!"),
    ("tambor", "— Você pode tocar tambor!"),
]
EXCECAO = [
    ("soprou", "O lobo soprou com toda a força, mas a casa de tijolo nem se mexeu."),
    ("abriu", "Com o barulho, uma planta comilona acordou e abriu a boca enorme!"),
]

# ---------- grupo 1: «nh» (caminhão «canião») ----------
V_NH = [
    ATUAL,
    {"rot": "ɲ → nj", "desc": "o «nh» como «n» + «j», como o «lh» já é «l» + «j»", "muda": nh_nj},
    {"rot": "Vogal longa antes do «nh»", "desc": "a vogal antes do «nh» longa (o «iː» do «mi» de caminhão)", "muda": vogal_antes_nh_longa},
    {"rot": "ɲ → nj + ritmo 1.5", "desc": "«nj» e a palavra mais lenta", "muda": nh_nj, "ajuste": (1.5, True, False, None)},
]
NH = ["caminhão", "Montanha", "joaninha!", "minhoca!", "porquinho"]

# ---------- grupo 2: Clara e Amara ----------
V_CLARA = [
    ATUAL,
    {"rot": "klˈaɾa", "desc": "«a» final pleno", "muda": a_final_pleno},
    {"rot": "klˈaːɾɐ", "desc": "«a» tônico longo", "muda": tonica_longa},
    {"rot": "Vírgula depois", "desc": "pausa curta depois do nome", "muda": virgula_depois, "mostra_pont": True},
]
V_AMARA = V_CLARA + [{"rot": "ˌamˈaɾa", "desc": "os dois «a» átonos plenos", "muda": lambda f: a_final_pleno(f.replace("ˌɐ", "ˌa"))}]
V_AMARA[1] = {**V_AMARA[1], "rot": "ˌɐmˈaɾa"}
V_AMARA[2] = {**V_AMARA[2], "rot": "ˌɐmˈaːɾɐ"}
CLARA = [
    ("clara", "O que Clara quer fazer?", "meio, antes de consoante", V_CLARA),
    ("clara", "O Chefe da vila chama Clara até a praça:", "meio, antes de vogal", V_CLARA),
    ("clara", "Clara chega ao rio.", "começo, antes de consoante", V_CLARA),
    ("clara", "Clara entra na floresta escura.", "começo, antes de vogal", V_CLARA),
    ("amara", "O que Amara quer fazer?", "meio, antes de consoante", V_AMARA),
    ("amara", "Amara chega ao rio.", "começo, antes de consoante", V_AMARA),
]

# ---------- grupo 3: Golem ----------
V_GOLEM = [ATUAL] + [{"rot": f, "desc": d, "muda": fixo(f)} for f, d in [
    ("ɡˈɔlẽ", "«em» como «e» nasal só"),
    ("ɡˈolẽ", "«go» fechado e «e» nasal só"),
    ("ɡˈɔlẽɪ", "«e» nasal com «i» curto («lẽi»)"),
]]
GOLEM = [
    "O Golem Guardião apareceu!",
    "O Golem se desfaz em pedrinhas.",
    "À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra:",
]

# ---------- grupo 4: «um» antes de consoante ----------
V_UM = [ATUAL, {"rot": "ũ", "desc": "só a vogal nasal, sem consoante", "muda": fixo("ũ")},
        {"rot": "ũm", "desc": "vogal nasal + «m»", "muda": fixo("ũm")}]
UM = [
    ("um", "Teo risca o ar com o cajado e deixa um rastro de estrelas.", "antes de «r»"),
    ("um", "No fim da tarde, um pássaro viu a tartaruga quase chegando e voou depressa para acordar a lebre:", "antes de «p»"),
    ("um", "Num dia muito quente, um leão enorme tirava um cochilo no meio da floresta.", "antes de «l» e «c»"),
    ("um", "Então apareceu um sapo verde e feio:", "antes de «s»"),
]

# ---------- grupo 5: «sua voz» ----------
V_SUA = [
    ATUAL,
    {"rot": "sˈua", "desc": "«sua» com tônica e «a» pleno", "alvo": "sua", "muda": fixo("sˈua")},
    {"rot": "vˈɔːs", "desc": "«ó» de voz longo", "alvo": "voz", "muda": tonica_longa},
    {"rot": "vˈɔz", "desc": "«z» no fim de voz", "alvo": "voz", "muda": lambda f: re.sub(r"s$", "z", f)},
]
SUA = [
    ("O corvo, todo convencido, quis mostrar sua voz.", "site, fim"),
    ("Se sua voz for tão bela quanto suas penas, você é o rei das aves!", "site, começo"),
    ("— Por que você não leva uma flor para sua avó?", "site, só «sua»"),
]

# ---------- grupo 6: corda, gordo, verde ----------
V_RDD = [
    ATUAL,
    {"rot": "ɾɾɾd", "desc": "«r» triplo e «d» simples", "muda": lambda f: f.replace("ɾɾdd", "ɾɾɾd")},
    {"rot": "ɾɾɾdd", "desc": "«r» triplo e «d» dobrado", "muda": lambda f: f.replace("ɾɾdd", "ɾɾɾdd")},
]
RDD = [
    ("corda", "corda de pular!", "site, começo"),
    ("corda", "Com seus dentes pequenininhos, roeu cada corda da rede, uma por uma, até o leão ficar livre.", "site, meio"),
    ("gordo", "Todo dia pedia para João mostrar o dedo, para ver se ele já estava gordo.", "site, fim"),
    ("gordo", "O gato gordo dormiu no sofá.", "frase nova, meio"),
    ("verde", "Então apareceu um sapo verde e feio:", "site, meio"),
    ("verde", "Depois de muitos dias, viram uma ilha pequena e verde.", "site, fim"),
]

# ---------- grupo 7: «s» + grupo depois da tônica ----------
V_S_DEPOIS = [
    ATUAL,
    {"rot": "ɾɾɾ", "desc": "o «r» do grupo triplo (como rastro)", "muda": s_grupo("ɾɾɾ")},
    {"rot": "Consoante dobrada", "desc": "a consoante do grupo dobrada (ttɾɾ), como S_GRUPO antes da tônica", "muda": s_grupo_consoante_dobrada},
]
S_DEPOIS_ITENS = [
    ("mestre", "O Mestre dos Magos está preocupado:"),
    ("mostra", "O relógio voltou a andar e mostra o número"),
    ("terrestre", "globo terrestre!"),
]

# ---------- grupo 8: frase curta com «.» ou «!» ----------
CURTAS = ["Tente de novo.", "Continue procurando.", "Deixe o sapo entrar.", "Atravesse com equilíbrio.", "Os animais aplaudiram."]


def v_exclamacao(texto):
    return [ATUAL, {"rot": "Exclamação", "desc": "o mesmo texto com «!» (só na fala)", "texto": texto[:-1] + "!"}]


def achar_s_depois(voz):
    """Palavras do site com «s» + grupo depois da tônica (fonemas do app), para completar o grupo 7."""
    achados = {}
    padrao = re.compile(r"ˈ[^ˈˌ]*s[pbtdkɡfv]ɾɾ(?!ɾ)[^ˈ]*$")
    for t in TEXTOS_SITE:
        toks = alinhar(voz, t)
        if not toks or len(t) > 90:
            continue
        for tok, f in zip(toks, " ".join(fonemas_finais(voz, t)).split()):
            if padrao.search(NFD(f.rstrip(PONT))) and tok not in achados:
                achados[tok] = t
    print(f"  «s» + grupo depois da tônica no site: {sorted(achados)}")
    return achados


def main():
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)
    g0 = [item(voz, "regras", None, t, V_REGRAS, f"{regra}: {palavras_mudadas(voz, t)}") for t, regra in sortear_textos_do_site(voz)]
    g0 += [item(voz, "regras", p, t, V_TONICA, f"TONICA_R_FINAL sem «o»: {p}") for p, t in TONICA]
    g0 += [item(voz, "regras", p, t, V_EXCECAO, f"exceção do grupo: {p} (ɾ simples hoje)") for p, t in EXCECAO]
    g1 = [item(voz, "nh", re.findall(TOKEN, t)[0].lower(), t, V_NH, f"{t} (sozinha, site)") for t in NH]
    g2 = [item(voz, "clara", p, t, vs, f"{p.capitalize()} ({onde})") for p, t, onde, vs in CLARA]
    g3 = [item(voz, "golem", "golem", t, V_GOLEM, "Golem (site)") for t in GOLEM]
    g4 = [item(voz, "um", p, t, V_UM, f"um ({onde})") for p, t, onde in UM]
    g5 = [item(voz, "sua", "voz" if "voz" in t else "sua", t, V_SUA, f"sua voz ({onde})", junto=True) for t, onde in SUA]
    g6 = [item(voz, "rdd", p, t, V_RDD, f"{p} ({onde})") for p, t, onde in RDD]
    extras = achar_s_depois(voz)
    s_itens = S_DEPOIS_ITENS + [(p, t) for p, t in sorted(extras.items()) if p not in {x for x, _ in S_DEPOIS_ITENS}
                                and p != "rastro"][:3]
    g7 = [item(voz, "sdepois", p, t, V_S_DEPOIS, f"{p} (site)") for p, t in s_itens]
    g8 = [item(voz, "curta", None, t, v_exclamacao(t), f"{t} (site)") for t in CURTAS]
    grupos = [
        {"id": "regras", "titulo": "0. Conferir as regras da rodada 5 (textos reais do site)",
         "pergunta": "OCLUSIVA_DEPOIS_DE_R no meio da frase, S_GRUPO, a volta do «ɾɾ» no grupo entre vogais, TONICA_R_FINAL sem "
                     "«o» e as trocas (Goblin, chave, «De repente», tartaruga) foram aplicados no site todo sem ouvir cada "
                     f"caso. A = antes da rodada 5 (commit {COMMIT_ANTES}), B = como o app fala hoje. A coluna da esquerda diz "
                     "quais regras mudaram o texto e as palavras que mudaram (antes → hoje). Os 2 últimos itens (soprou, "
                     "abriu) não mudaram: comparam o «ɾ» simples de hoje com o «ɾɾ» em frases ainda não ouvidas.",
         "itens": g0},
        {"id": "nh", "titulo": "1. «nh» em palavra sozinha (caminhão soa «canião»)",
         "pergunta": "Hipótese: o «ɲ» engole a sílaba anterior, como o «ʎ» fazia antes de virar «lj». Não há caminhão em "
                     "frase no site; entram outras palavras sozinhas com «nh». Em palavras de 2 sílabas o ritmo já é 1.5, "
                     "então a última versão some.",
         "itens": g1},
        {"id": "clara", "titulo": "2. Clara e Amara (Clara soa «Clark»)",
         "pergunta": "Hipótese: o «ɐ» final do nome some antes de consoante. Frases com o nome no começo e no meio, antes de "
                     "consoante e de vogal.",
         "itens": g2},
        {"id": "golem", "titulo": "3. Golem",
         "pergunta": "Hoje é «ɡˈɔleɪŋ» (ou «ɡˈɔleɪn» antes de «s»), ainda não ouvido.", "itens": g3},
        {"id": "um", "titulo": "4. «um» antes de consoante",
         "pergunta": "«deixa um rastro» soa «deixa un». O espeak dá «ũn», «ũm» ou «ũŋ» conforme a consoante seguinte. Se a "
                     "frase tem mais de um «um», a mudança vale para todos. Se «ũm» já é o atual, a versão some.",
         "itens": g4},
        {"id": "sua", "titulo": "5. «sua voz»",
         "pergunta": "«quis mostrar sua voz» soa estranho. Hoje «sˌuɐ vˈɔs»; o A_FINAL não se aplica (voz termina em «s»). "
                     "Na frase sem «voz» só existe a versão de «sua».",
         "itens": g5},
        {"id": "rdd", "titulo": "6. corda, gordo, verde («coida»)",
         "pergunta": "Na rodada 5, em «corda de pular!» o «ɾɾɾ» ganhou por pouco do «dd»; gordo e verde empataram. Hoje é "
                     "«ɾɾdd» (OCLUSIVA_DEPOIS_DE_R).",
         "itens": g6},
        {"id": "sdepois", "titulo": "7. «s» + grupo depois da tônica (mestre, mostra...)",
         "pergunta": "Antes da tônica o S_GRUPO dobra a consoante (estragar → esttɾɾ); depois da tônica só rastro foi "
                     "ouvido (ganhou «ɾɾɾ»). Hoje estas palavras têm só «ɾɾ».",
         "itens": g7},
        {"id": "curta", "titulo": "8. Frase curta com «.» ou «!»",
         "pergunta": "Em «Hora de dormir.» a exclamação ajudou. Só para medir: a mesma frase do site com «.» e com «!». A tela "
                     "não mudaria, só a fala (TROCAS_TEXTO_PT_BR).",
         "itens": g8},
    ]
    for g in grupos:
        g["itens"] = [i for i in g["itens"] if i]
        print(f"{g['id']}: {len(g['itens'])} itens")
    if LISTAR:
        for g in grupos:
            print(f"\n== {g['titulo']}")
            for i in g["itens"]:
                print(f"  [{i['rotulo']}] {i['texto']}")
                for v in i["variantes"]:
                    print(f"     {v['letra']}. {v['rot']:<28} {v['fon']}   ({v['ritmo']})")
        return
    usados = {Path(v["audio"]).name for g in grupos for i in g["itens"] for v in i["variantes"]}
    for velho in (SAIDA / "audio").glob("*.mp3"):
        if velho.name not in usados:
            velho.unlink()
    (SAIDA / "dados.json").write_text(json.dumps(grupos, ensure_ascii=False), encoding="utf-8")
    escrever_html(grupos)
    print(f"\n{sum(len(g['itens']) for g in grupos)} itens em {SAIDA / 'index.html'}")


def destacar(texto, palavra):
    m = next((m for m in re.finditer(TOKEN, texto) if m.group().lower() == palavra), None) if palavra else None
    if not m:
        return html.escape(texto)
    return html.escape(texto[: m.start()]) + "<mark>" + html.escape(m.group()) + "</mark>" + html.escape(texto[m.end():])


def escrever_html(grupos):
    partes = []
    for g in grupos:
        linhas = []
        for i in g["itens"]:
            audios = "".join(
                f'<div class="var"><b>{v["letra"]}. {html.escape(v["rot"])}</b> <small>{html.escape(v["desc"])}</small>'
                f'<code>{html.escape(v["fon"])}</code><small class="tx">{html.escape(v["ritmo"])}</small>'
                f'<audio controls preload="none" src="{v["audio"]}"></audio></div>'
                for v in i["variantes"]
            )
            opcoes = [(v["letra"], f'{v["letra"]} é melhor') for v in i["variantes"]] + [("igual", "Sem diferença"), ("nenhum", "Nenhum serve")]
            votos = "".join(f'<label><input type="radio" name="v{i["id"]}" value="{val}"> {rot}</label>' for val, rot in opcoes)
            linhas.append(
                f'<tr data-id="{i["id"]}"><td class="pal"><b>{html.escape(i["rotulo"])}</b></td>'
                f'<td class="frase">{destacar(i["texto"], i["palavra"])}</td><td><div class="vars">{audios}</div></td>'
                f'<td class="voto">{votos}<textarea placeholder="Observação (opcional): o que soa errado?"></textarea></td></tr>'
            )
        partes.append(
            f'<section><h2>{html.escape(g["titulo"])} <small>{len(g["itens"])} itens</small></h2>'
            f'<p class="motivo">{html.escape(g["pergunta"])}</p>'
            f'<table><thead><tr><th>Item</th><th>Texto</th><th>Versões</th><th>Decisão</th></tr></thead>'
            f'<tbody>{"".join(linhas)}</tbody></table></section>'
        )
    itens = [{**i, "grupo": g["id"]} for g in grupos for i in g["itens"]]
    dados = json.dumps(itens, ensure_ascii=False).replace("</", "<\\/")
    (SAIDA / "index.html").write_text(PAGINA.replace("%%SECOES%%", "\n".join(partes)).replace("%%DADOS%%", dados), encoding="utf-8")


PAGINA = """<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Validação de fonemas, rodada 6</title>
<style>
:root{--fg:#1d2330;--bg:#f6f7fb;--card:#fff;--bd:#d9dde8;--a:#b3261e;--n:#146c2e;--ac:#2f5bd8;--av:#8a5a00}
@media(prefers-color-scheme:dark){:root{--fg:#e7e9f0;--bg:#14171f;--card:#1d212c;--bd:#323848;--a:#ff8a80;--n:#7ddf94;--ac:#8fa8ff;--av:#ffcc66}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif;padding:16px}
h1{margin:0 0 4px}h2{margin:28px 0 4px}small{opacity:.7;font-weight:400}
.motivo{margin:0 0 8px;opacity:.85;max-width:900px}
section{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:8px 6px;border-top:1px solid var(--bd);vertical-align:top}
th{border-top:0;font-size:12px;text-transform:uppercase;opacity:.7}
.pal{max-width:180px;word-break:break-word}.frase{font-size:18px;max-width:280px}mark{background:color-mix(in srgb,var(--ac) 25%,transparent);color:inherit;border-radius:3px;padding:0 2px}
.vars{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;min-width:260px}
.var{display:flex;flex-direction:column;gap:2px;font-size:13px}.var code{font:13px ui-monospace,Consolas,monospace;color:var(--n);word-break:break-word}
.var .tx{font-style:italic}
audio{height:34px;width:100%}.voto label{display:block;white-space:nowrap;cursor:pointer}
.voto textarea{width:200px;min-height:44px;margin-top:4px;font:inherit}
tr.respondido{background:color-mix(in srgb,var(--n) 9%,transparent)}tr.nenhum{background:color-mix(in srgb,var(--av) 14%,transparent)}
.barra{position:sticky;top:0;background:var(--bg);padding:8px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;z-index:2;border-bottom:1px solid var(--bd)}
button{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--ac);background:transparent;color:var(--ac);cursor:pointer}
#aviso{font-weight:700}
#bloqueio{background:color-mix(in srgb,var(--a) 18%,transparent);border:2px solid var(--a);border-radius:10px;padding:12px 14px;margin:8px 0;font-size:17px}
</style></head><body>
<h1>Validação de fonemas, rodada 6</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py validacao-rodada6</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui.</div>
<p>Cada item tem de 2 a 6 versões (A, B, C...). Cada versão mostra o que muda, os fonemas (da palavra testada, ou do texto todo nos grupos 0 e 8) e o ritmo. Marque a melhor, «Sem diferença» ou «Nenhum serve», e use a observação para dizer o que soa errado.</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-rodada6/respostas.json</code>. Confira o aviso verde na barra.</p>
<div class="barra"><span id="aviso">Carregando respostas…</span><span id="cont"></span><button id="baixar">Baixar cópia</button></div>
%%SECOES%%
<script>
const DADOS=%%DADOS%%;
const linhas=[...document.querySelectorAll('tbody tr[data-id]')];
const aviso=document.getElementById('aviso');
let est={},pronto=false,sujo=false,timer=null;
function status(t,c){aviso.textContent=t;aviso.style.color=c}
function trava(s){document.querySelectorAll('tr[data-id] input,tr[data-id] textarea').forEach(e=>e.disabled=s)}
function pinta(tr){const r=est[tr.dataset.id]||{};tr.className=r.v==='nenhum'?'nenhum':r.v?'respondido':''}
function mostra(tr){const r=est[tr.dataset.id]||{};pinta(tr);
 tr.querySelectorAll('input').forEach(i=>i.checked=i.value===r.v);tr.querySelector('textarea').value=r.nota||''}
function exporta(){return {pagina:'validacao-rodada6',salvo:new Date().toISOString(),
 respostas:DADOS.map(i=>({...i,voto:(est[i.id]||{}).v||null,nota:(est[i.id]||{}).nota||''}))}}
async function envia(){if(!pronto)return;try{
  const r=await fetch('respostas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(exporta())});
  if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();sujo=false;status('✓ Gravado no disco às '+j.salvo,'var(--n)')
 }catch(e){status('✗ NÃO GRAVADO ('+e.message+'). Não feche a página: rode o servidor de novo e mude qualquer resposta.','var(--a)')}}
function grava(){sujo=true;cont();status('Gravando…','var(--av)');clearTimeout(timer);timer=setTimeout(envia,400)}
linhas.forEach(tr=>{const id=tr.dataset.id;
 tr.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{est[id]={...(est[id]||{}),v:i.value};pinta(tr);grava();
  if(i.value==='nenhum')tr.querySelector('textarea').focus()}));
 tr.querySelector('textarea').addEventListener('input',e=>{est[id]={...(est[id]||{}),nota:e.target.value};grava()})});
function cont(){const n=Object.values(est).filter(r=>r.v).length;document.getElementById('cont').textContent=n+' de '+linhas.length+' respondidos'}
trava(true);cont();
if(!location.protocol.startsWith('http')){document.getElementById('bloqueio').hidden=false;status('Respostas não são gravadas (página aberta como arquivo).','var(--a)')}
else fetch('respostas',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(j=>{
 (j.respostas||[]).forEach(r=>{if(r.voto||r.nota)est[r.id]={v:r.voto||undefined,nota:r.nota||''}});
 linhas.forEach(mostra);cont();pronto=true;trava(false);
 status(j.salvo?'✓ Respostas carregadas do disco (gravadas em '+new Date(j.salvo).toLocaleString()+')':'✓ Pronto. Nenhuma resposta gravada ainda.','var(--n)')
}).catch(e=>status('✗ Não consegui ler as respostas do servidor ('+e.message+'). Opções travadas para não apagar o arquivo.','var(--a)'));
function agora(){const d=new Date(),p=x=>String(x).padStart(2,'0');return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())}
document.getElementById('baixar').onclick=()=>{const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(exporta(),null,1)],{type:'application/json'}));
 a.download='respostas-rodada6-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
elif __name__ == "__main__":
    main()
