# Narrador com vozes da Microsoft (edge-tts)

O app usa vozes neurais da Microsoft, gravadas em MP3 e guardadas no projeto: **Raquel** (`pt-PT-RaquelNeural`) em pt-PT e **Thalita** (`pt-BR-ThalitaMultilingualNeural`) em pt-BR. Se o áudio de uma frase não existir ou falhar, a frase é lida pela voz do aparelho.

A Thalita é multilíngue e, em palavra solta ou frase curta, mistura inglês (testado). Por isso, em pt-BR, textos de até 4 palavras são gerados com a **Francisca** (`pt-BR-FranciscaNeural`, só português) e gravados na pasta da Thalita; o resto sai com a Thalita. A regra é `vozCurta` e `palavrasCurta` em `src/compartilhado/vozes-narrador.json`.

O áudio é gerado com o pacote Python **edge-tts**, que usa o serviço do Edge de forma não oficial (sem conta e sem custo). O app publicado só toca os MP3 já gravados; o serviço só é usado ao gerar áudio novo. Se o edge-tts parar de funcionar, o plano de reserva é o Azure Speech no plano Free F0: basta reescrever `sintetizar_frase()` em `scripts/narrador_falar.py` (o resto do gerador não muda).

Ritmo `-5%` e tom `+10Hz` (em `vozes-narrador.json`) deixam as vozes parecidas com a voz do aparelho no preset "natural" de `TextoNarrado.tsx` (velocidade 0.95, tom 1.05). O gerador corta o silêncio do começo e do fim.

## Como funciona

Cada frase lida vira um arquivo `public/audio/<variante>/<voz>/t/<código do texto>.mp3`.

- **App publicado:** só toca as frases já geradas e guardadas no projeto: as histórias dos jogos de escrita e leitura e todos os textos fixos do site (os pares `'pt-PT'`/`'pt-BR'` do código, com o gênero do herói/mago expandido). Números de 0 a 100 têm áudio próprio (por extenso, por variante) e a frase é tocada em pedaços (`src/compartilhado/pecasDaFala.ts`): "Tiraste 15 contra a defesa 12" usa os áudios "Tiraste", "quinze", "contra a defesa", "doze". Nomes de inimigos, itens, feitiços etc. são gerados em todas as combinações. Números acima de 100 ficam com a voz do aparelho.
- **Servidor de testes (`npm run servidor`):** uma frase sem áudio é gerada na hora (1 a 3 segundos, precisa de internet) e fica guardada em `public/audio/`. Assim dá para ouvir o RPG e o escape room com as vozes do narrador.
- **Gerar todas as histórias de uma vez:** `npm run audio:narrador` (com `-- --simular` só conta as frases). Se uma história mudar, rode de novo: só as frases novas são geradas.

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
3. Precisa de internet ao gerar. O gerador usa 3 requisições em paralelo, tenta de novo quando falha e pode ser interrompido e retomado (pula o que já existe). `npm run audio:narrador -- --simular` conta frases e caracteres.

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
- O destaque da palavra lida acompanha o áudio por uma estimativa (proporcional ao tamanho das palavras), então pode adiantar ou atrasar um pouco.
