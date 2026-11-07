"""Rodada 4 da validação de fonemas pt-BR (voz Faber): confere as regras da rodada 3 e testa o que ficou sem solução
(docs/VALIDACAO-FONEMAS.md). Cada item tem 2 a 5 versões de áudio (A, B, C...) e a pessoa escolhe a melhor.

  $PIPER_PYTHON scripts/fonemas/gerar_rodada4.py
  python scripts/fonemas/servir_validacao.py validacao-rodada4      # abre em http://localhost:5198/

Saída (fora do git): referencias-fonemas/validacao-rodada4/index.html, dados.json e audio/*.mp3.
Os grupos 0, 5 e 6 usam textos reais do site (referencias-fonemas/frases-todas-pt-BR.json, de extrair-palavras.mjs); as
frases novas dos outros grupos são só para o teste (não entram no site).

Como na rodada 3, a versão testada troca a palavra depois de todas as correções do app. No grupo 0, a versão A roda o
scripts/piper_falar.py do commit 5bbda3a (antes da rodada 3)."""
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
SAIDA = PASTA / "validacao-rodada4"
COMMIT_ANTES = "5bbda3a"


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
ORIGINAL = {k: ns[k] for k in ("corrigir_fonemas", "reforcar_r", "ajuste_palavra_solta", "R_GRUPO", "A_FINAL",
                               "O_CONSOANTE", "A_ATONO_NASAL")}
NUNCA = re.compile(r"(?!x)(x)")  # nunca casa; o grupo é para o "\1" de O_CONSOANTE
LETRAS = "ABCDEF"


# ---------- mudanças nos fonemas da palavra testada (recebem os fonemas finais do app, em NFD) ----------
def fixo(fonemas):  # a palavra inteira trocada
    return lambda f: NFD(fonemas)


def colher(o, e):  # colher, colherzinhas: troca o "o" de "co" e o "e" de "lher"
    def g(f):
        f = re.sub(r"^k([ˌˈ]?)o", lambda m: "k" + m.group(1) + o, f)
        return re.sub(r"(?<=lj)([ˌˈ]?)[eɛ]", lambda m: m.group(1) + e, f)
    return g


def coda_simples(f):  # "r" de fim de sílaba com um "ɾ" só
    return re.sub(r"(?<=[" + VOGAL + r"])ɾɾ(?=[^" + VOGAL + r"ˈˌ])", "ɾ", f)


def coda_dobrada(f):
    return re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[^" + VOGAL + r"ˈˌʲɾː])", "ɾɾ", f)


def t_dobrado_depois_r(f):  # tartaruga: o "t" depois do "r" reforçado
    return re.sub(r"(?<=ɾ)t(?!t)", "tt", f, count=1)


def sem_secundario(f):
    return f.replace("ˌ", "")


def secundario_no_segundo_ta(f):  # tˌaɾtaɾˈuɡɐ → taɾtˌaɾˈuɡɐ
    return re.sub(r"(?<=ɾ)(t+)a", r"\1ˌa", sem_secundario(f), count=1)


def tonica_longa(f):  # vogal tônica mais longa (iː, aː)
    return re.sub(r"ˈ([aeiouɛɔ])(?!ː)", r"ˈ\1ː", f, count=1)


def o_aberto_longo(f):
    return re.sub(r"ˈɔ(?!ː)", "ˈɔː", f, count=1)


def final_pleno(f):  # vogal final reduzida vira plena
    return re.sub(r"[ʊɐɪ]$", lambda m: {"ʊ": "o", "ɐ": "a", "ɪ": "i"}[m.group()], f)


def grupo_simples(f):  # "ɾɾ" do grupo (pɾɾ, tɾɾ) volta a "ɾ"
    return re.sub(r"(?<=[pbtdkɡfv])ɾɾ", "ɾ", f)


def mesmo(f):
    return f


ATUAL = {"rot": "Atual", "desc": "como o app fala hoje"}


# ---------- síntese ----------
def aplicar(posicoes=None, muda=None, ajuste=None, virgula=False):
    """Põe os remendos em `ns` (o mesmo código que piper_falar.py roda) e devolve uma função que os tira."""
    if ajuste is not None:
        ns["ajuste_palavra_solta"] = lambda t: ajuste
    if muda is not None:
        cont = [0]

        def corrigir(fonemas, pt_br):
            palavras = "".join(ORIGINAL["corrigir_fonemas"](fonemas, pt_br)).split(" ")
            for j, p in enumerate(palavras):
                if not p:  # o espeak às vezes deixa um espaço no fim ("pˈɛdɾa: ")
                    continue
                if cont[0] in posicoes:
                    nucleo = NFD(p.rstrip(PONT))
                    palavras[j] = muda(nucleo) + p[len(p.rstrip(PONT)):]
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


def item(voz, grupo, palavra, texto, variantes, rotulo=None):
    """Gera os áudios de um item. `palavra` None = o texto todo (grupo 0); se a palavra se repete, a mudança vale para
    todas. Devolve None se o texto não alinha ou se sobra uma versão só."""
    posicoes = None
    if palavra is not None:
        toks = alinhar(voz, texto)
        if not toks or palavra not in toks:
            print(f"  pulado (não alinha): {palavra} | {texto}")
            return None
        posicoes = {i for i, t in enumerate(toks) if t == palavra}
    iid = grupo + "-" + hashlib.md5((grupo + "|" + (palavra or "") + "|" + texto + "|" + (rotulo or "")).encode()).hexdigest()[:8]
    saida, vistos = [], []
    for v in variantes:
        kw = {"antes": v.get("antes", False)}
        if "ajuste" in v:
            kw["ajuste"] = v["ajuste"]
        if "muda" in v:
            kw.update(posicoes=posicoes, muda=v["muda"], virgula=v.get("virgula", False))
        fon = fonemas_finais(voz, texto, **kw)
        chave = (tuple(fon), ajuste_efetivo(texto, v))
        if chave in vistos:
            continue  # igual a uma versão anterior: a mudança não se aplica a esta palavra
        vistos.append(chave)
        if palavra is None:
            mostrado = " / ".join(fon)
        else:
            pal = " ".join(fon).split()
            ini = min(posicoes)
            mostrado = NFC(" ".join(pal[max(ini - 1, 0): ini + 1]) if v.get("virgula") else pal[ini].rstrip(PONT))
        letra = LETRAS[len(saida)]
        caminho = SAIDA / "audio" / f"{iid}-{letra}.mp3"
        if not caminho.exists():
            gravar(voz, sintetizar(voz, texto, **kw), caminho)
        saida.append({"letra": letra, "rot": v["rot"], "desc": v["desc"], "fon": mostrado, "texto": texto,
                      "ritmo": descrever_ritmo(chave[1]), "audio": f"audio/{caminho.name}"})
    if len(saida) < 2:
        print(f"  pulado (uma versão só): {palavra} | {texto}")
        return None
    return {"id": iid, "palavra": palavra or "", "rotulo": rotulo or palavra, "texto": texto, "variantes": saida}


# ---------- grupo 0: textos do site que mudaram com as regras da rodada 3 ----------
def reforcar_sem_fim_na_ultima(fonemas):  # reforcar_r de hoje, mas sem R_FIM_DE_SILABA na última palavra (rodada 2)
    palavras = "".join(fonemas).split(" ")
    reais = [i for i, p in enumerate(palavras) if p.strip(PONT)]
    if len(reais) == 1:
        return ORIGINAL["reforcar_r"](fonemas)
    for i, p in enumerate(palavras):
        p = ns["R_GRUPO"].sub("ɾɾ", p)
        if i != reais[-1]:
            p = ns["R_FIM_DE_SILABA"].sub("ɾɾ", p)
        else:
            p = ns["A_FINAL"].sub("a", p)
        palavras[i] = p
    return list(" ".join(palavras))


REGRAS = {
    "A_FINAL": {"A_FINAL": NUNCA},
    "R_FIM_DE_SILABA na última": {"reforcar_r": reforcar_sem_fim_na_ultima},
    "R_GRUPO sem «ɾɾ» depois de «é»": {"R_GRUPO": re.compile(r"(?<=[pbtdkɡfv])ɾ(?!ɾ)")},
    "O_CONSOANTE": {"O_CONSOANTE": NUNCA},
    "A_ATONO_NASAL": {"A_ATONO_NASAL": NUNCA},
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


OBRIGATORIOS = ["poço", "caminhão", "chaminé", "camiseta!"]


def sortear_textos_do_site(voz):
    textos = json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))
    por_regra = {}
    for t in textos:
        if len(t) > 90 or t.strip().lower() in ns["AJUSTES_PT_BR"]:
            continue
        mudaram = regras_que_mudaram(voz, t)
        if mudaram:
            por_regra.setdefault(" + ".join(mudaram), []).append(t.strip())
    for chave, lista in sorted(por_regra.items()):
        print(f"  {chave}: {len(lista)} textos do site mudaram")
    escolhidos = [(t, k) for t in OBRIGATORIOS for k, lista in por_regra.items() if t in lista]
    sorteio = random.Random(4)
    quantos = {"A_FINAL": 5, "R_FIM_DE_SILABA na última": 4, "A_FINAL + R_FIM_DE_SILABA na última": 4,
               "R_GRUPO sem «ɾɾ» depois de «é»": 4, "O_CONSOANTE": 2, "A_ATONO_NASAL": 2}
    for chave, n in quantos.items():
        resto = [t for t in por_regra.get(chave, []) if t not in OBRIGATORIOS]
        escolhidos += [(t, chave) for t in sorteio.sample(resto, min(n, len(resto)))]
    for chave, lista in por_regra.items():  # combinações raras (mais de uma regra): uma de cada
        if chave not in quantos and not any(k == chave for _, k in escolhidos):
            escolhidos.append((sorteio.choice(lista), chave))
    return escolhidos


V_REGRAS = [
    {"rot": "Antes da rodada 3", "desc": f"scripts/piper_falar.py do commit {COMMIT_ANTES}", "antes": True},
    ATUAL,
]

# ---------- grupo 1: colher ----------
V_COLHER = [
    ATUAL,
    {"rot": "kuljˈɛɾ", "desc": "«u» no «co» e «é» aberto, como o utensílio no BIPA", "muda": colher("u", "ɛ")},
    {"rot": "koljˈɛɾ", "desc": "só o «é» aberto", "muda": colher("o", "ɛ")},
    {"rot": "kuljˈeɾ", "desc": "só o «u» no «co» (o «ê» continua fechado)", "muda": colher("u", "e")},
]
COLHER = [
    ("colher", "colher", "sozinha (site)"),
    ("colher", "colher de pau!", "site"),
    ("colherzinhas", "Em cima da mesa havia sete pratinhos, sete copinhos e sete colherzinhas.", "site"),
    ("colher", "Ela mexeu a sopa com a colher.", "frase nova, fim"),
    ("colher", "A colher caiu no chão.", "frase nova, começo"),
]

# ---------- grupo 2: tartaruga ----------
V_TARTARUGA = [
    ATUAL,
    {"rot": "tt", "desc": "o «t» depois do «r» reforçado: testa se o «t» está fraco", "muda": t_dobrado_depois_r},
    {"rot": "ɾ simples", "desc": "um «ɾ» só no «tar» (na frase hoje é «ɾɾ»): testa se o «r» invade o «t»", "muda": coda_simples},
    {"rot": "ɾɾ", "desc": "«ɾɾ» no «tar» (sozinha hoje é «ɾ»)", "muda": coda_dobrada},
    {"rot": "Sem acento secundário", "desc": "tira o «ˌ» do primeiro «ta»", "muda": sem_secundario},
    {"rot": "Secundário no 2º «ta»", "desc": "o «ˌ» passa para o segundo «ta» (tar-TA-ru-ga)", "muda": secundario_no_segundo_ta},
]
TARTARUGA = [
    ("tartaruga", "sozinha (site)"),
    ("a tartaruga estava cruzando a meta!", "site"),
    ("«Aquela tartaruga lerda nunca vai me alcançar.»", "site"),
]

# ---------- grupo 3: verbo no fim da frase ----------
V_VERBO = [
    ATUAL,
    {"rot": "Tônica longa", "desc": "vogal tônica do verbo mais longa (iː, aː, eː)", "muda": tonica_longa},
    {"rot": "ɾɾ no meio", "desc": "«r» de fim de sílaba dentro do verbo dobrado (dor-)", "muda": coda_dobrada},
    {"rot": "Pausa antes", "desc": "vírgula antes do verbo (pausa curta)", "muda": mesmo, "virgula": True},
    {"rot": "Pausa + tônica longa", "desc": "os dois juntos", "muda": tonica_longa, "virgula": True},
]
VERBOS = [
    ("dormir", "Hora de dormir.", "frase nova"),
    ("brincar", "Ele agora quer brincar.", "frase nova"),
    ("dormir", "À noite, pararam na floresta para dormir.", "site"),
    ("brincar", "O mais novo só queria brincar.", "site"),
    ("chorar", "A princesa começou a chorar.", "site"),
    ("fugir", "O caçador teve pena e a deixou fugir.", "site"),
    ("comer", "Não havia mais nada para comer.", "site"),
    ("entrar", "Deixe o sapo entrar.", "site"),
    ("tremer", "De repente, o chão começou a tremer!", "site"),
]

# ---------- grupo 4: porta na frase ----------
V_PORTA = [
    ATUAL,
    {"rot": "ɾ simples", "desc": "um «ɾ» só (hoje «ɾɾ»)", "muda": coda_simples},
    {"rot": "ɔː", "desc": "«ó» mais longo", "muda": o_aberto_longo},
    {"rot": "a final", "desc": "«a» pleno no fim (ɐ→a)", "muda": final_pleno},
]
PORTA = [
    "À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra:",
    "O lobo bateu na porta da casa de madeira.",
    "Na porta há um cadeado com três números.",
    "Davi encosta o ombro na porta e empurra com todas as forças!",
]

# ---------- grupo 5: "ɾɾ" em grupo antes da tônica ----------
V_GRUPO = [ATUAL, {"rot": "ɾ simples", "desc": "o grupo com um «ɾ» só (pɾ, tɾ...), sem o R_GRUPO", "muda": grupo_simples}]
GRUPO_NA_TONICA = [
    ("soprou", "Soprou, soprou e a casa caiu!"),
    ("soprar", "— Então vou soprar, soprar e sua casa vai voar!"),
    ("abriu", "O cadeado abriu e a porta rangeu."),
]
PRETONICA = re.compile(r"[pbtdkɡfv]ɾɾ[ˌ]?[" + VOGAL + r"].*ˈ")


def sortear_grupo_pretonico(voz, n=8):
    textos = json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))
    achados = {}
    for t in textos:
        t = t.strip()
        if len(t) > 90 or len(t.split()) < 3:
            continue
        toks = alinhar(voz, t)
        if not toks:
            continue
        pal = " ".join(fonemas_finais(voz, t)).split()
        for tok, f in zip(toks, pal):
            if PRETONICA.search(NFD(f)) and tok not in achados:
                achados[tok] = t
    print(f"  grupo antes da tônica: {len(achados)} palavras distintas no site")
    return random.Random(5).sample(sorted(achados.items()), min(n, len(achados)))


# ---------- grupo 6: frase curta ----------
V_RITMO = [
    ATUAL,
    {"rot": "Ritmo 1.25", "desc": "a frase toda mais lenta", "ajuste": (1.25, False, False, None)},
    {"rot": "Ritmo 1.35", "desc": "mais lenta ainda", "ajuste": (1.35, False, False, None)},
]


def sortear_frases_curtas(voz, n=7):
    textos = json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))
    curtas = sorted({t.strip() for t in textos
                     if 3 <= len(re.findall(TOKEN, t)) <= 5 and re.search(r"[.!?]$", t.strip()) and not re.search(r"\d", t)
                     and not t.strip().startswith(("—", "«"))})
    print(f"  frases curtas (3 a 5 palavras): {len(curtas)} no site")
    return random.Random(6).sample(curtas, n)


def main():
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)
    g0 = [item(voz, "regras", None, t, V_REGRAS, f"{regra}: {palavras_mudadas(voz, t)}") for t, regra in sortear_textos_do_site(voz)]
    g1 = [item(voz, "colher", p, t, V_COLHER, f"{p} ({onde})") for p, t, onde in COLHER]
    g2 = [item(voz, "tartaruga", "tartaruga", t, V_TARTARUGA, f"tartaruga ({onde})") for t, onde in TARTARUGA]
    g3 = [item(voz, "verbo", p, t, V_VERBO, f"{p} ({onde})") for p, t, onde in VERBOS]
    g4 = [item(voz, "porta", "porta", t, V_PORTA, "porta (site)") for t in PORTA]
    g5 = ([item(voz, "grupo", p, t, V_GRUPO, f"{p} (grupo na sílaba tônica, site)") for p, t in GRUPO_NA_TONICA]
          + [item(voz, "grupo", p, t, V_GRUPO, f"{p} (grupo antes da tônica, site)") for p, t in sortear_grupo_pretonico(voz)])
    g6 = ([item(voz, "ritmo", None, t, V_RITMO, "frase curta (site)") for t in sortear_frases_curtas(voz)]
          + [item(voz, "ritmo", None, "O brinquedo caro quebrou.", V_RITMO, "frase curta (rodada 3)")])
    grupos = [
        {"id": "regras", "titulo": "0. Conferir as regras da rodada 3 (textos reais do site)",
         "pergunta": "A_FINAL, R_FIM_DE_SILABA na última palavra, a exceção do R_GRUPO depois de «é», O_CONSOANTE e A_ATONO_NASAL "
                     "foram aplicados no site todo sem ouvir cada caso. A = antes da rodada 3, B = como o app fala hoje. A coluna da "
                     "esquerda diz quais regras mudaram o texto e as palavras que mudaram (antes → hoje).",
         "itens": g0},
        {"id": "colher", "titulo": "1. colher (o utensílio)",
         "pergunta": "Sozinha, «colher» soa como o verbo («colher maçãs»). No site é sempre o utensílio.", "itens": g1},
        {"id": "tartaruga", "titulo": "2. tartaruga",
         "pergunta": "Soa «tarraruga»: o segundo «t» vira «r». Cada versão testa uma hipótese (está na descrição).", "itens": g2},
        {"id": "verbo", "titulo": "3. Verbo no fim da frase",
         "pergunta": "O verbo no infinitivo no fim da frase sai rápido demais («Hora de dormir.», «brincar»).", "itens": g3},
        {"id": "porta", "titulo": "4. porta no meio da frase",
         "pergunta": "«porta» ainda soa estranha na frase («...bloqueia a porta e grita...»).", "itens": g4},
        {"id": "grupo", "titulo": "5. «ɾɾ» em grupo de consoantes fora do fim da palavra",
         "pergunta": "«Soprou, soprou e a casa caiu!» preferiu «pɾ» simples. Nos três primeiros o grupo está na sílaba tônica "
                     "(so-PROU, a-BRIU), como em «Soprou»; nos outros, numa sílaba antes da tônica (a-pren-DIZ).",
         "itens": g5},
        {"id": "ritmo", "titulo": "6. Frase curta rápida demais",
         "pergunta": "«O brinquedo caro quebrou.» ficou difícil de entender inteira. Frases curtas do site em três ritmos "
                     "(maior = mais lento).",
         "itens": g6},
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
<title>Validação de fonemas, rodada 4</title>
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
<h1>Validação de fonemas, rodada 4</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py validacao-rodada4</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui.</div>
<p>Cada item tem de 2 a 6 versões (A, B, C...). Cada versão mostra o que muda, os fonemas (da palavra testada, ou do texto todo nos grupos 0 e 6) e o ritmo. Marque a melhor, «Sem diferença» ou «Nenhum serve», e use a observação para dizer o que soa errado.</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-rodada4/respostas.json</code>. Confira o aviso verde na barra.</p>
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
function exporta(){return {pagina:'validacao-rodada4',salvo:new Date().toISOString(),
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
 a.download='respostas-rodada4-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
elif __name__ == "__main__":
    main()
