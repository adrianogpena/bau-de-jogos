# Validação de fonemas das vozes do Piper

Objetivo: conferir se o Piper pronuncia direito as palavras do site (as de hoje e as que entrarem), comparando os fonemas que ele usa com um banco de pronúncias de referência. Quando uma palavra divergir, decide-se se ela precisa de ajuste (veja "O que fazer com uma divergência").

Estado: **só pt-BR** está implementado (bancos BIPA e MFA). pt-PT está pendente (veja "Pt-PT").

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
| pt-BR | [MFA Portuguese (Brazil) dictionary v2.0.0a](https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20%28Brazil%29%20MFA%20dictionary%20v2_0_0a.html) | conjunto do MFA | CC BY 4.0 | **Em uso como segundo voto** (`--banco mfa`). 33 mil palavras, sem acento tônico, gerado por G2P (tem erros: org, lindas). |
| pt-PT | [MFA Portuguese (Portugal) dictionary](https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20%28Portugal%29%20MFA%20dictionary%20v2_0_0.html) | conjunto do MFA | CC BY 4.0 | Candidato para pt-PT (ainda não rodado). |

Cuidados com a referência:

- O BIPA sai do Wiktionary e parte dos fonemas dele vem do próprio eSpeak, então concordar com ele não prova que a pronúncia está certa. Divergir é o sinal útil.
- O MFA é gerado por G2P, não revisado à mão: tem erros (org, lindas), não marca o acento tônico e não escreve a consoante nasal depois da vogal nasal. Serve de segundo voto: se BIPA e MFA concordam contra o espeak-ng, ouvir a palavra primeiro; se só o MFA diverge, quase sempre é notação.
- O BIPA é só de palavras isoladas e tem muitas formas flexionadas faltando (veja "Limites"). O MFA cobre mais flexões (270 palavras do site só têm entrada nele).
- Licença CC BY-SA 4.0: o arquivo baixado fica fora do git (`referencias-fonemas/`). Se algum dado derivado for publicado no repositório, cite a fonte.

## Como rodar (pt-BR)

Pré-requisitos: o Python do projeto com o Piper (`.venv-piper/`, na raiz, fora do git; nada a instalar) e o modelo `modelos-piper/pt_BR-faber-medium.onnx` (veja `docs/NARRACAO-PIPER.md`). Nos comandos abaixo, `$PIPER_PYTHON` é `.venv-piper/Scripts/python`. Se a pasta não existir (outra máquina): `python -m venv .venv-piper` e `.venv-piper/Scripts/python -m pip install piper-tts`.

```bash
# 1. baixar o banco (uma vez; vai para referencias-fonemas/, fora do git)
mkdir -p referencias-fonemas
curl -L -o referencias-fonemas/bipa.tsv \
  https://huggingface.co/datasets/thiagomonteles/BIPA/resolve/main/por_bz_com_dialeto_55K.tsv

# 2. listar as palavras distintas das frases narradas (pt-PT e pt-BR)
node scripts/fonemas/extrair-palavras.mjs

# 3. comparar com o BIPA
$PIPER_PYTHON scripts/fonemas/comparar_fonemas.py pt-BR            # --limite N muda quantas divergências aparecem

# 4. baixar o MFA (uma vez; fora do git) e comparar com ele
mkdir -p referencias-fonemas/mfa
curl -L -o referencias-fonemas/mfa/br.dict   https://github.com/MontrealCorpusTools/mfa-models/releases/download/dictionary-portuguese_brazil_mfa-v2.0.0a/portuguese_brazil_mfa.dict
$PIPER_PYTHON scripts/fonemas/comparar_fonemas.py pt-BR --banco mfa   # gera relatorio-pt-BR-mfa.tsv; no Windows, use PYTHONIOENCODING=utf-8
```

Saída: resumo no terminal e `referencias-fonemas/relatorio-pt-BR.tsv` (BIPA) ou `relatorio-pt-BR-mfa.tsv` (MFA): palavra, distância, fonemas do Piper, melhor transcrição da referência, e a lista das palavras sem entrada no banco. Rode de novo ao acrescentar textos.

### Como a comparação funciona

- Para cada palavra, pega os fonemas do espeak-ng pelo Piper e todas as transcrições do BIPA dos dialetos Brasil, Rio de Janeiro, São Paulo e Sul (ou, com `--banco mfa`, as do dicionário do MFA, que não tem dialetos). Fica com a mais próxima (distância de edição) e relata essa distância. Distância 0 = igual.
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

### Resultado com o MFA (2026-11-07, pt-BR, voz Faber)

1634 palavras; 1327 têm entrada no MFA (1239 no BIPA); **1044 iguais**, 283 diferentes (229 com distância 1, 44 com 2, 10 com 3 ou mais). 1057 palavras estão nos dois bancos; 270 só no MFA, 182 só no BIPA.

- **Nos dois bancos, as mesmas 16 divergem do Piper:** chapeuzinho, velhinho, um, num, debaixo, aladim, assim, fim, mim, jardim, jeans, hall, névoa, ordens, skate, topo. É a lista da tabela acima: o MFA não acrescenta palavra nova. meta não aparece: o MFA lista `metɐ` e `mɛtɐ`.
- **185 só divergem no MFA** (o BIPA concorda com o Piper), quase todas notação: `i`/`u` no lugar de `e`/`o` átonos (esconde `iskõde`, descubra `dʒiskubɾɐ`), `x` no "r" de fim de sílaba, acento tônico ausente. 5 só divergem no BIPA.
- **Formas que o BIPA não tem** (acertou, desenhos, escorregou, encontrou...) agora têm referência; as divergências delas são do mesmo tipo (nasal, "e" inicial reduzido), nenhuma indica erro claro.
- **O que o MFA diz sobre os ajustes acima:**

| Ajuste | MFA |
|---|---|
| nasal sem `n`/`m` (mim, jeans, aladim, ordens) | Concorda: nunca escreve a consoante depois da vogal nasal (146 de 32.992 palavras). Mas também tira o `n` onde o ouvido preferiu mantê-lo (dentro `dẽtɾu`, aventura `avẽtuɾɐ`). |
| final `ɐ`→`a` (meta, lua, aventura) | **Não confirma:** `ɐ` final em 5615 palavras, `a` em 1846 (`mɛtɐ`, `luɐ`). O `a` é correção do modelo Faber, não de dicionário. |
| final `ʊ`→`o` (topo) | Não confirma: `topu`, como o BIPA. |
| `ɾw`→`ɾu` (dentro) | Concorda: `dẽtɾu`, `kwatɾu`, `vidɾu`. |
| `ɾɾ` em grupo e em fim de sílaba | Não mede: só tem `ɾ` e `x`. |
| colher `koljˈɛɾ` | Dividido: `koʎex`, `koʎɛx`, `kuʎex`. |

## Ajustes feitos a partir da comparação (ouvidos em frases)

Os ajustes por palavra ficam em `TROCAS_PALAVRA_PT_BR` (`scripts/piper_falar.py`): chave = fonemas do espeak, valor = fonemas usados. As que só valem para a palavra sozinha ficam em `TROCAS_PALAVRA_SOLTA_PT_BR` (rodada 3); uma troca da palavra para ela mesma ali (porta, rodada 4) deixa a palavra sozinha fora de `TROCAS_PALAVRA_PT_BR`. Desde a rodada 5 há também `TROCAS_ANTES_DE_PT_BR` (a palavra só muda antes de outra: "de" em "De repente"), `TROCAS_TEXTO_PT_BR` (o texto inteiro falado de outro jeito, sem mudar a tela) e `GRUPO_SIMPLES_PT_BR` (palavras em que o grupo de consoantes fica com um `ɾ` só). Depois de mudar, regerar com `npm run audio:piper -- --voz faber --refazer-palavras palavra1,palavra2` (refaz todo texto que contém a palavra).

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

### Rodada 4 (confere as regras da rodada 3 e testa o que ficou sem solução)

`$PIPER_PYTHON scripts/fonemas/gerar_rodada4.py` gera `referencias-fonemas/validacao-rodada4/`. Para ouvir: `python scripts/fonemas/servir_validacao.py validacao-rodada4` e abrir <http://localhost:5198/> numa aba do navegador (não no explorador de arquivos do Kedalion). As respostas vão para `validacao-rodada4/respostas.json`.

Diferenças da rodada 3: no grupo 0 a versão A roda o `scripts/piper_falar.py` do commit `5bbda3a` (antes da rodada 3), e a coluna da esquerda mostra as palavras que mudaram (antes → hoje); a mudança vale para todas as ocorrências da palavra no texto ("Soprou, soprou"); até 6 versões por item; o espaço que o espeak deixa no fim de algumas frases ("pedra: ") não desalinha mais as palavras.

| Grupo | O que testa | Versões |
|---|---|---|
| 0. Regras da rodada 3 (28 textos reais do site, sorteio fixo) | `A_FINAL`, `R_FIM_DE_SILABA` na última palavra, exceção do `R_GRUPO` depois de "é", `O_CONSOANTE`, `A_ATONO_NASAL` e as combinações (4 com "r" de fim de sílaba e `ɐ` final na última palavra: certa, surpresa, dorminhoca, Gárgula); poço, caminhão, chaminé, camiseta de propósito | antes da rodada 3 · atual |
| 1. colher (5) | sozinha, "colher de pau!", "colherzinhas" (site) e 2 frases novas | atual · `kuljˈɛɾ` · `koljˈɛɾ` · `kuljˈeɾ` |
| 2. tartaruga (3) | sozinha e 2 frases do site | atual · `tt` · `ɾ` simples ou `ɾɾ` (o contrário do atual) · sem acento secundário · secundário no segundo "ta" |
| 3. Verbo no fim da frase (9) | "Hora de dormir.", "Ele agora quer brincar." (novas) e 7 frases do site (dormir, brincar, chorar, fugir, comer, entrar, tremer) | atual · tônica longa (`iː`, `aː`, `eː`) · vírgula antes do verbo · os dois |
| 4. porta na frase (4 do site) | Golem, "O lobo bateu na porta...", "Na porta há...", "encosta o ombro na porta" | atual (`ɾɾ`) · `ɾ` simples · `ɔː` · `a` final |
| 5. `ɾɾ` em grupo (11 do site) | 3 com o grupo na sílaba tônica (soprou, soprar, abriu) e 8 sorteados com o grupo antes da tônica (aprendiz, primeiro, tremeu, trancou...) | atual · `ɾ` simples |
| 6. Frase curta (8) | 7 frases do site com 3 a 5 palavras e "O brinquedo caro quebrou." | ritmo 1.15 (atual) · 1.25 · 1.35 |

Observações ao montar: o espeak já dá "é" aberto em "colher" depois de artigo (`a colher` → `koljˈɛɾ`), mas não sozinha nem em "colher de pau" (`koljˈeɾ`). "Soprou" (so-PROU) tem o grupo na sílaba tônica, não antes dela; por isso o grupo 5 separa os dois casos. A versão "`ɾɾ` no dor" do grupo 3 não aparece: desde a rodada 3 ela já é a atual.

### Resultado da rodada 4 (2026-11-07, 68 respostas)

| Grupo | Resultado | O que mudou (`scripts/piper_falar.py`) |
|---|---|---|
| 0. `A_FINAL` | Atual 5 de 6 (ilha, estranha, matemática, praça, fenda); "chave de fenda!" nenhum (B melhor, mas "tchave"). | Nada. |
| 0. `R_FIM_DE_SILABA` na última | Sozinha: sem diferença 3 (forças, irmãos, irmão), antes 1 ("— disse aos irmãos."). Com `A_FINAL`: atual 4 de 4 (dorminhoca, certa, surpresa, Gárgula). | Nada. Na rodada 3 ganhou 7 de 7 com o "r" na sílaba tônica (gor-do); aqui, com o "r" antes da tônica (ir-mãos), não ajudou. Poucos dados para separar. |
| 0. Exceção do `R_GRUPO` depois de "é" | Atual 4, sem diferença 2. "A Lebre e a Tartaruga": nenhum ("la tataruga"). | Nada. |
| 0. `O_CONSOANTE`, `A_ATONO_NASAL` | Atual em sopa, ovo, janela, banana, caminhão (um pouco rápida), chaminé, camiseta. **poço: antes** (`pˈoso` ganhou de `pˈosso`). | `O_CONSOANTE` não dobra antes de "o" pleno. |
| 1. colher | O "é" aberto ganhou em todos: `koljˈɛɾ` sozinha, em "colher de pau!" e no fim da frase; `kuljˈɛɾ` em "colherzinhas" e no começo da frase. "u" ou "o" no "co" não fez padrão. | colher → `koljˈɛɾ`, colherzinhas → `kˌuljɛɾzˈiɲɐs` (`TROCAS_PALAVRA_PT_BR`). |
| 2. tartaruga | `tt` ganhou nos 3 ("o mais perto que já chegamos, mas não totalmente certo"). | tartaruga → `tˌaɾttaɾˈuɡɐ`. |
| 3. Verbo no fim | Tônica longa ganhou 7 de 9; comer sem diferença (leve preferência pela longa); "Hora de dormir." nenhum. A pausa antes nunca ganhou. | `TONICA_R_FINAL`: na última palavra da frase, vogal tônica + "r" final ganha `ː`. |
| 4. porta na frase | `ɔː` ganhou 3 de 4; na frase do Golem nenhum ("pôta": o "r" quase não se ouve). | porta → `pˈɔːɾɾtɐ` na frase; sozinha fica como está (`TROCAS_PALAVRA_SOLTA_PT_BR`). |
| 5. `ɾɾ` em grupo | Grupo na tônica: `ɾ` simples 3 de 3 (soprou, soprar, abriu). Antes da tônica: `ɾ` simples 3 (aprendiz, primeiro, tremeu), atual 2 (trabalhou, estragar), sem diferença 2, nenhum 1 (esfregou: "esfegou"). | `R_GRUPO` não dobra entre vogais antes da tônica ou nela (veja abaixo). |
| 6. Frase curta | Sem diferença 6 de 8; 1.25 ganhou 1 (lista "relógio, estante e baú."). "O brinquedo caro quebrou." nenhum ("caro" junta com "quebrou"). | Nada (a frase não é do site). |

Por que um ajuste vale para umas palavras e não para outras:

- **`ɾɾ` em grupo depende do que vem antes e de onde está a tônica.** Somando as rodadas 2 a 4: depois da tônica (dentro, vidro, livro, quatro, outro) o `ɾɾ` ganhou 5 de 5; no começo da palavra ou depois de consoante (tronco, prato, trinta, encontrou, engrenagens, estragar) ganhou ou empatou quase sempre. Entre vogais antes da tônica ou nela (so-prou, a-briu, a-pren-diz) o `ɾ` simples ganhou 5 de 5 votos (contando o "Soprou" da rodada 3). Começo de palavra antes da tônica (primeiro, tremeu, trabalhou, trancou, preferido) ficou dividido e continua com `ɾɾ`.
- **colher:** o que separa o utensílio do verbo é o "é" aberto; a vogal do "co" não importou.
- **tartaruga e porta:** nas duas o "r" de fim de sílaba fica fraco antes do "t" (o "t" vira "r" em tartaruga; porta soa "pôta" no Golem). Reforçar o "t" melhorou tartaruga; ainda não foi testado em porta.
- **Verbo no fim:** o ritmo da frase toda não muda nada (grupo 6), a pausa antes também não; o que ajuda é alongar só a vogal tônica.

`TONICA_R_FINAL` vale pelo fonema, então também pega substantivos no fim da frase (flor, mar, lugar), que não foram ouvidos.

Ainda sem solução (rodada 4): **Goblin** (`ɡoblˈĩm`: o "go" devia ser mais fechado, mais perto do inglês, com a tônica no começo), **porta** na frase do Golem ("pôta"; testar `tt` como em tartaruga), **tartaruga** ainda não totalmente certa ("A Lebre e a Tartaruga": falta força no primeiro "ta"), **"Hora de dormir."** (nenhuma versão), **esfregou** ("esfegou") e **estragar** ("estagar"), "chave" soando "tchave" em "chave de fenda!", "De repente" com o "de" fraco, o "r" de "ordem" fraco em "Pense bem na ordem certa!", **caminhão** sozinha um pouco rápida (3 sílabas, ritmo 1.15), e substantivos com `TONICA_R_FINAL` (flor, mar, lugar).

### Rodada 5 (confere as regras da rodada 4 e testa o que ficou sem solução)

`$PIPER_PYTHON scripts/fonemas/gerar_rodada5.py` gera `referencias-fonemas/validacao-rodada5/`. Para ouvir: `python scripts/fonemas/servir_validacao.py validacao-rodada5` e abrir <http://localhost:5198/> numa aba do navegador (não no explorador de arquivos do Kedalion). As respostas vão para `validacao-rodada5/respostas.json`.

Diferenças da rodada 4: no grupo 0 a versão A roda o `scripts/piper_falar.py` do commit `50d48e5` (antes da rodada 4); uma versão pode mudar outra palavra do texto (`alvo`: "hora" em "Hora de dormir."), a palavra anterior (`anterior`) ou trocar o texto todo (`texto`: a frase com "!").

| Grupo | O que testa | Versões |
|---|---|---|
| 0. Regras da rodada 4 (25 textos reais do site) | `TONICA_R_FINAL` (achar, flor, lugar, ar, fazer, cair...), `ɾ` simples do `R_GRUPO` (descobriram, cobria, agradeceu, ladrões, secreto, segredo, aprenda), trocas de tartaruga (sozinha e na frase), porta (inclusive "...e bateu na porta.") e colher, exceção do `O_CONSOANTE` (só poço muda no site) | antes da rodada 4 · atual |
| 1. "r" antes de "t"/"d" (10 do site) | porta (Golem, começo, fim), perto, certa, tarde, corda, gordo, verde, ordem ("Pense bem na ordem certa!") | atual · `tt`/`dd` · `ɾɾɾ` · `ɾɪ` (vogal de apoio) · porta: `ɔɾɾtt` (sem `ː`) |
| 2. tartaruga (2) | sozinha e "A Lebre e a Tartaruga" | atual · primário no 1º "ta" · `aː` no 1º "ta" · pausa antes ("e a, tartaruga") |
| 3. Goblin (3 do site, "Goblin Chefe") | `ɡoblˈĩn` hoje | atual · `ɡˈoblĩ` · `ɡˈɔblĩ` · `ɡˈoblin` · `ɡˈoblĩm` |
| 4. "Hora de dormir." + controle "O urso foi dormir." (novas) | dormir já sai `doɾɾmˈiːɾ` | atual · ritmo 1.3 · `ˈɔːɾɐ` em hora · com "!" · `doɾmˈiːɾ` |
| 5. "r" em grupo depois de "s" (8 do site) | estragar, esfregou, estrela, estrelinha, mostrar, rastro, estrondo, construiu | atual (`ɾɾ`) · `ɾɾɾ` · `ɾ` · `ttɾɾ`/`ffɾɾ` · "e" inicial curto (`ˈe` sem `ː`) |
| 6. "chave de fenda!" | "tchave" | atual · `ʃʃ` · `i` final pleno · `aː` |
| 7. "De repente," (3 do site) | "de" fraco | atual (`dʒɪ`) · `dʒi` · `de` · vírgula depois do "de" |
| 8. Palavra sozinha de 3 sílabas com nasal final (4 do site) | caminhão, Corações, esfregão!, Coragem | ritmo 1.15 (atual) · 1.3 · 1.5 (todas com pausa antes) |
| 9. "r" de fim de sílaba antes da tônica na última palavra (8 do site) | irmãos ×2, irmão, dorminhoca, surpresa, acertar, comercial, cortar | atual (`ɾɾ`) · `ɾ` simples |

Observações ao montar: "chave" sai `ʃˈavɪ`, sem acento secundário e com "a" pleno, então a versão "a pleno sem secundário" não existe; no lugar entram `i` final e `aː`. Em "A Lebre e a Tartaruga" o artigo já é `a`, então a versão "`ɐ`→`a` no artigo" sumiu. Nenhum texto do site termina em "mar". O `O_CONSOANTE` sem dobra antes de "o" só muda "poço".

### Resultado da rodada 5 (2026-11-07, 66 respostas)

| Grupo | Resultado | O que mudou (`scripts/piper_falar.py`) |
|---|---|---|
| 0. `TONICA_R_FINAL` | Verbos: atual 3 (achar, voltar, alcançar), sem diferença 3 (cair, entrar, fazer). Substantivos: flor **antes** ("flore"), lugar e ar sem diferença. | Só vale para "a", "e", "i" tônico (os infinitivos); "o" (flor) fica de fora. |
| 0. `ɾ` simples do `R_GRUPO` | **Antes 6** (ladrões ×3, secretos e segredo "com a língua presa", Aprenda), sem diferença 2 (cobria, agradeceu), atual 0. | A regra geral sai; o `ɾ` simples fica só nas palavras ouvidas com ele (`GRUPO_SIMPLES_PT_BR`: soprou, soprar, abriu, aprendiz). |
| 0. Trocas da rodada 4 | tartaruga 3, colher 2, poço 1: atual. porta: atual 1, sem diferença 1, nenhum 1 ("...bateu na porta.": "pôda"). | Nada (porta muda pelo grupo 1). |
| 1. "r" antes de "t"/"d" | Oclusiva dobrada 8 de 10 (porta ×3, uma delas sem `ː`; perto, certa, tarde, ordem); corda `ɾɾɾ` "por pouco"; gordo e verde sem diferença (em gordo, todas melhores que a atual). | `OCLUSIVA_DEPOIS_DE_R`: na frase, `ɾɾ` de fim de sílaba + `t`/`d` vira `ɾɾtt`/`ɾɾdd` (também `ddʒ`, `ttʃ`). porta fica com `ɔː`. |
| 2. tartaruga | Sozinha: `aː` no 1º "ta". Título: pausa antes. | Sozinha → `tˌaːɾttaɾˈuɡɐ`; o título é falado "A Lebre e a, Tartaruga" (`TROCAS_TEXTO_PT_BR`). |
| 3. Goblin | `ɡˈɔblĩ` 3 de 3. | Troca por palavra. |
| 4. "Hora de dormir." | Com "!" ganhou nas duas frases (as duas são novas). | Nada: no site o verbo no fim já foi resolvido pela tônica longa. |
| 5. "s" + grupo | Consoante dobrada 6 de 8 (estragar, estrela, estrelinha, mostrar, estrondo, construiu); `ɾɾɾ` 2 (esfregou: "o único em que ouvi o r"; rastro). | `S_GRUPO`: "s" + `p/b/t/d/k/ɡ/v` + `ɾɾ` antes da tônica ou nela dobra a consoante; esfregou e rastro com `ɾɾɾ` por palavra. |
| 6. chave | `aː` ganhou. | chave → `ʃˈaːvɪ` (ouvida só em "chave de fenda!"). |
| 7. "De repente," | `de` (sem chiado) 3 de 3. | `TROCAS_ANTES_DE_PT_BR`: "de" antes de "repente". Os outros "de" (27 textos começam com "de dano...") não mudam. |
| 8. Sozinha, 3 sílabas | Corações sem diferença, esfregão e Coragem: atual. caminhão: nenhum ("canião" em todas; 1.5 o mais perto). | Nada: o limite de 2 sílabas fica. |
| 9. "r" antes da tônica na última palavra | Atual 3 (irmãos, surpresa, acertar), sem diferença 5. Somando a rodada 4: `ɾɾ` 3, simples 1, sem diferença 8. | Nada. |

Por que um ajuste vale para umas palavras e não para outras:

- **`ɾ` simples no grupo:** somando as rodadas 3 a 5, entre vogais, antes da tônica ou nela, o `ɾ` simples ganhou em soprou, soprar, abriu e aprendiz, e perdeu em ladrões, secretos, segredo e aprenda (empate em cobria e agradeceu). A posição da tônica não separa os dois lados (so-PROU e la-DRÕES têm o grupo na tônica final), nem a consoante (aprendiz e aprenda são `pɾ`). Sem padrão, o `ɾɾ` volta a valer para todas, e as 4 que preferiram o simples ficam por palavra.
- **"r" fraco antes de consoante:** o mesmo remédio de tartaruga (reforçar a consoante seguinte) serviu para o "r" de fim de sílaba antes de `t`/`d` e para o "r" do grupo depois de "s". Nos dois casos o "r" fica espremido entre duas consoantes, e o `ɾɾ` sozinho não dava tempo a ele. Com "f" (esfregou) e com o grupo depois da tônica (rastro) ganhou o `ɾɾɾ`; são 2 palavras, por isso ficam por palavra.
- **`TONICA_R_FINAL`:** ajuda nos infinitivos, não nos substantivos. Com "o" (flor) o "r" longo vira uma sílaba a mais ("flore").
- **"Hora de dormir.":** o que ajudou foi a entonação da exclamação, não a duração.

Ainda sem solução (rodada 5): **caminhão** sozinha ("canião": o "mi" some em todos os ritmos; testar o `ɲ` como `nj`, como o `ʎ` → `lj`), **Clara** em "O que Clara quer fazer?" soa "Clark" (`klˈaɾɐ` no meio da frase; testar `klˈaɾa`), "Golem" (`ɡˈɔleɪŋ`, não ouvido), "deixa um" soa "deixa un", "sua voz" estranho em "quis mostrar sua voz.", e as combinações novas que ainda não foram ouvidas juntas: `ɾɾdd` em guardião (`ɡwˌaɾɾddʒiʲˈɐ̃ʊ̃`), acorda (`ˌakˈɔɾɾddɐ`) e as outras palavras com "r" antes de `t`/`d` no meio da frase.

## Limites

- **Palavra sozinha não é palavra na frase.** O espeak-ng gera fonemas diferentes para a mesma palavra isolada e dentro da frase (meta e topo acima). `comparar_fonemas.py` fonemiza cada palavra sozinha, então pode acusar divergência que não existe na frase e perder uma que existe. Ao testar um ajuste, ouça sempre a palavra dentro de uma frase real do site.
- Os números e palavras soltas (`AJUSTES_PT_BR`) são o único caso em que a palavra é falada sozinha pelo app.

- **395 palavras sem entrada no BIPA** (o MFA cobre parte delas: 307 ficam sem entrada nele; as 270 só do MFA são as formas flexionadas). Quase todas são formas flexionadas ou com hífen (`acertou`, `aplaudiram`, `abre-te`, `acalmá-lo`, `comê-lo`), mais siglas e nomes (`app`, `arasaac`, `bremen`). A lista completa fica na última linha do relatório. Para essas não há validação automática ainda. Ideia futura: validar a flexão pela raiz, ou usar mais um banco (Aeiouadô).
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
- Montreal Forced Aligner, dicionário Portuguese (Brazil) v2.0.0a (CC BY 4.0, usado em `--banco mfa`): <https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20%28Brazil%29%20MFA%20dictionary%20v2_0_0a.html>
- Montreal Forced Aligner, dicionário Portuguese v2.0.0: <https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20MFA%20dictionary%20v2_0_0.html>
- Dicionário de regras do espeak-ng para português (espelho Chromium; conferir a versão atual no repositório oficial do espeak-ng): <https://chromium.googlesource.com/chromiumos/third_party/espeak-ng/+/cd20ac3b30963450080f20b0dbd1cc8767fa6a1d/dictsource/pt_list>
- Vozes do Piper: <https://huggingface.co/rhasspy/piper-voices>
- Veiga et al. (2011), dicionário de pronúncia do português europeu por G2P (referência para o pt-PT): <https://preview.aclanthology.org/moar-dois/W11-4516.pdf>
