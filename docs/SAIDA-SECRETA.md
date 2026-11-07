# Saída Secreta: como as salas funcionam e temas novos

Jogo de fuga (antigo "Escape Room"). Código em `src/jogos/escape/`; modelo de dados em `tipos.ts`.

## Regras do jogo

- Cada sala é **um fundo 4:3** que já traz todos os objetos desenhados. Cada objeto é uma **zona fixa** (`zona: { x, y, largura, altura }`, em % da cena) com um botão invisível por cima. O desafio não é achar os objetos, é descobrir quais ajudam nesta rodada.
- Cada sala tem:
  - **9 fontes de número** (`fontes`). Cada uma tem várias **variantes** de enigma.
  - **Extras** (`extras`), quantos forem precisos. Não dão número, dão uma pista para o inventário (ex.: a chave do baú). Um objeto com `requer` só abre com essa pista.
  - **Uma saída** (`saida`), sempre a mesma. A história da sala também não muda.
- A cada rodada (`rodada.ts`) o jogo sorteia **3 ou 4 fontes** (`digitos: [3, 4]`), a ordem delas no código e **uma variante** de cada uma.
  - Cadeado de um dígito (`tipo: 'codigo'`, resposta `'4'`): o número é a resposta.
  - Outros tipos (ordem, escolha, pares): o número é sorteado de 1 a 9.
  - Assim, decorar o código ou o caminho não adianta: o código muda sempre.
- O **cadeado da saída** mostra o desenho das fontes sorteadas, recortado do próprio fundo (`Recorte.tsx`), por cima de cada número. Depois de vê-lo, o painel mostra os desenhos e os números já achados.
- Uma fonte fora do código desta rodada responde com `semNumero` (ex.: "aqui não há nenhum número desta vez").
- Dica gradual: 1) ver o cadeado; 2) a próxima fonte do código (ou o extra de que ela precisa), com a zona a piscar; 3) escrever o código. As estrelas dependem das dicas usadas.
- Sem imagem de fundo (`fundo` vazio), a sala usa `fundoCss` e mostra cada objeto como emoji na sua zona. É provisório, para jogar enquanto a imagem não existe.

## Sala nova: passo a passo

1. Gere o fundo com o prompt de `docs/PROMPTS-IMAGENS.md` e salve em `public/imagens/saida-secreta/<sala>.png`.
2. Crie `src/jogos/escape/salas/<sala>.ts` (copie a estrutura de `sotao.ts`) e liste-a em `salas/index.ts`.
3. Abra a sala com `?zonas` no endereço (ex.: `http://localhost:5199/bau-de-jogos/?zonas`): as zonas aparecem marcadas a rosa com o id. Acerte `x`, `y`, `largura` e `altura` de cada objeto até cobrirem o desenho.
4. Escreva cada texto nas duas variantes. `npm run audio:piper` gera o áudio; `npm test` confere.

Regras para os enigmas:
- Cadeado de um dígito: resposta de 1 a 9. Para respostas maiores (ex.: o quadro do sótão), use um extra.
- `sucesso` da fonte usa `{n}` para o número (ex.: "O relógio mostra o número {n}!").
- Pelo menos 3 variantes por fonte, misturando tipos.
- O `visual` do enigma é a "vista de perto" do objeto (emojis). Pode mostrar coisas que o fundo não mostra.

## O Sótão da Avó / da Vovó (feito)

Arquivo `salas/sotao.ts`. Saída: porta do sótão. Fontes: relógio de pêndulo, baú de brinquedos (`requer: 'chave'`), estante, cavalo de baloiço / balanço, caixa de música, cabide de chapéus, janela redonda, mala de viagem e cesto de novelos. Extra: quadro (dá a chave do baú). Falta a imagem de fundo e acertar as zonas.

---

## Temas novos (a implementar)

Os objetos e as posições batem com os prompts de `docs/PROMPTS-IMAGENS.md` (seção "Saída Secreta"). As posições (x, y) são o ponto de partida das zonas; acerte-as depois com `?zonas`. Atenção às palavras com grafia diferente: vêm marcadas como **pt-PT / pt-BR**.

### 1. O Navio Pirata (`navio`)

**História:** a criança entrou no camarote do capitão para ver o mapa do tesouro, e a porta trancou-se / se trancou com uma onda. O cadeado tem desenhos de coisas do camarote.
**Saída:** porta do camarote (centro, x 50, y 45).

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Leme | esquerda, 10, 50 | ordem: rodar o leme pelos pontos cardeais desenhados (⬆️➡️⬇️⬅️); cadeado: quantos raios tem o leme (visual com 8 pegas) |
| Mapa do tesouro | cima esquerda, 28, 22 | ordem: seguir o caminho (🌴 → ⛰️ → 🌉 → ❌); escolha: qual destas coisas não se encontra numa ilha (🌴 🐚 🦀 🚗) |
| Luneta | meio esquerda, 30, 52 | cadeado: quantos barcos se veem (⛵⛵⛵); escolha: que animal salta do mar (🐬 entre 🐄 🐔 🐑) |
| Vigia (janela redonda) | cima direita, 70, 18 | cadeado: quantos peixes passaram (🐟 + 🐠); pares de animais do mar |
| Papagaio na gaiola | meio direita, 68, 48 | ordem: repetir o que o papagaio diz (sequência de cores); escolha: o papagaio come… (🍌 entre 🪨 🔩 🧦) |
| Bússola e globo | direita, 90, 50 | escolha: para onde aponta a agulha (norte); ordem: do mais pequeno / menor ao maior (🏝️ 🚤 ⛵ 🚢) |
| Barril | baixo, 34, 80 | cadeado: quantas maçãs no barril; pares de frutas |
| Âncora | baixo centro, 50, 84 (`requer: 'corda'`) | cadeado: quantos elos tem a corrente; ordem: do mais leve ao mais pesado (🪶 🍎 🧱 ⚓) |
| Baú do tesouro | baixo esquerda, 16, 84 (`requer: 'chave'`) | pares de joias (💎 👑 💍 🪙); escolha: o que não é tesouro (🧦) |

**Extras:** garrafa com mensagem (baixo direita, 66, 82) dá a **chave** do baú (enigma: contar as conchas desenhadas na mensagem); canhão com corda (baixo direita, 88, 84) dá a **corda** da âncora (enigma: ordem das bolas, da maior à mais pequena / menor).
**Palavras:** camarote, vigia (janela redonda do navio), luneta; papagaio aqui é a ave (pt-PT também usa "papagaio" para o brinquedo, que no Brasil é "pipa").

### 2. A Nave Espacial (`nave`)

**História:** a criança visitou a nave da Capitã Estrela. Um meteorito passou perto e a escotilha fechou-se / se fechou sozinha.
**Saída:** escotilha (centro, x 50, y 45).

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Janela dos planetas | cima esquerda, 26, 22 | cadeado: quantos planetas se veem; ordem: do mais pequeno / menor ao maior |
| Painel de botões | meio esquerda, 28, 55 | ordem: carregar / apertar as cores pela ordem do arco-íris; pares de cores |
| Radar | cima direita, 70, 20 | cadeado: quantos pontos no radar; escolha: o que voa no espaço (🚀 entre 🚲 🚂 🚜) |
| Robô ajudante | meio direita, 68, 50 (`requer: 'cartao'`) | escolha: o robô precisa de… (🔋); cadeado: 2 + 3 no ecrã / na tela do robô |
| Capacete e comida espacial | direita, 90, 48 | ordem: vestir o astronauta (👕 → 🧥 → 🧤 → 🪖); escolha: comida (🍎 entre 🧸 ⚽ 🎈) |
| Estufa | baixo esquerda, 16, 82 | ordem: semente → rebento / broto → planta → flor; cadeado: quantas folhas |
| Telescópio | baixo, 34, 80 | cadeado: quantas estrelas cadentes; escolha: qual é a lua (🌙) |
| Mapa das estrelas | baixo centro, 50, 86 | cadeado: quantas estrelas tem a constelação; pares de símbolos do espaço (🌍 🌙 ⭐ ☄️) |
| Caixas de carga | baixo direita, 68, 82 (`requer: 'estrela'`) | ordem: empilhar da maior à mais pequena / menor; cadeado: quantas caixas |

**Extras:** armário (esquerda, 10, 50) dá o **cartão de acesso** do robô (enigma: pares de ferramentas); bichinho extraterrestre (baixo direita, 88, 84) dá a **chave-estrela** das caixas (enigma: escolher a comida de que ele gosta).
**Palavras:** ecrã (pt-PT) / tela (pt-BR); carregar no botão (pt-PT) / apertar o botão (pt-BR); extraterrestre nas duas.

### 3. O Laboratório do Inventor (`laboratorio`)

**História:** o Professor Parafuso saiu para almoçar e a porta de engrenagens trancou-se / se trancou. Ele deixou números escondidos nas experiências.
**Saída:** porta de engrenagens (centro, x 50, y 45).

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Armário de frascos | esquerda, 10, 50 | cadeado: quantos frascos azuis; ordem: do mais vazio ao mais cheio |
| Quadro de giz (pt-PT) / Lousa (pt-BR) | cima esquerda, 28, 22 | cadeado: quantos triângulos; escolha: qual forma tem 4 lados iguais |
| Tubos de ensaio | meio esquerda, 28, 55 (`requer: 'oculos'`) | ordem: misturar as cores (🔴 + 🟡 = 🟠…); escolha: azul + amarelo dá… (🟢) |
| Engrenagens | cima direita, 70, 20 | ordem: da roda mais pequena / menor à maior; cadeado: quantos dentes tem a roda pequena (visual) |
| Sistema solar | meio direita, 68, 48 | escolha: onde vivemos (🌍); cadeado: quantos planetas têm anéis no modelo |
| Íman (pt-PT) / Ímã (pt-BR) | baixo, 32, 80 | escolha: o que o íman / ímã apanha / pega (📎 entre 🍎 🧸 🪵); cadeado: quantos clipes estão presos |
| Aquário | baixo centro, 50, 84 | cadeado: quantas bolhas; pares de animais da água |
| Balança | baixo direita, 68, 80 | escolha: o lado mais pesado; ordem: do mais leve ao mais pesado |
| Robô de latas | baixo direita, 88, 84 (`requer: 'pilha'`) | ordem: ligar o robô (🔋 → 🔌 → 💡); cadeado: quantas latas tem o robô |

**Extras:** estante do microscópio (direita, 90, 48) dá os **óculos de proteção** (enigma: pares de micróbios sorridentes); mesa com gaveta (baixo esquerda, 16, 82) dá a **pilha** do robô (enigma: escolher o objeto que dá luz).
**Palavras:** íman / ímã; quadro / lousa; apanhar (pt-PT) / pegar (pt-BR); "mesa com gaveta" serve às duas (evite secretária / escrivaninha).

### 4. O Museu dos Dinossauros (`museu`)

**História:** a criança adormeceu / pegou no sono no museu durante a visita da escola. Acordou de noite e a porta grande estava trancada!
**Saída:** porta do museu (centro, x 50, y 45).

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Esqueleto de T-rex | esquerda, 12, 50 | cadeado: quantos dentes grandes (visual); escolha: o que o T-rex comia (🍖) |
| Quadro dos dinossauros | cima esquerda, 28, 22 | cadeado: quantos dinossauros no lago; escolha: qual não é dinossauro (🐘) |
| Ninho de ovos | meio esquerda, 28, 55 | ordem: ovo → ovo a rachar / rachando → bebé / bebê → dinossauro adulto; cadeado: quantos ovos |
| Fóssil de concha | cima direita, 70, 20 | escolha: que animal vivia na concha (🐌); pares de fósseis |
| Vitrine de cristais | meio direita, 68, 48 (`requer: 'lanterna'`) | ordem: cristais pelas cores do arco-íris; cadeado: quantos cristais roxos |
| Vulcão | direita, 90, 50 | ordem: o vulcão a acordar / acordando (🏔️ → 💨 → 🔥 → 🌋); escolha: o que é quente |
| Pegadas | baixo, 32, 82 | cadeado: quantas pegadas; ordem: da pegada mais pequena / menor à maior |
| Ampulheta | baixo centro, 50, 82 | ordem: manhã → tarde → noite; cadeado: quantos grãos grandes caíram |
| Globo | baixo direita, 88, 82 | escolha: onde vivem os pinguins (🧊); pares de animais de cada continente |

**Extras:** escavação (baixo direita, 68, 84) dá a **chave do caixote** (enigma: pares de ossos); caixote trancado (baixo esquerda, 14, 84, `requer: 'chave'`) dá a **lanterna** para ver a vitrine (enigma: ordem dos ossos, do mais curto ao mais comprido).
**Palavras:** adormeceu (pt-PT) / pegou no sono (pt-BR); bebé / bebê; gerúndio (`a rachar` / `rachando`).

### 5. A Pirâmide do Faraó (`piramide`)

**História:** numa visita ao Egito, a criança seguiu um gato preto até uma câmara secreta da pirâmide. A porta de pedra fechou-se / se fechou devagarinho atrás dela.
**Saída:** porta de pedra com o sol (centro, x 50, y 45).

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Tocha | esquerda, 10, 50 | escolha: o que dá luz (🔥 entre 🧊 🪨 💧); cadeado: quantas chamas |
| Hieróglifos | cima esquerda, 28, 22 | ordem: copiar a sequência de símbolos (👁️ 🐦 ☀️ 〰️); cadeado: quantos pássaros na parede |
| Estátua do gato | meio esquerda, 28, 52 | escolha: o que o gato bebe (🥛); pares de animais do Egito (🐈 🐊 🐪 🦂) |
| Pintura do barco | cima direita, 70, 20 | cadeado: quantos remos; escolha: onde anda o barco (rio) |
| Balança dourada | meio direita, 68, 48 (`requer: 'moedas'`) | escolha: o lado mais pesado; cadeado: quantas moedas para equilibrar |
| Sarcófago | direita, 90, 48 (`requer: 'escaravelho'`) | pares de joias do faraó; ordem: tirar as faixas de cima para baixo |
| Vasos de barro | baixo esquerda, 16, 82 | ordem: do vaso mais pequeno / menor ao maior; cadeado: quantos vasos têm riscas / listras |
| Maquete das pirâmides | baixo centro, 50, 84 | cadeado: quantos triângulos se veem; ordem: construir de baixo para cima |
| Tábua de pontos | baixo direita, 68, 84 | cadeado: contar os pontos de uma fila; ordem: filas de 1 a 4 pontos |

**Extras:** escaravelho dourado (baixo, 34, 82) dá o **escaravelho-chave** do sarcófago (enigma: escolher o inseto certo); baú aberto (baixo direita, 88, 84) dá as **moedas** da balança (enigma: pares de moedas e joias).
**Palavras:** riscas (pt-PT) / listras (pt-BR); devagarinho nas duas.
