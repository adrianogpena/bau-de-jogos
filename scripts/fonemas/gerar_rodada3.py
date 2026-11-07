"""Rodada 3 da validação de fonemas pt-BR (voz Faber): confere as regras da rodada 2 e testa os casos ainda sem solução
(docs/VALIDACAO-FONEMAS.md). Cada item tem 2 a 4 versões de áudio (A, B, C, D) e a pessoa escolhe a melhor.

  $PIPER_PYTHON scripts/fonemas/gerar_rodada3.py
  python scripts/fonemas/servir_validacao.py validacao-rodada3      # abre em http://localhost:5198/

Saída (fora do git): referencias-fonemas/validacao-rodada3/index.html, dados.json e audio/*.mp3.
O grupo 0 usa textos reais do site (referencias-fonemas/frases-todas-pt-BR.json, de extrair-palavras.mjs); as frases dos
outros grupos são novas, só para o teste (não entram no site).

Diferença da rodada 2: a versão testada troca a palavra depois de todas as correções do app (trocas por palavra,
R_GRUPO, R_FIM_DE_SILABA). Assim uma versão como «dɾ simples» não é desfeita pelas regras."""
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
SAIDA = PASTA / "validacao-rodada3"

fonte = (RAIZ / "scripts" / "piper_falar.py").read_text(encoding="utf-8").split("modelo = sys.argv[1]")[0]
ns = {"__name__": "piper_falar"}
exec(compile(fonte, "piper_falar.py", "exec"), ns)
from piper import PiperVoice  # noqa: E402

NFD = lambda s: unicodedata.normalize("NFD", s)  # noqa: E731
NFC = lambda s: unicodedata.normalize("NFC", s)  # noqa: E731
TOKEN = r"[\wÀ-ÿ'-]+"
VOGAL = "aeiouɛɔɐɪʊ"
PONT = ns["PONTUACAO"]
ORIGINAL = {k: ns[k] for k in ("corrigir_fonemas", "reforcar_r", "ajuste_palavra_solta")}


# ---------- mudanças nos fonemas da palavra testada (recebem os fonemas finais do app, em NFD) ----------
def o_longo(f):  # "o" tônico longo
    return re.sub(r"ˈo(?![ːɪʊ])", "ˈoː", f, count=1)


def consoante_dobrada(f):  # a consoante depois do "o"/"ɛ" tônico, dobrada (bb, vv, ɾɾ...)
    return re.sub(r"(ˈ[oɛ]ː?)([bvsdɡkptɾ])(?!\2)", r"\1\2\2", f, count=1)


def final_pleno(f):  # vogal final reduzida vira plena
    return re.sub(r"[ʊɐɪ]$", lambda m: {"ʊ": "o", "ɐ": "a", "ɪ": "i"}[m.group()], f)


def e_fechado(f):
    return f.replace("ɛ", "e", 1)


def e_acento_fraco(f):
    return f.replace("ˈɛ", "ˌɛ", 1)


def grupo_simples(f):  # "ɾɾ" do grupo (dɾɾ, bɾɾ) volta a "ɾ"
    return re.sub(r"(?<=[pbtdkɡfv])ɾɾ", "ɾ", f)


def a_pleno_acento(f):  # "ɐ" átono do começo (pa-, ba-) vira "a", com o acento secundário
    return f.replace("ˌɐ", "ˌa", 1)


def a_pleno_sem_acento(f):
    return f.replace("ˌɐ", "a", 1)


def sem_acento_secundario(f):
    return f.replace("ˌɐ", "ɐ", 1)


def r_vogais_longo(f):  # "r" entre vogais: pares, caro
    return re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[ˈˌ]?[" + VOGAL + r"])", "ɾː", f)


def r_vogais_dobrado(f):
    return re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[ˈˌ]?[" + VOGAL + r"])", "ɾɾ", f)


def vogal_depois_r_plena(f):  # a vogal reduzida depois do "r" vira plena (pˈaɾɪz → pˈaɾiz)
    return re.sub(r"(?<=[" + VOGAL + r"]ɾ)[ɪʊɐ]", lambda m: {"ʊ": "u", "ɐ": "a", "ɪ": "i"}[m.group()], f)


def coda_simples(f):  # "r" de fim de sílaba com um "ɾ" só
    return re.sub(r"(?<=[" + VOGAL + r"])ɾɾ(?=[^" + VOGAL + r"ˈˌ])", "ɾ", f)


def coda_dobrada(f):
    return re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[^" + VOGAL + r"ˈˌʲɾː])", "ɾɾ", f)


def primeiro_r_dobrado(f):  # tartaruga: só o primeiro "r"
    return re.sub(r"ɾ(?!ɾ)", "ɾɾ", f, count=1)


def m_dobrado(f):
    return f.replace("m", "mm", 1)


def ch_dobrado(f):
    return f.replace("ʃ", "ʃʃ", 1)


def junta(*fs):
    def g(f):
        for h in fs:
            f = h(f)
        return f
    return g


def secundario_dor(f):  # dormir: acento secundário no "dor"
    return f.replace("doɾ", "dˌoɾ", 1)


def i_longo(f):
    return f.replace("ˈi", "ˈiː", 1)


def palavra_solta(comprimento):  # ajuste de ritmo da palavra sozinha (pausa antes sempre)
    return (comprimento, True, False, None)


ATUAL = {"rot": "Atual", "desc": "como o app fala hoje"}


# ---------- síntese ----------
def aplicar(voz, texto, pos=None, muda=None, ajuste=None, sem_regras=False):
    """Põe os remendos em `ns` (o mesmo código que piper_falar.py roda) e devolve uma função que os tira."""
    if sem_regras:
        ns["reforcar_r"] = lambda f: f
        ns["ajuste_palavra_solta"] = lambda t: None
    if ajuste is not None:
        ns["ajuste_palavra_solta"] = lambda t: ajuste
    if muda is not None:
        cont = [0]

        def corrigir(fonemas, pt_br):
            palavras = "".join(ORIGINAL["corrigir_fonemas"](fonemas, pt_br)).split(" ")
            for j, p in enumerate(palavras):
                if cont[0] + j == pos:
                    nucleo = NFD(p.rstrip(PONT))
                    palavras[j] = muda(nucleo) + p[len(p.rstrip(PONT)):]
            cont[0] += len(palavras)
            return list(" ".join(palavras))

        ns["corrigir_fonemas"] = corrigir

    def desfazer():
        ns.update(ORIGINAL)

    return desfazer


def fonemas_finais(voz, texto, **kw):
    desfazer = aplicar(voz, texto, **kw)
    try:
        return [NFC("".join(ns["corrigir_fonemas"](s, True))) for s in voz.phonemize(texto)]
    finally:
        desfazer()


def sintetizar(voz, texto, **kw):
    desfazer = aplicar(voz, texto, **kw)
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
    if v.get("sem_regras"):
        return None
    if "ajuste" in v:
        return v["ajuste"]
    return ns["AJUSTES_PT_BR"].get(texto.strip().lower()) or ns["ajuste_palavra_solta"](texto)


def descrever_ritmo(aj):
    if not aj:
        return "ritmo normal"
    return f"ritmo {aj[0]}" + (", pausa antes" if aj[1] else "")


def item(voz, grupo, palavra, texto, variantes, rotulo=None):
    """Gera os áudios de um item. `palavra` None = o texto todo (grupo 0). Devolve None se o texto não alinha."""
    pos = None
    if palavra is not None:
        toks = [t.lower() for t in re.findall(TOKEN, texto)]
        n_fon = sum(len("".join(s).split(" ")) for s in voz.phonemize(texto))
        if palavra not in toks or len(toks) != n_fon:
            print(f"  pulado (não alinha): {palavra} | {texto}")
            return None
        pos = toks.index(palavra)
    iid = grupo + "-" + hashlib.md5((grupo + "|" + (palavra or "") + "|" + texto + "|" + (rotulo or "")).encode()).hexdigest()[:8]
    saida, vistos = [], []
    for v in variantes:
        kw = {"sem_regras": v.get("sem_regras", False)}
        if "ajuste" in v:
            kw["ajuste"] = v["ajuste"]
        if "muda" in v:
            kw.update(pos=pos, muda=v["muda"])
        fon = fonemas_finais(voz, texto, **kw)
        chave = (tuple(fon), ajuste_efetivo(texto, v))
        if chave in vistos:
            continue  # igual a uma versão anterior: a mudança não se aplica a esta palavra
        vistos.append(chave)
        mostrado = " / ".join(fon) if palavra is None else NFC(" ".join(fon).split(" ")[pos].rstrip(PONT))
        letra = "ABCD"[len(saida)]
        caminho = SAIDA / "audio" / f"{iid}-{letra}.mp3"
        if not caminho.exists():
            gravar(voz, sintetizar(voz, texto, **kw), caminho)
        saida.append({"letra": letra, "rot": v["rot"], "desc": v["desc"], "fon": mostrado, "texto": texto,
                      "ritmo": descrever_ritmo(chave[1]), "audio": f"audio/{caminho.name}"})
    if len(saida) < 2:
        print(f"  pulado (uma versão só): {palavra} | {texto}")
        return None
    return {"id": iid, "palavra": palavra or "", "rotulo": rotulo or palavra, "texto": texto, "variantes": saida}


# ---------- grupo 0: textos do site que mudaram com as regras da rodada 2 ----------
def sortear_textos_do_site(voz):
    textos = json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))
    so_grupo = lambda f: "".join(f)  # noqa: E731

    def com_regra(texto, qual):
        if qual == "grupo":
            ns["reforcar_r"] = lambda f: list(ns["R_GRUPO"].sub("ɾɾ", "".join(f)))
        elif qual == "fim":
            def fim(f):
                pal = "".join(f).split(" ")
                ult = max((i for i, p in enumerate(pal) if p.strip(PONT)), default=-1)
                return list(" ".join(ns["R_FIM_DE_SILABA"].sub("ɾɾ", p) if i != ult else p for i, p in enumerate(pal)))
            ns["reforcar_r"] = fim
        else:
            ns["reforcar_r"] = lambda f: f
        try:
            return [so_grupo(ns["corrigir_fonemas"](s, True)) for s in voz.phonemize(texto)]
        finally:
            ns.update(ORIGINAL)

    por_regra = {"solta": [], "grupo": [], "fim": [], "grupo+fim": []}
    for t in textos:
        if len(t) > 90 or t.strip().lower() in ns["AJUSTES_PT_BR"]:
            continue
        nada = com_regra(t, "nada")
        g = com_regra(t, "grupo") != nada
        f = com_regra(t, "fim") != nada
        if ns["ajuste_palavra_solta"](t):
            por_regra["solta"].append((t, g, f))
        elif g and f:
            por_regra["grupo+fim"].append((t, g, f))
        elif g:
            por_regra["grupo"].append((t, g, f))
        elif f:
            por_regra["fim"].append((t, g, f))
    sorteio = random.Random(3)
    quantos = {"solta": 8, "grupo": 7, "fim": 7, "grupo+fim": 3}
    escolhidos = []
    for regra, n in quantos.items():
        print(f"  {regra}: {len(por_regra[regra])} textos do site mudaram, sorteados {n}")
        escolhidos += [(regra, *x) for x in sorteio.sample(por_regra[regra], n)]
    return escolhidos


def rotulo_regras(regra, g, f):
    partes = []
    if regra == "solta":
        partes.append("palavra sozinha")
    if g:
        partes.append("R_GRUPO")
    if f:
        partes.append("R_FIM_DE_SILABA")
    return " + ".join(partes)


V_REGRAS = [
    {"rot": "Antes das regras", "desc": "sem R_GRUPO, R_FIM_DE_SILABA e ajuste da palavra sozinha", "sem_regras": True},
    ATUAL,
]

# ---------- grupo 1: vogais em palavra sozinha ----------
V_O = [
    ATUAL,
    {"rot": "o longo", "desc": "«o» tônico mais longo (oː): testa se a vogal está curta demais", "muda": o_longo},
    {"rot": "Consoante dobrada", "desc": "a consoante depois do «o» reforçada (bb, vv, ɾɾ...): testa se ela está fraca", "muda": consoante_dobrada},
    {"rot": "Final pleno", "desc": "vogal final plena (ʊ→o, ɐ→a): testa se o final reduzido apaga a consoante", "muda": final_pleno},
]
V_PA = [
    ATUAL,
    {"rot": "a pleno", "desc": "«a» no lugar de «ɐ» na sílaba átona do começo, com acento secundário", "muda": a_pleno_acento},
    {"rot": "a sem acento", "desc": "«a» pleno, sem acento secundário", "muda": a_pleno_sem_acento},
    {"rot": "ɐ sem acento", "desc": "mantém «ɐ», só tira o acento secundário: testa se é o acento", "muda": sem_acento_secundario},
]
V_PEDRA_VOGAL = [
    ATUAL,
    {"rot": "e fechado", "desc": "«ê» no lugar de «é» (errado no pt-BR): testa se o incômodo é a abertura", "muda": e_fechado},
    {"rot": "Ritmo 1.3", "desc": "menos lento (hoje 1.5): testa se a vogal está longa demais", "ajuste": palavra_solta(1.3)},
    {"rot": "Ritmo normal", "desc": "ritmo normal (1.15), com a pausa antes: vogal mais curta ainda", "ajuste": palavra_solta(ns["CONFIG"].length_scale)},
]
V_PEDRA_RESTO = [
    ATUAL,
    {"rot": "dɾ simples", "desc": "sem o «ɾɾ» do grupo: testa se o «r» reforçado separa «pé-dra»", "muda": grupo_simples},
    {"rot": "a final", "desc": "«a» pleno no fim (ɐ→a)", "muda": final_pleno},
    {"rot": "Tônica fraca", "desc": "«é» com acento secundário (ˌ): testa se a tônica está forte demais", "muda": e_acento_fraco},
]
V_PEDRA_FRASE = [
    ATUAL,
    {"rot": "e fechado", "desc": "«ê» no lugar de «é»: testa a abertura", "muda": e_fechado},
    {"rot": "dɾ simples", "desc": "sem o «ɾɾ» do grupo", "muda": grupo_simples},
    {"rot": "a final", "desc": "«a» pleno no fim (ɐ→a)", "muda": final_pleno},
]
V_LEBRE = [
    ATUAL,
    {"rot": "e fechado", "desc": "«ê» no lugar de «é»: testa a abertura", "muda": e_fechado},
    {"rot": "bɾ simples", "desc": "sem o «ɾɾ» do grupo", "muda": grupo_simples},
    {"rot": "Ritmo normal", "desc": "ritmo 1.15 com pausa antes: vogal mais curta", "ajuste": palavra_solta(ns["CONFIG"].length_scale)},
]

# ---------- grupo 2: "r" entre vogais (frases novas; a do site é «Encontre os pares iguais!») ----------
R_VOGAIS = [
    ("pares", "Encontre os pares iguais!", "meio (frase do site)"), ("pares", "Os pares de meias estão aqui.", "meio"),
    ("pares", "Ache todos os pares.", "fim"),
    ("caro", "O brinquedo caro quebrou.", "meio"), ("caro", "Esse bolo é caro.", "fim"),
    ("para", "Ela correu para casa.", "meio"), ("para", "O cachorro não para.", "fim"),
    ("hora", "Na hora do lanche, todos comeram.", "meio"), ("hora", "Chegou a hora.", "fim"),
    ("tesouro", "O tesouro brilhava no fundo do mar.", "meio"), ("tesouro", "Eles acharam o tesouro.", "fim"),
    ("agora", "Ele agora quer brincar.", "meio"), ("agora", "Vamos brincar agora.", "fim"),
]
V_R_VOGAIS = [
    ATUAL,
    {"rot": "ɾː", "desc": "«r» mais longo", "muda": r_vogais_longo},
    {"rot": "ɾɾ", "desc": "«r» dobrado", "muda": r_vogais_dobrado},
    {"rot": "Vogal plena", "desc": "a vogal reduzida depois do «r» vira plena (ɪ→i, ʊ→u, ɐ→a): testa se ela engole o «r»", "muda": vogal_depois_r_plena},
]

# ---------- grupo 3: "r" de fim de sílaba na última palavra da frase ----------
R_ULTIMA = [
    ("gordo", "Todo dia pedia para João mostrar o dedo, para ver se ele já estava gordo.", "frase do site"),
    ("gordo", "O gato ficou gordo.", "o"), ("porco", "No sítio tem um porco.", "o"), ("forno", "O pão está no forno.", "o"),
    ("corda", "A menina pulou corda.", "ɔ"), ("perto", "A escola fica perto.", "ɛ"), ("verde", "O sapo é verde.", "e"),
    ("barco", "O menino entrou no barco.", "a"),
]
V_R_ULTIMA = [
    ATUAL,
    {"rot": "ɾ simples", "desc": "um «ɾ» só (como o espeak gera)", "muda": coda_simples},
    {"rot": "ɾɾ", "desc": "«r» dobrado", "muda": coda_dobrada},
]

# ---------- grupo 4: casos soltos ----------
V_FORMIGA = [
    ATUAL,
    {"rot": "ɾ simples", "desc": "um «ɾ» só antes do «m»: testa se o «ɾɾ» puxa o «m» para «n»", "muda": coda_simples},
    {"rot": "ɾɾ + mm", "desc": "«m» dobrado, mantendo o «ɾɾ»", "muda": m_dobrado},
    {"rot": "ɾ simples + mm", "desc": "um «ɾ» só e «m» dobrado", "muda": junta(coda_simples, m_dobrado)},
]
V_TARTARUGA_SO = [
    ATUAL,
    {"rot": "ɾɾ", "desc": "primeiro «r» dobrado (tarr-ta-ru-ga)", "muda": primeiro_r_dobrado},
    {"rot": "Ritmo 1.3", "desc": "mais lento (hoje 1.15, por ter 4 sílabas)", "ajuste": palavra_solta(1.3)},
    {"rot": "ɾɾ + ritmo 1.3", "desc": "os dois juntos", "muda": primeiro_r_dobrado, "ajuste": palavra_solta(1.3)},
]
V_TARTARUGA_FRASE = [
    ATUAL,
    {"rot": "ɾ simples", "desc": "sem o «ɾɾ» da regra R_FIM_DE_SILABA", "muda": coda_simples},
]
V_FINAL_A = [ATUAL, {"rot": "a final", "desc": "«a» pleno no fim da última palavra (ɐ→a)", "muda": final_pleno}]
FINAL_A = [
    ("caixa", "O gato ficou dentro da caixa."), ("caixa", "Guarde o brinquedo na caixa."),
    ("casa", "Ela voltou para casa."), ("mesa", "O livro está na mesa."), ("bola", "O menino chutou a bola."),
    ("janela", "Abra a janela."),
]
V_DORMIR = [
    ATUAL,
    {"rot": "Acento no «dor»", "desc": "acento secundário em «dor»: dá mais tempo à primeira sílaba", "muda": secundario_dor},
    {"rot": "i longo", "desc": "«i» tônico mais longo", "muda": i_longo},
    {"rot": "ɾɾ no «dor»", "desc": "«r» de «dor» dobrado", "muda": coda_dobrada},
]
V_BRUXA = [
    ATUAL,
    {"rot": "ʃʃ", "desc": "«x» (ʃ) dobrado", "muda": ch_dobrado},
    {"rot": "a final", "desc": "«a» pleno no fim (ɐ→a)", "muda": final_pleno},
    {"rot": "ʃʃ + a final", "desc": "os dois juntos", "muda": junta(ch_dobrado, final_pleno)},
]


def main():
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)
    sozinha = lambda p: p[0].upper() + p[1:]  # noqa: E731
    g0 = [item(voz, "regras", None, t, V_REGRAS, rotulo_regras(r, g, f)) for r, t, g, f in sortear_textos_do_site(voz)]
    g1 = (
        [item(voz, "vogais", p, sozinha(p), V_O, f"{p} (o fechado)") for p in ["lobo", "ovo", "porco", "osso", "sopa", "boca"]]
        + [item(voz, "vogais", p, sozinha(p), V_PA, f"{p} (ɐ átono)") for p in ["panela", "banana", "caneta", "janela"]]
        + [item(voz, "vogais", "pedra", "Pedra", V_PEDRA_VOGAL, "pedra (vogal)"),
           item(voz, "vogais", "pedra", "Pedra", V_PEDRA_RESTO, "pedra (dɾ, final, tônica)"),
           item(voz, "vogais", "pedra", "Ele achou uma pedra bonita.", V_PEDRA_FRASE, "pedra (na frase)"),
           item(voz, "vogais", "lebre", "Lebre", V_LEBRE, "lebre (como pedra)")]
    )
    g2 = [item(voz, "r_vogais", p, t, V_R_VOGAIS, f"{p} ({onde})") for p, t, onde in R_VOGAIS]
    g3 = [item(voz, "r_ultima", p, t, V_R_ULTIMA, f"{p} ({v})") for p, t, v in R_ULTIMA]
    g4 = (
        [item(voz, "soltos", "formiga", "Formiga", V_FORMIGA, "formiga (sozinha)"),
         item(voz, "soltos", "formiga", "A formiga carregou uma folha.", V_FORMIGA, "formiga (na frase)"),
         item(voz, "soltos", "tartaruga", "Tartaruga", V_TARTARUGA_SO, "tartaruga (sozinha)"),
         item(voz, "soltos", "tartaruga", "A tartaruga andou devagar.", V_TARTARUGA_FRASE, "tartaruga (na frase)")]
        + [item(voz, "soltos", p, t, V_FINAL_A, f"{p} (fim da frase)") for p, t in FINAL_A]
        + [item(voz, "soltos", "dormir", t, V_DORMIR, "dormir") for t in ["Hora de dormir.", "O urso foi dormir."]]
        + [item(voz, "soltos", "bruxa", "Bruxa", V_BRUXA, "bruxa (sozinha)"),
           item(voz, "soltos", "bruxa", "A bruxa mexeu o caldeirão.", V_BRUXA, "bruxa (na frase)")]
    )
    grupos = [
        {"id": "regras", "titulo": "0. Conferir as regras novas (textos reais do site)",
         "pergunta": "As regras da rodada 2 (R_GRUPO, R_FIM_DE_SILABA e o ritmo da palavra sozinha) foram aplicadas no site todo sem "
                     "ouvir cada caso. A = antes das regras, B = como o app fala hoje. A coluna da esquerda diz quais regras mudaram o texto.",
         "itens": g0},
        {"id": "vogais", "titulo": "1. Vogais em palavra sozinha",
         "pergunta": "lobo soa «logo», ovo soa «ouvo», o «o» de porco, panela soa «pânela», pedra soa «pédra». Cada versão testa uma "
                     "hipótese (está na descrição). Pedra tem dois itens sozinha e um na frase.",
         "itens": g1},
        {"id": "r_vogais", "titulo": "2. «r» entre vogais",
         "pergunta": "«pares» soou «pais». Frases novas com a palavra no meio e no fim.", "itens": g2},
        {"id": "r_ultima", "titulo": "3. «r» de fim de sílaba na última palavra da frase",
         "pergunta": "«gordo» soou «goudo». Hoje a última palavra fica sem o «ɾɾ». Vale para todas as vogais (o, ɔ, ɛ, e, a)?",
         "itens": g3},
        {"id": "soltos", "titulo": "4. Casos soltos",
         "pergunta": "formiga soa «forniga», tartaruga perde o primeiro «r», «caixa» no fim soa «caix» (e outras palavras terminadas "
                     "em «a» no fim da frase), «dormir» rápido demais, o «x» de bruxa.",
         "itens": g4},
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
<title>Validação de fonemas, rodada 3</title>
<style>
:root{--fg:#1d2330;--bg:#f6f7fb;--card:#fff;--bd:#d9dde8;--a:#b3261e;--n:#146c2e;--ac:#2f5bd8;--av:#8a5a00}
@media(prefers-color-scheme:dark){:root{--fg:#e7e9f0;--bg:#14171f;--card:#1d212c;--bd:#323848;--a:#ff8a80;--n:#7ddf94;--ac:#8fa8ff;--av:#ffcc66}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif;padding:16px}
h1{margin:0 0 4px}h2{margin:28px 0 4px}small{opacity:.7;font-weight:400}
.motivo{margin:0 0 8px;opacity:.85;max-width:900px}
section{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:8px 6px;border-top:1px solid var(--bd);vertical-align:top}
th{border-top:0;font-size:12px;text-transform:uppercase;opacity:.7}
.pal{max-width:150px}.frase{font-size:18px;max-width:280px}mark{background:color-mix(in srgb,var(--ac) 25%,transparent);color:inherit;border-radius:3px;padding:0 2px}
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
<h1>Validação de fonemas, rodada 3</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py validacao-rodada3</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui.</div>
<p>Cada item tem de 2 a 4 versões (A, B, C, D). Cada versão mostra o que muda, os fonemas (da palavra testada, ou do texto todo no grupo 0) e o ritmo. Marque a melhor, «Sem diferença» ou «Nenhum serve», e use a observação para dizer o que soa errado.</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-rodada3/respostas.json</code>. Confira o aviso verde na barra.</p>
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
function exporta(){return {pagina:'validacao-rodada3',salvo:new Date().toISOString(),
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
 a.download='respostas-rodada3-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
elif __name__ == "__main__":
    main()
