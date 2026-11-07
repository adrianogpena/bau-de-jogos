import type { Sala } from '../tipos';

/**
 * O Sótão da Avó. A saída é sempre a porta do sótão; o código (3 ou 4 números) sai de objetos sorteados entre
 * os 9 abaixo, cada um com várias versões do enigma. O quadro é um extra: esconde a chave do baú.
 * As zonas seguem o prompt do fundo em docs/PROMPTS-IMAGENS.md; acerte-as com ?zonas quando a imagem chegar.
 */
export const sotao: Sala = {
  id: 'sotao',
  emoji: '[[extras/sotao]]',
  cor: '#ffc94d',
  titulo: { 'pt-PT': 'O Sótão da Avó', 'pt-BR': 'O Sótão da Vovó' },
  resumo: {
    'pt-PT': 'A porta bateu e ficaste preso no sótão. Descobre o código!',
    'pt-BR': 'A porta bateu e você ficou preso no sótão. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Subiste ao sótão da avó para procurar um brinquedo. De repente, a porta fechou-se com um estrondo! Na porta há um cadeado com desenhos de coisas do sótão. Cada uma dessas coisas esconde um número. Descobre os números e abre a porta!',
    'pt-BR':
      'Você subiu ao sótão da vovó para procurar um brinquedo. De repente, a porta se fechou com um estrondo! Na porta há um cadeado com desenhos de coisas do sótão. Cada uma dessas coisas esconde um número. Descubra os números e abra a porta!',
  },
  fundoCss: 'linear-gradient(180deg, #3b2a4f 0%, #2a2040 60%, #4a3524 100%)',
  digitos: [3, 4],
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da porta!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da porta!',
  },
  fontes: [
    {
      id: 'relogio',
      nome: { 'pt-PT': 'Relógio de pêndulo', 'pt-BR': 'Relógio de pêndulo' },
      emoji: '🕰️',
      zona: { x: 10, y: 48, largura: 14, altura: 56 },
      sucesso: {
        'pt-PT': 'O relógio voltou a andar e mostra o número {n}!',
        'pt-BR': 'O relógio voltou a andar e mostra o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'ordem',
            visual: '🕰️',
            pergunta: {
              'pt-PT': 'O relógio parou! Põe as partes do dia por ordem, da manhã até à noite.',
              'pt-BR': 'O relógio parou! Coloque as partes do dia em ordem, da manhã até a noite.',
            },
            itens: ['🌅', '🌞', '🌇', '🌙'],
          },
          dica: {
            'pt-PT': 'Dica: o dia começa com o nascer do sol e acaba com a lua.',
            'pt-BR': 'Dica: o dia começa com o nascer do sol e termina com a lua.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🕓',
            pergunta: {
              'pt-PT': 'O ponteiro pequeno aponta para o 4 e o ponteiro grande para o 12. Que horas são? Escreve o número.',
              'pt-BR': 'O ponteiro pequeno aponta para o 4 e o ponteiro grande para o 12. Que horas são? Digite o número.',
            },
            resposta: '4',
          },
          dica: {
            'pt-PT': 'Dica: quando o ponteiro grande está no 12, a hora é o número do ponteiro pequeno.',
            'pt-BR': 'Dica: quando o ponteiro grande está no 12, a hora é o número do ponteiro pequeno.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🐦 🐦 🐦 🐦 🐦 🐦',
            pergunta: {
              'pt-PT': 'Do relógio saiu um cuco! Cantou uma vez por cada pássaro. Quantas vezes cantou?',
              'pt-BR': 'Do relógio saiu um cuco! Ele cantou uma vez para cada passarinho. Quantas vezes cantou?',
            },
            resposta: '6',
          },
          dica: {
            'pt-PT': 'Dica: conta os pássaros um a um, com o dedo.',
            'pt-BR': 'Dica: conte os passarinhos um por um, com o dedo.',
          },
        },
      ],
    },
    {
      id: 'bau',
      nome: { 'pt-PT': 'Baú de brinquedos', 'pt-BR': 'Baú de brinquedos' },
      emoji: '[[extras/ursinho]]',
      zona: { x: 17, y: 85, largura: 18, altura: 20 },
      requer: 'chave',
      bloqueado: {
        'pt-PT': 'O baú está trancado. Procura uma chave!',
        'pt-BR': 'O baú está trancado. Procure uma chave!',
      },
      sucesso: {
        'pt-PT': 'No fundo do baú estava o número {n}!',
        'pt-BR': 'No fundo do baú estava o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'pares',
            pergunta: {
              'pt-PT': 'Os brinquedos estão misturados. Encontra os pares iguais!',
              'pt-BR': 'Os brinquedos estão misturados. Encontre os pares iguais!',
            },
            emojis: ['🧸', '🚂', '🪁', '🎈'],
          },
          dica: {
            'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
            'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
          },
        },
        {
          enigma: {
            tipo: 'pares',
            pergunta: {
              'pt-PT': 'Há jogos espalhados pelo baú. Encontra os pares iguais!',
              'pt-BR': 'Tem jogos espalhados pelo baú. Encontre os pares iguais!',
            },
            emojis: ['⚽', '🪀', '🎲', '🧩', '🪆'],
          },
          dica: {
            'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
            'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
          },
        },
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'O número está colado no brinquedo que tem rodas. Qual é?',
              'pt-BR': 'O número está colado no brinquedo que tem rodas. Qual é?',
            },
            opcoes: [
              { emoji: '🧸', nome: { 'pt-PT': 'Ursinho', 'pt-BR': 'Ursinho' } },
              { emoji: '🚗', nome: { 'pt-PT': 'Carrinho', 'pt-BR': 'Carrinho' } },
              { emoji: '🪁', nome: { 'pt-PT': 'Papagaio de papel', 'pt-BR': 'Pipa' } },
              { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
            ],
            certa: 1,
          },
          dica: {
            'pt-PT': 'Dica: as rodas servem para andar no chão. Qual destes anda no chão?',
            'pt-BR': 'Dica: as rodas servem para andar no chão. Qual destes anda no chão?',
          },
        },
      ],
    },
    {
      id: 'estante',
      nome: { 'pt-PT': 'Estante', 'pt-BR': 'Estante' },
      emoji: '[[cenas/biblioteca]]',
      zona: { x: 90, y: 50, largura: 16, altura: 60 },
      sucesso: {
        'pt-PT': 'Um livro caiu da estante com o número {n}!',
        'pt-BR': 'Um livro caiu da estante com o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'Na estante há um intruso! Qual destas coisas não é fruta?',
              'pt-BR': 'Na estante há um intruso! Qual destas coisas não é fruta?',
            },
            opcoes: [
              { emoji: '🍎', nome: { 'pt-PT': 'Maçã', 'pt-BR': 'Maçã' } },
              { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
              { emoji: '🚗', nome: { 'pt-PT': 'Carro', 'pt-BR': 'Carro' } },
              { emoji: '🍇', nome: { 'pt-PT': 'Uvas', 'pt-BR': 'Uvas' } },
            ],
            certa: 2,
          },
          dica: {
            'pt-PT': 'Dica: três destas coisas comem-se. Uma anda na estrada.',
            'pt-BR': 'Dica: três destas coisas a gente come. Uma anda na rua.',
          },
        },
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'Na estante há um intruso! Qual destas coisas não é um animal?',
              'pt-BR': 'Na estante há um intruso! Qual destas coisas não é um animal?',
            },
            opcoes: [
              { emoji: '🐶', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
              { emoji: '✈️', nome: { 'pt-PT': 'Avião', 'pt-BR': 'Avião' } },
              { emoji: '🐱', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
              { emoji: '🐰', nome: { 'pt-PT': 'Coelho', 'pt-BR': 'Coelho' } },
            ],
            certa: 1,
          },
          dica: {
            'pt-PT': 'Dica: três destas coisas respiram e comem. Uma tem asas de metal.',
            'pt-BR': 'Dica: três destas coisas respiram e comem. Uma tem asas de metal.',
          },
        },
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'Na estante há um intruso! Qual destas coisas não serve para ler?',
              'pt-BR': 'Na estante há um intruso! Qual destas coisas não serve para ler?',
            },
            opcoes: [
              { emoji: '📖', nome: { 'pt-PT': 'Livro', 'pt-BR': 'Livro' } },
              { emoji: '📰', nome: { 'pt-PT': 'Jornal', 'pt-BR': 'Jornal' } },
              { emoji: '✉️', nome: { 'pt-PT': 'Carta', 'pt-BR': 'Carta' } },
              { emoji: '🥄', nome: { 'pt-PT': 'Colher', 'pt-BR': 'Colher' } },
            ],
            certa: 3,
          },
          dica: {
            'pt-PT': 'Dica: três destas coisas têm letras. Uma serve para comer a sopa.',
            'pt-BR': 'Dica: três destas coisas têm letras. Uma serve para tomar sopa.',
          },
        },
      ],
    },
    {
      id: 'cavalo',
      nome: { 'pt-PT': 'Cavalo de baloiço', 'pt-BR': 'Cavalo de balanço' },
      emoji: '🐴',
      zona: { x: 38, y: 80, largura: 16, altura: 24 },
      sucesso: {
        'pt-PT': 'Na sela do cavalo estava escrito o número {n}!',
        'pt-BR': 'Na sela do cavalo estava escrito o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'codigo',
            visual: '🐴',
            pergunta: {
              'pt-PT': 'Quantas patas tem o cavalo? Escreve o número.',
              'pt-BR': 'Quantas patas tem o cavalo? Digite o número.',
            },
            resposta: '4',
          },
          dica: {
            'pt-PT': 'Dica: o cavalo tem duas patas à frente e duas atrás.',
            'pt-BR': 'Dica: o cavalo tem duas patas na frente e duas atrás.',
          },
        },
        {
          enigma: {
            tipo: 'ordem',
            pergunta: {
              'pt-PT': 'Põe os animais por ordem, do mais pequeno ao maior.',
              'pt-BR': 'Coloque os animais em ordem, do menor ao maior.',
            },
            itens: ['🐭', '🐱', '🐶', '🐴'],
          },
          dica: {
            'pt-PT': 'Dica: o ratinho é o mais pequeno e o cavalo é o maior.',
            'pt-BR': 'Dica: o ratinho é o menor e o cavalo é o maior.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🐴 🐴 🐴',
            pergunta: {
              'pt-PT': 'Cada cavalo tem duas orelhas. Quantas orelhas têm os três cavalos?',
              'pt-BR': 'Cada cavalo tem duas orelhas. Quantas orelhas os três cavalos têm?',
            },
            resposta: '6',
          },
          dica: {
            'pt-PT': 'Dica: conta as orelhas de dois em dois, um cavalo de cada vez.',
            'pt-BR': 'Dica: conte as orelhas de dois em dois, um cavalo de cada vez.',
          },
        },
      ],
    },
    {
      id: 'caixa-musica',
      nome: { 'pt-PT': 'Caixa de música', 'pt-BR': 'Caixa de música' },
      emoji: '🎵',
      zona: { x: 31, y: 55, largura: 12, altura: 12 },
      sucesso: {
        'pt-PT': 'A bailarina rodou e apontou para o número {n}!',
        'pt-BR': 'A bailarina girou e apontou para o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'A caixa de música só toca para quem souber: qual destas coisas não é um instrumento?',
              'pt-BR': 'A caixa de música só toca para quem souber: qual destas coisas não é um instrumento?',
            },
            opcoes: [
              { emoji: '🥁', nome: { 'pt-PT': 'Tambor', 'pt-BR': 'Tambor' } },
              { emoji: '🎺', nome: { 'pt-PT': 'Trompete', 'pt-BR': 'Trompete' } },
              { emoji: '🎹', nome: { 'pt-PT': 'Piano', 'pt-BR': 'Piano' } },
              { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
            ],
            certa: 3,
          },
          dica: {
            'pt-PT': 'Dica: três destas coisas fazem música. A outra calça-se no pé.',
            'pt-BR': 'Dica: três destas coisas fazem música. A outra a gente calça no pé.',
          },
        },
        {
          enigma: {
            tipo: 'pares',
            pergunta: {
              'pt-PT': 'Os instrumentos fugiram da caixa! Encontra os pares iguais.',
              'pt-BR': 'Os instrumentos fugiram da caixa! Encontre os pares iguais.',
            },
            emojis: ['🥁', '🎺', '🎹', '🎻'],
          },
          dica: {
            'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
            'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🎵 🎵 🎵 🎵 🎵 🎵 🎵',
            pergunta: {
              'pt-PT': 'A caixa de música tocou uma melodia. Quantas notas tocou?',
              'pt-BR': 'A caixa de música tocou uma melodia. Quantas notas ela tocou?',
            },
            resposta: '7',
          },
          dica: {
            'pt-PT': 'Dica: conta as notas uma a uma, com o dedo.',
            'pt-BR': 'Dica: conte as notas uma por uma, com o dedo.',
          },
        },
      ],
    },
    {
      id: 'chapeus',
      nome: { 'pt-PT': 'Cabide de chapéus', 'pt-BR': 'Cabide de chapéus' },
      emoji: '🎩',
      zona: { x: 68, y: 45, largura: 10, altura: 40 },
      sucesso: {
        'pt-PT': 'Dentro de um chapéu havia um papel com o número {n}!',
        'pt-BR': 'Dentro de um chapéu havia um papel com o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'codigo',
            visual: '🎩 🎩 👒 👒 👒',
            pergunta: {
              'pt-PT': 'Quantos chapéus há no cabide? Escreve o número.',
              'pt-BR': 'Quantos chapéus tem no cabide? Digite o número.',
            },
            resposta: '5',
          },
          dica: {
            'pt-PT': 'Dica: conta os chapéus pretos e depois os de palha.',
            'pt-BR': 'Dica: conte os chapéus pretos e depois os de palha.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🎩 👒 🎩 🧢 🎩',
            pergunta: {
              'pt-PT': 'Quantas cartolas pretas há no cabide?',
              'pt-BR': 'Quantas cartolas pretas tem no cabide?',
            },
            resposta: '3',
          },
          dica: {
            'pt-PT': 'Dica: a cartola é o chapéu alto e preto. Não contes os outros.',
            'pt-BR': 'Dica: a cartola é o chapéu alto e preto. Não conte os outros.',
          },
        },
        {
          enigma: {
            tipo: 'escolha',
            pergunta: {
              'pt-PT': 'No cabide há uma coisa fora do lugar. Qual destas coisas não se põe na cabeça?',
              'pt-BR': 'No cabide há uma coisa fora do lugar. Qual destas coisas não se coloca na cabeça?',
            },
            opcoes: [
              { emoji: '👒', nome: { 'pt-PT': 'Chapéu', 'pt-BR': 'Chapéu' } },
              { emoji: '🧢', nome: { 'pt-PT': 'Boné', 'pt-BR': 'Boné' } },
              { emoji: '👑', nome: { 'pt-PT': 'Coroa', 'pt-BR': 'Coroa' } },
              { emoji: '👟', nome: { 'pt-PT': 'Sapatilha', 'pt-BR': 'Tênis' } },
            ],
            certa: 3,
          },
          dica: {
            'pt-PT': 'Dica: três destas coisas vão na cabeça. A outra vai no pé.',
            'pt-BR': 'Dica: três destas coisas vão na cabeça. A outra vai no pé.',
          },
        },
      ],
    },
    {
      id: 'janela',
      nome: { 'pt-PT': 'Janela redonda', 'pt-BR': 'Janela redonda' },
      emoji: '🪟',
      zona: { x: 76, y: 15, largura: 14, altura: 18 },
      sucesso: {
        'pt-PT': 'No vidro embaciado apareceu o número {n}!',
        'pt-BR': 'No vidro embaçado apareceu o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'ordem',
            pergunta: {
              'pt-PT': 'Pela janela vês o jardim. Põe a planta por ordem, da semente até à árvore.',
              'pt-BR': 'Pela janela você vê o jardim. Coloque a planta em ordem, da semente até a árvore.',
            },
            itens: ['🌰', '🌱', '🌿', '🌳'],
          },
          dica: {
            'pt-PT': 'Dica: primeiro a semente, depois um rebento pequenino, e a árvore no fim.',
            'pt-BR': 'Dica: primeiro a semente, depois um brotinho, e a árvore no fim.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🐦 🐦 🐦 ➕ 🐦 🐦',
            pergunta: {
              'pt-PT': 'Na janela estavam três pássaros e chegaram mais dois. Quantos são agora?',
              'pt-BR': 'Na janela estavam três passarinhos e chegaram mais dois. Quantos são agora?',
            },
            resposta: '5',
          },
          dica: {
            'pt-PT': 'Dica: começa no três e conta mais dois: quatro, cinco...',
            'pt-BR': 'Dica: comece no três e conte mais dois: quatro, cinco...',
          },
        },
        {
          enigma: {
            tipo: 'escolha',
            visual: '🌧️',
            pergunta: {
              'pt-PT': 'Lá fora está a chover! O que levas para não te molhares?',
              'pt-BR': 'Lá fora está chovendo! O que você leva para não se molhar?',
            },
            opcoes: [
              { emoji: '☂️', nome: { 'pt-PT': 'Guarda-chuva', 'pt-BR': 'Guarda-chuva' } },
              { emoji: '🕶️', nome: { 'pt-PT': 'Óculos de sol', 'pt-BR': 'Óculos de sol' } },
              { emoji: '🩴', nome: { 'pt-PT': 'Chinelos', 'pt-BR': 'Chinelos' } },
              { emoji: '🍦', nome: { 'pt-PT': 'Gelado', 'pt-BR': 'Sorvete' } },
            ],
            certa: 0,
          },
          dica: {
            'pt-PT': 'Dica: abre-se por cima da cabeça quando chove.',
            'pt-BR': 'Dica: a gente abre em cima da cabeça quando chove.',
          },
        },
      ],
    },
    {
      id: 'mala',
      nome: { 'pt-PT': 'Mala de viagem', 'pt-BR': 'Mala de viagem' },
      emoji: '🧳',
      zona: { x: 62, y: 85, largura: 15, altura: 16 },
      sucesso: {
        'pt-PT': 'A mala abriu! Lá dentro havia um postal com o número {n}.',
        'pt-BR': 'A mala abriu! Lá dentro havia um cartão-postal com o número {n}.',
      },
      variantes: [
        {
          enigma: {
            tipo: 'codigo',
            visual: '🚲',
            pergunta: {
              'pt-PT': 'O cadeado da mala abre com o número de rodas de uma bicicleta.',
              'pt-BR': 'O cadeado da mala abre com o número de rodas de uma bicicleta.',
            },
            resposta: '2',
          },
          dica: {
            'pt-PT': 'Dica: a bicicleta tem uma roda à frente e outra atrás.',
            'pt-BR': 'Dica: a bicicleta tem uma roda na frente e outra atrás.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🚗',
            pergunta: {
              'pt-PT': 'O cadeado da mala abre com o número de rodas de um carro.',
              'pt-BR': 'O cadeado da mala abre com o número de rodas de um carro.',
            },
            resposta: '4',
          },
          dica: {
            'pt-PT': 'Dica: o carro tem duas rodas à frente e duas atrás.',
            'pt-BR': 'Dica: o carro tem duas rodas na frente e duas atrás.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🕷️',
            pergunta: {
              'pt-PT': 'O cadeado da mala abre com o número de patas de uma aranha.',
              'pt-BR': 'O cadeado da mala abre com o número de patas de uma aranha.',
            },
            resposta: '8',
          },
          dica: {
            'pt-PT': 'Dica: a aranha tem quatro patas de cada lado.',
            'pt-BR': 'Dica: a aranha tem quatro patas de cada lado.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '✋',
            pergunta: {
              'pt-PT': 'O cadeado da mala abre com o número de dedos de uma mão.',
              'pt-BR': 'O cadeado da mala abre com o número de dedos de uma mão.',
            },
            resposta: '5',
          },
          dica: {
            'pt-PT': 'Dica: conta os dedos da tua mão.',
            'pt-BR': 'Dica: conte os dedos da sua mão.',
          },
        },
      ],
    },
    {
      id: 'novelos',
      nome: { 'pt-PT': 'Cesto de novelos', 'pt-BR': 'Cesto de novelos' },
      emoji: '🧶',
      zona: { x: 82, y: 88, largura: 12, altura: 14 },
      sucesso: {
        'pt-PT': 'Enrolado num novelo estava o número {n}!',
        'pt-BR': 'Enrolado num novelo estava o número {n}!',
      },
      variantes: [
        {
          enigma: {
            tipo: 'ordem',
            pergunta: {
              'pt-PT': 'Arruma os novelos pelas cores do arco-íris.',
              'pt-BR': 'Organize os novelos nas cores do arco-íris.',
            },
            itens: ['🔴', '🟠', '🟡', '🟢', '🔵'],
          },
          dica: {
            'pt-PT': 'Dica: vermelho, laranja, amarelo, verde e azul.',
            'pt-BR': 'Dica: vermelho, laranja, amarelo, verde e azul.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🧶 🧶 🧶 🧶 🧶 🧶 🧶 🧶 🧶',
            pergunta: {
              'pt-PT': 'Quantos novelos há no cesto? Escreve o número.',
              'pt-BR': 'Quantos novelos tem no cesto? Digite o número.',
            },
            resposta: '9',
          },
          dica: {
            'pt-PT': 'Dica: conta os novelos um a um, com o dedo.',
            'pt-BR': 'Dica: conte os novelos um por um, com o dedo.',
          },
        },
        {
          enigma: {
            tipo: 'pares',
            pergunta: {
              'pt-PT': 'Junta os novelos da mesma cor. Encontra os pares!',
              'pt-BR': 'Junte os novelos da mesma cor. Encontre os pares!',
            },
            emojis: ['🔴', '🟢', '🔵', '🟡'],
          },
          dica: {
            'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
            'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
          },
        },
      ],
    },
  ],
  extras: [
    {
      id: 'quadro',
      nome: { 'pt-PT': 'Quadro', 'pt-BR': 'Quadro' },
      emoji: '[[extras/quadro]]',
      zona: { x: 28, y: 24, largura: 16, altura: 20 },
      recompensa: {
        id: 'chave',
        emoji: '[[extras/chave-antiga]]',
        nome: { 'pt-PT': 'Chave pequena', 'pt-BR': 'Chave pequena' },
      },
      sucesso: {
        'pt-PT': 'Havia uma chave pequena atrás do quadro! 🗝️',
        'pt-BR': 'Havia uma chave pequena atrás do quadro! 🗝️',
      },
      variantes: [
        {
          enigma: {
            tipo: 'codigo',
            visual: '🐱 🐱 🐱 🐶 🐶',
            pergunta: {
              'pt-PT': 'O quadro tem um cadeado. Quantos animais há no quadro?',
              'pt-BR': 'O quadro tem um cadeado. Quantos animais há no quadro?',
            },
            resposta: '5',
          },
          dica: {
            'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os gatos e depois os cães.',
            'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os gatos e depois os cachorros.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🦆 🦆 🦆 🦆 🐸 🐸',
            pergunta: {
              'pt-PT': 'O quadro tem um cadeado. Quantos animais há no lago do quadro?',
              'pt-BR': 'O quadro tem um cadeado. Quantos animais há no lago do quadro?',
            },
            resposta: '6',
          },
          dica: {
            'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os patos e depois as rãs.',
            'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os patos e depois os sapos.',
          },
        },
        {
          enigma: {
            tipo: 'codigo',
            visual: '🌻 🌻 🌻 🌷 🌷 🌷 🌷',
            pergunta: {
              'pt-PT': 'O quadro tem um cadeado. Quantas flores há no quadro?',
              'pt-BR': 'O quadro tem um cadeado. Quantas flores há no quadro?',
            },
            resposta: '7',
          },
          dica: {
            'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os girassóis e depois as tulipas.',
            'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os girassóis e depois as tulipas.',
          },
        },
      ],
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta do sótão', 'pt-BR': 'Porta do sótão' },
    emoji: '[[cenas/porta-de-pedra]]',
    zona: { x: 50, y: 45, largura: 18, altura: 48 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa do sótão que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa do sótão que esconde um número. Digite os números na ordem dos desenhos.',
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
    'pt-PT': 'Clique! O cadeado abriu e a porta rangeu. Saíste do sótão e a avó esperava-te com um lanche. Que aventura!',
    'pt-BR': 'Clique! O cadeado abriu e a porta rangeu. Você saiu do sótão e a vovó esperava com um lanche. Que aventura!',
  },
};
