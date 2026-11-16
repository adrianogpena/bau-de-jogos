# Narrador com vozes da Microsoft (edge-tts)

O app usa vozes neurais da Microsoft, gravadas em MP3 e guardadas no projeto: **Raquel** (`pt-PT-RaquelNeural`) em pt-PT e **Thalita** (`pt-BR-ThalitaMultilingualNeural`) em pt-BR. Se o áudio de uma frase não existir ou falhar, a frase é lida pela voz do aparelho.

A Thalita é multilíngue e, em palavra solta ou frase curta, mistura inglês (testado). Por isso, em pt-BR, textos de até 4 palavras são gerados com a **Francisca** (`pt-BR-FranciscaNeural`, só português) e gravados na pasta da Thalita; o resto sai com a Thalita. A regra é `vozCurta` e `palavrasCurta` em `src/compartilhado/vozes-narrador.json`.

O áudio é gerado com o pacote Python **edge-tts**, que usa o serviço do Edge de forma não oficial (sem conta e sem custo). O app publicado só toca os MP3 já gravados; o serviço só é usado ao gerar áudio novo. Se o edge-tts parar de funcionar, o plano de reserva é o Azure Speech no plano Free F0: basta reescrever `sintetizar_frase()` em `scripts/narrador_falar.py` (o resto do gerador não muda).

Ritmo `-5%` e tom `+10Hz` (em `vozes-narrador.json`) deixam as vozes parecidas com a voz do aparelho no preset "natural" de `TextoNarrado.tsx` (velocidade 0.95, tom 1.05). O gerador corta o silêncio do começo e do fim.

Palavra isolada (1 palavra: países, itens, palavras das imagens) usa `ritmoPalavra` (`-30%`), mais lenta para quem está aprendendo a ler. Para regravar só essas: `npm run audio:narrador -- --refazer-palavras`. Em pt-BR a palavra isolada é falada dentro de `frasePalavra` ("Isto é {palavra}.") e recortada pelos tempos do serviço, porque a palavra solta sai com o R traquejado (Turquia, Brasil).

## Como funciona

Cada parágrafo lido vira um arquivo `public/audio/<variante>/<voz>/t/<código do texto>.mp3`. O áudio gravado não corta o parágrafo nas frases (`. ! ? : ;`): assim ele sai numa voz só e com entonação contínua (antes, "O caminho se divide:" saía com a Francisca no meio de um parágrafo da Thalita). Só a voz do aparelho lê frase a frase (`separarFrases` em `TextoNarrado.tsx`).

- **App publicado:** só toca as frases já geradas e guardadas no projeto: as histórias dos jogos de escrita e leitura e todos os textos fixos do site (os pares `'pt-PT'`/`'pt-BR'` do código, com o gênero do herói/mago expandido). **Frase com número: preferência pela frase inteira, num áudio só** (voz e entonação contínuas; validado nas frases de luta do RPG, vale para todo o projeto). Regra em `src/compartilhado/pecasDaFala.ts`: frase com **um único número de 0 a 20** (`NUMERO_MAXIMO_FRASE_INTEIRA`) é gravada inteira, com o número por extenso no texto ("Tiraste quinze"). Exceção: frase de moedas com **dois números** ("Tens 15 moedas de ouro e 5 moedas de prata"; prata de 0 a 9, ouro de 0 a 20) também é gravada inteira (`fraseInteira()` em `numeros.ts`). Quando gravar todas as combinações não cabe (mais de um número, ou número acima de 20), a frase é tocada em pedaços, usando os áudios dos números de 0 a 100 (por extenso, por variante): "Tiraste 25 contra a defesa 12" usa "Tiraste", "vinte e cinco", "contra a defesa", "doze". Ao acrescentar um texto com número, prefira montá-lo com um só número de faixa curta; o gerador (`frases-narradas.mjs`) grava o valor 0 a 20 e mais um acima de 20 (os pedaços). Antes de "moeda(s)" o número é dito no feminino ("uma moeda", "duas moedas"). Nomes de inimigos, itens, feitiços etc. são gerados em todas as combinações. Números acima de 100 ficam com a voz do aparelho.
- **Servidor de testes (`npm run servidor`):** uma frase sem áudio é gerada na hora (1 a 3 segundos, precisa de internet) e fica guardada em `public/audio/`. Assim dá para ouvir o RPG e o escape room com as vozes do narrador.
- **Gerar todas as histórias de uma vez:** `npm run audio:narrador` (com `-- --simular` só conta as frases). Se uma história mudar, rode de novo: só as frases novas são geradas.

## Como escrever texto narrado com números (regra)

O que multiplica os áudios é o número poder variar: cada valor possível é uma frase com áudio próprio. Por isso, ao criar ou mudar um texto narrado:

1. **Narração principal sem números, quando possível.** O narrador conta o que acontece ("O golpe foi fraco e o inimigo nem sentiu."); os números (dados, defesa, dano, equação) aparecem na tela, para a criança ver, e a linha com os números só é narrada se a criança tocar nela (aí vale a narração em pedaços).
2. **Lutas: frases por categoria de resultado**, não por valor de dado (crítico, acerto em cheio, acerto raspando, erro por pouco, erro feio; ataque do inimigo, cura e poção igual). Cada categoria tem de 3 a 4 frases por variante, sorteadas sem repetir a última, e nunca ligadas ao valor exato do dado. Frases genéricas ("o inimigo", sem nome de inimigo ou feitiço) para não multiplicar os áudios; nomes ficam na linha dos números.
3. **Problemas de soma e subtração: uma frase curta por número** ("Num cesto há {a} pães." / "No outro cesto há {b} pães."), cada uma com um número só, para valer a regra de frase inteira. Contas na luta mágica: a conta fica na tela e a narração só pergunta ou comemora, sem os números.
4. **Placares e linhas de status** ("{n} de {total}", "Dicas usadas: {n}", linha da loja, dica do dado) ficam em pedaços: são curtos e secundários.
5. **Sem exceção por conta própria:** frase com mais de um número só é gravada inteira para contagem de moedas (`fraseInteira()`); qualquer outra regra nova precisa caber na conta de áudios (`npm run audio:narrador -- --simular`).

## Conferir os áudios (teste)

```bash
npm test                          # falha se alguma frase das histórias estiver sem áudio
npm run audio:narrador -- --podar    # apaga os áudios de textos que não existem mais
```

O teste de rótulos (`scripts/rotulos.test.mjs`) falha se houver texto escrito direto no JSX, fora de um par `'pt-PT'`/`'pt-BR'`. O teste (`scripts/audio.test.mjs`) calcula todas as frases fixas do site (`frasesDoSite()` em `scripts/frases-narradas.mjs`) nas duas variantes e confere se o `.mp3` de cada uma existe e não está vazio. Como o nome do arquivo é o hash do texto, **qualquer texto fixo alterado ou acrescentado fica sem áudio** e o teste falha.

Fluxo ao mexer em uma história: edite o texto, rode `npm run audio:narrador` (gera só o que falta), ouça as frases novas e inclua `public/audio/` no commit. O teste roda sozinho no `git push` (hook em `.githooks/pre-push`, ativado por `npm install`) e no GitHub (Testes e Publicar).

## Preparar (uma vez)

1. Python 3.10+ com `edge-tts` e `imageio-ffmpeg` (traz o ffmpeg), num ambiente fora do git:

```bash
py -3.10 -m venv "%LOCALAPPDATA%au-edge-tts"
"%LOCALAPPDATA%au-edge-tts\Scripts\python.exe" -m pip install edge-tts imageio-ffmpeg
```

2. O gerador acha esse Python sozinho no Windows; em outro sistema, ou em outro lugar, aponte com `NARRADOR_PYTHON=/caminho/do/python`.
3. Precisa de internet ao gerar. O gerador grava as vozes ao mesmo tempo, com 4 requisições em paralelo por voz (`--paralelo N`), tenta de novo quando falha e pode ser interrompido e retomado (pula o que já existe). `npm run audio:narrador -- --simular` conta frases e caracteres.
4. **Velocidade:** cada conexão fica aberta e serve todos os pedidos dela, e cada pedido leva até 8 falas como texto corrido, recortadas depois pelas marcas de frase do serviço (`--frases-por-pedido 1` desliga). Palavras soltas recortadas de `frasePalavra` vão sempre uma por pedido (no lote saíam com o fim do "é": "arede"). Marcas SSML (`<break>`, `<bookmark>`, `<lang>`) não servem: o serviço fecha a conexão.
5. **Sotaque da Thalita nos feitiços:** com `virgulaAposFeitico`, "Faísca Mágica! Causa…" é dito como "Faísca Mágica, causa…" (só o áudio; a tela não muda). Sozinho, o nome do feitiço saía com sotaque de inglês.
6. **Andamento:** no terminal aparece uma barra com porcentagem, velocidade e tempo restante (fora de um terminal, como no Shell details do Claude Code, uma linha a cada 10 s). De outro terminal, ou de outra sessão, `npm run audio:andamento` mostra o andamento e a previsão de término; `npm run audio:acompanhar` fica mostrando, atualizado a cada 2 s, até a geração acabar. Só roda uma geração por vez: uma segunda é recusada, porque as duas disputariam o serviço e ficariam bem mais lentas.

## Usar

```bash
npm run servidor     # http://localhost:5199/bau-de-jogos/
```

## Ouvir o site com a voz do aparelho (teste)

Abrir o site com `?voz=aparelho` (ex.: <http://localhost:5199/bau-de-jogos/?voz=aparelho>) faz o site inteiro ignorar os áudios gravados e usar a voz do aparelho. No Windows com Edge é a Microsoft Thalita (Natural) em pt-BR e a Raquel (Natural) em pt-PT (`vozPreferida` em `src/compartilhado/TextoNarrado.tsx`). A escolha fica guardada no aparelho; `?voz=gravado` volta aos áudios gravados. Num tablet Android ou iPad, a voz do aparelho é outra.

## Trocar de voz

Edite `src/compartilhado/vozes-narrador.json` (`id` é o nome da pasta do áudio, `voz` é o nome da voz do edge-tts, `ritmo`, `tom`) e rode `npm run audio:narrador -- --refazer`. O app usa a primeira voz de cada variante. Lista de vozes: `edge-tts --list-voices`.

## Limites

- Os áudios do app publicado não ficam guardados para uso offline; sem internet, a leitura usa a voz do aparelho.
- O destaque da palavra lida acompanha o áudio por uma estimativa (proporcional ao tamanho das palavras, com um peso para a pausa depois de `. ! ? : ;` e da vírgula: `PESO_PAUSA_FRASE` e `PESO_PAUSA_VIRGULA` em `narradorAudio.ts`), então pode adiantar ou atrasar um pouco (cerca de 0,2 s).
- Texto montado na tela com dois textos fixos no mesmo parágrafo ou botão (ex.: `{t(A)} {t(B)}`) não tem áudio: o narrador grava o parágrafo inteiro, não frase a frase. Junte os dois num par `'pt-PT'`/`'pt-BR'` só.
