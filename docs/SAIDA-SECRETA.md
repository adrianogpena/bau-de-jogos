# Saída Secreta: como as salas funcionam e temas novos

Jogo de fuga (antigo "Escape Room"). Código em `src/jogos/escape/`; modelo de dados em `tipos.ts`.

## Regras do jogo

- Cada sala é **um fundo 4:3** que já traz todos os objetos desenhados. Cada objeto é uma **zona fixa** (`zona: { x, y, largura, altura }`, em % da cena) com um botão invisível por cima. O desafio não é achar os objetos, é descobrir quais ajudam nesta rodada.
- Cada sala tem:
  - **9 fontes de número** (`fontes`). Cada uma tem várias **variantes** de enigma **por nível** (`variantes: { facil, medio, dificil }`).
  - **Extras** (`extras`), quantos forem precisos. Não dão número, dão uma pista para o inventário (ex.: a chave do baú). Um objeto com `requer` só abre com essa pista.
  - **Uma saída** (`saida`), sempre a mesma. A história da sala também não muda.
- Na abertura da sala, a criança escolhe o **nível**: fácil, médio ou difícil. As estrelas ficam guardadas por sala e nível.
- A cada rodada (`rodada.ts`) o jogo sorteia **quantas fontes** o nível pede (`digitos: { facil: [3], medio: [3, 4], dificil: [4] }`), a ordem delas no código e **uma variante desse nível** de cada uma.
  - Cadeado de um dígito (`tipo: 'codigo'`, resposta `'4'`): o número é a resposta.
  - Outros tipos (ordem, escolha, pares): o número é sorteado de 1 a 9.
  - Assim, decorar o código ou o caminho não adianta: o código muda sempre.
- O **cadeado da saída** mostra o desenho das fontes sorteadas, recortado do próprio fundo (`Recorte.tsx`), por cima de cada número. Depois de vê-lo, o painel mostra os desenhos e os números já achados.
- Uma fonte fora do código desta rodada responde com `semNumero` (ex.: "aqui não há nenhum número desta vez").
- Dica gradual: 1) ver o cadeado; 2) a próxima fonte do código (ou o extra de que ela precisa), com a zona a piscar; 3) escrever o código. As estrelas dependem das dicas usadas.
- Sem imagem de fundo (`fundo` vazio), a sala usa `fundoCss` e mostra cada objeto como emoji na sua zona. É provisório, para jogar enquanto a imagem não existe.

## Sala nova: passo a passo

1. Gere o fundo com o prompt de `docs/PROMPTS-IMAGENS.md` e salve como JPEG 1600×1200 em `public/imagens/saida-secreta/<sala>.jpg`.
2. Crie `src/jogos/escape/salas/<sala>.ts` (copie a estrutura de `sotao.ts`) e liste-a em `salas/index.ts`.
3. Abra a sala com `?zonas` no endereço (ex.: `http://localhost:5199/bau-de-jogos/?zonas`): as zonas aparecem marcadas a rosa com o id. Acerte `x`, `y`, `largura` e `altura` de cada objeto até cobrirem o desenho.
4. Escreva cada texto nas duas variantes. `npm run audio:piper` gera o áudio; `npm test` confere.

Regras para os enigmas:
- Cadeado de um dígito (resposta de 1 a 9): o número da fonte é a resposta. Resposta de dois dígitos (ex.: 10 patas) também serve; aí o número da fonte é sorteado, como nos outros tipos.
- `sucesso` da fonte usa `{n}` para o número (ex.: "O relógio mostra o número {n}!").
- Pelo menos 3 variantes por fonte **em cada nível**, misturando tipos.
- O `visual` do enigma é a "vista de perto" do objeto (emojis). Pode mostrar coisas que o fundo não mostra.
- Pares: um emoji sozinho dá duas cartas iguais; `['⚽', '🥅']` dá duas cartas diferentes que combinam (pares associados).

### Níveis

O mesmo objeto tem enigmas dos três níveis, sobre o mesmo tema (o relógio pergunta sempre de horas, o cesto de cores e novelos). O que muda é o raciocínio pedido:

| | Fácil (4 a 5 anos) | Médio (6 a 7 anos) | Difícil (8 anos ou mais) |
|---|---|---|---|
| Contas | contar o que se vê, até 9 | **uma** conta de juntar ou tirar com o desenho à vista ("6 pássaros, voaram 2") | **dois passos** ("tirou 2 e pendurou 1"), "quantos a mais", multiplicação pequena (2 cavalos × 4 patas) |
| Contagem | quantos há | só um tipo ("só os chapéus de palha") | com condição pela negativa ("quantos não são cartolas") |
| Escolha | intruso óbvio (um carro entre frutas) | categoria simples (o que tem penas, o que tem cordas) | adivinha com pistas a eliminar, rimas, conhecimento (o sol nasce a este / leste) |
| Padrões | — | alternar A B A B ou A A B | regra de 3 (📕📗📘…) ou A B B |
| Ordem | 4 itens visíveis (pequeno → grande) | 5 itens, rotina ou crescimento | 5 a 6 itens que pedem conhecimento (horas no relógio, fases da lua, peso) |
| Pares | 4 a 5 pares iguais | 5 pares iguais ou 4 associados | 6 pares iguais ou 5 associados |
| Código da saída | 3 números | 3 ou 4 números | 4 números |

A dica não dá a resposta: mostra o primeiro passo.

### Cada sala tem enigmas próprios

Nenhuma ideia de enigma se repete entre salas. Cada sala tem um **foco** de raciocínio, e os enigmas saem dele e do tema:

| Sala | Foco |
|---|---|
| Sótão | horas, contas de juntar e tirar em dois passos, padrões de cores, rimas e adivinhas |
| Navio Pirata | direções e pontos cardeais, mapas com coordenadas, partilhar (dividir), flutua ou afunda |
| Nave Espacial | sequências numéricas (de 2 em 2, contagem para trás), regras de padrões, lógica de pistas |
| Laboratório | misturas de cores, causa e efeito, formas e metades, rodas e alavancas, comparar pesos na balança |
| Museu dos Dinossauros | tempo (ontem, hoje, amanhã; antes e depois), ciclos de vida, comprimento, classificar animais |
| Pirâmide | códigos secretos (cada símbolo vale um número), numeração com traços, filas com pistas lógicas |

Antes de escrever um enigma novo, confira nesta lista e em `salas/` se a ideia já existe noutra sala.

## O Sótão da Avó / da Vovó (feito)

Arquivo `salas/sotao.ts`. Saída: porta do sótão. Fontes: relógio de pêndulo, baú de brinquedos (`requer: 'chave'`), estante, cavalo de baloiço / balanço, caixa de música, cabide de chapéus, janela redonda, mala de viagem e cesto de novelos. Extra: quadro (dá a chave do baú). Fundo: `public/imagens/saida-secreta/sotao.jpg`.

---

## Salas novas (feitas)

Cada sala está em `salas/<sala>.ts`, com o fundo em `public/imagens/saida-secreta/<sala>.jpg`. As posições (x, y) abaixo foram o ponto de partida; as zonas reais estão no arquivo da sala (confira com `?zonas`). Atenção às palavras com grafia diferente: vêm marcadas como **pt-PT / pt-BR**.

Cada fonte e cada extra traz **3 ideias por nível** (fácil, médio, difícil), como no sótão. A resposta vem entre parênteses. Os tipos são `cadeado` (código), `escolha`, `ordem` e `pares`. As ideias foram conferidas contra o sótão e entre as salas: nenhuma se repete. Ideias que o sótão já usa e que **não** podem voltar: ler horas e partes do dia, rotina do dia, patas e rodas, ordenar animais por tamanho ou peso, semente até à árvore, fases da lua, onde nasce o sol, roupa para a chuva ou a neve, instrumentos, intrusos de fruta, animal ou leitura, padrões de cores de livros e novelos, quem tem penas, quem nasce de ovo, rimas.

### 1. O Navio Pirata (`navio`)

**História:** a criança entrou no camarote do capitão para ver o mapa do tesouro, e a porta trancou-se / se trancou com uma onda. O cadeado tem desenhos de coisas do camarote.
**Saída:** porta do camarote (centro, x 50, y 45).
**Foco:** direções e pontos cardeais, mapas com coordenadas, partilhar (dividir), flutua ou afunda.

**Leme** (esquerda, 10, 50)
- Fácil: escolha: o leme rodou para a esquerda; para onde vai o barco (⬅️ entre ⬅️ ➡️ ⬆️)?; cadeado: quantos punhos tem o leme (8)?; ordem: copiar o caminho desenhado no convés, 4 setas à vista (⬆️ ➡️ ⬇️ ⬅️).
- Médio: escolha: o barco ia para norte e virou para a direita; para onde vai (este / leste)?; ordem: o capitão dita 5 ordens ("norte, norte, este / leste, sul, oeste") e a criança toca as setas; cadeado: o leme tem 8 punhos e 3 estão partidos / quebrados, quantos estão bons (5)?
- Difícil: escolha: o barco ia para norte e o leme deu meia volta; para onde vai (sul)?; ordem: ordens só por escrito, sem setas ("primeiro oeste, depois norte, depois este / leste, depois sul"), com a rosa dos ventos ao lado; escolha: o vento sopra do norte; para onde vai a bandeira (sul)?

**Mapa do tesouro** (cima esquerda, 28, 22)
- Fácil: cadeado: quantas palmeiras há no mapa (5)?; escolha: o tesouro está ao pé da palmeira; qual destes sítios tem o ❌?; escolha: segue as pegadas; a que ilha chegam?
- Médio: escolha: grelha 3×3, partindo da 🌴 andas 2 casas para a direita; onde chegas?; cadeado: em que coluna está o ❌ (3)?; escolha: o tesouro está a norte (em cima) da caveira; qual é o sítio?
- Difícil: cadeado de 2 números: coluna e linha do ❌ (coluna 3, linha 2 → "32"); escolha: partindo da 🌴, 2 casas para este / leste e 1 para sul, onde se chega?; cadeado: o tesouro está 3 casas a norte e 2 a este / leste da palmeira; quantas casas andas ao todo (5)?

**Luneta** (meio esquerda, 30, 52)
- Fácil: escolha: o que se vê no mar pela luneta (🐳 entre 🐄 🦒 🐘)?; cadeado: quantos barcos se veem (4)?; escolha: qual barco tem a bandeira igual à nossa (🏴‍☠️)?
- Médio: escolha: qual barco está mais longe (o que parece mais pequeno / menor)?; cadeado: quantos barcos têm vela vermelha? Não contes os outros (3); escolha: o que está à esquerda do farol?
- Difícil: escolha: bandeira vermelha quer dizer "perigo"; que barco pede ajuda (o que tem bandeira vermelha e não tem velas)?; cadeado: quantos barcos não têm bandeira de pirata (6)?; escolha: estamos virados para norte e o barco está a oeste; de que lado o vemos (esquerda)?

**Vigia (janela redonda)** (cima direita, 70, 18)
- Fácil: cadeado: quantos peixes passam pela vigia (6)?; escolha: a gaivota está em cima ou em baixo / embaixo da nuvem?; pares: 4 pares de peixes e conchas iguais.
- Médio: escolha: qual desenho mostra a ilha à direita do navio?; cadeado: passavam 7 peixes e 3 nadaram para a esquerda; quantos ficaram à direita (4)?; pares: 5 pares iguais.
- Difícil: escolha: a ilha está do lado esquerdo e o navio dá meia volta; de que lado fica agora (direita)?; escolha: o farol está atrás do navio, que anda para a frente; o farol fica maior ou mais pequeno / menor?; cadeado: passaram 2 grupos de 3 peixes e mais 1 (7).

**Papagaio na gaiola** (meio direita, 68, 48)
- Fácil: escolha: o papagaio só come fruta (🍌 entre 🧦 🔑 🪨); pares: 4 pares de penas coloridas; cadeado: quantas penas tem a cauda (5)?
- Médio: escolha: o papagaio diz o contrário de "em cima"; o que é (em baixo / embaixo)?; cadeado: o papagaio tem 6 sementes e reparte com o amigo, cada um fica com o mesmo; quantas cada (3)?; escolha: o papagaio diz o contrário de "esquerda" (direita).
- Difícil: ordem: o papagaio disse a palavra às avessas; pôr as sílabas por ordem (pa · pa · gai · o); escolha: o papagaio diz sempre o contrário; disse "o tesouro está a norte", onde está (sul)?; cadeado: 9 bolachas / biscoitos para 3 papagaios, todos com o mesmo; quantas / quantos cada (3)?

**Bússola e globo** (direita, 90, 50)
- Fácil: escolha: qual é a bússola (🧭 entre ⏰ 🍪 🎈)?; pares: 4 pares iguais (🧭 🌍 ⚓ 🦜); cadeado: quantas pontas tem a rosa dos ventos (4)?
- Médio: escolha: a agulha aponta para norte (em cima); o que fica em baixo / embaixo (sul)?; pares associados: animal ↔ onde vive (🐧↔🧊, 🐪↔🏜️, 🐒↔🌴, 🐟↔🌊); cadeado: a rosa dos ventos tem 4 pontas grandes e 4 pequenas; quantas ao todo (8)?
- Difícil: escolha: a agulha aponta para norte; o que fica à direita (este / leste)?; pares associados: os 4 do médio e 🐻‍❄️↔❄️; escolha: estás virado para sul; o que fica nas tuas / suas costas (norte)?

**Barril** (baixo, 34, 80)
- Fácil: cadeado: quantas maçãs há no barril (7)?; escolha: o que não é comida no barril (🧦 entre 🍎 🍞 🧀)?; cadeado: cada pirata quer 1 maçã; quantas maçãs são precisas para estes piratas (3)?
- Médio: cadeado: 8 maçãs para 2 piratas, quantas para cada um (4)?; cadeado: 6 bolachas / biscoitos em 3 pratos iguais, quantas / quantos em cada (2)?; escolha: em que desenho as maçãs estão bem divididas (todos com o mesmo)?
- Difícil: cadeado: 12 maçãs para 4 piratas, quantas para cada um (3)?; cadeado: 3 piratas comem 2 bolachas / biscoitos cada, havia 9, quantas / quantos sobram (3)?; cadeado: 10 maçãs para 3 piratas, todos com o mesmo; quantas sobram (1)?

**Âncora** (baixo centro, 50, 84; `requer: 'corda'`)
- Fácil: escolha: o que vai ao fundo da água (⚓ entre 🦆 🎈 🪵)?; pares: 4 pares de conchas e âncoras; cadeado: quantas conchas estão presas na âncora (4)?
- Médio: escolha: qual destas coisas flutua (🪵 entre 🪨 🔑 ⚓)?; cadeado: a corrente tem 10 elos e 4 já estão na água; quantos estão fora (6)?; ordem: a âncora a descer (no barco, a cair / caindo, na água, a afundar / afundando, no fundo).
- Difícil: escolha: adivinha "tenho penas, sou leve e não vou ao fundo" (🦆); cadeado: atiraram ao mar 3 rolhas, 4 pedras e 2 chaves; quantas coisas ficaram a flutuar / flutuando (3)?; ordem: do céu até ao fundo do mar (🐦 → ⛵ → 🐟 → 🐙 → ⚓).

**Baú do tesouro** (baixo esquerda, 16, 84; `requer: 'chave'`)
- Fácil: cadeado: quantas moedas há no baú (6)?; escolha: o que não é tesouro (🧦 entre 💎 👑 🪙)?; pares: 4 pares iguais (🪙 💎 🗝️ 🏴‍☠️).
- Médio: cadeado: 1 moeda de 2 e 1 moeda de 1, quanto dinheiro (3)?; cadeado: o baú tinha 7 moedas e o pirata gastou 2 (5); escolha: que saco tem mais moedas?
- Difícil: cadeado: 2 moedas de 2 e 1 moeda de 1, quanto dinheiro (5)?; escolha: qual vale mais, 3 moedas de 1 ou 1 moeda de 5?; cadeado: 8 moedas em 2 baús, um tem mais 2 do que o outro; quantas no maior (5)?

**Extras:**

**Garrafa com mensagem** (baixo direita, 66, 82) dá a **chave** do baú
- Fácil: escolha: qual chave tem a mesma forma que a sombra?; pares: 4 pares de garrafas iguais; escolha: a mensagem é um desenho (🗝️ 🏝️); o que manda procurar (🗝️)?
- Médio: escolha: a mensagem diz "a chave está debaixo / embaixo da tábua"; qual desenho mostra isso?; ordem: a viagem da garrafa (o pirata escreve, põe na garrafa, atira ao mar, a garrafa boia, chega à praia); pares: 5 pares iguais.
- Difícil: escolha: a mensagem está escrita de trás para a frente, "EVAHC"; qual é a palavra (CHAVE)?; escolha: "a chave não está no barril nem no canhão, está a sul do leme"; onde está?; cadeado: a garrafa andou 2 ilhas para norte e 3 para sul; a quantas ilhas do ponto de partida ficou (1)?

**Canhão com corda** (baixo direita, 88, 84) dá a **corda** da âncora
- Fácil: cadeado: quantas bolas de canhão há (5)?; escolha: para que lado aponta o canhão (➡️ entre ⬅️ ⬆️ ➡️)?; pares: 4 pares iguais.
- Médio: cadeado: 9 bolas em 3 montes iguais, quantas em cada (3)?; escolha: o canhão aponta para a direita; que barco está nesse lado?; pares: 5 pares iguais.
- Difícil: escolha: o canhão aponta para norte e roda um quarto de volta para a direita; para onde aponta (este / leste)?; cadeado: 10 bolas para 2 canhões, cada um com o mesmo; cada canhão disparou 1; quantas tem cada um agora (4)?; escolha: o que flutua, a bola de canhão ou o barril vazio (barril)?

**Palavras:** camarote, vigia (janela redonda do navio), luneta; papagaio aqui é a ave (pt-PT também usa "papagaio" para o brinquedo, que no Brasil é "pipa"); este (pt-PT) / leste (pt-BR); bolachas (pt-PT) / biscoitos (pt-BR); partido / quebrado; em baixo / embaixo; mais pequeno / menor; gerúndio (`a cair` / `caindo`).

### 2. A Nave Espacial (`nave`)

**História:** a criança visitou a nave da Capitã Estrela. Um meteorito passou perto e a escotilha fechou-se / se fechou sozinha.
**Saída:** escotilha (centro, x 50, y 45).
**Foco:** sequências numéricas (de 2 em 2, contagem para trás), regras de padrões, lógica de pistas.

**Janela dos planetas** (cima esquerda, 26, 22)
- Fácil: cadeado: quantos planetas se veem (5)?; escolha: qual planeta tem anéis (🪐 entre 🌍 🌕 ☀️)?; pares: 4 pares de planetas iguais.
- Médio: cadeado: contagem para o lançamento 5, 4, ❔, 2, 1 (3); escolha: que planeta vem a seguir em 🌍🪐🌍🪐❔ (🌍)?; ordem: os números da contagem para trás (5 → 1).
- Difícil: cadeado: contagem 9, 8, 7, ❔, 5 (6); cadeado: contagem de 2 em 2 para trás 10, 8, 6, ❔ (4); escolha: regra de 3 🌍🪐🌕🌍🪐❔ (🌕).

**Painel de botões** (meio esquerda, 28, 55)
- Fácil: escolha: qual botão é igual ao modelo (cor e desenho)?; ordem: carregar / apertar os botões 1, 2, 3, 4; cadeado: quantos botões vermelhos há (3)?
- Médio: escolha: que botão completa 🔴🟢🔴🟢❔ (🔴)?; cadeado: as luzes acendem 2, 3, 4, ❔ (5); ordem: carregar / apertar de 5 até 1.
- Difícil: ordem: carregar / apertar de 2 em 2 (2, 4, 6, 8, 10); escolha: que botão completa 🔴🟢🟢🔴🟢🟢🔴❔ (🟢)?; cadeado: o botão certo tem mais 2 do que o 5 e menos 1 do que o 8 (7).

**Radar** (cima direita, 70, 20)
- Fácil: cadeado: quantos pontos há no radar (4)?; escolha: qual nave está no centro?; pares: 4 pares de naves iguais.
- Médio: escolha: qual nave está mais perto do centro?; cadeado: os pontos aparecem 2, 3, 4… quantos a seguir (5)?; escolha: a luz pisca 💡⚫💡⚫❔ (💡).
- Difícil: cadeado: os pontos aparecem 1, 3, 5, 7… quantos a seguir (9)?; escolha: pistas "a nave amiga não está no centro, não é a maior e tem luz verde"; cadeado: há 9 pontos e somem 2 em cada volta; quantos ao fim de 3 voltas (3)?

**Robô ajudante** (meio direita, 68, 50; `requer: 'cartao'`)
- Fácil: escolha: que peça falta ao robô (o braço)?; cadeado: quantas luzes tem o robô (6)?; ordem: montar o robô (pés → corpo → cabeça → antena).
- Médio: escolha: que peça vem a seguir em ⚙️🔩⚙️🔩❔ (⚙️)?; cadeado: a bateria tem 8 riscas / listras e gastou 3 (5); ordem: os robôs pelo número de antenas, de 1 a 5.
- Difícil: escolha: pistas "não sou o robô azul, tenho duas antenas e não tenho rodas"; cadeado: a bateria tem 10 riscas / listras e gasta 2 por hora; quantas ficam ao fim de 3 horas (4)?; ordem: os robôs numerados de 3 em 3 (3, 6, 9, 12, 15).

**Capacete e comida espacial** (direita, 90, 48)
- Fácil: ordem: vestir o astronauta (meias → fato / traje → luvas → capacete); cadeado: quantos pacotes de comida há (6)?; escolha: o que não se come (👟 entre 🍎 🥕 🍞)?
- Médio: escolha: que pacote vem a seguir em 🍎🥕🍎🥕❔ (🍎)?; cadeado: o astronauta tinha 7 pacotes e comeu 2 (5); escolha: 1 maçã, 2 maçãs, 3 maçãs… qual pacote vem a seguir (4 maçãs)?
- Difícil: cadeado: no 1.º dia bebeu 1 copo, no 2.º 3, no 3.º 5; quantos no 4.º (7)?; escolha: pistas "o pacote não é doce, não é verde e é redondo"; ordem com regras: 5 peças, "o fato / traje antes das botas, as luvas depois do fato / traje, o capacete por último".

**Estufa** (baixo esquerda, 16, 82)
- Fácil: cadeado: quantas folhas tem a planta (5)?; escolha: o que a planta precisa para crescer (💧 entre 🧦 🔑 🎈)?; pares: 4 pares de vasos iguais.
- Médio: cadeado: no 1.º dia a planta tem 2 folhas, no 2.º 3; quantas no 3.º (4)?; escolha: que vaso vem a seguir em 🌷🌵🌷🌵❔ (🌷)?; ordem: os vasos de 1 a 5 flores.
- Difícil: cadeado: a planta tinha 1 cm e cresce 2 cm por dia; quanto mede ao fim de 3 dias (7)?; escolha: pistas "a minha planta não tem flores, não é um cato / cacto e tem folhas grandes"; cadeado: cada dia nascem o dobro das flores, 1, 2, 4, ❔ (8).

**Telescópio** (baixo, 34, 80)
- Fácil: cadeado: quantas estrelas se veem (7)?; escolha: o que se vê no céu de noite (⭐ entre 🌈 🐄 🚗)?; pares: 4 pares de estrelas iguais.
- Médio: cadeado: estrelas cadentes 1, 2, 3… quantas na 4.ª noite (4)?; escolha: qual desenho tem os mesmos pontos que a constelação?; escolha: o que vem a seguir em ⭐☄️⭐☄️❔ (⭐)?
- Difícil: cadeado: estrelas cadentes 2, 4, 6… quantas na 4.ª noite (8)?; escolha: ligar os pontos de uma constelação; que figura formam?; cadeado: um cometa passa de 3 em 3 noites e passou na noite 1; em que noite passa pela 3.ª vez (7)?

**Mapa das estrelas** (baixo centro, 50, 86)
- Fácil: pares: 4 pares iguais (⭐ 🌙 ☀️ 🪐); cadeado: quantas estrelas tem o mapa (8)?; escolha: o que está no céu de dia (☀️ entre 🌙 ⭐ 🦉)?
- Médio: pares associados: 🚀↔🔥, 👩‍🚀↔🪖, 🌍↔💧, ⭐↔✨; escolha: o que dá luz própria, o Sol ou a Lua?; escolha: o que vem a seguir em ☀️☀️🌙☀️☀️❔ (🌙)?
- Difícil: pares associados: os 4 do médio e ☀️↔🌙; escolha: pistas "a estrela da Capitã é amarela, não é a maior e tem 5 pontas"; cadeado de 2 números: as estrelas estão numeradas 3, 6, 9, ❔ (12).

**Caixas de carga** (baixo direita, 68, 82; `requer: 'estrela'`)
- Fácil: cadeado: quantas caixas há (6)?; escolha: qual pilha vai cair (a que tem a caixa grande por cima)?; pares: 4 pares de caixas iguais.
- Médio: escolha: pistas "a caixa não é azul e tem uma estrela"; cadeado: as caixas têm os números 1, 2, 3, ❔ (4); ordem: empilhar de baixo para cima contando para trás (5 → 1).
- Difícil: escolha: pistas "está por cima da verde, não tem estrela e não é a do topo"; escolha: qual de 4 pilhas vai cair (detalhe: a caixa torta ou mal apoiada)?; cadeado de 2 números: as caixas vão de 5 em 5, 5, 10, 15, ❔ (20).

**Extras:**

**Armário** (esquerda, 10, 50) dá o **cartão de acesso** do robô
- Fácil: escolha: qual cartão é igual ao modelo?; pares: 4 pares de cartões; cadeado: quantos cartões há no armário (5)?
- Médio: escolha: pistas "é azul e tem estrela"; escolha: que cartão vem a seguir em 🟦🟨🟦🟨❔ (🟦)?; pares: 5 pares de cartões.
- Difícil: escolha: pistas "não é azul, tem estrela e não tem riscas / listras"; ordem: cartões de 3 em 3 (3, 6, 9, 12, 15); cadeado: o código é o número que vem depois de 9, 7, 5 (3).

**Bichinho extraterrestre** (baixo direita, 88, 84) dá a **chave-estrela** das caixas
- Fácil: escolha: o bichinho só come coisas verdes (🥦 entre 🍓 🍌 🍊); cadeado: quantos olhos tem o bichinho (5)?; pares: 4 pares de bichinhos iguais.
- Médio: escolha: o bichinho só come coisas verdes e redondas (🍏 entre 🥒 🍊 🍌); cadeado: tem 3 olhos e nasce um olho novo por dia; quantos amanhã (4)?; escolha: que mancha vem a seguir em 🟣🟡🟣🟡❔ (🟣)?
- Difícil: escolha: "não come nada vermelho nem comprido e gosta de coisas redondas" (🫐 entre 🍓 🥕 🍌); cadeado: comeu 1 bolinha no 1.º dia, 2 no 2.º e 3 no 3.º; quantas ao todo (6)?; escolha: que mancha vem a seguir em 🟣🟡🟡🟣🟡🟡❔ (🟣)?

**Palavras:** ecrã (pt-PT) / tela (pt-BR); carregar no botão (pt-PT) / apertar o botão (pt-BR); fato (pt-PT) / traje (pt-BR); cato (pt-PT) / cacto (pt-BR); riscas / listras; extraterrestre nas duas.

### 3. O Laboratório do Inventor (`laboratorio`)

**História:** o Professor Parafuso saiu para almoçar e a porta de engrenagens trancou-se / se trancou. Ele deixou números escondidos nas experiências.
**Saída:** porta de engrenagens (centro, x 50, y 45).
**Foco:** misturas de cores, causa e efeito, formas e metades, rodas e alavancas, comparar pesos na balança.

**Armário de frascos** (esquerda, 10, 50)
- Fácil: escolha: qual frasco está vazio?; cadeado: quantos frascos estão cheios (4)?; pares: 4 pares de frascos iguais.
- Médio: escolha: qual frasco está a meio / pela metade?; ordem: do vazio ao cheio (vazio, pouco, a meio / pela metade, quase cheio, cheio); cadeado: há 8 frascos e metade estão cheios; quantos (4)?
- Difícil: ordem: do vazio ao cheio com quartos (vazio, um quarto, metade, três quartos, cheio); escolha: juntando dois frascos a meio / pela metade, o que se tem (um frasco cheio)?; cadeado: 3 frascos cheios e 2 a meio / pela metade; juntando tudo, quantos frascos cheios (4)?

**Quadro de giz (pt-PT) / Lousa (pt-BR)** (cima esquerda, 28, 22)
- Fácil: escolha: qual é o círculo (⚪ entre 🔺 🟦 ⭐)?; cadeado: quantos triângulos estão desenhados (5)?; pares: 4 pares de formas iguais.
- Médio: escolha: qual forma tem 3 lados?; cadeado: quantos lados tem o quadrado (4)?; escolha: qual figura está cortada em duas metades iguais?
- Difícil: cadeado: quantos lados têm juntos um triângulo e um quadrado (7)?; escolha: que forma sai ao cortar um quadrado ao meio pela diagonal (triângulo)?; escolha: qual forma não tem lados direitos nem cantos (círculo)?

**Tubos de ensaio** (meio esquerda, 28, 55; `requer: 'oculos'`)
- Fácil: pares: 4 pares de tubos da mesma cor; cadeado: quantos tubos azuis há (3)?; escolha: qual não é um tubo de ensaio (🍌 entre 🧪 🧪 🧪)?
- Médio: escolha: vermelho + amarelo dá (🟠)?; pares associados: "🔴+🟡"↔🟠, "🔵+🟡"↔🟢, "🔴+🔵"↔🟣, "⚫+⚪"↔🔘; cadeado: quantos tubos são verdes? Não contes os outros (4).
- Difícil: pares associados: os 4 do médio e "🔴+⚪"↔🩷; escolha: que cores misturei para ter roxo (🔴+🔵)?; cadeado: 3 tubos vermelhos e 3 amarelos, misturo um de cada; quantos tubos laranja (3)?

**Engrenagens** (cima direita, 70, 20)
- Fácil: escolha: qual roda é a maior?; cadeado: quantas rodas dentadas há (6)?; pares: 4 pares de rodas iguais.
- Médio: escolha: rodando a manivela, que roda se mexe (a que está encostada)?; escolha: a roda grande roda para a direita; para que lado roda a pequena encostada (esquerda)?; cadeado: a pequena dá 2 voltas por cada volta da grande; a grande deu 2, quantas deu a pequena (4)?
- Difícil: escolha: 3 rodas em fila; a primeira roda para a direita, e a terceira (direita)?; cadeado: a pequena dá 2 voltas por cada volta da grande; a grande deu 4, quantas deu a pequena (8)?; escolha: alavanca: para levantar a pedra com menos força, onde se empurra (longe do apoio)?

**Sistema solar** (meio direita, 68, 48)
- Fácil: escolha: o que dá luz e calor (☀️ entre 🌍 🌙 🪨)?; cadeado: quantos planetas tem a maqueta / maquete (8)?; escolha: com o sol no céu é dia ou noite?
- Médio: escolha: a lâmpada faz de Sol e ilumina a bola; em que lado da bola é dia (o virado para a luz)?; cadeado: a Terra tem 1 lua e Marte tem 2; quantas luas juntos (3)?; escolha: o que anda à volta da Terra (🌙 entre ☀️ 🪐 ⭐)?
- Difícil: escolha: porque é de noite? (a Terra rodou e ficámos / ficamos de costas para o Sol); escolha: se a Terra não rodasse, o que acontecia (de um lado era sempre dia)?; cadeado: a maqueta / maquete tem 8 planetas e 3 têm a luz acesa; quantos estão apagados (5)?

**Íman (pt-PT) / Ímã (pt-BR)** (baixo, 32, 80)
- Fácil: escolha: o que o íman / ímã apanha / pega (📎 entre 🪵 🧸 🍎)?; cadeado: quantos clipes estão presos (5)?; pares: 4 pares iguais (🧲 📎 🔩 🔑).
- Médio: escolha: qual destas coisas é de metal (🔑 entre 🧦 🪵 🍪)?; cadeado: tinha 6 clipes presos e caíram 2 (4); pares: 5 pares iguais.
- Difícil: cadeado: cada íman / ímã segura 3 clipes; quantos seguram 3 (9)?; escolha: adivinha "apanho / pego clipes, tenho dois polos e sou vermelho e azul" (🧲); escolha: polos da mesma cor afastam-se / se afastam, de cores diferentes juntam-se / se juntam; qual par se junta?

**Aquário** (baixo centro, 50, 84)
- Fácil: escolha: o que vive no aquário (🐟 entre 🐄 🐔 🐈)?; cadeado: quantos peixes há (6)?; escolha: o que acontece ao gelo ao sol (derrete)?
- Médio: escolha: o que acontece ao gelo na água morna (derrete)?; cadeado: a água estava na risca 2 e cada pedra sobe 1 risca; puseste / você pôs 3 pedras, em que risca está (5)?; ordem: o cubo de gelo a derreter / derretendo, 5 desenhos do cubo à poça.
- Difícil: cadeado: a água está na risca 1; pedra grande sobe 2 riscas e pequena 1; puseram 2 grandes e 1 pequena (6); escolha: qual destas coisas não derrete ao sol (🪨 entre 🧊 🍦 ⛄)?; ordem: a viagem da água (🧊 → 💧 → ♨️ → ☁️ → 🌧️).

**Balança** (baixo direita, 68, 80)
- Fácil: escolha: que lado pesa mais (o que está em baixo / embaixo)?; escolha: o que pesa mais, 🍉 ou 🍒?; cadeado: quantas maçãs há no prato (5)?
- Médio: cadeado: a balança está equilibrada, de um lado 5 maçãs e do outro 2 e ❔ (3); escolha: 1 melancia pesa o mesmo que 4 maçãs; que lado pesa mais, 🍉 ou 🍎🍎🍎?; escolha: qual balança está equilibrada?
- Difícil: cadeado: 1 melancia pesa o mesmo que 4 maçãs; 2 melancias pesam o mesmo que quantas maçãs (8)?; cadeado: 🍍 pesa como 2 🍎 e 🍉 pesa como 2 🍍; a melancia pesa como quantas maçãs (4)?; escolha: qual das 4 balanças não está certa (o lado mais leve está em baixo / embaixo)?

**Robô de latas** (baixo direita, 88, 84; `requer: 'pilha'`)
- Fácil: escolha: o que faz andar o robô (🔋 entre 🍌 🧦 🪨)?; cadeado: de quantas latas é feito o robô (7)?; pares: 4 pares iguais (🥫 🔩 🔋 💡).
- Médio: escolha: por onde passa a eletricidade (🥄 de metal entre 🧸 🪵 🧦)?; ordem: causa e efeito (pôr a pilha → ligar o fio → carregar / apertar o interruptor → a luz acende → o robô anda); cadeado: o robô tem 2 pilhas e precisa de 5; quantas faltam (3)?
- Difícil: ordem: ligar o circuito (pilha → fio → interruptor → fio → lâmpada); escolha: a lâmpada não acende; porquê (o fio está cortado)?; cadeado: o robô tem 4 pilhas e 1 está gasta; cada pilha boa dá 2 voltas; quantas voltas dá (6)?

**Extras:**

**Estante do microscópio** (direita, 90, 48) dá os **óculos de proteção**
- Fácil: pares: 4 pares de micróbios sorridentes; escolha: o que serve para ver coisas pequenas (🔍 entre 🥄 🧦 🎈)?; cadeado: quantos micróbios há no vidro (5)?
- Médio: pares: 5 pares de micróbios; escolha: qual destes desenhos é a formiga vista à lupa (maior)?; cadeado: havia 7 micróbios no vidro e limparam 2 (5).
- Difícil: pares: 6 pares de micróbios; escolha: qual metade completa o desenho do micróbio (metades e simetria)?; cadeado: cada micróbio divide-se / se divide em 2; havia 2, dividiram-se / se dividiram duas vezes, quantos há (8)?

**Mesa com gaveta** (baixo esquerda, 16, 82) dá a **pilha** do robô
- Fácil: escolha: qual destes precisa de pilha (🔦 entre 🕯️ 🪁 📖)?; cadeado: quantas pilhas há na gaveta (6)?; pares: 4 pares iguais.
- Médio: escolha: o que se apaga quando se tira a pilha (🔦 entre ☀️ 🕯️ 🔥)?; cadeado: havia 9 pilhas e o professor levou 4 (5); pares: 5 pares iguais.
- Difícil: escolha: qual não precisa de pilha nem de tomada (🪁 entre 🔦 📻 💡)?; cadeado: cada lanterna leva 2 pilhas; quantas pilhas para 3 lanternas (6)?; escolha: a pilha tem + e −; em que desenho está bem posta?

**Palavras:** íman / ímã (plural ímanes / ímãs); quadro / lousa; apanhar (pt-PT) / pegar (pt-BR); a meio (pt-PT) / pela metade (pt-BR); maqueta (pt-PT) / maquete (pt-BR); em baixo / embaixo; gerúndio (`a derreter` / `derretendo`); "mesa com gaveta" serve às duas (evite secretária / escrivaninha).

### 4. O Museu dos Dinossauros (`museu`)

**História:** a criança adormeceu / pegou no sono no museu durante a visita da escola. Acordou de noite e a porta grande estava trancada!
**Saída:** porta do museu (centro, x 50, y 45).
**Foco:** tempo (ontem, hoje, amanhã; antes e depois), ciclos de vida, comprimento, classificar animais.

**Esqueleto de T-rex** (esquerda, 12, 50)
- Fácil: escolha: qual osso é o mais comprido (4 ossos à vista)?; cadeado: quantos dentes tem o desenho (8)?; pares: 4 pares de ossos iguais.
- Médio: escolha: pelos dentes afiados, o T-rex comia… (🍖 entre 🥕 🍞 🍦)?; cadeado: o T-rex mede 4 passos e o triceratops 3; quanto medem juntos (7)?; escolha: quem viveu primeiro, o T-rex ou o teu avô / seu avô?
- Difícil: cadeado: 2 braços pequenos com 2 dedos cada, quantos dedos nos braços (4)?; cadeado: o T-rex mede 9 passos e o bebé / bebê 3; quantos passos a mais mede o T-rex (6)?; ordem: do mais antigo ao mais recente (dinossauros → mamute → pessoas das cavernas → castelo → avião).

**Quadro dos dinossauros** (cima esquerda, 28, 22)
- Fácil: cadeado: quantos dinossauros há no quadro (6)?; escolha: qual não é um dinossauro (🚗 entre 🦕 🦖 🦕)?; pares: 4 pares (🦕 🦖 🥚 🌋).
- Médio: cadeado: quantos dinossauros têm pescoço comprido? Não contes os outros (4); escolha: que animal de hoje também tem escamas (🐍 entre 🐄 🐑 🐕)?; escolha: qual dinossauro come plantas (o de pescoço comprido, a comer folhas)?
- Difícil: escolha: que animal de hoje já vivia no tempo dos dinossauros (🐊 entre 🐘 🐄 🐕)?; cadeado: há 3 dinossauros de pescoço comprido e o dobro de pequenos; quantos pequenos (6)?; cadeado: quantos dinossauros do quadro não comem plantas (3)?

**Ninho de ovos** (meio esquerda, 28, 55)
- Fácil: cadeado: quantos ovos há no ninho (7)?; ordem: ovo → ovo a rachar / rachando → bebé / bebê → dinossauro adulto; pares: 4 pares de ovos iguais.
- Médio: cadeado: havia 9 ovos e já nasceram 5; quantos faltam nascer (4)?; ordem: ovo → a rachar / rachando → bebé / bebê → jovem → adulto; escolha: qual é o bebé / bebê da galinha (🐥 entre 🐛 🐟 🐸)?
- Difícil: ordem: o ciclo inteiro em 6 (ovo → a rachar / rachando → bebé / bebê → jovem → adulto → põe ovos); cadeado: nasce 1 ovo por dia; hoje nasceram 2 e há 3 por nascer; daqui a quantos dias nasce o último (3)?; escolha: a lagarta 🐛 transforma-se / se transforma em… (🦋 entre 🐝 🪲 🐞)?

**Fóssil de concha** (cima direita, 70, 20)
- Fácil: escolha: qual é a concha (🐚 entre 🍕 🚗 🧦)?; cadeado: quantos fósseis há na pedra (5)?; pares: 4 pares (🐚 🦴 🪨 🦕).
- Médio: escolha: o que é um fóssil (a marca de um animal muito antigo na pedra)?; escolha: qual destes vive no mar (🐚 entre 🐄 🐓 🐿️)?; cadeado: havia 3 conchas e a cientista achou mais 4 (7).
- Difícil: escolha: qual destes animais não tem ossos (🐌 entre 🐟 🐸 🐦)?; escolha: a rocha tem camadas; onde está o fóssil mais antigo (na camada de baixo)?; cadeado: quantos destes animais não têm ossos (🐌 🐙 🪱 entre 🐟 🐦 → 3)?

**Vitrine de cristais** (meio direita, 68, 48; `requer: 'lanterna'`)
- Fácil: pares: 4 pares de cristais iguais; cadeado: quantos cristais há (6)?; escolha: qual cristal brilha com a lanterna?
- Médio: pares: 5 pares de cristais; escolha: qual cristal é o mais comprido?; cadeado: quantos cristais são azuis? Não contes os outros (3).
- Difícil: pares: 6 pares de cristais; escolha: qual cristal é diferente dos outros (detalhe)?; cadeado: o cristal cresce 1 cm por ano e tem 3 cm; quanto terá daqui a 2 anos (5)?

**Vulcão** (direita, 90, 50)
- Fácil: escolha: o que sai do vulcão quando acorda (🔥 lava entre 🍦 💧 ❄️)?; ordem: o vulcão a acordar / acordando (🏔️ → 💨 → 🔥 → 🌋); cadeado: quantas nuvens de fumo / fumaça há (4)?
- Médio: ordem: 5 desenhos (vulcão calmo → fumo / fumaça → a terra treme → lava → rocha nova); escolha: a lava arrefeceu / esfriou; o que vem depois (rocha)?; cadeado: o vulcão deitou fumo / soltou fumaça ontem e hoje, e amanhã também; quantos dias ao todo (3)?
- Difícil: cadeado: o vulcão acordou anteontem; há quantos dias foi (2)?; ordem: depois da lava (lava quente → arrefece / esfria → rocha → nasce uma planta → floresta); escolha: o dinossauro viu o fumo / a fumaça e fugiu; o que veio antes, o fumo / a fumaça ou a fuga?

**Pegadas** (baixo, 32, 82)
- Fácil: escolha: qual pegada é a maior?; cadeado: quantas pegadas há (8)?; escolha: de quem é a pegada grande (🦖 entre 🐈 🐦 🐜)?
- Médio: escolha: qual pegada é a mais comprida (4 parecidas)?; cadeado: duas pegadas de 3 palmos cada; quanto medem juntas (6)?; escolha: qual pegada é de ave (três dedos finos)?
- Difícil: cadeado: o T-rex dá passos de 3 palmos e deu 3 passos; quantos palmos andou (9)?; cadeado: a pegada grande mede 8 palmos e a pequena 3; quantos palmos a mais (5)?; escolha: pistas "não tem garras, é redonda e não é a mais pequena / menor".

**Ampulheta** (baixo centro, 50, 82)
- Fácil: escolha: qual ampulheta já acabou (areia toda em baixo / embaixo)?; ordem: a areia a cair / caindo (toda em cima → mais em cima → mais em baixo / embaixo → toda em baixo / embaixo); cadeado: quantas ampulhetas há (5)?
- Médio: escolha: se hoje é segunda-feira, que dia é amanhã (terça-feira)?; escolha: se hoje é segunda-feira, que dia foi ontem (domingo)?; cadeado: virou a ampulheta de 3 minutos e depois a de 2; quantos minutos passaram (5)?
- Difícil: escolha: anteontem foi sábado; que dia é hoje (segunda-feira)?; cadeado: a ampulheta demora 3 minutos e foi virada 3 vezes; quantos minutos passaram (9)?; ordem: os dias da escola (segunda → terça → quarta → quinta → sexta).

**Globo** (baixo direita, 88, 82)
- Fácil: escolha: qual destes animais voa (🦅 entre 🐄 🐘 🐊)?; cadeado: quantos animais há no globo (6)?; pares: 4 pares de animais iguais.
- Médio: escolha: qual destes tem escamas (🐟 entre 🐈 🐑 🐒)?; cadeado: quantas aves há no globo? Não contes os outros (3); escolha: qual destes é um inseto (🐝 entre 🐦 🐸 🐁)?
- Difícil: escolha: qual destes é um mamífero que voa (🦇 entre 🦅 🦋 🐝)?; escolha: qual destes é um réptil (🐢 entre 🐸 🐟 🐧)?; cadeado: quantos animais do globo não são mamíferos (5)?

**Extras:**

**Escavação** (baixo direita, 68, 84) dá a **chave do caixote**
- Fácil: pares: 4 pares (🦴 🦕 ⛏️ 🪨); cadeado: quantos ossos há na terra (5)?; escolha: o que serve para escavar (⛏️ entre 🍰 🎈 🧦)?
- Médio: pares: 5 pares iguais; cadeado: achou 2 ossos ontem e 3 hoje (5); pares associados: animal ↔ parte (🦖↔🦴, 🐢↔🐚, 🐘↔🦷, 🐦↔🪶).
- Difícil: pares associados: os 4 do médio e 🦕↔🥚; cadeado: achou 2 ossos por dia durante 3 dias e perdeu 1 (5); cadeado: o osso mede 4 palmos e a pá 2; quantas pás de comprimento tem o osso (2)?

**Caixote trancado** (baixo esquerda, 14, 84; `requer: 'chave'`) dá a **lanterna** para ver a vitrine
- Fácil: ordem: 4 ossos do mais curto ao mais comprido; cadeado: quantas coisas há no caixote (6)?; escolha: o que dá luz (🔦 entre 🪨 🦴 🧦)?
- Médio: ordem: 5 ossos do mais curto ao mais comprido; cadeado: o caixote tem 8 coisas e tiraste / você tirou 3 (5); escolha: qual fita mede o mesmo que o osso?
- Difícil: ordem: 6 ossos com o comprimento escrito em palmos (do mais curto ao mais comprido); escolha: qual osso mede o mesmo que 2 ossos pequenos juntos?; cadeado: 3 filas de 3 fósseis e falta 1; quantos há (8)?

**Palavras:** adormeceu (pt-PT) / pegou no sono (pt-BR); bebé / bebê; fumo (pt-PT) / fumaça (pt-BR); deitar fumo / soltar fumaça; arrefecer (pt-PT) / esfriar (pt-BR); em baixo / embaixo; mais pequena / menor; gerúndio (`a rachar` / `rachando`, `a cair` / `caindo`).

### 5. A Pirâmide do Faraó (`piramide`)

**História:** numa visita ao Egito, a criança seguiu um gato preto até uma câmara secreta da pirâmide. A porta de pedra fechou-se / se fechou devagarinho atrás dela.
**Saída:** porta de pedra com o sol (centro, x 50, y 45).
**Foco:** códigos secretos (cada símbolo vale um número), numeração com traços, filas com pistas lógicas.

**Tocha** (esquerda, 10, 50)
- Fácil: cadeado: quantos traços há na parede ao lado da tocha (6)?; escolha: qual tocha está acesa?; pares: 4 pares iguais (🔥 🏺 🐈‍⬛ ☀️).
- Médio: cadeado: traços em grupo, ||||| e || (7); cadeado: 🔥 vale 2; quanto vale 🔥🔥 (4)?; ordem: tochas em fila com uma pista ("a grande é a primeira, a pequena é a última").
- Difícil: escolha: 🔥 vale 3 e 🌙 vale 1; que grupo vale 7 (🔥🔥🌙)?; cadeado: havia |||| |||| traços e apagaram 3 (5); ordem: as tochas acendem por pistas ("a amarela é a primeira, a azul antes da verde, a vermelha é a última").

**Hieróglifos** (cima esquerda, 28, 22)
- Fácil: escolha: qual símbolo é igual ao modelo (👁️)?; cadeado: quantas 🐍 há na parede (5)?; pares: 4 pares de símbolos.
- Médio: cadeado: 🐍 vale 2; quanto vale 🐍🐍🐍 (6)?; pares associados: grupo ↔ número (🐍↔1, 🐍🐍↔2, 🐍🐍🐍↔3, 🐍🐍🐍🐍↔4); escolha: 👁️ vale 3; que grupo vale 6 (👁️👁️)?
- Difícil: cadeado: 🐍 vale 2 e 👁️ vale 3; quanto vale 🐍👁️👁️ (8)?; escolha: ☀️ vale 4; que símbolo junto com ☀️ dá 9 (o que vale 5)?; pares associados: 5 grupos de símbolos ↔ o seu / seu valor.

**Estátua do gato** (meio esquerda, 28, 52)
- Fácil: escolha: quem sou? "sou preto e faço miau" (🐈‍⬛); cadeado: quantos gatos de pedra há (4)?; pares: 4 pares de animais do Egito.
- Médio: escolha: quem sou? "tenho bossas e ando no deserto" (🐪); ordem: 5 animais em fila com 2 pistas ("o gato é o primeiro, o camelo é o último"); cadeado: o gato é o 3.º da fila; quantos estão à frente dele (2)?
- Difícil: ordem: 5 animais em fila por pistas ("o gato está entre o crocodilo e o camelo; o escorpião é o último"); escolha: quem sou? "não tenho pernas, vivo na areia e não sou peixe" (🐍); cadeado: numa fila de 9 animais, o gato é o 4.º a contar da frente; quantos estão atrás dele (5)?

**Pintura do barco** (cima direita, 70, 20)
- Fácil: cadeado: quantos remadores há (6)?; escolha: qual barco é igual à pintura?; pares: 4 pares iguais.
- Médio: cadeado: o barco tem 4 remos de um lado e 4 do outro; quantos ao todo (8)?; escolha: ☀️ na vela quer dizer "rei"; qual é o barco do rei?; ordem: 4 barcos em fila com uma pista ("o dourado vai à frente").
- Difícil: ordem: barcos no Nilo por pistas ("o de vela branca vai à frente do dourado; o pequeno vai entre eles; o de remos é o último"); cadeado: 9 remadores, 3 descansam e os outros remam aos pares; quantos pares (3)?; escolha: na pintura, 🌿 quer dizer "rio" e 🐦 quer dizer "céu"; qual pintura mostra um pássaro sobre o rio (🐦 em cima de 🌿)?

**Balança dourada** (meio direita, 68, 48; `requer: 'moedas'`)
- Fácil: cadeado: quantas moedas há no prato (5)?; escolha: qual prato tem mais moedas?; pares: 4 pares de moedas iguais.
- Médio: cadeado: as moedas têm traços; quanto valem |, || e || juntas (5)?; escolha: qual moeda tem 3 traços?; pares associados: moeda com traços ↔ número.
- Difícil: cadeado: ☀️ vale 5 e 🌙 vale 1; quanto vale o prato ☀️🌙🌙 (7)?; escolha: pistas "a moeda do faraó não tem sol, tem mais de 2 traços e não é a última da fila"; escolha: qual prato vale 6 (☀️🌙 entre ☀️☀️, 🌙🌙🌙, ☀️🌙🌙)?

**Sarcófago** (direita, 90, 48; `requer: 'escaravelho'`)
- Fácil: pares: 4 pares de joias iguais; cadeado: quantas joias há (7)?; escolha: qual é a coroa (👑 entre 💍 📿 🏺)?
- Médio: pares associados: joia ↔ onde se usa (👑↔cabeça, 💍↔dedo, 📿↔pescoço, ⌚↔pulso); ordem: 4 joias em fila com uma pista ("a coroa é a primeira"); cadeado: o faraó tinha 9 anéis e pôs 4 (5).
- Difícil: ordem: as joias em fila por pistas ("a coroa é a primeira, o anel está logo antes do colar"); pares associados: os 4 do médio e 👡↔pé; cadeado: 👑 vale 3 e 💍 vale 1; quanto vale a máscara 👑💍💍💍 (6)?

**Vasos de barro** (baixo esquerda, 16, 82)
- Fácil: escolha: qual vaso é igual ao modelo (riscas / listras bem diferentes)?; cadeado: quantos vasos há (6)?; cadeado: quantos traços tem o vaso (4)?
- Médio: escolha: qual vaso é igual ao modelo (uma diferença)?; cadeado: o vaso tem 3 riscas / listras em cima e 2 em baixo / embaixo (5); ordem: os vasos de 1 a 5 traços.
- Difícil: cadeado: numeração egípcia, ∩ vale 10 e | vale 1; quanto vale ∩ | | | (13)?; escolha: qual vaso é igual ao modelo (detalhes finos das riscas / listras)?; escolha: qual vaso vale 21 (∩ ∩ | entre ∩ | |, ∩ ∩ | |, ∩ ∩ ∩)?

**Maquete das pirâmides** (baixo centro, 50, 84)
- Fácil: cadeado: quantos blocos há na fila de baixo (4)?; escolha: a que pirâmide falta um bloco?; pares: 4 pares de blocos iguais.
- Médio: cadeado: pirâmide de blocos 3 + 2 + 1 (6); ordem: construir de baixo para cima (fila de 4, de 3, de 2, de 1); escolha: qual pirâmide tem mais blocos?
- Difícil: cadeado de 2 números: pirâmide de blocos 4 + 3 + 2 + 1 (10); ordem: 5 filas de baixo para cima (5, 4, 3, 2, 1); cadeado: a pirâmide de 4 filas perdeu o bloco do topo e um da base; quantos blocos tem (8)?

**Tábua de pontos** (baixo direita, 68, 84)
- Fácil: cadeado: quantos pontos tem a peça de dominó (5)?; escolha: qual peça tem 3 pontos?; pares: 4 pares de peças iguais.
- Médio: escolha: qual peça de dominó tem 6 pontos ao todo?; cadeado: a peça tem 4 de um lado e 2 do outro (6); ordem: as peças de 1 a 5 pontos.
- Difícil: escolha: pistas "tem mais de 5 pontos, um dos lados está vazio e não é a de 9"; cadeado: as peças (3|2) e (1|3) juntas (9); ordem: encadear 5 peças, cada uma toca a seguinte com o mesmo número.

**Extras:**

**Escaravelho dourado** (baixo, 34, 82) dá o **escaravelho-chave** do sarcófago
- Fácil: escolha: qual escaravelho é igual ao da porta (4 bem diferentes)?; cadeado: quantas pintas tem o escaravelho (4)?; pares: 4 pares de escaravelhos.
- Médio: escolha: qual escaravelho é igual ao da porta (uma diferença)?; cadeado: quantos escaravelhos têm sol? Não contes os outros (3); pares: 5 pares de escaravelhos.
- Difícil: escolha: qual é igual ao da porta (4 quase iguais)?; escolha: pistas "tem 2 pintas, não tem as asas abertas e está virado para a direita"; cadeado: numa fila de 7, o certo é o 3.º a contar do fim; em que lugar está a contar do início (5)?

**Baú aberto** (baixo direita, 88, 84) dá as **moedas** da balança
- Fácil: cadeado: quantas moedas há no baú (7)?; escolha: o código tem só o ☀️; qual tecla abre o baú?; pares: 4 pares iguais.
- Médio: cadeado: código de 2 símbolos, ☀️ vale 1 e 🌙 vale 2; quanto vale ☀️🌙 (3)?; escolha: qual fila de símbolos é igual à do baú?; pares: 5 pares iguais.
- Difícil: cadeado: código de 3 símbolos, ☀️ vale 1, 🌙 vale 2 e ⭐ vale 3; quanto vale ⭐🌙☀️ (6)?; escolha: com o mesmo código, que fila vale 9 (⭐⭐⭐ entre ⭐⭐🌙, ☀️🌙⭐, 🌙🌙🌙)?; ordem: 5 grupos de símbolos do que vale menos ao que vale mais.

**Palavras:** riscas (pt-PT) / listras (pt-BR); bossas nas duas; devagarinho nas duas; em baixo / embaixo; o seu valor (pt-PT) / seu valor (pt-BR).
