# Testar vozes do Piper no app

O Piper é um narrador gratuito que roda no seu computador (sem internet). No servidor de testes, o menu inicial ganha o grupo **Voz**: *Aparelho* (a voz do tablet/navegador, como sempre) e as vozes do Piper da variante escolhida. A escolha vale para **todos os textos do app** (histórias, RPG, escape room, leitura ao segurar botões).

| Variante | Vozes |
|---|---|
| pt-PT | Tugão |
| pt-BR | Cadu, Faber, Jeff |

Todas são vozes de qualidade média, treinadas com dados CC0 (domínio público) a partir de vozes inglesas. Antes de publicar o app com elas, confira a licença das vozes inglesas de origem (lessac).

## Como funciona

Cada frase lida vira um arquivo `public/audio/<variante>/<voz>/t/<código do texto>.mp3`. Na primeira vez que uma frase é lida com uma voz, o servidor de testes a gera na hora (cerca de 1 a 2 segundos de espera); nas próximas já está pronta. Se algo falhar, a frase é lida pela voz do aparelho. Esses arquivos são só um cache de testes e não vão para o git.

## Preparar (uma vez)

1. `python3 -m pip install piper-tts` (de preferência em um ambiente virtual) e ter o `ffmpeg` instalado.
2. Baixar os modelos para a pasta `modelos-piper/` na raiz do projeto (ela não vai para o git):

```bash
mkdir -p modelos-piper && cd modelos-piper
B=https://huggingface.co/rhasspy/piper-voices/resolve/main/pt
for v in pt_PT/tugão pt_BR/cadu pt_BR/faber pt_BR/jeff; do
  l=${v%%/*}; n=${v##*/}
  for ext in onnx onnx.json; do curl -L -O "$B/$l/$n/medium/$l-$n-medium.$ext"; done
done
```

3. Se o `python3` do sistema não for o que tem o Piper, aponte para o certo: `PIPER_PYTHON=/caminho/do/python`. Para guardar os modelos em outra pasta: `PIPER_MODELOS=/outra/pasta`.

## Usar

```bash
npm run servidor     # http://localhost:5199/bau-de-jogos/
```

No menu, escolha o idioma e depois a voz. Toque em qualquer texto para ouvir. Jogue normalmente e compare as vozes com as frases de cada jogo.

## Adicionar ou trocar vozes

Edite `src/compartilhado/vozes-narrador.json` (id, nome, variante e arquivo do modelo) e coloque o `.onnx` em `modelos-piper/`. Outras vozes: <https://huggingface.co/rhasspy/piper-voices>.

## Limites

- A troca de voz só aparece em `npm run servidor`/`npm run dev`, não no app publicado. Para publicar uma voz, os áudios precisam ser gerados e entrar no projeto (próximo passo).
- O destaque da palavra lida acompanha o áudio por uma estimativa (proporcional ao tamanho das palavras), então pode adiantar ou atrasar um pouco.
