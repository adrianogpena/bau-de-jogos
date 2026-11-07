# Validação de fonemas das vozes do Piper

Objetivo: conferir se o Piper pronuncia direito as palavras do site (as de hoje e as que entrarem), comparando os fonemas que ele usa com um banco de pronúncias de referência. Quando uma palavra divergir, decide-se se ela precisa de ajuste (veja "O que fazer com uma divergência").

Estado: **só pt-BR** está implementado (banco BIPA). pt-PT está pendente (veja "Pt-PT").

## Como o Piper pronuncia

O Piper não lê letras. Ele converte o texto em fonemas com o **espeak-ng** e o modelo (Faber, Tugão) transforma os fonemas em voz. Um erro de pronúncia quase sempre vem de fonemas errados do espeak-ng, e não do modelo. Por isso a comparação é entre os fonemas do espeak-ng e uma referência.

`scripts/piper_falar.py` já corrige alguns fonemas na voz pt-BR (`corrigir_fonemas` e `AJUSTES_PT_BR`). A comparação usa os fonemas **crus** do espeak-ng, antes dessas correções.

## Bancos de referência

| Variante | Banco | Notação | Licença | Uso |
|---|---|---|---|---|
| pt-BR | [BIPA](https://huggingface.co/datasets/thiagomonteles/BIPA) (`por_bz_com_dialeto_55K.tsv`) | IPA | CC BY-SA 4.0 | **Em uso.** 53 mil palavras, 350 mil transcrições, com dialeto. Vem do Wiktionary. |
| pt-BR | [Aeiouadô](https://sites.google.com/view/nilc-usp/aeiouad%C3%B4) | próprio | não confirmada | Candidato (falar de São Paulo). |
| pt-PT | [pt-lex](https://github.com/msamribeiro/pt-lex) | próprio (`phoneset.yaml`) | MIT | Candidato. Só ~1000 verbetes revisados à mão (`lex.man`); o resto é gerado automaticamente (`lex.auto`). |
| pt-PT | [LUPo](https://celga-iltec.uc.pt/lupo/) | não confirmada | não confirmada | Candidato. Confirmar licença e formato. |
| ambas | [MFA Portuguese dictionary v2.0.0](https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20MFA%20dictionary%20v2_0_0.html) | conjunto do MFA | não confirmada | Candidato. Feito para alinhamento de fala, segue a variante de prestígio. |

Cuidados com a referência:

- O BIPA sai do Wiktionary e parte dos fonemas dele vem do próprio eSpeak, então concordar com ele não prova que a pronúncia está certa. Divergir é o sinal útil.
- O BIPA é só de palavras isoladas e tem muitas formas flexionadas faltando (veja "Limites").
- Licença CC BY-SA 4.0: o arquivo baixado fica fora do git (`referencias-fonemas/`). Se algum dado derivado for publicado no repositório, cite a fonte.

## Como rodar (pt-BR)

Pré-requisitos: o ambiente do Piper (`pip install piper-tts`, o mesmo de `docs/NARRACAO-PIPER.md`) e o modelo `modelos-piper/pt_BR-faber-medium.onnx`.

```bash
# 1. baixar o banco (uma vez; vai para referencias-fonemas/, fora do git)
mkdir -p referencias-fonemas
curl -L -o referencias-fonemas/bipa.tsv \
  https://huggingface.co/datasets/thiagomonteles/BIPA/resolve/main/por_bz_com_dialeto_55K.tsv

# 2. listar as palavras distintas das frases narradas (pt-PT e pt-BR)
node scripts/fonemas/extrair-palavras.mjs

# 3. comparar (use o python que tem o Piper, como PIPER_PYTHON)
$PIPER_PYTHON scripts/fonemas/comparar_fonemas.py pt-BR            # --limite N muda quantas divergências aparecem
```

Saída: resumo no terminal e `referencias-fonemas/relatorio-pt-BR.tsv` (palavra, distância, fonemas do Piper, melhor transcrição da referência, e a lista das palavras sem entrada no banco). Rode de novo ao acrescentar textos.

### Como a comparação funciona

- Para cada palavra, pega os fonemas do espeak-ng pelo Piper e todas as transcrições do BIPA dos dialetos Brasil, Rio de Janeiro, São Paulo e Sul. Fica com a mais próxima (distância de edição) e relata essa distância. Distância 0 = igual.
- Antes de comparar, os dois lados passam por `normalizar()`, que apaga diferenças de notação que não mudam a palavra: acento tônico e sílabas, r em todas as formas (ɾ, ʁ, x, h...), vogais reduzidas (ɪ/i, ʊ/u, ɐ/a), semivogais de ditongo, r final, segmentos opcionais `(ʁ)`, `(j)`, nasal final e vogal nasalizada antes de m/n/nh.
- Continuam contando: vogal aberta contra fechada (e/ɛ, o/ɔ), chiado (ti/di contra tʃi/dʒi), lh, nh, vogal nasal contra oral, consoante a mais ou a menos.

## Resultado de 2026-11-07 (pt-BR, voz Faber)

1634 palavras distintas no site; 1239 têm entrada no banco; **1213 iguais**, 26 diferentes (25 com distância 1, 1 com 2). Estas são as divergências; a maioria é notação ou variação de dialeto, não erro:

| Palavra | Piper | Referência | Leitura |
|---|---|---|---|
| meta | `mˈetɐ` | `ˈmɛtɐ` | **Provável erro**: "e" fechado, o certo é aberto (ɛ). |
| topo | `tˈɔpʊ` | `ˈtopu` | **Provável erro**: "o" aberto, o certo é fechado. |
| velhinho, velhinha | `vˌeʎˈiɲʊ` | `vɛˈʎĩɲu` | Vogal inicial aberta na referência. Pode ser dialeto; ouvir. |
| névoa | `nˈɛvoɐ` | `ˈnɛvuɐ` | Só "o" e "u" no meio da palavra. Provável notação. |
| cocoricó | `kˌokoɾikˈɔ` | `kokɔɾiˈkɔ` | Onomatopeia; a referência tem "ɔ" no segundo "co". Ouvir. |
| os | `ˈʊs` | `ˈɔs` | A referência parece ser o "ós" (osso). Ignorar. |
| um, num | `ˈũm` | `ˈœ̃` | Notação do Wiktionary. Ignorar. |
| aladim, assim, fim, mim, jardim | `...ĩm` | `...ĩ` | O Piper põe um "m" depois do "i" nasal; a referência só marca a nasal. Ouvir uma vez para ver se o "m" aparece forte demais. |
| quando, quanto | `kwˈɐ̃ndʊ` | `ˈkɐ̃(n).du` | A referência omite o "w". Ignorar. |
| chapeuzinho, ordens, debaixo, leia, jeans, hall, app, toc, ops, skate | vários | vários | Estrangeirismos, plural e ditongos com notação diferente. Ouvir só se algum tocar em texto de criança. |

Ainda não foram ouvidas; a tabela é só a leitura dos fonemas. As 2 de "provável erro" (meta, topo) merecem uma amostra de áudio antes de qualquer ajuste.

## Ajustes feitos a partir da comparação (ouvidos em frases)

Os ajustes por palavra ficam em `TROCAS_PALAVRA_PT_BR` (`scripts/piper_falar.py`): chave = fonemas do espeak, valor = fonemas usados. As que só valem para a palavra sozinha ficam em `TROCAS_PALAVRA_SOLTA_PT_BR` (rodada 3). Depois de mudar, regerar com `npm run audio:piper -- --voz faber --refazer-palavras palavra1,palavra2` (refaz todo texto que contém a palavra).

| Palavra | Espeak (sozinha / na frase) | Usado | Motivo |
|---|---|---|---|
| meta | `mˈetɐ` / `mˈɛtɐ` | `mˈɛta` | Ouvido: o "a" final reduzido soava estranho; com `a` pleno ficou certo. |
| topo | `tˈɔpʊ` / `tˈopʊ` | `tˈopo` | Ouvido: com o `ʊ` final soava como "r" no meio da palavra. Na frase o original ainda dava para entender, mas a frase inteira ficou melhor com `o` final. |

| lua | `lˈuɐ` | `lˈua` | Ouvido: o `ɐ` final, mesmo igual ao BIPA, soava estranho entre vírgulas. |
| agradeceu | `ˌaɡɾadesˈew` | `aɡɾˌadesˈew` | Ouvido: o acento secundário no "gra" soou melhor. Sem entrada no BIPA. |
| velhinho, velhinha | `vˌeʎˈiɲʊ`/`ɐ` (o app trocava `ʎ` por `lj`) | `vˌɛljˈiɲʊ`/`ɐ` | Ouvido: com "e" aberto (`ɛ`, como no BIPA) ficou melhor. |
| chapeuzinho | `ʃˌapeʊzˈiɲʊ` | `ʃapˌɛʊzˈiɲʊ` **só no meio da frase** | Ouvido: no meio da frase a troca melhorou a entonação, mas no começo (o título "Chapeuzinho Vermelho") ela engole o "ch" e o original soa melhor. Fica em `TROCAS_PALAVRA_NO_MEIO_PT_BR`. |

| escondidas | `ˌeskõndʒˈidɐz` | `ˈeːskõdʒˈidɐz` | Ouvido: sem o "n" depois da vogal nasal, como no BIPA, ficou melhor. Já com o "e" longo da regra de "espelho". |
| jeans | `dʒˈins` | `dʒˈĩs` | Ouvido: vogal nasal sem "n", como no BIPA. |
| gratuito | `ɡɾˌatˈuɪtʊ` | `ɡɾatuˈitu` | Ouvido: forma com hiato "gratu-í-to", que o BIPA também lista. |
| dentro | `dˈẽntɾw` | `dˈẽntɾu` | Ouvido: o final `ɾw` soava errado. O "n" ficou. |
| aventura | `ˌavẽntˈuɾɐ` | `avẽntˈuɾa` | Ouvido: final com "a" pleno. |
| mim | `mˈĩm` | `mˈĩ` | Ouvido: sem o "m" final, como no BIPA. |
| brincar | `bɾĩŋkˈaɾ` | `bɾĩnkˈaɾ` | Ouvido: "n" no lugar de "ŋ". |

| ordens | `ˈɔɾdeɪns` | `ˈɔɾɾdẽĩs` | Ouvido: com um só `ɾ` o modelo engolia o "r" ("odens", em todas as variantes de vogal). Com `ɾɾ` o "r" aparece. Ao ver o mesmo em outra palavra com "r" no fim de sílaba (ordem, porta, cerca...), tente o `ɾɾ`. |

Não existe uma regra única para a "consoante nasal depois de vogal nasal": tirar o "n" ajudou em escondidas, jeans e mim, mas não em dentro (ficou com "n"), aventura e brincar (ficaram com "n"). Por isso as trocas são por palavra. As chaves da tabela são comparadas na forma decomposta (NFD), porque o espeak devolve as vogais nasais como vogal + til.

O BIPA sugeria `ˈmɛtɐ` e `ˈtopu`; ao ouvir, os dois soaram mal. O BIPA indica onde olhar, mas quem decide é o ouvido, em frase.

## Outras palavras para os mesmos ajustes (página de validação)

`node scripts/fonemas/extrair-palavras.mjs` e depois `$PIPER_PYTHON scripts/fonemas/gerar_validacao_ajustes.py` (`--max-por-regra N`, padrão 40) geram `referencias-fonemas/validacao-ajustes/index.html` (fora do git). Cada regra copia um ajuste acima (final `ɐ`→`a`, `ʊ`→`o`, `ɾw`→`ɾu`, `ĩm`→`ĩ`, `ŋ`→`n`, nasal sem `n`, `ɾ`→`ɾɾ`), acha as palavras do site com o mesmo padrão e gera dois áudios (atual e ajustado) de um trecho da frase real: a palavra anterior, a palavra e a próxima (com a pontuação final, se o trecho chega ao fim da frase). Se o espeak der outros fonemas à palavra no trecho, a página mostra os dois ("no trecho").

Opções por palavra: *Ajustar*, *Manter* (o atual é melhor), *Manter, sem diferença* e *Nenhum dos dois* (com um campo para dizer o que incomoda).

Para ouvir e marcar, rode `python scripts/fonemas/servir_validacao.py` (qualquer python 3) e abra <http://localhost:5198/> num navegador. Cada resposta é gravada na hora em `referencias-fonemas/validacao-ajustes/respostas.json` (com todas as palavras, votos e notas; é o arquivo para analisar), e a versão anterior fica em `respostas.anterior.json`. Aberta como arquivo (ou no explorador de arquivos do Kedalion, que bloqueia downloads e `localStorage`), a página trava as opções, porque nada seria gravado. Para mudar só o HTML sem regerar os áudios: `--so-html`.

### Resultado da validação de 2026-11-07 (230 palavras)

| Regra | Ajustar | Manter | Sem diferença | Nenhum |
|---|---|---|---|---|
| final `ɐ`→`a` após vogal tônica (lua) | 20 | 8 | 2 | 3 |
| final `ɐ`→`a` após consoante (meta) | 20 | 5 | 2 | 13 |
| final `ʊ`→`o` (topo) | 8 | 1 | 13 | 12 |
| `ɾw`→`ɾu` (dentro) | 3 | 0 | 0 | 1 |
| `ĩm`→`ĩ` (mim) | 0 | 0 | 0 | 1 |
| `ŋ`→`n` (brincar) | 8 | 2 | 17 | 11 |
| nasal sem `n` (jeans) | 8 | 14 | 9 | 9 |
| `ɾ`→`ɾɾ` (ordens) | 18 | 1 | 8 | 13 |

As 85 marcadas *Ajustar* e as 4 *Nenhum* com nota "ajustar está melhor" (pedia, pula, toca, parte) entraram em `TROCAS_PALAVRA_PT_BR` (89 chaves).

**Por que o ajuste resolve em umas palavras e não em outras.** O que mais pesa não é o fonema, é a palavra estar sozinha:

| Onde está a palavra testada | Respostas | *Nenhum dos dois* |
|---|---|---|
| sozinha (o texto é só ela: rótulo, título, palavra de jogo) | 59 | **32 (54%)** |
| no começo do trecho | 26 | 6 (23%) |
| no meio | 79 | 17 (22%) |
| no fim | 66 | 8 (12%) |

- **Palavra sozinha.** 396 dos 1507 textos pt-BR são uma palavra só, e saem no ritmo normal, sem pausa antes. O modelo encurta a palavra: come o "r" (porta, corda, forno, barco, corvo, força, tartaruga), soa fanho (lobo, fogo, ovo, loja, grande) ou engole o começo. O "r" em fim de sílaba some em 16 de 23 palavras sozinhas e em 10 de 46 com vizinhas. Por isso o `ɾɾ` que salvou "ordens" (numa frase) não salvou "porta" (sozinha); a mesma palavra mostra isso: "O Morcego apareceu!" melhorou com `ɾɾ`, "O Morcego" (título) não. É o mesmo problema que `AJUSTES_PT_BR` já resolve para os números com ritmo mais lento (1.5) e pausa antes. Trocar fonema não resolve; o próximo passo é testar esse tratamento em todas as palavras sozinhas.
- **"r" em grupo de consoantes (`tɾ`, `dɾ`, `ɡɾ`), mesmo no meio da frase.** O modelo derruba o `ɾ` do grupo: dentro ("dentu"), vidro ("vidu"), tremendo ("temendo"), entrar, encontrou, encontrar, tronco, engrenagens. Nenhuma regra mexia no grupo; `ɾw`→`ɾu` só corrigiu o fim de primeiro, quatro e terceiro. Precisa de teste próprio (ex.: `tɾɾ`).
- **"r" final de verbo** (encontrar, entrar, engordar, dançar): também some, nas duas versões.
- **A troca depende do contexto.** A chave é o fonema que o espeak gera, e ele muda com a palavra seguinte e a pontuação: "dentro" é `dˈẽntɾw` antes de vogal e `dˈẽntɾʊ` antes de pausa, então a troca de dentro não pega em 8 frases do site, nem a de quatro em 11 (acordou 5, morcego 4, enorme 3...). Uma troca ouvida numa frase pode não valer na outra.
- **Fala rápida que junta palavras.** Com uma palavra curta depois ("pula por", "toca no", "entra no", "como Teo", "parte da", "pedia para"), as duas saem como uma palavra só. Pode ser efeito do trecho cortado; confirmar na frase inteira.
- **Padrões por regra** (fora das palavras sozinhas):
  - final `ɐ`→`a`: melhora, menos em "-gia" (`ʒˈiʲɐ`: magia, energia, rugia, elogia ficaram como estão).
  - `ʊ`→`o`: quase sempre sem diferença; ajuda em "-ório/-ógio" (relógio, escritório, laboratório).
  - `ŋ`→`n`: inaudível (17 sem diferença). O ganho de "brincar" deve ter vindo de outra coisa.
  - nasal sem `n`: depende da consoante seguinte. Ajuda antes de `s`/`ʒ`/`tʃ` (princesa, descansa, longe, conseguiu, ponte, quente, como jeans), piora antes de `k` (branca, cinco, nunca) e em "-enta" (quarenta, cinquenta...).
  - `ɾ`→`ɾɾ`: ajuda no meio da frase (18 a 1), não na palavra sozinha.

### Rodada 2 (testa os padrões acima)

`$PIPER_PYTHON scripts/fonemas/gerar_rodada2.py` gera `referencias-fonemas/validacao-rodada2/`. Para ouvir: `python scripts/fonemas/servir_validacao.py validacao-rodada2` e abrir <http://localhost:5198/>. As respostas vão para `validacao-rodada2/respostas.json`. Cada item tem 2 a 4 versões (A–D); a pessoa marca a melhor, *Sem diferença* ou *Nenhum serve*, e pode deixar uma observação.

| Grupo | O que testa | Versões |
|---|---|---|
| 1. Palavra sozinha (28) | é o ritmo ou o fonema? | atual · pausa antes · lento 1.5 + pausa · lento + pausa + `ɾɾ` |
| 2. "r" em grupo (16 frases novas) | dentro, vidro, tremendo... no meio da frase | atual · `ɾɾ` · `ɾː` |
| 3. "r" final de verbo (13 frases novas) | antes de consoante, de vogal e no fim | atual · `ɾɾ` · `x` |
| 4. Mesma palavra em 5 posições (30 frases novas) | porta, corda, morcego, forno, dentro, quatro: sozinha, começo, meio (antes de vogal / de consoante), fim | atual · `ɾɾ` |
| 5. Palavras que se juntam (8) | era o trecho curto ou acontece na frase? | trecho · frase inteira · frase lenta (1.3) |

As frases novas dos grupos 2 a 4 são só para o teste e não entram no site.

### Resultado da rodada 2 (2026-11-07, 94 respostas)

| Grupo | Resultado | O que virou regra (`scripts/piper_falar.py`) |
|---|---|---|
| 1. Palavra sozinha | O atual **nunca** foi o preferido. Lento + pausa: 11 (corda, forno, barco, corvo, força, fogo, loja, bola, gorro, árvore, cachorro); só pausa: 6 (janela, lâmpada, floresta, bicicleta, borboleta, ponte); lento + pausa + `ɾɾ`: 2; nenhum: 8. Com o ritmo lento o "r" volta sem precisar de `ɾɾ`. | `ajuste_palavra_solta`: todo texto de uma palavra ganha pausa antes; até 2 sílabas, ritmo 1.5. |
| 2. "r" em grupo | `ɾɾ` 12, sem diferença 4, atual 0, `ɾː` 0. | `R_GRUPO`: `ɾ` depois de p/b/t/d/k/g/f/v vira `ɾɾ`, em qualquer posição. |
| 3. "r" final de verbo | atual 5, `ɾɾ` 5, sem diferença 3, `x` 0. Sem padrão. | Nada. |
| 4. Mesma palavra em 5 posições | Na frase, `ɾɾ` ganhou 22 a 3 no começo e no meio. Na última palavra da frase: atual 2, sem diferença 1 (corda, forno, porta). Sozinhas sem ritmo lento: nenhum serve (porta, corda, morcego, forno). | `R_FIM_DE_SILABA`: `ɾ` no fim de sílaba vira `ɾɾ`, menos na última palavra da frase. |
| 5. Palavras que se juntam | Frase inteira: 7 de 8. Era efeito do trecho curto. | Nada. |

Conclusão: o "r" some quando a palavra sai rápida. Palavra sozinha precisa de ritmo; no meio da frase, `ɾɾ` dá ao "r" o tempo que falta; no fim da frase o modelo já desacelera e o `ɾɾ` sobra. Algumas trocas por palavra da rodada 1 (`ɾ`→`ɾɾ`) ficaram redundantes com as regras, mas não atrapalham.

Ainda sem solução (ouvidos na rodada 2): lobo soa "logo", ovo soa "ouvo", porco (o "o" de "por"), panela soa "pânela", pedra soa "pédra" (o "e" aberto está certo no pt-BR, mas algo na pronúncia soa errado; "pédra" foi o jeito de descrever o que se ouve), formiga soa "forniga", tartaruga perde o primeiro "r", bruxa (o "x"), "pares" soa "pais" (r entre vogais), "gordo" soa "goudo", "caixa" no fim de frase soa "caix", "dormir" rápido demais.

### Rodada 3 (confere as regras da rodada 2 e testa o que ficou sem solução)

`$PIPER_PYTHON scripts/fonemas/gerar_rodada3.py` gera `referencias-fonemas/validacao-rodada3/`. Para ouvir: `python scripts/fonemas/servir_validacao.py validacao-rodada3` e abrir <http://localhost:5198/> numa aba do navegador (não no explorador de arquivos do Kedalion, onde nada é gravado). As respostas vão para `validacao-rodada3/respostas.json`.

Diferenças da rodada 2: a versão testada troca a palavra **depois** de todas as correções do app (trocas por palavra, `R_GRUPO`, `R_FIM_DE_SILABA`), para que uma versão como "dɾ simples" não seja desfeita pelas regras; o identificador de cada item começa pelo grupo (na rodada 2 o mesmo texto em dois grupos dividiu áudio e voto); cada versão mostra também o ritmo.

| Grupo | O que testa | Versões |
|---|---|---|
| 0. Regras novas (25 textos reais do site, sorteio fixo) | 8 palavras sozinhas, 7 só `R_GRUPO`, 7 só `R_FIM_DE_SILABA`, 3 com as duas | antes das regras · atual |
| 1. Vogais em palavra sozinha (14) | lobo, ovo, porco, osso, sopa, boca ("o" fechado) | atual · `oː` (vogal curta?) · consoante dobrada (consoante fraca?) · final pleno `ʊ`→`o`, `ɐ`→`a` |
| | panela, banana, caneta, janela (`ɐ` átono antes de "n") | atual · `ˌa` · `a` sem acento · `ɐ` sem acento |
| | pedra sozinha (2 itens), pedra na frase, lebre | atual · `e` fechado · ritmo 1.3 / 1.15 (vogal longa?) · `dɾ` simples · `a` final · tônica fraca (`ˌɛ`) |
| 2. "r" entre vogais (13 frases) | pares, caro, para, hora, tesouro, agora, no meio e no fim | atual · `ɾː` · `ɾɾ` · vogal seguinte plena (`ɪ`→`i`...) |
| 3. "r" de fim de sílaba na última palavra (8 frases) | gordo, porco, forno (o), corda (ɔ), perto (ɛ), verde (e), barco (a) | atual · a outra forma (`ɾ` ou `ɾɾ`) |
| 4. Casos soltos (14) | formiga (`ɾɾ` × `mm`), tartaruga (`ɾɾ` × ritmo 1.3), `ɐ`→`a` na última palavra (caixa, casa, mesa, bola, janela), dormir (acento no "dor", `iː`, `ɾɾ`), bruxa (`ʃʃ` × `a` final) | 2 a 4 |

As frases dos grupos 1 a 4 são novas, só para o teste, e não entram no site (menos "Encontre os pares iguais!" e a frase de "gordo", que são do site). Observação ao montar: em "O cachorro não para." o espeak trata "para" como preposição (`pˌaɾɐ`, sem tônica).

### Resultado da rodada 3 (2026-11-07, 74 respostas)

| Grupo | Resultado | O que mudou (`scripts/piper_falar.py`) |
|---|---|---|
| 0. Regras novas | Atual 21, antes 1 ("Soprou, soprou", `pɾɾ`), sem diferença 2, nenhum 2 (colher, porta). As regras ficam. | Nada. |
| 1. "o" fechado sozinho | Consoante dobrada 4 de 6 (lobo, ovo, osso, sopa: `b`, `v`, `s`, `p`). Porco: final `o`. Boca: `oː`. | `O_CONSOANTE` (palavra sozinha); porco e boca em `TROCAS_PALAVRA_SOLTA_PT_BR`. |
| 1. `ɐ` átono antes de nasal | `a` pleno ganhou em janela (`ˌa`) e panela (`a` sem acento); banana e caneta sem diferença; só `ɐ` sem acento soou errado. | `A_ATONO_NASAL` (palavra sozinha): `ˌɐ` antes de n/m/ɲ vira `ˌa`; panela por palavra. |
| 1. pedra, lebre | O "pédra" vinha do `ɾɾ` depois do "é": `dɾ`/`bɾ` simples ganhou nos 4 itens (sozinha e na frase). Ritmo 1.3 ou 1.15 também resolvia; `e` fechado não. | `R_GRUPO` não vale depois de `ˈɛ`. |
| 2. "r" entre vogais | Quase tudo sem diferença; `ɾɾ` soou errado 3 vezes no fim da frase. "pares" na frase do site: vogal plena (`pˈaɾiz`). | Nada geral; pares por palavra. |
| 3. "r" de fim de sílaba na última palavra | `ɾɾ` ganhou 7 de 7 (gordo ×2, porco, forno, corda, verde, barco); perto sem diferença. Contradiz a rodada 2 (3 frases curtas no imperativo: "Puxe a corda."); a rodada 3 tem mais frases e todas as vogais. | `R_FIM_DE_SILABA` vale também na última palavra; só a palavra sozinha fica sem. |
| 4. `ɐ` final na última palavra | `a` ganhou 3 (caixa ×2, janela), sem diferença 3 (casa, mesa, bola), nunca perdeu. | `A_FINAL`: na última palavra da frase, `ɐ` final vira `a` (menos "-gia", que na rodada 1 ficou melhor como está). |
| 4. formiga, bruxa | formiga sozinha: `ɾɾ` + `mm` (na frase sem diferença). bruxa sozinha: `a` final (na frase sem diferença); `ʃʃ` não ajudou. | Formiga em `TROCAS_PALAVRA_PT_BR`, bruxa em `TROCAS_PALAVRA_SOLTA_PT_BR`. |
| 4. tartaruga, dormir | tartaruga soa "tarraruga" em todas as versões (o segundo "t" vira "r"). dormir: rápido demais em todas; "i longo" ganhou em 1 de 2. | Nada. |

"Palavra sozinha", nas regras de fonema, é a frase com uma palavra só (o texto "Pedra", ou "Dica:"). A rodada 3 também corrigiu um erro: o espeak devolve "Dica:" com um espaço no fim, e isso fazia esses rótulos contarem como duas palavras.

Por que um ajuste vale para umas palavras e não para outras:

- **`ɾɾ` em grupo** some com o "r" quando a vogal antes é um "é" tônico: o grupo já sai longo e o `ɾɾ` separa a sílaba ("pé-dra"). Nas outras vogais (dentro, vidro, quatro, livro) ele ajuda.
- **Fim da frase:** na rodada 2 o "r" da última palavra parecia não precisar de `ɾɾ`. Com mais frases, ajuda. Quem dispensa o `ɾɾ` é a palavra sozinha, que já sai lenta.
- **"o" fechado sozinho:** o problema era a consoante seguinte, fraca (b virava "g" em "logo"), não a vogal. Dobrar ajudou em `b`, `v`, `s`, `p`; não em `k` (boca) nem `ɾ` (porco).
- **"r" entre vogais:** não precisa de regra. O "pais" de "pares" vinha do `ɪ` seguinte, não do "r".

Combinações que as regras geram sem terem sido ouvidas juntas: última palavra com "r" de fim de sílaba e `ɐ` final (corda → `kˈɔɾɾda`), e palavras sozinhas que entram em `O_CONSOANTE` ou `A_ATONO_NASAL` sem terem sido testadas (poço, caminhão, chaminé, camiseta).

Ainda sem solução (rodada 3): **colher** sozinha soa como o verbo (o espeak dá `koʎˈeɾ`; o utensílio é `kuˈʎɛɾ` no BIPA; ouvir `kuljˈɛɾ` e `koljˈɛɾ`), **tartaruga** ("tarraruga"), **dormir** no fim da frase rápido demais, **porta** ainda estranha na frase ("...bloqueia a porta e grita..."), "Soprou" preferiu `pɾ` simples (um voto só), "brincar" (r final de verbo) e frases inteiras rápidas ("O brinquedo caro quebrou.").

## Limites

- **Palavra sozinha não é palavra na frase.** O espeak-ng gera fonemas diferentes para a mesma palavra isolada e dentro da frase (meta e topo acima). `comparar_fonemas.py` fonemiza cada palavra sozinha, então pode acusar divergência que não existe na frase e perder uma que existe. Ao testar um ajuste, ouça sempre a palavra dentro de uma frase real do site.
- Os números e palavras soltas (`AJUSTES_PT_BR`) são o único caso em que a palavra é falada sozinha pelo app.

- **395 palavras sem entrada no BIPA.** Quase todas são formas flexionadas ou com hífen (`acertou`, `aplaudiram`, `abre-te`, `acalmá-lo`, `comê-lo`), mais siglas e nomes (`app`, `arasaac`, `bremen`). A lista completa fica na última linha do relatório. Para essas não há validação automática ainda. Ideia futura: validar a flexão pela raiz, ou usar um segundo banco (Aeiouadô, MFA).
- **Possível vazamento de variante no pt-BR:** formas como `abre-te` aparecem na lista de palavras da variante pt-BR. Conferir de onde vêm esses textos (o CLAUDE.md pede uma variante por texto).
- A palavra é fonemizada **sozinha**; no meio da frase o espeak-ng pode pôr o acento ou ligar palavras de outro jeito. Isso não é medido.
- A referência concorda com o espeak-ng em parte dos casos por origem comum (veja "Cuidados com a referência").
- A comparação só enxerga fonemas. Ritmo, entonação e qualidade da voz continuam dependendo de ouvir.

## O que fazer com uma divergência

1. Ouvir a palavra no app (`npm run servidor`) ou gerar uma amostra.
2. Se estiver errada, em ordem de preferência:
   - ajustar os fonemas em `corrigir_fonemas` ou `AJUSTES_PT_BR` (`scripts/piper_falar.py`), como já foi feito para "espelho" e "lh";
   - trocar a palavra no texto por um sinônimo que o Piper fale bem;
   - como último recurso, escrever a palavra de outro jeito só no texto narrado (não na tela).
3. Regerar o áudio só dessa palavra: `npm run audio:piper -- --refazer-textos meta,topo`.

## Pt-PT

Pendente. Passos propostos:

1. Confirmar licença e formato do LUPo e do pt-lex; decidir qual serve de referência (pt-lex é pequeno; LUPo é a opção grande).
2. Escrever o conversor de notação (o pt-lex usa conjunto próprio) para o IPA do espeak-ng `pt-pt`.
3. Estender `comparar_fonemas.py` (hoje `MODELOS` e `carregar_referencia` só conhecem o pt-BR) e repetir o relatório para `pt_PT-tugão-medium`.

## Fontes

- BIPA (dataset, CC BY-SA 4.0): <https://huggingface.co/datasets/thiagomonteles/BIPA>
- pt-lex (léxico de português europeu, MIT): <https://github.com/msamribeiro/pt-lex>
- LUPo (Portuguese Unisyn Lexicon): <https://celga-iltec.uc.pt/lupo/>
- Aeiouadô (dicionário de pronúncia, falar de São Paulo; Mendonça e Aluísio, Interspeech 2014): <https://sites.google.com/view/nilc-usp/aeiouad%C3%B4>
- Montreal Forced Aligner, dicionário Portuguese v2.0.0: <https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20MFA%20dictionary%20v2_0_0.html>
- Dicionário de regras do espeak-ng para português (espelho Chromium; conferir a versão atual no repositório oficial do espeak-ng): <https://chromium.googlesource.com/chromiumos/third_party/espeak-ng/+/cd20ac3b30963450080f20b0dbd1cc8767fa6a1d/dictsource/pt_list>
- Vozes do Piper: <https://huggingface.co/rhasspy/piper-voices>
- Veiga et al. (2011), dicionário de pronúncia do português europeu por G2P (referência para o pt-PT): <https://preview.aclanthology.org/moar-dois/W11-4516.pdf>
