# Como gerar as imagens do jogo "Achar itens"

Cada cena do jogo é feita de **camadas**: um **fundo** e vários **itens soltos** com fundo transparente.
O jogo posiciona os itens sobre o fundo, então o toque é sempre exato.

Você precisa gerar, para cada cena:

| O quê | Formato | Nome do arquivo |
|---|---|---|
| 1 fundo | proporção **4:3** (ex.: 1600×1200), PNG ou JPG | `public/imagens/achar/<cena>/fundo.png` |
| N itens | **quadrados** (ex.: 1024×1024), PNG **com fundo transparente** | `public/imagens/achar/<cena>/<id-do-item>.png` |

A lista de itens (com os `id`s) de cada cena está no arquivo `src/jogos/achar/cenas/<cena>.ts`.
Para o Quintal, os `id`s são: `sol`, `passaro`, `arvore`, `casa`, `borboleta`, `gato`, `cao`, `flor`,
`abelha`, `bola`, `bicicleta`, `coelho`, `chapeu`, `maca`, `tartaruga`.

## A regra que mais importa: um estilo só

Escolha **um prompt de estilo** e copie-o **sem mudar uma vírgula** em todas as imagens da cena
(e em todas as cenas). Só troca o objeto. É isso que deixa tudo com cara de um mesmo livro.

### Prompt de estilo (ponto de partida; ajuste ao seu gosto, mas fixe)

```
Ilustração de livro infantil, desenho à mão em aquarela suave e lápis de cor, traço limpo e
arredondado, cores quentes e vivas, aparência amigável e fofa, sem texto, sem letras, sem números.
```

(Em inglês costuma obedecer melhor. Se o resultado ficar fraco, use a versão abaixo.)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
```

### Prompt de um item

```
[PROMPT DE ESTILO]
Um único objeto: [OBJETO], visto de lado/de frente, centralizado, inteiro e sem cortar nenhuma parte,
sobre fundo branco liso, sem sombra no chão, sem outros objetos.
```

Exemplo: `... Um único objeto: um gato sentado ...`

### Prompt do fundo

```
[PROMPT DE ESTILO]
Cenário de [LUGAR] visto de frente, em formato paisagem 4:3, com bastante espaço livre e vários
cantinhos onde se possa esconder coisas. Não desenhe nenhum animal, pessoa ou objeto solto
(só o cenário: céu, chão, árvores grandes, cerca, casa ao longe). Sem texto.
```

> Dica: itens soltos NÃO podem estar no fundo, senão a criança acha um "item" que não conta.

## Passo a passo: ChatGPT

1. Abra o ChatGPT e peça a imagem escrevendo o prompt completo (estilo + objeto). Escolha o formato
   quadrado para itens e paisagem para o fundo (diga no pedido: "formato quadrado" / "formato
   paisagem 4:3").
2. Gere **o primeiro item** (por exemplo, o gato) e só continue quando o estilo agradar.
3. Para os próximos, **na mesma conversa**, diga: *"Agora o mesmo estilo da imagem anterior: [objeto]"*.
   Manter tudo numa só conversa ajuda muito na consistência. Se ela começar a se desviar, anexe uma
   imagem boa e diga *"use esta imagem como referência de estilo"*.
4. Fundo transparente: peça *"PNG com fundo transparente"*. Se vier um quadriculado desenhado ou um
   fundo branco, não serve; gere sobre **fundo branco liso** e tire o fundo depois (veja abaixo).
5. Peça 2 ou 3 versões do mesmo item e fique com a melhor.

## Passo a passo: Flux e Recraft

**Recraft** (recraft.ai, mais prático para este caso)
1. Crie um **estilo próprio** a partir de 1 a 5 imagens que você gostou (ou escolha um estilo pronto de
   "ilustração infantil"/"digital illustration"). Use **sempre o mesmo estilo** nas imagens da cena.
2. Use o prompt do item e deixe o formato **1:1**. Para o fundo, escolha **4:3** ou o formato mais
   próximo.
3. Há uma ferramenta de **remover fundo** (Remove background): rode em cada item e exporte em **PNG**.
4. Confira a licença do plano que você usa (uso comercial/gratuito) antes de publicar.

**Flux** (pelo site oficial da Black Forest Labs ou por serviços que o usam, como fal.ai, Replicate,
Krea e outros)
1. Use o mesmo prompt de estilo + objeto. Prefira os modelos que aceitam **imagem de referência**
   (a família "Kontext" ou as versões mais novas): dê uma imagem aprovada e peça *"o mesmo estilo,
   agora um [objeto]"*.
2. O Flux em geral **não entrega transparência**: gere sobre fundo branco liso e remova o fundo
   depois.

## Tirar o fundo dos itens (quando a ferramenta não faz transparência)

Qualquer um destes serve, escolha o que preferir:
- **remove.bg** ou **Photoroom** (site, em lote).
- **Recraft** (ferramenta de remover fundo).
- Local e grátis: `pip install "rembg[cli]"` e depois `rembg p pasta_entrada pasta_saida`.

Confira se as bordas ficaram limpas (sem halo branco) em cima de um fundo colorido.

## Depois de gerar

1. Ponha os arquivos em `public/imagens/achar/<cena>/` com os nomes certos.
2. Me avise (ou troque você mesmo no arquivo da cena): em `src/jogos/achar/cenas/<cena>.ts`, preencha
   `fundo: 'imagens/achar/<cena>/fundo.png'` e troque cada `imagem` por
   `'imagens/achar/<cena>/<id>.png'`.
3. A **posição** (`x`, `y`, `largura`) de cada item fica no mesmo arquivo. Se me mandar o fundo, eu
   ajusto as posições para os itens ficarem bem escondidos e com sentido (gato no telhado, bola no
   gramado...).

## Uma cena nova

Ideias de temas: quarto, cozinha, praia, fazenda, parque, floresta, escola, cidade.
Para cada uma: 1 fundo + de 12 a 16 itens (o jogo sorteia 6 a cada rodada). Lembre que os nomes dos
itens precisam existir **nas duas variantes** (autocarro / ônibus, gelado / sorvete...).
