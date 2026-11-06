# Como gerar as imagens do jogo "Achar itens"

Cada cena é feita de **camadas**: um **fundo** e vários **itens soltos** com fundo transparente. O jogo
posiciona os itens sobre o fundo (e os esconde atrás de móveis), então o toque é sempre exato.
**O Quarto é a cena-modelo**: as outras seguem o mesmo estilo, a mesma perspectiva e o mesmo formato.

| O quê | Formato | Arquivo |
|---|---|---|
| 1 fundo por cena | proporção **4:3** (ex.: 1600×1200) | `public/imagens/achar/<cena>/fundo.jpg` |
| N itens por cena | **quadrados** (ex.: 1024×1024), PNG **fundo transparente** | `public/imagens/achar/<cena>/<id>.png` |

Itens compartilhados entre cenários (lista no fim) ficam **na pasta da primeira cena que os usa** e são
gerados uma só vez; o código da cena aponta para o arquivo.

## Regra de ouro: um estilo só

Copie o prompt de estilo **sem mudar uma vírgula** em todas as imagens de todas as cenas. Só troca o
conteúdo. Em inglês obedece melhor.

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
```

Prompt de **itens** (uma imagem com **6 objetos**; troque `[OBJECT 1]` a `[OBJECT 6]` pelas descrições
em inglês da lista, mesmo prompt para todos):

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
[OBJECT 1], [OBJECT 2], [OBJECT 3], [OBJECT 4], [OBJECT 5], [OBJECT 6].
Similar size for all objects, no shadows on the floor, no other objects. Landscape format.
```

**O fundo dos itens tem de ser branco puro**, sem tom creme, bege ou cinza: a skill separa os objetos
pelo fundo branco. Se vier tingido, gere de novo (ou peça: *"Same image, change only the background to pure
white #FFFFFF"*).

Depois rode `/split-image-objects <caminho da imagem>`: a skill separa os objetos, tira o fundo e salva
um PNG transparente por objeto em `split-output/`. Peça para ignorar o que não quiser e informe a pasta
`public/imagens/achar/<cena>` como destino, para nomear os arquivos pelo `id` e não repetir nomes.
Se dois objetos grudarem no preview numerado, gere de novo com mais espaço.

Prompt de **fundo** (troque `[ROOM]` e `[FURNITURE]` pelos da seção da cena):

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Front view of [ROOM], landscape 4:3, [FURNITURE], plenty of free floor space and many
nooks where things can hide. Empty of loose objects: no toys, clothes, tools, food or small
items lying around, no people, no animals. Only the room and its big furniture.
Furniture must be completely bare: no cushions, pillows, blankets, throws or anything placed on
top of the furniture or the floor (books and plants already inside the shelves are fine).
Full-bleed illustration: the scene fills the whole image edge to edge, no frame, no border,
no rounded corners, no vignette, no white or blank margin; walls, ceiling and floor reach
every edge of the image.
```

Se mesmo assim vier com moldura ou objetos soltos, gere de novo anexando a imagem e peça só o
ajuste: *"Use this image as the base and change only: [problema]. Keep the same room, furniture,
layout, colors and style."*

> Itens soltos **não podem** estar no fundo, senão a criança acha um "item" que não conta. Plantas,
> livros, cestos e móveis fazem parte do fundo.

## Passo a passo (ChatGPT, Recraft, Flux)

1. Gere **o primeiro grupo de 6** e só continue quando o estilo agradar. Os seguintes, **na mesma
   conversa**: *"Agora o mesmo estilo da imagem anterior, com estes 6 objetos: ..."*. Se desviar, anexe
   uma imagem boa como referência.
2. Peça 2 ou 3 versões e fique com a melhor. Agrupe objetos de tamanho parecido na mesma imagem.
3. Separe com `/split-image-objects` (tira o fundo e corta cada objeto). Confira bordas limpas sobre
   fundo colorido, sem halo branco.
4. Confira a licença do plano (uso comercial) antes de publicar.

## Depois de gerar

1. Ponha os arquivos em `public/imagens/achar/<cena>/`.
2. Crie `src/jogos/achar/cenas/<cena>.ts` (modelo: `quarto.ts`) e liste em `cenas/index.ts`.
3. Posições, tamanhos e esconderijos ficam no arquivo da cena; ajusto quando o fundo existir.

Cada item precisa de palavra **nas duas variantes** (pt-PT / pt-BR). Ver a coluna de cada tabela.

---

# Cenários

Legenda: ✅ = imagem já existe. Os itens abaixo são **exclusivos** do cenário; os que combinam com
vários estão em "Itens compartilhados", no fim.

## 1. Quarto ✅ (fundo e itens existem)

- **Fundo** (`[ROOM]` / `[FURNITURE]`): `a child's bedroom` / `a bed with a blanket and pillow, a bedside
  table with a lamp, a big toy chest, a chest of drawers, a window with curtains, a shelf with books,
  a rug on the floor`
- **Itens exclusivos já prontos** ✅: chapéu, luva, cachecol, tênis, camiseta, camisola, jeans, saia,
  vestido, gorro, bota, patinho, pião, helicóptero, barco, trem, ônibus, robô, fantoche, caixa de
  surpresa, cavalinho, tambor, xilofone, ioiô, corda de pular, caleidoscópio.

## 2. Sala de estar ✅ (fundo pronto em `public/imagens/achar/sala/fundo.jpg`; faltam os itens)

- **Fundo**: `a cozy living room` / `a big sofa, an armchair, a low coffee table, a TV
  stand with a TV, a bookcase, a window with curtains, a rug, a floor lamp`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| comando | comando | controle remoto | a TV remote control |
| puzzle | puzzle | quebra-cabeça | a small jigsaw puzzle with a few colorful pieces |
| domino | dominó | dominó | a domino tile |
| damas | jogo de damas | jogo de damas | a checkers game board with a few round pieces |
| novelo | novelo de lã | novelo de lã | a ball of red wool yarn with knitting needles |
| violao | guitarra | violão | a small acoustic guitar |
| flauta | flauta | flauta | a recorder flute |
| chocalho | maracas | maracas | a pair of maracas |
| pandeireta | pandeireta | pandeiro | a tambourine |
| moldura | moldura | porta-retratos | a photo frame with a simple drawing of a house inside |
| pantufa-par | chinelos de quarto | pantufas | a pair of cozy slippers |
| vaso-flor | vaso com flor | vaso com flor | a small flower pot with one flower |
| almofada | almofada | almofada | a soft square cushion |
| jornal | jornal | jornal | a rolled newspaper with no readable text |
| oculos | óculos | óculos | round eyeglasses |
| gato-brinquedo | gato de peluche | gato de pelúcia | a plush toy cat |

## 3. Cozinha ✅ (fundo pronto em `public/imagens/achar/cozinha/fundo.jpg`; faltam os itens)

- **Fundo**: `a cheerful kitchen` / `kitchen cabinets, a stove with an oven, a sink, a fridge, a round
  table with two chairs, a window with curtains, shelves with jars (closed), a tiled floor`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| colher-pau | colher de pau | colher de pau | a wooden spoon |
| concha-sopa | concha | concha de sopa | a soup ladle |
| panela | panela | panela | a small cooking pot with a lid |
| frigideira | frigideira | frigideira | a frying pan |
| chaleira | chaleira | chaleira | a kettle |
| tabua | tábua de cortar | tábua de cortar | a wooden cutting board |
| rolo-massa | rolo da massa | rolo de macarrão | a rolling pin |
| batedor | batedor de arames | batedor de ovos | a whisk |
| avental | avental | avental | a folded apron |
| luva-forno | luva de cozinha | luva de forno | an oven mitt |
| maca | maçã | maçã | a red apple |
| banana | banana | banana | a banana |
| tomate | tomate | tomate | a tomato |
| cenoura | cenoura | cenoura | a carrot |
| ovo | ovo | ovo | a single egg |
| pao | pão | pão | a loaf of bread |
| queijo | queijo | queijo | a wedge of cheese with holes |
| bolacha | bolacha | biscoito | a round cookie |
| uvas | uvas | uvas | a bunch of grapes |
| limao | limão | limão | a lemon |

## 4. Casa de banho (banheiro) ✅ (fundo pronto em `public/imagens/achar/banheiro/fundo.jpg`; faltam os itens)

- **Fundo**: `a bathroom` / `a bathtub with a shower curtain, a sink with a mirror, a toilet, a small
  cabinet, a towel rack, a laundry hamper, a bath mat, a tiled floor`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| sabonete | sabonete | sabonete | a bar of soap |
| escova-dentes | escova de dentes | escova de dentes | a toothbrush |
| pasta-dentes | pasta de dentes | pasta de dente | a tube of toothpaste with no text |
| pente | pente | pente | a hair comb |
| escova-cabelo | escova de cabelo | escova de cabelo | a hairbrush |
| toalha | toalha | toalha | a folded towel |
| esponja | esponja | esponja | a bath sponge |
| champo | champô | xampu | a shampoo bottle with no text |
| papel-higienico | rolo de papel higiénico | rolo de papel higiênico | a toilet paper roll |
| espelho-mao | espelho de mão | espelho de mão | a hand mirror |
| secador | secador de cabelo | secador de cabelo | a hair dryer |
| elastico | elástico de cabelo | elástico de cabelo | a hair tie |
| touca-banho | touca de banho | touca de banho | a shower cap |
| barquinho-banho | barquinho de banho | barquinho de banho | a small floating toy boat |
| bolhas | bolas de sabão | bolhas de sabão | a bubble wand with soap bubbles |
| cotonete | cotonete | cotonete | a cotton swab |

## 5. Escritório (cantinho de estudo) ✅ (fundo pronto em `public/imagens/achar/escritorio/fundo.jpg`; faltam os itens)

- **Fundo**: `a home study room` / `a desk with a chair, a bookshelf, a wall map, a drawer unit, a
  window, a floor rug, a wastebasket`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| caneta | caneta | caneta | a pen |
| regua | régua | régua | a ruler with no numbers |
| caderno | caderno | caderno | a closed notebook |
| agrafador | agrafador | grampeador | a stapler |
| clipe | clipe | clipe | a paper clip |
| cola | cola | cola | a glue stick with no text |
| calculadora | calculadora | calculadora | a calculator with blank buttons |
| apara-lapis | apara-lápis | apontador | a pencil sharpener |
| fita-cola | fita-cola | fita adesiva | a roll of tape |
| envelope | envelope | envelope | a closed envelope |
| cadeado | cadeado | cadeado | a padlock |
| chave | chave | chave | a small key |
| bussola | bússola | bússola | a compass |
| candeeiro-mesa | candeeiro de secretária | luminária de mesa | a desk lamp |
| mapa | mapa | mapa | a rolled paper map |
| lupa | lupa | lupa | a magnifying glass |
| pasta | pasta | pasta | a folder |
| tinteiro | tinteiro | tinteiro | an ink bottle with a feather pen |

## 6. Lavandaria (área de serviço) ✅ (fundo pronto em `public/imagens/achar/lavanderia/fundo.jpg`; faltam os itens)

- **Fundo**: `a laundry room` / `a washing machine, a dryer, a utility sink, a clothesline with no
  clothes, shelves with closed boxes, a tall cabinet, a wicker basket (empty), a tiled floor`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| mola-roupa | mola da roupa | pregador de roupa | a wooden clothespin |
| cabide | cabide | cabide | a clothes hanger |
| detergente | detergente | sabão em pó | a laundry detergent box with no text |
| esfregona | esfregona | esfregão | a mop |
| vassoura | vassoura | vassoura | a broom |
| pa-lixo | pá do lixo | pá de lixo | a dustpan |
| luvas-borracha | luvas de borracha | luvas de borracha | a pair of rubber gloves |
| ferro | ferro de engomar | ferro de passar | a clothes iron |
| tabua-passar | tábua de engomar | tábua de passar | a small ironing board |
| esponja-loica | esponja | esponja | a scrubbing sponge |
| bola-la | bola de lã | bola de lã | a ball of yarn |
| lenco | lenço | lenço | a folded handkerchief |
| sabao-barra | sabão em barra | sabão em barra | a bar of laundry soap |
| balde-agua | balde | balde | a plastic bucket |

## 7. Garagem (oficina) ✅ (fundo pronto em `public/imagens/achar/garagem/fundo.jpg`; faltam os itens)

- **Fundo**: `a garage workshop` / `a workbench, wall shelves with closed boxes, a pegboard with no
  tools, a parked car seen from the front, a ladder against the wall, a stack of cardboard boxes, a
  concrete floor`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| martelo | martelo | martelo | a hammer |
| chave-inglesa | chave inglesa | chave inglesa | an adjustable wrench |
| chave-fendas | chave de fendas | chave de fenda | a screwdriver |
| alicate | alicate | alicate | pliers |
| serrote | serrote | serrote | a hand saw |
| parafuso | parafuso | parafuso | a big screw |
| prego | prego | prego | a nail |
| fita-metrica | fita métrica | trena | a tape measure |
| caixa-ferramentas | caixa de ferramentas | caixa de ferramentas | a toolbox |
| bomba-ar | bomba de ar | bomba de ar | a bicycle pump |
| lata-tinta | lata de tinta | lata de tinta | a paint can with a brush |
| funil | funil | funil | a funnel |
| triciclo | triciclo | triciclo | a small tricycle |
| skate | skate | skate | a skateboard |
| patins | patins | patins | a pair of roller skates |
| capacete | capacete | capacete | a bicycle helmet |

## 8. Quintal (jardim) ✅ (fundo pronto em `public/imagens/achar/quintal/fundo.jpg`; faltam os itens)

- **Fundo**: `a backyard garden` / `a big tree, a wooden fence, a small shed, flower beds, a bush, a
  garden bench, a path of stones, a swing, grass`

| id | pt-PT | pt-BR | descrição para o prompt |
|---|---|---|---|
| regador | regador | regador | a watering can |
| pa-jardim | pá | pá | a small garden shovel |
| ancinho | ancinho | ancinho | a garden rake |
| mangueira | mangueira | mangueira | a coiled garden hose |
| luvas-jardim | luvas de jardinagem | luvas de jardinagem | gardening gloves |
| flor | flor | flor | a daisy flower |
| girassol | girassol | girassol | a sunflower |
| cogumelo | cogumelo | cogumelo | a red mushroom with white dots |
| pinha | pinha | pinha | a pine cone |
| folha | folha | folha | a green leaf |
| joaninha | joaninha | joaninha | a ladybug |
| borboleta | borboleta | borboleta | a butterfly |
| caracol | caracol | caracol | a snail |
| minhoca | minhoca | minhoca | an earthworm |
| abelha | abelha | abelha | a bee |
| sapo | sapo | sapo | a green frog |
| passaro | pássaro | passarinho | a small bird |
| ninho | ninho | ninho | a bird nest with eggs |
| casa-passaro | casa de pássaros | casinha de passarinho | a wooden birdhouse |
| coelho | coelho | coelho | a rabbit |

---

# Itens compartilhados (gerar uma vez, valem para vários cenários)

Combinam com mais de um cômodo. Gerados e salvos numa pasta só; cada cena os referencia. Organize a
geração por esta lista, depois use onde fizer sentido.

| id | pt-PT | pt-BR | descrição para o prompt | combina com |
|---|---|---|---|---|
| bola ✅ | bola | bola | a ball | quarto, sala, quintal, garagem |
| ursinho ✅ | urso de peluche | ursinho | a teddy bear | quarto, sala |
| boneca ✅ | boneca | boneca | a rag doll | quarto, sala |
| carro ✅ | carrinho | carrinho | a toy car | quarto, sala, garagem |
| blocos ✅ | cubos de construção | blocos de montar | toy building blocks | quarto, sala |
| aviao ✅ | avião | avião | a toy airplane | quarto, sala, quintal |
| pipa ✅ | papagaio de papel | pipa | a kite | quarto, quintal, sala |
| raquete ✅ | raquete | raquete | a tennis racket | quarto, quintal, garagem |
| lapis ✅ | lápis | lápis | a pencil | quarto, escritório, sala |
| pincel ✅ | pincel | pincel | a paintbrush | quarto, escritório |
| giz-de-cera ✅ | lápis de cera | giz de cera | a crayon | quarto, escritório, sala |
| tesoura ✅ | tesoura | tesoura | scissors | quarto, escritório, cozinha |
| diario ✅ | diário | diário | a diary | quarto, escritório |
| globo ✅ | globo terrestre | globo terrestre | a world globe | quarto, escritório, sala |
| despertador ✅ | despertador | despertador | an alarm clock | quarto, cozinha |
| relogio-parede ✅ | relógio de parede | relógio de parede | a wall clock | quarto, sala, cozinha |
| meia ✅ | meia | meia | a sock | quarto, lavandaria, sala |
| pantufa ✅ | pantufa | pantufa | a slipper | quarto, sala, casa de banho |
| casaco ✅ | casaco | casaco | a jacket | quarto, lavandaria, garagem |
| chapeu-palha ✅ | chapéu de palha | chapéu de palha | a straw hat | quintal, garagem |
| galochas ✅ | galochas | botas de chuva | rain boots | garagem, quintal |
| impermeavel ✅ | impermeável | capa de chuva | a raincoat | garagem, quintal |
| sandalia ✅ | sandália | sandália | a sandal | quintal, casa de banho, quarto |
| livro | livro | livro | a closed picture book with no title | quarto, sala, escritório |
| almofada | almofada | almofada | a soft cushion | quarto, sala |
| candeeiro | candeeiro | abajur | a small table lamp | quarto, sala, escritório |
| bicicleta | bicicleta | bicicleta | a small bicycle | quintal, garagem |
| lanterna | lanterna | lanterna | a flashlight | quarto, garagem, quintal |
| guarda-chuva | guarda-chuva | guarda-chuva | a closed umbrella | garagem, quintal, sala |
| balde | balde | balde | a beach bucket | quintal, lavandaria, casa de banho |
| cesto | cesto | cesto | a small wicker basket | quarto, lavandaria, cozinha |
| copo | copo | copo | a drinking cup | cozinha, casa de banho, quarto |
| chavena | chávena | xícara | a tea cup | cozinha, sala |
| prato | prato | prato | a round plate | cozinha, quintal |
| garrafa | garrafa | garrafa | a water bottle with no label | cozinha, quintal, garagem |
| toalha-mao | toalha | toalha | a folded towel | casa de banho, lavandaria |
| chinelo | chinelo | chinelo | a flip-flop | casa de banho, quintal, quarto |
| oculos-sol | óculos de sol | óculos de sol | sunglasses | quintal, sala, quarto |
| telefone | telefone | telefone | a toy phone | quarto, sala, escritório |
| mochila | mochila | mochila | a school backpack | quarto, escritório |
| relogio-pulso | relógio de pulso | relógio de pulso | a wristwatch | quarto, casa de banho, escritório |
| espelho | espelho | espelho | a small round mirror | quarto, casa de banho |
| chave-casa | chave | chave | a small house key | escritório, garagem, sala |
| moeda | moeda | moeda | a gold coin | sala, quarto, escritório |

---

# Lista em inglês (para colar no prompt)

Um objeto por linha: `id` = texto que entra em um dos `[OBJECT 1..6]`; junte de 6 em 6. Itens ✅ já existem.

### 2. Sala de estar

```
comando = a TV remote control
puzzle = a small jigsaw puzzle with a few colorful pieces
domino = a domino tile
damas = a checkers game board with a few round pieces
novelo = a ball of red wool yarn with knitting needles
violao = a small acoustic guitar
flauta = a recorder flute
chocalho = a pair of maracas
pandeireta = a tambourine
moldura = a photo frame with a simple drawing of a house inside
pantufa-par = a pair of cozy slippers
vaso-flor = a small flower pot with one flower
almofada = a soft square cushion
jornal = a rolled newspaper with no readable text
oculos = round eyeglasses
gato-brinquedo = a plush toy cat
```

### 3. Cozinha

```
colher-pau = a wooden spoon
concha-sopa = a soup ladle
panela = a small cooking pot with a lid
frigideira = a frying pan
chaleira = a kettle
tabua = a wooden cutting board
rolo-massa = a rolling pin
batedor = a whisk
avental = a folded apron
luva-forno = an oven mitt
maca = a red apple
banana = a banana
tomate = a tomato
cenoura = a carrot
ovo = a single egg
pao = a loaf of bread
queijo = a wedge of cheese with holes
bolacha = a round cookie
uvas = a bunch of grapes
limao = a lemon
```

### 4. Casa de banho (banheiro)

```
sabonete = a bar of soap
escova-dentes = a toothbrush
pasta-dentes = a tube of toothpaste with no text
pente = a hair comb
escova-cabelo = a hairbrush
toalha = a folded towel
esponja = a bath sponge
champo = a shampoo bottle with no text
papel-higienico = a toilet paper roll
espelho-mao = a hand mirror
secador = a hair dryer
elastico = a hair tie
touca-banho = a shower cap
barquinho-banho = a small floating toy boat
bolhas = a bubble wand with soap bubbles
cotonete = a cotton swab
```

### 5. Escritório (cantinho de estudo)

```
caneta = a pen
regua = a ruler with no numbers
caderno = a closed notebook
agrafador = a stapler
clipe = a paper clip
cola = a glue stick with no text
calculadora = a calculator with blank buttons
apara-lapis = a pencil sharpener
fita-cola = a roll of tape
envelope = a closed envelope
cadeado = a padlock
chave = a small key
bussola = a compass
candeeiro-mesa = a desk lamp
mapa = a rolled paper map
lupa = a magnifying glass
pasta = a folder
tinteiro = an ink bottle with a feather pen
```

### 6. Lavandaria (área de serviço)

```
mola-roupa = a wooden clothespin
cabide = a clothes hanger
detergente = a laundry detergent box with no text
esfregona = a mop
vassoura = a broom
pa-lixo = a dustpan
luvas-borracha = a pair of rubber gloves
ferro = a clothes iron
tabua-passar = a small ironing board
esponja-loica = a scrubbing sponge
bola-la = a ball of yarn
lenco = a folded handkerchief
sabao-barra = a bar of laundry soap
balde-agua = a plastic bucket
```

### 7. Garagem (oficina)

```
martelo = a hammer
chave-inglesa = an adjustable wrench
chave-fendas = a screwdriver
alicate = pliers
serrote = a hand saw
parafuso = a big screw
prego = a nail
fita-metrica = a tape measure
caixa-ferramentas = a toolbox
bomba-ar = a bicycle pump
lata-tinta = a paint can with a brush
funil = a funnel
triciclo = a small tricycle
skate = a skateboard
patins = a pair of roller skates
capacete = a bicycle helmet
```

### 8. Quintal (jardim)

```
regador = a watering can
pa-jardim = a small garden shovel
ancinho = a garden rake
mangueira = a coiled garden hose
luvas-jardim = gardening gloves
flor = a daisy flower
girassol = a sunflower
cogumelo = a red mushroom with white dots
pinha = a pine cone
folha = a green leaf
joaninha = a ladybug
borboleta = a butterfly
caracol = a snail
minhoca = an earthworm
abelha = a bee
sapo = a green frog
passaro = a small bird
ninho = a bird nest with eggs
casa-passaro = a wooden birdhouse
coelho = a rabbit
```

### Itens compartilhados (gerar uma vez, valem para vários cenários)

```
bola ✅ = a ball
ursinho ✅ = a teddy bear
boneca ✅ = a rag doll
carro ✅ = a toy car
blocos ✅ = toy building blocks
aviao ✅ = a toy airplane
pipa ✅ = a kite
raquete ✅ = a tennis racket
lapis ✅ = a pencil
pincel ✅ = a paintbrush
giz-de-cera ✅ = a crayon
tesoura ✅ = scissors
diario ✅ = a diary
globo ✅ = a world globe
despertador ✅ = an alarm clock
relogio-parede ✅ = a wall clock
meia ✅ = a sock
pantufa ✅ = a slipper
casaco ✅ = a jacket
chapeu-palha ✅ = a straw hat
galochas ✅ = rain boots
impermeavel ✅ = a raincoat
sandalia ✅ = a sandal
livro = a closed picture book with no title
almofada = a soft cushion
candeeiro = a small table lamp
bicicleta = a small bicycle
lanterna = a flashlight
guarda-chuva = a closed umbrella
balde = a beach bucket
cesto = a small wicker basket
copo = a drinking cup
chavena = a tea cup
prato = a round plate
garrafa = a water bottle with no label
toalha-mao = a folded towel
chinelo = a flip-flop
oculos-sol = sunglasses
telefone = a toy phone
mochila = a school backpack
relogio-pulso = a wristwatch
espelho = a small round mirror
chave-casa = a small house key
moeda = a gold coin
```

---

# Prompts prontos (6 objetos por imagem)

Copie o bloco inteiro. A ordem dos objetos no prompt é a ordem da imagem: **linha de cima da esquerda para a direita, depois a de baixo**. Use a ordem dos `id`s para nomear os arquivos na `/split-image-objects` e salve cada um na pasta indicada entre parênteses.

Notas:
- Itens ✅ foram pulados. Também ficaram de fora `almofada` da Sala, `pantufa-par` e `chave-casa` (repetem itens que já existem em outra lista).
- Todos os prompts abaixo exigem **fundo branco puro (#FFFFFF)**, sem tom creme/bege (o Prompt 6 saiu bege e a skill teve de ser ajustada). Confira o fundo antes de separar; se vier tingido, gere de novo.
- Ajustes no prompt: tamanho visual parecido entre os 6 e `bolhas` com as bolhas coladas na varinha (para a skill não separá-las).

### Prompt 1

ids: `comando` (sala), `puzzle` (sala), `domino` (sala), `damas` (sala), `novelo` (sala), `violao` (sala)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a TV remote control, a small jigsaw puzzle with a few colorful pieces, a domino tile, a checkers game board with a few round pieces, a ball of red wool yarn with knitting needles, a small acoustic guitar.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 2

ids: `flauta` (sala), `chocalho` (sala), `pandeireta` (sala), `moldura` (sala), `vaso-flor` (sala), `jornal` (sala)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a recorder flute, a pair of maracas, a tambourine, a photo frame with a simple drawing of a house inside, a small flower pot with one flower, a rolled newspaper with no readable text.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 3

ids: `oculos` (sala), `gato-brinquedo` (sala), `colher-pau` (cozinha), `concha-sopa` (cozinha), `panela` (cozinha), `frigideira` (cozinha)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
round eyeglasses, a plush toy cat, a wooden spoon, a soup ladle, a small cooking pot with a lid, a frying pan.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 4

ids: `chaleira` (cozinha), `tabua` (cozinha), `rolo-massa` (cozinha), `batedor` (cozinha), `avental` (cozinha), `luva-forno` (cozinha)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a kettle, a wooden cutting board, a rolling pin, a whisk, a folded apron, an oven mitt.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 5

ids: `maca` (cozinha), `banana` (cozinha), `tomate` (cozinha), `cenoura` (cozinha), `ovo` (cozinha), `pao` (cozinha)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a red apple, a banana, a tomato, a carrot, a single egg, a loaf of bread.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 6

ids: `queijo` (cozinha), `bolacha` (cozinha), `uvas` (cozinha), `limao` (cozinha), `sabonete` (banheiro), `escova-dentes` (banheiro)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a wedge of cheese with holes, a round cookie, a bunch of grapes, a lemon, a bar of soap, a toothbrush.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 7

ids: `pasta-dentes` (banheiro), `pente` (banheiro), `escova-cabelo` (banheiro), `toalha` (banheiro), `esponja` (banheiro), `champo` (banheiro)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a tube of toothpaste with no text, a hair comb, a hairbrush, a folded towel, a bath sponge, a shampoo bottle with no text.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 8

ids: `papel-higienico` (banheiro), `espelho-mao` (banheiro), `secador` (banheiro), `elastico` (banheiro), `touca-banho` (banheiro), `barquinho-banho` (banheiro)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a toilet paper roll, a hand mirror, a hair dryer, a hair tie, a shower cap, a small floating toy boat.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 9

ids: `bolhas` (banheiro), `cotonete` (banheiro), `caneta` (escritorio), `regua` (escritorio), `caderno` (escritorio), `agrafador` (escritorio)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a bubble wand with two or three soap bubbles touching the wand, a cotton swab, a pen, a ruler with no numbers, a closed notebook, a stapler.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 10

ids: `clipe` (escritorio), `cola` (escritorio), `calculadora` (escritorio), `apara-lapis` (escritorio), `fita-cola` (escritorio), `envelope` (escritorio)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a paper clip, a glue stick with no text, a calculator with blank buttons, a pencil sharpener, a roll of tape, a closed envelope.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 11

ids: `cadeado` (escritorio), `chave` (escritorio), `bussola` (escritorio), `candeeiro-mesa` (escritorio), `mapa` (escritorio), `lupa` (escritorio)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a padlock, a small key, a compass, a desk lamp, a rolled paper map, a magnifying glass.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 12

ids: `pasta` (escritorio), `tinteiro` (escritorio), `mola-roupa` (lavanderia), `cabide` (lavanderia), `detergente` (lavanderia), `esfregona` (lavanderia)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a folder, an ink bottle with a feather pen, a wooden clothespin, a clothes hanger, a laundry detergent box with no text, a mop.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 13

ids: `vassoura` (lavanderia), `pa-lixo` (lavanderia), `luvas-borracha` (lavanderia), `ferro` (lavanderia), `tabua-passar` (lavanderia), `esponja-loica` (lavanderia)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a broom, a dustpan, a pair of rubber gloves, a clothes iron, a small ironing board, a scrubbing sponge.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 14

ids: `bola-la` (lavanderia), `lenco` (lavanderia), `sabao-barra` (lavanderia), `balde-agua` (lavanderia), `martelo` (garagem), `chave-inglesa` (garagem)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a ball of yarn, a folded handkerchief, a bar of laundry soap, a plastic bucket, a hammer, an adjustable wrench.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 15

ids: `chave-fendas` (garagem), `alicate` (garagem), `serrote` (garagem), `parafuso` (garagem), `prego` (garagem), `fita-metrica` (garagem)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a screwdriver, pliers, a hand saw, a big screw, a nail, a tape measure.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 16

ids: `caixa-ferramentas` (garagem), `bomba-ar` (garagem), `lata-tinta` (garagem), `funil` (garagem), `triciclo` (garagem), `skate` (garagem)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a toolbox, a bicycle pump, a paint can with a brush, a funnel, a small tricycle, a skateboard.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 17

ids: `patins` (garagem), `capacete` (garagem), `regador` (quintal), `pa-jardim` (quintal), `ancinho` (quintal), `mangueira` (quintal)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a pair of roller skates, a bicycle helmet, a watering can, a small garden shovel, a garden rake, a coiled garden hose.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 18

ids: `luvas-jardim` (quintal), `flor` (quintal), `girassol` (quintal), `cogumelo` (quintal), `pinha` (quintal), `folha` (quintal)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
gardening gloves, a daisy flower, a sunflower, a red mushroom with white dots, a pine cone, a green leaf.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 19

ids: `joaninha` (quintal), `borboleta` (quintal), `caracol` (quintal), `minhoca` (quintal), `abelha` (quintal), `sapo` (quintal)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a ladybug, a butterfly, a snail, an earthworm, a bee, a green frog.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 20

ids: `passaro` (quintal), `ninho` (quintal), `casa-passaro` (quintal), `coelho` (quintal), `livro` (quarto), `almofada` (quarto)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a small bird, a bird nest with eggs, a wooden birdhouse, a rabbit, a closed picture book with no title, a soft cushion.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 21

ids: `candeeiro` (quarto), `bicicleta` (quintal), `lanterna` (quarto), `guarda-chuva` (garagem), `balde` (quintal), `cesto` (quarto)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a small table lamp, a small bicycle, a flashlight, a closed umbrella, a beach bucket, a small wicker basket.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 22

ids: `copo` (cozinha), `chavena` (cozinha), `prato` (cozinha), `garrafa` (cozinha), `toalha-mao` (banheiro), `chinelo` (banheiro)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
a drinking cup, a tea cup, a round plate, a water bottle with no label, a folded towel, a flip-flop.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```

### Prompt 23

ids: `oculos-sol` (quintal), `telefone` (quarto), `mochila` (quarto), `relogio-pulso` (quarto), `espelho` (quarto), `moeda` (sala)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded
outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Six separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or
gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap,
each one whole and not cropped, arranged in two rows of three:
sunglasses, a toy phone, a school backpack, a wristwatch, a small round mirror, a gold coin.
All objects drawn at a similar visual size (draw small things larger and big things smaller),
no shadows on the floor, no other objects. Landscape format.
```
