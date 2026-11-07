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

## Temas novos (a implementar)

Os objetos e as posições batem com os prompts de `docs/PROMPTS-IMAGENS.md` (seção "Saída Secreta"). As posições (x, y) são o ponto de partida das zonas; acerte-as depois com `?zonas`. Atenção às palavras com grafia diferente: vêm marcadas como **pt-PT / pt-BR**.

As ideias das tabelas são do nível **difícil**. Cada fonte precisa também de enigmas **fácil** e **médio** sobre o mesmo assunto, mais simples (ver "Níveis").

### 1. O Navio Pirata (`navio`)

**História:** a criança entrou no camarote do capitão para ver o mapa do tesouro, e a porta trancou-se / se trancou com uma onda. O cadeado tem desenhos de coisas do camarote.
**Saída:** porta do camarote (centro, x 50, y 45).
**Foco:** direções e pontos cardeais, mapas com coordenadas, partilhar (dividir), flutua ou afunda.

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Leme | esquerda, 10, 50 | escolha: o barco ia para norte e o leme deu meia volta; para onde vai agora (sul)?; ordem: o capitão dá as ordens por escrito ("primeiro oeste, depois norte, depois este / leste") e a criança toca as setas pela ordem lida |
| Mapa do tesouro | cima esquerda, 28, 22 | cadeado de 2 números: coluna e linha da ❌ numa grelha (coluna 3, linha 2 → "32"); escolha: partindo da 🌴, 2 casas para este / leste e 1 para sul, onde se chega? |
| Luneta | meio esquerda, 30, 52 | escolha: qual barco está mais longe (o que parece mais pequeno / menor); escolha: bandeiras de sinais, a vermelha quer dizer "perigo"; que barco pede ajuda? |
| Vigia (janela redonda) | cima direita, 70, 18 | cadeado: a maré subiu 3 degraus e desceu 1, estava no degrau 2, em que degrau está?; escolha: a ilha está do lado esquerdo do navio e o navio dá meia volta; de que lado fica agora a ilha (direita)? |
| Papagaio na gaiola | meio direita, 68, 48 | ordem: o papagaio disse a palavra às avessas, pôr as sílabas por ordem (pa · pa · gai · o); escolha: o papagaio diz sempre o contrário; disse "dia", o que é verdade (noite)? |
| Bússola e globo | direita, 90, 50 | escolha: a agulha aponta para norte; o que fica à direita (este / leste)?; pares associados: animal ↔ onde vive (🐧↔🧊, 🐪↔🏜️, 🐒↔🌴, 🐟↔🌊, 🐻‍❄️↔❄️) |
| Barril | baixo, 34, 80 | cadeado: 12 maçãs para 4 piratas, quantas para cada um?; cadeado: 3 piratas comem 2 bolachas cada, havia 9, quantas sobram? |
| Âncora | baixo centro, 50, 84 (`requer: 'corda'`) | escolha: o que vai ao fundo da água (⚓ entre 🪵 🦆 🎈); cadeado: a corrente tem elos em grupos de 5 (🔗×5 🔗×5 🔗×5), quantos elos? |
| Baú do tesouro | baixo esquerda, 16, 84 (`requer: 'chave'`) | cadeado: 2 moedas de 2 e 1 moeda de 1, quanto dinheiro?; escolha: qual vale mais, 3 moedas de 1 ou 1 moeda de 5? |

**Extras:** garrafa com mensagem (baixo direita, 66, 82) dá a **chave** do baú (enigma: a mensagem está escrita de trás para a frente, "EVAHC"; escolha a palavra certa); canhão com corda (baixo direita, 88, 84) dá a **corda** da âncora (enigma: ordem das bolas numeradas de 2 em 2: 2, 4, 6, 8, 10).
**Palavras:** camarote, vigia (janela redonda do navio), luneta; papagaio aqui é a ave (pt-PT também usa "papagaio" para o brinquedo, que no Brasil é "pipa"); este (pt-PT) / leste (pt-BR); bolachas (pt-PT) / biscoitos (pt-BR).

### 2. A Nave Espacial (`nave`)

**História:** a criança visitou a nave da Capitã Estrela. Um meteorito passou perto e a escotilha fechou-se / se fechou sozinha.
**Saída:** escotilha (centro, x 50, y 45).
**Foco:** sequências numéricas (de 2 em 2, contagem para trás), regras de padrões, lógica de pistas.

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Janela dos planetas | cima esquerda, 26, 22 | cadeado: contagem para o lançamento, 9, 8, 7, ❔, 5; escolha: qual planeta tem anéis (🪐) |
| Painel de botões | meio esquerda, 28, 55 | ordem: carregar / apertar os botões de 2 em 2 (2, 4, 6, 8, 10); escolha: que botão completa o padrão 🔴🟢🟢🔴🟢🟢🔴❔ |
| Radar | cima direita, 70, 20 | cadeado: os pontos aparecem 1, 3, 5, 7… quantos aparecem a seguir?; escolha: qual nave está mais perto do centro do radar |
| Robô ajudante | meio direita, 68, 50 (`requer: 'cartao'`) | escolha: adivinha com duas pistas ("não sou redondo e tenho 3 lados"); cadeado: a bateria tem 10 riscas e gasta 2 por hora, quantas ficam ao fim de 3 horas? |
| Capacete e comida espacial | direita, 90, 48 | ordem: vestir o astronauta (meias → fato / traje → luvas → capacete); escolha: o astronauta comeu às 12 e come de 3 em 3 horas, a que horas volta a comer? |
| Estufa | baixo esquerda, 16, 82 | cadeado: a planta tinha 1 cm e cresce 2 cm por dia, quanto mede ao fim de 3 dias?; ordem: semente → rebento / broto → flor → fruto |
| Telescópio | baixo, 34, 80 | escolha: ligar os pontos de uma constelação, que figura formam?; cadeado: viram-se estrelas cadentes 2, 4, 6… quantas na 4.ª noite? |
| Mapa das estrelas | baixo centro, 50, 86 | pares associados: ☀️↔🌙, 🌍↔💧, 🚀↔🔥, 👩‍🚀↔🪖, ⭐↔✨; escolha: o que dá luz própria, o Sol ou a Lua? |
| Caixas de carga | baixo direita, 68, 82 (`requer: 'estrela'`) | cadeado: caixas empilhadas em pirâmide 3 + 2 + 1; escolha: qual pilha vai cair (a que tem a caixa grande por cima) |

**Extras:** armário (esquerda, 10, 50) dá o **cartão de acesso** do robô (enigma: escolher o cartão que segue a regra, com pistas "é azul e tem estrela"); bichinho extraterrestre (baixo direita, 88, 84) dá a **chave-estrela** das caixas (enigma: o bichinho só come coisas verdes e redondas; qual é: 🍏 entre 🥒 🍊 🍌).
**Palavras:** ecrã (pt-PT) / tela (pt-BR); carregar no botão (pt-PT) / apertar o botão (pt-BR); fato (pt-PT) / traje (pt-BR); rebento / broto; extraterrestre nas duas.

### 3. O Laboratório do Inventor (`laboratorio`)

**História:** o Professor Parafuso saiu para almoçar e a porta de engrenagens trancou-se / se trancou. Ele deixou números escondidos nas experiências.
**Saída:** porta de engrenagens (centro, x 50, y 45).
**Foco:** misturas de cores, causa e efeito, formas e metades, rodas e alavancas, comparar pesos na balança.

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Armário de frascos | esquerda, 10, 50 | escolha: qual frasco está a meio / pela metade; ordem: do frasco vazio ao cheio (vazio, um quarto, metade, três quartos, cheio) |
| Quadro de giz (pt-PT) / Lousa (pt-BR) | cima esquerda, 28, 22 | cadeado: quantos lados têm juntos um triângulo e um quadrado?; escolha: que forma sai se cortarmos um quadrado ao meio pela diagonal (triângulo) |
| Tubos de ensaio | meio esquerda, 28, 55 (`requer: 'oculos'`) | pares associados: mistura ↔ cor que dá ("🔴+🟡"↔🟠, "🔵+🟡"↔🟢, "🔴+🔵"↔🟣, "⚫+⚪"↔🔘); escolha: azul + amarelo dá… |
| Engrenagens | cima direita, 70, 20 | escolha: a roda grande roda para a direita; para que lado roda a pequena, que está encostada (esquerda)?; cadeado: a roda pequena dá 2 voltas por cada volta da grande, a grande deu 4, quantas deu a pequena? |
| Sistema solar | meio direita, 68, 48 | escolha: porque é de noite? (a Terra rodou e ficámos / ficamos de costas para o Sol); cadeado: a Terra tem 1 lua e Marte tem 2, quantas luas juntos? |
| Íman (pt-PT) / Ímã (pt-BR) | baixo, 32, 80 | escolha: o que o íman / ímã apanha / pega (📎 entre 🪵 🧸 🍎); cadeado: cada íman / ímã segura 3 clipes, quantos seguram 3? |
| Aquário | baixo centro, 50, 84 | escolha: o que acontece ao gelo na água morna (derrete); cadeado: o peixe faz 1 bolha, depois 2, depois 4… quantas a seguir (8)? |
| Balança | baixo direita, 68, 80 | escolha: 1 melancia pesa o mesmo que 4 maçãs; que lado pesa mais, 🍉 ou 🍎🍎🍎?; cadeado: 2 melancias pesam o mesmo que quantas maçãs? |
| Robô de latas | baixo direita, 88, 84 (`requer: 'pilha'`) | ordem: ligar o circuito (pilha → fio → interruptor → lâmpada); escolha: por onde passa a eletricidade (🥄 de metal entre 🧸 🪵 🧦) |

**Extras:** estante do microscópio (direita, 90, 48) dá os **óculos de proteção** (enigma: pares associados, coisa pequena ↔ lupa/microscópio: 🐜↔🔍… ou 6 pares de micróbios sorridentes); mesa com gaveta (baixo esquerda, 16, 82) dá a **pilha** do robô (enigma: qual destes objetos precisa de pilha: 🔦 entre 🕯️ 🪁 📖).
**Palavras:** íman / ímã; quadro / lousa; apanhar (pt-PT) / pegar (pt-BR); a meio (pt-PT) / pela metade (pt-BR); "mesa com gaveta" serve às duas (evite secretária / escrivaninha).

### 4. O Museu dos Dinossauros (`museu`)

**História:** a criança adormeceu / pegou no sono no museu durante a visita da escola. Acordou de noite e a porta grande estava trancada!
**Saída:** porta do museu (centro, x 50, y 45).
**Foco:** tempo (ontem, hoje, amanhã; antes e depois), ciclos de vida, comprimento, classificar animais.

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Esqueleto de T-rex | esquerda, 12, 50 | escolha: pelos dentes afiados, o T-rex comia… (🍖 carne); cadeado: o T-rex tinha 2 braços pequenos com 2 dedos cada, quantos dedos nos braços? |
| Quadro dos dinossauros | cima esquerda, 28, 22 | escolha: que animal de hoje já vivia no tempo dos dinossauros (🐊 entre 🐘 🐄 🐕); cadeado: há 3 dinossauros de pescoço comprido e o dobro de pequenos, quantos pequenos? |
| Ninho de ovos | meio esquerda, 28, 55 | ordem: ovo → ovo a rachar / rachando → bebé / bebê → dinossauro adulto; cadeado: no ninho havia 9 ovos e já nasceram 5, quantos faltam nascer? |
| Fóssil de concha | cima direita, 70, 20 | escolha: o que é um fóssil (a marca de um animal muito antigo na pedra); escolha: qual destes animais não tem ossos (🐌 entre 🐟 🐸 🐦) |
| Vitrine de cristais | meio direita, 68, 48 (`requer: 'lanterna'`) | escolha: qual cristal é diferente dos outros (detalhe); pares de cristais, 6 pares iguais |
| Vulcão | direita, 90, 50 | ordem: o vulcão a acordar / acordando (🏔️ → 💨 → 🔥 → 🌋); escolha: o que sai do vulcão quando acorda (lava) |
| Pegadas | baixo, 32, 82 | cadeado: cada dinossauro deixou 2 pegadas e há 8 pegadas, quantos dinossauros passaram?; escolha: qual pegada é de ave (três dedos finos) |
| Ampulheta | baixo centro, 50, 82 | escolha: se hoje é segunda-feira, que dia foi ontem?; cadeado: a ampulheta demora 3 minutos e foi virada 3 vezes, quantos minutos passaram? |
| Globo | baixo direita, 88, 82 | escolha: onde vivem os pinguins (🧊); escolha: qual destes é um mamífero que voa (🦇 entre 🦅 🦋 🐝) |

**Extras:** escavação (baixo direita, 68, 84) dá a **chave do caixote** (enigma: pares associados, animal ↔ osso ou parte: 🦖↔🦴, 🐢↔🐚…); caixote trancado (baixo esquerda, 14, 84, `requer: 'chave'`) dá a **lanterna** para ver a vitrine (enigma: ordem dos ossos, do mais curto ao mais comprido).
**Palavras:** adormeceu (pt-PT) / pegou no sono (pt-BR); bebé / bebê; gerúndio (`a rachar` / `rachando`).

### 5. A Pirâmide do Faraó (`piramide`)

**História:** numa visita ao Egito, a criança seguiu um gato preto até uma câmara secreta da pirâmide. A porta de pedra fechou-se / se fechou devagarinho atrás dela.
**Saída:** porta de pedra com o sol (centro, x 50, y 45).
**Foco:** códigos secretos (cada símbolo vale um número), numeração com traços, filas com pistas lógicas.

| Fonte | Lugar (x, y) | Ideias de variantes |
|---|---|---|
| Tocha | esquerda, 10, 50 | escolha: a tocha está à esquerda da estátua; para que lado fica a sombra (direita)?; cadeado: cada tocha dura 2 horas, acenderam 4 uma depois da outra, quantas horas de luz? |
| Hieróglifos | cima esquerda, 28, 22 | cadeado: código secreto, 🐍 vale 2 e 👁️ vale 3; quanto vale 🐍 👁️ 👁️?; escolha: que símbolo falta no padrão 👁️🐦☀️👁️🐦❔ |
| Estátua do gato | meio esquerda, 28, 52 | ordem: pôr os animais em fila seguindo pistas ("o gato está entre o crocodilo e o camelo; o escorpião é o último"); escolha: quem sou? "tenho bossas e ando no deserto" (🐪) |
| Pintura do barco | cima direita, 70, 20 | cadeado: o barco tem 4 remos de cada lado, quantos remos?; escolha: o barco anda no rio Nilo; o que encontra lá (🐊 entre 🐧 🐻‍❄️ 🦘) |
| Balança dourada | meio direita, 68, 48 (`requer: 'moedas'`) | cadeado: de um lado 6 moedas, do outro 2; quantas moedas passar para ficarem iguais?; escolha: 1 ⚱️ pesa 3 🪙; que lado pesa mais? |
| Sarcófago | direita, 90, 48 (`requer: 'escaravelho'`) | ordem: as joias do faraó em fila por pistas ("a coroa é a primeira, o anel está logo antes do colar"); pares associados: joia ↔ onde se usa (👑↔cabeça, 💍↔mão…) |
| Vasos de barro | baixo esquerda, 16, 82 | cadeado: numeração egípcia, ∩ vale 10 e \| vale 1; quanto vale ∩ \| \| \|?; escolha: qual vaso é igual ao modelo (atenção aos detalhes das riscas / listras) |
| Maquete das pirâmides | baixo centro, 50, 84 | cadeado: pirâmide de blocos 4 + 3 + 2 + 1; ordem: construir de baixo para cima (fila de 4, de 3, de 2, de 1) |
| Tábua de pontos | baixo direita, 68, 84 | cadeado: os pontos crescem 1, 2, 4, 7… quantos a seguir (11)?; escolha: qual peça de dominó tem 6 pontos ao todo |

**Extras:** escaravelho dourado (baixo, 34, 82) dá o **escaravelho-chave** do sarcófago (enigma: escolher o escaravelho igual ao do desenho na porta, entre 4 quase iguais); baú aberto (baixo direita, 88, 84) dá as **moedas** da balança (enigma: código secreto com 3 símbolos para abrir o baú).
**Palavras:** riscas (pt-PT) / listras (pt-BR); bossas nas duas; devagarinho nas duas.
