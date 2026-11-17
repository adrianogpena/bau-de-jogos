# Prompts de imagens ainda não geradas

Fila de imagens que o usuário precisa gerar. **Quando a imagem for adicionada ao projeto, apague o prompt daqui.**
Regras de uso: veja "Imagens novas" no `CLAUDE.md`. Todos os prompts em **inglês**.

Estilo único (já usado em `docs/GERAR-IMAGENS.md`), incluído no começo de cada prompt:

> Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.

Formatos possíveis: **1:1**, **9:16**, **3:4**, **4:3**, **16:9**.

## Quantas imagens por prompt

O tamanho da imagem define quantas cabem num prompt. Mais objetos por imagem = menos detalhe e mais chance de o gerador errar a contagem ou colar os desenhos.

| Tipo | Exemplos | Por prompt | Formato |
|---|---|---|---|
| **Pequena** (exibida a 64–128 px) | ícones de interface, de menu, de categoria, emojis trocados | **até 16** em folha de grade 4×4 | 1:1, 2048×2048 |
| **Média** | objetos de palavra (escrita/leitura), itens da loja, itens soltos do Achar itens | **até 5**, em duas linhas (3 em cima, 2 embaixo) | 4:3 |
| **Grande ou detalhada** | heróis e magos, fundos de cena, fundos de sala, ilustrações de história | **1 por prompt** | o do uso (4:3 para fundos, 3:4 para personagens) |

- **Pequena:** cada ícone fica sozinho no centro da sua célula, com margem larga (mínimo 30% da célula), fundo branco puro #FFFFFF, contorno grosso, sem linhas de grade nem rótulos. Lista numerada em ordem esquerda→direita, cima→baixo, e abaixo do prompt a linha `Nomes dos arquivos, na ordem: ...`. Se a folha tiver menos de 16, diga quantas células ficam vazias. Se vierem ícones colados, faltando ou fora de ordem, gere de novo.
- **Média:** objetos separados em fundo branco puro, sem tom creme/bege/cinza, textura, degradê nem sombra no chão; tamanho parecido entre eles, nenhum encostando ou cortado.
- **Grande:** o prompt descreve só aquela imagem. Fundos têm espaço livre no terço de baixo para botões e personagens, e sem personagens. Personagens e itens soltos: corpo inteiro, fundo branco puro, para recorte. Para um grupo (ex.: os 4 heróis), um prompt por imagem, com as mesmas proporções e o mesmo traje-base, mudando só o que diferencia.
- Na dúvida entre duas faixas, use a de menos imagens por prompt.

## Formato de cada entrada

- Cabeçalho `### <nome-do-prompt>` com o que o prompt traz (ex.: `5 objetos: gato → gato, ...`).
- **Nome do arquivo gerado = nome do prompt** (o do cabeçalho), para comparar o prompt com a imagem: grande → `<nome-do-prompt>.png`/`.jpg`; folha de ícones ou de objetos → a folha inteira com o nome do prompt (ex.: `icones-01-menu.png`, `palavras-01.png`), guardada antes de separar cada desenho. Não indique onde salvar: isso fica a cargo de outra IA.
- Uma linha `- **Formato:**` com a proporção. Sem caminho de destino.
- O prompt inteiro, em inglês, num bloco de código, começando pelo estilo único e terminando com o formato (ex.: `4:3 landscape.`).
- Se há substituto temporário em uso (regra do `CLAUDE.md`), uma linha `- **Substituto:** <arquivo ou emoji>`, para saber o que trocar quando a imagem chegar.
- Ao adicionar a imagem ao projeto: troque o substituto, rode `npm run typecheck`/`npm run build` se mudou código, e **apague a entrada** daqui.


### icones-02-aventuras

2 ícones: ilha-do-tesouro → icone-ilha-do-tesouro (história), categoria-aventuras (categoria)
- **Formato:** 1:1, 2048×2048
- **Substituto:** `historias/simbad.png` (história) e `menu/categoria-mil-e-uma-noites.png` (categoria)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers. A 4x4 icon sheet on pure white #FFFFFF, only 2 cells used (the other 14 stay empty), each icon alone in the center of its cell with a wide margin (at least 30%), thick outline, no grid lines, no labels. 1) A tiny green palm-tree island with a red X on the sand and a small pirate chest half buried. 2) An old rolled treasure map tied with a ribbon, with a small compass on top. 1:1 square.
```

### palavras-04

5 objetos: carruagem → carruagem, balança → balanca, giz → giz, candeeiro de azeite → candeeiro, machado → machado
- **Formato:** 4:3
- **Substituto:** carruagem → `carro` (Príncipe Sapo); balança → `mesa`, giz → `lápis`, candeeiro → `lâmpada` (Ali Babá); machado → só no texto (Capuchinho Vermelho)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Five separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (three on top, two below):
1. a fairy-tale horse-drawn carriage, golden and blue, with big wheels and a small door;
2. an old two-pan balance scale made of brass, with a few gold coins on one pan;
3. a stick of white chalk, slightly used, with a few chalk dust marks;
4. a small old oil lamp made of clay with a flame, Arabian style;
5. a woodcutter's axe with a wooden handle and a shiny steel blade.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```

### palavras-05

4 objetos: tambor → tambor, fita → fita, coração → coracao, trinco/tranca → trinco
- **Formato:** 4:3
- **Substituto:** tambor → só no texto (Músicos de Bremen); fita → só no texto (Branca de Neve); coração → só no texto (Príncipe Sapo, Bremen); trinco → só no texto (Capuchinho Vermelho)

```
Children's picture book illustration, soft watercolor and colored pencil, clean rounded outlines, warm vivid colors, friendly cute look, no text, no letters, no numbers.
Four separate objects on a pure white background (#FFFFFF), flat and uniform: no cream, beige or gray tint, no paper texture, no gradient, no vignette. Clearly spaced apart so none touch or overlap, each one whole and not cropped, arranged in two rows (two on top, two below):
1. a round drum with red sides, rope lacing and two wooden drumsticks;
2. a long colorful silk ribbon tied in a bow, red with golden edges;
3. a plump red heart, simple and shiny;
4. an old wooden door latch with an iron lever and a small wooden bar.
Similar size for all objects, no shadows on the floor, no other objects. 4:3 landscape.
```
