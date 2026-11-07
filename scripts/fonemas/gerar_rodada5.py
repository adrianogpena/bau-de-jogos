"""Rodada 5 da validação de fonemas pt-BR (voz Faber): confere as regras da rodada 4 e testa o que ficou sem solução
(docs/VALIDACAO-FONEMAS.md). Cada item tem 2 a 6 versões de áudio (A, B, C...) e a pessoa escolhe a melhor.

  $PIPER_PYTHON scripts/fonemas/gerar_rodada5.py
  python scripts/fonemas/servir_validacao.py validacao-rodada5      # abre em http://localhost:5198/

Saída (fora do git): referencias-fonemas/validacao-rodada5/index.html, dados.json e audio/*.mp3.
Os textos vêm do site (referencias-fonemas/frases-todas-pt-BR.json, de extrair-palavras.mjs), menos as frases marcadas
"frase nova", que são só para o teste (não entram no site).

Como nas rodadas 3 e 4, a versão testada troca a palavra depois de todas as correções do app, e a mudança vale para todas
as ocorrências da palavra no texto. Novidades: uma versão pode mudar outra palavra do texto (`alvo`), a palavra anterior
(`anterior`) ou trocar o texto todo (`texto`). No grupo 0, a versão A roda o scripts/piper_falar.py do commit 50d48e5
(antes da rodada 4)."""
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
SAIDA = PASTA / "validacao-rodada5"
COMMIT_ANTES = "50d48e5"


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
ORIGINAL = {k: ns[k] for k in ("corrigir_fonemas", "reforcar_r", "dobrar_grupo", "ajuste_palavra_solta", "TONICA_R_FINAL",
                               "O_CONSOANTE", "TROCAS_PALAVRA_PT_BR") if k in ns}  # dobrar_grupo saiu na rodada 5
NUNCA = re.compile(r"(?!x)(x)")  # nunca casa; o grupo é para o "\1" das regras
LETRAS = "ABCDEF"
TEXTOS_SITE = [t.strip() for t in json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))]


# ---------- mudanças nos fonemas da palavra testada (recebem os fonemas finais do app, em NFD) ----------
def fixo(fonemas):  # a palavra inteira trocada
    return lambda f: NFD(fonemas)


def mesmo(f):
    return f


CODA = r"(?<=[" + VOGAL + r"ː])ɾɾ(?=[^" + VOGAL + r"ˈˌʲɾ])"  # "r" de fim de sílaba (já dobrado pelo app)


def coda_simples(f):
    return re.sub(CODA, "ɾ", f)


def coda_tripla(f):
    return re.sub(CODA, "ɾɾɾ", f)


def coda_apoio(f):  # "ɾ" + vogal curta de apoio antes da oclusiva (porta → pˈɔːɾɪtɐ)
    return re.sub(r"(?<=[" + VOGAL + r"ː])ɾɾ?(?=[td])", "ɾɪ", f)


def oclusiva_dobrada(f):  # o "t"/"d" depois do "r" reforçado, como em tartaruga
    return re.sub(r"(?<=ɾ)([td])(?!\1)", r"\1\1", f, count=1)


def sem_longa(f):
    return f.replace("ː", "")


def o_aberto_longo(f):
    return re.sub(r"ˈɔ(?!ː)", "ˈɔː", f, count=1)


def tonica_longa(f):
    return re.sub(r"ˈ([aeiouɛɔ])(?!ː)", r"ˈ\1ː", f, count=1)


def final_pleno(f):
    return re.sub(r"[ʊɐɪ]$", lambda m: {"ʊ": "o", "ɐ": "a", "ɪ": "i"}[m.group()], f)


def a_pleno(f):  # "a" do artigo
    return f.replace("ɐ", "a")


def coda_pretonica_simples(f):  # só o "r" de fim de sílaba antes da tônica (ir-MÃOS, dor-mi-NHO-ca)
    return re.sub(CODA + r"(?=.*ˈ)", "ɾ", f)


S_GRUPO = r"(?<=s[pbtdkɡfv])"


def s_grupo(novo):
    return lambda f: re.sub(S_GRUPO + r"ɾɾ", novo, f)


def s_grupo_consoante_dobrada(f):  # estragar → ˈeːsttɾɾaɡˈaɾ
    return re.sub(r"(?<=s)([pbtdkɡfv])(?=ɾ)", r"\1\1", f, count=1)


def e_inicial_curto(f):  # sem o "ː" da regra de "espelho"
    return re.sub(r"^ˈeː", "ˈe", f)


def virgula_depois(f):
    return f + ","


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


def item(voz, grupo, palavra, texto, variantes, rotulo=None):
    """Gera os áudios de um item. `palavra` None = o texto todo; se a palavra se repete, a mudança vale para todas.
    Uma versão pode ter `texto` (outro texto), `alvo` (outra palavra do texto) e `anterior` (muda a palavra de antes).
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
                continue  # a palavra desta versão não está no texto (ex.: "hora" no controle)
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
            junto = v.get("virgula") or v.get("anterior")
            mostrado = NFC(" ".join(pal[max(ini - 1, 0): ini + 1]) if junto else pal[ini] if v.get("mostra_pont") else pal[ini].rstrip(PONT))
        letra = LETRAS[len(saida)]
        caminho = SAIDA / "audio" / f"{iid}-{letra}.mp3"
        if not caminho.exists():
            gravar(voz, sintetizar(voz, txt, **kw), caminho)
        desc = v["desc"] + (f" — texto: «{txt}»" if txt != texto else "")
        saida.append({"letra": letra, "rot": v["rot"], "desc": desc, "fon": mostrado, "texto": txt,
                      "ritmo": descrever_ritmo(chave[1]), "audio": f"audio/{caminho.name}"})
    if len(saida) < 2:
        print(f"  pulado (uma versão só): {palavra} | {texto}")
        return None
    return {"id": iid, "palavra": palavra or "", "rotulo": rotulo or palavra, "texto": texto, "variantes": saida}


# ---------- grupo 0: textos do site que mudaram com as regras da rodada 4 ----------
def sem_trocas(*palavras):
    """TROCAS_PALAVRA_PT_BR sem as trocas da rodada 4 destas palavras (chaves em NFD)."""
    chaves = {"tartaruga": ["tˌaɾtaɾˈuɡɐ"], "porta": ["pˈɔɾtɐ"], "colher": ["koʎˈeɾ", "kˌoʎeɾzˈiɲɐs"]}
    tirar = {NFD(c) for p in palavras for c in chaves[p]}
    return {"TROCAS_PALAVRA_PT_BR": {k: v for k, v in ORIGINAL["TROCAS_PALAVRA_PT_BR"].items() if k not in tirar}}


REGRAS = {
    "TONICA_R_FINAL": {"TONICA_R_FINAL": NUNCA},
    "R_GRUPO «ɾ» simples": {"dobrar_grupo": lambda m: "ɾɾ"},
    "O_CONSOANTE antes de «o»": {"O_CONSOANTE": re.compile(r"(?<=ˈo)([bvsp])(?!\1)")},
    "tartaruga": sem_trocas("tartaruga"),
    "porta": sem_trocas("porta"),
    "colher": sem_trocas("colher"),
}


def regras_que_mudaram(voz, texto):
    frases = list(voz.phonemize(texto))
    atual = ["".join(ns["corrigir_fonemas"](s, True)) for s in frases]
    mudaram = []
    for nome, remendo in REGRAS.items():
        ns.update(remendo)
        try:
            if ["".join(ns["corrigir_fonemas"](s, True)) for s in frases] != atual:
                mudaram.append(nome)
        finally:
            ns.update(ORIGINAL)
    return mudaram


def palavras_mudadas(voz, texto):
    antes = " ".join(fonemas_finais(voz, texto, antes=True)).split(" ")
    hoje = " ".join(fonemas_finais(voz, texto)).split(" ")
    if len(antes) != len(hoje):
        return ""
    return ", ".join(f"{a.rstrip(PONT)} → {h.rstrip(PONT)}" for a, h in zip(antes, hoje) if a != h)


# Escolhas de propósito: (regra, expressão que o texto deve ter). Primeiro texto do site que casa.
OBRIGATORIOS = [
    ("TONICA_R_FINAL", r"^Você consegue achar\?$"),
    ("TONICA_R_FINAL", r"\bflor[.!?]$"),
    ("TONICA_R_FINAL", r"\blugar[.!?]$"),
    ("R_GRUPO «ɾ» simples", r"descobriram"),
    ("R_GRUPO «ɾ» simples", r"\bcobria\b"),
    ("R_GRUPO «ɾ» simples", r"agradeceu"),
    ("R_GRUPO «ɾ» simples", r"^O chefe dos ladrões"),
    ("tartaruga", r"^tartaruga$"),
    ("tartaruga", r"^a tartaruga estava"),
    ("porta", r"bateu na porta\.$"),
    ("colher", r"^colher$"),
    ("colher", r"^colher de pau"),
]
QUANTOS = {"TONICA_R_FINAL": 6, "R_GRUPO «ɾ» simples": 4, "porta": 2, "O_CONSOANTE antes de «o»": 3}


def sortear_textos_do_site(voz):
    por_regra = {}
    for t in TEXTOS_SITE:
        if len(t) > 100 or t.lower() in ns["AJUSTES_PT_BR"]:
            continue
        for regra in regras_que_mudaram(voz, t):
            por_regra.setdefault(regra, []).append(t)
    for chave, lista in sorted(por_regra.items()):
        print(f"  {chave}: {len(lista)} textos do site mudaram")
    escolhidos = []
    for regra, padrao in OBRIGATORIOS:
        t = next((t for t in por_regra.get(regra, []) if re.search(padrao, t) and t not in escolhidos), None)
        if t:
            escolhidos.append(t)
        else:
            print(f"  obrigatório não achado: {regra} {padrao}")
    sorteio = random.Random(50)
    for regra, n in QUANTOS.items():
        resto = sorted(t for t in por_regra.get(regra, []) if t not in escolhidos)
        escolhidos += sorteio.sample(resto, min(n, len(resto)))
    return [(t, " + ".join(regras_que_mudaram(voz, t))) for t in escolhidos]


V_REGRAS = [
    {"rot": "Antes da rodada 4", "desc": f"scripts/piper_falar.py do commit {COMMIT_ANTES}", "antes": True},
    ATUAL,
]

# ---------- grupo 1: "r" antes de "t"/"d" ----------
V_R_OCLUSIVA = [
    ATUAL,
    {"rot": "Oclusiva dobrada", "desc": "«tt»/«dd» depois do «r», como em tartaruga", "muda": oclusiva_dobrada},
    {"rot": "ɾɾɾ", "desc": "«r» de fim de sílaba triplo", "muda": coda_tripla},
    {"rot": "ɾ + vogal de apoio", "desc": "um «ɾ» só e um «ɪ» curto antes do «t»/«d»", "muda": coda_apoio},
    {"rot": "tt sem ɔː", "desc": "só porta: «tt» com o «ó» curto (como era antes da rodada 4)",
     "muda": lambda f: oclusiva_dobrada(sem_longa(f)) if "ɔː" in f else f},
    {"rot": "ɔː + tt", "desc": "só porta: «ó» longo (atual) e «tt»", "muda": lambda f: oclusiva_dobrada(f) if "ɔː" in f else f},
]
R_OCLUSIVA = [
    ("porta", "À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra:", "site, Golem"),
    ("porta", "A porta bateu e você ficou preso no sótão.", "site, começo"),
    ("porta", "O lobo chegou primeiro e bateu na porta.", "site, fim"),
    ("perto", "A menina chegou mais perto.", "site, fim"),
    ("certa", "Leia a palavra em destaque e escolha a imagem certa.", "site, fim"),
    ("tarde", "Os ladrões entraram e, mais tarde, foram embora.", "site, meio"),
    ("corda", "corda de pular!", "site, começo"),
    ("gordo", "Todo dia pedia para João mostrar o dedo, para ver se ele já estava gordo.", "site, fim"),
    ("verde", "Então apareceu um sapo verde e feio:", "site, meio"),
    ("ordem", "Pense bem na ordem certa!", "site, «r» de ordem fraco"),
]

# ---------- grupo 2: tartaruga ----------
V_TARTARUGA = [
    ATUAL,
    {"rot": "Primário no 1º «ta»", "desc": "acento primário (ˈ) no primeiro «ta», além do «ru»", "muda": lambda f: f.replace("tˌa", "tˈa", 1)},
    {"rot": "aː no 1º «ta»", "desc": "o primeiro «a» mais longo", "muda": lambda f: re.sub(r"^t([ˌˈ]?)a(?!ː)", r"t\1aː", f)},
    {"rot": "Pausa antes", "desc": "vírgula antes da palavra («e a, tartaruga»)", "muda": mesmo, "virgula": True},
    {"rot": "«a» pleno antes", "desc": "o artigo «a» com «a» pleno (ɐ → a)", "anterior": a_pleno},
]
TARTARUGA = [("tartaruga", "sozinha (site)"), ("A Lebre e a Tartaruga", "título (site)")]

# ---------- grupo 3: Goblin ----------
V_GOBLIN = [ATUAL] + [{"rot": f, "desc": d, "muda": fixo(f)} for f, d in [
    ("ɡˈoblĩ", "tônica no «go» fechado, «i» nasal sem consoante"),
    ("ɡˈɔblĩ", "tônica no «gó» aberto"),
    ("ɡˈoblin", "tônica no «go», «in» com «n» (mais perto do inglês)"),
    ("ɡˈoblĩm", "tônica no «go», «i» nasal com «m»"),
]]
GOBLIN = [
    "No fundo da caverna, o Goblin Chefe segura a Pedra da Lua.",
    "O Goblin Chefe apareceu!",
    "O Goblin Chefe continua preso pela magia e perde a vez!",
]

# ---------- grupo 4: "Hora de dormir." ----------
V_DORMIR = [
    ATUAL,
    {"rot": "Ritmo 1.3", "desc": "a frase toda mais lenta", "ajuste": (1.3, False, False, None)},
    {"rot": "ˈɔːɾɐ", "desc": "«ó» de hora longo (dormir já tem a tônica longa)", "alvo": "hora", "muda": o_aberto_longo},
    {"rot": "Exclamação", "desc": "a mesma frase com «!»", "texto": "Hora de dormir!"},
    {"rot": "doɾmˈiːɾ", "desc": "«r» de «dor» simples (hoje «ɾɾ»)", "muda": coda_simples},
]
V_DORMIR_CONTROLE = [{**v, "texto": "O urso foi dormir!"} if v.get("texto") else v for v in V_DORMIR]
DORMIR = [("Hora de dormir.", "frase nova", V_DORMIR), ("O urso foi dormir.", "frase nova, controle", V_DORMIR_CONTROLE)]

# ---------- grupo 5: "r" em grupo depois de "s" ----------
V_S_GRUPO = [
    ATUAL,
    {"rot": "ɾɾɾ", "desc": "o «r» do grupo triplo", "muda": s_grupo("ɾɾɾ")},
    {"rot": "ɾ simples", "desc": "um «ɾ» só no grupo", "muda": s_grupo("ɾ")},
    {"rot": "Consoante dobrada", "desc": "a consoante do grupo dobrada (ttɾɾ, ffɾɾ)", "muda": s_grupo_consoante_dobrada},
    {"rot": "«e» inicial curto", "desc": "sem o «ː» da regra de «espelho»", "muda": e_inicial_curto},
]
S_GRUPO_ITENS = [
    ("estragar", "Elas encolhem e a porta fica livre, sem estragar nenhuma flor."),
    ("esfregou", "Sem querer, Aladim esfregou o anel que usava no dedo..."),
    ("estrela", "O Sol acorda o goblin e a estrela é pequena demais para a fechadura."),
    ("estrelinha", "Teo faz brilhar uma estrelinha no ar."),
    ("mostrar", "O corvo, todo convencido, quis mostrar sua voz."),
    ("rastro", "Teo risca o ar com o cajado e deixa um rastro de estrelas."),
    ("estrondo", "De repente, a porta se fechou com um estrondo!"),
    ("construiu", "Em uma única noite, o gênio construiu um palácio de mármore e ouro."),
]

# ---------- grupo 6: casos soltos ----------
V_CHAVE = [
    ATUAL,
    {"rot": "ʃʃ", "desc": "«ch» dobrado", "muda": lambda f: f.replace("ʃ", "ʃʃ", 1)},
    {"rot": "Final pleno", "desc": "«i» pleno no fim (ɪ → i)", "muda": final_pleno},
    {"rot": "aː", "desc": "«a» tônico mais longo", "muda": tonica_longa},
]
V_DE = [
    ATUAL,
    {"rot": "dʒi", "desc": "«i» pleno", "muda": fixo("dʒi")},
    {"rot": "de", "desc": "«de» com «e» (sem o chiado)", "muda": fixo("de")},
    {"rot": "Pausa depois", "desc": "vírgula depois do «de» (pausa curta)", "muda": virgula_depois, "mostra_pont": True},
]
DE_REPENTE = ["De repente, o chão começou a tremer!", "De repente, o céu ficou escuro.", "De repente, um fantasma aparece rindo:"]
V_SOLTA = [
    ATUAL,
    {"rot": "Ritmo 1.3", "desc": "mais lenta", "ajuste": (1.3, True, False, None)},
    {"rot": "Ritmo 1.5", "desc": "como as palavras de até 2 sílabas", "ajuste": (1.5, True, False, None)},
]
SOLTAS_3_SILABAS = ["caminhão", "Corações", "esfregão!", "Coragem"]
V_FIM_PRETONICA = [ATUAL, {"rot": "ɾ simples", "desc": "um «ɾ» só no «r» antes da tônica (hoje «ɾɾ»)", "muda": coda_pretonica_simples}]
FIM_PRETONICA_FIXOS = ["— disse aos irmãos.", "João e Maria eram irmãos.", "— Acorde, dorminhoca!", "caixa de surpresa!"]
FIM_PRETONICA = re.compile(CODA + r".*ˈ")


def sortear_fim_pretonica(voz, n=4):
    """Textos do site cuja última palavra tem "r" de fim de sílaba antes da tônica (além dos fixos)."""
    achados = []
    for t in TEXTOS_SITE:
        if len(t) > 90 or t in FIM_PRETONICA_FIXOS:
            continue
        toks = alinhar(voz, t)
        if not toks or len(toks) < 2:
            continue
        ultima = NFD(" ".join(fonemas_finais(voz, t)).split()[-1].rstrip(PONT))
        if FIM_PRETONICA.search(ultima):
            achados.append((toks[-1], t))
    print(f"  «r» antes da tônica na última palavra: {len(achados)} textos no site")
    vistos, unicos = set(), []
    for p, t in achados:
        if p not in vistos:
            vistos.add(p)
            unicos.append((p, t))
    return random.Random(51).sample(unicos, min(n, len(unicos)))


def ultima_palavra(voz, texto):
    return alinhar(voz, texto)[-1]


def main():
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)
    g0 = [item(voz, "regras", None, t, V_REGRAS, f"{regra}: {palavras_mudadas(voz, t)}") for t, regra in sortear_textos_do_site(voz)]
    g1 = [item(voz, "oclusiva", p, t, V_R_OCLUSIVA, f"{p} ({onde})") for p, t, onde in R_OCLUSIVA]
    g2 = [item(voz, "tartaruga", "tartaruga", t, V_TARTARUGA, f"tartaruga ({onde})") for t, onde in TARTARUGA]
    g3 = [item(voz, "goblin", "goblin", t, V_GOBLIN, "Goblin (site)") for t in GOBLIN]
    g4 = [item(voz, "dormir", "dormir", t, vs, f"dormir ({onde})") for t, onde, vs in DORMIR]
    g5 = [item(voz, "sgrupo", p, t, V_S_GRUPO, f"{p} (site)") for p, t in S_GRUPO_ITENS]
    g6 = [item(voz, "chave", "chave", "chave de fenda!", V_CHAVE, "chave (site)")]
    g7 = [item(voz, "de", "de", t, V_DE, "De repente (site)") for t in DE_REPENTE]
    g8 = [item(voz, "solta3", None, t, V_SOLTA, f"{t} (sozinha, site)") for t in SOLTAS_3_SILABAS]
    fim = [(ultima_palavra(voz, t), t) for t in FIM_PRETONICA_FIXOS] + sortear_fim_pretonica(voz)
    g9 = [item(voz, "fimpre", p, t, V_FIM_PRETONICA, f"{p} (site)") for p, t in fim]
    grupos = [
        {"id": "regras", "titulo": "0. Conferir as regras da rodada 4 (textos reais do site)",
         "pergunta": "TONICA_R_FINAL, o «ɾ» simples do R_GRUPO entre vogais antes da tônica, as trocas de tartaruga, porta e "
                     "colher e a exceção do O_CONSOANTE foram aplicados no site todo sem ouvir cada caso. A = antes da rodada 4, "
                     "B = como o app fala hoje. A coluna da esquerda diz quais regras mudaram o texto e as palavras que mudaram "
                     "(antes → hoje).",
         "itens": g0},
        {"id": "oclusiva", "titulo": "1. «r» antes de «t»/«d» (porta, perto, tarde...)",
         "pergunta": "Em tartaruga o «tt» ajudou; porta na frase do Golem ainda soa «pôta». Hipótese: o «r» de fim de sílaba "
                     "some antes de consoante oclusiva. As duas últimas versões só existem para porta.",
         "itens": g1},
        {"id": "tartaruga", "titulo": "2. tartaruga",
         "pergunta": "«A Lebre e a Tartaruga» soa «a Lebre e la tataruga»: falta força no primeiro «ta». Todas as versões "
                     "partem da atual (com «tt»).",
         "itens": g2},
        {"id": "goblin", "titulo": "3. Goblin",
         "pergunta": "Hoje é «ɡoblˈĩn» (tônica no «lin»). O «go» deve ser mais fechado, mais perto do inglês.", "itens": g3},
        {"id": "dormir", "titulo": "4. «Hora de dormir.»",
         "pergunta": "Nenhuma versão da rodada 4 serviu (rápida demais). «O urso foi dormir.» é o controle com as mesmas "
                     "versões (menos a de «hora»).",
         "itens": g4},
        {"id": "sgrupo", "titulo": "5. «r» em grupo depois de «s» (estragar, esfregou...)",
         "pergunta": "«estragar» soa «estagar» e «esfregou» soa «esfegou», mesmo com «ɾɾ». A mudança vale só para o grupo "
                     "depois do «s».",
         "itens": g5},
        {"id": "chave", "titulo": "6. «chave de fenda!»",
         "pergunta": "Soa «tchave». O espeak dá «ʃˈavɪ» (o «a» já é pleno e não tem acento secundário), então as versões "
                     "testam o «ch» e as vogais.",
         "itens": g6},
        {"id": "de", "titulo": "7. «De repente,»",
         "pergunta": "O «de» sai fraco («di repente», quase sumindo).", "itens": g7},
        {"id": "solta3", "titulo": "8. Palavra sozinha com 3 sílabas e vogal nasal no fim",
         "pergunta": "«caminhão» sozinha soa um pouco rápida. Hoje só palavras de até 2 sílabas ganham o ritmo 1.5. Se "
                     "1.3 ou 1.5 ganhar, o limite sobe para 3 sílabas.",
         "itens": g8},
        {"id": "fimpre", "titulo": "9. «r» de fim de sílaba antes da tônica na última palavra",
         "pergunta": "Na rodada 4 o «ɾɾ» não ajudou em irmãos/irmão (empate 3, antes 1). Só textos do site.", "itens": g9},
    ]
    for g in grupos:
        g["itens"] = [i for i in g["itens"] if i]
        print(f"{g['id']}: {len(g['itens'])} itens")
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
<title>Validação de fonemas, rodada 5</title>
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
<h1>Validação de fonemas, rodada 5</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py validacao-rodada5</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui.</div>
<p>Cada item tem de 2 a 6 versões (A, B, C...). Cada versão mostra o que muda, os fonemas (da palavra testada, ou do texto todo nos grupos 0 e 8) e o ritmo. Marque a melhor, «Sem diferença» ou «Nenhum serve», e use a observação para dizer o que soa errado.</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-rodada5/respostas.json</code>. Confira o aviso verde na barra.</p>
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
function exporta(){return {pagina:'validacao-rodada5',salvo:new Date().toISOString(),
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
 a.download='respostas-rodada5-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
elif __name__ == "__main__":
    main()
