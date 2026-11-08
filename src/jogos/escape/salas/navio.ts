import type { Sala } from '../tipos';

/**
 * O Navio Pirata. A saída é sempre a porta do camarote do capitão; o código (3 ou 4 números) sai de objetos
 * sorteados entre os 9 abaixo, cada um com várias versões do enigma. Há dois extras: a garrafa com mensagem
 * esconde a chave do baú do tesouro e o canhão tem a corda que puxa a âncora.
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: direções e pontos cardeais, mapas
 * com casas, partilhar (dividir) e flutua ou afunda.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/navio.jpg); para conferir, abra a sala com ?zonas.
 */
export const navio: Sala = {
  id: 'navio',
  emoji: '🏴‍☠️',
  cor: '#e8833a',
  titulo: { 'pt-PT': 'O Navio Pirata', 'pt-BR': 'O Navio Pirata' },
  resumo: {
    'pt-PT': 'Uma onda trancou a porta do camarote do capitão. Descobre o código!',
    'pt-BR': 'Uma onda trancou a porta do camarote do capitão. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Entraste no camarote do capitão para ver o mapa do tesouro. De repente, uma onda abanou o navio e a porta trancou-se! Na porta há um cadeado com desenhos de coisas do camarote. Cada uma dessas coisas esconde um número. Descobre os números e abre a porta!',
    'pt-BR':
      'Você entrou no camarote do capitão para ver o mapa do tesouro. De repente, uma onda balançou o navio e a porta se trancou! Na porta há um cadeado com desenhos de coisas do camarote. Cada uma dessas coisas esconde um número. Descubra os números e abra a porta!',
  },
  fundo: 'imagens/saida-secreta/navio.jpg',
  fundoCss: 'linear-gradient(180deg, #5a3a1e 0%, #7a4f28 60%, #a0703c 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da porta do camarote!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da porta do camarote!',
  },
  fontes: [
    {
      id: 'leme',
      nome: { 'pt-PT': 'Leme', 'pt-BR': 'Leme' },
      emoji: '☸️',
      zona: { x: 7.8, y: 38.5, largura: 15.6, altura: 61.3 },
      sucesso: {
        'pt-PT': 'O leme rodou e mostrou o número {n}!',
        'pt-BR': 'O leme girou e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '☸️ ⬅️',
              pergunta: {
                'pt-PT': 'O capitão rodou o leme para a esquerda. Para onde vai o barco?',
                'pt-BR': 'O capitão girou o leme para a esquerda. Para onde vai o barco?',
              },
              opcoes: [
                { emoji: '➡️', nome: { 'pt-PT': 'Para a direita', 'pt-BR': 'Para a direita' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Para a esquerda', 'pt-BR': 'Para a esquerda' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Em frente', 'pt-BR': 'Em frente' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o barco vai para o mesmo lado para onde o leme roda.',
              'pt-BR': 'Dica: o barco vai para o mesmo lado para onde o leme gira.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '☸️',
              pergunta: {
                'pt-PT': 'O leme tem punhos à volta para o capitão o agarrar. Quantos punhos tem? Escreve o número.',
                'pt-BR': 'O leme tem pegadores em volta para o capitão segurar. Quantos pegadores ele tem? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: começa no punho de cima e conta à volta do leme, um a um, até voltares ao início.',
              'pt-BR': 'Dica: comece no pegador de cima e conte em volta do leme, um por um, até voltar ao início.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '⬆️ ➡️ ⬇️ ⬅️',
              pergunta: {
                'pt-PT': 'No convés está desenhado o caminho do barco. Copia as setas pela mesma ordem.',
                'pt-BR': 'No convés está desenhado o caminho do barco. Copie as setas na mesma ordem.',
              },
              itens: ['⬆️', '➡️', '⬇️', '⬅️'],
            },
            dica: {
              'pt-PT': 'Dica: olha para o desenho lá em cima. A primeira seta aponta para cima.',
              'pt-BR': 'Dica: olhe o desenho lá em cima. A primeira seta aponta para cima.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⬆️',
              pergunta: {
                'pt-PT': 'O barco ia para norte e o capitão virou para a direita. Para onde vai agora?',
                'pt-BR': 'O barco ia para o norte e o capitão virou para a direita. Para onde ele vai agora?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: no mapa, o norte fica em cima. Virar à direita de quem sobe é ir para o lado direito.',
              'pt-BR': 'Dica: no mapa, o norte fica em cima. Virar à direita de quem sobe é ir para o lado direito.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🧭',
              pergunta: {
                'pt-PT': 'O capitão dá as ordens: norte, este, sul, oeste e, no fim, lançar a âncora! Toca nas setas por essa ordem.',
                'pt-BR': 'O capitão dá as ordens: norte, leste, sul, oeste e, no fim, jogar a âncora! Toque nas setas nessa ordem.',
              },
              itens: ['⬆️', '➡️', '⬇️', '⬅️', '⚓'],
            },
            dica: {
              'pt-PT': 'Dica: o norte é para cima e o sul para baixo. O este fica à direita e o oeste à esquerda.',
              'pt-BR': 'Dica: o norte é para cima e o sul para baixo. O leste fica à direita e o oeste à esquerda.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '☸️',
              pergunta: {
                'pt-PT': 'O leme tem 8 punhos e 3 estão partidos. Quantos punhos estão bons?',
                'pt-BR': 'O leme tem 8 pegadores e 3 estão quebrados. Quantos pegadores estão bons?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 8 e conta 3 para trás: 7, 6...',
              'pt-BR': 'Dica: comece no 8 e conte 3 para trás: 7, 6...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⬆️ 🔄',
              pergunta: {
                'pt-PT': 'O barco ia para norte e o capitão rodou o leme até dar meia volta. Para onde vai agora?',
                'pt-BR': 'O barco ia para o norte e o capitão girou o leme até dar meia volta. Para onde ele vai agora?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: meia volta é virar para o lado contrário. Qual é o contrário do norte?',
              'pt-BR': 'Dica: meia volta é virar para o lado contrário. Qual é o contrário do norte?',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🧭',
              pergunta: {
                'pt-PT': 'O capitão escreveu o caminho: primeiro oeste, depois norte, depois este, depois sul. Põe as setas por ordem.',
                'pt-BR': 'O capitão escreveu o caminho: primeiro oeste, depois norte, depois leste, depois sul. Coloque as setas em ordem.',
              },
              itens: ['⬅️', '⬆️', '➡️', '⬇️'],
            },
            dica: {
              'pt-PT': 'Dica: olha para a rosa dos ventos. O oeste fica à esquerda, por isso a primeira seta aponta para a esquerda.',
              'pt-BR': 'Dica: olhe a rosa dos ventos. O oeste fica à esquerda, então a primeira seta aponta para a esquerda.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌬️ 🚩',
              pergunta: {
                'pt-PT': 'O vento sopra do norte. Para onde vai a bandeira do mastro?',
                'pt-BR': 'O vento sopra do norte. Para onde vai a bandeira do mastro?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o vento empurra a bandeira para longe do sítio de onde vem.',
              'pt-BR': 'Dica: o vento empurra a bandeira para longe do lugar de onde vem.',
            },
          },
        ],
      },
    },
    {
      id: 'mapa',
      nome: { 'pt-PT': 'Mapa do tesouro', 'pt-BR': 'Mapa do tesouro' },
      emoji: '🗺️',
      zona: { x: 26.7, y: 17.3, largura: 19.1, altura: 22.1 },
      sucesso: {
        'pt-PT': 'No canto do mapa estava escrito o número {n}!',
        'pt-BR': 'No canto do mapa estava escrito o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌴 🌴 🌴 🌴 🌴',
              pergunta: {
                'pt-PT': 'Quantas palmeiras há no mapa? Escreve o número.',
                'pt-BR': 'Quantas palmeiras tem no mapa? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as palmeiras uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as palmeiras uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🗺️ ❌',
              pergunta: {
                'pt-PT': 'O mapa diz: «O tesouro está ao pé da palmeira.» Em que sítio pões o ❌?',
                'pt-BR': 'O mapa diz: "O tesouro está perto da palmeira." Em que lugar você coloca o ❌?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Rocha', 'pt-BR': 'Pedra' } },
                { emoji: '🛖', nome: { 'pt-PT': 'Cabana', 'pt-BR': 'Cabana' } },
                { emoji: '🌴', nome: { 'pt-PT': 'Palmeira', 'pt-BR': 'Palmeira' } },
                { emoji: '⛰️', nome: { 'pt-PT': 'Monte', 'pt-BR': 'Morro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura a árvore alta com folhas grandes, das ilhas.',
              'pt-BR': 'Dica: procure a árvore alta com folhas grandes, das ilhas.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌋 ⛵ 👣 👣 👣 ➡️ 🏝️',
              pergunta: {
                'pt-PT': 'Segue as pegadas do pirata. A que ilha chegam?',
                'pt-BR': 'Siga as pegadas do pirata. A que ilha elas chegam?',
              },
              opcoes: [
                { emoji: '🌋', nome: { 'pt-PT': 'Ilha do vulcão', 'pt-BR': 'Ilha do vulcão' } },
                { emoji: '🏝️', nome: { 'pt-PT': 'Ilha da palmeira', 'pt-BR': 'Ilha da palmeira' } },
                { emoji: '🏔️', nome: { 'pt-PT': 'Ilha da montanha', 'pt-BR': 'Ilha da montanha' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo nas pegadas e anda para onde a seta aponta.',
              'pt-BR': 'Dica: coloque o dedo nas pegadas e ande para onde a seta aponta.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌴 🪨 🛖 🦀',
              pergunta: {
                'pt-PT': 'O mapa tem uma fila de casas. Partes da palmeira e andas 2 casas para a direita. Onde chegas?',
                'pt-BR': 'O mapa tem uma fileira de casas. Você sai da palmeira e anda 2 casas para a direita. Onde você chega?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Rocha', 'pt-BR': 'Pedra' } },
                { emoji: '🛖', nome: { 'pt-PT': 'Cabana', 'pt-BR': 'Cabana' } },
                { emoji: '🦀', nome: { 'pt-PT': 'Caranguejo', 'pt-BR': 'Caranguejo' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo na palmeira e salta uma casa de cada vez: um, dois.',
              'pt-BR': 'Dica: coloque o dedo na palmeira e pule uma casa de cada vez: um, dois.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⬜ ⬜ ❌ ⬜',
              pergunta: {
                'pt-PT': 'As colunas do mapa contam-se da esquerda para a direita. Em que coluna está o ❌?',
                'pt-BR': 'As colunas do mapa são contadas da esquerda para a direita. Em que coluna está o ❌?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: começa na casa da esquerda, que é a coluna 1, e conta até ao ❌.',
              'pt-BR': 'Dica: comece na casa da esquerda, que é a coluna 1, e conte até o ❌.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☠️',
              pergunta: {
                'pt-PT': 'O mapa diz: «O tesouro está a norte da caveira.» Para que lado da caveira tens de ir?',
                'pt-BR': 'O mapa diz: "O tesouro está ao norte da caveira." Para que lado da caveira você tem que ir?',
              },
              opcoes: [
                { emoji: '⬇️', nome: { 'pt-PT': 'Para baixo', 'pt-BR': 'Para baixo' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Para a esquerda', 'pt-BR': 'Para a esquerda' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Para cima', 'pt-BR': 'Para cima' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Para a direita', 'pt-BR': 'Para a direita' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: nos mapas, o norte fica sempre em cima.',
              'pt-BR': 'Dica: nos mapas, o norte fica sempre em cima.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌴 ⬜ ⬜ ⬜ ⬜ ⬜ ⬜',
              pergunta: {
                'pt-PT': 'Partes da palmeira, andas 5 casas para este e depois 2 casas para oeste. A quantas casas da palmeira ficas?',
                'pt-BR': 'Você sai da palmeira, anda 5 casas para o leste e depois 2 casas para o oeste. A quantas casas da palmeira você fica?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: o este é para a direita e o oeste para a esquerda. Anda 5 para a frente e depois volta 2.',
              'pt-BR': 'Dica: o leste é para a direita e o oeste para a esquerda. Ande 5 para a frente e depois volte 2.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌴 🧭',
              pergunta: {
                'pt-PT': 'Partindo da palmeira, andas 2 casas para este e 1 casa para sul. Que setas mostram esse caminho?',
                'pt-BR': 'Saindo da palmeira, você anda 2 casas para o leste e 1 casa para o sul. Que setas mostram esse caminho?',
              },
              opcoes: [
                { emoji: '⬅️⬅️⬇️', nome: { 'pt-PT': 'Esquerda, esquerda, baixo', 'pt-BR': 'Esquerda, esquerda, baixo' } },
                { emoji: '➡️⬇️⬇️', nome: { 'pt-PT': 'Direita, baixo, baixo', 'pt-BR': 'Direita, baixo, baixo' } },
                { emoji: '⬆️➡️➡️', nome: { 'pt-PT': 'Cima, direita, direita', 'pt-BR': 'Cima, direita, direita' } },
                { emoji: '➡️➡️⬇️', nome: { 'pt-PT': 'Direita, direita, baixo', 'pt-BR': 'Direita, direita, baixo' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o este fica à direita e o sul fica em baixo. Conta quantas setas de cada há.',
              'pt-BR': 'Dica: o leste fica à direita e o sul fica embaixo. Conte quantas setas de cada tem.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌴 ⬆️⬆️⬆️ ➡️➡️ 💰',
              pergunta: {
                'pt-PT': 'O tesouro está 3 casas a norte e 2 casas a este da palmeira. Quantas casas andas ao todo?',
                'pt-BR': 'O tesouro está 3 casas ao norte e 2 casas a leste da palmeira. Quantas casas você anda ao todo?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: junta as casas do norte com as casas do este.',
              'pt-BR': 'Dica: junte as casas do norte com as casas do leste.',
            },
          },
        ],
      },
    },
    {
      id: 'luneta',
      nome: { 'pt-PT': 'Luneta', 'pt-BR': 'Luneta' },
      emoji: '🔭',
      zona: { x: 25.8, y: 49.4, largura: 19.1, altura: 37.9 },
      sucesso: {
        'pt-PT': 'Pela luneta viste uma bandeira com o número {n}!',
        'pt-BR': 'Pela luneta você viu uma bandeira com o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔭 🌊',
              pergunta: {
                'pt-PT': 'Olha pela luneta! Que animal se vê no mar?',
                'pt-BR': 'Olhe pela luneta! Que animal dá para ver no mar?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🦒', nome: { 'pt-PT': 'Girafa', 'pt-BR': 'Girafa' } },
                { emoji: '🐳', nome: { 'pt-PT': 'Baleia', 'pt-BR': 'Baleia' } },
                { emoji: '🐘', nome: { 'pt-PT': 'Elefante', 'pt-BR': 'Elefante' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: qual destes animais sabe nadar e vive no mar?',
              'pt-BR': 'Dica: qual destes animais sabe nadar e vive no mar?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⛵ ⛵ ⛵ ⛵',
              pergunta: {
                'pt-PT': 'Quantos barcos se veem pela luneta? Escreve o número.',
                'pt-BR': 'Quantos barcos dá para ver pela luneta? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta os barcos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os barcos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🏴‍☠️',
              pergunta: {
                'pt-PT': 'A nossa bandeira é esta. Qual barco tem uma bandeira igual à nossa?',
                'pt-BR': 'A nossa bandeira é esta. Qual barco tem uma bandeira igual à nossa?',
              },
              opcoes: [
                { emoji: '🏳️', nome: { 'pt-PT': 'Bandeira branca', 'pt-BR': 'Bandeira branca' } },
                { emoji: '🏁', nome: { 'pt-PT': 'Bandeira aos quadrados', 'pt-BR': 'Bandeira quadriculada' } },
                { emoji: '🚩', nome: { 'pt-PT': 'Bandeira vermelha', 'pt-BR': 'Bandeira vermelha' } },
                { emoji: '🏴‍☠️', nome: { 'pt-PT': 'Bandeira de pirata', 'pt-BR': 'Bandeira de pirata' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a nossa bandeira é preta e tem uma caveira.',
              'pt-BR': 'Dica: a nossa bandeira é preta e tem uma caveira.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔭',
              pergunta: {
                'pt-PT': 'Pela luneta vês três barcos iguais. Qual deles está mais longe?',
                'pt-BR': 'Pela luneta você vê três barcos iguais. Qual deles está mais longe?',
              },
              opcoes: [
                { emoji: '⛵', nome: { 'pt-PT': 'O que parece grande', 'pt-BR': 'O que parece grande' } },
                { emoji: '⛵', nome: { 'pt-PT': 'O que parece mais pequeno', 'pt-BR': 'O que parece menor' } },
                { emoji: '⛵', nome: { 'pt-PT': 'O que parece médio', 'pt-BR': 'O que parece médio' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: quanto mais longe está uma coisa, mais pequena ela parece.',
              'pt-BR': 'Dica: quanto mais longe está uma coisa, menor ela parece.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⛵🚩 ⛵🏳️ ⛵🚩 ⛵🏴 ⛵🚩 ⛵🏳️',
              pergunta: {
                'pt-PT': 'Quantos barcos têm bandeira vermelha? Não contes os outros.',
                'pt-BR': 'Quantos barcos têm bandeira vermelha? Não conte os outros.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: olha só para as bandeiras vermelhas e conta-as.',
              'pt-BR': 'Dica: olhe só as bandeiras vermelhas e conte.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐬 🏝️ ⛵',
              pergunta: {
                'pt-PT': 'O que está à esquerda da ilha?',
                'pt-BR': 'O que está à esquerda da ilha?',
              },
              opcoes: [
                { emoji: '⛵', nome: { 'pt-PT': 'Barco', 'pt-BR': 'Barco' } },
                { emoji: '🐬', nome: { 'pt-PT': 'Golfinho', 'pt-BR': 'Golfinho' } },
                { emoji: '🐙', nome: { 'pt-PT': 'Polvo', 'pt-BR': 'Polvo' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo na ilha e olha para o lado onde começas a ler.',
              'pt-BR': 'Dica: coloque o dedo na ilha e olhe para o lado onde você começa a ler.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🚩 = ⚠️',
              pergunta: {
                'pt-PT': 'Bandeira vermelha quer dizer «perigo». Que barco está a pedir ajuda? O que tem bandeira vermelha e não tem velas.',
                'pt-BR': 'Bandeira vermelha quer dizer "perigo". Que barco está pedindo ajuda? O que tem bandeira vermelha e não tem velas.',
              },
              opcoes: [
                { emoji: '⛵🚩', nome: { 'pt-PT': 'Veleiro com bandeira vermelha', 'pt-BR': 'Veleiro com bandeira vermelha' } },
                { emoji: '🛶🏳️', nome: { 'pt-PT': 'Canoa com bandeira branca', 'pt-BR': 'Canoa com bandeira branca' } },
                { emoji: '🛶🚩', nome: { 'pt-PT': 'Canoa com bandeira vermelha', 'pt-BR': 'Canoa com bandeira vermelha' } },
                { emoji: '⛵🏴‍☠️', nome: { 'pt-PT': 'Veleiro pirata', 'pt-BR': 'Veleiro pirata' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: primeiro risca os barcos sem bandeira vermelha. Depois vê qual dos que ficam não tem velas.',
              'pt-BR': 'Dica: primeiro risque os barcos sem bandeira vermelha. Depois veja qual dos que sobram não tem velas.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🏴‍☠️ 🏳️ 🚩 🏴‍☠️ 🏳️ 🚩 🏳️ 🚩',
              pergunta: {
                'pt-PT': 'Cada bandeira é um barco. Quantos barcos não têm bandeira de pirata?',
                'pt-BR': 'Cada bandeira é um barco. Quantos barcos não têm bandeira de pirata?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta todas as bandeiras e depois tira as de pirata, as pretas com caveira.',
              'pt-BR': 'Dica: conte todas as bandeiras e depois tire as de pirata, as pretas com caveira.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⛵',
              pergunta: {
                'pt-PT': 'Estamos virados para norte e há um barco a oeste. De que lado o vemos?',
                'pt-BR': 'Estamos virados para o norte e tem um barco a oeste. De que lado a gente vê o barco?',
              },
              opcoes: [
                { emoji: '➡️', nome: { 'pt-PT': 'À direita', 'pt-BR': 'À direita' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'À esquerda', 'pt-BR': 'À esquerda' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'À frente', 'pt-BR': 'Na frente' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Atrás', 'pt-BR': 'Atrás' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: olha para a rosa dos ventos com o norte em cima. De que lado fica o oeste?',
              'pt-BR': 'Dica: olhe a rosa dos ventos com o norte em cima. De que lado fica o oeste?',
            },
          },
        ],
      },
    },
    {
      id: 'vigia',
      nome: { 'pt-PT': 'Vigia', 'pt-BR': 'Vigia' },
      emoji: '🪟',
      zona: { x: 67.6, y: 15, largura: 14.7, altura: 20 },
      sucesso: {
        'pt-PT': 'Um peixe passou na vigia com o número {n}!',
        'pt-BR': 'Um peixe passou na vigia com o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐟 🐠 🐟 🐠 🐟 🐠',
              pergunta: {
                'pt-PT': 'Quantos peixes passam pela vigia? Escreve o número.',
                'pt-BR': 'Quantos peixes passam pela vigia? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os peixes um a um, de todas as cores.',
              'pt-BR': 'Dica: conte os peixes um por um, de todas as cores.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐦 ☁️',
              pergunta: {
                'pt-PT': 'Pela vigia vês uma gaivota e uma nuvem. A gaivota está de que lado da nuvem?',
                'pt-BR': 'Pela vigia você vê uma gaivota e uma nuvem. A gaivota está de que lado da nuvem?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'À esquerda', 'pt-BR': 'À esquerda' } },
                { emoji: '➡️', nome: { 'pt-PT': 'À direita', 'pt-BR': 'À direita' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo na nuvem. A gaivota está do lado onde começas a ler?',
              'pt-BR': 'Dica: coloque o dedo na nuvem. A gaivota está do lado onde você começa a ler?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Pela vigia passam peixes e conchas. Encontra os pares iguais!',
                'pt-BR': 'Pela vigia passam peixes e conchas. Encontre os pares iguais!',
              },
              emojis: ['🐟', '🐠', '🐚', '🐡'],
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
                'pt-PT': 'Qual destes desenhos mostra a ilha à direita do navio?',
                'pt-BR': 'Qual destes desenhos mostra a ilha à direita do navio?',
              },
              opcoes: [
                { emoji: '🏝️⛵', nome: { 'pt-PT': 'Desenho A', 'pt-BR': 'Desenho A' } },
                { emoji: '⛵🐳', nome: { 'pt-PT': 'Desenho B', 'pt-BR': 'Desenho B' } },
                { emoji: '⛵🏝️', nome: { 'pt-PT': 'Desenho C', 'pt-BR': 'Desenho C' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo no navio de cada desenho e vê se a ilha está do lado da tua mão direita.',
              'pt-BR': 'Dica: coloque o dedo no navio de cada desenho e veja se a ilha está do lado da sua mão direita.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐟 🐟 🐟 🐟 🐟 🐟 🐟',
              pergunta: {
                'pt-PT': 'Passavam 7 peixes na vigia e 3 nadaram para a esquerda. Quantos ficaram à direita?',
                'pt-BR': 'Passavam 7 peixes na vigia e 3 nadaram para a esquerda. Quantos ficaram à direita?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: tapa 3 peixes com o dedo e conta os que sobram.',
              'pt-BR': 'Dica: cubra 3 peixes com o dedo e conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O mar está cheio de bichos! Encontra os cinco pares iguais.',
                'pt-BR': 'O mar está cheio de bichos! Encontre os cinco pares iguais.',
              },
              emojis: ['🐟', '🐠', '🐚', '🦀', '🐬'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🏝️ ⛵ 🔄',
              pergunta: {
                'pt-PT': 'A ilha está do lado esquerdo do navio. O navio dá meia volta. De que lado fica agora a ilha?',
                'pt-BR': 'A ilha está do lado esquerdo do navio. O navio dá meia volta. De que lado fica a ilha agora?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'À esquerda', 'pt-BR': 'À esquerda' } },
                { emoji: '➡️', nome: { 'pt-PT': 'À direita', 'pt-BR': 'À direita' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: experimenta tu: põe um brinquedo à tua esquerda e vira-te para trás. Onde ficou?',
              'pt-BR': 'Dica: experimente: coloque um brinquedo à sua esquerda e vire para trás. Onde ele ficou?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '⛵ ➡️',
              pergunta: {
                'pt-PT': 'O farol está atrás do navio e o navio anda sempre para a frente. Pela vigia, o farol parece cada vez...',
                'pt-BR': 'O farol está atrás do navio e o navio anda sempre para a frente. Pela vigia, o farol parece cada vez...',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Maior', 'pt-BR': 'Maior' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Mais pequeno', 'pt-BR': 'Menor' } },
                { emoji: '⏸️', nome: { 'pt-PT': 'Igual', 'pt-BR': 'Igual' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o navio está a afastar-se do farol. As coisas que estão longe parecem grandes ou pequenas?',
              'pt-BR': 'Dica: o navio está se afastando do farol. As coisas que estão longe parecem grandes ou pequenas?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐟🐟🐟 🐠🐠🐠 🐡',
              pergunta: {
                'pt-PT': 'Pela vigia passaram 2 grupos de 3 peixes e depois mais 1 peixe. Quantos peixes passaram?',
                'pt-BR': 'Pela vigia passaram 2 grupos de 3 peixes e depois mais 1 peixe. Quantos peixes passaram?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: primeiro junta os dois grupos (3 mais 3). Depois junta o peixe que veio sozinho.',
              'pt-BR': 'Dica: primeiro junte os dois grupos (3 mais 3). Depois junte o peixe que veio sozinho.',
            },
          },
        ],
      },
    },
    {
      id: 'papagaio',
      nome: { 'pt-PT': 'Papagaio na gaiola', 'pt-BR': 'Papagaio na gaiola' },
      emoji: '🦜',
      zona: { x: 72.2, y: 38.5, largura: 11.3, altura: 27.1 },
      sucesso: {
        'pt-PT': 'O papagaio abriu o bico e disse o número {n}!',
        'pt-BR': 'O papagaio abriu o bico e disse o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦜',
              pergunta: {
                'pt-PT': 'O papagaio só come fruta. O que lhe dás?',
                'pt-BR': 'O papagaio só come fruta. O que você dá para ele?',
              },
              opcoes: [
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
                { emoji: '🔑', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: qual destas coisas se pode comer?',
              'pt-BR': 'Dica: qual destas coisas dá para comer?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O papagaio espalhou as coisas dele. Encontra os pares iguais!',
                'pt-BR': 'O papagaio espalhou as coisas dele. Encontre os pares iguais!',
              },
              emojis: ['🦜', '🪶', '🍌', '🥜'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪶 🪶 🪶 🪶 🪶',
              pergunta: {
                'pt-PT': 'Quantas penas tem a cauda do papagaio? Escreve o número.',
                'pt-BR': 'Quantas penas tem o rabo do papagaio? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as penas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as penas uma por uma, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦜 ⬆️',
              pergunta: {
                'pt-PT': 'O papagaio diz sempre o contrário. Ouviu «em cima». O que diz ele?',
                'pt-BR': 'O papagaio sempre diz o contrário. Ele ouviu "em cima". O que ele diz?',
              },
              opcoes: [
                { emoji: '⬇️', nome: { 'pt-PT': 'Em baixo', 'pt-BR': 'Embaixo' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Em cima', 'pt-BR': 'Em cima' } },
                { emoji: '➡️', nome: { 'pt-PT': 'À direita', 'pt-BR': 'À direita' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: o contrário é o lado oposto. Se o céu está em cima, onde está o chão?',
              'pt-BR': 'Dica: o contrário é o lado oposto. Se o céu está em cima, onde está o chão?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦜 🌰🌰🌰🌰🌰🌰 🦜',
              pergunta: {
                'pt-PT': 'O papagaio tem 6 sementes e reparte com o amigo, para cada um ficar com o mesmo. Com quantas fica cada um?',
                'pt-BR': 'O papagaio tem 6 sementes e divide com o amigo, para cada um ficar com o mesmo tanto. Com quantas fica cada um?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: dá uma semente a cada papagaio, uma de cada vez, até acabarem.',
              'pt-BR': 'Dica: dê uma semente para cada papagaio, uma de cada vez, até acabarem.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦜 ⬅️',
              pergunta: {
                'pt-PT': 'O papagaio diz sempre o contrário. Ouviu «esquerda». O que diz ele?',
                'pt-BR': 'O papagaio sempre diz o contrário. Ele ouviu "esquerda". O que ele diz?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Em cima', 'pt-BR': 'Em cima' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Esquerda', 'pt-BR': 'Esquerda' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Direita', 'pt-BR': 'Direita' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: levanta as duas mãos. Uma é a esquerda; como se chama a outra?',
              'pt-BR': 'Dica: levante as duas mãos. Uma é a esquerda; como se chama a outra?',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              visual: '🦜 💬',
              pergunta: {
                'pt-PT': 'O papagaio baralhou uma palavra do navio: «ro · nhei · ma · ri». Põe as sílabas por ordem para formar «marinheiro».',
                'pt-BR': 'O papagaio embaralhou uma palavra do navio: "ro · nhei · ma · ri". Coloque as sílabas em ordem para formar "marinheiro".',
              },
              itens: ['ma', 'ri', 'nhei', 'ro'],
            },
            dica: {
              'pt-PT': 'Dica: diz «marinheiro» devagar e bate palmas em cada bocadinho. O primeiro é «ma».',
              'pt-BR': 'Dica: fale "marinheiro" devagar e bata palmas em cada pedacinho. O primeiro é "ma".',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦜 🧭',
              pergunta: {
                'pt-PT': 'O papagaio diz sempre o contrário. Disse: «O tesouro está a norte!» Onde está o tesouro?',
                'pt-BR': 'O papagaio sempre diz o contrário. Ele disse: "O tesouro está ao norte!" Onde está o tesouro?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o papagaio engana sempre. Procura o lado oposto ao norte na rosa dos ventos.',
              'pt-BR': 'Dica: o papagaio sempre engana. Procure o lado oposto ao norte na rosa dos ventos.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍪🍪🍪🍪🍪🍪🍪🍪🍪 🦜🦜🦜',
              pergunta: {
                'pt-PT': 'Há 9 bolachas para 3 papagaios, e todos ficam com o mesmo. Quantas bolachas recebe cada papagaio?',
                'pt-BR': 'Tem 9 biscoitos para 3 papagaios, e todos ficam com o mesmo tanto. Quantos biscoitos cada papagaio ganha?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: dá uma bolacha a cada papagaio, à vez, até não sobrar nenhuma.',
              'pt-BR': 'Dica: dê um biscoito para cada papagaio, um de cada vez, até não sobrar nenhum.',
            },
          },
        ],
      },
    },
    {
      id: 'bussola',
      nome: { 'pt-PT': 'Bússola e globo', 'pt-BR': 'Bússola e globo' },
      emoji: '🧭',
      zona: { x: 89.8, y: 35.2, largura: 13.4, altura: 43.8 },
      sucesso: {
        'pt-PT': 'A agulha da bússola parou no número {n}!',
        'pt-BR': 'A agulha da bússola parou no número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O capitão precisa da bússola para não se perder. Qual é a bússola?',
                'pt-BR': 'O capitão precisa da bússola para não se perder. Qual é a bússola?',
              },
              opcoes: [
                { emoji: '⏰', nome: { 'pt-PT': 'Despertador', 'pt-BR': 'Despertador' } },
                { emoji: '🍪', nome: { 'pt-PT': 'Bolacha', 'pt-BR': 'Biscoito' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
                { emoji: '🧭', nome: { 'pt-PT': 'Bússola', 'pt-BR': 'Bússola' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a bússola é redonda e tem uma agulha que aponta para o norte.',
              'pt-BR': 'Dica: a bússola é redonda e tem uma agulha que aponta para o norte.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas do capitão estão misturadas. Encontra os pares iguais!',
                'pt-BR': 'As coisas do capitão estão misturadas. Encontre os pares iguais!',
              },
              emojis: ['🧭', '🌍', '⚓', '🦜'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧭',
              pergunta: {
                'pt-PT': 'A rosa dos ventos aponta para o norte, o sul, o este e o oeste. Quantas pontas tem?',
                'pt-BR': 'A rosa dos ventos aponta para o norte, o sul, o leste e o oeste. Quantas pontas ela tem?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: cada ponta é um lado. Conta os lados com os dedos: norte, sul...',
              'pt-BR': 'Dica: cada ponta é um lado. Conte os lados nos dedos: norte, sul...',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⬆️',
              pergunta: {
                'pt-PT': 'A agulha aponta para o norte, que fica em cima. O que fica em baixo?',
                'pt-BR': 'A agulha aponta para o norte, que fica em cima. O que fica embaixo?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o que fica em baixo é o contrário do norte.',
              'pt-BR': 'Dica: o que fica embaixo é o contrário do norte.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'No globo, cada animal tem a sua casa. Junta cada animal ao sítio onde vive!',
                'pt-BR': 'No globo, cada animal tem a sua casa. Junte cada animal com o lugar onde ele vive!',
              },
              emojis: [
                ['🐧', '🧊'],
                ['🐪', '🏜️'],
                ['🐒', '🌴'],
                ['🐟', '🌊'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O pinguim vive no gelo e o camelo no deserto.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O pinguim vive no gelo e o camelo no deserto.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧭',
              pergunta: {
                'pt-PT': 'A rosa dos ventos tem 4 pontas grandes e 4 pontas pequenas. Quantas pontas tem ao todo?',
                'pt-BR': 'A rosa dos ventos tem 4 pontas grandes e 4 pontas pequenas. Quantas pontas ela tem ao todo?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta mais quatro: cinco, seis...',
              'pt-BR': 'Dica: comece no 4 e conte mais quatro: cinco, seis...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⬆️',
              pergunta: {
                'pt-PT': 'A agulha da bússola aponta para o norte. Que ponto fica à direita?',
                'pt-BR': 'A agulha da bússola aponta para o norte. Que ponto fica à direita?',
              },
              opcoes: [
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: na rosa dos ventos, com o norte em cima, o oeste fica à esquerda. E à direita?',
              'pt-BR': 'Dica: na rosa dos ventos, com o norte em cima, o oeste fica à esquerda. E à direita?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Gira o globo! Junta cada animal ao sítio onde vive.',
                'pt-BR': 'Gire o globo! Junte cada animal com o lugar onde ele vive.',
              },
              emojis: [
                ['🐧', '🧊'],
                ['🐪', '🏜️'],
                ['🐒', '🌴'],
                ['🐟', '🌊'],
                ['🐻‍❄️', '❄️'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O urso branco vive na neve e o macaco nas árvores.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O urso-polar vive na neve e o macaco nas árvores.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧭 ⬇️',
              pergunta: {
                'pt-PT': 'Estás virado para sul. Que ponto fica nas tuas costas?',
                'pt-BR': 'Você está virado para o sul. Que ponto fica nas suas costas?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as costas ficam do lado contrário de onde olhas. Qual é o contrário do sul?',
              'pt-BR': 'Dica: as costas ficam do lado contrário de onde você olha. Qual é o contrário do sul?',
            },
          },
        ],
      },
    },
    {
      id: 'barril',
      nome: { 'pt-PT': 'Barril', 'pt-BR': 'Barril' },
      emoji: '🛢️',
      zona: { x: 36.6, y: 79.8, largura: 14.4, altura: 25.4 },
      sucesso: {
        'pt-PT': 'No fundo do barril estava o número {n}!',
        'pt-BR': 'No fundo do barril estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍎 🍎 🍎 🍎 🍎 🍎 🍎',
              pergunta: {
                'pt-PT': 'Quantas maçãs há no barril? Escreve o número.',
                'pt-BR': 'Quantas maçãs tem no barril? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: conta as maçãs uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as maçãs uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'No barril dos piratas há uma coisa que não se come. Qual é?',
                'pt-BR': 'No barril dos piratas tem uma coisa que não dá para comer. Qual é?',
              },
              opcoes: [
                { emoji: '🍎', nome: { 'pt-PT': 'Maçã', 'pt-BR': 'Maçã' } },
                { emoji: '🍞', nome: { 'pt-PT': 'Pão', 'pt-BR': 'Pão' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🧀', nome: { 'pt-PT': 'Queijo', 'pt-BR': 'Queijo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: três destas coisas são comida. A outra calça-se no pé.',
              'pt-BR': 'Dica: três destas coisas são comida. A outra a gente calça no pé.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧔 🧔 🧔',
              pergunta: {
                'pt-PT': 'Cada pirata quer 1 maçã do barril. Quantas maçãs são precisas para estes piratas?',
                'pt-BR': 'Cada pirata quer 1 maçã do barril. Quantas maçãs são necessárias para estes piratas?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: uma maçã para cada pirata. Conta os piratas.',
              'pt-BR': 'Dica: uma maçã para cada pirata. Conte os piratas.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍎🍎🍎🍎🍎🍎🍎🍎 🧔 🧔',
              pergunta: {
                'pt-PT': 'Há 8 maçãs para 2 piratas, e os dois ficam com o mesmo. Quantas maçãs recebe cada um?',
                'pt-BR': 'Tem 8 maçãs para 2 piratas, e os dois ficam com o mesmo tanto. Quantas maçãs cada um ganha?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: dá uma maçã a cada pirata, à vez, até acabarem.',
              'pt-BR': 'Dica: dê uma maçã para cada pirata, um de cada vez, até acabarem.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍪🍪🍪🍪🍪🍪 🍽️ 🍽️ 🍽️',
              pergunta: {
                'pt-PT': 'Há 6 bolachas para pôr em 3 pratos, com o mesmo em cada prato. Quantas bolachas vão para cada prato?',
                'pt-BR': 'Tem 6 biscoitos para colocar em 3 pratos, com o mesmo tanto em cada prato. Quantos biscoitos vão para cada prato?',
              },
              resposta: '2',
            },
            dica: {
              'pt-PT': 'Dica: põe uma bolacha em cada prato, à vez, até acabarem.',
              'pt-BR': 'Dica: coloque um biscoito em cada prato, um de cada vez, até acabarem.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Dois piratas repartiram as maçãs. Em que desenho ficaram os dois com o mesmo?',
                'pt-BR': 'Dois piratas dividiram as maçãs. Em que desenho os dois ficaram com o mesmo tanto?',
              },
              opcoes: [
                { emoji: '🍎🍎🍎 | 🍎', nome: { 'pt-PT': 'Desenho A', 'pt-BR': 'Desenho A' } },
                { emoji: '🍎 | 🍎🍎🍎', nome: { 'pt-PT': 'Desenho B', 'pt-BR': 'Desenho B' } },
                { emoji: '🍎🍎 | 🍎🍎', nome: { 'pt-PT': 'Desenho C', 'pt-BR': 'Desenho C' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: em cada desenho, conta as maçãs de um lado e do outro. Os dois números têm de ser iguais.',
              'pt-BR': 'Dica: em cada desenho, conte as maçãs de um lado e do outro. Os dois números têm que ser iguais.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 🧔🧔🧔🧔',
              pergunta: {
                'pt-PT': 'Há 12 maçãs para 4 piratas, e todos ficam com o mesmo. Quantas maçãs recebe cada um?',
                'pt-BR': 'Tem 12 maçãs para 4 piratas, e todos ficam com o mesmo tanto. Quantas maçãs cada um ganha?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: dá uma maçã a cada pirata, à vez. Quantas voltas dás até acabarem?',
              'pt-BR': 'Dica: dê uma maçã para cada pirata, um de cada vez. Quantas voltas você dá até acabarem?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍪🍪🍪🍪🍪🍪🍪🍪🍪 🧔🧔🧔',
              pergunta: {
                'pt-PT': 'No barril havia 9 bolachas. Cada um dos 3 piratas comeu 2. Quantas bolachas sobram?',
                'pt-BR': 'No barril tinha 9 biscoitos. Cada um dos 3 piratas comeu 2. Quantos biscoitos sobram?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: primeiro vê quantas bolachas comeram os piratas (2, mais 2, mais 2). Depois tira-as às 9.',
              'pt-BR': 'Dica: primeiro veja quantos biscoitos os piratas comeram (2, mais 2, mais 2). Depois tire de 9.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 🧔🧔🧔',
              pergunta: {
                'pt-PT': 'Há 10 maçãs para 3 piratas, e todos ficam com o mesmo. Quantas maçãs sobram no barril?',
                'pt-BR': 'Tem 10 maçãs para 3 piratas, e todos ficam com o mesmo tanto. Quantas maçãs sobram no barril?',
              },
              resposta: '1',
            },
            dica: {
              'pt-PT': 'Dica: dá uma maçã a cada pirata, à vez, enquanto der para todos. Quantas ficam no fim?',
              'pt-BR': 'Dica: dê uma maçã para cada pirata, um de cada vez, enquanto der para todos. Quantas ficam no fim?',
            },
          },
        ],
      },
    },
    {
      id: 'ancora',
      nome: { 'pt-PT': 'Âncora', 'pt-BR': 'Âncora' },
      emoji: '⚓',
      zona: { x: 51.3, y: 77.3, largura: 13.8, altura: 27.1 },
      requer: 'corda',
      bloqueado: {
        'pt-PT': 'A âncora é muito pesada e não a consegues levantar. Procura uma corda!',
        'pt-BR': 'A âncora é muito pesada e você não consegue levantá-la. Procure uma corda!',
      },
      sucesso: {
        'pt-PT': 'Puxaste a âncora com a corda e viste gravado o número {n}!',
        'pt-BR': 'Você puxou a âncora com a corda e viu gravado o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌊',
              pergunta: {
                'pt-PT': 'Qual destas coisas vai ao fundo da água?',
                'pt-BR': 'Qual destas coisas vai para o fundo da água?',
              },
              opcoes: [
                { emoji: '🦆', nome: { 'pt-PT': 'Pato', 'pt-BR': 'Pato' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
                { emoji: '⚓', nome: { 'pt-PT': 'Âncora', 'pt-BR': 'Âncora' } },
                { emoji: '🪵', nome: { 'pt-PT': 'Tronco', 'pt-BR': 'Tronco' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as coisas leves ficam por cima da água. Qual destas é de ferro e muito pesada?',
              'pt-BR': 'Dica: as coisas leves ficam em cima da água. Qual destas é de ferro e muito pesada?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'No fundo do mar há conchas e âncoras. Encontra os pares iguais!',
                'pt-BR': 'No fundo do mar tem conchas e âncoras. Encontre os pares iguais!',
              },
              emojis: ['🐚', '⚓', '🦀', '🪸'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚓ 🐚 🐚 🐚 🐚',
              pergunta: {
                'pt-PT': 'Quantas conchas estão presas na âncora? Escreve o número.',
                'pt-BR': 'Quantas conchas estão presas na âncora? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta as conchas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as conchas uma por uma, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌊',
              pergunta: {
                'pt-PT': 'Qual destas coisas flutua na água?',
                'pt-BR': 'Qual destas coisas flutua na água?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
                { emoji: '🔑', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '⚓', nome: { 'pt-PT': 'Âncora', 'pt-BR': 'Âncora' } },
                { emoji: '🪵', nome: { 'pt-PT': 'Tronco', 'pt-BR': 'Tronco' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a madeira é leve e fica por cima da água. Qual destas coisas é de madeira?',
              'pt-BR': 'Dica: a madeira é leve e fica em cima da água. Qual destas coisas é de madeira?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⛓️ ⛓️ ⛓️ ⛓️ ⛓️ ⛓️ 🌊 ⛓️ ⛓️ ⛓️ ⛓️',
              pergunta: {
                'pt-PT': 'A corrente da âncora tem 10 elos e 4 já estão dentro da água. Quantos estão fora da água?',
                'pt-BR': 'A corrente da âncora tem 10 elos e 4 já estão dentro da água. Quantos estão fora da água?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 10 e conta 4 para trás: 9, 8...',
              'pt-BR': 'Dica: comece no 10 e conte 4 para trás: 9, 8...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '⚓',
              pergunta: {
                'pt-PT': 'Põe a viagem da âncora por ordem: no barco, a cair, a entrar na água, a afundar e, no fim, no fundo do mar.',
                'pt-BR': 'Coloque a viagem da âncora em ordem: no barco, caindo, entrando na água, afundando e, no fim, no fundo do mar.',
              },
              itens: ['🚢', '⬇️', '💦', '🫧', '🪨'],
            },
            dica: {
              'pt-PT': 'Dica: a âncora começa no barco e acaba no fundo, ao pé das pedras.',
              'pt-BR': 'Dica: a âncora começa no barco e termina no fundo, perto das pedras.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha: tenho penas, sou leve e não vou ao fundo da água. Quem sou?',
                'pt-BR': 'Adivinhe: tenho penas, sou leve e não vou para o fundo da água. Quem sou eu?',
              },
              opcoes: [
                { emoji: '🦆', nome: { 'pt-PT': 'Pato', 'pt-BR': 'Pato' } },
                { emoji: '⚓', nome: { 'pt-PT': 'Âncora', 'pt-BR': 'Âncora' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. A âncora e a pedra vão ao fundo. Qual das outras tem penas?',
              'pt-BR': 'Dica: vá riscando. A âncora e a pedra vão para o fundo. Qual das outras tem penas?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍾🍾🍾 🪨🪨🪨🪨 🔑🔑',
              pergunta: {
                'pt-PT': 'Atiraram ao mar 3 rolhas, 4 pedras e 2 chaves. Quantas coisas ficaram a flutuar?',
                'pt-BR': 'Jogaram no mar 3 rolhas, 4 pedras e 2 chaves. Quantas coisas ficaram flutuando?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: as pedras e as chaves são pesadas e vão ao fundo. Conta só as coisas leves.',
              'pt-BR': 'Dica: as pedras e as chaves são pesadas e vão para o fundo. Conte só as coisas leves.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe as coisas por ordem, do céu até ao fundo do mar.',
                'pt-BR': 'Coloque as coisas em ordem, do céu até o fundo do mar.',
              },
              itens: ['🐦', '⛵', '🐟', '🐙', '⚓'],
            },
            dica: {
              'pt-PT': 'Dica: o pássaro voa lá no alto. O barco anda por cima da água e a âncora fica no fundo.',
              'pt-BR': 'Dica: o passarinho voa lá no alto. O barco anda em cima da água e a âncora fica no fundo.',
            },
          },
        ],
      },
    },
    {
      id: 'bau',
      nome: { 'pt-PT': 'Baú do tesouro', 'pt-BR': 'Baú do tesouro' },
      emoji: '💰',
      zona: { x: 14.5, y: 82.5, largura: 22.2, altura: 25 },
      requer: 'chave',
      bloqueado: {
        'pt-PT': 'O baú do tesouro está trancado. Procura uma chave!',
        'pt-BR': 'O baú do tesouro está trancado. Procure uma chave!',
      },
      sucesso: {
        'pt-PT': 'Entre as moedas do baú estava o número {n}!',
        'pt-BR': 'Entre as moedas do baú estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪙 🪙 🪙 🪙 🪙 🪙',
              pergunta: {
                'pt-PT': 'Quantas moedas há no baú? Escreve o número.',
                'pt-BR': 'Quantas moedas tem no baú? Digite o número.',
              },
              resposta: '6',
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
                'pt-PT': 'No baú há uma coisa que não é tesouro. Qual é?',
                'pt-BR': 'No baú tem uma coisa que não é tesouro. Qual é?',
              },
              opcoes: [
                { emoji: '💎', nome: { 'pt-PT': 'Diamante', 'pt-BR': 'Diamante' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '👑', nome: { 'pt-PT': 'Coroa', 'pt-BR': 'Coroa' } },
                { emoji: '🪙', nome: { 'pt-PT': 'Moeda', 'pt-BR': 'Moeda' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: três destas coisas brilham e valem muito. A outra calça-se no pé.',
              'pt-BR': 'Dica: três destas coisas brilham e valem muito. A outra a gente calça no pé.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O tesouro está todo misturado. Encontra os pares iguais!',
                'pt-BR': 'O tesouro está todo misturado. Encontre os pares iguais!',
              },
              emojis: ['🪙', '💎', '🗝️', '🏴‍☠️'],
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
              visual: '🪙2 ➕ 🪙1',
              pergunta: {
                'pt-PT': 'No baú há 1 moeda de 2 e 1 moeda de 1. Quanto dinheiro há ao todo?',
                'pt-BR': 'No baú tem 1 moeda de 2 e 1 moeda de 1. Quanto dinheiro tem ao todo?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: a moeda de 2 vale dois. Começa no 2 e junta o 1.',
              'pt-BR': 'Dica: a moeda de 2 vale dois. Comece no 2 e junte o 1.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪙 🪙 🪙 🪙 🪙 🪙 🪙',
              pergunta: {
                'pt-PT': 'O baú tinha 7 moedas e o pirata gastou 2. Quantas moedas ficaram?',
                'pt-BR': 'O baú tinha 7 moedas e o pirata gastou 2. Quantas moedas ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: tapa 2 moedas com o dedo e conta as que sobram.',
              'pt-BR': 'Dica: cubra 2 moedas com o dedo e conte as que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O pirata quer o saco com mais moedas. Qual é?',
                'pt-BR': 'O pirata quer o saco com mais moedas. Qual é?',
              },
              opcoes: [
                { emoji: '🪙🪙🪙', nome: { 'pt-PT': 'Primeiro saco', 'pt-BR': 'Primeiro saco' } },
                { emoji: '🪙🪙🪙🪙🪙', nome: { 'pt-PT': 'Segundo saco', 'pt-BR': 'Segundo saco' } },
                { emoji: '🪙🪙', nome: { 'pt-PT': 'Terceiro saco', 'pt-BR': 'Terceiro saco' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: conta as moedas de cada saco e vê qual é o número maior.',
              'pt-BR': 'Dica: conte as moedas de cada saco e veja qual é o número maior.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪙2 🪙2 🪙1',
              pergunta: {
                'pt-PT': 'No baú há 2 moedas de 2 e 1 moeda de 1. Quanto dinheiro há ao todo?',
                'pt-BR': 'No baú tem 2 moedas de 2 e 1 moeda de 1. Quanto dinheiro tem ao todo?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: primeiro junta as moedas de 2 (2 mais 2). Depois junta a moeda de 1.',
              'pt-BR': 'Dica: primeiro junte as moedas de 2 (2 mais 2). Depois junte a moeda de 1.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O que vale mais: 3 moedas de 1 ou 1 moeda de 5?',
                'pt-BR': 'O que vale mais: 3 moedas de 1 ou 1 moeda de 5?',
              },
              opcoes: [
                { emoji: '🪙🪙🪙', nome: { 'pt-PT': 'Três moedas de 1', 'pt-BR': 'Três moedas de 1' } },
                { emoji: '🪙', nome: { 'pt-PT': 'Uma moeda de 5', 'pt-BR': 'Uma moeda de 5' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: não contes as moedas, conta o que valem. Três moedas de 1 valem 1, mais 1, mais 1.',
              'pt-BR': 'Dica: não conte as moedas, conte quanto elas valem. Três moedas de 1 valem 1, mais 1, mais 1.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💰 💰',
              pergunta: {
                'pt-PT': 'Há 8 moedas em 2 baús. Um baú tem mais 2 moedas do que o outro. Quantas moedas tem o baú maior?',
                'pt-BR': 'Tem 8 moedas em 2 baús. Um baú tem 2 moedas a mais que o outro. Quantas moedas tem o baú maior?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: experimenta: se um baú tiver 4 e o outro 4, a diferença é zero. Passa moedas de um para o outro.',
              'pt-BR': 'Dica: experimente: se um baú tiver 4 e o outro 4, a diferença é zero. Passe moedas de um para o outro.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'garrafa',
      nome: { 'pt-PT': 'Garrafa com mensagem', 'pt-BR': 'Garrafa com mensagem' },
      emoji: '🍾',
      zona: { x: 66.4, y: 74.8, largura: 14.7, altura: 32.1 },
      recompensa: {
        id: 'chave',
        emoji: '🗝️',
        nome: { 'pt-PT': 'Chave do baú', 'pt-BR': 'Chave do baú' },
      },
      sucesso: {
        'pt-PT': 'Dentro da garrafa, junto à mensagem, havia uma chave! 🗝️',
        'pt-BR': 'Dentro da garrafa, junto com a mensagem, havia uma chave! 🗝️',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🗝️',
              pergunta: {
                'pt-PT': 'A mensagem tem o desenho de uma chave. Qual destas é igual ao desenho?',
                'pt-BR': 'A mensagem tem o desenho de uma chave. Qual destas é igual ao desenho?',
              },
              opcoes: [
                { emoji: '🔑', nome: { 'pt-PT': 'Chave nova', 'pt-BR': 'Chave nova' } },
                { emoji: '🔒', nome: { 'pt-PT': 'Cadeado', 'pt-BR': 'Cadeado' } },
                { emoji: '🗝️', nome: { 'pt-PT': 'Chave antiga', 'pt-BR': 'Chave antiga' } },
                { emoji: '🔐', nome: { 'pt-PT': 'Cadeado com chave', 'pt-BR': 'Cadeado com chave' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Olha bem para a forma e para a cor do desenho.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Olhe bem a forma e a cor do desenho.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Chegaram muitas garrafas à praia. Encontra os pares iguais!',
                'pt-BR': 'Chegaram muitas garrafas na praia. Encontre os pares iguais!',
              },
              emojis: ['🍾', '🧴', '🍶', '🫙'],
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '📜 🗝️ 🏝️',
              pergunta: {
                'pt-PT': 'A mensagem é um desenho: uma chave e uma ilha. O que manda procurar?',
                'pt-BR': 'A mensagem é um desenho: uma chave e uma ilha. O que ela manda procurar?',
              },
              opcoes: [
                { emoji: '🐟', nome: { 'pt-PT': 'Um peixe', 'pt-BR': 'Um peixe' } },
                { emoji: '🗝️', nome: { 'pt-PT': 'Uma chave', 'pt-BR': 'Uma chave' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Uma banana', 'pt-BR': 'Uma banana' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. A ilha é o sítio; o que está desenhado ao pé dela?',
              'pt-BR': 'Dica: a chave do baú está na garrafa. A ilha é o lugar; o que está desenhado perto dela?',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A mensagem diz: «A chave está à esquerda da âncora.» Qual desenho mostra isso?',
                'pt-BR': 'A mensagem diz: "A chave está à esquerda da âncora." Qual desenho mostra isso?',
              },
              opcoes: [
                { emoji: '⚓🗝️', nome: { 'pt-PT': 'Desenho A', 'pt-BR': 'Desenho A' } },
                { emoji: '🗝️⚓', nome: { 'pt-PT': 'Desenho B', 'pt-BR': 'Desenho B' } },
                { emoji: '⚓🐚', nome: { 'pt-PT': 'Desenho C', 'pt-BR': 'Desenho C' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Põe o dedo na âncora de cada desenho e vê se a chave está do lado onde começas a ler.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Coloque o dedo na âncora de cada desenho e veja se a chave está do lado onde você começa a ler.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe a viagem da garrafa por ordem: o pirata escreve, põe a mensagem na garrafa, atira-a ao mar, a garrafa boia nas ondas e chega à praia.',
                'pt-BR': 'Coloque a viagem da garrafa em ordem: o pirata escreve, coloca a mensagem na garrafa, joga no mar, a garrafa boia nas ondas e chega na praia.',
              },
              itens: ['✍️', '🍾', '💦', '🌊', '🏖️'],
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Primeiro o pirata escreve; a praia fica para o fim.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Primeiro o pirata escreve; a praia fica para o fim.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Chegaram muitas coisas à praia. Encontra os cinco pares iguais!',
                'pt-BR': 'Chegaram muitas coisas na praia. Encontre os cinco pares iguais!',
              },
              emojis: ['🍾', '📜', '🐚', '🦀', '⭐'],
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '📜 EVAHC',
              pergunta: {
                'pt-PT': 'A mensagem está escrita de trás para a frente: «EVAHC». Que palavra é?',
                'pt-BR': 'A mensagem está escrita de trás para a frente: "EVAHC". Que palavra é?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🗝️', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '⚓', nome: { 'pt-PT': 'Âncora', 'pt-BR': 'Âncora' } },
                { emoji: '🦜', nome: { 'pt-PT': 'Papagaio', 'pt-BR': 'Papagaio' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Lê as letras a começar pela última: C, H...',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Leia as letras começando pela última: C, H...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '📜 🧭',
              pergunta: {
                'pt-PT': 'A mensagem diz: «A chave não está no barril nem no canhão. Está a sul do leme.» Onde está?',
                'pt-BR': 'A mensagem diz: "A chave não está no barril nem no canhão. Está ao sul do leme." Onde ela está?',
              },
              opcoes: [
                { emoji: '🛢️', nome: { 'pt-PT': 'No barril', 'pt-BR': 'No barril' } },
                { emoji: '☸️', nome: { 'pt-PT': 'Por cima do leme', 'pt-BR': 'Em cima do leme' } },
                { emoji: '💣', nome: { 'pt-PT': 'No canhão', 'pt-BR': 'No canhão' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Por baixo do leme', 'pt-BR': 'Embaixo do leme' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Risca o barril e o canhão. Depois lembra-te: o sul fica em baixo.',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Risque o barril e o canhão. Depois lembre: o sul fica embaixo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍾 ⬆️⬆️ ⬇️⬇️⬇️',
              pergunta: {
                'pt-PT': 'A garrafa andou 2 ilhas para norte e depois 3 ilhas para sul. A quantas ilhas do ponto de partida ficou?',
                'pt-BR': 'A garrafa andou 2 ilhas para o norte e depois 3 ilhas para o sul. A quantas ilhas do ponto de partida ela ficou?',
              },
              resposta: '1',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está na garrafa. Subir 2 e descer 2 é voltar ao início. Quanto falta descer?',
              'pt-BR': 'Dica: a chave do baú está na garrafa. Subir 2 e descer 2 é voltar ao início. Quanto falta descer?',
            },
          },
        ],
      },
    },
    {
      id: 'canhao',
      nome: { 'pt-PT': 'Canhão com corda', 'pt-BR': 'Canhão com corda' },
      emoji: '💣',
      zona: { x: 86.7, y: 81, largura: 25.9, altura: 22.1 },
      recompensa: {
        id: 'corda',
        emoji: '🪢',
        nome: { 'pt-PT': 'Corda', 'pt-BR': 'Corda' },
      },
      sucesso: {
        'pt-PT': 'Desamarraste a corda do canhão! Serve para puxar a âncora. 🪢',
        'pt-BR': 'Você desamarrou a corda do canhão! Ela serve para puxar a âncora. 🪢',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚫ ⚫ ⚫ ⚫ ⚫',
              pergunta: {
                'pt-PT': 'A corda está presa debaixo das bolas de canhão. Quantas bolas há?',
                'pt-BR': 'A corda está presa embaixo das balas de canhão. Quantas balas tem?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Conta as bolas uma a uma, com o dedo.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Conte as balas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '💣 ➡️',
              pergunta: {
                'pt-PT': 'Para que lado aponta o canhão?',
                'pt-BR': 'Para que lado o canhão aponta?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'Para a esquerda', 'pt-BR': 'Para a esquerda' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Para cima', 'pt-BR': 'Para cima' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Para a direita', 'pt-BR': 'Para a direita' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Olha para a seta ao lado do canhão.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Olhe a seta ao lado do canhão.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas do convés estão espalhadas. Encontra os pares iguais!',
                'pt-BR': 'As coisas do convés estão espalhadas. Encontre os pares iguais!',
              },
              emojis: ['💣', '🪢', '🏴‍☠️', '⛵'],
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚫⚫⚫⚫⚫⚫⚫⚫⚫',
              pergunta: {
                'pt-PT': 'Há 9 bolas de canhão para pôr em 3 montes iguais. Quantas bolas ficam em cada monte?',
                'pt-BR': 'Tem 9 balas de canhão para colocar em 3 montes iguais. Quantas balas ficam em cada monte?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Põe uma bola em cada monte, à vez, até acabarem.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Coloque uma bala em cada monte, uma de cada vez, até acabarem.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🛶 💣➡️ ⛵',
              pergunta: {
                'pt-PT': 'O canhão aponta para a direita. Que barco está desse lado?',
                'pt-BR': 'O canhão aponta para a direita. Que barco está desse lado?',
              },
              opcoes: [
                { emoji: '🛶', nome: { 'pt-PT': 'Canoa', 'pt-BR': 'Canoa' } },
                { emoji: '⛵', nome: { 'pt-PT': 'Veleiro', 'pt-BR': 'Veleiro' } },
                { emoji: '🚢', nome: { 'pt-PT': 'Navio', 'pt-BR': 'Navio' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Segue a seta do canhão com o dedo.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Siga a seta do canhão com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas do convés estão espalhadas. Encontra os cinco pares iguais!',
                'pt-BR': 'As coisas do convés estão espalhadas. Encontre os cinco pares iguais!',
              },
              emojis: ['💣', '🪢', '🏴‍☠️', '⛵', '🔭'],
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '💣 ⬆️ ↪️',
              pergunta: {
                'pt-PT': 'O canhão aponta para norte e roda um quarto de volta para a direita. Para onde aponta agora?',
                'pt-BR': 'O canhão aponta para o norte e gira um quarto de volta para a direita. Para onde ele aponta agora?',
              },
              opcoes: [
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Um quarto de volta é passar só para o ponto ao lado, como os ponteiros do relógio.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Um quarto de volta é passar só para o ponto ao lado, como os ponteiros do relógio.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫ 💣 💣',
              pergunta: {
                'pt-PT': 'Há 10 bolas para 2 canhões, com o mesmo em cada um. Cada canhão disparou 1 bola. Quantas bolas tem cada canhão agora?',
                'pt-BR': 'Tem 10 balas para 2 canhões, com o mesmo tanto em cada um. Cada canhão disparou 1 bala. Quantas balas cada canhão tem agora?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. Primeiro reparte as 10 bolas pelos 2 canhões. Depois tira 1.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. Primeiro divida as 10 balas entre os 2 canhões. Depois tire 1.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌊',
              pergunta: {
                'pt-PT': 'Caíram duas coisas ao mar: uma bola de canhão e um barril vazio. Qual delas flutua?',
                'pt-BR': 'Caíram duas coisas no mar: uma bala de canhão e um barril vazio. Qual delas flutua?',
              },
              opcoes: [
                { emoji: '⚫', nome: { 'pt-PT': 'A bola de canhão', 'pt-BR': 'A bala de canhão' } },
                { emoji: '🛢️', nome: { 'pt-PT': 'O barril vazio', 'pt-BR': 'O barril vazio' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a corda da âncora está no canhão. A bola é de ferro e cheia. O barril é de madeira e tem ar lá dentro.',
              'pt-BR': 'Dica: a corda da âncora está no canhão. A bala é de ferro e maciça. O barril é de madeira e tem ar dentro.',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta do camarote', 'pt-BR': 'Porta do camarote' },
    emoji: '🚪',
    zona: { x: 48.6, y: 37.1, largura: 23.4, altura: 50.8 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa do camarote que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa do camarote que esconde um número. Digite os números na ordem dos desenhos.',
    },
    dicaVer: {
      'pt-PT': 'Dica: toca na porta para ver o cadeado. Os desenhos mostram onde estão os números.',
      'pt-BR': 'Dica: toque na porta para ver o cadeado. Os desenhos mostram onde estão os números.',
    },
    dica: {
      'pt-PT': 'Dica: já tens todos os números! Escreve-os no cadeado pela ordem dos desenhos.',
      'pt-BR': 'Dica: você já tem todos os números! Digite no cadeado na ordem dos desenhos.',
    },
  },
  vitoria: {
    'pt-PT': 'Clique! O cadeado abriu e a porta do camarote rangeu. Subiste ao convés e o capitão deu-te um chapéu de pirata. Que aventura!',
    'pt-BR': 'Clique! O cadeado abriu e a porta do camarote rangeu. Você subiu ao convés e o capitão te deu um chapéu de pirata. Que aventura!',
  },
};
