# RPG: histórias novas (lógica pronta para implementar)

Projeto de 2 histórias novas para o RPG, no formato do livro-jogo que já existe (`src/jogos/rpg/livro/`). Aqui só há **lógica**: pontos, ações da criança, resultados possíveis, marcas e finais. Os textos narrados (por variante, com `{nome}`) e as imagens vêm depois, ponto a ponto.

Estado: as duas histórias daqui ainda não estão implementadas. A história do arqueiro (O Navio Fantasma) já foi feita (`src/jogos/rpg/navio/`) e saiu deste arquivo; os puzzles dela (PZ-01 a PZ-10) e os tipos novos que ela criou (ordem, código, pares, contar, padrão, luzes e melodia) ficaram no motor. Os puzzles estão **todos juntos na Parte 3**; as histórias (Parte 2) só citam o código do puzzle (`PZ-xx`).

Ideias de origem (movidas de `docs/IDEIAS.md`) estão na Parte 4, com o que já existe no motor e o que falta.

## Parte 1: regras comuns

### Notação dos pontos

- `A01`, `B05`, `C14`: id do ponto (letra = história). Cada ponto tem **emoji/cena** e **texto** (a escrever); aqui só se descreve o que a criança pode fazer.
- `[1] ação` → resultado: uma escolha. `[se tem x]` = só aparece com a marca `x`. `[se não tem x]` = só aparece sem ela.
- `TESTE Atributo CD n` = d20 + atributo contra a dificuldade `n` (o nível do jogo ajusta: fácil −3, médio −1, difícil 0). `✔` acerto, `✘` erro.
- `PZ-xx` = puzzle da Parte 3. `✔` e `✘` dizem para onde a história segue. Acabaram as tentativas = `✘` (a resposta certa aparece, para aprender).
- `LUTA inimigo (posição)` = luta; vencer segue para o destino indicado; **perder = tentar a luta outra vez** (como hoje), nunca fim de jogo.
- `+marca` / `−marca` = marca ganha / perdida ao chegar ao ponto. Marcas com item na mochila estão na lista de itens da história.
- `FIM:x` = final `x`.
- Garantia (conferida pelo `livro()` ao carregar): todo ponto tem pelo menos uma saída sem condição; todo final é alcançável; nenhum puzzle ou teste leva a beco sem saída. **Errar nunca bloqueia: leva a outra luta, a um caminho mais longo ou a perder um bônus.**

### Escalas (iguais às histórias atuais)

- Atributos: 6 pontos para distribuir, mínimo 1, máximo 4 (herói; o arqueiro, já feito, também); 5 pontos no mago/druida. Inteligência/Visão/Natureza ≥ 3 dá **1 tentativa a mais** nos puzzles.
- Tentativas por puzzle: 3 (+1 do atributo). Dificuldade dos testes: CD 8 fácil, 10 médio, 12 difícil de passar.
- Inimigos: vida 6 a 18, defesa 8 a 12, ataque +0 a +2, dano d4 ou d6. O nível do jogo ajusta (`AJUSTES_NIVEL`): vida do inimigo ×0,8 / ×0,85 / ×1; ataque −2 / −1 / 0.
- Puzzles mudam de dificuldade pelo nível do jogo, não pela história (fácil, médio, difícil na Parte 3).
- Cada história tem **3 ou 4 finais** e o diário guarda os já vistos (`finais.ts`).

### Os dois tipos de herói que faltam

| Classe | História | Atributos (6 pontos) | Recurso e regra própria |
|---|---|---|---|
| Druida | H2 Coração da Floresta | Instinto, Vigor, Natureza (5 pontos) | **Bicho companheiro** com habilidade de recarga; **sementes** |
| Herói (clássico) | H3 Castelo do Dragão | Força, Agilidade, Inteligência, Coragem | A ficha de hoje; a história é de puzzles |

Cada classe nova precisa de **4 personagens** (2 masculinos, 2 femininos, cada um com nome próprio) em `PERSONAGENS` (`src/jogos/rpg/personagem.ts`), imagens em `public/imagens/rpg/` e `npm run audio:narrador`. Nomes sugeridos (conferir se servem às duas variantes): druidas Bento, Ravi, Alma, Sol. Já existem os arqueiros Rui, Kai, Lia e Mira (com as imagens dos heróis como substitutas; veja `docs/PROMPTS-IMAGENS.md`). O H3 usa os 4 heróis atuais (Davi, Malik, Clara, Amara).

---

## Parte 2: as histórias

### H2. O Coração da Floresta (druida e bicho companheiro)

A Árvore-Mãe está doente e a floresta perdeu as estações. A criança é a nova druida e leva um bicho que escolheu. Três trilhas dão três remédios; o final depende do que trouxe.

**Regras próprias da druida**
- Atributos (5 pontos): **Instinto** (acerto e ataques da druida), **Vigor** (vida = 10 + 2×Vigor), **Natureza** (puzzles, falar com bichos; ≥ 3 dá +1 tentativa).
- Ataque da druida: **Folhas cortantes** (d20 + Instinto contra a defesa, dano d6) ou **Espinhos** (nunca erra, dano d4, 1 vez por luta).
- **Companheiro** (escolha no início). Habilidade com recarga: **1 vez por luta** e **1 vez por puzzle**.
  - **Lobo**: na luta, rola o d20 de novo (fica com o melhor); no puzzle, mostra uma resposta errada a menos.
  - **Coruja**: na luta, o inimigo erra o próximo golpe; no puzzle, dá uma dica (mostra uma pista).
  - **Urso**: na luta, absorve um golpe do inimigo; no puzzle, +1 tentativa.
- **Sementes**: a druida leva uma `semente`; usá-la gasta a marca. Uma `semente-dourada` pode ser achada na Colina.
- O companheiro não muda de força durante a história (só enfeites, se houver, sem mudar o equilíbrio).

**Inimigos**: Sapo Gigante (8, 9, +0, d4, já existe) · Enxame de Lagartas (7, 9, +0, d4) · Javali Espinhento (9, 10, +1, d4) · Morcego (6, 12, +1, d4, já existe) · Raiz Sombria (16, 12, +2, d6).

**Marcas**: `comp-lobo`, `comp-coruja`, `comp-urso`, `semente` 🎒, `agua-clara` 🎒, `agua-turva` 🎒, `mel` 🎒, `semente-dourada` 🎒, `esporos` 🎒, `luz`, `vinculo`.

**Finais**: `forca` (a Raiz Sombria vencida) · `esperteza` (a semente dourada replantada no tempo certo) · `amizade` (a canção da floresta com todos os bichos).

**Pontos**

- **B01 Clareira da Árvore-Mãe.** O Ancião musgo explica a doença e entrega a `semente`; a criança escolhe com quem viaja.
  - [1] O lobo → B02 · [2] A coruja → B03 · [3] O urso → B04  (`+semente`)
- **B02 / B03 / B04 Apresentação.** `+comp-lobo` / `+comp-coruja` / `+comp-urso`; cada um mostra a sua habilidade. → B05 (os três).
- **B05 Vínculo.** O bicho confia mais se for alimentado com o que gosta.
  - PZ-19 ✔ → B06, `+vinculo` · ✘ → B06
- **B06 Encruzilhada.** Três trilhas.
  - [1] Seguir o rio → B07
  - [2] Subir a colina das abelhas → B10
  - [3] Entrar na gruta dos cogumelos → B13
- **B07 Rio de pedras.** Pedras numeradas boiam.
  - PZ-11 ✔ → B09 · ✘ → B08
- **B08 Cai na água.**
  - LUTA Sapo Gigante (perto) → B09
- **B09 Nascente.** O espírito da água faz uma pergunta.
  - PZ-12 ✔ → B16, `+agua-clara` · ✘ → B16, `+agua-turva`
- **B10 Colina das abelhas.** As flores precisam ser contadas.
  - PZ-13 ✔ → B11 · ✘ → B10b
- **B10b Abelhas bravas e lagartas.**
  - LUTA Enxame de Lagartas (perto) → B11
- **B11 Casa da Rainha.** Pede que acerte quem fez as pegadas e as sombras no mel.
  - PZ-14 ✔ → B16, `+mel`, `+semente-dourada` · ✘ → B16, `+mel`
- **B13 Gruta dos cogumelos.** Escuro.
  - [1] [se tem comp-coruja] A coruja vê no escuro → B14, `+luz`
  - [2] Acender os cogumelos de luz → B13p
- **B13p Cogumelos de luz.**
  - PZ-15 ✔ → B14, `+luz` · ✘ → B13b
- **B13b Morcegos assustados.**
  - LUTA Morcego (perto) → B14
- **B14 Espírito dos cogumelos.** Quer que se nomeiem os moradores da gruta.
  - PZ-16 ✔ → B16, `+esporos` · ✘ → B16
- **B16 Pé da Árvore-Mãe.** Quem chegou aqui trouxe o que achou.
  - [1] Enfrentar a Raiz Sombria → B17
  - [2] [se tem semente-dourada] Plantar a semente dourada → B18
  - [3] [se tem agua-clara ou esporos] Chamar os bichos da floresta → B19
- **B17 Raiz Sombria.**
  - LUTA Raiz Sombria (perto; se tem `agua-turva`, a Raiz ganha +1 de defesa) → B20
- **B18 A semente certa.** Plantar na hora e na ordem certas (estações).
  - PZ-17 ✔ → B21 · ✘ → B17
- **B19 A canção.** Os bichos só vêm se a melodia da floresta for repetida.
  - PZ-18 ✔ → B22 · ✘ → B17
- **B20** FIM:forca. **B21** FIM:esperteza. **B22** FIM:amizade.

**Caminhos que se cruzam**: B06 dá uma única trilha por jogada (como a Pedra da Lua). O Rio dá a água; a Colina, o mel e a semente dourada; a Gruta, os esporos. A água clara ou os esporos abrem a canção (amizade); a semente dourada abre o final de esperteza; sem nada, só a luta. `vinculo` é um bônus escondido: o companheiro pode usar a habilidade uma vez a mais em B17.

---

### H3. O Castelo do Dragão sem Fogo (herói clássico, puzzles)

O inverno chegou, o castelo está gelado e o dragão perdeu o fogo: não consegue acender nem a própria lareira. O herói sobe o castelo para descobrir por quê. É a história de **mais puzzles** (o herói quase não luta).

**Regras próprias**: ficha igual à da Pedra da Lua (Força, Agilidade, Inteligência, Coragem; vida = 10 + 2×Coragem; Inteligência ≥ 3 dá +1 tentativa). Sem loja; as poções iniciais do nível valem.

**Inimigos**: Armadura Viva (9, 12, +1, d6) · Morcego (6, 12, +1, d4, já existe) · Lesma Gigante (6, 8, +0, d4, já existe) · Esqueleto (9, 11, +1, d6, já existe) · Dragão Triste (16, 11, +1, d6).

**Marcas**: `pao-quente` 🎒, `tocha` 🎒, `livro` 🎒, `pimenta` 🎒, `faisca` 🎒, `sabe-palavra` (fato escondido).

**Finais**: `forca` (o dragão se acalma na luta) · `esperteza` (a faísca acende o braseiro) · `amizade` (a canção e a comida) · `magia` (a palavra mágica do livro).

**Pontos**

- **C01 Aldeia na neve.** Todos tremem de frio.
  - [1] Ir à padeira → C02
  - [2] Ir ao lenhador → C03
  - [3] Subir já ao castelo → C04
- **C02 Padeira.** O pão congelou; só se pode assar com a medida certa.
  - PZ-21 ✔ → C04, `+pao-quente` · ✘ → C04
- **C03 Lenhador.** Troca a tocha por uma cantiga.
  - PZ-22 ✔ → C04, `+tocha` · ✘ → C04
- **C04 Portão do castelo.** Fechado.
  - [1] Empurrar com força → C04t
  - [2] Esperar a hora em que o portão abre → C04r
- **C04t** TESTE Força CD 10: ✔ → C06 · ✘ → C05
- **C04r** PZ-23 ✔ → C06 · ✘ → C05
- **C05 Armadura de guarda.**
  - LUTA Armadura Viva (perto) → C06
- **C06 Grande salão.** Três portas, só tempo para uma.
  - [1] Biblioteca → C07
  - [2] Cozinha → C09
  - [3] Forja → C11
- **C07 Biblioteca.** O livro do dragão está incompleto.
  - PZ-24 ✔ → C13, `+livro`, `+sabe-palavra` · ✘ → C07b
- **C07b Morcegos da biblioteca.**
  - LUTA Morcego (perto) → C13
- **C09 Cozinha.** Frascos de tempero misturados.
  - PZ-25 ✔ → C13, `+pimenta` · ✘ → C09b
- **C09b Lesma na despensa.**
  - LUTA Lesma Gigante (perto) → C13
- **C11 Forja.** A forja guarda uma faísca presa nos canos.
  - PZ-26 ✔ → C13, `+faisca` · ✘ → C11b
- **C11b Esqueleto do ferreiro.**
  - LUTA Esqueleto (perto) → C13
- **C13 Escada da torre.** Quem chegou aqui sobe.
  - [1] Subir pela escada em caracol → C13t
  - [2] Abrir a porta secreta → C13c
- **C13t** TESTE Agilidade CD 10: ✔ → C14 · ✘ → C13b
- **C13c** PZ-30 ✔ → C14 · ✘ → C13b
- **C13b Guarda da torre.**
  - LUTA Esqueleto (perto) → C14
- **C14 O dragão triste.** Sentado no escuro, sem fogo.
  - [1] [se tem faisca] Acender o braseiro com a faísca → C15
  - [2] [se tem livro] Ler a palavra mágica do livro → C16
  - [3] [se tem pimenta ou pao-quente] Oferecer o que trouxe e ouvir a história → C17
  - [4] Enfrentar o dragão → C18
- **C15 Braseiro apagado.** A luz da faísca precisa ser refletida pelos espelhos.
  - PZ-27 ✔ → C19 · ✘ → C18
- **C16 A palavra mágica.** Tem de ser dita certa.
  - PZ-29 ✔ → C22 · ✘ → C18
- **C17 A cantiga do dragão.** Ele só dorme com a canção de ninar.
  - PZ-28 ✔ → C21 · ✘ → C18
- **C18 Dragão assustado.**
  - LUTA Dragão Triste (perto) → C20
- **C19** FIM:esperteza. **C20** FIM:forca. **C21** FIM:amizade. **C22** FIM:magia.

**Caminhos que se cruzam**: cada sala (biblioteca, cozinha, forja) dá uma marca diferente e abre um final diferente. O mesmo herói não passa por todas: rejogar muda tudo. PZ-23 e PZ-30 são portas alternativas aos testes (para quem escolheu Inteligência em vez de Força/Agilidade).

---

## Parte 3: todos os puzzles

Cada puzzle é um **caso fixo**: o motor sorteia os números, as palavras e a ordem da rodada pelo nível (`rodada.ts`), mas o tema, as peças e a resposta certa estão aqui. Todo texto e toda palavra-resposta vira **par pt-PT / pt-BR** quando a grafia muda; os marcados 🅥 dependem da variante.

### 3.1 Tipos de puzzle

| Tipo | No motor hoje | Fácil | Médio | Difícil |
|---|---|---|---|---|
| ESCREVER | ✅ `escrever` | letras para tocar na ordem | letras + 3 intrusas | teclado |
| CONTA | ✅ `conta` | soma/subtração até 5 | até 20 | até 40, sem mostrar a conta |
| SEQUENCIA | ✅ `sequencia` | de 1 em 1 | de 2, 5 ou 10 | passos 3 a 9, a subir ou descer |
| ENIGMA | ✅ `enigma` | 2 opções | 3 opções | 4 opções |
| ORDEM | ✅ `ordem` | 3 cartas | 4 cartas | 5 cartas |
| CODIGO | ✅ `codigo` | 2 dígitos, 1 pista | 3 dígitos | 4 dígitos |
| PARES | ✅ `pares` | 3 pares | 4 pares | 5 pares |
| CONTAR | ✅ `contar` | até 5 itens | até 10 | até 15, itens parecidos |
| PADRAO | ✅ `padrao` | AB | AAB | ABC / crescente |
| LUZES | ✅ `luzes` | 3 lampiões | 5 | 6, vizinhos mudam |
| SOM | ✅ `som` | 3 notas | 4 | 5 |
| SOMBRA | novo | 2 sombras | 3 | 4, parecidas |
| BALANCA | novo | até 6 | até 12 | até 20 |
| RELOGIO | novo | hora cheia | meia hora | quartos |
| LETRA_FALTA | novo | 1 buraco, 3 letras | 1 buraco, 4 letras | 2 buracos |
| SILABAS | novo 🅥 | 2 sílabas | 3 | 4 + 1 intrusa |
| RIMA | novo 🅥 | 2 pares | 3 | 4 |
| MEMORIA | novo | 2×3 | 3×4 | 4×4 |
| LABIRINTO | novo | pequeno | médio | com chave a pegar |
| ESPELHO | novo | grade 3×3 | 4×4 | 5×5 |

Regras gerais: 3 tentativas (+1 de Inteligência/Visão/Natureza/Sabedoria); ao acabar, mostra-se a resposta certa. Os tipos novos reaproveitam `EnigmaView.tsx` e `Desafio.tsx`; veja a Parte 4.

### 3.3 Puzzles da H2 (O Coração da Floresta)

| Código | Tipo | O que a criança vê e faz | Resposta certa | Usado em |
|---|---|---|---|---|
| PZ-11 | SEQUENCIA | Pedras do rio com números; pisar na que falta | o número que falta | B07 |
| PZ-12 | ENIGMA | O espírito da água: "Sou leve, subo ao céu e volto em gotas. O que sou?" (nuvem, pedra, vento, sombra) | a nuvem | B09 |
| PZ-13 | CONTA (subtração) | Na colina há {a} flores e {b} já têm abelha; quantas faltam? | a − b | B10 |
| PZ-14 | SOMBRA | A Rainha mostra a sombra de quem deixou pegadas no mel; qual bicho é? | o bicho da sombra | B11 |
| PZ-15 | LUZES | Cogumelos de luz: tocar acende o cogumelo e os vizinhos | todos acesos | B13p |
| PZ-16 | ESCREVER | O espírito mostra um bicho e uma planta da gruta; escrever o nome 🅥 | a palavra da imagem | B14 |
| PZ-17 | ORDEM | O ciclo da semente: semente, broto, planta, flor (e fruto no difícil); pôr em ordem | a ordem do ciclo | B18 |
| PZ-18 | SOM | A canção da floresta: repetir a melodia de 3 a 5 notas | a melodia | B19 |
| PZ-19 | PARES | Dar a cada bicho a comida que ele gosta (lobo-osso, coruja-rato, urso-mel) | cada bicho com a sua comida | B05 |

### 3.4 Puzzles da H3 (O Castelo do Dragão sem Fogo)

| Código | Tipo | O que a criança vê e faz | Resposta certa | Usado em |
|---|---|---|---|---|
| PZ-21 | BALANCA | A padeira pesa a farinha: equilibrar o prato com pesos | peso igual | C02 |
| PZ-22 | RIMA | O lenhador canta uma cantiga; ligar as palavras que rimam 🅥 | os pares que rimam | C03 |
| PZ-23 | RELOGIO | O portão abre quando o relógio marca a hora do desenho da lua | a hora pedida | C04r |
| PZ-24 | LETRA_FALTA | A biblioteca tem páginas com letras apagadas (palavras do dragão) 🅥 | a letra que falta | C07 |
| PZ-25 | MEMORIA | Frascos de tempero viram para achar os pares | todos os pares | C09 |
| PZ-26 | LABIRINTO | Levar a faísca pelos canos da forja até a lareira | o caminho | C11 |
| PZ-27 | ESPELHO | Completar a metade que falta do desenho do espelho para refletir a luz | a metade espelhada | C15 |
| PZ-28 | PADRAO | A canção de ninar do dragão tem um padrão de cores (vermelho-azul-vermelho...) | o próximo | C17 |
| PZ-29 | SILABAS | A palavra mágica em sílabas soltas: montar a palavra na ordem 🅥 | a palavra mágica | C16 |
| PZ-30 | CODIGO | Porta secreta com código; as pistas estão nos quadros do salão | o código das pistas | C13c |

### 3.5 Reservas

Puzzles prontos, sem uso nas três histórias. Servem de troca se algum não funcionar no teste, e para histórias futuras.

| Código | Tipo | Ideia |
|---|---|---|
| PZ-20 | CONTAR | Contar quantos frutos há na árvore e tocar nos que são de verdade |
| PZ-31 | ENIGMA | Uma adivinha com respostas de imagem (sem leitura, para os menores) |
| PZ-32 | CONTA (soma) | Dois cestos de maçãs; quantas ao todo |
| PZ-33 | SEQUENCIA | Os degraus de uma escada com números a faltar |
| PZ-34 | ESCREVER | Nomear o objeto escondido de uma cena |
| PZ-35 | ORDEM | As cenas da própria história, em ordem |
| PZ-36 | PARES | Chave e fechadura pela cor |

### 3.6 Conferência (mantenha ao editar)

- Todo `PZ-xx` citado numa história existe nas tabelas 3.3 e 3.4.
- Todo puzzle das tabelas 3.3 e 3.4 aparece em algum ponto das histórias; só os da seção 3.5 (reservas) ficam sem uso.
- Os ids de pontos usados em destinos também devem existir (veja a Parte 5).

---

## Parte 4: o que o motor já tem e o que falta

Ideias de origem (movidas de `docs/IDEIAS.md`): classe nova com flechas e distância; companheiro de viagem; escolhas que se bifurcam; enigmas no lugar de lutas; diário do herói; dois jogadores; arena de treino.

| Ideia | Estado | O que fazer |
|---|---|---|
| Histórias com escolhas (grafo de cenas) | ✅ feita (livro-jogo com `escolhas`, marcas e finais) | nada |
| Enigmas no lugar de lutas | ✅ feita (`desafio` nos pontos, 4 tipos) | faltam 9 tipos da tabela 3.1: sombra, balança, relógio, letra que falta, sílabas, rima, memória, labirinto e espelho (os outros 7 já existem em `livro/PuzzlesVisuais.tsx`) |
| Classe nova, arqueira | ✅ feita (O Navio Fantasma, `src/jogos/rpg/navio/`) | só faltam as imagens dos 4 arqueiros (hoje as dos heróis) |
| Classe nova, druida com bicho | 🔴 novo (H2) | ficha; escolha do companheiro; habilidade com recarga; 4 personagens |
| Companheiro de viagem (ideia 4) | 🟡 novo | a mesma mecânica do H2, que pode ir também para as histórias antigas |
| Diário do herói | 🟢 | `finais.ts` já guarda finais; falta guardar monstros e itens |
| Dois jogadores | 🟡 | fora do escopo destas histórias |
| Arena de treino | 🟢 | fora do escopo |

**Mudanças no motor** (em ordem de custo):
1. `Ponto` ganha `desafio` com tipos novos (feitos: `ordem`, `codigo`, `pares`, `contar`, `padrao`, `luzes`, `som`; faltam `sombra`, `balanca`, `relogio`, `letraFalta`, `silabas`, `rima`, `memoria`, `labirinto`, `espelho`); cada um com sua `RodadaX` em `desafios.ts` e sua tela em `livro/PuzzlesVisuais.tsx`.
2. ~~`Luta` com `posicao` e `flechas`~~ (feito: `navio/LutaArqueiro.tsx`); falta o `companheiro` (H2).
3. `Condicao` fica como está (marcas); `flechas` e `companheiro` ficam no estado da aventura, não nas marcas.
4. Inimigos novos em `INIMIGOS` (ou lista própria) com `emoji` em `public/imagens/inimigos/`.
5. Nova escolha de personagem para o druida (`EscolherPersonagem.tsx`; o arqueiro já existe).
6. Cada história registrada em `HISTORIAS` (`Rpg.tsx`).

**Imagens**: capa de cada história, fundo de cada cena importante, cada inimigo e cada personagem. Prompts em `docs/PROMPTS-IMAGENS.md` quando chegar a hora (não aqui).

**Áudio**: `npm run audio:narrador` depois do texto. Nomes dos novos personagens e dos inimigos entram na geração.

## Parte 5: conferência dos ids

Conferido na criação deste arquivo: todo destino (`→ X`) aponta para um ponto que existe, todo `PZ-xx` citado existe e usado em todas as tabelas, e nenhum puzzle das tabelas 3.3 e 3.4 ficou sem uso. Repita a checagem depois de qualquer edição grande; quando as histórias forem para o código, o `livro()` em `livro/regras.ts` faz essa conferência ao carregar.
