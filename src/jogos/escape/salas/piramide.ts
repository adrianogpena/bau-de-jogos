import type { Sala } from '../tipos';

/**
 * A Pirâmide do Faraó. A saída é sempre a porta de pedra com o sol; o código (3 ou 4 números) sai de objetos
 * sorteados entre os 9 abaixo, cada um com várias versões do enigma. O escaravelho dourado é um extra: dá o
 * escaravelho-chave do sarcófago. O baú aberto é outro extra: dá as moedas da balança dourada.
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: códigos secretos (cada símbolo
 * vale um número), numeração com traços e filas com pistas lógicas.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/piramide.jpg); para conferir, abra a sala com ?zonas.
 */
export const piramide: Sala = {
  id: 'piramide',
  emoji: '🐪',
  cor: '#e0b45c',
  titulo: { 'pt-PT': 'A Pirâmide do Faraó', 'pt-BR': 'A Pirâmide do Faraó' },
  resumo: {
    'pt-PT': 'A porta de pedra fechou-se e ficaste preso na pirâmide. Descobre o código!',
    'pt-BR': 'A porta de pedra se fechou e você ficou preso na pirâmide. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Numa visita ao Egito, seguiste um gato preto até uma câmara secreta da pirâmide. A porta de pedra fechou-se devagarinho atrás de ti! Na porta há um cadeado com desenhos de coisas da câmara. Cada uma dessas coisas esconde um número. Descobre os números e abre a porta!',
    'pt-BR':
      'Numa visita ao Egito, você seguiu um gato preto até uma câmara secreta da pirâmide. A porta de pedra se fechou devagarinho atrás de você! Na porta há um cadeado com desenhos de coisas da câmara. Cada uma dessas coisas esconde um número. Descubra os números e abra a porta!',
  },
  fundo: 'imagens/saida-secreta/piramide.jpg',
  fundoCss: 'linear-gradient(180deg, #c99a52 0%, #a8773a 60%, #e3c48a 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da porta!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da porta!',
  },
  fontes: [
    {
      id: 'tocha',
      nome: { 'pt-PT': 'Tocha', 'pt-BR': 'Tocha' },
      emoji: '🔥',
      zona: { x: 5, y: 27, largura: 8, altura: 33 },
      sucesso: {
        'pt-PT': 'A chama da tocha cresceu e iluminou o número {n}!',
        'pt-BR': 'A chama da tocha cresceu e iluminou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔥 | | | | | |',
              pergunta: {
                'pt-PT': 'Ao lado da tocha há traços riscados na parede. Quantos traços há? Escreve o número.',
                'pt-BR': 'Ao lado da tocha tem traços riscados na parede. Quantos traços tem? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os traços um a um, com o dedo.',
              'pt-BR': 'Dica: conte os traços um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Está escuro na câmara! Qual tocha está acesa?',
                'pt-BR': 'Está escuro na câmara! Qual tocha está acesa?',
              },
              opcoes: [
                { emoji: '🪵', nome: { 'pt-PT': 'Tocha apagada', 'pt-BR': 'Tocha apagada' } },
                { emoji: '💧', nome: { 'pt-PT': 'Tocha molhada', 'pt-BR': 'Tocha molhada' } },
                { emoji: '🔥', nome: { 'pt-PT': 'Tocha com fogo', 'pt-BR': 'Tocha com fogo' } },
                { emoji: '💨', nome: { 'pt-PT': 'Tocha com fumo', 'pt-BR': 'Tocha com fumaça' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a tocha acesa tem uma chama que dá luz.',
              'pt-BR': 'Dica: a tocha acesa tem uma chama que dá luz.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'A tocha ilumina umas cartas no chão. Encontra os pares iguais!',
                'pt-BR': 'A tocha ilumina umas cartas no chão. Encontre os pares iguais!',
              },
              emojis: ['🔥', '🏺', '🐈‍⬛', '☀️'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '||||| ||',
              pergunta: {
                'pt-PT': 'Na parede, os traços estão em grupos: um grupo de 5 e outro de 2. Quantos traços há ao todo?',
                'pt-BR': 'Na parede, os traços estão em grupos: um grupo de 5 e outro de 2. Quantos traços tem ao todo?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: o primeiro grupo tem 5. Começa no 5 e conta os traços do outro grupo.',
              'pt-BR': 'Dica: o primeiro grupo tem 5. Comece no 5 e conte os traços do outro grupo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔥 = 2   🔥🔥 = ❔',
              pergunta: {
                'pt-PT': 'No código secreto da pirâmide, cada chama vale 2. Quanto valem duas chamas?',
                'pt-BR': 'No código secreto da pirâmide, cada chama vale 2. Quanto valem duas chamas?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: uma chama vale 2, a outra também vale 2. Junta os dois.',
              'pt-BR': 'Dica: uma chama vale 2, a outra também vale 2. Junte os dois.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe as tochas em fila. A tocha grande, com mais chamas, é a primeira. A pequena é a última.',
                'pt-BR': 'Coloque as tochas em fila. A tocha grande, com mais chamas, é a primeira. A pequena é a última.',
              },
              itens: ['🔥🔥🔥', '🔥🔥', '🔥'],
            },
            dica: {
              'pt-PT': 'Dica: começa pela tocha com mais chamas. A do meio fica no meio.',
              'pt-BR': 'Dica: comece pela tocha com mais chamas. A do meio fica no meio.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔥 = 3   🌙 = 1',
              pergunta: {
                'pt-PT': 'No código secreto, a chama vale 3 e a lua vale 1. Que grupo vale 7?',
                'pt-BR': 'No código secreto, a chama vale 3 e a lua vale 1. Que grupo vale 7?',
              },
              opcoes: [
                { emoji: '🔥🌙', nome: { 'pt-PT': 'Grupo A', 'pt-BR': 'Grupo A' } },
                { emoji: '🔥🔥', nome: { 'pt-PT': 'Grupo B', 'pt-BR': 'Grupo B' } },
                { emoji: '🔥🌙🌙🌙', nome: { 'pt-PT': 'Grupo C', 'pt-BR': 'Grupo C' } },
                { emoji: '🔥🔥🌙', nome: { 'pt-PT': 'Grupo D', 'pt-BR': 'Grupo D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: calcula quanto vale cada grupo. Por exemplo, chama e lua: 3 mais 1.',
              'pt-BR': 'Dica: calcule quanto vale cada grupo. Por exemplo, chama e lua: 3 mais 1.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '|||| ||||',
              pergunta: {
                'pt-PT': 'Na parede havia estes traços e o vento apagou 3. Quantos traços ficaram?',
                'pt-BR': 'Na parede tinha estes traços e o vento apagou 3. Quantos traços ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: primeiro conta todos os traços. Depois tira 3.',
              'pt-BR': 'Dica: primeiro conte todos os traços. Depois tire 3.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'As tochas acendem-se por ordem. A amarela é a primeira, a azul acende antes da verde e a vermelha é a última. Põe as tochas por ordem.',
                'pt-BR':
                  'As tochas se acendem em ordem. A amarela é a primeira, a azul acende antes da verde e a vermelha é a última. Coloque as tochas em ordem.',
              },
              itens: ['🟡', '🔵', '🟢', '🔴'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro a amarela e a vermelha no seu lugar. Depois vê qual vem antes: a azul ou a verde.',
              'pt-BR': 'Dica: coloque primeiro a amarela e a vermelha no lugar delas. Depois veja qual vem antes: a azul ou a verde.',
            },
          },
        ],
      },
    },
    {
      id: 'hieroglifos',
      nome: { 'pt-PT': 'Hieróglifos', 'pt-BR': 'Hieróglifos' },
      emoji: '👁️',
      zona: { x: 22.1, y: 18.9, largura: 17.9, altura: 20.3 },
      sucesso: {
        'pt-PT': 'Os símbolos brilharam e mostraram o número {n}!',
        'pt-BR': 'Os símbolos brilharam e mostraram o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '👁️',
              pergunta: {
                'pt-PT': 'Na parede há um símbolo mágico. Qual destes símbolos é igual a ele?',
                'pt-BR': 'Na parede tem um símbolo mágico. Qual destes símbolos é igual a ele?',
              },
              opcoes: [
                { emoji: '🐍', nome: { 'pt-PT': 'Cobra', 'pt-BR': 'Cobra' } },
                { emoji: '👁️', nome: { 'pt-PT': 'Olho', 'pt-BR': 'Olho' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Pássaro' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: olha bem para o desenho de cima e procura um igual.',
              'pt-BR': 'Dica: olhe bem o desenho de cima e procure um igual.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐍 🐍 🐍 🐍 🐍',
              pergunta: {
                'pt-PT': 'Nos hieróglifos há cobras desenhadas. Quantas cobras há na parede?',
                'pt-BR': 'Nos hieróglifos tem cobras desenhadas. Quantas cobras tem na parede?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as cobras uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as cobras uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os símbolos da parede soltaram-se! Encontra os pares iguais.',
                'pt-BR': 'Os símbolos da parede se soltaram! Encontre os pares iguais.',
              },
              emojis: ['👁️', '🐍', '☀️', '🌊'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐍 = 2   🐍🐍🐍 = ❔',
              pergunta: {
                'pt-PT': 'No código secreto, cada cobra vale 2. Quanto valem três cobras?',
                'pt-BR': 'No código secreto, cada cobra vale 2. Quanto valem três cobras?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta de 2 em 2, uma vez por cada cobra: 2, 4...',
              'pt-BR': 'Dica: conte de 2 em 2, uma vez para cada cobra: 2, 4...',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada grupo de cobras com o seu número!',
                'pt-BR': 'Junte cada grupo de cobras com seu número!',
              },
              emojis: [
                ['🐍', '1️⃣'],
                ['🐍🐍', '2️⃣'],
                ['🐍🐍🐍', '3️⃣'],
                ['🐍🐍🐍🐍', '4️⃣'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. Conta as cobras da carta e procura esse número.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. Conte as cobras da carta e procure esse número.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '👁️ = 3',
              pergunta: {
                'pt-PT': 'No código secreto, cada olho vale 3. Que grupo vale 6?',
                'pt-BR': 'No código secreto, cada olho vale 3. Que grupo vale 6?',
              },
              opcoes: [
                { emoji: '👁️', nome: { 'pt-PT': 'Um olho', 'pt-BR': 'Um olho' } },
                { emoji: '👁️👁️', nome: { 'pt-PT': 'Dois olhos', 'pt-BR': 'Dois olhos' } },
                { emoji: '👁️👁️👁️', nome: { 'pt-PT': 'Três olhos', 'pt-BR': 'Três olhos' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: um olho vale 3. Quantos olhos são precisos para chegar a 6?',
              'pt-BR': 'Dica: um olho vale 3. Quantos olhos são necessários para chegar a 6?',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐍 = 2   👁️ = 3   🐍👁️👁️ = ❔',
              pergunta: {
                'pt-PT': 'No código secreto, a cobra vale 2 e o olho vale 3. Quanto vale uma cobra com dois olhos?',
                'pt-BR': 'No código secreto, a cobra vale 2 e o olho vale 3. Quanto vale uma cobra com dois olhos?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: primeiro junta os dois olhos: 3 mais 3. Depois junta a cobra.',
              'pt-BR': 'Dica: primeiro junte os dois olhos: 3 mais 3. Depois junte a cobra.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️ = 4   ☀️ ➕ ❔ = 9',
              pergunta: {
                'pt-PT':
                  'O sol vale 4. A cobra vale 2, o olho vale 3, o pássaro vale 5 e a onda vale 6. Que símbolo, junto com o sol, dá 9?',
                'pt-BR':
                  'O sol vale 4. A cobra vale 2, o olho vale 3, o pássaro vale 5 e a onda vale 6. Que símbolo, junto com o sol, dá 9?',
              },
              opcoes: [
                { emoji: '🐍', nome: { 'pt-PT': 'Cobra', 'pt-BR': 'Cobra' } },
                { emoji: '👁️', nome: { 'pt-PT': 'Olho', 'pt-BR': 'Olho' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Pássaro' } },
                { emoji: '🌊', nome: { 'pt-PT': 'Onda', 'pt-BR': 'Onda' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta até 9. Quantos contaste?',
              'pt-BR': 'Dica: comece no 4 e conte até 9. Quantos você contou?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'A cobra vale 2 e o olho vale 3. Junta cada grupo de símbolos com o seu valor!',
                'pt-BR': 'A cobra vale 2 e o olho vale 3. Junte cada grupo de símbolos com seu valor!',
              },
              emojis: [
                ['🐍', '2️⃣'],
                ['👁️', '3️⃣'],
                ['🐍🐍', '4️⃣'],
                ['🐍👁️', '5️⃣'],
                ['👁️👁️', '6️⃣'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. Soma os símbolos da carta: duas cobras são 2 mais 2.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. Some os símbolos da carta: duas cobras são 2 mais 2.',
            },
          },
        ],
      },
    },
    {
      id: 'gato',
      nome: { 'pt-PT': 'Estátua do gato', 'pt-BR': 'Estátua do gato' },
      emoji: '🐈‍⬛',
      zona: { x: 20.3, y: 49.2, largura: 12.5, altura: 38.3 },
      sucesso: {
        'pt-PT': 'O gato de pedra piscou o olho e mostrou o número {n}!',
        'pt-BR': 'O gato de pedra piscou o olho e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha quem sou: sou preto e faço miau.',
                'pt-BR': 'Adivinhe quem eu sou: sou preto e faço miau.',
              },
              opcoes: [
                { emoji: '🐕', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
                { emoji: '🐈‍⬛', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐑', nome: { 'pt-PT': 'Ovelha', 'pt-BR': 'Ovelha' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: é o animal que seguiste até à pirâmide.',
              'pt-BR': 'Dica: é o animal que você seguiu até a pirâmide.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐈‍⬛ 🐈‍⬛ 🐈‍⬛ 🐈‍⬛',
              pergunta: {
                'pt-PT': 'Na câmara há gatos de pedra. Quantos gatos há? Escreve o número.',
                'pt-BR': 'Na câmara tem gatos de pedra. Quantos gatos tem? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta os gatos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os gatos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os animais do Egito estão escondidos. Encontra os pares iguais!',
                'pt-BR': 'Os animais do Egito estão escondidos. Encontre os pares iguais!',
              },
              emojis: ['🐈‍⬛', '🐪', '🐊', '🦂'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha quem sou: tenho bossas e ando no deserto.',
                'pt-BR': 'Adivinhe quem eu sou: tenho bossas e ando no deserto.',
              },
              opcoes: [
                { emoji: '🐈‍⬛', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐊', nome: { 'pt-PT': 'Crocodilo', 'pt-BR': 'Crocodilo' } },
                { emoji: '🦂', nome: { 'pt-PT': 'Escorpião', 'pt-BR': 'Escorpião' } },
                { emoji: '🐪', nome: { 'pt-PT': 'Camelo', 'pt-BR': 'Camelo' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: as bossas são os altos que este animal tem nas costas.',
              'pt-BR': 'Dica: as bossas são os altos que este animal tem nas costas.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Os animais estão em fila. O gato é o primeiro, o crocodilo vem logo a seguir ao gato e o camelo é o último. Põe a fila por ordem.',
                'pt-BR':
                  'Os animais estão em fila. O gato é o primeiro, o crocodilo vem logo depois do gato e o camelo é o último. Coloque a fila em ordem.',
              },
              itens: ['🐈‍⬛', '🐊', '🦂', '🐪'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro o gato e o camelo, nas pontas. Depois vê onde fica o crocodilo.',
              'pt-BR': 'Dica: coloque primeiro o gato e o camelo, nas pontas. Depois veja onde fica o crocodilo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐪 🐊 🐈‍⬛ 🦂 🐍',
              pergunta: {
                'pt-PT': 'O gato é o terceiro da fila. Quantos animais estão à frente dele?',
                'pt-BR': 'O gato é o terceiro da fila. Quantos animais estão na frente dele?',
              },
              resposta: '2',
            },
            dica: {
              'pt-PT': 'Dica: encontra o gato e conta só os animais que estão antes dele.',
              'pt-BR': 'Dica: encontre o gato e conte só os animais que estão antes dele.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe os animais em fila. A cobra é a primeira. O gato está entre o crocodilo e o camelo, e o crocodilo vem antes do camelo. O escorpião é o último.',
                'pt-BR':
                  'Coloque os animais em fila. A cobra é a primeira. O gato está entre o crocodilo e o camelo, e o crocodilo vem antes do camelo. O escorpião é o último.',
              },
              itens: ['🐍', '🐊', '🐈‍⬛', '🐪', '🦂'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro a cobra e o escorpião, nas pontas. Os outros três ficam no meio.',
              'pt-BR': 'Dica: coloque primeiro a cobra e o escorpião, nas pontas. Os outros três ficam no meio.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha quem sou: não tenho pernas, vivo na areia e não sou um peixe.',
                'pt-BR': 'Adivinhe quem eu sou: não tenho pernas, vivo na areia e não sou um peixe.',
              },
              opcoes: [
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
                { emoji: '🦂', nome: { 'pt-PT': 'Escorpião', 'pt-BR': 'Escorpião' } },
                { emoji: '🐍', nome: { 'pt-PT': 'Cobra', 'pt-BR': 'Cobra' } },
                { emoji: '🐊', nome: { 'pt-PT': 'Crocodilo', 'pt-BR': 'Crocodilo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. O escorpião e o crocodilo têm pernas, e o peixe não serve. Qual sobra?',
              'pt-BR': 'Dica: vá riscando. O escorpião e o crocodilo têm pernas, e o peixe não vale. Qual sobra?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐪 🐊 🐍 🐈‍⬛ 🦂 🐪 🐊 🐍 🦂',
              pergunta: {
                'pt-PT': 'Numa fila de 9 animais, o gato é o quarto a contar da frente. Quantos animais estão atrás dele?',
                'pt-BR': 'Numa fila de 9 animais, o gato é o quarto contando da frente. Quantos animais estão atrás dele?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: há 9 animais. Tira o gato e os 3 que estão à frente dele.',
              'pt-BR': 'Dica: são 9 animais. Tire o gato e os 3 que estão na frente dele.',
            },
          },
        ],
      },
    },
    {
      id: 'barco',
      nome: { 'pt-PT': 'Pintura do barco', 'pt-BR': 'Pintura do barco' },
      emoji: '⛵',
      zona: { x: 73.5, y: 20.8, largura: 21.1, altura: 23.3 },
      sucesso: {
        'pt-PT': 'Na vela do barco apareceu o número {n}!',
        'pt-BR': 'Na vela do barco apareceu o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🚣 🚣 🚣 🚣 🚣 🚣',
              pergunta: {
                'pt-PT': 'Na pintura, o barco tem remadores. Quantos remadores há? Escreve o número.',
                'pt-BR': 'Na pintura, o barco tem remadores. Quantos remadores tem? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os remadores um a um, com o dedo.',
              'pt-BR': 'Dica: conte os remadores um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '⛵',
              pergunta: {
                'pt-PT': 'Qual destes barcos é igual ao barco da pintura?',
                'pt-BR': 'Qual destes barcos é igual ao barco da pintura?',
              },
              opcoes: [
                { emoji: '🚤', nome: { 'pt-PT': 'Lancha', 'pt-BR': 'Lancha' } },
                { emoji: '🚢', nome: { 'pt-PT': 'Navio', 'pt-BR': 'Navio' } },
                { emoji: '🛶', nome: { 'pt-PT': 'Canoa', 'pt-BR': 'Canoa' } },
                { emoji: '⛵', nome: { 'pt-PT': 'Barco à vela', 'pt-BR': 'Barco a vela' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o barco da pintura tem uma vela branca.',
              'pt-BR': 'Dica: o barco da pintura tem uma vela branca.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'A pintura do rio desfez-se em cartas. Encontra os pares iguais!',
                'pt-BR': 'A pintura do rio se desfez em cartas. Encontre os pares iguais!',
              },
              emojis: ['⛵', '🌴', '🐟', '☀️'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🚣 ⛵ 🚣',
              pergunta: {
                'pt-PT': 'O barco tem 4 remos de um lado e 4 do outro. Quantos remos tem ao todo?',
                'pt-BR': 'O barco tem 4 remos de um lado e 4 do outro. Quantos remos tem ao todo?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta mais quatro: cinco, seis...',
              'pt-BR': 'Dica: comece no 4 e conte mais quatro: cinco, seis...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Na pintura, um sol na vela quer dizer «rei». Qual é o barco do rei?',
                'pt-BR': 'Na pintura, um sol na vela quer dizer "rei". Qual é o barco do rei?',
              },
              opcoes: [
                { emoji: '⛵🌙', nome: { 'pt-PT': 'Barco da lua', 'pt-BR': 'Barco da lua' } },
                { emoji: '⛵⭐', nome: { 'pt-PT': 'Barco da estrela', 'pt-BR': 'Barco da estrela' } },
                { emoji: '⛵☀️', nome: { 'pt-PT': 'Barco do sol', 'pt-BR': 'Barco do sol' } },
                { emoji: '⛵🌊', nome: { 'pt-PT': 'Barco da onda', 'pt-BR': 'Barco da onda' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura o barco que tem o símbolo do rei.',
              'pt-BR': 'Dica: procure o barco que tem o símbolo do rei.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Os barcos descem o rio em fila. O navio grande vai à frente e a canoa pequena vai no fim. Põe a fila por ordem.',
                'pt-BR': 'Os barcos descem o rio em fila. O navio grande vai na frente e a canoa pequena vai no fim. Coloque a fila em ordem.',
              },
              itens: ['🚢', '⛵', '🛶'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro o navio grande e a canoa no fim. O outro barco fica no meio.',
              'pt-BR': 'Dica: coloque primeiro o navio grande e a canoa no fim. O outro barco fica no meio.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Os barcos navegam no Nilo. O barco à vela vai à frente do navio grande, a canoa vai entre eles e o barco a remos é o último. Põe a fila por ordem.',
                'pt-BR':
                  'Os barcos navegam no Nilo. O barco a vela vai na frente do navio grande, a canoa vai entre eles e o barco a remo é o último. Coloque a fila em ordem.',
              },
              itens: ['⛵', '🛶', '🚢', '🚣'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro o barco a remos no fim. Os outros três ficam juntos antes dele.',
              'pt-BR': 'Dica: coloque primeiro o barco a remo no fim. Os outros três ficam juntos antes dele.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🚣 🚣 🚣 🚣 🚣 🚣 🚣 🚣 🚣',
              pergunta: {
                'pt-PT': 'No barco há 9 remadores. 3 estão a descansar e os outros remam aos pares. Quantos pares remam?',
                'pt-BR': 'No barco tem 9 remadores. 3 estão descansando e os outros remam em pares. Quantos pares remam?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: primeiro tira os 3 que descansam. Depois junta os outros de dois em dois.',
              'pt-BR': 'Dica: primeiro tire os 3 que descansam. Depois junte os outros de dois em dois.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐦 = pássaro   🌿 = rio   ☀️ = sol',
              pergunta: {
                'pt-PT': 'Nas pinturas, cada símbolo é uma palavra. Qual pintura diz: «o pássaro voa sobre o rio, debaixo do sol»?',
                'pt-BR': 'Nas pinturas, cada símbolo é uma palavra. Qual pintura diz: "o pássaro voa sobre o rio, debaixo do sol"?',
              },
              opcoes: [
                { emoji: '🐦🌿', nome: { 'pt-PT': 'Pintura A', 'pt-BR': 'Pintura A' } },
                { emoji: '🐦🌿☀️', nome: { 'pt-PT': 'Pintura B', 'pt-BR': 'Pintura B' } },
                { emoji: '🌿☀️', nome: { 'pt-PT': 'Pintura C', 'pt-BR': 'Pintura C' } },
                { emoji: '🐦☀️', nome: { 'pt-PT': 'Pintura D', 'pt-BR': 'Pintura D' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a frase fala de três coisas: o pássaro, o rio e o sol. Procura a pintura que tem as três.',
              'pt-BR': 'Dica: a frase fala de três coisas: o pássaro, o rio e o sol. Procure a pintura que tem as três.',
            },
          },
        ],
      },
    },
    {
      id: 'balanca',
      nome: { 'pt-PT': 'Balança dourada', 'pt-BR': 'Balança dourada' },
      emoji: '⚖️',
      zona: { x: 73, y: 50.8, largura: 17.2, altura: 35 },
      requer: 'moedas',
      bloqueado: {
        'pt-PT': 'Os pratos da balança estão vazios. Procura moedas!',
        'pt-BR': 'Os pratos da balança estão vazios. Procure moedas!',
      },
      sucesso: {
        'pt-PT': 'A balança equilibrou-se e mostrou o número {n}!',
        'pt-BR': 'A balança se equilibrou e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪙 🪙 🪙 🪙 🪙',
              pergunta: {
                'pt-PT': 'Puseste as moedas no prato da balança. Quantas moedas há no prato?',
                'pt-BR': 'Você colocou as moedas no prato da balança. Quantas moedas tem no prato?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as moedas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as moedas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual prato tem mais moedas?',
                'pt-BR': 'Qual prato tem mais moedas?',
              },
              opcoes: [
                { emoji: '🪙🪙', nome: { 'pt-PT': 'Prato A', 'pt-BR': 'Prato A' } },
                { emoji: '🪙🪙🪙🪙', nome: { 'pt-PT': 'Prato B', 'pt-BR': 'Prato B' } },
                { emoji: '🪙', nome: { 'pt-PT': 'Prato C', 'pt-BR': 'Prato C' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: conta as moedas de cada prato. Qual tem mais?',
              'pt-BR': 'Dica: conte as moedas de cada prato. Qual tem mais?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As moedas e os tesouros caíram da balança. Encontra os pares iguais!',
                'pt-BR': 'As moedas e os tesouros caíram da balança. Encontre os pares iguais!',
              },
              emojis: ['🪙', '💰', '💎', '⚖️'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '( | )   ( || )   ( || )',
              pergunta: {
                'pt-PT': 'Cada moeda vale o número dos seus traços. Quanto valem estas três moedas juntas?',
                'pt-BR': 'Cada moeda vale o número de traços dela. Quanto valem estas três moedas juntas?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta todos os traços das três moedas.',
              'pt-BR': 'Dica: conte todos os traços das três moedas.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas moedas tem 3 traços?',
                'pt-BR': 'Qual destas moedas tem 3 traços?',
              },
              opcoes: [
                { emoji: '||', nome: { 'pt-PT': 'Moeda A', 'pt-BR': 'Moeda A' } },
                { emoji: '||||', nome: { 'pt-PT': 'Moeda B', 'pt-BR': 'Moeda B' } },
                { emoji: '|', nome: { 'pt-PT': 'Moeda C', 'pt-BR': 'Moeda C' } },
                { emoji: '|||', nome: { 'pt-PT': 'Moeda D', 'pt-BR': 'Moeda D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: conta os traços de cada moeda.',
              'pt-BR': 'Dica: conte os traços de cada moeda.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada moeda com traços ao seu número!',
                'pt-BR': 'Junte cada moeda com traços com seu número!',
              },
              emojis: [
                ['|', '1️⃣'],
                ['||', '2️⃣'],
                ['|||', '3️⃣'],
                ['||||', '4️⃣'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. Conta os traços da moeda e procura esse número.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. Conte os traços da moeda e procure esse número.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '☀️ = 5   🌙 = 1   ☀️🌙🌙 = ❔',
              pergunta: {
                'pt-PT': 'A moeda do sol vale 5 e a moeda da lua vale 1. No prato há um sol e duas luas. Quanto vale o prato?',
                'pt-BR': 'A moeda do sol vale 5 e a moeda da lua vale 1. No prato tem um sol e duas luas. Quanto vale o prato?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: começa no 5 do sol e junta 1 por cada lua.',
              'pt-BR': 'Dica: comece no 5 do sol e junte 1 para cada lua.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT':
                  'Adivinha qual é a moeda do faraó: não tem sol, tem mais de 2 traços e não é a última da fila.',
                'pt-BR':
                  'Adivinhe qual é a moeda do faraó: não tem sol, tem mais de 2 traços e não é a última da fila.',
              },
              opcoes: [
                { emoji: '☀️|||', nome: { 'pt-PT': 'Moeda A', 'pt-BR': 'Moeda A' } },
                { emoji: '||', nome: { 'pt-PT': 'Moeda B', 'pt-BR': 'Moeda B' } },
                { emoji: '|||', nome: { 'pt-PT': 'Moeda C', 'pt-BR': 'Moeda C' } },
                { emoji: '||||', nome: { 'pt-PT': 'Moeda D', 'pt-BR': 'Moeda D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira a moeda com sol, depois a que tem poucos traços.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire a moeda com sol, depois a que tem poucos traços.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️ = 5   🌙 = 1',
              pergunta: {
                'pt-PT': 'O sol vale 5 e a lua vale 1. Qual prato vale 6?',
                'pt-BR': 'O sol vale 5 e a lua vale 1. Qual prato vale 6?',
              },
              opcoes: [
                { emoji: '☀️☀️', nome: { 'pt-PT': 'Prato A', 'pt-BR': 'Prato A' } },
                { emoji: '🌙🌙🌙', nome: { 'pt-PT': 'Prato B', 'pt-BR': 'Prato B' } },
                { emoji: '☀️🌙🌙', nome: { 'pt-PT': 'Prato C', 'pt-BR': 'Prato C' } },
                { emoji: '☀️🌙', nome: { 'pt-PT': 'Prato D', 'pt-BR': 'Prato D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: calcula quanto vale cada prato. Dois sóis são 5 mais 5.',
              'pt-BR': 'Dica: calcule quanto vale cada prato. Dois sóis são 5 mais 5.',
            },
          },
        ],
      },
    },
    {
      id: 'sarcofago',
      nome: { 'pt-PT': 'Sarcófago', 'pt-BR': 'Sarcófago' },
      emoji: '⚱️',
      zona: { x: 92, y: 37.9, largura: 14.7, altura: 59.2 },
      requer: 'escaravelho',
      bloqueado: {
        'pt-PT': 'O sarcófago tem uma fechadura em forma de escaravelho. Procura o escaravelho-chave!',
        'pt-BR': 'O sarcófago tem uma fechadura em forma de escaravelho. Procure o escaravelho-chave!',
      },
      sucesso: {
        'pt-PT': 'A tampa do sarcófago abriu-se e lá dentro estava o número {n}!',
        'pt-BR': 'A tampa do sarcófago se abriu e lá dentro estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O sarcófago está cheio de joias. Encontra os pares iguais!',
                'pt-BR': 'O sarcófago está cheio de joias. Encontre os pares iguais!',
              },
              emojis: ['👑', '💍', '📿', '💎'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💍 💎 👑 📿 💍 💎 📿',
              pergunta: {
                'pt-PT': 'Quantas joias há no sarcófago? Escreve o número.',
                'pt-BR': 'Quantas joias tem no sarcófago? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: conta as joias uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as joias uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O faraó usava uma coroa. Qual destas coisas é a coroa?',
                'pt-BR': 'O faraó usava uma coroa. Qual destas coisas é a coroa?',
              },
              opcoes: [
                { emoji: '💍', nome: { 'pt-PT': 'Anel', 'pt-BR': 'Anel' } },
                { emoji: '📿', nome: { 'pt-PT': 'Colar', 'pt-BR': 'Colar' } },
                { emoji: '🏺', nome: { 'pt-PT': 'Vaso', 'pt-BR': 'Vaso' } },
                { emoji: '👑', nome: { 'pt-PT': 'Coroa', 'pt-BR': 'Coroa' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a coroa põe-se na cabeça e tem pontas.',
              'pt-BR': 'Dica: a coroa vai na cabeça e tem pontas.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada coisa do faraó com o sítio onde se usa: a coroa vai com a cabeça!',
                'pt-BR': 'Junte cada coisa do faraó com o lugar onde ela é usada: a coroa vai com a cabeça!',
              },
              emojis: [
                ['👑', '🙂'],
                ['💍', '☝️'],
                ['⌚', '✋'],
                ['🕶️', '👀'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O anel vai no dedo e os óculos vão nos olhos.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O anel vai no dedo e os óculos vão nos olhos.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe as joias do faraó em fila. A coroa é a primeira, o colar vem logo a seguir à coroa e o anel é o último.',
                'pt-BR':
                  'Coloque as joias do faraó em fila. A coroa é a primeira, o colar vem logo depois da coroa e o anel é o último.',
              },
              itens: ['👑', '📿', '💎', '💍'],
            },
            dica: {
              'pt-PT': 'Dica: põe primeiro a coroa e o anel, nas pontas. Depois vê onde fica o colar.',
              'pt-BR': 'Dica: coloque primeiro a coroa e o anel, nas pontas. Depois veja onde fica o colar.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💍 💍 💍 💍 💍 💍 💍 💍 💍',
              pergunta: {
                'pt-PT': 'O faraó tinha 9 anéis e pôs 4 nos dedos. Quantos anéis ficaram no sarcófago?',
                'pt-BR': 'O faraó tinha 9 anéis e colocou 4 nos dedos. Quantos anéis ficaram no sarcófago?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: tapa 4 anéis com os dedos e conta os que sobram.',
              'pt-BR': 'Dica: cubra 4 anéis com os dedos e conte os que sobram.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe as joias do faraó em fila. A coroa é a primeira. O anel está logo antes do colar. O diamante não está ao lado da coroa.',
                'pt-BR':
                  'Coloque as joias do faraó em fila. A coroa é a primeira. O anel está logo antes do colar. O diamante não está ao lado da coroa.',
              },
              itens: ['👑', '💍', '📿', '💎'],
            },
            dica: {
              'pt-PT': 'Dica: põe a coroa primeiro. Se o diamante não pode ficar ao lado dela, onde fica?',
              'pt-BR': 'Dica: coloque a coroa primeiro. Se o diamante não pode ficar do lado dela, onde ele fica?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada coisa do faraó com o sítio onde se usa: a coroa vai com a cabeça!',
                'pt-BR': 'Junte cada coisa do faraó com o lugar onde ela é usada: a coroa vai com a cabeça!',
              },
              emojis: [
                ['👑', '🙂'],
                ['💍', '☝️'],
                ['⌚', '✋'],
                ['🕶️', '👀'],
                ['👡', '🦶'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. A sandália vai no pé e o relógio vai no pulso.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. A sandália vai no pé e o relógio vai no pulso.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '👑 = 3   💍 = 1   👑💍💍💍 = ❔',
              pergunta: {
                'pt-PT': 'Na máscara do faraó, a coroa vale 3 e cada anel vale 1. A máscara tem uma coroa e três anéis. Quanto vale?',
                'pt-BR': 'Na máscara do faraó, a coroa vale 3 e cada anel vale 1. A máscara tem uma coroa e três anéis. Quanto vale?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 da coroa e junta 1 por cada anel.',
              'pt-BR': 'Dica: comece no 3 da coroa e junte 1 para cada anel.',
            },
          },
        ],
      },
    },
    {
      id: 'vasos',
      nome: { 'pt-PT': 'Vasos de barro', 'pt-BR': 'Vasos de barro' },
      emoji: '🏺',
      zona: { x: 13.6, y: 80.1, largura: 24.7, altura: 20.6 },
      sucesso: {
        'pt-PT': 'Dentro de um vaso estava um papiro com o número {n}!',
        'pt-BR': 'Dentro de um vaso estava um papiro com o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🏺 🟥🟦🟥',
              pergunta: {
                'pt-PT': 'Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas?',
                'pt-BR': 'Estas são as listras do vaso da câmara. Qual destes vasos tem as mesmas listras?',
              },
              opcoes: [
                { emoji: '🟩🟨🟩', nome: { 'pt-PT': 'Vaso A', 'pt-BR': 'Vaso A' } },
                { emoji: '🟥🟦🟥', nome: { 'pt-PT': 'Vaso B', 'pt-BR': 'Vaso B' } },
                { emoji: '🟨🟨🟨', nome: { 'pt-PT': 'Vaso C', 'pt-BR': 'Vaso C' } },
                { emoji: '🟦🟩🟦', nome: { 'pt-PT': 'Vaso D', 'pt-BR': 'Vaso D' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o vaso da câmara tem riscas vermelhas e azuis.',
              'pt-BR': 'Dica: o vaso da câmara tem listras vermelhas e azuis.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🏺 🏺 🏺 🏺 🏺 🏺',
              pergunta: {
                'pt-PT': 'Quantos vasos de barro há na câmara? Escreve o número.',
                'pt-BR': 'Quantos vasos de barro tem na câmara? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os vasos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os vasos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🏺 | | | |',
              pergunta: {
                'pt-PT': 'O vaso tem traços pintados. Quantos traços tem?',
                'pt-BR': 'O vaso tem traços pintados. Quantos traços ele tem?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta os traços um a um, com o dedo.',
              'pt-BR': 'Dica: conte os traços um por um, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🏺 🟥🟦🟥🟦',
              pergunta: {
                'pt-PT': 'Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas?',
                'pt-BR': 'Estas são as listras do vaso da câmara. Qual destes vasos tem as mesmas listras?',
              },
              opcoes: [
                { emoji: '🟥🟦🟦🟦', nome: { 'pt-PT': 'Vaso A', 'pt-BR': 'Vaso A' } },
                { emoji: '🟥🟦🟥🟥', nome: { 'pt-PT': 'Vaso B', 'pt-BR': 'Vaso B' } },
                { emoji: '🟥🟦🟥🟦', nome: { 'pt-PT': 'Vaso C', 'pt-BR': 'Vaso C' } },
                { emoji: '🟦🟦🟥🟦', nome: { 'pt-PT': 'Vaso D', 'pt-BR': 'Vaso D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: compara as riscas uma a uma, da esquerda para a direita.',
              'pt-BR': 'Dica: compare as listras uma por uma, da esquerda para a direita.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🏺 ➖➖➖ ➖➖',
              pergunta: {
                'pt-PT': 'O vaso tem 3 riscas em cima e 2 riscas em baixo. Quantas riscas tem ao todo?',
                'pt-BR': 'O vaso tem 3 listras em cima e 2 listras embaixo. Quantas listras ele tem ao todo?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais duas: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais duas: quatro, cinco...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe os vasos por ordem, do que tem menos traços ao que tem mais.',
                'pt-BR': 'Coloque os vasos em ordem, do que tem menos traços ao que tem mais.',
              },
              itens: ['|', '||', '|||', '||||', '|||||'],
            },
            dica: {
              'pt-PT': 'Dica: começa pelo vaso com um só traço.',
              'pt-BR': 'Dica: comece pelo vaso com um traço só.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '∩ = 10   | = 1   ∩ | | | = ❔',
              pergunta: {
                'pt-PT': 'Os egípcios escreviam números assim: o arco vale 10 e o traço vale 1. Quanto vale o número do vaso?',
                'pt-BR': 'Os egípcios escreviam números assim: o arco vale 10 e o traço vale 1. Quanto vale o número do vaso?',
              },
              resposta: '13',
            },
            dica: {
              'pt-PT': 'Dica: começa no 10 do arco e conta 1 por cada traço.',
              'pt-BR': 'Dica: comece no 10 do arco e conte 1 para cada traço.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🏺 🟥🟨🟦🟨🟥',
              pergunta: {
                'pt-PT': 'Estas são as riscas do vaso da câmara. Qual destes vasos tem as mesmas riscas? Olha bem!',
                'pt-BR': 'Estas são as listras do vaso da câmara. Qual destes vasos tem as mesmas listras? Olhe bem!',
              },
              opcoes: [
                { emoji: '🟥🟦🟨🟨🟥', nome: { 'pt-PT': 'Vaso A', 'pt-BR': 'Vaso A' } },
                { emoji: '🟥🟨🟦🟦🟥', nome: { 'pt-PT': 'Vaso B', 'pt-BR': 'Vaso B' } },
                { emoji: '🟨🟥🟦🟨🟥', nome: { 'pt-PT': 'Vaso C', 'pt-BR': 'Vaso C' } },
                { emoji: '🟥🟨🟦🟨🟥', nome: { 'pt-PT': 'Vaso D', 'pt-BR': 'Vaso D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: compara as riscas uma a uma, da esquerda para a direita. Risca o vaso ao primeiro erro.',
              'pt-BR': 'Dica: compare as listras uma por uma, da esquerda para a direita. Descarte o vaso no primeiro erro.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '∩ = 10   | = 1',
              pergunta: {
                'pt-PT': 'O arco vale 10 e o traço vale 1. Qual vaso tem o número 21?',
                'pt-BR': 'O arco vale 10 e o traço vale 1. Qual vaso tem o número 21?',
              },
              opcoes: [
                { emoji: '∩ | |', nome: { 'pt-PT': 'Vaso A', 'pt-BR': 'Vaso A' } },
                { emoji: '∩ ∩ |', nome: { 'pt-PT': 'Vaso B', 'pt-BR': 'Vaso B' } },
                { emoji: '∩ ∩ | |', nome: { 'pt-PT': 'Vaso C', 'pt-BR': 'Vaso C' } },
                { emoji: '∩ ∩ ∩', nome: { 'pt-PT': 'Vaso D', 'pt-BR': 'Vaso D' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: 21 são dois dez e mais um. Procura dois arcos e um traço.',
              'pt-BR': 'Dica: 21 são dois dez e mais um. Procure dois arcos e um traço.',
            },
          },
        ],
      },
    },
    {
      id: 'maquete',
      nome: { 'pt-PT': 'Maquete das pirâmides', 'pt-BR': 'Maquete das pirâmides' },
      emoji: '🔺',
      zona: { x: 50.6, y: 83.75, largura: 19.3, altura: 13.3 },
      sucesso: {
        'pt-PT': 'Um bloco da maquete saiu do lugar e por baixo estava o número {n}!',
        'pt-BR': 'Um bloco da maquete saiu do lugar e embaixo estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨',
              pergunta: {
                'pt-PT': 'A pirâmide é feita de filas de blocos. Quantos blocos há na fila de baixo, a maior?',
                'pt-BR': 'A pirâmide é feita de filas de blocos. Quantos blocos tem na fila de baixo, a maior?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: a fila de baixo é a mais comprida. Conta só os blocos dessa fila.',
              'pt-BR': 'Dica: a fila de baixo é a mais comprida. Conte só os blocos dessa fila.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A uma destas pirâmides falta um bloco. Qual é?',
                'pt-BR': 'Em uma destas pirâmides está faltando um bloco. Qual é?',
              },
              opcoes: [
                { emoji: '🟨 🟨🟨 🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide A', 'pt-BR': 'Pirâmide A' } },
                { emoji: '🟨 🟨🟨 🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide B', 'pt-BR': 'Pirâmide B' } },
                { emoji: '🟨 🟨⬛ 🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide C', 'pt-BR': 'Pirâmide C' } },
                { emoji: '🟨 🟨🟨 🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide D', 'pt-BR': 'Pirâmide D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura um buraco escuro no meio dos blocos amarelos.',
              'pt-BR': 'Dica: procure um buraco escuro no meio dos blocos amarelos.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os blocos da maquete estão misturados. Encontra os pares iguais!',
                'pt-BR': 'Os blocos da maquete estão misturados. Encontre os pares iguais!',
              },
              emojis: ['🟨', '🟥', '🟦', '🟩'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟨 · 🟨🟨 · 🟨🟨🟨',
              pergunta: {
                'pt-PT': 'A pirâmide tem 3 blocos em baixo, 2 no meio e 1 em cima. Quantos blocos tem ao todo?',
                'pt-BR': 'A pirâmide tem 3 blocos embaixo, 2 no meio e 1 em cima. Quantos blocos ela tem ao todo?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa nos 3 de baixo e junta os do meio e o de cima.',
              'pt-BR': 'Dica: comece nos 3 de baixo e junte os do meio e o de cima.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Constrói a pirâmide de baixo para cima: primeiro a fila maior, por último o bloco do topo.',
                'pt-BR': 'Construa a pirâmide de baixo para cima: primeiro a fila maior, por último o bloco do topo.',
              },
              itens: ['🟨🟨🟨🟨', '🟨🟨🟨', '🟨🟨', '🟨'],
            },
            dica: {
              'pt-PT': 'Dica: a fila de baixo tem 4 blocos. Cada fila por cima tem menos um.',
              'pt-BR': 'Dica: a fila de baixo tem 4 blocos. Cada fila de cima tem um a menos.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas pirâmides tem mais blocos?',
                'pt-BR': 'Qual destas pirâmides tem mais blocos?',
              },
              opcoes: [
                { emoji: '🟨 🟨🟨', nome: { 'pt-PT': 'Pirâmide A', 'pt-BR': 'Pirâmide A' } },
                { emoji: '🟨 🟨🟨 🟨🟨🟨 🟨🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide B', 'pt-BR': 'Pirâmide B' } },
                { emoji: '🟨 🟨🟨 🟨🟨🟨', nome: { 'pt-PT': 'Pirâmide C', 'pt-BR': 'Pirâmide C' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a pirâmide com mais filas é a mais alta e tem mais blocos.',
              'pt-BR': 'Dica: a pirâmide com mais filas é a mais alta e tem mais blocos.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨',
              pergunta: {
                'pt-PT': 'A pirâmide tem filas de 4, 3, 2 e 1 blocos. Quantos blocos tem ao todo? Escreve o número.',
                'pt-BR': 'A pirâmide tem filas de 4, 3, 2 e 1 blocos. Quantos blocos ela tem ao todo? Digite o número.',
              },
              resposta: '10',
            },
            dica: {
              'pt-PT': 'Dica: junta as filas aos poucos: 4 mais 3 são 7. Depois junta o resto.',
              'pt-BR': 'Dica: junte as filas aos poucos: 4 mais 3 são 7. Depois junte o resto.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Constrói uma pirâmide de 5 filas, de baixo para cima.',
                'pt-BR': 'Construa uma pirâmide de 5 filas, de baixo para cima.',
              },
              itens: ['🟨🟨🟨🟨🟨', '🟨🟨🟨🟨', '🟨🟨🟨', '🟨🟨', '🟨'],
            },
            dica: {
              'pt-PT': 'Dica: a base é a fila mais comprida. Cada fila por cima tem menos um bloco.',
              'pt-BR': 'Dica: a base é a fila mais comprida. Cada fila de cima tem um bloco a menos.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟨 · 🟨🟨 · 🟨🟨🟨 · 🟨🟨🟨🟨',
              pergunta: {
                'pt-PT': 'A pirâmide de 4 filas perdeu o bloco do topo e um bloco da base. Quantos blocos tem agora?',
                'pt-BR': 'A pirâmide de 4 filas perdeu o bloco do topo e um bloco da base. Quantos blocos ela tem agora?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: primeiro conta todos os blocos. Depois tira os 2 que caíram.',
              'pt-BR': 'Dica: primeiro conte todos os blocos. Depois tire os 2 que caíram.',
            },
          },
        ],
      },
    },
    {
      id: 'tabua',
      nome: { 'pt-PT': 'Tábua de pontos', 'pt-BR': 'Tábua de pontos' },
      emoji: '🎲',
      zona: { x: 69.5, y: 80.5, largura: 12.9, altura: 19 },
      sucesso: {
        'pt-PT': 'Os pontos da tábua acenderam-se e formaram o número {n}!',
        'pt-BR': 'Os pontos da tábua se acenderam e formaram o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚂|⚁',
              pergunta: {
                'pt-PT': 'Na tábua está pintada uma peça de dominó. Quantos pontos tem a peça?',
                'pt-BR': 'Na tábua está pintada uma peça de dominó. Quantos pontos tem a peça?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta os pontos dos dois lados da peça.',
              'pt-BR': 'Dica: conte os pontos dos dois lados da peça.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas peças de dominó tem 3 pontos?',
                'pt-BR': 'Qual destas peças de dominó tem 3 pontos?',
              },
              opcoes: [
                { emoji: '⚃|⚀', nome: { 'pt-PT': 'Peça A', 'pt-BR': 'Peça A' } },
                { emoji: '⚀|　', nome: { 'pt-PT': 'Peça B', 'pt-BR': 'Peça B' } },
                { emoji: '⚁|⚀', nome: { 'pt-PT': 'Peça C', 'pt-BR': 'Peça C' } },
                { emoji: '⚂|⚂', nome: { 'pt-PT': 'Peça D', 'pt-BR': 'Peça D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: conta todos os pontos de cada peça.',
              'pt-BR': 'Dica: conte todos os pontos de cada peça.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As peças de dominó caíram da tábua. Encontra os pares iguais!',
                'pt-BR': 'As peças de dominó caíram da tábua. Encontre os pares iguais!',
              },
              emojis: ['⚀|⚁', '⚂|⚃', '⚄|⚅', '⚁|⚁'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas peças de dominó tem 6 pontos ao todo?',
                'pt-BR': 'Qual destas peças de dominó tem 6 pontos ao todo?',
              },
              opcoes: [
                { emoji: '⚂|⚁', nome: { 'pt-PT': 'Peça A', 'pt-BR': 'Peça A' } },
                { emoji: '⚃|⚂', nome: { 'pt-PT': 'Peça B', 'pt-BR': 'Peça B' } },
                { emoji: '⚃|⚁', nome: { 'pt-PT': 'Peça C', 'pt-BR': 'Peça C' } },
                { emoji: '⚀|⚀', nome: { 'pt-PT': 'Peça D', 'pt-BR': 'Peça D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: em cada peça, junta os pontos de um lado com os do outro.',
              'pt-BR': 'Dica: em cada peça, junte os pontos de um lado com os do outro.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚃|⚁',
              pergunta: {
                'pt-PT': 'A peça tem 4 pontos de um lado e 2 do outro. Quantos pontos tem ao todo?',
                'pt-BR': 'A peça tem 4 pontos de um lado e 2 do outro. Quantos pontos tem ao todo?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta mais dois: cinco, seis...',
              'pt-BR': 'Dica: comece no 4 e conte mais dois: cinco, seis...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe as peças de dominó por ordem, da que tem menos pontos à que tem mais.',
                'pt-BR': 'Coloque as peças de dominó em ordem, da que tem menos pontos à que tem mais.',
              },
              itens: ['⚀|　', '⚀|⚀', '⚁|⚀', '⚁|⚁', '⚂|⚁'],
            },
            dica: {
              'pt-PT': 'Dica: conta os pontos de cada peça. A primeira tem um só ponto.',
              'pt-BR': 'Dica: conte os pontos de cada peça. A primeira tem um ponto só.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é a peça: tem mais de 5 pontos, um dos lados está vazio e não é a de 9 pontos.',
                'pt-BR': 'Adivinhe qual é a peça: tem mais de 5 pontos, um dos lados está vazio e não é a de 9 pontos.',
              },
              opcoes: [
                { emoji: '⚄|　', nome: { 'pt-PT': 'Peça A', 'pt-BR': 'Peça A' } },
                { emoji: '⚅|⚂', nome: { 'pt-PT': 'Peça B', 'pt-BR': 'Peça B' } },
                { emoji: '⚃|⚂', nome: { 'pt-PT': 'Peça C', 'pt-BR': 'Peça C' } },
                { emoji: '⚅|　', nome: { 'pt-PT': 'Peça D', 'pt-BR': 'Peça D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira as peças que não têm nenhum lado vazio.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire as peças que não têm nenhum lado vazio.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚂|⚁   ⚀|⚂',
              pergunta: {
                'pt-PT': 'Quantos pontos têm estas duas peças juntas?',
                'pt-BR': 'Quantos pontos estas duas peças têm juntas?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: primeiro conta os pontos da primeira peça. Depois continua a contar na segunda.',
              'pt-BR': 'Dica: primeiro conte os pontos da primeira peça. Depois continue contando na segunda.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Encadeia as peças de dominó: cada peça toca a seguinte com o mesmo número. Começa na peça que começa com um ponto.',
                'pt-BR':
                  'Encadeie as peças de dominó: cada peça encosta na próxima com o mesmo número. Comece na peça que começa com um ponto.',
              },
              itens: ['⚀|⚂', '⚂|⚄', '⚄|⚁', '⚁|⚅', '⚅|⚃'],
            },
            dica: {
              'pt-PT': 'Dica: a primeira peça acaba em 3. Procura a peça que começa com 3.',
              'pt-BR': 'Dica: a primeira peça termina em 3. Procure a peça que começa com 3.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'escaravelho-dourado',
      nome: { 'pt-PT': 'Escaravelho dourado', 'pt-BR': 'Escaravelho dourado' },
      emoji: '🪲',
      zona: { x: 33.1, y: 82.1, largura: 10.6, altura: 16.7 },
      recompensa: {
        id: 'escaravelho',
        emoji: '🪲',
        nome: { 'pt-PT': 'Escaravelho-chave', 'pt-BR': 'Escaravelho-chave' },
      },
      sucesso: {
        'pt-PT': 'O escaravelho soltou-se da pedra! É a chave do sarcófago. 🪲',
        'pt-BR': 'O escaravelho se soltou da pedra! É a chave do sarcófago. 🪲',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🪲',
              pergunta: {
                'pt-PT': 'Na fechadura do sarcófago está desenhado este bicho. Qual destes é igual?',
                'pt-BR': 'Na fechadura do sarcófago está desenhado este bicho. Qual destes é igual?',
              },
              opcoes: [
                { emoji: '🐞', nome: { 'pt-PT': 'Joaninha', 'pt-BR': 'Joaninha' } },
                { emoji: '🦋', nome: { 'pt-PT': 'Borboleta', 'pt-BR': 'Borboleta' } },
                { emoji: '🪲', nome: { 'pt-PT': 'Escaravelho', 'pt-BR': 'Escaravelho' } },
                { emoji: '🐜', nome: { 'pt-PT': 'Formiga', 'pt-BR': 'Formiga' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Procura o bicho igual ao desenho de cima.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Procure o bicho igual ao desenho de cima.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪲 ⚫ ⚫ ⚫ ⚫',
              pergunta: {
                'pt-PT': 'O escaravelho tem um cadeado. Quantas pintas tem o escaravelho?',
                'pt-BR': 'O escaravelho tem um cadeado. Quantas pintas o escaravelho tem?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Conta as pintas uma a uma.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Conte as pintas uma por uma.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os escaravelhos fugiram! Encontra os pares iguais.',
                'pt-BR': 'Os escaravelhos fugiram! Encontre os pares iguais.',
              },
              emojis: ['🪲☀️', '🪲🌙', '🪲⭐', '🪲💎'],
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Vira duas cartas de cada vez e olha para o desenho ao lado do escaravelho.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Vire duas cartas de cada vez e olhe o desenho do lado do escaravelho.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️🪲☀️',
              pergunta: {
                'pt-PT': 'Este é o escaravelho da fechadura. Qual destes é igual a ele?',
                'pt-BR': 'Este é o escaravelho da fechadura. Qual destes é igual a ele?',
              },
              opcoes: [
                { emoji: '☀️🪲🌙', nome: { 'pt-PT': 'Escaravelho A', 'pt-BR': 'Escaravelho A' } },
                { emoji: '☀️🪲☀️', nome: { 'pt-PT': 'Escaravelho B', 'pt-BR': 'Escaravelho B' } },
                { emoji: '🌙🪲☀️', nome: { 'pt-PT': 'Escaravelho C', 'pt-BR': 'Escaravelho C' } },
                { emoji: '☀️🐞☀️', nome: { 'pt-PT': 'Escaravelho D', 'pt-BR': 'Escaravelho D' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Compara os desenhos um a um: só um é igual em tudo.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Compare os desenhos um por um: só um é igual em tudo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪲☀️  🪲  🪲☀️  🪲🌙  🪲☀️  🪲',
              pergunta: {
                'pt-PT': 'Quantos escaravelhos têm um sol? Não contes os outros.',
                'pt-BR': 'Quantos escaravelhos têm um sol? Não conte os outros.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Conta só os escaravelhos que têm um sol ao lado.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Conte só os escaravelhos que têm um sol do lado.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os escaravelhos fugiram! Encontra os cinco pares iguais.',
                'pt-BR': 'Os escaravelhos fugiram! Encontre os cinco pares iguais.',
              },
              emojis: ['🪲☀️', '🪲🌙', '🪲⭐', '🪲💎', '🪲🔥'],
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Vira duas cartas de cada vez e olha para o desenho ao lado do escaravelho.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Vire duas cartas de cada vez e olhe o desenho do lado do escaravelho.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️🌙🪲⭐',
              pergunta: {
                'pt-PT': 'Este é o escaravelho da fechadura. Qual destes é igual a ele? Olha bem!',
                'pt-BR': 'Este é o escaravelho da fechadura. Qual destes é igual a ele? Olhe bem!',
              },
              opcoes: [
                { emoji: '🌙☀️🪲⭐', nome: { 'pt-PT': 'Escaravelho A', 'pt-BR': 'Escaravelho A' } },
                { emoji: '☀️⭐🪲🌙', nome: { 'pt-PT': 'Escaravelho B', 'pt-BR': 'Escaravelho B' } },
                { emoji: '☀️🌙🪲🌙', nome: { 'pt-PT': 'Escaravelho C', 'pt-BR': 'Escaravelho C' } },
                { emoji: '☀️🌙🪲⭐', nome: { 'pt-PT': 'Escaravelho D', 'pt-BR': 'Escaravelho D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Compara os desenhos um a um, da esquerda para a direita.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Compare os desenhos um por um, da esquerda para a direita.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é o escaravelho-chave: tem um sol, tem mais de um desenho ao lado e não tem estrela.',
                'pt-BR': 'Adivinhe qual é o escaravelho-chave: tem um sol, tem mais de um desenho do lado e não tem estrela.',
              },
              opcoes: [
                { emoji: '🪲☀️', nome: { 'pt-PT': 'Escaravelho A', 'pt-BR': 'Escaravelho A' } },
                { emoji: '🪲☀️⭐', nome: { 'pt-PT': 'Escaravelho B', 'pt-BR': 'Escaravelho B' } },
                { emoji: '🪲🌙🌙', nome: { 'pt-PT': 'Escaravelho C', 'pt-BR': 'Escaravelho C' } },
                { emoji: '🪲☀️🌙', nome: { 'pt-PT': 'Escaravelho D', 'pt-BR': 'Escaravelho D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Vai riscando: primeiro tira o que não tem sol.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Vá riscando: primeiro tire o que não tem sol.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪲 🪲 🪲 🪲 🪲 🪲 🪲',
              pergunta: {
                'pt-PT':
                  'Numa fila de 7 escaravelhos, o escaravelho-chave é o terceiro a contar do fim. Em que lugar está, a contar do início?',
                'pt-BR':
                  'Numa fila de 7 escaravelhos, o escaravelho-chave é o terceiro contando do fim. Em que lugar ele está, contando do começo?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: o escaravelho-chave abre o sarcófago. Conta 3 a partir do fim da fila e vê que número tem esse, contando do início.',
              'pt-BR': 'Dica: o escaravelho-chave abre o sarcófago. Conte 3 a partir do fim da fila e veja que número ele tem, contando do começo.',
            },
          },
        ],
      },
    },
    {
      id: 'bau',
      nome: { 'pt-PT': 'Baú aberto', 'pt-BR': 'Baú aberto' },
      emoji: '💰',
      zona: { x: 89, y: 80.5, largura: 19.5, altura: 23.6 },
      recompensa: {
        id: 'moedas',
        emoji: '🪙',
        nome: { 'pt-PT': 'Moedas de ouro', 'pt-BR': 'Moedas de ouro' },
      },
      sucesso: {
        'pt-PT': 'Encontraste moedas de ouro no baú! Servem para a balança. 🪙',
        'pt-BR': 'Você encontrou moedas de ouro no baú! Elas servem para a balança. 🪙',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪙 🪙 🪙 🪙 🪙 🪙 🪙',
              pergunta: {
                'pt-PT': 'O baú tem um cadeado. Quantas moedas há no baú?',
                'pt-BR': 'O baú tem um cadeado. Quantas moedas tem no baú?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Conta as moedas uma a uma.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Conte as moedas uma por uma.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️',
              pergunta: {
                'pt-PT': 'No cadeado do baú está desenhado um sol. Que botão abre o baú?',
                'pt-BR': 'No cadeado do baú está desenhado um sol. Que botão abre o baú?',
              },
              opcoes: [
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '🌊', nome: { 'pt-PT': 'Onda', 'pt-BR': 'Onda' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Procura o botão igual ao desenho do cadeado.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Procure o botão igual ao desenho do cadeado.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os tesouros do baú estão misturados. Encontra os pares iguais!',
                'pt-BR': 'Os tesouros do baú estão misturados. Encontre os pares iguais!',
              },
              emojis: ['🪙', '💎', '👑', '🏺'],
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '☀️ = 1   🌙 = 2   ☀️🌙 = ❔',
              pergunta: {
                'pt-PT': 'O cadeado do baú tem um código: o sol vale 1 e a lua vale 2. Quanto vale sol e lua?',
                'pt-BR': 'O cadeado do baú tem um código: o sol vale 1 e a lua vale 2. Quanto vale sol e lua?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Junta o valor do sol com o da lua.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Junte o valor do sol com o da lua.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️🌙⭐',
              pergunta: {
                'pt-PT': 'Esta é a fila de símbolos do baú. Qual destas filas é igual?',
                'pt-BR': 'Esta é a fila de símbolos do baú. Qual destas filas é igual?',
              },
              opcoes: [
                { emoji: '⭐🌙☀️', nome: { 'pt-PT': 'Fila A', 'pt-BR': 'Fila A' } },
                { emoji: '☀️⭐🌙', nome: { 'pt-PT': 'Fila B', 'pt-BR': 'Fila B' } },
                { emoji: '☀️🌙⭐', nome: { 'pt-PT': 'Fila C', 'pt-BR': 'Fila C' } },
                { emoji: '🌙☀️⭐', nome: { 'pt-PT': 'Fila D', 'pt-BR': 'Fila D' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. A fila certa começa com o sol e acaba com a estrela.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. A fila certa começa com o sol e termina com a estrela.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os tesouros do baú estão misturados. Encontra os cinco pares iguais!',
                'pt-BR': 'Os tesouros do baú estão misturados. Encontre os cinco pares iguais!',
              },
              emojis: ['🪙', '💎', '👑', '🏺', '📿'],
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '☀️ = 1   🌙 = 2   ⭐ = 3   ⭐🌙☀️ = ❔',
              pergunta: {
                'pt-PT': 'O código do baú: o sol vale 1, a lua vale 2 e a estrela vale 3. Quanto vale estrela, lua e sol?',
                'pt-BR': 'O código do baú: o sol vale 1, a lua vale 2 e a estrela vale 3. Quanto vale estrela, lua e sol?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Junta os valores um a um: 3, mais 2, mais 1.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Junte os valores um por um: 3, mais 2, mais 1.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️ = 1   🌙 = 2   ⭐ = 3',
              pergunta: {
                'pt-PT': 'Com o mesmo código, que fila vale 9?',
                'pt-BR': 'Com o mesmo código, que fila vale 9?',
              },
              opcoes: [
                { emoji: '⭐⭐🌙', nome: { 'pt-PT': 'Fila A', 'pt-BR': 'Fila A' } },
                { emoji: '☀️🌙⭐', nome: { 'pt-PT': 'Fila B', 'pt-BR': 'Fila B' } },
                { emoji: '🌙🌙🌙', nome: { 'pt-PT': 'Fila C', 'pt-BR': 'Fila C' } },
                { emoji: '⭐⭐⭐', nome: { 'pt-PT': 'Fila D', 'pt-BR': 'Fila D' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Calcula quanto vale cada fila. Três estrelas são 3 mais 3 mais 3.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Calcule quanto vale cada fila. Três estrelas são 3 mais 3 mais 3.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '☀️ = 1   🌙 = 2   ⭐ = 3',
              pergunta: {
                'pt-PT': 'Com o mesmo código, põe os grupos por ordem, do que vale menos ao que vale mais.',
                'pt-BR': 'Com o mesmo código, coloque os grupos em ordem, do que vale menos ao que vale mais.',
              },
              itens: ['☀️', '☀️🌙', '⭐🌙', '⭐⭐☀️', '⭐⭐⭐'],
            },
            dica: {
              'pt-PT': 'Dica: as moedas do baú servem para a balança. Calcula primeiro quanto vale cada grupo.',
              'pt-BR': 'Dica: as moedas do baú servem para a balança. Calcule primeiro quanto vale cada grupo.',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta de pedra', 'pt-BR': 'Porta de pedra' },
    emoji: '🚪',
    zona: { x: 47.5, y: 36.6, largura: 28.7, altura: 58.5 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa da câmara que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa da câmara que esconde um número. Digite os números na ordem dos desenhos.',
    },
    dicaVer: {
      'pt-PT': 'Dica: toca na porta de pedra para ver o cadeado. Os desenhos mostram onde estão os números.',
      'pt-BR': 'Dica: toque na porta de pedra para ver o cadeado. Os desenhos mostram onde estão os números.',
    },
    dica: {
      'pt-PT': 'Dica: já tens todos os números! Escreve-os no cadeado pela ordem dos desenhos.',
      'pt-BR': 'Dica: você já tem todos os números! Digite no cadeado na ordem dos desenhos.',
    },
  },
  vitoria: {
    'pt-PT':
      'Clique! O sol da porta brilhou e a pedra deslizou devagarinho. Saíste da pirâmide e o gato preto esperava-te lá fora. Que aventura!',
    'pt-BR':
      'Clique! O sol da porta brilhou e a pedra deslizou devagarinho. Você saiu da pirâmide e o gato preto esperava você lá fora. Que aventura!',
  },
};
