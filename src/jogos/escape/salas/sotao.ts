import type { Sala } from '../tipos';

/**
 * O Sótão da Avó. A saída é sempre a porta do sótão; o código (3 ou 4 números) sai de objetos sorteados entre
 * os 9 abaixo, cada um com várias versões do enigma. O quadro é um extra: esconde a chave do baú.
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: horas, contas de juntar e tirar,
 * padrões e adivinhas.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/sotao.jpg); para conferir, abra a sala com ?zonas.
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
  fundo: 'imagens/saida-secreta/sotao.jpg',
  fundoCss: 'linear-gradient(180deg, #3b2a4f 0%, #2a2040 60%, #4a3524 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da porta!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da porta!',
  },
  fontes: [
    {
      id: 'relogio',
      nome: { 'pt-PT': 'Relógio de pêndulo', 'pt-BR': 'Relógio de pêndulo' },
      emoji: '🕰️',
      zona: { x: 7.4, y: 37.5, largura: 12.9, altura: 55 },
      sucesso: {
        'pt-PT': 'O relógio voltou a andar e mostra o número {n}!',
        'pt-BR': 'O relógio voltou a andar e mostra o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🕓',
              pergunta: {
                'pt-PT': 'O relógio marca as 4 horas. Que horas serão daqui a 1 hora? Escreve o número.',
                'pt-BR': 'O relógio marca 4 horas. Que horas serão daqui a 1 hora? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: daqui a uma hora, o ponteiro pequeno anda para o número seguinte.',
              'pt-BR': 'Dica: daqui a uma hora, o ponteiro pequeno anda para o próximo número.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🕰️',
              pergunta: {
                'pt-PT': 'O relógio parou! Põe o dia por ordem: acordar, tomar o pequeno-almoço, ir à escola, tomar banho e dormir.',
                'pt-BR': 'O relógio parou! Coloque o dia em ordem: acordar, tomar café da manhã, ir para a escola, tomar banho e dormir.',
              },
              itens: ['⏰', '🥣', '🏫', '🛁', '🛏️'],
            },
            dica: {
              'pt-PT': 'Dica: o despertador toca primeiro. A cama fica para o fim do dia.',
              'pt-BR': 'Dica: o despertador toca primeiro. A cama fica para o fim do dia.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐦 🐦 ➕ 🐦',
              pergunta: {
                'pt-PT': 'O cuco saiu do relógio e cantou 2 vezes. Depois cantou mais 1 vez. Quantas vezes cantou?',
                'pt-BR': 'O cuco saiu do relógio e cantou 2 vezes. Depois cantou mais 1 vez. Quantas vezes ele cantou?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: conta os pássaros do desenho, de um lado e do outro.',
              'pt-BR': 'Dica: conte os passarinhos do desenho, de um lado e do outro.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🕒',
              pergunta: {
                'pt-PT': 'O relógio marca as 3 horas. A avó chega daqui a 5 horas. A que horas chega? Escreve o número.',
                'pt-BR': 'O relógio marca 3 horas. A vovó chega daqui a 5 horas. A que horas ela chega? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: começa nas 3 e conta 5 horas pelos dedos: 4, 5, 6, 7...',
              'pt-BR': 'Dica: comece nas 3 e conte 5 horas nos dedos: 4, 5, 6, 7...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🕰️',
              pergunta: {
                'pt-PT': 'O relógio baralhou as horas! Põe os relógios por ordem, da hora mais cedo à mais tarde.',
                'pt-BR': 'O relógio embaralhou as horas! Coloque os relógios em ordem, da hora mais cedo à mais tarde.',
              },
              itens: ['🕐', '🕑', '🕓', '🕖', '🕙'],
            },
            dica: {
              'pt-PT': 'Dica: olha só para o ponteiro pequeno. Primeiro a uma, depois as duas, as quatro, as sete e as dez.',
              'pt-BR': 'Dica: olhe só o ponteiro pequeno. Primeiro uma hora, depois duas, quatro, sete e dez.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐦 🕐 🕑 🕒',
              pergunta: {
                'pt-PT':
                  'O cuco canta tantas vezes quantas a hora: à uma canta uma vez, às duas canta duas vezes. Quantas vezes cantou ao todo, à uma, às duas e às três?',
                'pt-BR':
                  'O cuco canta tantas vezes quanto a hora: à uma canta uma vez, às duas canta duas vezes. Quantas vezes ele cantou ao todo, à uma, às duas e às três?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: soma as vezes de cada hora: uma, mais duas, mais três.',
              'pt-BR': 'Dica: some as vezes de cada hora: uma, mais duas, mais três.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🕓',
              pergunta: {
                'pt-PT': 'São 4 horas. A avó disse: «Vamos lanchar daqui a meia hora.» A que horas é o lanche?',
                'pt-BR': 'São 4 horas. A vovó disse: "Vamos lanchar daqui a meia hora." Que horas é o lanche?',
              },
              opcoes: [
                { emoji: '🕓', nome: { 'pt-PT': 'Quatro horas', 'pt-BR': 'Quatro horas' } },
                { emoji: '🕟', nome: { 'pt-PT': 'Quatro e meia', 'pt-BR': 'Quatro e meia' } },
                { emoji: '🕔', nome: { 'pt-PT': 'Cinco horas', 'pt-BR': 'Cinco horas' } },
                { emoji: '🕠', nome: { 'pt-PT': 'Cinco e meia', 'pt-BR': 'Cinco e meia' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: meia hora é metade de uma hora. O ponteiro grande dá meia volta e fica no 6.',
              'pt-BR': 'Dica: meia hora é metade de uma hora. O ponteiro grande dá meia volta e para no 6.',
            },
          },
        ],
      },
    },
    {
      id: 'bau',
      nome: { 'pt-PT': 'Baú de brinquedos', 'pt-BR': 'Baú de brinquedos' },
      emoji: '[[extras/ursinho]]',
      zona: { x: 13.9, y: 80.4, largura: 23.7, altura: 22.4 },
      requer: 'chave',
      bloqueado: {
        'pt-PT': 'O baú está trancado. Procura uma chave!',
        'pt-BR': 'O baú está trancado. Procure uma chave!',
      },
      sucesso: {
        'pt-PT': 'No fundo do baú estava o número {n}!',
        'pt-BR': 'No fundo do baú estava o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os brinquedos estão misturados. Encontra os cinco pares iguais!',
                'pt-BR': 'Os brinquedos estão misturados. Encontre os cinco pares iguais!',
              },
              emojis: ['🧸', '🚂', '🪁', '🎈', '🎲'],
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
                'pt-PT': 'Junta as coisas que andam juntas, como a bola e a baliza!',
                'pt-BR': 'Junte as coisas que combinam, como a bola e o gol!',
              },
              emojis: [
                ['⚽', '🥅'],
                ['🎨', '🖌️'],
                ['🎣', '🐟'],
                ['🔑', '🔒'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. A cana de pesca vai com o peixe e a chave vai com o cadeado.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. A vara de pescar vai com o peixe e a chave vai com o cadeado.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O número está no brinquedo que voa com o vento. Qual é?',
                'pt-BR': 'O número está no brinquedo que voa com o vento. Qual é?',
              },
              opcoes: [
                { emoji: '🧸', nome: { 'pt-PT': 'Ursinho', 'pt-BR': 'Ursinho' } },
                { emoji: '🚗', nome: { 'pt-PT': 'Carrinho', 'pt-BR': 'Carrinho' } },
                { emoji: '🪁', nome: { 'pt-PT': 'Papagaio de papel', 'pt-BR': 'Pipa' } },
                { emoji: '🎲', nome: { 'pt-PT': 'Dado', 'pt-BR': 'Dado' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: este brinquedo sobe no céu, preso a um fio.',
              'pt-BR': 'Dica: este brinquedo sobe no céu, preso a uma linha.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os brinquedos perderam o seu par! Vira as cartas e junta as coisas que andam juntas, como a bola e a baliza.',
                'pt-BR': 'Os brinquedos perderam o par! Vire as cartas e junte as coisas que combinam, como a bola e o gol.',
              },
              emojis: [
                ['⚽', '🥅'],
                ['🎨', '🖌️'],
                ['🪁', '🌬️'],
                ['🎣', '🐟'],
                ['🚂', '🛤️'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O papagaio de papel precisa de vento e o comboio precisa de carris.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. A pipa precisa de vento e o trem precisa de trilhos.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os brinquedos estão todos misturados. Encontra os seis pares iguais!',
                'pt-BR': 'Os brinquedos estão todos misturados. Encontre os seis pares iguais!',
              },
              emojis: ['🧸', '🚂', '🪁', '🎈', '🪀', '🎲'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde viste cada brinquedo.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde viu cada brinquedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT':
                  'O número está no brinquedo desta adivinha: tenho rodas, não tenho motor e ando quando me empurras com o pé. Quem sou?',
                'pt-BR':
                  'O número está no brinquedo desta adivinha: tenho rodas, não tenho motor e ando quando você me empurra com o pé. Quem sou eu?',
              },
              opcoes: [
                { emoji: '🚗', nome: { 'pt-PT': 'Carro', 'pt-BR': 'Carro' } },
                { emoji: '🚌', nome: { 'pt-PT': 'Autocarro', 'pt-BR': 'Ônibus' } },
                { emoji: '🛴', nome: { 'pt-PT': 'Trotinete', 'pt-BR': 'Patinete' } },
                { emoji: '🧸', nome: { 'pt-PT': 'Ursinho', 'pt-BR': 'Ursinho' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o carro e o autocarro têm motor. O ursinho não tem rodas.',
              'pt-BR': 'Dica: o carro e o ônibus têm motor. O ursinho não tem rodas.',
            },
          },
        ],
      },
    },
    {
      id: 'estante',
      nome: { 'pt-PT': 'Estante', 'pt-BR': 'Estante' },
      emoji: '[[cenas/biblioteca]]',
      zona: { x: 91.0, y: 40.3, largura: 16.5, altura: 53.6 },
      sucesso: {
        'pt-PT': 'Um livro caiu da estante com o número {n}!',
        'pt-BR': 'Um livro caiu da estante com o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Na estante há um livro de animais. Qual destes animais tem penas?',
                'pt-BR': 'Na estante tem um livro de animais. Qual destes animais tem penas?',
              },
              opcoes: [
                { emoji: '🐶', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Passarinho' } },
                { emoji: '🐱', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐰', nome: { 'pt-PT': 'Coelho', 'pt-BR': 'Coelho' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: três destes animais têm pelo. O outro tem asas.',
              'pt-BR': 'Dica: três destes animais têm pelo. O outro tem asas.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '📕 📘 📕 📘 📕 ❔',
              pergunta: {
                'pt-PT': 'Os livros da estante seguem uma regra. Qual é o livro que falta?',
                'pt-BR': 'Os livros da estante seguem uma regra. Qual livro falta?',
              },
              opcoes: [
                { emoji: '📕', nome: { 'pt-PT': 'Livro vermelho', 'pt-BR': 'Livro vermelho' } },
                { emoji: '📗', nome: { 'pt-PT': 'Livro verde', 'pt-BR': 'Livro verde' } },
                { emoji: '📘', nome: { 'pt-PT': 'Livro azul', 'pt-BR': 'Livro azul' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as cores vão trocando: vermelho, azul, vermelho, azul...',
              'pt-BR': 'Dica: as cores vão trocando: vermelho, azul, vermelho, azul...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📕 📕 📕 📘 📘',
              pergunta: {
                'pt-PT': 'Na prateleira há 3 livros vermelhos e 2 livros azuis. Quantos livros há ao todo?',
                'pt-BR': 'Na prateleira tem 3 livros vermelhos e 2 livros azuis. Quantos livros tem ao todo?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais dois: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais dois: quatro, cinco...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Na estante há um livro de animais. Qual destes animais não nasce de um ovo?',
                'pt-BR': 'Na estante tem um livro de animais. Qual destes animais não nasce de um ovo?',
              },
              opcoes: [
                { emoji: '🐔', nome: { 'pt-PT': 'Galinha', 'pt-BR': 'Galinha' } },
                { emoji: '🐢', nome: { 'pt-PT': 'Tartaruga', 'pt-BR': 'Tartaruga' } },
                { emoji: '🐍', nome: { 'pt-PT': 'Cobra', 'pt-BR': 'Cobra' } },
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: três destes animais nascem de um ovo. O outro, quando é pequenino, bebe o leite da mãe.',
              'pt-BR': 'Dica: três destes animais nascem de um ovo. O outro, quando é pequenininho, mama o leite da mãe.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Num livro de poemas há uma palavra que não rima com as outras. Qual é?',
                'pt-BR': 'Em um livro de poemas tem uma palavra que não rima com as outras. Qual é?',
              },
              opcoes: [
                { emoji: '🍞', nome: { 'pt-PT': 'Pão', 'pt-BR': 'Pão' } },
                { emoji: '✋', nome: { 'pt-PT': 'Mão', 'pt-BR': 'Mão' } },
                { emoji: '✈️', nome: { 'pt-PT': 'Avião', 'pt-BR': 'Avião' } },
                { emoji: '👞', nome: { 'pt-PT': 'Sapato', 'pt-BR': 'Sapato' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: diz as palavras em voz alta e ouve como acabam. Três acabam em «ão».',
              'pt-BR': 'Dica: fale as palavras em voz alta e ouça como terminam. Três terminam em "ão".',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '📕 📗 📘 📕 📗 📘 📕 📗 ❔',
              pergunta: {
                'pt-PT': 'Os livros da estante seguem uma regra. Qual é o livro que falta no fim?',
                'pt-BR': 'Os livros da estante seguem uma regra. Qual livro falta no fim?',
              },
              opcoes: [
                { emoji: '📕', nome: { 'pt-PT': 'Livro vermelho', 'pt-BR': 'Livro vermelho' } },
                { emoji: '📗', nome: { 'pt-PT': 'Livro verde', 'pt-BR': 'Livro verde' } },
                { emoji: '📘', nome: { 'pt-PT': 'Livro azul', 'pt-BR': 'Livro azul' } },
                { emoji: '📙', nome: { 'pt-PT': 'Livro laranja', 'pt-BR': 'Livro laranja' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as cores repetem-se de três em três: vermelho, verde, azul, vermelho...',
              'pt-BR': 'Dica: as cores se repetem de três em três: vermelho, verde, azul, vermelho...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📚 📚',
              pergunta: {
                'pt-PT': 'A estante tem 2 prateleiras e cada prateleira tem 4 livros. Quantos livros há na estante?',
                'pt-BR': 'A estante tem 2 prateleiras e cada prateleira tem 4 livros. Quantos livros tem na estante?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: 4 livros na primeira prateleira, mais 4 na segunda.',
              'pt-BR': 'Dica: 4 livros na primeira prateleira, mais 4 na segunda.',
            },
          },
        ],
      },
    },
    {
      id: 'cavalo',
      nome: { 'pt-PT': 'Cavalo de baloiço', 'pt-BR': 'Cavalo de balanço' },
      emoji: '🐴',
      zona: { x: 40.1, y: 78, largura: 23.2, altura: 30 },
      sucesso: {
        'pt-PT': 'Na sela do cavalo estava escrito o número {n}!',
        'pt-BR': 'Na sela do cavalo estava escrito o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐴 🐴',
              pergunta: {
                'pt-PT': 'Quantas patas têm os dois cavalos juntos? Escreve o número.',
                'pt-BR': 'Quantas patas os dois cavalos têm juntos? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: cada cavalo tem 4 patas. Conta as do primeiro e continua no segundo.',
              'pt-BR': 'Dica: cada cavalo tem 4 patas. Conte as do primeiro e continue no segundo.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe os animais por ordem, do mais pequeno ao maior.',
                'pt-BR': 'Coloque os animais em ordem, do menor ao maior.',
              },
              itens: ['🐜', '🐭', '🐱', '🐴', '🐘'],
            },
            dica: {
              'pt-PT': 'Dica: a formiga é a mais pequena e o elefante é o maior.',
              'pt-BR': 'Dica: a formiga é a menor e o elefante é o maior.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🥕 🥕 🥕 ➕ 🥕 🥕',
              pergunta: {
                'pt-PT': 'O cavalo comeu 3 cenouras e depois mais 2. Quantas cenouras comeu?',
                'pt-BR': 'O cavalo comeu 3 cenouras e depois mais 2. Quantas cenouras ele comeu?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais dois: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais dois: quatro, cinco...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐴 🐴 🐔',
              pergunta: {
                'pt-PT': 'No campo há 2 cavalos e 1 galinha. Quantas patas há ao todo? Escreve o número.',
                'pt-BR': 'No campo tem 2 cavalos e 1 galinha. Quantas patas tem ao todo? Digite o número.',
              },
              resposta: '10',
            },
            dica: {
              'pt-PT': 'Dica: cada cavalo tem 4 patas e a galinha tem 2. Soma tudo: 4, mais 4, mais 2.',
              'pt-BR': 'Dica: cada cavalo tem 4 patas e a galinha tem 2. Some tudo: 4, mais 4, mais 2.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe os animais por ordem, do mais leve ao mais pesado.',
                'pt-BR': 'Coloque os animais em ordem, do mais leve ao mais pesado.',
              },
              itens: ['🐭', '🐇', '🐕', '🐴', '🐘'],
            },
            dica: {
              'pt-PT': 'Dica: o rato é o mais leve e o elefante é o mais pesado. O coelho pesa menos do que o cão.',
              'pt-BR': 'Dica: o rato é o mais leve e o elefante é o mais pesado. O coelho pesa menos que o cachorro.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐴 🥕🥕🥕 🥕',
              pergunta: {
                'pt-PT': 'O cavalo come 3 cenouras de manhã e 1 à tarde. Quantas cenouras come em 2 dias?',
                'pt-BR': 'O cavalo come 3 cenouras de manhã e 1 à tarde. Quantas cenouras ele come em 2 dias?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: primeiro vê quantas come num dia (3 mais 1). Depois junta outro dia igual.',
              'pt-BR': 'Dica: primeiro veja quantas ele come em um dia (3 mais 1). Depois junte outro dia igual.',
            },
          },
        ],
      },
    },
    {
      id: 'caixa-musica',
      nome: { 'pt-PT': 'Caixa de música', 'pt-BR': 'Caixa de música' },
      emoji: '🎵',
      zona: { x: 25.7, y: 44.7, largura: 10.1, altura: 13.5 },
      sucesso: {
        'pt-PT': 'A bailarina rodou e apontou para o número {n}!',
        'pt-BR': 'A bailarina girou e apontou para o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A caixa de música só toca para quem souber: qual destes instrumentos tem cordas?',
                'pt-BR': 'A caixa de música só toca para quem souber: qual destes instrumentos tem cordas?',
              },
              opcoes: [
                { emoji: '🥁', nome: { 'pt-PT': 'Tambor', 'pt-BR': 'Tambor' } },
                { emoji: '🎺', nome: { 'pt-PT': 'Trompete', 'pt-BR': 'Trompete' } },
                { emoji: '🎻', nome: { 'pt-PT': 'Violino', 'pt-BR': 'Violino' } },
                { emoji: '🎷', nome: { 'pt-PT': 'Saxofone', 'pt-BR': 'Saxofone' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as cordas são fios esticados que vibram. O tambor bate-se e os outros dois sopram-se.',
              'pt-BR': 'Dica: as cordas são fios esticados que vibram. O tambor a gente bate e nos outros dois a gente sopra.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os instrumentos fugiram da caixa! Encontra os cinco pares iguais.',
                'pt-BR': 'Os instrumentos fugiram da caixa! Encontre os cinco pares iguais.',
              },
              emojis: ['🥁', '🎺', '🎹', '🎻', '🎸'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💃',
              pergunta: {
                'pt-PT': 'A bailarina deu 4 voltas e depois mais 2. Quantas voltas deu?',
                'pt-BR': 'A bailarina deu 4 voltas e depois mais 2. Quantas voltas ela deu?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta mais dois: cinco, seis...',
              'pt-BR': 'Dica: comece no 4 e conte mais dois: cinco, seis...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A caixa de música só toca para quem souber: qual destes instrumentos se toca a soprar?',
                'pt-BR': 'A caixa de música só toca para quem souber: qual destes instrumentos a gente toca soprando?',
              },
              opcoes: [
                { emoji: '🥁', nome: { 'pt-PT': 'Tambor', 'pt-BR': 'Tambor' } },
                { emoji: '🎹', nome: { 'pt-PT': 'Piano', 'pt-BR': 'Piano' } },
                { emoji: '🎺', nome: { 'pt-PT': 'Trompete', 'pt-BR': 'Trompete' } },
                { emoji: '🎻', nome: { 'pt-PT': 'Violino', 'pt-BR': 'Violino' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o tambor, o piano e o violino tocam-se com as mãos. O outro precisa do ar da boca.',
              'pt-BR': 'Dica: o tambor, o piano e o violino são tocados com as mãos. O outro precisa do ar da boca.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os instrumentos fugiram da caixa! Encontra os seis pares iguais.',
                'pt-BR': 'Os instrumentos fugiram da caixa! Encontre os seis pares iguais.',
              },
              emojis: ['🥁', '🎺', '🎹', '🎻', '🎸', '🎷'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde viste cada instrumento.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde viu cada instrumento.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💃 🎵 🎵 🎵',
              pergunta: {
                'pt-PT': 'A bailarina dá 3 voltas em cada música. A caixa tocou 3 músicas. Quantas voltas deu a bailarina?',
                'pt-BR': 'A bailarina dá 3 voltas em cada música. A caixa tocou 3 músicas. Quantas voltas a bailarina deu?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: 3 voltas na primeira música, mais 3 na segunda, mais 3 na terceira.',
              'pt-BR': 'Dica: 3 voltas na primeira música, mais 3 na segunda, mais 3 na terceira.',
            },
          },
        ],
      },
    },
    {
      id: 'chapeus',
      nome: { 'pt-PT': 'Cabide de chapéus', 'pt-BR': 'Cabide de chapéus' },
      emoji: '🎩',
      zona: { x: 67.6, y: 43.5, largura: 14.2, altura: 42 },
      sucesso: {
        'pt-PT': 'Dentro de um chapéu havia um papel com o número {n}!',
        'pt-BR': 'Dentro de um chapéu havia um papel com o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '👒 🎩 👒 🧢 👒 🎩 👒 👒',
              pergunta: {
                'pt-PT': 'Quantos chapéus de palha há no cabide? Não contes os outros.',
                'pt-BR': 'Quantos chapéus de palha tem no cabide? Não conte os outros.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: o chapéu de palha é o amarelo, com uma fita. Conta só esses.',
              'pt-BR': 'Dica: o chapéu de palha é o amarelo, com uma fita. Conte só esses.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🎩 👒 🎩 🧢 👒',
              pergunta: {
                'pt-PT': 'Havia 5 chapéus no cabide e a avó tirou 1. Quantos chapéus ficaram?',
                'pt-BR': 'Tinha 5 chapéus no cabide e a vovó tirou 1. Quantos chapéus ficaram?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: tirar um é contar para trás uma vez: 5, 4...',
              'pt-BR': 'Dica: tirar um é contar para trás uma vez: 5, 4...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A avó vai à praia. Que chapéu leva para se proteger do sol?',
                'pt-BR': 'A vovó vai à praia. Que chapéu ela leva para se proteger do sol?',
              },
              opcoes: [
                { emoji: '🎩', nome: { 'pt-PT': 'Cartola', 'pt-BR': 'Cartola' } },
                { emoji: '👒', nome: { 'pt-PT': 'Chapéu de palha', 'pt-BR': 'Chapéu de palha' } },
                { emoji: '👑', nome: { 'pt-PT': 'Coroa', 'pt-BR': 'Coroa' } },
                { emoji: '⛑️', nome: { 'pt-PT': 'Capacete', 'pt-BR': 'Capacete' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: é leve, fresco e tem uma aba grande que faz sombra.',
              'pt-BR': 'Dica: é leve, fresco e tem uma aba grande que faz sombra.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🎩 👒 🎩 🧢 👒 🎩 👒',
              pergunta: {
                'pt-PT': 'Há 7 chapéus no cabide. A avó tirou 2 e pendurou mais 1. Quantos chapéus há agora?',
                'pt-BR': 'Tem 7 chapéus no cabide. A vovó tirou 2 e pendurou mais 1. Quantos chapéus tem agora?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: primeiro tira 2 aos 7, depois junta 1.',
              'pt-BR': 'Dica: primeiro tire 2 de 7, depois junte 1.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🎩 👒 🎩 🧢 👒 🎩 🧢 👒',
              pergunta: {
                'pt-PT': 'Quantos chapéus do cabide não são cartolas?',
                'pt-BR': 'Quantos chapéus do cabide não são cartolas?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a cartola é o chapéu alto e preto. Conta todos os chapéus e tira as cartolas.',
              'pt-BR': 'Dica: a cartola é o chapéu alto e preto. Conte todos os chapéus e tire as cartolas.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é o chapéu preferido da avó: não é preto, não tem pala e não é de palha.',
                'pt-BR': 'Adivinhe qual é o chapéu preferido da vovó: não é preto, não tem aba na frente e não é de palha.',
              },
              opcoes: [
                { emoji: '🎩', nome: { 'pt-PT': 'Cartola', 'pt-BR': 'Cartola' } },
                { emoji: '🧢', nome: { 'pt-PT': 'Boné', 'pt-BR': 'Boné' } },
                { emoji: '👒', nome: { 'pt-PT': 'Chapéu de palha', 'pt-BR': 'Chapéu de palha' } },
                { emoji: '👑', nome: { 'pt-PT': 'Coroa', 'pt-BR': 'Coroa' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. A cartola é preta, o boné tem pala e o chapéu de palha é de palha. Qual sobra?',
              'pt-BR': 'Dica: vá riscando. A cartola é preta, o boné tem aba na frente e o chapéu de palha é de palha. Qual sobra?',
            },
          },
        ],
      },
    },
    {
      id: 'janela',
      nome: { 'pt-PT': 'Janela redonda', 'pt-BR': 'Janela redonda' },
      emoji: '🪟',
      zona: { x: 73.1, y: 14.8, largura: 17.0, altura: 20.5 },
      sucesso: {
        'pt-PT': 'No vidro embaciado apareceu o número {n}!',
        'pt-BR': 'No vidro embaçado apareceu o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Pela janela vês o jardim. Põe a macieira por ordem, da semente até à maçã.',
                'pt-BR': 'Pela janela você vê o jardim. Coloque a macieira em ordem, da semente até a maçã.',
              },
              itens: ['🌰', '🌱', '🌿', '🌳', '🍎'],
            },
            dica: {
              'pt-PT': 'Dica: primeiro a semente, depois a planta cresce até ser árvore, e no fim dá a maçã.',
              'pt-BR': 'Dica: primeiro a semente, depois a planta cresce até virar árvore, e no fim dá a maçã.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐦 🐦 🐦 🐦 🐦 🐦',
              pergunta: {
                'pt-PT': 'Na janela estavam 6 pássaros e voaram 2. Quantos ficaram?',
                'pt-BR': 'Na janela estavam 6 passarinhos e voaram 2. Quantos ficaram?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: tapa dois pássaros com o dedo e conta os que sobram.',
              'pt-BR': 'Dica: cubra dois passarinhos com o dedo e conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '❄️',
              pergunta: {
                'pt-PT': 'Lá fora está a nevar! O que vestes para não teres frio?',
                'pt-BR': 'Lá fora está nevando! O que você veste para não sentir frio?',
              },
              opcoes: [
                { emoji: '🧣', nome: { 'pt-PT': 'Cachecol', 'pt-BR': 'Cachecol' } },
                { emoji: '🩳', nome: { 'pt-PT': 'Calções', 'pt-BR': 'Bermuda' } },
                { emoji: '🕶️', nome: { 'pt-PT': 'Óculos de sol', 'pt-BR': 'Óculos de sol' } },
                { emoji: '🩴', nome: { 'pt-PT': 'Chinelos', 'pt-BR': 'Chinelos' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: põe-se à volta do pescoço e aquece.',
              'pt-BR': 'Dica: a gente coloca em volta do pescoço e esquenta.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'De noite, pela janela, vês a lua a crescer. Põe as luas por ordem, da lua nova até à lua cheia.',
                'pt-BR': 'De noite, pela janela, você vê a lua crescendo. Coloque as luas em ordem, da lua nova até a lua cheia.',
              },
              itens: ['🌑', '🌒', '🌓', '🌔', '🌕'],
            },
            dica: {
              'pt-PT': 'Dica: a lua nova é toda escura. Depois a parte com luz fica cada vez maior, até a lua ficar redonda.',
              'pt-BR': 'Dica: a lua nova é toda escura. Depois a parte com luz fica cada vez maior, até a lua ficar redonda.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦',
              pergunta: {
                'pt-PT': 'Na janela estavam 9 pássaros. Voaram 4 e depois chegaram 2. Quantos pássaros estão agora na janela?',
                'pt-BR': 'Na janela estavam 9 passarinhos. Voaram 4 e depois chegaram 2. Quantos passarinhos estão agora na janela?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: primeiro tira 4 aos 9, depois junta 2.',
              'pt-BR': 'Dica: primeiro tire 4 de 9, depois junte 2.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌅',
              pergunta: {
                'pt-PT': 'Pela janela vês o sol a nascer. Para que lado estás a olhar?',
                'pt-BR': 'Pela janela você vê o sol nascendo. Para que lado você está olhando?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Norte', 'pt-BR': 'Norte' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Sul', 'pt-BR': 'Sul' } },
                { emoji: '➡️', nome: { 'pt-PT': 'Este', 'pt-BR': 'Leste' } },
                { emoji: '⬅️', nome: { 'pt-PT': 'Oeste', 'pt-BR': 'Oeste' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o sol nasce sempre do mesmo lado, a que se chama nascente ou este.',
              'pt-BR': 'Dica: o sol nasce sempre do mesmo lado, que se chama nascente ou leste.',
            },
          },
        ],
      },
    },
    {
      id: 'mala',
      nome: { 'pt-PT': 'Mala de viagem', 'pt-BR': 'Mala de viagem' },
      emoji: '🧳',
      zona: { x: 66.6, y: 80.9, largura: 22.1, altura: 22.7 },
      sucesso: {
        'pt-PT': 'A mala abriu! Lá dentro havia um postal com o número {n}.',
        'pt-BR': 'A mala abriu! Lá dentro havia um cartão-postal com o número {n}.',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🚲 🚲',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com o número de rodas de duas bicicletas.',
                'pt-BR': 'O cadeado da mala abre com o número de rodas de duas bicicletas.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: cada bicicleta tem 2 rodas. Conta as rodas das duas.',
              'pt-BR': 'Dica: cada bicicleta tem 2 rodas. Conte as rodas das duas.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦆 ➕ 🐱',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com as patas de um pato mais as patas de um gato.',
                'pt-BR': 'O cadeado da mala abre com as patas de um pato mais as patas de um gato.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: o pato tem 2 patas e o gato tem 4.',
              'pt-BR': 'Dica: o pato tem 2 patas e o gato tem 4.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '✋ ➕ ✌️',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com os dedos de uma mão mais dois.',
                'pt-BR': 'O cadeado da mala abre com os dedos de uma mão mais dois.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: uma mão tem 5 dedos. Conta mais dois: seis, sete...',
              'pt-BR': 'Dica: uma mão tem 5 dedos. Conte mais dois: seis, sete...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🕷️ ➖ 🐶',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com as patas de uma aranha menos as patas de um cão.',
                'pt-BR': 'O cadeado da mala abre com as patas de uma aranha menos as patas de um cachorro.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: a aranha tem 8 patas e o cão tem 4.',
              'pt-BR': 'Dica: a aranha tem 8 patas e o cachorro tem 4.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐞',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com o número de patas de uma joaninha.',
                'pt-BR': 'O cadeado da mala abre com o número de patas de uma joaninha.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: a joaninha é um inseto, e todos os insetos têm 3 patas de cada lado.',
              'pt-BR': 'Dica: a joaninha é um inseto, e todos os insetos têm 3 patas de cada lado.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📅',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com o número de dias de uma semana.',
                'pt-BR': 'O cadeado da mala abre com o número de dias de uma semana.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: diz os dias da semana e conta pelos dedos: segunda-feira, terça-feira...',
              'pt-BR': 'Dica: fale os dias da semana e conte nos dedos: segunda-feira, terça-feira...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🙌 ➖ ☝️',
              pergunta: {
                'pt-PT': 'O cadeado da mala abre com os dedos das duas mãos menos um.',
                'pt-BR': 'O cadeado da mala abre com os dedos das duas mãos menos um.',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: as duas mãos juntas têm 10 dedos. Tira um.',
              'pt-BR': 'Dica: as duas mãos juntas têm 10 dedos. Tire um.',
            },
          },
        ],
      },
    },
    {
      id: 'novelos',
      nome: { 'pt-PT': 'Cesto de novelos', 'pt-BR': 'Cesto de novelos' },
      emoji: '🧶',
      zona: { x: 89.4, y: 80.0, largura: 17.9, altura: 22.7 },
      sucesso: {
        'pt-PT': 'Enrolado num novelo estava o número {n}!',
        'pt-BR': 'Enrolado num novelo estava o número {n}!',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔴 🔴 🟡 🔴 🔴 🟡 🔴 ❔',
              pergunta: {
                'pt-PT': 'A avó está a fazer um cachecol com uma regra de cores. Que cor vem a seguir?',
                'pt-BR': 'A vovó está fazendo um cachecol com uma regra de cores. Que cor vem depois?',
              },
              opcoes: [
                { emoji: '🔴', nome: { 'pt-PT': 'Vermelho', 'pt-BR': 'Vermelho' } },
                { emoji: '🟡', nome: { 'pt-PT': 'Amarelo', 'pt-BR': 'Amarelo' } },
                { emoji: '🔵', nome: { 'pt-PT': 'Azul', 'pt-BR': 'Azul' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: vêm sempre dois vermelhos e depois um amarelo.',
              'pt-BR': 'Dica: sempre vêm dois vermelhos e depois um amarelo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧶 🧶 🧶 🧶 🧶 🧶 🧶 🧶',
              pergunta: {
                'pt-PT': 'A avó tinha 8 novelos e usou 3 num cachecol. Quantos novelos sobraram?',
                'pt-BR': 'A vovó tinha 8 novelos e usou 3 em um cachecol. Quantos novelos sobraram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: tapa três novelos com os dedos e conta os que sobram.',
              'pt-BR': 'Dica: cubra três novelos com os dedos e conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta os novelos da mesma cor. Encontra os cinco pares!',
                'pt-BR': 'Junte os novelos da mesma cor. Encontre os cinco pares!',
              },
              emojis: ['🔴', '🟡', '🟢', '🔵', '🟣'],
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
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Arruma os seis novelos pelas cores do arco-íris.',
                'pt-BR': 'Organize os seis novelos nas cores do arco-íris.',
              },
              itens: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
            },
            dica: {
              'pt-PT': 'Dica: vermelho, laranja, amarelo, verde, azul e roxo.',
              'pt-BR': 'Dica: vermelho, laranja, amarelo, verde, azul e roxo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧶 🧶 🧶 🧶 🧶 🧶 🧶 🧶 🧶',
              pergunta: {
                'pt-PT': 'A avó tinha 9 novelos. Usou 2 num cachecol e 3 numa camisola. Quantos novelos sobraram?',
                'pt-BR': 'A vovó tinha 9 novelos. Usou 2 em um cachecol e 3 em uma blusa de lã. Quantos novelos sobraram?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: junta primeiro os novelos que ela usou (2 mais 3) e depois tira-os aos 9.',
              'pt-BR': 'Dica: junte primeiro os novelos que ela usou (2 mais 3) e depois tire de 9.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔴 🔵 🔵 🔴 🔵 🔵 🔴 ❔',
              pergunta: {
                'pt-PT': 'A avó está a tricotar um cachecol com uma regra de cores. Que cor vem a seguir?',
                'pt-BR': 'A vovó está tricotando um cachecol com uma regra de cores. Que cor vem depois?',
              },
              opcoes: [
                { emoji: '🔴', nome: { 'pt-PT': 'Vermelho', 'pt-BR': 'Vermelho' } },
                { emoji: '🔵', nome: { 'pt-PT': 'Azul', 'pt-BR': 'Azul' } },
                { emoji: '🟢', nome: { 'pt-PT': 'Verde', 'pt-BR': 'Verde' } },
                { emoji: '🟡', nome: { 'pt-PT': 'Amarelo', 'pt-BR': 'Amarelo' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: depois de cada vermelho vêm sempre dois azuis.',
              'pt-BR': 'Dica: depois de cada vermelho sempre vêm dois azuis.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta os novelos da mesma cor. Encontra os seis pares!',
                'pt-BR': 'Junte os novelos da mesma cor. Encontre os seis pares!',
              },
              emojis: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde viste cada cor.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde viu cada cor.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'quadro',
      nome: { 'pt-PT': 'Quadro', 'pt-BR': 'Quadro' },
      emoji: '[[extras/quadro]]',
      zona: { x: 25.6, y: 24.8, largura: 16.8, altura: 18.4 },
      recompensa: {
        id: 'chave',
        emoji: '[[extras/chave-antiga]]',
        nome: { 'pt-PT': 'Chave pequena', 'pt-BR': 'Chave pequena' },
      },
      sucesso: {
        'pt-PT': 'Havia uma chave pequena atrás do quadro! 🗝️',
        'pt-BR': 'Havia uma chave pequena atrás do quadro! 🗝️',
      },
      variantes: {
        facil: [
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
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐱 🐱 🐱 🐱 🐶 🐶 🐶 🐶 🐶',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado. Quantos animais há no quadro?',
                'pt-BR': 'O quadro tem um cadeado. Quantos animais tem no quadro?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os gatos e continua a contar nos cães.',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os gatos e continue contando nos cachorros.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦆 🦆 🦆 🦆',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado. No lago havia 4 patos e chegaram mais 3. Quantos patos há agora?',
                'pt-BR': 'O quadro tem um cadeado. No lago tinha 4 patos e chegaram mais 3. Quantos patos tem agora?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Começa no 4 e conta mais três.',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Comece no 4 e conte mais três.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌻 🌻 🌻 🌷 🌷 🌷 🌷 🌷',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado. Quantas flores há no quadro?',
                'pt-BR': 'O quadro tem um cadeado. Quantas flores tem no quadro?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os girassóis e continua nas tulipas.',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os girassóis e continue nas tulipas.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐱 🐱 🐱 🐶 🐶',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado de dois números: primeiro quantos gatos, depois quantos cães. Escreve os dois números.',
                'pt-BR': 'O quadro tem um cadeado de dois números: primeiro quantos gatos, depois quantos cachorros. Digite os dois números.',
              },
              resposta: '32',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Conta os gatos e escreve esse número. Depois faz o mesmo com os cães.',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Conte os gatos e digite esse número. Depois faça o mesmo com os cachorros.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦆 🦆 🦆 🦆 🐸 🐸',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado. Os patos têm 2 patas e as rãs têm 4. Quantas patas há no lago do quadro?',
                'pt-BR': 'O quadro tem um cadeado. Os patos têm 2 patas e os sapos têm 4. Quantas patas tem no lago do quadro?',
              },
              resposta: '16',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Os 4 patos têm 8 patas. Agora junta as patas das rãs.',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Os 4 patos têm 8 patas. Agora junte as patas dos sapos.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌻 🌻 🌻 🌷 🌷 🌷 🌷',
              pergunta: {
                'pt-PT': 'O quadro tem um cadeado. Quantas tulipas há a mais do que girassóis?',
                'pt-BR': 'O quadro tem um cadeado. Quantas tulipas tem a mais que girassóis?',
              },
              resposta: '1',
            },
            dica: {
              'pt-PT': 'Dica: a chave do baú está atrás do quadro. Junta cada girassol a uma tulipa. Quantas tulipas ficam sozinhas?',
              'pt-BR': 'Dica: a chave do baú está atrás do quadro. Junte cada girassol com uma tulipa. Quantas tulipas ficam sozinhas?',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta do sótão', 'pt-BR': 'Porta do sótão' },
    emoji: '[[cenas/porta-de-pedra]]',
    zona: { x: 47.6, y: 38.8, largura: 21.6, altura: 48.7 },
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
