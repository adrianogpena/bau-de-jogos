# Prompts de imagens ainda não geradas

Fila de imagens que o usuário precisa gerar. **Quando a imagem for adicionada ao projeto, apague o prompt daqui.**
Regras de uso: veja "Imagens novas" no `CLAUDE.md`. Todos os prompts em **inglês**.

Estilo único (já usado em `docs/GERAR-IMAGENS.md`), incluído no começo de cada prompt:

> Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.

Formatos possíveis: **1:1**, **9:16**, **3:4**, **4:3**, **16:9**.

---

## Palavras dos jogos de Escrita e Leitura — 90 imagens em 18 prompts

As palavras abaixo ainda usam pictogramas do ARASAAC (`public/imagens/arasaac/<número>.png`). Estes prompts geram imagens no estilo do app para substituí-los. As outras 32 palavras já usam imagens de `public/imagens/itens/`.

Cada prompt traz até 5 objetos em fundo branco puro; depois a skill `split-image-objects` separa cada um em `public/imagens/itens/<nome>.png` (pasta compartilhada entre os jogos; o nome do arquivo vem do cabeçalho, na ordem do prompt). Depois de salvar, ponha `arquivo: '<nome>'` na palavra em `src/compartilhado/palavras.ts`. Formato **4:3**. A imagem é a mesma em pt-PT e pt-BR (por isso fica neutra, sem texto).

### palavras-01 (5 objetos: gato → gato, cão/cachorro → cachorro, peixe → peixe, laranja → laranja, leite → leite)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cute friendly cat sitting, orange tabby with white paws, curled tail;
2. a cute friendly puppy dog sitting, brown and white with floppy ears and a wagging tail;
3. a cute colorful fish swimming, orange with blue fins and a smiling eye;
4. a juicy round orange with a small green leaf on top;
5. a glass bottle of white milk with a glass of milk beside it.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-02 (5 objetos: casa → casa, gelado/sorvete → sorvete, sumo/suco → suco, telemóvel/celular → celular, árvore → arvore)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cozy little house with a red roof, a door, two windows and a small chimney;
2. an ice cream cone with two scoops, pink and cream, with a small cherry on top;
3. a tall glass of orange juice with a straw and a slice of orange on the rim;
4. a smartphone, front view, with a colorful screen showing only simple round app icons (no text);
5. a big leafy green tree with a thick brown trunk.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-03 (5 objetos: bebé/bebê → bebe, sandes/sanduíche → sanduiche, cavalo → cavalo, cama → cama, camião/caminhão → caminhao)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cute smiling baby sitting in a diaper, with a tiny curl of hair;
2. a sandwich with bread, lettuce, tomato and cheese layers visible, cut in half;
3. a friendly brown horse standing, with a dark mane and tail;
4. a cozy bed with a blue blanket and a white pillow;
5. a cute big orange truck, side view, with an open cargo bed.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-04 (5 objetos: porco → porco, colher → colher, elefante → elefante, morango → morango, leão → leao)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cute pink pig standing, with a curly tail and a round snout;
2. a shiny silver spoon, tilted, showing the bowl of the spoon;
3. a cute gray elephant standing, with a long trunk raised and big ears;
4. a juicy red strawberry with tiny yellow seeds and a green leafy top;
5. a friendly lion sitting, with a golden mane and a smiling face.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-05 (5 objetos: macaco → macaco, pera → pera, pato → pato, tartaruga → tartaruga, vaca → vaca)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cute brown monkey sitting, with a long curled tail and a light face;
2. a ripe green-yellow pear with a short brown stem and a leaf;
3. a cute yellow duck swimming, with an orange beak;
4. a cute green tortoise walking, with a patterned brown shell;
5. a friendly black and white cow standing, with a pink nose and a small bell.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-06 (5 objetos: mesa → mesa, cadeira → cadeira, frigorífico/geladeira → geladeira, sol → sol, bolo → bolo)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a simple wooden table with four legs, slightly angled view;
2. a simple wooden chair with a straight back, three-quarter view;
3. a tall white refrigerator with two doors, one slightly open showing bright light inside;
4. a bright yellow sun with soft rounded rays (no face);
5. a birthday cake with pink frosting and one lit candle.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-07 (5 objetos: sapato → sapato, lebre → lebre, meta → meta, rato → rato, pedra → pedra)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a single brown leather shoe with white laces, side view;
2. a brown hare running, with long ears and strong hind legs;
3. a finish line: a black and white checkered banner stretched between two poles with a small flag on top;
4. a cute small gray mouse sitting, with big round ears and a long thin tail;
5. a big gray rounded stone with a few cracks and moss spots.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-08 (5 objetos: rede → rede, cigarra → cigarra, formiga → formiga, trigo → trigo, violino → violino)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a fishing net, spread open, made of knotted brown cords, with a few floats;
2. a cicada insect sitting on a branch, green with transparent veined wings;
3. a cute black-brown ant seen from the side, carrying a tiny crumb;
4. a bundle of golden wheat stalks tied with a ribbon;
5. a brown violin with a bow lying next to it.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-09 (5 objetos: neve → neve, corvo → corvo, raposa → raposa, bico → bico, porquinho → porquinho)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a small pile of fresh white snow with a few snowflakes falling above;
2. a black crow perched, with glossy feathers and a strong beak;
3. a cute orange fox sitting, with a bushy white-tipped tail and pointed ears;
4. a close-up of a bird's head in profile with a large, clear yellow-orange beak;
5. a cute little pink piglet standing, smiling, with a small curly tail.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-10 (5 objetos: palha → palha, madeira → madeira, tijolo → tijolo, lobo → lobo, avó → avo)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a loose bundle of yellow straw tied in the middle;
2. a neat stack of brown wooden planks and a couple of logs;
3. a small stack of red-orange bricks with a trowel of cement on top;
4. a gray wolf standing, with pointed ears and a bushy tail, wild but friendly-looking (not scary);
5. a kind smiling grandmother with gray hair in a bun, round glasses, a shawl and an apron.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-11 (5 objetos: olhos → olhos, lenhador → lenhador, chocolate → chocolate, bruxa → bruxa, forno → forno)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a pair of big expressive eyes, front view, brown with long lashes, no face around them;
2. a friendly lumberjack in a red plaid shirt holding an axe, with a beard and boots;
3. a bar of chocolate with some squares broken off, wrapped partly in golden foil (no text);
4. a witch with a pointed black hat, green skin, a crooked nose and a purple robe, holding a broom (cute, not scary);
5. a stone oven with an arched opening, glowing orange fire inside and a small chimney.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-12 (5 objetos: anão → anao, príncipe → principe, burro → burro, galo → galo, janela → janela)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a cute dwarf with a long white beard, a red pointed hat, a blue jacket and a small pickaxe;
2. a young prince with a small golden crown, a blue cape, a white shirt and a thin sword at his belt;
3. a gray donkey standing, with long ears and a friendly face;
4. a proud rooster with a red comb and colorful tail feathers, standing;
5. a wooden window with open shutters and a flower box with red flowers beneath it.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-13 (5 objetos: princesa → princesa, poço → poco, coroa → coroa, porta → porta, gruta/caverna → caverna)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a beautiful young princess with a long pink dress, a small tiara and long brown hair;
2. a round stone well with a little wooden roof, a rope and a wooden bucket;
3. a golden royal crown with red and blue gems and small pearls on its points;
4. a wooden door with an arched top, iron hinges and a round handle, closed;
5. a rocky cave entrance, a dark opening in a gray stone hill, with a couple of small plants at its base.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-14 (5 objetos: tesouro → tesouro, anel → anel, génio/gênio → genio, palácio → palacio, ilha → ilha)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. an open wooden treasure chest overflowing with gold coins, pearls and gems;
2. a golden ring with a sparkling blue gem, shown slightly tilted;
3. a friendly blue genie, floating with arms crossed, a turban, a curly mustache and a smoky tail instead of legs;
4. a grand fairy-tale palace with white walls, golden domes, tall towers and blue flags;
5. a small tropical island with a sandy beach, a green palm tree and blue water around it.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-15 (5 objetos: diamante → diamante, caçador → cacador, baleia → baleia, sopa → sopa, águia → aguia)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a big sparkling blue diamond, cut in facets, with small shine stars around;
2. a hunter in a green jacket and a feathered hat, holding a bow, with a leather bag, friendly look;
3. a cute big blue whale, side view, with a white belly and a small water spout on top;
4. a bowl of hot soup with a spoon, steam rising and small vegetables visible;
5. a majestic eagle with open wings, brown feathers, white head and a yellow beak.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-16 (5 objetos: boca → boca, barriga → barriga, orelhas → orelhas, feiticeiro → feiticeiro, lua → lua)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a friendly smiling mouth, close-up, red lips and white teeth, no face around it;
2. a cute child's round belly seen from the front, bare tummy with a small belly button, soft skin;
3. a pair of ears, left and right, in light skin tone, simple cartoon side view, no head;
4. a sorcerer in a long purple robe with golden stars, a tall pointed hat, a long gray beard and a glowing staff;
5. a bright full moon, pale yellow, with soft gray craters (no face) and two tiny stars beside it.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-17 (5 objetos: osso → osso, cobra → cobra, jarro → jarro, ladrão → ladrao, jaula → jaula)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a white bone, cartoon style, with round knobs at both ends;
2. a cute green snake coiled up with a lifted head and a thin red tongue;
3. a clay jar with two handles, brown with a decorative pattern around the belly;
4. a thief wearing a striped shirt and a black eye mask, sneaking with a small sack over the shoulder (cute, not scary);
5. an empty metal cage with a rounded top, thin vertical bars and a small open door.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-18 (5 objetos: rei → rei, lareira → lareira, lâmpada → lampada, saco → saco, chaminé → chamine)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a kind old king with a white beard, a golden crown, a red and white royal robe and a golden scepter;
2. a stone fireplace with a warm crackling fire and a couple of logs;
3. an old golden oil lamp (magic lamp style) with a curved spout and a small handle, with a tiny sparkle;
4. a beige cloth sack tied at the top with a rope, rounded and full;
5. a red brick chimney on top of a small roof section, with a little smoke rising.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

---

## Saída Secreta: fundos das salas (5 imagens)

Cada sala da Saída Secreta é **um único fundo 4:3** que já traz todos os objetos desenhados: as 9 fontes de número, os extras e a saída. Os objetos ficam sempre no mesmo lugar, e o jogo põe uma zona de toque invisível sobre cada um. Por isso cada objeto tem de ser **grande, inteiro, bem separado dos outros e fácil de reconhecer**. O desenho é o mesmo em pt-PT e pt-BR (sem texto).

O prompt diz onde fica cada objeto (esquerda/centro/direita, cima/meio/baixo). O gerador não acerta as posições ao milímetro: depois de salvar a imagem, as zonas são acertadas em `src/jogos/escape/salas/<sala>.ts` (abra a sala com `?zonas` no endereço para vê-las marcadas). Converta para JPEG 1600×1200 (`public/imagens/saida-secreta/<sala>.jpg`, como o sótão) e ponha `fundo: 'imagens/saida-secreta/<sala>.jpg'` na sala.

Temas e enigmas de cada sala: `docs/SAIDA-SECRETA.md`.

### saida-secreta/navio (4:3, salvar como `public/imagens/saida-secreta/navio.jpg`)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
A friendly pirate captain's cabin inside a wooden ship, seen from the front, wide view, warm lantern light, curved wooden walls, wooden floor, no people. Twelve objects, each one large, whole, clearly separated from the others (none touching or overlapping), easy to recognize:
1. far left, full height: a big wooden ship's steering wheel mounted on a post;
2. upper left wall: a treasure map pinned to the wall, with a dotted path and a big X;
3. middle left: a brass telescope (spyglass) on a wooden tripod;
4. exact center of the back wall: a closed wooden cabin door with iron bands and a big padlock, the clear exit of the room;
5. upper center-right: a round porthole window with the blue sea and a little fish outside;
6. right of the door, middle: a hanging birdcage with a colorful parrot inside;
7. far right, full height: a tall wooden shelf with a globe and a big compass on it;
8. bottom left, on the floor: a closed wooden treasure chest with gold trim and a keyhole;
9. bottom center-left, on the floor: a wooden barrel;
10. bottom center, on the floor: a heavy iron anchor leaning on the wall;
11. bottom center-right, on a small table: a glass bottle with a rolled message inside;
12. bottom right, on the floor: a coil of rope next to a small wooden cannon.
Keep the space between objects empty (plain wood), no clutter, no extra objects. 4:3 landscape.
```

### saida-secreta/nave (4:3, salvar como `public/imagens/saida-secreta/nave.jpg`)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
The cozy control cabin of a cute rounded spaceship, seen from the front, wide view, soft blue and white walls with rounded panels, no people. Twelve objects, each one large, whole, clearly separated from the others (none touching or overlapping), easy to recognize:
1. far left, full height: a tall white storage locker with a small card slot, closed;
2. upper left wall: a big round window showing colorful planets and stars;
3. middle left: a control panel with big round colorful buttons (red, yellow, green, blue);
4. exact center of the back wall: a round closed airlock hatch with a big wheel handle and a glowing lock, the clear exit of the room;
5. upper center-right: a round radar screen with green circles and dots;
6. right of the hatch, middle: a friendly small robot helper standing, with a screen on its belly;
7. far right, full height: a shelf with an astronaut helmet on top and space food packets below;
8. bottom left, on the floor: a small glass greenhouse box with a little green plant;
9. bottom center-left, on the floor: a white telescope on a stand pointing up;
10. bottom center, on the floor: a round floor map of the stars (constellations drawn as dots and lines);
11. bottom center-right, on the floor: a stack of three colorful cargo boxes;
12. bottom right, on the floor: a cute little alien pet sleeping in a round bed.
Keep the space between objects empty (plain panels), no clutter, no extra objects. 4:3 landscape.
```

### saida-secreta/laboratorio (4:3, salvar como `public/imagens/saida-secreta/laboratorio.jpg`)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
A friendly inventor's laboratory, seen from the front, wide view, bright and tidy, light green walls, wooden floor, no people. Twelve objects, each one large, whole, clearly separated from the others (none touching or overlapping), easy to recognize:
1. far left, full height: a tall glass cabinet with colorful bottles on its shelves;
2. upper left wall: a dark green chalkboard with only simple drawings of circles, triangles and squares (no writing);
3. middle left, on a table: a rack of five test tubes with colorful liquids;
4. exact center of the back wall: a closed metal door covered with big brass gears and a lock, the clear exit of the room;
5. upper center-right wall: three big interlocking brass gears mounted on the wall;
6. right of the door, middle: a hanging model of the solar system with colorful planets;
7. far right, full height: a tall shelf with a microscope and a pair of safety goggles;
8. bottom left, on the floor: a small wooden desk with a locked drawer;
9. bottom center-left, on the floor: a big red horseshoe magnet with paper clips stuck to it;
10. bottom center, on the floor: a round fish tank with one orange fish;
11. bottom center-right, on a stool: an old-fashioned two-pan balance scale;
12. bottom right, on the floor: a small friendly robot made of tin cans, switched off.
Keep the space between objects empty (plain wall and floor), no clutter, no extra objects. 4:3 landscape.
```

### saida-secreta/museu (4:3, salvar como `public/imagens/saida-secreta/museu.jpg`)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
A dinosaur museum hall at night, seen from the front, wide view, soft moonlight and warm spotlights, beige stone walls, polished floor, no people. Twelve objects, each one large, whole, clearly separated from the others (none touching or overlapping), easy to recognize:
1. far left, full height: a big friendly T-rex skeleton on a low platform;
2. upper left wall: a big framed painting of long-neck dinosaurs by a lake;
3. middle left, on a pedestal: a nest with three big speckled dinosaur eggs;
4. exact center of the back wall: a tall closed museum double door with a big padlock, the clear exit of the room;
5. upper center-right wall: a big fossil of a spiral seashell (ammonite) set in a stone slab;
6. right of the door, middle: a glass display case with colorful crystals and stones;
7. far right, full height: a tall model of an erupting volcano with red lava;
8. bottom left, on the floor: a closed wooden crate with a keyhole and a drawn bone symbol;
9. bottom center-left, on the floor: a row of big three-toed dinosaur footprints painted on the floor;
10. bottom center, on a pedestal: a big hourglass with golden sand;
11. bottom center-right, on the floor: a sandbox dig site with a half-buried dinosaur bone, a small brush and a shovel;
12. bottom right, on the floor: a round world globe on a wooden stand.
Keep the space between objects empty (plain wall and floor), no clutter, no extra objects. 4:3 landscape.
```

### saida-secreta/piramide (4:3, salvar como `public/imagens/saida-secreta/piramide.jpg`)
```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
A friendly treasure chamber inside an ancient Egyptian pyramid, seen from the front, wide view, warm torchlight, sandstone walls, sandy floor, no people, nothing scary. Twelve objects, each one large, whole, clearly separated from the others (none touching or overlapping), easy to recognize:
1. far left, full height: a tall burning wall torch on a stone column;
2. upper left wall: a carved wall panel with simple picture symbols: an eye, a bird, a sun, a wavy line (no letters);
3. middle left, on a pedestal: a black cat statue sitting tall with a gold collar;
4. exact center of the back wall: a big closed stone door with a round sun carving and a stone lock, the clear exit of the room;
5. upper center-right wall: a painted wall scene of a boat on a river with palm trees;
6. right of the door, middle: a golden two-pan balance scale on a stone table;
7. far right, full height: a tall painted golden sarcophagus standing upright, closed, with a scarab-shaped keyhole;
8. bottom left, on the floor: a row of three clay pots of different sizes;
9. bottom center-left, on the floor: a small golden scarab beetle on a stone block;
10. bottom center, on the floor: a small model of three pyramids on a sand tray;
11. bottom center-right, on the floor: a stone tablet with colorful dots in rows (no numbers);
12. bottom right, on the floor: an open wooden chest with gold coins and jewels.
Keep the space between objects empty (plain stone and sand), no clutter, no extra objects. 4:3 landscape.
```
