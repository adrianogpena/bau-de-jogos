"""Sintetiza falas com o Piper e grava MP3.
Uma fala:  python piper_falar.py modelo.onnx saida.mp3   (texto na entrada padrão)
Em lote:   python piper_falar.py modelo.onnx --lote falas.json   (lista de {"saida": ..., "texto": ...})

Ajustes para a fala ficar mais clara para crianças:
- ritmo um pouco mais lento e com menos variação (CONFIG), MP3 de 96k;
- na voz pt-BR, o espeak gera fonemas que o modelo pronuncia mal: o "e" fraco de "espelho" some ("spew") e o "lh"
  (ʎ) não se ouve. `corrigir_fonemas` troca esses fonemas (testado ouvindo amostras)."""
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

CONFIG = SynthesisConfig(length_scale=1.15, noise_scale=0.4, noise_w_scale=0.5)
PAUSA_ENTRE_FRASES = 0.25  # segundos


# Palavras da voz pt-BR que o espeak escreve de um jeito que soa mal na frase (testado ouvindo frases inteiras).
# Chave: fonemas da palavra como o espeak os gera (na frase e sozinha); valor: fonemas usados no lugar.
TROCAS_PALAVRA_PT_BR = {
    "mˈɛtɐ": "mˈɛta",  # meta: o "a" final reduzido some
    "mˈetɐ": "mˈɛta",  # meta sozinha: o espeak abre o "e" só na frase
    "tˈopʊ": "tˈopo",  # topo: o "ʊ" final soa como "r"
    "tˈɔpʊ": "tˈopo",  # topo sozinha: o espeak abre o "o" só na frase
}
TROCAS_PALAVRA_PT_BR.update(
    {
        "lˈuɐ": "lˈua",  # lua
        "ˌaɡɾadesˈew": "aɡɾˌadesˈew",  # agradeceu: acento secundário no "gra"
        "vˌeʎˈiɲʊ": "vˌɛljˈiɲʊ",  # velhinho
        "vˌeʎˈiɲɐ": "vˌɛljˈiɲɐ",  # velhinha
        # vogal nasal + consoante nasal: o espeak acrescenta um "n"/"ŋ" que soa estranho; o BIPA só marca a vogal
        "ˌeskõndʒˈidɐz": "ˈeːskõdʒˈidɐz",  # escondidas (já com o "e" longo, como em espelho)
        "dʒˈins": "dʒˈĩs",  # jeans
        "ɡɾˌatˈuɪtʊ": "ɡɾatuˈitu",  # gratuito
        "dˈẽntɾw": "dˈẽntɾu",  # dentro
        "ˌavẽntˈuɾɐ": "avẽntˈuɾa",  # aventura
        "mˈĩm": "mˈĩ",  # mim
        "bɾĩŋkˈaɾ": "bɾĩnkˈaɾ",  # brincar
        "ˈɔɾdeɪns": "ˈɔɾɾdẽĩs",  # ordens: com um só "ɾ" o modelo engole o "r" ("odens")
    }
)
# Validação de 2026-11-07 (docs/VALIDACAO-FONEMAS.md): palavras parecidas com as de cima, ouvidas com a anterior e a
# próxima palavra; ficaram as que soaram melhor com o mesmo ajuste.
TROCAS_PALAVRA_PT_BR.update(
    {
        # final "ɐ" depois de vogal tônica vira "a" (como lua)
        "dʒˈiʲɐ": "dʒˈiʲa",  # dia
        "kˌõntʃinˈuɐ": "kˌõntʃinˈua",  # continua
        "mˌaɾˈiʲɐ": "mˌaɾˈiʲa",  # maria
        "mˌasˈiʲɐ": "mˌasˈiʲa",  # macia
        "ˌeskoxˌeɡadʒˈiʲɐ": "ˌeskoxˌeɡadʒˈiʲa",  # escorregadia
        "kˌeɾˈiʲɐ": "kˌeɾˈiʲa",  # queria
        "pˌõntaɾˈiʲɐ": "pˌõntaɾˈiʲa",  # pontaria
        "sˌabedoɾˈiʲɐ": "sˌabedoɾˈiʲa",  # sabedoria
        "lˌavɐ̃ndeɾˈiʲɐ": "lˌavɐ̃ndeɾˈiʲa",  # lavanderia
        "ˌaleɡɾˈiʲɐ": "ˌaleɡɾˈiʲa",  # alegria
        "ˌapaɾesˈiʲɐ": "ˌapaɾesˈiʲa",  # aparecia
        "kˌobɾˈiʲɐ": "kˌobɾˈiʲa",  # cobria
        "kˌõnseɡˈiʲɐ": "kˌõnseɡˈiʲa",  # conseguia
        "dˌebatʃˈiʲɐ": "dˌebatʃˈiʲa",  # debatia
        "dˌoɾmˈiʲɐ": "dˌoɾmˈiʲa",  # dormia
        "pˌedʒˈiʲɐ": "pˌedʒˈiʲa",  # pedia
        "xˌespõndʒˈiʲɐ": "xˌespõndʒˈiʲa",  # respondia
        "tɾˌazˈiʲɐ": "tɾˌazˈiʲa",  # trazia
        "vˌazˈiʲɐ": "vˌazˈiʲa",  # vazia
        "vˈiʲɐ": "vˈiʲa",  # via
        "vˌivˈiʲɐ": "vˌivˈiʲa",  # vivia
        # final "ɐ" depois de ɛ/ɔ/u tônico + consoante vira "a" (como meta)
        "lˈunɐ": "lˈuna",  # luna
        "flˌoɾˈɛstɐ": "flˌoɾˈɛsta",  # floresta
        "kˌavˈɛɾnɐ": "kˌavˈɛɾna",  # caverna
        "ˈɛlɐ": "ˈɛla",  # ela
        "kˈuɾɐ": "kˈuɾa",  # cura
        "ˌeskˈuɾɐ": "ˌeskˈuɾa",  # escura
        "nˌeɲˈumɐ": "nˌeɲˈuma",  # nenhuma
        "pˈulɐ": "pˈula",  # pula
        "ˌaɾmadˈuɾɐ": "ˌaɾmadˈuɾa",  # armadura
        "ʃˈuvɐ": "ʃˈuva",  # chuva
        "xˌekupˈɛɾɐ": "xˌekupˈɛɾa",  # recupera
        "pˌɐnˈɛlɐ": "pˌɐnˈɛla",  # panela
        "pɾˌokˈuɾɐ": "pɾˌokˈuɾa",  # procura
        "sˈɔpɾɐ": "sˈɔpɾa",  # sopra
        "tˈɔkɐ": "tˈɔka",  # toca
        "vˈɔwtɐ": "vˈɔwta",  # volta
        "dˈɛlɐ": "dˈɛla",  # dela
        "fˌeʃadˈuɾɐ": "fˌeʃadˈuɾa",  # fechadura
        "fˈɔɾɐ": "fˈɔɾa",  # fora
        "lˈutɐ": "lˈuta",  # luta
        "ˌaɡˈɔɾɐ": "ˌaɡˈɔɾa",  # agora
        "bˌisiklˈɛtɐ": "bˌisiklˈɛta",  # bicicleta
        # final "ʊ" depois de o/ɔ tônico vira "o" (como topo)
        "nˈovʊ": "nˈovo",  # novo
        "xˌelˈɔʒjʊ": "xˌelˈɔʒjo",  # relógio
        "tˈodʊ": "tˈodo",  # todo
        "tʃˌiʒˈolʊ": "tʃˌiʒˈolo",  # tijolo
        "bˈolʊ": "bˈolo",  # bolo
        "ˌeskɾitˈɔɾjʊ": "ˌeskɾitˈɔɾjo",  # escritório
        "pˈosʊ": "pˈoso",  # poço
        "lˌaboɾatˈɔɾjʊ": "lˌaboɾatˈɔɾjo",  # laboratório
        # final "ɾw" vira "ɾu" (como dentro)
        "pɾˌimˈeɪɾw": "pɾˌimˈeɪɾu",  # primeiro
        "kwˈatɾw": "kwˈatɾu",  # quatro
        "tˌeɾsˈeɪɾw": "tˌeɾsˈeɪɾu",  # terceiro
        # "ŋ" antes de k/g vira "n" (como brincar)
        "bɾˌĩŋkˈedʊ": "bɾˌĩnkˈedʊ",  # brinquedo
        "bɾˈɐ̃ŋkw": "bɾˈɐ̃nkw",  # branco
        "bɾˌĩŋkˈedʊz": "bɾˌĩnkˈedʊz",  # brinquedos
        "ˌẽŋkõntɾˈaɾɐ̃ʊ̃": "ˌẽnkõntɾˈaɾɐ̃ʊ̃",  # encontraram
        "ˌẽŋkõntɾˈaɾeɪŋ": "ˌẽnkõntɾˈaɾeɪŋ",  # encontrarem
        "ˌẽŋkˈõntɾɪ": "ˌẽnkˈõntɾɪ",  # encontre
        "ˌẽŋkwˈɐ̃ntw": "ˌẽnkwˈɐ̃ntw",  # enquanto
        "tɾˌɐ̃ŋkˈadʊ": "tɾˌɐ̃nkˈadʊ",  # trancado
        # vogal nasal sem o "n" seguinte (como jeans)
        "pˈõntʃɪ": "pˈõtʃɪ",  # ponte
        "pɾˌĩnsˈezɐ": "pɾˌĩsˈezɐ",  # princesa
        "kˈẽntʃɪ": "kˈẽtʃɪ",  # quente
        "pˈɐ̃ntɐnʊ": "pˈɐ̃tɐnʊ",  # pântano
        "kˌõnseɡˈiʊ": "kˌõseɡˈiʊ",  # conseguiu
        "dˌeskˈɐ̃nsɐ": "dˌeskˈɐ̃sɐ",  # descansa
        "lˈõnʒɪ": "lˈõʒɪ",  # longe
        "mˌõntˈɐ̃ɲɐ": "mˌõtˈɐ̃ɲɐ",  # montanha
        # "ɾ" no fim de sílaba vira "ɾɾ" (como ordens)
        "pˈɛɾdʒj": "pˈɛɾɾdʒj",  # perde
        "fˌoɾmˈiɡɐ": "fˌoɾɾmˈiɡɐ",  # formiga
        "ˌistˈɔɾjɐ": "ˌistˈɔɾɾjɐ",  # história
        "ˌakˈɔɾdɐ": "ˌakˈɔɾɾdɐ",  # acorda
        "ˌenˈɔɾmɪ": "ˌenˈɔɾɾmɪ",  # enorme
        "fˈɔɾtʃɪs": "fˈɔɾɾtʃɪs",  # fortes
        "ɡwˌaɾdʒiʲˈɐ̃ʊ̃": "ɡwˌaɾɾdʒiʲˈɐ̃ʊ̃",  # guardião
        "mˌoɾsˈeɡw": "mˌoɾɾsˈeɡw",  # morcego
        "ˌabˈɛɾtw": "ˌabˈɛɾɾtw",  # aberto
        "ˌakoɾdˈoʊ": "ˌakoɾɾdˈoʊ",  # acordou
        "flˌoɾzˈiɲɐs": "flˌoɾɾzˈiɲɐs",  # florzinhas
        "fˈɔɾmɐ̃ʊ̃": "fˈɔɾɾmɐ̃ʊ̃",  # formam
        "foɾmˈaɾ": "foɾɾmˈaɾ",  # formar
        "pˈɛɾnɐs": "pˈɛɾɾnɐs",  # pernas
        "pˈɛɾtʊ": "pˈɛɾɾtʊ",  # perto
        "ˌaseɾtˈaɾ": "ˌaseɾɾtˈaɾ",  # acertar
        "ˈɔɾdeɪm": "ˈɔɾɾdeɪm",  # ordem
        "pˈaɾtʃɪ": "pˈaɾɾtʃɪ",  # parte
        "bˌoɾbolˈetɐ": "bˌoɾɾbolˈetɐ",  # borboleta
    }
)
# Rodada 3 de validação (docs/VALIDACAO-FONEMAS.md).
TROCAS_PALAVRA_PT_BR.update(
    {
        "fˌoɾmˈiɡɐ": "fˌoɾɾmmˈiɡɐ",  # formiga: com um "m" só soava "forniga" (sozinha); na frase não muda
        "pˈaɾɪz": "pˈaɾiz",  # pares: com "ɪ" soava "pais"
    }
)
# Rodada 4 de validação.
TROCAS_PALAVRA_PT_BR.update(
    {
        # colher (no site é sempre o utensílio): com "ê" fechado soava como o verbo; o "é" aberto resolveu
        "koʎˈeɾ": "koljˈɛɾ",
        "kˌoʎeɾzˈiɲɐs": "kˌuljɛɾzˈiɲɐs",  # colherzinhas
        "tˌaɾtaɾˈuɡɐ": "tˌaɾttaɾˈuɡɐ",  # tartaruga: o segundo "t" virava "r" ("tarraruga"); com "tt" ficou o mais perto
        "pˈɔɾtɐ": "pˈɔːɾɾtɐ",  # porta na frase: "ó" mais longo (o "ɾɾ" já vem da regra, mas o "ː" a impediria)
    }
)
# Rodada 5 de validação.
TROCAS_PALAVRA_PT_BR.update(
    {
        "ɡoblˈĩn": "ɡˈɔblĩ",  # Goblin: tônica no "go" aberto, mais perto do inglês (3 de 3)
        "ɡoblˈĩm": "ɡˈɔblĩ",
        "ʃˈavɪ": "ʃˈaːvɪ",  # chave: soava "tchave"; com o "a" longo, não (ouvido só em "chave de fenda!")
        "ʃˈavj": "ʃˈaːvj",
        "ˌesfɾeɡˈow": "ˌesfɾɾɾeɡˈow",  # esfregou: soava "esfegou"; só com "ɾɾɾ" o "r" se ouve
        "xˈastɾʊ": "xˈastɾɾɾʊ",  # rastro
    }
)
# Só quando o texto (a frase) é uma palavra sozinha; têm prioridade sobre TROCAS_PALAVRA_PT_BR.
TROCAS_PALAVRA_SOLTA_PT_BR = {
    "pˈɔɾtɐ": "pˈɔɾtɐ",  # porta sozinha fica como o espeak gera (o "ɔː" só foi ouvido na frase)
    "pˈoɾkʊ": "pˈoɾko",  # porco: o "o" de "por" soava estranho
    "bˈokɐ": "bˈoːkɐ",  # boca
    "pˌɐnˈɛlɐ": "panˈɛla",  # panela: soava "pânela"
    "bɾˈuʃɐ": "bɾˈuʃa",  # bruxa: o "x" sumia
    "tˌaɾtaɾˈuɡɐ": "tˌaːɾttaɾˈuɡɐ",  # tartaruga: faltava força no primeiro "ta" (rodada 5)
}
# Palavra seguida de outra: (fonemas da palavra, começo dos fonemas da próxima) → fonemas usados.
TROCAS_ANTES_DE_PT_BR = {
    ("dʒɪ", "xˌepˈẽn"): "de",  # "De repente": o "dʒɪ" quase sumia (rodada 5, 3 de 3)
}
# Textos inteiros falados de outro jeito (a tela não muda).
TROCAS_TEXTO_PT_BR = {
    "A Lebre e a Tartaruga": "A Lebre e a, Tartaruga",  # pausa antes de "Tartaruga": soava "la tataruga" (rodada 5)
}
# Só no meio da frase: no começo (ex.: o título "Chapeuzinho Vermelho") o fonema do espeak soa melhor, e este engole o "ch".
TROCAS_PALAVRA_NO_MEIO_PT_BR = {
    "ʃˌapeʊzˈiɲʊ": "ʃapˌɛʊzˈiɲʊ",  # chapeuzinho
}
PONTUACAO = ",.!?:;"
# O espeak devolve as vogais nasais decompostas (vogal + til); as chaves são comparadas nessa forma.
TROCAS_PALAVRA_PT_BR = {unicodedata.normalize("NFD", k): v for k, v in TROCAS_PALAVRA_PT_BR.items()}
TROCAS_PALAVRA_NO_MEIO_PT_BR = {unicodedata.normalize("NFD", k): v for k, v in TROCAS_PALAVRA_NO_MEIO_PT_BR.items()}
TROCAS_PALAVRA_SOLTA_PT_BR = {unicodedata.normalize("NFD", k): v for k, v in TROCAS_PALAVRA_SOLTA_PT_BR.items()}
TROCAS_ANTES_DE_PT_BR = {tuple(unicodedata.normalize("NFD", x) for x in k): v for k, v in TROCAS_ANTES_DE_PT_BR.items()}


def trocar_palavras(fonemas):
    palavras, atual = [], []
    for f in fonemas:
        if f == " ":
            palavras.append(atual)
            atual = []
        else:
            atual.append(f)
    palavras.append(atual)
    sozinha = sum(1 for p in palavras if "".join(p).strip(PONTUACAO)) == 1
    saida = []
    for n, palavra in enumerate(palavras):
        cauda = []
        while palavra and palavra[-1] in PONTUACAO:
            cauda.insert(0, palavra.pop())
        troca = TROCAS_PALAVRA_SOLTA_PT_BR.get("".join(palavra)) if sozinha else None
        if troca is None and not cauda and n + 1 < len(palavras):
            proxima = "".join(palavras[n + 1])
            troca = next((v for (p, c), v in TROCAS_ANTES_DE_PT_BR.items() if p == "".join(palavra) and proxima.startswith(c)), None)
        if troca is None:
            troca = TROCAS_PALAVRA_PT_BR.get("".join(palavra))
        if troca is None and saida:
            troca = TROCAS_PALAVRA_NO_MEIO_PT_BR.get("".join(palavra))
        if saida:
            saida.append(" ")
        saida += (list(unicodedata.normalize("NFD", troca)) if troca else palavra) + cauda
    return saida


def corrigir_fonemas(fonemas, pt_br):
    if not pt_br:
        return fonemas
    fonemas = trocar_palavras(fonemas)
    saida = []
    inicio_palavra = True
    i = 0
    while i < len(fonemas):
        f = fonemas[i]
        # "e" fraco antes de "s" no começo da palavra (espelho, escola): vira "e" tônico e longo
        if inicio_palavra and fonemas[i : i + 3] == ["ˌ", "e", "s"]:
            saida += ["ˈ", "e", "ː", "s"]
            i += 3
        elif f == "ʎ":
            saida += ["l", "j"]
            i += 1
        else:
            saida.append(f)
            i += 1
        inicio_palavra = f == " "
    return reforcar_r(saida)


# O modelo engole o "r" (ɾ) curto; com "ɾɾ" ele aparece (validação de fonemas, rodadas 1 a 5: docs/VALIDACAO-FONEMAS.md).
# Em grupo de consoantes ajuda em quase toda posição (dentro, tronco, encontrou, ladrões, segredo, secretos). Não ajuda
# depois de "é" tônico (pedra, lebre: soava "pé-dra") nem nas palavras de GRUPO_SIMPLES_PT_BR. No fim de sílaba (porta,
# corda, gordo) ajuda em toda palavra da frase; só na palavra sozinha o ritmo lento de `ajuste_palavra_solta` já basta.
R_GRUPO = re.compile(r"(?<=[pbtdkɡfv])(?<!ˈɛ[pbtdkɡfv])ɾ(?!ɾ)")
# Palavras (fonemas sem pontuação) em que o grupo soou melhor com um "ɾ" só (rodadas 3 e 4). Na rodada 5 a regra geral
# "ɾ simples entre vogais antes da tônica" perdeu em ladrões, secretos, segredo e aprenda e voltou a ser só por palavra.
GRUPO_SIMPLES_PT_BR = {unicodedata.normalize("NFD", p) for p in (
    "sopɾˈow", "sopɾˈoʊ", "sopɾˈaɾ", "abɾˈiw", "abɾˈiʊ", "ˌapɾẽndʒˈiz",  # soprou, soprar, abriu, aprendiz
)}
# "s" + grupo antes da tônica ou nela (estragar, estrela, mostrar, construiu): mesmo com "ɾɾ" o "r" sumia ("estagar");
# com a consoante do grupo dobrada ele aparece (rodada 5, 6 de 6). Com "f" (esfregou) e depois da tônica (rastro) ganhou
# "ɾɾɾ", trocado por palavra.
S_GRUPO = re.compile(r"(?<=s)([pbtdkɡv])(?=ɾɾ(?!ɾ).*ˈ)")
R_FIM_DE_SILABA = re.compile(r"(?<=[aeiouɛɔɐɪʊ])ɾ(?=[^aeiouɛɔɐɪʊ̃ˈˌʲɾː" + re.escape(PONTUACAO) + r"])")
# "r" de fim de sílaba antes de "t"/"d" (porta, perto, tarde, ordem): o "r" sumia ("pôta"); com a oclusiva dobrada, como
# em tartaruga, ele aparece (rodada 5, 8 de 10; os outros 2 empataram).
OCLUSIVA_DEPOIS_DE_R = re.compile(r"(?<=[aeiouɛɔɐɪʊ̃ː]ɾɾ)([td])(?![td])")
# Última palavra da frase terminada em "ɐ": com "a" pleno não some (caixa soava "caix"). Menos "-gia" (magia, energia).
A_FINAL = re.compile(r"(?<!ʒˈiʲ)ɐ(?=[" + re.escape(PONTUACAO) + r"]*$)")
# Última palavra da frase terminada em "a", "e" ou "i" tônico + "r" (dormir, brincar, chorar, fugir, achar): saía rápida
# demais; com a vogal tônica longa ficou melhor (rodadas 4 e 5). Com "o" (flor) soou "flore" e ficou de fora.
TONICA_R_FINAL = re.compile(r"ˈ([aei])ɾ(?=[" + re.escape(PONTUACAO) + r"]*$)")
# Palavra sozinha: consoante depois do "o" tônico fechado dobrada (lobo soava "logo", ovo "ouvo"; também osso, sopa),
# menos antes de "o" pleno (poço, já com o final trocado, ficou pior), e "a" pleno no "ɐ" átono antes de consoante
# nasal (janela, banana, caneta, caminhão, chaminé, camiseta).
O_CONSOANTE = re.compile(r"(?<=ˈo)([bvsp])(?!\1)(?!o)")
A_ATONO_NASAL = re.compile(r"ˌɐ(?=[nmɲ])")


def reforcar_grupo(p):
    return p if p.rstrip(PONTUACAO) in GRUPO_SIMPLES_PT_BR else R_GRUPO.sub("ɾɾ", p)


def reforcar_r(fonemas):
    palavras = "".join(fonemas).split(" ")
    reais = [i for i, p in enumerate(palavras) if p.strip(PONTUACAO)]
    if len(reais) == 1:
        p = reforcar_grupo(palavras[reais[0]])
        p = O_CONSOANTE.sub(r"\1\1", p)
        palavras[reais[0]] = A_ATONO_NASAL.sub("ˌa", p)
        return list(" ".join(palavras))
    ultima = reais[-1] if reais else -1
    for i, p in enumerate(palavras):
        p = S_GRUPO.sub(r"\1\1", reforcar_grupo(p))
        p = OCLUSIVA_DEPOIS_DE_R.sub(r"\1\1", R_FIM_DE_SILABA.sub("ɾɾ", p))
        if i == ultima:
            p = TONICA_R_FINAL.sub(r"ˈ\1ːɾ", A_FINAL.sub("a", p))
        palavras[i] = p
    return list(" ".join(palavras))


def sem_nasal(fonemas):
    decomposto = unicodedata.normalize("NFD", "".join(fonemas)).replace("̃", "")
    return list(unicodedata.normalize("NFC", decomposto))


# Números e palavras soltas da voz pt-BR que o modelo fala mal (testado ouvindo amostras). Por texto:
# (comprimento, pausa antes, tira a nasal das vogais, fonemas fixos ou None para os do espeak).
# Palavra isolada sai rápida e com o começo comido; o ritmo mais lento e a pausa corrigem.
AJUSTES_PT_BR = {
    "zero": (1.5, True, True, None),
    "vinte": (1.5, True, True, None),
    "trinta": (1.5, True, False, None),
    "quatro": (1.5, True, False, None),
    "onze": (1.5, True, False, None),
    "cinquenta e dois": (1.5, True, False, None),
    "cem": (1.5, True, False, "sˈẽĩ"),
    "quinze": (1.5, True, False, "kˈĩzi"),
}


def ajuste_palavra_solta(texto):
    """Texto de uma palavra só (rótulos, títulos, palavras dos jogos): pausa antes e, se tiver até 2 sílabas, ritmo lento.
    Sem isso o modelo encurta a palavra e engole o "r" ou o começo (rodada 2: o atual nunca foi o preferido;
    palavras curtas ficaram melhores lentas, as longas só com a pausa)."""
    palavras = re.findall(r"[^\W\d_]+(?:-[^\W\d_]+)*", texto)
    if len(palavras) != 1 or re.search(r"\d", texto):
        return None
    silabas = len(re.findall(r"[aeiouáàâãéêíóôõúü]+", palavras[0].lower()))
    return (1.5 if silabas <= 2 else CONFIG.length_scale, True, False, None)


def sintetizar(voz, texto, pt_br):
    pedacos = []
    silencio = np.zeros(int(voz.config.sample_rate * PAUSA_ENTRE_FRASES), dtype=np.int16)
    if pt_br:
        texto = TROCAS_TEXTO_PT_BR.get(texto, texto)
    ajuste = (AJUSTES_PT_BR.get(texto.strip().lower()) or ajuste_palavra_solta(texto)) if pt_br else None
    config = CONFIG
    for fonemas in voz.phonemize(texto):
        fonemas = corrigir_fonemas(fonemas, pt_br)
        if ajuste:
            comprimento, pausa, tira_nasal, fixos = ajuste
            config = SynthesisConfig(length_scale=comprimento, noise_scale=0.4, noise_w_scale=0.5)
            if fixos:
                fonemas = list(unicodedata.normalize("NFD", fixos))
            elif tira_nasal:
                fonemas = sem_nasal(fonemas)
            if pausa:
                fonemas = [",", " "] + fonemas
        ids = voz.phonemes_to_ids(fonemas)
        audio = voz.phoneme_ids_to_audio(ids, syn_config=config)
        if audio.dtype != np.int16:
            audio = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        if pedacos:
            pedacos.append(silencio)
        pedacos.append(audio)
    return np.concatenate(pedacos) if pedacos else np.zeros(1, dtype=np.int16)


modelo = sys.argv[1]
if sys.argv[2] == "--lote":
    falas = json.loads(Path(sys.argv[3]).read_text(encoding="utf-8"))
else:
    falas = [{"saida": sys.argv[2], "texto": sys.stdin.read()}]

pt_br = "pt_BR" in Path(modelo).name
voz = PiperVoice.load(modelo)
with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "fala.wav"
    for n, fala in enumerate(falas, 1):
        saida = Path(fala["saida"])
        pcm = sintetizar(voz, fala["texto"].strip(), pt_br)
        with wave.open(str(wav), "wb") as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(voz.config.sample_rate)
            f.writeframes(pcm.tobytes())
        saida.parent.mkdir(parents=True, exist_ok=True)
        temporario = saida.with_suffix(".tmp.mp3")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "96k", str(temporario)],
            check=True,
        )
        temporario.replace(saida)
        if len(falas) > 1 and n % 50 == 0:
            print(f"  {n}/{len(falas)}", flush=True)
