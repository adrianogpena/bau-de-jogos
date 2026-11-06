# Narrador com vozes do Piper

O Piper é um narrador gratuito que roda no computador (sem internet). O app usa **Tugão** (pt-PT) e **Faber** (pt-BR) como voz do narrador. Se o áudio de uma frase não existir ou falhar, a frase é lida pela voz do aparelho.

Ambas são vozes de qualidade média, treinadas com dados CC0 (domínio público) a partir de vozes inglesas. Antes de cobrar pelo app, confira a licença das vozes inglesas de origem (lessac).

## Como funciona

Cada frase lida vira um arquivo `public/audio/<variante>/<voz>/t/<código do texto>.mp3`.

- **App publicado:** só toca as frases já geradas e guardadas no projeto: as histórias dos jogos de escrita e leitura. O resto fica com a voz do aparelho.
- **Servidor de testes (`npm run servidor`):** uma frase sem áudio é gerada na hora (1 a 2 segundos) e fica guardada em `public/audio/`. Assim dá para ouvir o RPG e o escape room com a voz do Piper.
- **Gerar todas as histórias de uma vez:** `npm run audio:piper` (com `-- --simular` só conta as frases). Se uma história mudar, rode de novo: só as frases novas são geradas.

## Preparar (uma vez)

1. `python3 -m pip install piper-tts` (de preferência em um ambiente virtual) e ter o `ffmpeg` instalado.
2. Baixar os modelos para a pasta `modelos-piper/` na raiz do projeto (ela não vai para o git):

```bash
mkdir -p modelos-piper && cd modelos-piper
B=https://huggingface.co/rhasspy/piper-voices/resolve/main/pt
for v in pt_PT/tugão pt_BR/faber; do
  l=${v%%/*}; n=${v##*/}
  for ext in onnx onnx.json; do curl -L -O "$B/$l/$n/medium/$l-$n-medium.$ext"; done
done
```

3. Se o `python3` do sistema não for o que tem o Piper, aponte para o certo: `PIPER_PYTHON=/caminho/do/python`. Para guardar os modelos em outra pasta: `PIPER_MODELOS=/outra/pasta`.

## Usar

```bash
npm run servidor     # http://localhost:5199/bau-de-jogos/
```

## Trocar de voz

Edite `src/compartilhado/vozes-narrador.json` (id, nome, variante e arquivo do modelo), coloque o `.onnx` em `modelos-piper/` e rode `npm run audio:piper`. O app usa a primeira voz de cada variante. Outras vozes: <https://huggingface.co/rhasspy/piper-voices>.

## Limites

- Os áudios do app publicado não ficam guardados para uso offline; sem internet, a leitura usa a voz do aparelho.
- O destaque da palavra lida acompanha o áudio por uma estimativa (proporcional ao tamanho das palavras), então pode adiantar ou atrasar um pouco.
