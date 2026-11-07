"""Compara os fonemas que o Piper (espeak-ng) gera para cada palavra do site com um banco de referência.
Guia: docs/VALIDACAO-FONEMAS.md

  python comparar_fonemas.py pt-BR            # usa referencias-fonemas/palavras-pt-BR.json e bipa.tsv
  python comparar_fonemas.py pt-BR --limite 40
  python comparar_fonemas.py pt-BR --banco mfa    # dicionário do Montreal Forced Aligner (referencias-fonemas/mfa/br.dict)

Saída: referencias-fonemas/relatorio-<variante>.tsv (palavra, distância, fonemas do Piper, melhor da referência);
com --banco mfa, relatorio-<variante>-mfa.tsv. Só pt-BR por enquanto (bancos BIPA e MFA)."""
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

from piper import PiperVoice

RAIZ = Path(__file__).resolve().parents[2]
PASTA = RAIZ / "referencias-fonemas"
MODELOS = {"pt-BR": "pt_BR-faber-medium.onnx"}

# Dialetos do BIPA que contam como referência (os rótulos rurais/nordeste têm poucas palavras).
DIALETOS = {"Brazil", "Rio de Janeiro", "São Paulo", "Southern Brazil"}

# Diferenças de notação ou de dialeto que não mudam a palavra: tudo vira o mesmo símbolo antes de comparar.
UNIFICAR = {
    "ɾ": "r", "ɹ": "r", "ʁ": "r", "x": "r", "h": "r", "ɣ": "r", "χ": "r", "ɻ": "r", "ʀ": "r", "ɽ": "r",
    "ɪ": "i", "ɨ": "i", "j": "i", "ʊ": "u", "w": "u", "ɐ": "a", "ə": "a", "ɫ": "l", "ɡ": "g",
    "ʲ": "", "ʷ": "",
}
IGNORAR = set("ˈˌ.ːˑ‿‖|ˑ'’ ̯̩̆̊̈̃͡")
NASAL = "̃"


VOGAIS = set("aeɛiɔou")


def normalizar(ipa):
    ipa = re.sub(r"\([^)]*\)", "", ipa)  # segmentos opcionais da referência, como (ʁ), (j), (w)
    ipa = unicodedata.normalize("NFD", ipa)
    saida = []
    for c in ipa:
        if c == NASAL:
            saida.append("~")
        elif c in IGNORAR:
            continue
        else:
            saida.append(UNIFICAR.get(c, c))
    texto = "".join(saida)
    # o espeak escreve a nasal depois da vogal (õn, ẽŋ); o banco só marca a vogal
    texto = re.sub(r"~[nmŋ](?=[^aeɛiɔou~])", "~", texto)
    # semivogais depois de vogal (ditongos) e r final variam entre fontes: não contam
    sem_glide, anterior = [], ""
    for c in texto:
        if c in "iu" and anterior in VOGAIS:
            continue
        sem_glide.append(c)
        if c != "~":
            anterior = c
    texto = re.sub(r"r$", "", "".join(sem_glide))
    # nasal final (em, im, um) e vogal nasalizada antes de m/n/nh (come, menino, ninho) variam por dialeto
    texto = re.sub(r"(?<=[aeɛiɔou])[mn]$", "~", texto)
    texto = re.sub(r"~(?=[mnɲ])", "", texto)
    return re.sub(r"~+", "~", texto)


def distancia(a, b):
    if a == b:
        return 0
    anterior = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        atual = [i]
        for j, cb in enumerate(b, 1):
            atual.append(min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + (ca != cb)))
        anterior = atual
    return anterior[-1]


def carregar_referencia():
    banco = {}
    with open(PASTA / "bipa.tsv", encoding="utf-8", newline="") as f:
        for linha in csv.DictReader(f, delimiter="\t"):
            if linha["dialeto"] in DIALETOS:
                banco.setdefault(linha["palavra"].lower(), {}).setdefault(normalizar(linha["pronuncia"]), linha["pronuncia"])
    return banco


def carregar_mfa():
    banco = {}
    with open(PASTA / "mfa" / "br.dict", encoding="utf-8") as f:
        for linha in f:
            campos = linha.rstrip("\n").split("\t")
            if len(campos) < 6 or campos[0] in ("<eps>", "<unk>"):
                continue
            ipa = campos[5].replace(" ", "")
            banco.setdefault(campos[0].lower(), {}).setdefault(normalizar(ipa), ipa)
    return banco


def main():
    variante = sys.argv[1]
    mfa = "--banco" in sys.argv and sys.argv[sys.argv.index("--banco") + 1] == "mfa"
    limite = int(sys.argv[sys.argv.index("--limite") + 1]) if "--limite" in sys.argv else 40
    palavras = json.loads((PASTA / f"palavras-{variante}.json").read_text(encoding="utf-8"))
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / MODELOS[variante]))
    banco = carregar_mfa() if mfa else carregar_referencia()

    linhas, sem_banco = [], []
    for palavra in palavras:
        if palavra not in banco:
            sem_banco.append(palavra)
            continue
        piper = "".join("".join(s) for s in voz.phonemize(palavra))
        alvo = normalizar(piper)
        melhor = min(banco[palavra].items(), key=lambda kv: distancia(alvo, kv[0]))
        d = distancia(alvo, melhor[0])
        linhas.append((palavra, d, piper, melhor[1], len(banco[palavra])))

    linhas.sort(key=lambda l: (-l[1], l[0]))
    saida = PASTA / f"relatorio-{variante}{'-mfa' if mfa else ''}.tsv"
    with open(saida, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t")
        w.writerow(["palavra", "distancia", "piper", "melhor_referencia", "variantes_na_referencia"])
        w.writerows(linhas)
        w.writerow([])
        w.writerow(["# sem entrada no banco:"] + sem_banco)

    iguais = sum(1 for l in linhas if l[1] == 0)
    print(f"{variante}: {len(palavras)} palavras; {len(linhas)} no banco ({iguais} iguais), {len(sem_banco)} sem entrada")
    for dist in (1, 2, 3):
        print(f"  distância {dist}{'+' if dist == 3 else ''}: {sum(1 for l in linhas if (l[1] >= 3 if dist == 3 else l[1] == dist))}")
    print(f"\nMaiores divergências (completo em {saida.relative_to(RAIZ)}):")
    for palavra, d, piper, ref, _ in linhas[:limite]:
        print(f"  {d}  {palavra:18} piper={piper:24} ref={ref}")


main()
