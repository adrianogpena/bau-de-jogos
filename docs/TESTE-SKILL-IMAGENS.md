# Lista básica para testar `/split-image-objects`

Gere **uma imagem com vários objetos** (no Nano Banana ou outro), depois rode
`/split-image-objects <caminho da imagem>` e peça para ignorar um deles. Os PNGs saem em `split-output/`
(ignorado pelo git).

## Objetos (6, todos brinquedos simples)

| objeto | tem em `quarto/`? | uso no teste |
|---|---|---|
| robô | não | recortar |
| avião | não | recortar |
| boneca | não | recortar |
| ônibus (pt-PT: autocarro) | não | recortar |
| pião | sim (`piao.png`) | recortar: testa o nome repetido (`piao-2.png`) com `--avoid` na pasta `quarto` |
| patinho de borracha | sim (`patinho.png`) | **ignorar**: diga "ignore o patinho" |

## Prompt (copie sem mudar o estilo)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate toys on a plain white background, clearly spaced apart so none touch or overlap:
a robot, a toy airplane, a rag doll, a toy bus, a spinning top and a rubber duck.
No shadows on the floor, no other objects.
```

## O que conferir

1. O preview numerado mostra 6 objetos separados (se dois grudarem, gere de novo com mais espaço).
2. O patinho não aparece em `split-output/`.
3. `piao-2.png` aparece quando a pasta `public/imagens/achar/quarto` é informada como destino.
4. Bordas limpas sobre um fundo colorido, sem halo branco.
