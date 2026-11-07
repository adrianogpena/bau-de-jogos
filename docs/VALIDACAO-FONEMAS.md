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

Os ajustes por palavra ficam em `TROCAS_PALAVRA_PT_BR` (`scripts/piper_falar.py`): chave = fonemas do espeak, valor = fonemas usados. Depois de mudar, regerar com `npm run audio:piper -- --voz faber --refazer-palavras palavra1,palavra2` (refaz todo texto que contém a palavra).

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
