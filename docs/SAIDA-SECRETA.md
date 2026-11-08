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

Cada fonte e cada extra traz **3 enigmas por nível** (fácil, médio, difícil), como no sótão. As listas abaixo são geradas dos arquivos das salas: texto em pt-PT (o pt-BR está no arquivo), o `visual` entre crases e a resposta entre parênteses. Os tipos são `cadeado` (código), `escolha`, `ordem` e `pares`. As ideias foram conferidas contra o sótão e entre as salas: nenhuma se repete. Ideias que o sótão já usa e que **não** podem voltar: ler horas e partes do dia, rotina do dia, patas e rodas, ordenar animais por tamanho ou peso, semente até à árvore, fases da lua, onde nasce o sol, roupa para a chuva ou a neve, instrumentos, intrusos de fruta, animal ou leitura, padrões de cores de livros e novelos, quem tem penas, quem nasce de ovo, rimas.

### 1. O Navio Pirata (`navio`)

**História:** a criança entrou no camarote do capitão para ver o mapa do tesouro, e a porta trancou-se / se trancou com uma onda. O cadeado tem desenhos de coisas do camarote.
**Saída:** porta do camarote (centro, x 50, y 45).
**Foco:** direções e pontos cardeais, mapas com coordenadas, partilhar (dividir), flutua ou afunda.

**Leme** (`leme`)
- Fácil: escolha: O capitão rodou o leme para a esquerda. Para onde vai o barco? `☸️ ⬅️` (⬅️ Para a esquerda, entre ➡️ ⬆️); cadeado: O leme tem punhos à volta para o capitão o agarrar. Quantos punhos tem? Escreve o número. `☸️` (8); ordem: No convés está desenhado o caminho do barco. Copia as setas pela mesma ordem. (⬆️ → ➡️ → ⬇️ → ⬅️)
- Médio: escolha: O barco ia para norte e o capitão virou para a direita. Para onde vai agora? `🧭 ⬆️` (➡️ Este, entre ⬅️ ⬇️); ordem: O capitão dá as ordens: norte, este, sul, oeste e, no fim, lançar a âncora! Toca nas setas por essa ordem. (⬆️ → ➡️ → ⬇️ → ⬅️ → ⚓); cadeado: O leme tem 8 punhos e 3 estão partidos. Quantos punhos estão bons? `☸️` (5)
- Difícil: escolha: O barco ia para norte e o capitão rodou o leme até dar meia volta. Para onde vai agora? `🧭 ⬆️ 🔄` (⬇️ Sul, entre ⬆️ ➡️ ⬅️); ordem: O capitão escreveu o caminho: primeiro oeste, depois norte, depois este, depois sul. Põe as setas por ordem. (⬅️ → ⬆️ → ➡️ → ⬇️); escolha: O vento sopra do norte. Para onde vai a bandeira do mastro? `🌬️ 🚩` (⬇️ Sul, entre ⬆️ ➡️ ⬅️)

**Mapa do tesouro** (`mapa`)
- Fácil: cadeado: Quantas palmeiras há no mapa? Escreve o número. `🌴 🌴 🌴 🌴 🌴` (5); escolha: O mapa diz: «O tesouro está ao pé da palmeira.» Em que sítio pões o ❌? `🗺️ ❌` (🌴 Palmeira, entre 🪨 🛖 ⛰️); escolha: Segue as pegadas do pirata. A que ilha chegam? `🌋 ⛵ 👣 👣 👣 ➡️ 🏝️` (🏝️ Ilha da palmeira, entre 🌋 🏔️)
- Médio: escolha: O mapa tem uma fila de casas. Partes da palmeira e andas 2 casas para a direita. Onde chegas? `🌴 🪨 🛖 🦀` (🛖 Cabana, entre 🪨 🦀); cadeado: As colunas do mapa contam-se da esquerda para a direita. Em que coluna está o ❌? `⬜ ⬜ ❌ ⬜` (3); escolha: O mapa diz: «O tesouro está a norte da caveira.» Para que lado da caveira tens de ir? `☠️` (⬆️ Para cima, entre ⬇️ ⬅️ ➡️)
- Difícil: cadeado: Partes da palmeira, andas 5 casas para este e depois 2 casas para oeste. A quantas casas da palmeira ficas? `🌴 ⬜ ⬜ ⬜ ⬜ ⬜ ⬜` (3); escolha: Partindo da palmeira, andas 2 casas para este e 1 casa para sul. Que setas mostram esse caminho? `🌴 🧭` (➡️➡️⬇️ Direita, direita, baixo, entre ⬅️⬅️⬇️ ➡️⬇️⬇️ ⬆️➡️➡️); cadeado: O tesouro está 3 casas a norte e 2 casas a este da palmeira. Quantas casas andas ao todo? `🌴 ⬆️⬆️⬆️ ➡️➡️ 💰` (5)

**Luneta** (`luneta`)
- Fácil: escolha: Olha pela luneta! Que animal se vê no mar? `🔭 🌊` (🐳 Baleia, entre 🐄 🦒 🐘); cadeado: Quantos barcos se veem pela luneta? Escreve o número. `⛵ ⛵ ⛵ ⛵` (4); escolha: A nossa bandeira é esta. Qual barco tem uma bandeira igual à nossa? `🏴‍☠️` (🏴‍☠️ Bandeira de pirata, entre 🏳️ 🏁 🚩)
- Médio: escolha: Pela luneta vês três barcos iguais. Qual deles está mais longe? `🔭` (⛵ O que parece mais pequeno, entre ⛵ ⛵); cadeado: Quantos barcos têm bandeira vermelha? Não contes os outros. `⛵🚩 ⛵🏳️ ⛵🚩 ⛵🏴 ⛵🚩 ⛵🏳️` (3); escolha: O que está à esquerda da ilha? `🐬 🏝️ ⛵` (🐬 Golfinho, entre ⛵ 🐙)
- Difícil: escolha: Bandeira vermelha quer dizer «perigo». Que barco está a pedir ajuda? O que tem bandeira vermelha e não tem velas. `🚩 = ⚠️` (🛶🚩 Canoa com bandeira vermelha, entre ⛵🚩 🛶🏳️ ⛵🏴‍☠️); cadeado: Cada bandeira é um barco. Quantos barcos não têm bandeira de pirata? `🏴‍☠️ 🏳️ 🚩 🏴‍☠️ 🏳️ 🚩 🏳️ 🚩` (6); escolha: Estamos virados para norte e há um barco a oeste. De que lado o vemos? `🧭 ⛵` (⬅️ À esquerda, entre ➡️ ⬆️ ⬇️)

**Vigia** (`vigia`)
- Fácil: cadeado: Quantos peixes passam pela vigia? Escreve o número. `🐟 🐠 🐟 🐠 🐟 🐠` (6); escolha: Pela vigia vês uma gaivota e uma nuvem. A gaivota está de que lado da nuvem? `🐦 ☁️` (⬅️ À esquerda, entre ➡️); pares: Pela vigia passam peixes e conchas. Encontra os pares iguais! (🐟 🐠 🐚 🐡)
- Médio: escolha: Qual destes desenhos mostra a ilha à direita do navio? (⛵🏝️ Desenho C, entre 🏝️⛵ ⛵🐳); cadeado: Passavam 7 peixes na vigia e 3 nadaram para a esquerda. Quantos ficaram à direita? `🐟 🐟 🐟 🐟 🐟 🐟 🐟` (4); pares: O mar está cheio de bichos! Encontra os cinco pares iguais. (🐟 🐠 🐚 🦀 🐬)
- Difícil: escolha: A ilha está do lado esquerdo do navio. O navio dá meia volta. De que lado fica agora a ilha? `🏝️ ⛵ 🔄` (➡️ À direita, entre ⬅️); escolha: O farol está atrás do navio e o navio anda sempre para a frente. Pela vigia, o farol parece cada vez... `⛵ ➡️` (⬇️ Mais pequeno, entre ⬆️ ⏸️); cadeado: Pela vigia passaram 2 grupos de 3 peixes e depois mais 1 peixe. Quantos peixes passaram? `🐟🐟🐟 🐠🐠🐠 🐡` (7)

**Papagaio na gaiola** (`papagaio`)
- Fácil: escolha: O papagaio só come fruta. O que lhe dás? `🦜` (🍌 Banana, entre 🧦 🔑 🪨); pares: O papagaio espalhou as coisas dele. Encontra os pares iguais! (🦜 🪶 🍌 🥜); cadeado: Quantas penas tem a cauda do papagaio? Escreve o número. `🪶 🪶 🪶 🪶 🪶` (5)
- Médio: escolha: O papagaio diz sempre o contrário. Ouviu «em cima». O que diz ele? `🦜 ⬆️` (⬇️ Em baixo, entre ⬆️ ➡️); cadeado: O papagaio tem 6 sementes e reparte com o amigo, para cada um ficar com o mesmo. Com quantas fica cada um? `🦜 🌰🌰🌰🌰🌰🌰 🦜` (3); escolha: O papagaio diz sempre o contrário. Ouviu «esquerda». O que diz ele? `🦜 ⬅️` (➡️ Direita, entre ⬆️ ⬅️)
- Difícil: ordem: O papagaio baralhou uma palavra do navio: «ro · nhei · ma · ri». Põe as sílabas por ordem para formar «marinheiro». (ma → ri → nhei → ro); escolha: O papagaio diz sempre o contrário. Disse: «O tesouro está a norte!» Onde está o tesouro? `🦜 🧭` (⬇️ Sul, entre ⬆️ ➡️ ⬅️); cadeado: Há 9 bolachas para 3 papagaios, e todos ficam com o mesmo. Quantas bolachas recebe cada papagaio? `🍪🍪🍪🍪🍪🍪🍪🍪🍪 🦜🦜🦜` (3)

**Bússola e globo** (`bussola`)
- Fácil: escolha: O capitão precisa da bússola para não se perder. Qual é a bússola? (🧭 Bússola, entre ⏰ 🍪 🎈); pares: As coisas do capitão estão misturadas. Encontra os pares iguais! (🧭 🌍 ⚓ 🦜); cadeado: A rosa dos ventos aponta para o norte, o sul, o este e o oeste. Quantas pontas tem? `🧭` (4)
- Médio: escolha: A agulha aponta para o norte, que fica em cima. O que fica em baixo? `🧭 ⬆️` (⬇️ Sul, entre ⬅️ ➡️); pares: No globo, cada animal tem a sua casa. Junta cada animal ao sítio onde vive! (🐧↔🧊 🐪↔🏜️ 🐒↔🌴 🐟↔🌊); cadeado: A rosa dos ventos tem 4 pontas grandes e 4 pontas pequenas. Quantas pontas tem ao todo? `🧭` (8)
- Difícil: escolha: A agulha da bússola aponta para o norte. Que ponto fica à direita? `🧭 ⬆️` (➡️ Este, entre ⬅️ ⬇️); pares: Gira o globo! Junta cada animal ao sítio onde vive. (🐧↔🧊 🐪↔🏜️ 🐒↔🌴 🐟↔🌊 🐻‍❄️↔❄️); escolha: Estás virado para sul. Que ponto fica nas tuas costas? `🧭 ⬇️` (⬆️ Norte, entre ⬅️ ➡️ ⬇️)

**Barril** (`barril`)
- Fácil: cadeado: Quantas maçãs há no barril? Escreve o número. `🍎 🍎 🍎 🍎 🍎 🍎 🍎` (7); escolha: No barril dos piratas há uma coisa que não se come. Qual é? (🧦 Meia, entre 🍎 🍞 🧀); cadeado: Cada pirata quer 1 maçã do barril. Quantas maçãs são precisas para estes piratas? `🧔 🧔 🧔` (3)
- Médio: cadeado: Há 8 maçãs para 2 piratas, e os dois ficam com o mesmo. Quantas maçãs recebe cada um? `🍎🍎🍎🍎🍎🍎🍎🍎 🧔 🧔` (4); cadeado: Há 6 bolachas para pôr em 3 pratos, com o mesmo em cada prato. Quantas bolachas vão para cada prato? `🍪🍪🍪🍪🍪🍪 🍽️ 🍽️ 🍽️` (2); escolha: Dois piratas repartiram as maçãs. Em que desenho ficaram os dois com o mesmo? (🍎🍎 | 🍎🍎 Desenho C, entre 🍎🍎🍎 | 🍎 🍎 | 🍎🍎🍎)
- Difícil: cadeado: Há 12 maçãs para 4 piratas, e todos ficam com o mesmo. Quantas maçãs recebe cada um? `🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 🧔🧔🧔🧔` (3); cadeado: No barril havia 9 bolachas. Cada um dos 3 piratas comeu 2. Quantas bolachas sobram? `🍪🍪🍪🍪🍪🍪🍪🍪🍪 🧔🧔🧔` (3); cadeado: Há 10 maçãs para 3 piratas, e todos ficam com o mesmo. Quantas maçãs sobram no barril? `🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 🧔🧔🧔` (1)

**Âncora** (`ancora`; `requer: 'corda'`)
- Fácil: escolha: Qual destas coisas vai ao fundo da água? `🌊` (⚓ Âncora, entre 🦆 🎈 🪵); pares: No fundo do mar há conchas e âncoras. Encontra os pares iguais! (🐚 ⚓ 🦀 🪸); cadeado: Quantas conchas estão presas na âncora? Escreve o número. `⚓ 🐚 🐚 🐚 🐚` (4)
- Médio: escolha: Qual destas coisas flutua na água? `🌊` (🪵 Tronco, entre 🪨 🔑 ⚓); cadeado: A corrente da âncora tem 10 elos e 4 já estão dentro da água. Quantos estão fora da água? `⛓️ ⛓️ ⛓️ ⛓️ ⛓️ ⛓️ 🌊 ⛓️ ⛓️ ⛓️ ⛓️` (6); ordem: Põe a viagem da âncora por ordem: no barco, a cair, a entrar na água, a afundar e, no fim, no fundo do mar. (🚢 → ⬇️ → 💦 → 🫧 → 🪨)
- Difícil: escolha: Adivinha: tenho penas, sou leve e não vou ao fundo da água. Quem sou? (🦆 Pato, entre ⚓ 🎈 🪨); cadeado: Atiraram ao mar 3 rolhas, 4 pedras e 2 chaves. Quantas coisas ficaram a flutuar? `🍾🍾🍾 🪨🪨🪨🪨 🔑🔑` (3); ordem: Põe as coisas por ordem, do céu até ao fundo do mar. (🐦 → ⛵ → 🐟 → 🐙 → ⚓)

**Baú do tesouro** (`bau`; `requer: 'chave'`)
- Fácil: cadeado: Quantas moedas há no baú? Escreve o número. `🪙 🪙 🪙 🪙 🪙 🪙` (6); escolha: No baú há uma coisa que não é tesouro. Qual é? (🧦 Meia, entre 💎 👑 🪙); pares: O tesouro está todo misturado. Encontra os pares iguais! (🪙 💎 🗝️ 🏴‍☠️)
- Médio: cadeado: No baú há 1 moeda de 2 e 1 moeda de 1. Quanto dinheiro há ao todo? `🪙2 ➕ 🪙1` (3); cadeado: O baú tinha 7 moedas e o pirata gastou 2. Quantas moedas ficaram? `🪙 🪙 🪙 🪙 🪙 🪙 🪙` (5); escolha: O pirata quer o saco com mais moedas. Qual é? (🪙🪙🪙🪙🪙 Segundo saco, entre 🪙🪙🪙 🪙🪙)
- Difícil: cadeado: No baú há 2 moedas de 2 e 1 moeda de 1. Quanto dinheiro há ao todo? `🪙2 🪙2 🪙1` (5); escolha: O que vale mais: 3 moedas de 1 ou 1 moeda de 5? (🪙 Uma moeda de 5, entre 🪙🪙🪙); cadeado: Há 8 moedas em 2 baús. Um baú tem mais 2 moedas do que o outro. Quantas moedas tem o baú maior? `💰 💰` (5)

**Extras:**

**Garrafa com mensagem** (`garrafa`) dá **Chave do baú** (`chave`)
- Fácil: escolha: A mensagem tem o desenho de uma chave. Qual destas é igual ao desenho? `🗝️` (🗝️ Chave antiga, entre 🔑 🔒 🔐); pares: Chegaram muitas garrafas à praia. Encontra os pares iguais! (🍾 🧴 🍶 🫙); escolha: A mensagem é um desenho: uma chave e uma ilha. O que manda procurar? `📜 🗝️ 🏝️` (🗝️ Uma chave, entre 🐟 🍌)
- Médio: escolha: A mensagem diz: «A chave está à esquerda da âncora.» Qual desenho mostra isso? (🗝️⚓ Desenho B, entre ⚓🗝️ ⚓🐚); ordem: Põe a viagem da garrafa por ordem: o pirata escreve, põe a mensagem na garrafa, atira-a ao mar, a garrafa boia nas ondas e chega à praia. (✍️ → 🍾 → 💦 → 🌊 → 🏖️); pares: Chegaram muitas coisas à praia. Encontra os cinco pares iguais! (🍾 📜 🐚 🦀 ⭐)
- Difícil: escolha: A mensagem está escrita de trás para a frente: «EVAHC». Que palavra é? `📜 EVAHC` (🗝️ Chave, entre 🐄 ⚓ 🦜); escolha: A mensagem diz: «A chave não está no barril nem no canhão. Está a sul do leme.» Onde está? `📜 🧭` (⬇️ Por baixo do leme, entre 🛢️ ☸️ 💣); cadeado: A garrafa andou 2 ilhas para norte e depois 3 ilhas para sul. A quantas ilhas do ponto de partida ficou? `🍾 ⬆️⬆️ ⬇️⬇️⬇️` (1)

**Canhão com corda** (`canhao`) dá **Corda** (`corda`)
- Fácil: cadeado: A corda está presa debaixo das bolas de canhão. Quantas bolas há? `⚫ ⚫ ⚫ ⚫ ⚫` (5); escolha: Para que lado aponta o canhão? `💣 ➡️` (➡️ Para a direita, entre ⬅️ ⬆️); pares: As coisas do convés estão espalhadas. Encontra os pares iguais! (💣 🪢 🏴‍☠️ ⛵)
- Médio: cadeado: Há 9 bolas de canhão para pôr em 3 montes iguais. Quantas bolas ficam em cada monte? `⚫⚫⚫⚫⚫⚫⚫⚫⚫` (3); escolha: O canhão aponta para a direita. Que barco está desse lado? `🛶 💣➡️ ⛵` (⛵ Veleiro, entre 🛶 🚢); pares: As coisas do convés estão espalhadas. Encontra os cinco pares iguais! (💣 🪢 🏴‍☠️ ⛵ 🔭)
- Difícil: escolha: O canhão aponta para norte e roda um quarto de volta para a direita. Para onde aponta agora? `💣 ⬆️ ↪️` (➡️ Este, entre ⬅️ ⬇️ ⬆️); cadeado: Há 10 bolas para 2 canhões, com o mesmo em cada um. Cada canhão disparou 1 bola. Quantas bolas tem cada canhão agora? `⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫ 💣 💣` (4); escolha: Caíram duas coisas ao mar: uma bola de canhão e um barril vazio. Qual delas flutua? `🌊` (🛢️ O barril vazio, entre ⚫)


**Palavras:** camarote, vigia (janela redonda do navio), luneta; papagaio aqui é a ave (pt-PT também usa "papagaio" para o brinquedo, que no Brasil é "pipa"); este (pt-PT) / leste (pt-BR); bolachas (pt-PT) / biscoitos (pt-BR); partido / quebrado; em baixo / embaixo; mais pequeno / menor; gerúndio (`a cair` / `caindo`).

### 2. A Nave Espacial (`nave`)

**História:** a criança visitou a nave da Capitã Estrela. Um meteorito passou perto e a escotilha fechou-se / se fechou sozinha.
**Saída:** escotilha (centro, x 50, y 45).
**Foco:** sequências numéricas (de 2 em 2, contagem para trás), regras de padrões, lógica de pistas.

**Janela dos planetas** (`janela`)
- Fácil: cadeado: Quantos planetas se veem pela janela? Escreve o número. `🪐 🌍 🌕 🪐 🌍` (5); escolha: Pela janela vês um planeta com anéis à volta. Qual é? (🪐 Saturno, entre 🌍 🌕 ☀️); pares: Os planetas fugiram pela janela! Encontra os pares iguais. (🪐 🌍 🌕 ☀️)
- Médio: cadeado: A nave conta para trás antes de partir: 5, 4, ?, 2, 1. Que número falta? Escreve o número. `5️⃣ 4️⃣ ❔ 2️⃣ 1️⃣` (3); escolha: Os planetas da janela seguem uma regra. Qual vem a seguir? `🌍 🪐 🌍 🪐 ❔` (🌍 Terra, entre 🪐 🌕); ordem: A nave vai partir! Põe os números pela ordem da contagem para trás, do 5 até ao 1. (5 → 4 → 3 → 2 → 1)
- Difícil: cadeado: A nave conta para trás: 9, 8, 7, ?, 5. Que número falta? Escreve o número. `9️⃣ 8️⃣ 7️⃣ ❔ 5️⃣` (6); cadeado: Agora a contagem salta de 2 em 2 para trás: 10, 8, 6... Que número vem a seguir? `🔟 8️⃣ 6️⃣ ❔` (4); escolha: Os planetas da janela seguem uma regra. Qual vem a seguir? `🌍 🪐 🌕 🌍 🪐 ❔` (🌕 Lua, entre 🌍 🪐 ☀️)

**Painel de botões** (`painel`)
- Fácil: escolha: Qual botão é igual ao modelo, na cor e no desenho? `🔵🌙` (🔵🌙 Azul com lua, entre 🔴🌙 🔵⭐ 🔴⭐); ordem: Carrega nos botões por ordem: 1, 2, 3, 4. (1 → 2 → 3 → 4); cadeado: Quantos botões vermelhos há no painel? Escreve o número. `🔴 🟢 🔴 🔵 🔴 🟡` (3)
- Médio: escolha: Os botões seguem uma regra. Que botão completa a fila? `🔴 🟢 🔴 🟢 ❔` (🔴 Botão vermelho, entre 🟢 🔵); cadeado: As luzes do painel acendem-se: 2, depois 3, depois 4. Quantas se acendem a seguir? `💡💡  💡💡💡  💡💡💡💡  ❔` (5); ordem: Carrega nos botões do 5 até ao 1, a contar para trás. (5 → 4 → 3 → 2 → 1)
- Difícil: ordem: Carrega nos botões de 2 em 2, do número mais pequeno ao maior. (2 → 4 → 6 → 8 → 10); escolha: Os botões seguem uma regra. Que botão completa a fila? `🔴 🟢 🟢 🔴 🟢 🟢 🔴 ❔` (🟢 Botão verde, entre 🔴 🔵); cadeado: O botão certo tem mais 2 do que o 5 e menos 1 do que o 8. Que número é? Escreve o número. `🔘` (7)

**Radar** (`radar`)
- Fácil: cadeado: Quantos pontos verdes há no radar? Escreve o número. `🟢 🟢 🟢 🟢` (4); escolha: Há três naves no radar. Qual está no meio? `🛰️ 🚀 🛸` (🚀 Foguetão, entre 🛰️ 🛸); pares: O radar encontrou naves! Encontra os pares de naves iguais. (🚀 🛸 🛰️ ✈️)
- Médio: escolha: O alvo é o centro do radar. Qual nave está mais perto do centro? `🛸 ⚫ ⚫ ⚫ 🎯 ⚫ 🚀 ⚫ ⚫ 🛰️` (🚀 Foguetão, entre 🛸 🛰️); cadeado: Os pontos aparecem no radar: 2, depois 3, depois 4. Quantos aparecem a seguir? `🟢🟢  🟢🟢🟢  🟢🟢🟢🟢  ❔` (5); escolha: A luz do radar pisca com uma regra. O que vem a seguir? `💡 ⚫ 💡 ⚫ ❔` (💡 Luz acesa, entre ⚫)
- Difícil: cadeado: Os pontos aparecem no radar: 1, 3, 5, 7... Quantos aparecem a seguir? `1️⃣ 3️⃣ 5️⃣ 7️⃣ ❔` (9); escolha: A nave amiga não está no centro, não é a maior e tem luz verde. Qual é? (🛰️🟢 Nave pequena de luz verde, na ponta, entre 🛸🟢 🚀🟢 🚀🔴); cadeado: Há 9 pontos no radar e em cada volta desaparecem 2. Quantos ficam ao fim de 3 voltas? `🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢` (3)

**Robô ajudante** (`robo`; `requer: 'cartao'`)
- Fácil: escolha: O robô tem cabeça, corpo e pernas, mas falta-lhe uma peça para apanhar as coisas. Qual é? `🤖` (🦾 Braço, entre 🛞 📡 💡); cadeado: Quantas luzes tem o robô? Escreve o número. `🤖 💡💡💡💡💡💡` (6); ordem: Ajuda a montar o robô, de baixo para cima: as pernas, o corpo com a bateria, a cabeça e a antena. (🦿 → 🔋 → 🤖 → 📡)
- Médio: escolha: As peças do robô seguem uma regra. Qual vem a seguir? `⚙️ 🔩 ⚙️ 🔩 ❔` (⚙️ Roda dentada, entre 🔩 🔧); cadeado: A bateria do robô tem 8 riscas e gastou 3. Quantas riscas ficaram? `🔋 ▮▮▮▮▮▮▮▮` (5); ordem: Cada robô mostra as suas antenas. Põe os robôs por ordem, de 1 antena até 5 antenas. (📡 → 📡📡 → 📡📡📡 → 📡📡📡📡 → 📡📡📡📡📡)
- Difícil: escolha: Adivinha qual é o robô: não sou o robô azul, tenho duas antenas e não tenho rodas. (🤖🦿 Robô verde de duas antenas, com pernas, entre 🤖🔵 🤖🛞 🤖📡); cadeado: A bateria do robô tem 10 riscas e gasta 2 riscas por hora. Quantas ficam ao fim de 3 horas? `🔋 ▮▮▮▮▮▮▮▮▮▮` (4); ordem: Os robôs estão numerados de 3 em 3. Põe-nos por ordem, do número mais pequeno ao maior. (3 → 6 → 9 → 12 → 15)

**Capacete e comida espacial** (`capacete`)
- Fácil: ordem: Ajuda o astronauta a vestir-se! Põe por ordem: as meias, o fato, as luvas e o capacete. (🧦 → 🥼 → 🧤 → 🪖); cadeado: Quantos pacotes de comida há na prateleira? Escreve o número. `🟧 🟨 🟩 🟦 🟪 🟥` (6); escolha: Na prateleira da comida há uma coisa fora do lugar. Qual destas coisas não se come? (👟 Sapatilha, entre 🍎 🥕 🍞)
- Médio: escolha: Os pacotes de comida seguem uma regra. Qual vem a seguir? `🍎 🥕 🍎 🥕 ❔` (🍎 Maçã, entre 🥕 🍞); cadeado: O astronauta tinha 7 pacotes de comida e comeu 2. Quantos pacotes ficaram? `📦 📦 📦 📦 📦 📦 📦` (5); escolha: Os pacotes têm 1 maçã, 2 maçãs, 3 maçãs... Qual é o pacote seguinte? `🍎   🍎🍎   🍎🍎🍎   ❔` (🍎🍎🍎🍎 Quatro maçãs, entre 🍎🍎 🍎🍎🍎🍎🍎)
- Difícil: cadeado: No primeiro dia o astronauta bebeu 1 copo de água, no segundo dia 3 copos e no terceiro dia 5 copos. Quantos copos bebe no quarto dia? `🥤   🥤🥤🥤   🥤🥤🥤🥤🥤   ❔` (7); escolha: Adivinha o pacote preferido do astronauta: não é doce, não é verde e é redondo. (🍅 Tomate, entre 🍪 🥒 🥖); ordem: Veste o astronauta. Primeiro as meias. O fato vem antes das botas. As luvas vêm depois das botas. O capacete fica para o fim. (🧦 → 🥼 → 🥾 → 🧤 → 🪖)

**Estufa** (`estufa`)
- Fácil: cadeado: Quantas folhas tem a planta da estufa? Escreve o número. `🍃 🍃 🍃 🍃 🍃` (5); escolha: Do que precisa a planta para crescer? `🌱` (💧 Água, entre 🧦 🔑 🎈); pares: Os vasos da estufa estão misturados. Encontra os pares iguais! (🌷 🌵 🌻 🌱)
- Médio: cadeado: No primeiro dia a planta tem 2 folhas e no segundo dia tem 3. Quantas folhas tem no terceiro dia? `🍃🍃   🍃🍃🍃   ❔` (4); escolha: Os vasos da estufa seguem uma regra. Qual vem a seguir? `🌷 🌵 🌷 🌵 ❔` (🌷 Tulipa, entre 🌵 🌻); ordem: Põe os vasos por ordem, do que tem 1 flor ao que tem 5 flores. (🌷 → 🌷🌷 → 🌷🌷🌷 → 🌷🌷🌷🌷 → 🌷🌷🌷🌷🌷)
- Difícil: cadeado: A planta tinha 1 centímetro e cresce 2 centímetros por dia. Quanto mede ao fim de 3 dias? `🌱 📏` (7); escolha: Adivinha qual é a planta da Capitã: não tem flores, não é um cato e tem folhas grandes. (🪴 Planta de vaso, entre 🌻 🌵 🌱); cadeado: Cada dia nasce o dobro das flores do dia anterior: 1, 2, 4... Quantas flores nascem a seguir? `🌸   🌸🌸   🌸🌸🌸🌸   ❔` (8)

**Telescópio** (`telescopio`)
- Fácil: cadeado: Quantas estrelas se veem pelo telescópio? Escreve o número. `⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐` (7); escolha: O que se vê no céu de noite? `🔭` (⭐ Estrela, entre 🌈 🐄 🚗); pares: O céu está cheio de estrelas. Encontra os pares de estrelas iguais! (⭐ 🌟 💫 ✨)
- Médio: cadeado: Na primeira noite caiu 1 estrela cadente, na segunda noite caíram 2 e na terceira caíram 3. Quantas caem na quarta noite? `☄️   ☄️☄️   ☄️☄️☄️   ❔` (4); escolha: Esta constelação tem estes pontos de luz. Qual desenho tem o mesmo número de estrelas? `✨ ✨ ✨ ✨ ✨` (⭐⭐⭐⭐⭐ Cinco estrelas, entre ⭐⭐⭐ ⭐⭐⭐⭐ ⭐⭐⭐⭐⭐⭐); escolha: No céu passam estrelas e cometas com uma regra. O que vem a seguir? `⭐ ☄️ ⭐ ☄️ ❔` (⭐ Estrela, entre ☄️ 🌙)
- Difícil: cadeado: Na primeira noite caíram 2 estrelas cadentes, na segunda 4 e na terceira 6. Quantas caem na quarta noite? `☄️☄️   ☄️☄️☄️☄️   ☄️☄️☄️☄️☄️☄️   ❔` (8); cadeado: O telescópio aproxima a estrela e conta para trás de 3 em 3: 15, 12, 9... Que número vem a seguir? `🔭 15 · 12 · 9 · ❔` (6); cadeado: Um cometa passa de 3 em 3 noites. Passou na noite 1. Em que noite passa pela terceira vez? `☄️` (7)

**Mapa das estrelas** (`mapa`)
- Fácil: pares: O mapa mostra o céu. Encontra os pares iguais! (⭐ 🌙 ☀️ 🪐); cadeado: Quantas estrelas tem o mapa? Escreve o número. `⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐` (8); escolha: O que está no céu de dia? (☀️ Sol, entre 🌙 ⭐ 🦉)
- Médio: pares: Junta as coisas que andam juntas, como o foguetão e o fogo! (🚀↔🔥 👩‍🚀↔🪖 🌍↔💧 ⭐↔✨); escolha: Qual destes tem luz própria, como uma lâmpada acesa? (☀️ Sol, entre 🌙); escolha: O mapa mostra uma regra. O que vem a seguir? `☀️ ☀️ 🌙 ☀️ ☀️ ❔` (🌙 Lua, entre ☀️ ⭐)
- Difícil: pares: Vira as cartas e junta as coisas que andam juntas, como o foguetão e o fogo. São cinco pares! (🚀↔🔥 👩‍🚀↔🪖 🌍↔💧 ⭐↔✨ ☀️↔🌙); escolha: A estrela da Capitã é amarela, não é a maior e tem 5 pontas. Qual é? (⭐ Estrela amarela pequena, entre 🌟 ✴️); cadeado: As estrelas do mapa estão numeradas: 3, 6, 9... Que número tem a estrela seguinte? `⭐3 · ⭐6 · ⭐9 · ❔` (12)

**Caixas de carga** (`caixas`; `requer: 'estrela'`)
- Fácil: cadeado: Quantas caixas de carga há? Escreve o número. `📦 📦 📦 📦 📦 📦` (6); escolha: A Capitã quer a caixa que tem uma estrela. Qual é? (📦⭐ Caixa com estrela, entre 📦🌙 📦🪐 📦☀️); pares: As caixas estão misturadas. Encontra os pares de caixas iguais! (🟥 🟨 🟦 🟩)
- Médio: escolha: A caixa certa não é azul e tem uma estrela. Qual é? (🟥⭐ Caixa vermelha com estrela, entre 🟦⭐ 🟨🌙 🟦🌙); cadeado: As caixas têm os números 1, 2, 3... Que número tem a caixa seguinte? `📦1 · 📦2 · 📦3 · ❔` (4); ordem: Empilha as caixas de baixo para cima, a contar para trás do 5 até ao 1. (5 → 4 → 3 → 2 → 1)
- Difícil: escolha: O desenho mostra uma pilha de caixas, de cima para baixo. Qual é a caixa certa? Está por cima da verde, não tem estrela e não é a do topo. `🟨 🟥 🟦⭐ 🟩` (🟥 Caixa vermelha, entre 🟨 🟦⭐ 🟩); escolha: Há três caixas empilhadas. A vermelha está em cima da amarela e a azul está debaixo da amarela. Qual está no fundo da pilha? (🟦 Caixa azul, entre 🟥 🟨); cadeado: As caixas estão numeradas de 5 em 5: 5, 10, 15... Que número tem a caixa seguinte? `📦5 · 📦10 · 📦15 · ❔` (20)

**Extras:**

**Armário** (`armario`) dá **Cartão de acesso** (`cartao`)
- Fácil: escolha: O armário só abre com o cartão igual ao modelo. Qual é? `🟦⭐` (🟦⭐ Azul com estrela, entre 🟥⭐ 🟦🌙 🟨⭐); pares: Os cartões do armário estão misturados. Encontra os pares iguais! (💳 🪪 🎫 🏷️); cadeado: O armário tem um cadeado. Quantos cartões há no armário? `💳 💳 💳 💳 💳` (5)
- Médio: escolha: O cartão do robô é azul e tem uma estrela. Qual é? (🟦⭐ Azul com estrela, entre 🟨⭐ 🟦🌙 🟨🌙); escolha: Os cartões estão arrumados com uma regra. Qual vem a seguir? `🟦 🟨 🟦 🟨 ❔` (🟦 Cartão azul, entre 🟨 🟥); pares: Os cartões do armário estão misturados. Encontra os cinco pares iguais! (💳 🪪 🎫 🏷️ 📇)
- Difícil: escolha: Adivinha qual é o cartão do robô: não é azul, tem uma estrela e não tem riscas. (🟥⭐ Vermelho com estrela, entre 🟦⭐ 🟨⭐〰️ 🟨🌙); ordem: Os cartões estão numerados de 4 em 4. Põe-nos por ordem, do número mais pequeno ao maior. (4 → 8 → 12 → 16 → 20); cadeado: O código do armário é o número que vem depois de 9, 7, 5. Qual é? Escreve o número. `9️⃣ 7️⃣ 5️⃣ ❔` (3)

**Bichinho extraterrestre** (`bichinho`) dá **Chave-estrela** (`estrela`)
- Fácil: escolha: O bichinho só come coisas verdes. O que lhe dás? (🥦 Brócolos, entre 🍓 🍌 🍊); cadeado: Quantos olhos tem o bichinho? Escreve o número. `👁️ 👁️ 👁️ 👁️ 👁️` (5); pares: Os amigos do bichinho vieram brincar. Encontra os pares iguais! (👽 👾 🐛 🦠)
- Médio: escolha: O bichinho só come coisas verdes e redondas. O que lhe dás? (🍏 Maçã verde, entre 🥒 🍊 🍌); cadeado: O bichinho tem 3 olhos e nasce-lhe um olho novo por dia. Quantos olhos vai ter amanhã? `👁️ 👁️ 👁️` (4); escolha: As manchas do bichinho seguem uma regra. Qual vem a seguir? `🟣 🟡 🟣 🟡 ❔` (🟣 Mancha roxa, entre 🟡 🟢)
- Difícil: escolha: O bichinho não come nada vermelho nem comprido, e gosta de coisas redondas. O que lhe dás? (🫐 Mirtilos, entre 🍓 🥕 🍌); cadeado: O bichinho pensou em quantas bolinhas quer comer: é mais do que 3, menos do que 6 e não é 5. Quantas quer? Escreve o número. `👽 🟢❔` (4); escolha: As manchas do bichinho seguem uma regra. Qual vem a seguir? `🟣 🟡 🟡 🟣 🟡 🟡 ❔` (🟣 Mancha roxa, entre 🟡 🟢)


**Palavras:** ecrã (pt-PT) / tela (pt-BR); carregar no botão (pt-PT) / apertar o botão (pt-BR); fato (pt-PT) / traje (pt-BR); cato (pt-PT) / cacto (pt-BR); riscas / listras; extraterrestre nas duas.

### 3. O Laboratório do Inventor (`laboratorio`)

**História:** o Professor Parafuso saiu para almoçar e a porta de engrenagens trancou-se / se trancou. Ele deixou números escondidos nas experiências.
**Saída:** porta de engrenagens (centro, x 50, y 45).
**Foco:** misturas de cores, causa e efeito, formas e metades, rodas e alavancas, comparar pesos na balança.

**Armário de frascos** (`frascos`)
- Fácil: escolha: O professor precisa do frasco com o líquido da cor do tomate. Qual é? `🍅` (🔴 Líquido vermelho, entre 🔵 🟢 🟡); cadeado: Na prateleira há frascos cheios 🧪 e frascos vazios 🫙. Quantos frascos estão cheios? `🧪 🫙 🧪 🧪 🫙 🧪` (4); pares: Os frascos saíram do armário! Encontra os pares iguais. (🧪 ⚗️ 🫙 🍯)
- Médio: escolha: O professor pôs água e sabão num frasco, tapou-o e abanou-o com força. O que aparece? `🫙 💧 🧼` (🫧 Espuma, entre 🧊 🔥 🪨); ordem: O professor pôs gotas nos frascos. Põe os frascos por ordem, do que tem menos gotas ao que tem mais. (💧 → 💧💧 → 💧💧💧 → 💧💧💧💧 → 💧💧💧💧💧); cadeado: No armário há 8 frascos e metade estão cheios. Quantos frascos estão cheios? `🧪 🧪 🧪 🧪 🧪 🧪 🧪 🧪` (4)
- Difícil: ordem: Faz a experiência do sal pela ordem certa: o frasco vazio, pôr água, deitar o sal, mexer com a colher e o sal desaparece. (🫙 → 💧 → 🧂 → 🥄 → ✨); escolha: Tenho dois frascos iguais, cada um a meio. Se juntar a água dos dois num só frasco, o que fico a ter? (🧪 Um frasco cheio, entre 🫙 💧 🧪🧪); cadeado: No armário há 3 frascos cheios e 2 frascos a meio. Se juntar a água dos frascos a meio, quantos frascos cheios fico a ter? `🧪 🧪 🧪 ➕ ½ ½` (4)

**Quadro de giz / Lousa** (`quadro`)
- Fácil: escolha: O professor desenhou formas no quadro de giz. Qual é o círculo? (⚪ Círculo, entre 🔺 🟦 ⭐); cadeado: Quantos triângulos estão desenhados no quadro de giz? Escreve o número. `🔺 🔺 🔺 🔺 🔺` (5); pares: As formas do quadro de giz misturaram-se. Encontra os pares iguais! (⚪ 🔺 🟦 ⭐)
- Médio: escolha: Qual destas formas tem 3 lados? (🔺 Triângulo, entre 🟦 ⚪ ⭐); cadeado: Quantos lados tem o quadrado? Escreve o número. `🟦` (4); escolha: Qual destas coisas tem a forma de um círculo? (🪙 Moeda, entre 📦 🚪 📐)
- Difícil: cadeado: Quantos lados têm, juntos, um triângulo e um quadrado? Escreve o número. `🔺 ➕ 🟦` (7); escolha: O professor cortou um quadrado ao meio, de um canto ao canto do outro lado. Que forma tem cada metade? `🟦 ✂️` (🔺 Triângulo, entre ⚪ 🟦 ⭐); escolha: Qual destas formas não tem lados direitos nem cantos? (⚪ Círculo, entre 🔺 🟦 ⭐)

**Tubos de ensaio** (`tubos`; `requer: 'oculos'`)
- Fácil: pares: Os tubos de ensaio estão misturados. Encontra os pares da mesma cor! (🔴 🟡 🔵 🟢); cadeado: Quantos tubos têm líquido azul? Escreve o número. `🔴 🔵 🔵 🟡 🔵` (3); escolha: Há um intruso no suporte dos tubos! Qual destas coisas não é um tubo de ensaio? (🍌 Banana, entre 🧪 🧪 🧪)
- Médio: escolha: O professor misturou tinta vermelha com tinta amarela. Que cor ficou? `🔴 ➕ 🟡` (🟠 Laranja, entre 🟢 🟣 🔵); pares: Junta cada mistura com a cor que dá! (🔴+🟡↔🟠 🔵+🟡↔🟢 🔴+🔵↔🟣 ⚫+⚪↔🔘); cadeado: Quantos tubos têm líquido verde? Não contes os outros. `🟢 🔴 🟢 🟡 🟢 🔵 🟢` (4)
- Difícil: pares: As misturas perderam o seu par! Junta cada mistura com a cor que dá. (🔴+🟡↔🟠 🔵+🟡↔🟢 🔴+🔵↔🟣 ⚫+⚪↔🔘 🔴+⚪↔🌸); escolha: O professor fez tinta roxa. Que duas cores misturou? `🟣` (🔴+🔵 Vermelho e azul, entre 🔴+🟡 🔵+🟡 ⚫+⚪); cadeado: Há 3 tubos vermelhos e 3 amarelos. O professor mistura sempre um vermelho com um amarelo. Quantos tubos cor de laranja consegue fazer? `🔴 🔴 🔴 🟡 🟡 🟡` (3)

**Engrenagens** (`engrenagens`)
- Fácil: escolha: O professor precisa de uma roda dentada. Qual é? (⚙️ Roda dentada, entre 🔨 🪛 🔩); cadeado: Quantas rodas dentadas há? Escreve o número. `⚙️ ⚙️ ⚙️ ⚙️ ⚙️ ⚙️` (6); pares: As ferramentas do professor estão espalhadas. Encontra os pares iguais! (⚙️ 🔧 🪛 🔨)
- Médio: escolha: A roda da manivela tem duas rodas perto: a roda A está encostada a ela e a roda B está longe, sem lhe tocar. Rodando a manivela, que roda se mexe? `⚙️⚙️   ⚙️` (⚙️ A roda A, que está encostada, entre ⚙️ ❌); escolha: A roda grande roda para a direita. Para que lado roda a roda pequena encostada a ela? `⚙️⚙️` (🔄 Para a esquerda, entre 🔃); cadeado: A roda pequena dá 2 voltas por cada volta da roda grande. A grande deu 2 voltas. Quantas voltas deu a pequena? `⚙️ ⚙️` (4)
- Difícil: escolha: Há 3 rodas em fila, todas encostadas. A primeira roda para a direita. Para que lado roda a terceira? `⚙️⚙️⚙️` (🔃 Para a direita, entre 🔄); cadeado: A roda pequena dá 2 voltas por cada volta da roda grande. A grande deu 4 voltas. Quantas voltas deu a pequena? `⚙️ ⚙️` (8); escolha: O professor usa uma tábua e um apoio para levantar uma pedra pesada. Onde deve empurrar a tábua para fazer menos força? `🪨 ➖➖🔺➖➖➖➖` (👋 Na ponta, longe do apoio, entre 🪨 🔺)

**Sistema solar** (`sistema-solar`)
- Fácil: escolha: Qual destas coisas dá luz e calor à Terra? (☀️ Sol, entre 🌍 🌙 🪨); cadeado: Quantos planetas tem a maqueta do professor? Escreve o número. `🪐 🪐 🪐 🪐 🪐 🪐 🪐 🪐` (8); escolha: O Sol está no céu. É dia ou é noite? `☀️` (☀️ Dia, entre 🌙)
- Médio: escolha: A lâmpada faz de Sol e ilumina uma bola, que faz de Terra. Em que lado da bola é dia? `💡 ⚽` (💡 No lado virado para a luz, entre 🌚); cadeado: A Terra tem 1 lua e Marte tem 2 luas. Quantas luas têm os dois juntos? `🌍 🌙 ➕ 🔴 🌙 🌙` (3); escolha: Na maqueta, uma coisa anda à volta da Terra. Qual é? `🌍` (🌙 Lua, entre ☀️ 🪐 ⭐)
- Difícil: escolha: Porque é que de noite fica escuro? `🌍 ☀️` (🌍 A Terra rodou e ficámos de costas para o Sol, entre ☀️ 🌙 ☁️); escolha: Se a Terra deixasse de rodar, o que acontecia? `🌍 ⏸️` (🌍 De um lado era sempre dia e do outro sempre noite, entre 🌧️ 🌙); cadeado: A maqueta tem 8 planetas e 3 têm a luz acesa. Quantos planetas estão apagados? `💡 💡 💡 ⚫ ⚫ ⚫ ⚫ ⚫` (5)

**Íman / Ímã** (`iman`)
- Fácil: escolha: Qual destas coisas o íman consegue apanhar? `🧲` (📎 Clipe, entre 🪵 🧸 🍎); cadeado: Quantos clipes estão presos ao íman? Escreve o número. `🧲 📎 📎 📎 📎 📎` (5); pares: As coisas do íman caíram ao chão. Encontra os pares iguais! (🧲 📎 🔩 🔑)
- Médio: escolha: Qual destas coisas é de metal? (🔑 Chave, entre 🧦 🪵 🍪); cadeado: O íman tinha 6 clipes presos e caíram 2. Quantos clipes ficaram presos? `🧲 📎 📎 📎 📎 📎 📎` (4); pares: As coisas de metal estão misturadas. Encontra os cinco pares iguais! (🧲 📎 🔩 🔑 🥄)
- Difícil: cadeado: Cada íman segura 3 clipes. Quantos clipes seguram 3 ímanes? `🧲 🧲 🧲` (9); escolha: Adivinha: apanho clipes, tenho dois polos e sou vermelho e azul. Quem sou? (🧲 Íman, entre 🔋 🪛 🔑); escolha: Os polos da mesma cor afastam-se e os de cores diferentes juntam-se. Qual destes pares de polos se junta? `🧲 🧲` (🔴🔵 Vermelho com azul, entre 🔴🔴 🔵🔵)

**Aquário** (`aquario`)
- Fácil: escolha: Qual destes animais vive no aquário? (🐟 Peixe, entre 🐄 🐔 🐈); cadeado: Quantos peixes há no aquário? Escreve o número. `🐟 🐠 🐟 🐡 🐟 🐠` (6); escolha: O professor deixou um cubo de gelo ao sol. O que lhe acontece? `🧊 ☀️` (💧 Derrete e fica água, entre 🧊 ⛄)
- Médio: escolha: O professor pôs um cubo de gelo num copo de água morna. O que acontece ao gelo? `🧊 ➡️ 💧` (💧 Derrete, entre 🧊 🪨 ❄️); cadeado: A água do aquário estava na risca 2. Cada pedra que entra faz a água subir 1 risca. Puseste 3 pedras. Em que risca está a água? `🪨 🪨 🪨` (5); ordem: Quatro cubos de gelo estão a derreter, um de cada vez. Põe os desenhos por ordem, do princípio ao fim. (🧊🧊🧊🧊 → 🧊🧊🧊💧 → 🧊🧊💧💧 → 🧊💧💧💧 → 💧💧💧💧)
- Difícil: cadeado: A água está na risca 1. Uma pedra grande faz a água subir 2 riscas e uma pequena faz subir 1. Puseram 2 pedras grandes e 1 pequena. Em que risca está a água? `🪨 🪨 🪨` (6); escolha: Qual destas coisas não derrete ao sol? `☀️` (🪨 Pedra, entre 🧊 🍦 ⛄); ordem: Põe a viagem da água por ordem: o gelo derrete, a água aquece e vira vapor, o vapor faz uma nuvem e a nuvem dá chuva. (🧊 → 💧 → ♨️ → ☁️ → 🌧️)

**Balança** (`balanca`)
- Fácil: escolha: Um prato da balança desceu e o outro subiu. Que lado pesa mais? `⚖️` (⬇️ O prato que está em baixo, entre ⬆️); escolha: O que pesa mais? (🍉 Melancia, entre 🍒); cadeado: Quantas maçãs há no prato da balança? Escreve o número. `⚖️ 🍎 🍎 🍎 🍎 🍎` (5)
- Médio: cadeado: A balança está equilibrada. Num prato há 5 maçãs e no outro há 2 maçãs e mais algumas escondidas. Quantas maçãs estão escondidas? `🍎🍎🍎🍎🍎 ⚖️ 🍎🍎 ❔` (3); escolha: Uma melancia pesa o mesmo que 4 maçãs. O que pesa mais: a melancia ou 3 maçãs? (🍉 A melancia, entre 🍎🍎🍎 ⚖️); escolha: Qual destas balanças fica equilibrada, com os dois pratos à mesma altura? (🍎⚖️🍎 Uma maçã e uma maçã, entre 🍎🍎⚖️🍎 🍉⚖️🍒 🍎🍎🍎⚖️🍎)
- Difícil: cadeado: Uma melancia pesa o mesmo que 4 maçãs. Duas melancias pesam o mesmo que quantas maçãs? `🍉 🍉` (8); cadeado: Um ananás pesa o mesmo que 2 maçãs. Uma melancia pesa o mesmo que 2 ananases. A melancia pesa o mesmo que quantas maçãs? `🍍 = 🍎🍎   🍉 = 🍍🍍` (4); escolha: Num prato da balança está uma bola de ferro e no outro uma bola de algodão, do mesmo tamanho. Para que lado desce a balança? `⚫ ⚖️ ☁️` (⚫ Para o lado do ferro, entre ☁️ ⚖️)

**Robô de latas** (`robo`; `requer: 'pilha'`)
- Fácil: escolha: O que faz o robô andar? `🤖` (🔋 Pilha, entre 🍌 🧦 🪨); cadeado: O professor fez o robô com latas. Quantas latas usou? Escreve o número. `🥫 🥫 🥫 🥫 🥫 🥫 🥫` (7); pares: As peças do robô espalharam-se. Encontra os pares iguais! (🥫 🔩 🔋 💡)
- Médio: escolha: A eletricidade passa pelo metal. Por qual destas coisas passa a eletricidade? `⚡` (🥄 Colher de metal, entre 🧸 🪵 🧦); ordem: Põe por ordem o que acontece: pôr a pilha, ligar o fio, carregar no interruptor, a luz acende e o robô anda. (🔋 → 🔌 → 🔘 → 💡 → 🤖); cadeado: O robô tem 2 pilhas e precisa de 5. Quantas pilhas faltam? `🔋 🔋` (3)
- Difícil: ordem: Liga o circuito do robô pela ordem: a pilha, o fio vermelho, o interruptor, o fio azul e, no fim, a lâmpada. (🔋 → 🔴〰️ → 🔘 → 🔵〰️ → 💡); escolha: O robô tem uma pilha nova e o interruptor está ligado, mas a lâmpada não acende. Porquê? `🔋 〰️ 💡` (✂️ O fio está cortado, entre 🔋 😊 🔘); cadeado: O robô tem 4 pilhas, mas 1 está gasta. Cada pilha boa dá 2 voltas ao robô. Quantas voltas dá o robô? `🔋 🔋 🔋 🪫` (6)

**Extras:**

**Estante do microscópio** (`estante`) dá **Óculos de proteção** (`oculos`)
- Fácil: pares: As coisas da estante estão misturadas. Encontra os pares iguais! (🔬 🔍 🦠 🥽); escolha: Qual destas coisas serve para ver coisas muito pequeninas? (🔍 Lupa, entre 🥄 🧦 🎈); cadeado: A estante tem um cadeado. Quantos micróbios se veem no vidro do microscópio? `🦠 🦠 🦠 🦠 🦠` (5)
- Médio: pares: As coisas da estante estão misturadas. Encontra os cinco pares iguais! (🔬 🔍 🦠 🥽 🧫); escolha: O professor olhou para uma formiga com a lupa. Como é que a formiga parece? `🐜 🔍` (🔍 Maior, entre 🤏 💨 🎨); cadeado: Havia 7 micróbios no vidro e o professor limpou 2. Quantos micróbios ficaram? `🦠 🦠 🦠 🦠 🦠 🦠 🦠` (5)
- Difícil: pares: As coisas da estante estão todas misturadas. Encontra os seis pares iguais! (🔬 🔍 🦠 🥽 🧫 🧬); escolha: Qual destes animais tem as duas metades iguais, como se tivesse um espelho no meio? (🦋 Borboleta, entre 🐌 🦒 🦩); cadeado: Cada micróbio divide-se em 2. Havia 2 micróbios e dividiram-se duas vezes. Quantos micróbios há agora? `🦠 🦠` (8)

**Mesa com gaveta** (`mesa`) dá **Pilha** (`pilha`)
- Fácil: escolha: A gaveta tem um cadeado. Qual destas coisas precisa de pilha? (🔦 Lanterna, entre 🕯️ 🪁 📖); cadeado: A gaveta tem um cadeado. Quantas pilhas há lá dentro? `🔋 🔋 🔋 🔋 🔋 🔋` (6); pares: As coisas da gaveta estão misturadas. Encontra os pares iguais! (🔋 🔦 📎 ✏️)
- Médio: escolha: Qual destas coisas se apaga quando lhe tiras a pilha? (🔦 Lanterna, entre ☀️ 🕯️ 🔥); cadeado: Havia 9 pilhas na gaveta e o professor levou 4. Quantas pilhas ficaram? `🔋 🔋 🔋 🔋 🔋 🔋 🔋 🔋 🔋` (5); pares: As coisas da gaveta estão misturadas. Encontra os cinco pares iguais! (🔋 🔦 📎 ✏️ 📏)
- Difícil: escolha: Qual destas coisas não precisa de pilha nem de tomada para funcionar? (🪁 Papagaio de papel, entre 🔦 📻 💡); cadeado: Cada lanterna leva 2 pilhas. Quantas pilhas são precisas para 3 lanternas? `🔦 🔦 🔦` (6); escolha: Qual das lanternas gasta a pilha mais depressa? `🔦 🌙` (💡 A que ficou ligada a noite toda, entre 🔦 ⚖️)


**Palavras:** íman / ímã (plural ímanes / ímãs); quadro / lousa; apanhar (pt-PT) / pegar (pt-BR); a meio (pt-PT) / pela metade (pt-BR); maqueta (pt-PT) / maquete (pt-BR); em baixo / embaixo; gerúndio (`a derreter` / `derretendo`); "mesa com gaveta" serve às duas (evite secretária / escrivaninha).

### 4. O Museu dos Dinossauros (`museu`)

**História:** a criança adormeceu / pegou no sono no museu durante a visita da escola. Acordou de noite e a porta grande estava trancada!
**Saída:** porta do museu (centro, x 50, y 45).
**Foco:** tempo (ontem, hoje, amanhã; antes e depois), ciclos de vida, comprimento, classificar animais.

**Esqueleto de T-rex** (`trex`)
- Fácil: escolha: Caíram quatro ossos do T-rex! Qual é o osso mais comprido? `🦖` (▬▬▬▬ Osso da perna, entre ▬▬ ▬ ▬▬▬); cadeado: Olha para os dentes do T-rex! Quantos dentes há no desenho? Escreve o número. `🦷 🦷 🦷 🦷 🦷 🦷 🦷 🦷` (8); pares: O esqueleto desmontou-se! Encontra os pares iguais. (🦴 💀 🦷 🦖)
- Médio: escolha: O T-rex tinha dentes muito afiados. O que é que ele comia? `🦖 🦷🦷🦷` (🍖 Carne, entre 🥕 🍞 🍦); cadeado: O T-rex mede 4 passos e o tricerátops mede 3 passos. Quantos passos medem os dois juntos? `🦖 👣👣👣👣 ➕ 🦕 👣👣👣` (7); escolha: Quem viveu primeiro na Terra: o T-rex ou o teu avô? (🦖 O T-rex, entre 👴)
- Difícil: cadeado: O T-rex tem 2 braços pequeninos e cada braço tem 2 dedos. Quantos dedos tem nos braços? `🦖 ✌️ ✌️` (4); cadeado: O T-rex adulto mede 9 passos e o T-rex bebé mede 3. Quantos passos mede o adulto a mais do que o bebé? `🦖 👣👣👣👣👣👣👣👣👣` (6); ordem: Põe por ordem, do mais antigo ao mais recente: os dinossauros, o mamute, as pessoas das cavernas, o castelo e o avião. (🦕 → 🦣 → 🔥 → 🏰 → ✈️)

**Quadro dos dinossauros** (`quadro`)
- Fácil: cadeado: Quantos dinossauros há no quadro? Escreve o número. `🦕 🦖 🦕 🦕 🦖 🦕` (6); escolha: No quadro há um intruso! Qual destes não é um dinossauro? (🚗 Carro, entre 🦕 🦖); pares: As coisas do quadro misturaram-se. Encontra os pares iguais! (🦕 🦖 🥚 🌋)
- Médio: cadeado: Quantos dinossauros do quadro têm o pescoço comprido? Não contes os outros. `🦕 🦖 🦕 🦖 🦕 🦕 🦖` (4); escolha: Os dinossauros tinham a pele coberta de escamas. Que animal de hoje também tem escamas? `🦖` (🐍 Cobra, entre 🐄 🐑 🐕); escolha: No quadro, um dos animais está a comer as folhas das árvores. Qual é? `🌳 🌿` (🦕 Dinossauro de pescoço comprido, entre 🦖 🐊)
- Difícil: escolha: Um destes animais de hoje já vivia no tempo dos dinossauros. Qual é? (🐊 Crocodilo, entre 🐘 🐄 🐕); cadeado: No quadro há 3 dinossauros de pescoço comprido e o dobro de dinossauros pequenos. Quantos dinossauros pequenos há? `🦕 🦕 🦕` (6); cadeado: Quantos dinossauros do quadro não comem plantas? `🦕 🦖 🦕 🦖 🦕 🦖 🦕` (3)

**Ninho de ovos** (`ninho`)
- Fácil: cadeado: Quantos ovos há no ninho? Escreve o número. `🥚 🥚 🥚 🥚 🥚 🥚 🥚` (7); ordem: Põe o dinossauro por ordem: o ovo, o ovo a rachar, o bebé e o adulto. O risco mostra o tamanho. (🥚 → 🐣 → 🦖▬ → 🦖▬▬▬); pares: O ninho está cheio de surpresas. Encontra os pares iguais! (🥚 🐣 🐥 🍳)
- Médio: cadeado: No ninho havia 9 ovos e já nasceram 5 bebés. Quantos ovos faltam nascer? `🐣 🐣 🐣 🐣 🐣 🥚 🥚 🥚 🥚` (4); ordem: Põe o dinossauro por ordem: o ovo, o ovo a rachar, o bebé, o jovem e o adulto. O risco mostra o tamanho. (🥚 → 🐣 → 🦖▬ → 🦖▬▬ → 🦖▬▬▬); escolha: A galinha também põe ovos. Qual é o bebé da galinha? `🐔` (🐥 Pintainho, entre 🐛 🐟 🐸)
- Difícil: ordem: Põe o ciclo de vida do dinossauro por ordem: o ovo, o ovo a rachar, o bebé, o jovem, o adulto e o adulto a pôr ovos. (🥚 → 🐣 → 🦖▬ → 🦖▬▬ → 🦖▬▬▬ → 🦖🥚); cadeado: No ninho nasce 1 ovo por dia. Hoje já nasceram 2 e ainda há 3 por nascer. Daqui a quantos dias nasce o último? `🐣 🐣 🥚 🥚 🥚` (3); escolha: Há bichos que mudam muito quando crescem. A lagarta transforma-se em quê? `🐛` (🦋 Borboleta, entre 🐝 🪲 🐞)

**Fóssil de concha** (`fossil`)
- Fácil: escolha: Na pedra está uma concha muito antiga. Qual destas coisas é uma concha? (🐚 Concha, entre 🍕 🚗 🧦); cadeado: Quantos fósseis há na pedra? Escreve o número. `🐚 🦴 🐚 🦴 🐚` (5); pares: Os fósseis caíram da pedra. Encontra os pares iguais! (🐚 🦴 🪨 🦕)
- Médio: escolha: Esta pedra é um fóssil. O que é um fóssil? `🪨 🐚` (🐚 A marca de um animal muito antigo na pedra, entre 🌱 🧸 🍪); escolha: A concha do fóssil viveu no mar. Qual destes animais também vive no mar? `🌊` (🐚 Búzio, entre 🐄 🐓 🐿️); cadeado: Havia 3 conchas na pedra e a cientista encontrou mais 4. Quantas conchas há agora? `🐚 🐚 🐚 ➕ 🐚 🐚 🐚 🐚` (7)
- Difícil: escolha: Os ossos dos animais ficam na pedra como fósseis. Qual destes animais não tem ossos? (🐌 Caracol, entre 🐟 🐸 🐦); escolha: A rocha tem camadas, umas por cima das outras. Onde está o fóssil mais antigo? `🟨 🟧 🟫` (⬇️ Na camada de baixo, entre ⬆️ ↔️); cadeado: Quantos destes animais não têm ossos? `🐟 🐌 🐦 🐙 🪱` (3)

**Vitrine de cristais** (`vitrine`; `requer: 'lanterna'`)
- Fácil: pares: Os cristais brilham com a lanterna. Encontra os pares iguais! (💎 🔷 🔶 🔺); cadeado: Quantos cristais há na vitrine? Escreve o número. `💎 🔷 🔶 💎 🔷 🔶` (6); escolha: Apontaste a lanterna para a vitrine. Qual destas coisas brilha com a luz? `🔦` (💎 Cristal, entre 🪨 🪵 🧦)
- Médio: pares: Os cristais brilham com a lanterna. Encontra os cinco pares iguais! (💎 🔷 🔶 🔺 🟣); escolha: Os cristais crescem dentro da rocha. Qual destes cristais é o mais comprido? (💙▬▬▬▬ Cristal azul, entre 💜▬▬▬ 💚▬▬ 🧡▬▬▬); cadeado: Quantos cristais azuis há na vitrine? Não contes os outros. `🔷 🔶 🔷 🟣 🔷 🔶` (3)
- Difícil: pares: Os cristais da vitrine são parecidos. Encontra os seis pares iguais! (💎 🔷 🔶 🔹 🔸 🔺); escolha: Quatro caixas de cristais parecem iguais, mas uma é diferente. Qual é? (🔷🔶🔷 Terceira caixa, entre 🔷🔷🔶 🔷🔷🔶 🔷🔷🔶); cadeado: Este cristal cresce 1 centímetro por ano. Hoje mede 3 centímetros. Quanto vai medir daqui a 2 anos? `💎 📏` (5)

**Vulcão** (`vulcao`)
- Fácil: escolha: O vulcão está a acordar! O que sai do vulcão? `🌋` (🔥 Lava quente, entre 🍦 💧 ❄️); ordem: Põe o vulcão por ordem, a acordar: a montanha calma, o fumo, o fogo e a lava a sair. (🏔️ → 💨 → 🔥 → 🌋); cadeado: Quantas nuvens de fumo saíram do vulcão? Escreve o número. `🌋 ☁️ ☁️ ☁️ ☁️` (4)
- Médio: ordem: Põe por ordem o que acontece: o vulcão calmo, o fumo, a terra a tremer, a lava e a rocha nova. (🏔️ → 💨 → 〰️ → 🔥 → 🪨); escolha: A lava quente saiu do vulcão e arrefeceu. Em que se transforma? `🔥 ➡️ ❔` (🪨 Rocha, entre 💧 ❄️ 🔥); cadeado: O vulcão deitou fumo ontem e hoje, e amanhã vai deitar fumo também. Em quantos dias deita fumo ao todo? `💨 💨 💨` (3)
- Difícil: cadeado: O vulcão acordou anteontem. Há quantos dias foi isso? `🌋 📅` (2); ordem: Põe por ordem o que acontece depois da lava: a lava quente, a lava a arrefecer, a rocha, uma planta a nascer e a floresta. (🔥 → 🌡️ → 🪨 → 🌱 → 🌲🌳🌲); escolha: O dinossauro viu o fumo do vulcão e fugiu. O que aconteceu primeiro? `🦕 💨 🏃` (💨 O vulcão deitou fumo, entre 🏃)

**Pegadas** (`pegadas`)
- Fácil: escolha: No chão há quatro pegadas. Qual é a maior? (⬤ Segunda pegada, entre • ● ∙); cadeado: Quantas pegadas há no chão? Escreve o número. `🐾 🐾 🐾 🐾 🐾 🐾 🐾 🐾` (8); escolha: Esta pegada é enorme! De quem é? (🦖 T-rex, entre 🐈 🐦 🐜)
- Médio: escolha: Estas pegadas são quase iguais. Qual é a mais comprida? (🐾▬▬▬▬▬ Quarta pegada, entre 🐾▬▬▬▬ 🐾▬▬▬ 🐾▬▬▬▬); cadeado: Cada pegada mede 3 palmos. Quantos palmos medem as duas pegadas juntas? `🦶 🦶` (6); escolha: Esta pegada tem três dedos finos e compridos. De que animal é? (🐦 Pássaro, entre 🐴 🐷 🐶)
- Difícil: cadeado: O T-rex dá passos de 3 palmos e deu 3 passos. Quantos palmos andou? `🦖 👣 👣 👣` (9); cadeado: A pegada grande mede 8 palmos e a pequena mede 3. Quantos palmos tem a grande a mais? `🦖 🐾` (5); escolha: Adivinha de quem é a pegada: não tem garras, é redonda e não é a mais pequena. (🐘 Elefante: redonda e grande, entre 🦖 🐈 🐔)

**Ampulheta** (`ampulheta`)
- Fácil: escolha: Qual destas ampulhetas já acabou? A areia já está toda em baixo. (⌛ Segunda ampulheta, entre ⏳ ⏳); ordem: Põe por ordem, do que demora menos ao que demora mais: piscar os olhos, lavar os dentes, almoçar e dormir a noite toda. (😉 → 🪥 → 🍽️ → 🛌); cadeado: Quantas ampulhetas há na mesa? Escreve o número. `⏳ ⌛ ⏳ ⌛ ⏳` (5)
- Médio: escolha: Hoje é segunda-feira. Que dia é amanhã? `📅` (📅 Terça-feira, entre 📅 📅 📅); escolha: Hoje é segunda-feira. Que dia foi ontem? `📅` (📅 Domingo, entre 📅 📅 📅); cadeado: Viraste a ampulheta de 3 minutos e, quando acabou, viraste a de 2 minutos. Quantos minutos passaram? `⏳ ⏳` (5)
- Difícil: escolha: Anteontem foi sábado. Que dia é hoje? `📅` (📅 Segunda-feira, entre 📅 📅 📅); cadeado: A areia da ampulheta demora 3 minutos a cair. Viraste-a 3 vezes. Quantos minutos passaram? `⏳ ⏳ ⏳` (9); ordem: Põe os dias da escola por ordem, do primeiro ao último da semana. (Segunda → Terça → Quarta → Quinta → Sexta)

**Globo** (`globo`)
- Fácil: escolha: No globo há animais do mundo inteiro. Qual destes animais voa? `🌍` (🦅 Águia, entre 🐄 🐘 🐊); cadeado: Quantos animais há desenhados no globo? Escreve o número. `🐘 🦒 🐧 🐨 🐪 🐼` (6); pares: Os animais saltaram do globo! Encontra os pares iguais. (🐘 🦒 🐧 🐨)
- Médio: escolha: Qual destes animais tem o corpo coberto de escamas? (🐟 Peixe, entre 🐈 🐑 🐒); cadeado: Quantas aves há no globo? Não contes os outros animais. `🐧 🐘 🦅 🐟 🦜 🐒` (3); escolha: Qual destes animais é um inseto? (🐝 Abelha, entre 🐦 🐸 🐁)
- Difícil: escolha: Os mamíferos bebem o leite da mãe. Qual destes é um mamífero que voa? (🦇 Morcego, entre 🦅 🦋 🐝); escolha: Os répteis têm escamas e põem ovos, como os dinossauros. Qual destes é um réptil? (🐢 Tartaruga, entre 🐸 🐟 🐧); cadeado: Quantos animais do globo não são mamíferos? `🐘 🦅 🐟 🐄 🐢 🐍 🦋 🐒` (5)

**Extras:**

**Escavação** (`escavacao`) dá **Chave do caixote** (`chave`)
- Fácil: pares: Na areia da escavação há coisas escondidas. Encontra os pares iguais! (🦴 🦕 ⛏️ 🪨); cadeado: Quantos ossos há na areia? Escreve o número. `🦴 🦴 🦴 🦴 🦴` (5); escolha: Para achar a chave tens de escavar. O que serve para escavar? (⛏️ Picareta, entre 🍰 🎈 🧦)
- Médio: pares: Na areia da escavação há coisas escondidas. Encontra os cinco pares iguais! (🦴 🦕 ⛏️ 🪨 🦷); cadeado: A cientista achou 2 ossos ontem e 3 ossos hoje. Quantos ossos achou? `🦴 🦴 ➕ 🦴 🦴 🦴` (5); pares: Junta cada animal a uma parte do seu corpo, como o T-rex e o osso! (🦖↔🦴 🐢↔🐚 🐘↔🦷 🐦↔🪶)
- Difícil: pares: Junta cada animal a uma coisa que é dele, como o T-rex e o osso! (🦖↔🦴 🐢↔🐚 🐘↔🦷 🐦↔🪶 🦕↔🥚); cadeado: A cientista achou 2 ossos por dia durante 3 dias, mas perdeu 1. Quantos ossos tem? `🦴🦴 🦴🦴 🦴🦴` (5); cadeado: O osso mede 4 palmos e a pá mede 2. Quantas pás seguidas medem o mesmo que o osso? `🦴 ▬▬▬▬  🪏 ▬▬` (2)

**Caixote trancado** (`caixote`; `requer: 'chave'`) dá **Lanterna** (`lanterna`)
- Fácil: ordem: No caixote há quatro ossos. Põe-nos por ordem, do mais curto ao mais comprido. (▬ → ▬▬ → ▬▬▬ → ▬▬▬▬); cadeado: Quantas coisas há no caixote? Escreve o número. `🦴 🪨 🐚 🦴 🪨 🐚` (6); escolha: O museu está escuro. Qual destas coisas do caixote dá luz? (🔦 Lanterna, entre 🪨 🦴 🧦)
- Médio: ordem: No caixote há cinco ossos. Põe-nos por ordem, do mais curto ao mais comprido. (▬ → ▬▬ → ▬▬▬ → ▬▬▬▬ → ▬▬▬▬▬); cadeado: O caixote tem 8 ossos e tiraste 3. Quantos ossos ficaram no caixote? `🦴 🦴 🦴 🦴 🦴 🦴 🦴 🦴` (5); escolha: Qual destas fitas mede o mesmo que o osso? `🦴 ▬▬▬` (📏 ▬▬▬ Fita azul, entre 📏 ▬▬ 📏 ▬▬▬▬ 📏 ▬)
- Difícil: ordem: Cada osso tem o comprimento escrito em palmos. Põe-nos por ordem, do mais curto ao mais comprido. (🦴 1 → 🦴 2 → 🦴 4 → 🦴 5 → 🦴 7 → 🦴 9); escolha: Cada osso pequeno mede 2 palmos. Qual osso mede o mesmo que 2 ossos pequenos juntos? `🦴 2 ➕ 🦴 2` (🦴 4 palmos, entre 🦴 🦴 🦴); cadeado: No caixote há 3 filas de 3 fósseis, mas falta 1. Quantos fósseis há? `🐚🐚🐚 🐚🐚🐚 🐚🐚▫️` (8)


**Palavras:** adormeceu (pt-PT) / pegou no sono (pt-BR); bebé / bebê; fumo (pt-PT) / fumaça (pt-BR); deitar fumo / soltar fumaça; arrefecer (pt-PT) / esfriar (pt-BR); em baixo / embaixo; mais pequena / menor; gerúndio (`a rachar` / `rachando`, `a cair` / `caindo`).

### 5. A Pirâmide do Faraó (`piramide`)

**História:** numa visita ao Egito, a criança seguiu um gato preto até uma câmara secreta da pirâmide. A porta de pedra fechou-se / se fechou devagarinho atrás dela.
**Saída:** porta de pedra com o sol (centro, x 50, y 45).
**Foco:** códigos secretos (cada símbolo vale um número), numeração com traços, filas com pistas lógicas.

**Tocha** (`tocha`)
- Fácil: cadeado: Ao lado da tocha há traços riscados na parede. Quantos traços há? Escreve o número. `🔥 | | | | | |` (6); escolha: Está escuro na câmara! Qual tocha está acesa? (🔥 Tocha com fogo, entre 🪵 💧 💨); pares: A tocha ilumina umas cartas no chão. Encontra os pares iguais! (🔥 🏺 🐈‍⬛ ☀️)
- Médio: cadeado: Na parede, os traços estão em grupos: um grupo de 5 e outro de 2. Quantos traços há ao todo? `||||| ||` (7); cadeado: No código secreto da pirâmide, cada chama vale 2. Quanto valem duas chamas? `🔥 = 2   🔥🔥 = ❔` (4); ordem: Põe as tochas em fila. A tocha grande, com mais chamas, é a primeira. A pequena é a última. (🔥🔥🔥 → 🔥🔥 → 🔥)
- Difícil: escolha: No código secreto, a chama vale 3 e a lua vale 1. Que grupo vale 7? `🔥 = 3   🌙 = 1` (🔥🔥🌙 Grupo D, entre 🔥🌙 🔥🔥 🔥🌙🌙🌙); cadeado: Na parede havia estes traços e o vento apagou 3. Quantos traços ficaram? `|||| ||||` (5); ordem: As tochas acendem-se por ordem. A amarela é a primeira, a azul acende antes da verde e a vermelha é a última. Põe as tochas por ordem. (🟡 → 🔵 → 🟢 → 🔴)

**Hieróglifos** (`hieroglifos`)
- Fácil: escolha: Na parede há um símbolo mágico. Qual destes símbolos é igual a ele? `👁️` (👁️ Olho, entre 🐍 ☀️ 🐦); cadeado: Nos hieróglifos há cobras desenhadas. Quantas cobras há na parede? `🐍 🐍 🐍 🐍 🐍` (5); pares: Os símbolos da parede soltaram-se! Encontra os pares iguais. (👁️ 🐍 ☀️ 🌊)
- Médio: cadeado: No código secreto, cada cobra vale 2. Quanto valem três cobras? `🐍 = 2   🐍🐍🐍 = ❔` (6); pares: Junta cada grupo de cobras com o seu número! (🐍↔1️⃣ 🐍🐍↔2️⃣ 🐍🐍🐍↔3️⃣ 🐍🐍🐍🐍↔4️⃣); escolha: No código secreto, cada olho vale 3. Que grupo vale 6? `👁️ = 3` (👁️👁️ Dois olhos, entre 👁️ 👁️👁️👁️)
- Difícil: cadeado: No código secreto, a cobra vale 2 e o olho vale 3. Quanto vale uma cobra com dois olhos? `🐍 = 2   👁️ = 3   🐍👁️👁️ = ❔` (8); escolha: O sol vale 4. A cobra vale 2, o olho vale 3, o pássaro vale 5 e a onda vale 6. Que símbolo, junto com o sol, dá 9? `☀️ = 4   ☀️ ➕ ❔ = 9` (🐦 Pássaro, entre 🐍 👁️ 🌊); pares: A cobra vale 2 e o olho vale 3. Junta cada grupo de símbolos com o seu valor! (🐍↔2️⃣ 👁️↔3️⃣ 🐍🐍↔4️⃣ 🐍👁️↔5️⃣ 👁️👁️↔6️⃣)

**Estátua do gato** (`gato`)
- Fácil: escolha: Adivinha quem sou: sou preto e faço miau. (🐈‍⬛ Gato, entre 🐕 🐄 🐑); cadeado: Na câmara há gatos de pedra. Quantos gatos há? Escreve o número. `🐈‍⬛ 🐈‍⬛ 🐈‍⬛ 🐈‍⬛` (4); pares: Os animais do Egito estão escondidos. Encontra os pares iguais! (🐈‍⬛ 🐪 🐊 🦂)
- Médio: escolha: Adivinha quem sou: tenho bossas e ando no deserto. (🐪 Camelo, entre 🐈‍⬛ 🐊 🦂); ordem: Os animais estão em fila. O gato é o primeiro, o crocodilo vem logo a seguir ao gato e o camelo é o último. Põe a fila por ordem. (🐈‍⬛ → 🐊 → 🦂 → 🐪); cadeado: O gato é o terceiro da fila. Quantos animais estão à frente dele? `🐪 🐊 🐈‍⬛ 🦂 🐍` (2)
- Difícil: ordem: Põe os animais em fila. A cobra é a primeira. O gato está entre o crocodilo e o camelo, e o crocodilo vem antes do camelo. O escorpião é o último. (🐍 → 🐊 → 🐈‍⬛ → 🐪 → 🦂); escolha: Adivinha quem sou: não tenho pernas, vivo na areia e não sou um peixe. (🐍 Cobra, entre 🐟 🦂 🐊); cadeado: Numa fila de 9 animais, o gato é o quarto a contar da frente. Quantos animais estão atrás dele? `🐪 🐊 🐍 🐈‍⬛ 🦂 🐪 🐊 🐍 🦂` (5)

**Pintura do barco** (`barco`)
- Fácil: cadeado: Na pintura, o barco tem remadores. Quantos remadores há? Escreve o número. `🚣 🚣 🚣 🚣 🚣 🚣` (6); escolha: Qual destes barcos é igual ao barco da pintura? `⛵` (⛵ Barco à vela, entre 🚤 🚢 🛶); pares: A pintura do rio desfez-se em cartas. Encontra os pares iguais! (⛵ 🌴 🐟 ☀️)
- Médio: cadeado: O barco tem 4 remos de um lado e 4 do outro. Quantos remos tem ao todo? `🚣 ⛵ 🚣` (8); escolha: Na pintura, um sol na vela quer dizer «rei». Qual é o barco do rei? (⛵☀️ Barco do sol, entre ⛵🌙 ⛵⭐ ⛵🌊); ordem: Os barcos descem o rio em fila. O navio grande vai à frente e a canoa pequena vai no fim. Põe a fila por ordem. (🚢 → ⛵ → 🛶)
- Difícil: ordem: Os barcos navegam no Nilo. O barco à vela vai à frente do navio grande, a canoa vai entre eles e o barco a remos é o último. Põe a fila por ordem. (⛵ → 🛶 → 🚢 → 🚣); cadeado: No barco há 9 remadores. 3 estão a descansar e os outros remam aos pares. Quantos pares remam? `🚣 🚣 🚣 🚣 🚣 🚣 🚣 🚣 🚣` (3); escolha: Nas pinturas, cada símbolo é uma palavra. Qual pintura diz: «o pássaro voa sobre o rio, debaixo do sol»? `🐦 = pássaro   🌿 = rio   ☀️ = sol` (🐦🌿☀️ Pintura B, entre 🐦🌿 🌿☀️ 🐦☀️)

**Balança dourada** (`balanca`; `requer: 'moedas'`)
- Fácil: cadeado: Puseste as moedas no prato da balança. Quantas moedas há no prato? `🪙 🪙 🪙 🪙 🪙` (5); escolha: Qual prato tem mais moedas? (🪙🪙🪙🪙 Prato B, entre 🪙🪙 🪙); pares: As moedas e os tesouros caíram da balança. Encontra os pares iguais! (🪙 💰 💎 ⚖️)
- Médio: cadeado: Cada moeda vale o número dos seus traços. Quanto valem estas três moedas juntas? `( | )   ( || )   ( || )` (5); escolha: Qual destas moedas tem 3 traços? (||| Moeda D, entre || |||| |); pares: Junta cada moeda com traços ao seu número! (|↔1️⃣ ||↔2️⃣ |||↔3️⃣ ||||↔4️⃣)
- Difícil: cadeado: A moeda do sol vale 5 e a moeda da lua vale 1. No prato há um sol e duas luas. Quanto vale o prato? `☀️ = 5   🌙 = 1   ☀️🌙🌙 = ❔` (7); escolha: Adivinha qual é a moeda do faraó: não tem sol, tem mais de 2 traços e não é a última da fila. (||| Moeda C, entre ☀️||| || ||||); escolha: O sol vale 5 e a lua vale 1. Qual prato vale 6? `☀️ = 5   🌙 = 1` (☀️🌙 Prato D, entre ☀️☀️ 🌙🌙🌙 ☀️🌙🌙)

**Sarcófago** (`sarcofago`; `requer: 'escaravelho'`)
- Fácil: pares: O sarcófago está cheio de joias. Encontra os pares iguais! (👑 💍 📿 💎); cadeado: Quantas joias há no sarcófago? Escreve o número. `💍 💎 👑 📿 💍 💎 📿` (7); escolha: O faraó usava uma coroa. Qual destas coisas é a coroa? (👑 Coroa, entre 💍 📿 🏺)
- Médio: pares: Junta cada coisa do faraó com o sítio onde se usa: a coroa vai com a cabeça! (👑↔🙂 💍↔☝️ ⌚↔✋ 🕶️↔👀); ordem: Põe as joias do faraó em fila. A coroa é a primeira, o colar vem logo a seguir à coroa e o anel é o último. (👑 → 📿 → 💎 → 💍); cadeado: O faraó tinha 9 anéis e pôs 4 nos dedos. Quantos anéis ficaram no sarcófago? `💍 💍 💍 💍 💍 💍 💍 💍 💍` (5)
- Difícil: ordem: Põe as joias do faraó em fila. A coroa é a primeira. O anel está logo antes do colar. O diamante não está ao lado da coroa. (👑 → 💍 → 📿 → 💎); pares: Junta cada coisa do faraó com o sítio onde se usa: a coroa vai com a cabeça! (👑↔🙂 💍↔☝️ ⌚↔✋ 🕶️↔👀 👡↔🦶); cadeado: Na máscara do faraó, a coroa vale 3 e cada anel vale 1. A máscara tem uma coroa e três anéis. Quanto vale? `👑 = 3   💍 = 1   👑💍💍💍 = ❔` (6)

**Vasos de barro** (`vasos`)
- Fácil: escolha: Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas? `🏺 🟥🟦🟥` (🟥🟦🟥 Vaso B, entre 🟩🟨🟩 🟨🟨🟨 🟦🟩🟦); cadeado: Quantos vasos de barro há na câmara? Escreve o número. `🏺 🏺 🏺 🏺 🏺 🏺` (6); cadeado: O vaso tem traços pintados. Quantos traços tem? `🏺 | | | |` (4)
- Médio: escolha: Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas? `🏺 🟥🟦🟥🟦` (🟥🟦🟥🟦 Vaso C, entre 🟥🟦🟦🟦 🟥🟦🟥🟥 🟦🟦🟥🟦); cadeado: O vaso tem 3 riscas em cima e 2 riscas em baixo. Quantas riscas tem ao todo? `🏺 ➖➖➖ ➖➖` (5); ordem: Põe os vasos por ordem, do que tem menos traços ao que tem mais. (| → || → ||| → |||| → |||||)
- Difícil: cadeado: Os egípcios escreviam números assim: o arco vale 10 e o traço vale 1. Quanto vale o número do vaso? `∩ = 10   | = 1   ∩ | | | = ❔` (13); escolha: Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas? Olha bem! `🏺 🟥🟨🟦🟨🟥` (🟥🟨🟦🟨🟥 Vaso D, entre 🟥🟦🟨🟨🟥 🟥🟨🟦🟦🟥 🟨🟥🟦🟨🟥); escolha: O arco vale 10 e o traço vale 1. Qual vaso tem o número 21? `∩ = 10   | = 1` (∩ ∩ | Vaso B, entre ∩ | | ∩ ∩ | | ∩ ∩ ∩)

**Maquete das pirâmides** (`maquete`)
- Fácil: cadeado: A pirâmide é feita de filas de blocos. Quantos blocos há na fila de baixo, a maior? `🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨` (4); escolha: A uma destas pirâmides falta um bloco. Qual é? (🟨 🟨⬛ 🟨🟨🟨 Pirâmide C, entre 🟨 🟨🟨 🟨🟨🟨 🟨 🟨🟨 🟨🟨🟨 🟨 🟨🟨 🟨🟨🟨); pares: Os blocos da maquete estão misturados. Encontra os pares iguais! (🟨 🟥 🟦 🟩)
- Médio: cadeado: A pirâmide tem 3 blocos em baixo, 2 no meio e 1 em cima. Quantos blocos tem ao todo? `🟨 · 🟨🟨 · 🟨🟨🟨` (6); ordem: Constrói a pirâmide de baixo para cima: primeiro a fila maior, por último o bloco do topo. (🟨🟨🟨🟨 → 🟨🟨🟨 → 🟨🟨 → 🟨); escolha: Qual destas pirâmides tem mais blocos? (🟨 🟨🟨 🟨🟨🟨 🟨🟨🟨🟨 Pirâmide B, entre 🟨 🟨🟨 🟨 🟨🟨 🟨🟨🟨)
- Difícil: cadeado: A pirâmide tem filas de 4, 3, 2 e 1 blocos. Quantos blocos tem ao todo? Escreve o número. `🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨` (10); ordem: Constrói uma pirâmide de 5 filas, de baixo para cima. (🟨🟨🟨🟨🟨 → 🟨🟨🟨🟨 → 🟨🟨🟨 → 🟨🟨 → 🟨); cadeado: A pirâmide de 4 filas perdeu o bloco do topo e um bloco da base. Quantos blocos tem agora? `🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨` (8)

**Tábua de pontos** (`tabua`)
- Fácil: cadeado: Na tábua está pintada uma peça de dominó. Quantos pontos tem a peça? `⚂|⚁` (5); escolha: Qual destas peças de dominó tem 3 pontos? (⚁|⚀ Peça C, entre ⚃|⚀ ⚀|　 ⚂|⚂); pares: As peças de dominó caíram da tábua. Encontra os pares iguais! (⚀|⚁ ⚂|⚃ ⚄|⚅ ⚁|⚁)
- Médio: escolha: Qual destas peças de dominó tem 6 pontos ao todo? (⚃|⚁ Peça C, entre ⚂|⚁ ⚃|⚂ ⚀|⚀); cadeado: A peça tem 4 pontos de um lado e 2 do outro. Quantos pontos tem ao todo? `⚃|⚁` (6); ordem: Põe as peças de dominó por ordem, da que tem menos pontos à que tem mais. (⚀|　 → ⚀|⚀ → ⚁|⚀ → ⚁|⚁ → ⚂|⚁)
- Difícil: escolha: Adivinha qual é a peça: tem mais de 5 pontos, um dos lados está vazio e não é a de 9 pontos. (⚅|　 Peça D, entre ⚄|　 ⚅|⚂ ⚃|⚂); cadeado: Quantos pontos têm estas duas peças juntas? `⚂|⚁   ⚀|⚂` (9); ordem: Encadeia as peças de dominó: cada peça toca a seguinte com o mesmo número. Começa na peça que começa com um ponto. (⚀|⚂ → ⚂|⚄ → ⚄|⚁ → ⚁|⚅ → ⚅|⚃)

**Extras:**

**Escaravelho dourado** (`escaravelho-dourado`) dá **Escaravelho-chave** (`escaravelho`)
- Fácil: escolha: Na fechadura do sarcófago está desenhado este bicho. Qual destes é igual? `🪲` (🪲 Escaravelho, entre 🐞 🦋 🐜); cadeado: O escaravelho tem um cadeado. Quantas pintas tem o escaravelho? `🪲 ⚫ ⚫ ⚫ ⚫` (4); pares: Os escaravelhos fugiram! Encontra os pares iguais. (🪲☀️ 🪲🌙 🪲⭐ 🪲💎)
- Médio: escolha: Este é o escaravelho da fechadura. Qual destes é igual a ele? `☀️🪲☀️` (☀️🪲☀️ Escaravelho B, entre ☀️🪲🌙 🌙🪲☀️ ☀️🐞☀️); cadeado: Quantos escaravelhos têm um sol? Não contes os outros. `🪲☀️  🪲  🪲☀️  🪲🌙  🪲☀️  🪲` (3); pares: Os escaravelhos fugiram! Encontra os cinco pares iguais. (🪲☀️ 🪲🌙 🪲⭐ 🪲💎 🪲🔥)
- Difícil: escolha: Este é o escaravelho da fechadura. Qual destes é igual a ele? Olha bem! `☀️🌙🪲⭐` (☀️🌙🪲⭐ Escaravelho D, entre 🌙☀️🪲⭐ ☀️⭐🪲🌙 ☀️🌙🪲🌙); escolha: Adivinha qual é o escaravelho-chave: tem um sol, tem mais de um desenho ao lado e não tem estrela. (🪲☀️🌙 Escaravelho D, entre 🪲☀️ 🪲☀️⭐ 🪲🌙🌙); cadeado: Numa fila de 7 escaravelhos, o escaravelho-chave é o terceiro a contar do fim. Em que lugar está, a contar do início? `🪲 🪲 🪲 🪲 🪲 🪲 🪲` (5)

**Baú aberto** (`bau`) dá **Moedas de ouro** (`moedas`)
- Fácil: cadeado: O baú tem um cadeado. Quantas moedas há no baú? `🪙 🪙 🪙 🪙 🪙 🪙 🪙` (7); escolha: No cadeado do baú está desenhado um sol. Que botão abre o baú? `☀️` (☀️ Sol, entre 🌙 ⭐ 🌊); pares: Os tesouros do baú estão misturados. Encontra os pares iguais! (🪙 💎 👑 🏺)
- Médio: cadeado: O cadeado do baú tem um código: o sol vale 1 e a lua vale 2. Quanto vale sol e lua? `☀️ = 1   🌙 = 2   ☀️🌙 = ❔` (3); escolha: Esta é a fila de símbolos do baú. Qual destas filas é igual? `☀️🌙⭐` (☀️🌙⭐ Fila C, entre ⭐🌙☀️ ☀️⭐🌙 🌙☀️⭐); pares: Os tesouros do baú estão misturados. Encontra os cinco pares iguais! (🪙 💎 👑 🏺 📿)
- Difícil: cadeado: O código do baú: o sol vale 1, a lua vale 2 e a estrela vale 3. Quanto vale estrela, lua e sol? `☀️ = 1   🌙 = 2   ⭐ = 3   ⭐🌙☀️ = ❔` (6); escolha: Com o mesmo código, que fila vale 9? `☀️ = 1   🌙 = 2   ⭐ = 3` (⭐⭐⭐ Fila D, entre ⭐⭐🌙 ☀️🌙⭐ 🌙🌙🌙); ordem: Com o mesmo código, põe os grupos por ordem, do que vale menos ao que vale mais. (☀️ → ☀️🌙 → ⭐🌙 → ⭐⭐☀️ → ⭐⭐⭐)


**Palavras:** riscas (pt-PT) / listras (pt-BR); bossas nas duas; devagarinho nas duas; em baixo / embaixo; o seu valor (pt-PT) / seu valor (pt-BR).
