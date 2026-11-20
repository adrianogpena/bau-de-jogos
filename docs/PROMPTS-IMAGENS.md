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
- **Encher a folha, sem separar por tema:** o objetivo é gastar o mínimo de gerações. Antes de criar um prompt de imagens da mesma faixa (pequena ou média), conte as imagens dessa faixa que já estão na fila e as novas: junte tudo em folhas cheias (16 pequenas ou 5 médias), **mesmo que os temas sejam diferentes** (ex.: itens e inimigos da mesma história, ou de histórias diferentes). Só abra uma folha nova quando a anterior estiver cheia (ex.: 17 ícones = 1 folha de 16 + 1 folha com 1). Folha com células vazias só é aceitável quando não há mais imagens da faixa na fila. Se uma folha existente na fila tem células vazias, **complete-a** com as imagens novas (reescrevendo o prompt e a lista de nomes) em vez de criar outra. O nome do prompt de uma folha mista é genérico (ex.: `icones-02-misto`), e a lista de nomes diz a que cada ícone pertence. Qualidade manda: se juntar tornar as imagens de temas muito diferentes inconsistentes de estilo, a regra "na dúvida" acima ainda vale.

## Formato de cada entrada

- Cabeçalho `### <nome-do-prompt>` com o que o prompt traz (ex.: `5 objetos: gato → gato, ...`).
- **Nome do arquivo gerado = nome do prompt** (o do cabeçalho), para comparar o prompt com a imagem: grande → `<nome-do-prompt>.png`/`.jpg`; folha de ícones ou de objetos → a folha inteira com o nome do prompt (ex.: `icones-01-menu.png`, `palavras-01.png`), guardada antes de separar cada desenho. Não indique onde salvar: isso fica a cargo de outra IA.
- **Obrigatório em todo prompt, mesmo de uma só imagem:** uma linha `- **Arquivo:** \`<nome>.png\`` com o nome exato do arquivo a gerar (para folha: `- **Arquivo da folha:** \`<nome-do-prompt>.png\`` mais a linha `Nomes dos arquivos, na ordem: ...` dos desenhos). Um prompt sem essa linha está incompleto. Sem caminho de destino.
- Uma linha `- **Formato:**` com a proporção. Sem caminho de destino.
- O prompt inteiro, em inglês, num bloco de código, começando pelo estilo único e terminando com o formato (ex.: `4:3 landscape.`).
- Se há substituto temporário em uso (regra do `CLAUDE.md`), uma linha `- **Substituto:** <arquivo ou emoji>`, para saber o que trocar quando a imagem chegar.
- Ao adicionar a imagem ao projeto: troque o substituto, rode `npm run typecheck`/`npm run build` se mudou código, e **apague a entrada** daqui.
