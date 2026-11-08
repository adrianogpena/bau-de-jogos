import type { Sala } from '../tipos';

/**
 * O Laboratório do Inventor. A saída é sempre a porta de engrenagens; o código (3 ou 4 números) sai de objetos
 * sorteados entre os 9 abaixo, cada um com várias versões do enigma. Dois extras dão pistas: a estante do
 * microscópio esconde os óculos de proteção (para os tubos de ensaio) e a mesa com gaveta esconde a pilha (para o
 * robô de latas).
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: misturas de cores, causa e efeito,
 * formas e metades, rodas e alavancas, comparar pesos na balança.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/laboratorio.jpg); para conferir, abra a sala com ?zonas.
 */
export const laboratorio: Sala = {
  id: 'laboratorio',
  emoji: '🧪',
  cor: '#9be7a8',
  titulo: { 'pt-PT': 'O Laboratório do Inventor', 'pt-BR': 'O Laboratório do Inventor' },
  resumo: {
    'pt-PT': 'A porta de engrenagens trancou-se e ficaste preso no laboratório. Descobre o código!',
    'pt-BR': 'A porta de engrenagens se trancou e você ficou preso no laboratório. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Vieste visitar o laboratório do Professor Parafuso. Ele saiu para almoçar e, de repente, a porta de engrenagens trancou-se! Na porta há um cadeado com desenhos de coisas do laboratório. O professor escondeu um número em cada experiência. Descobre os números e abre a porta!',
    'pt-BR':
      'Você veio visitar o laboratório do Professor Parafuso. Ele saiu para almoçar e, de repente, a porta de engrenagens se trancou! Na porta há um cadeado com desenhos de coisas do laboratório. O professor escondeu um número em cada experiência. Descubra os números e abra a porta!',
  },
  fundo: 'imagens/saida-secreta/laboratorio.jpg',
  fundoCss: 'linear-gradient(180deg, #cfe9c4 0%, #b8dcae 55%, #c98b4e 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas esta experiência não tem nenhum número desta vez. Olha para o cadeado da porta!',
    'pt-BR': 'Você procurou bem, mas esta experiência não tem nenhum número desta vez. Olhe o cadeado da porta!',
  },
  fontes: [
    {
      id: 'frascos',
      nome: { 'pt-PT': 'Armário de frascos', 'pt-BR': 'Armário de frascos' },
      emoji: '⚗️',
      zona: { x: 7.9, y: 30.2, largura: 15.8, altura: 58.8 },
      sucesso: {
        'pt-PT': 'Atrás de um frasco estava o número {n}!',
        'pt-BR': 'Atrás de um frasco estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🍅',
              pergunta: {
                'pt-PT': 'O professor precisa do frasco com o líquido da cor do tomate. Qual é?',
                'pt-BR': 'O professor precisa do frasco com o líquido da cor do tomate. Qual é?',
              },
              opcoes: [
                { emoji: '🔵', nome: { 'pt-PT': 'Líquido azul', 'pt-BR': 'Líquido azul' } },
                { emoji: '🟢', nome: { 'pt-PT': 'Líquido verde', 'pt-BR': 'Líquido verde' } },
                { emoji: '🔴', nome: { 'pt-PT': 'Líquido vermelho', 'pt-BR': 'Líquido vermelho' } },
                { emoji: '🟡', nome: { 'pt-PT': 'Líquido amarelo', 'pt-BR': 'Líquido amarelo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: olha bem para o tomate. De que cor é?',
              'pt-BR': 'Dica: olhe bem o tomate. De que cor ele é?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧪 🫙 🧪 🧪 🫙 🧪',
              pergunta: {
                'pt-PT': 'Na prateleira há frascos cheios 🧪 e frascos vazios 🫙. Quantos frascos estão cheios?',
                'pt-BR': 'Na prateleira tem frascos cheios 🧪 e frascos vazios 🫙. Quantos frascos estão cheios?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta só os frascos que têm líquido colorido, um a um.',
              'pt-BR': 'Dica: conte só os frascos que têm líquido colorido, um por um.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os frascos saíram do armário! Encontra os pares iguais.',
                'pt-BR': 'Os frascos saíram do armário! Encontre os pares iguais.',
              },
              emojis: ['🧪', '⚗️', '🫙', '🍯'],
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
              visual: '🫙 💧 🧼',
              pergunta: {
                'pt-PT': 'O professor pôs água e sabão num frasco, tapou-o e abanou-o com força. O que aparece?',
                'pt-BR': 'O professor colocou água e sabão em um frasco, tampou e sacudiu com força. O que aparece?',
              },
              opcoes: [
                { emoji: '🧊', nome: { 'pt-PT': 'Gelo', 'pt-BR': 'Gelo' } },
                { emoji: '🫧', nome: { 'pt-PT': 'Espuma', 'pt-BR': 'Espuma' } },
                { emoji: '🔥', nome: { 'pt-PT': 'Fogo', 'pt-BR': 'Fogo' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedras', 'pt-BR': 'Pedras' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: lembra-te do banho. O que faz o sabão quando o mexes na água?',
              'pt-BR': 'Dica: lembre do banho. O que o sabão faz quando você mexe ele na água?',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'O professor pôs gotas nos frascos. Põe os frascos por ordem, do que tem menos gotas ao que tem mais.',
                'pt-BR': 'O professor colocou gotas nos frascos. Coloque os frascos em ordem, do que tem menos gotas ao que tem mais.',
              },
              itens: ['💧', '💧💧', '💧💧💧', '💧💧💧💧', '💧💧💧💧💧'],
            },
            dica: {
              'pt-PT': 'Dica: começa pelo frasco que só tem uma gota.',
              'pt-BR': 'Dica: comece pelo frasco que só tem uma gota.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧪 🧪 🧪 🧪 🧪 🧪 🧪 🧪',
              pergunta: {
                'pt-PT': 'No armário há 8 frascos e metade estão cheios. Quantos frascos estão cheios?',
                'pt-BR': 'No armário tem 8 frascos e metade estão cheios. Quantos frascos estão cheios?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: metade é dividir em dois grupos iguais. Tapa metade dos frascos com a mão.',
              'pt-BR': 'Dica: metade é dividir em dois grupos iguais. Cubra metade dos frascos com a mão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Faz a experiência do sal pela ordem certa: o frasco vazio, pôr água, deitar o sal, mexer com a colher e o sal desaparece.',
                'pt-BR':
                  'Faça a experiência do sal na ordem certa: o frasco vazio, colocar água, jogar o sal, mexer com a colher e o sal desaparece.',
              },
              itens: ['🫙', '💧', '🧂', '🥄', '✨'],
            },
            dica: {
              'pt-PT': 'Dica: primeiro precisas do frasco vazio. Só se mexe depois de deitar o sal.',
              'pt-BR': 'Dica: primeiro você precisa do frasco vazio. Só dá para mexer depois de jogar o sal.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Tenho dois frascos iguais, cada um a meio. Se juntar a água dos dois num só frasco, o que fico a ter?',
                'pt-BR': 'Tenho dois frascos iguais, cada um pela metade. Se juntar a água dos dois em um só frasco, o que eu fico tendo?',
              },
              opcoes: [
                { emoji: '🫙', nome: { 'pt-PT': 'Um frasco vazio', 'pt-BR': 'Um frasco vazio' } },
                { emoji: '💧', nome: { 'pt-PT': 'Uma gota', 'pt-BR': 'Uma gota' } },
                { emoji: '🧪', nome: { 'pt-PT': 'Um frasco cheio', 'pt-BR': 'Um frasco cheio' } },
                { emoji: '🧪🧪', nome: { 'pt-PT': 'Dois frascos cheios', 'pt-BR': 'Dois frascos cheios' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: duas metades juntas fazem um inteiro.',
              'pt-BR': 'Dica: duas metades juntas formam um inteiro.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧪 🧪 🧪 ➕ ½ ½',
              pergunta: {
                'pt-PT':
                  'No armário há 3 frascos cheios e 2 frascos a meio. Se juntar a água dos frascos a meio, quantos frascos cheios fico a ter?',
                'pt-BR':
                  'No armário tem 3 frascos cheios e 2 frascos pela metade. Se juntar a água dos frascos pela metade, com quantos frascos cheios eu fico?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: primeiro junta as duas metades. Quantos frascos cheios dão?',
              'pt-BR': 'Dica: primeiro junte as duas metades. Quantos frascos cheios elas dão?',
            },
          },
        ],
      },
    },
    {
      id: 'quadro',
      nome: { 'pt-PT': 'Quadro de giz', 'pt-BR': 'Lousa' },
      emoji: '🔺',
      zona: { x: 27.9, y: 19.0, largura: 21.9, altura: 22.9 },
      sucesso: {
        'pt-PT': 'No quadro de giz apareceu o número {n}!',
        'pt-BR': 'Na lousa apareceu o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O professor desenhou formas no quadro de giz. Qual é o círculo?',
                'pt-BR': 'O professor desenhou formas na lousa. Qual é o círculo?',
              },
              opcoes: [
                { emoji: '🔺', nome: { 'pt-PT': 'Triângulo', 'pt-BR': 'Triângulo' } },
                { emoji: '🟦', nome: { 'pt-PT': 'Quadrado', 'pt-BR': 'Quadrado' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '⚪', nome: { 'pt-PT': 'Círculo', 'pt-BR': 'Círculo' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o círculo é redondo como uma bola e não tem cantos.',
              'pt-BR': 'Dica: o círculo é redondo como uma bola e não tem cantos.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔺 🔺 🔺 🔺 🔺',
              pergunta: {
                'pt-PT': 'Quantos triângulos estão desenhados no quadro de giz? Escreve o número.',
                'pt-BR': 'Quantos triângulos estão desenhados na lousa? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta os triângulos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os triângulos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As formas do quadro de giz misturaram-se. Encontra os pares iguais!',
                'pt-BR': 'As formas da lousa se misturaram. Encontre os pares iguais!',
              },
              emojis: ['⚪', '🔺', '🟦', '⭐'],
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
                'pt-PT': 'Qual destas formas tem 3 lados?',
                'pt-BR': 'Qual destas formas tem 3 lados?',
              },
              opcoes: [
                { emoji: '🟦', nome: { 'pt-PT': 'Quadrado', 'pt-BR': 'Quadrado' } },
                { emoji: '🔺', nome: { 'pt-PT': 'Triângulo', 'pt-BR': 'Triângulo' } },
                { emoji: '⚪', nome: { 'pt-PT': 'Círculo', 'pt-BR': 'Círculo' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: passa o dedo pela borda de cada forma e conta os lados direitos.',
              'pt-BR': 'Dica: passe o dedo pela borda de cada forma e conte os lados retos.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟦',
              pergunta: {
                'pt-PT': 'Quantos lados tem o quadrado? Escreve o número.',
                'pt-BR': 'Quantos lados tem o quadrado? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta o lado de cima, o de baixo e os dois dos lados.',
              'pt-BR': 'Dica: conte o lado de cima, o de baixo e os dois dos lados.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas coisas tem a forma de um círculo?',
                'pt-BR': 'Qual destas coisas tem a forma de um círculo?',
              },
              opcoes: [
                { emoji: '📦', nome: { 'pt-PT': 'Caixa', 'pt-BR': 'Caixa' } },
                { emoji: '🚪', nome: { 'pt-PT': 'Porta', 'pt-BR': 'Porta' } },
                { emoji: '🪙', nome: { 'pt-PT': 'Moeda', 'pt-BR': 'Moeda' } },
                { emoji: '📐', nome: { 'pt-PT': 'Esquadro', 'pt-BR': 'Esquadro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura a coisa redonda, sem cantos nenhuns.',
              'pt-BR': 'Dica: procure a coisa redonda, sem nenhum canto.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔺 ➕ 🟦',
              pergunta: {
                'pt-PT': 'Quantos lados têm, juntos, um triângulo e um quadrado? Escreve o número.',
                'pt-BR': 'Quantos lados têm, juntos, um triângulo e um quadrado? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: primeiro vê quantos lados tem cada forma. Depois junta os dois números.',
              'pt-BR': 'Dica: primeiro veja quantos lados tem cada forma. Depois junte os dois números.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟦 ✂️',
              pergunta: {
                'pt-PT': 'O professor cortou um quadrado ao meio, de um canto ao canto do outro lado. Que forma tem cada metade?',
                'pt-BR': 'O professor cortou um quadrado ao meio, de um canto ao canto do outro lado. Que forma tem cada metade?',
              },
              opcoes: [
                { emoji: '⚪', nome: { 'pt-PT': 'Círculo', 'pt-BR': 'Círculo' } },
                { emoji: '🔺', nome: { 'pt-PT': 'Triângulo', 'pt-BR': 'Triângulo' } },
                { emoji: '🟦', nome: { 'pt-PT': 'Quadrado', 'pt-BR': 'Quadrado' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: desenha um quadrado e risca uma linha de um canto ao canto oposto. Conta os lados de cada parte.',
              'pt-BR': 'Dica: desenhe um quadrado e risque uma linha de um canto ao canto oposto. Conte os lados de cada parte.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas formas não tem lados direitos nem cantos?',
                'pt-BR': 'Qual destas formas não tem lados retos nem cantos?',
              },
              opcoes: [
                { emoji: '⚪', nome: { 'pt-PT': 'Círculo', 'pt-BR': 'Círculo' } },
                { emoji: '🔺', nome: { 'pt-PT': 'Triângulo', 'pt-BR': 'Triângulo' } },
                { emoji: '🟦', nome: { 'pt-PT': 'Quadrado', 'pt-BR': 'Quadrado' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: o triângulo, o quadrado e a estrela têm bicos. Qual forma não tem nenhum?',
              'pt-BR': 'Dica: o triângulo, o quadrado e a estrela têm pontas. Qual forma não tem nenhuma?',
            },
          },
        ],
      },
    },
    {
      id: 'tubos',
      nome: { 'pt-PT': 'Tubos de ensaio', 'pt-BR': 'Tubos de ensaio' },
      emoji: '🧪',
      zona: { x: 27.4, y: 45.4, largura: 22.1, altura: 24.2 },
      requer: 'oculos',
      bloqueado: {
        'pt-PT': 'Para mexer nos tubos de ensaio precisas de óculos de proteção. Procura-os!',
        'pt-BR': 'Para mexer nos tubos de ensaio você precisa de óculos de proteção. Procure os óculos!',
      },
      sucesso: {
        'pt-PT': 'A mistura mudou de cor e mostrou o número {n}!',
        'pt-BR': 'A mistura mudou de cor e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os tubos de ensaio estão misturados. Encontra os pares da mesma cor!',
                'pt-BR': 'Os tubos de ensaio estão misturados. Encontre os pares da mesma cor!',
              },
              emojis: ['🔴', '🟡', '🔵', '🟢'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde está cada cor.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde está cada cor.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔴 🔵 🔵 🟡 🔵',
              pergunta: {
                'pt-PT': 'Quantos tubos têm líquido azul? Escreve o número.',
                'pt-BR': 'Quantos tubos têm líquido azul? Digite o número.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: procura a cor do céu e conta só esses tubos.',
              'pt-BR': 'Dica: procure a cor do céu e conte só esses tubos.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Há um intruso no suporte dos tubos! Qual destas coisas não é um tubo de ensaio?',
                'pt-BR': 'Tem um intruso no suporte dos tubos! Qual destas coisas não é um tubo de ensaio?',
              },
              opcoes: [
                { emoji: '🧪', nome: { 'pt-PT': 'Tubo de ensaio', 'pt-BR': 'Tubo de ensaio' } },
                { emoji: '🧪', nome: { 'pt-PT': 'Tubo de ensaio', 'pt-BR': 'Tubo de ensaio' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
                { emoji: '🧪', nome: { 'pt-PT': 'Tubo de ensaio', 'pt-BR': 'Tubo de ensaio' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: três destas coisas são iguais. A outra come-se.',
              'pt-BR': 'Dica: três destas coisas são iguais. A outra a gente come.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔴 ➕ 🟡',
              pergunta: {
                'pt-PT': 'O professor misturou tinta vermelha com tinta amarela. Que cor ficou?',
                'pt-BR': 'O professor misturou tinta vermelha com tinta amarela. Que cor ficou?',
              },
              opcoes: [
                { emoji: '🟢', nome: { 'pt-PT': 'Verde', 'pt-BR': 'Verde' } },
                { emoji: '🟣', nome: { 'pt-PT': 'Roxo', 'pt-BR': 'Roxo' } },
                { emoji: '🔵', nome: { 'pt-PT': 'Azul', 'pt-BR': 'Azul' } },
                { emoji: '🟠', nome: { 'pt-PT': 'Laranja', 'pt-BR': 'Laranja' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: pensa na cor da fruta que tem o nome da cor. Fica entre o vermelho e o amarelo.',
              'pt-BR': 'Dica: pense na cor da fruta que tem o nome da cor. Fica entre o vermelho e o amarelo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada mistura com a cor que dá!',
                'pt-BR': 'Junte cada mistura com a cor que ela dá!',
              },
              emojis: [
                ['🔴+🟡', '🟠'],
                ['🔵+🟡', '🟢'],
                ['🔴+🔵', '🟣'],
                ['⚫+⚪', '🔘'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O preto com o branco dá cinzento.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O preto com o branco dá cinza.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟢 🔴 🟢 🟡 🟢 🔵 🟢',
              pergunta: {
                'pt-PT': 'Quantos tubos têm líquido verde? Não contes os outros.',
                'pt-BR': 'Quantos tubos têm líquido verde? Não conte os outros.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: põe o dedo em cada tubo verde e salta os outros.',
              'pt-BR': 'Dica: coloque o dedo em cada tubo verde e pule os outros.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As misturas perderam o seu par! Junta cada mistura com a cor que dá.',
                'pt-BR': 'As misturas perderam o par! Junte cada mistura com a cor que ela dá.',
              },
              emojis: [
                ['🔴+🟡', '🟠'],
                ['🔵+🟡', '🟢'],
                ['🔴+🔵', '🟣'],
                ['⚫+⚪', '🔘'],
                ['🔴+⚪', '🌸'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O vermelho com o branco fica mais clarinho: cor-de-rosa.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O vermelho com o branco fica mais clarinho: rosa.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟣',
              pergunta: {
                'pt-PT': 'O professor fez tinta roxa. Que duas cores misturou?',
                'pt-BR': 'O professor fez tinta roxa. Que duas cores ele misturou?',
              },
              opcoes: [
                { emoji: '🔴+🟡', nome: { 'pt-PT': 'Vermelho e amarelo', 'pt-BR': 'Vermelho e amarelo' } },
                { emoji: '🔵+🟡', nome: { 'pt-PT': 'Azul e amarelo', 'pt-BR': 'Azul e amarelo' } },
                { emoji: '⚫+⚪', nome: { 'pt-PT': 'Preto e branco', 'pt-BR': 'Preto e branco' } },
                { emoji: '🔴+🔵', nome: { 'pt-PT': 'Vermelho e azul', 'pt-BR': 'Vermelho e azul' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. O amarelo deixa a cor clara e o preto e o branco dão cinzento.',
              'pt-BR': 'Dica: vá riscando. O amarelo deixa a cor clara e o preto e o branco dão cinza.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔴 🔴 🔴 🟡 🟡 🟡',
              pergunta: {
                'pt-PT':
                  'Há 3 tubos vermelhos e 3 amarelos. O professor mistura sempre um vermelho com um amarelo. Quantos tubos cor de laranja consegue fazer?',
                'pt-BR':
                  'Tem 3 tubos vermelhos e 3 amarelos. O professor mistura sempre um vermelho com um amarelo. Quantos tubos laranja ele consegue fazer?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: junta cada tubo vermelho a um amarelo. Quantos pares fazes?',
              'pt-BR': 'Dica: junte cada tubo vermelho com um amarelo. Quantos pares você faz?',
            },
          },
        ],
      },
    },
    {
      id: 'engrenagens',
      nome: { 'pt-PT': 'Engrenagens', 'pt-BR': 'Engrenagens' },
      emoji: '⚙️',
      zona: { x: 72.0, y: 11.0, largura: 20.9, altura: 17.9 },
      sucesso: {
        'pt-PT': 'As rodas dentadas rodaram e pararam no número {n}!',
        'pt-BR': 'As rodas dentadas giraram e pararam no número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O professor precisa de uma roda dentada. Qual é?',
                'pt-BR': 'O professor precisa de uma roda dentada. Qual é?',
              },
              opcoes: [
                { emoji: '🔨', nome: { 'pt-PT': 'Martelo', 'pt-BR': 'Martelo' } },
                { emoji: '⚙️', nome: { 'pt-PT': 'Roda dentada', 'pt-BR': 'Roda dentada' } },
                { emoji: '🪛', nome: { 'pt-PT': 'Chave de fendas', 'pt-BR': 'Chave de fenda' } },
                { emoji: '🔩', nome: { 'pt-PT': 'Parafuso', 'pt-BR': 'Parafuso' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a roda dentada é redonda e tem dentes à volta, como as rodas da parede.',
              'pt-BR': 'Dica: a roda dentada é redonda e tem dentes em volta, como as rodas da parede.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚙️ ⚙️ ⚙️ ⚙️ ⚙️ ⚙️',
              pergunta: {
                'pt-PT': 'Quantas rodas dentadas há? Escreve o número.',
                'pt-BR': 'Quantas rodas dentadas tem? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta as rodas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as rodas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As ferramentas do professor estão espalhadas. Encontra os pares iguais!',
                'pt-BR': 'As ferramentas do professor estão espalhadas. Encontre os pares iguais!',
              },
              emojis: ['⚙️', '🔧', '🪛', '🔨'],
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
              visual: '⚙️⚙️   ⚙️',
              pergunta: {
                'pt-PT':
                  'A roda da manivela tem duas rodas perto: a roda A está encostada a ela e a roda B está longe, sem lhe tocar. Rodando a manivela, que roda se mexe?',
                'pt-BR':
                  'A roda da manivela tem duas rodas perto: a roda A está encostada nela e a roda B está longe, sem tocar nela. Girando a manivela, qual roda se mexe?',
              },
              opcoes: [
                { emoji: '⚙️', nome: { 'pt-PT': 'A roda B, que está longe', 'pt-BR': 'A roda B, que está longe' } },
                { emoji: '⚙️', nome: { 'pt-PT': 'A roda A, que está encostada', 'pt-BR': 'A roda A, que está encostada' } },
                { emoji: '❌', nome: { 'pt-PT': 'Nenhuma', 'pt-BR': 'Nenhuma' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: uma roda só empurra outra se os dentes delas se tocarem.',
              'pt-BR': 'Dica: uma roda só empurra outra se os dentes delas se tocarem.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '⚙️⚙️',
              pergunta: {
                'pt-PT': 'A roda grande roda para a direita. Para que lado roda a roda pequena encostada a ela?',
                'pt-BR': 'A roda grande gira para a direita. Para que lado gira a roda pequena encostada nela?',
              },
              opcoes: [
                { emoji: '🔃', nome: { 'pt-PT': 'Para a direita', 'pt-BR': 'Para a direita' } },
                { emoji: '🔄', nome: { 'pt-PT': 'Para a esquerda', 'pt-BR': 'Para a esquerda' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: junta as mãos com os dedos encaixados e roda uma. A outra vai para o mesmo lado ou para o contrário?',
              'pt-BR': 'Dica: junte as mãos com os dedos encaixados e gire uma. A outra vai para o mesmo lado ou para o contrário?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚙️ ⚙️',
              pergunta: {
                'pt-PT': 'A roda pequena dá 2 voltas por cada volta da roda grande. A grande deu 2 voltas. Quantas voltas deu a pequena?',
                'pt-BR': 'A roda pequena dá 2 voltas para cada volta da roda grande. A grande deu 2 voltas. Quantas voltas a pequena deu?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: na primeira volta da grande, a pequena dá 2. Na segunda, dá mais 2.',
              'pt-BR': 'Dica: na primeira volta da grande, a pequena dá 2. Na segunda, dá mais 2.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '⚙️⚙️⚙️',
              pergunta: {
                'pt-PT': 'Há 3 rodas em fila, todas encostadas. A primeira roda para a direita. Para que lado roda a terceira?',
                'pt-BR': 'Tem 3 rodas em fila, todas encostadas. A primeira gira para a direita. Para que lado gira a terceira?',
              },
              opcoes: [
                { emoji: '🔄', nome: { 'pt-PT': 'Para a esquerda', 'pt-BR': 'Para a esquerda' } },
                { emoji: '🔃', nome: { 'pt-PT': 'Para a direita', 'pt-BR': 'Para a direita' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: cada roda encostada roda para o lado contrário da anterior. Vê primeiro a segunda roda.',
              'pt-BR': 'Dica: cada roda encostada gira para o lado contrário da anterior. Veja primeiro a segunda roda.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚙️ ⚙️',
              pergunta: {
                'pt-PT': 'A roda pequena dá 2 voltas por cada volta da roda grande. A grande deu 4 voltas. Quantas voltas deu a pequena?',
                'pt-BR': 'A roda pequena dá 2 voltas para cada volta da roda grande. A grande deu 4 voltas. Quantas voltas a pequena deu?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: por cada volta da grande, conta 2 da pequena: 2, 4, 6...',
              'pt-BR': 'Dica: para cada volta da grande, conte 2 da pequena: 2, 4, 6...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🪨 ➖➖🔺➖➖➖➖',
              pergunta: {
                'pt-PT':
                  'O professor usa uma tábua e um apoio para levantar uma pedra pesada. Onde deve empurrar a tábua para fazer menos força?',
                'pt-BR':
                  'O professor usa uma tábua e um apoio para levantar uma pedra pesada. Onde ele deve empurrar a tábua para fazer menos força?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Em cima da pedra', 'pt-BR': 'Em cima da pedra' } },
                { emoji: '🔺', nome: { 'pt-PT': 'Mesmo junto ao apoio', 'pt-BR': 'Bem perto do apoio' } },
                { emoji: '👋', nome: { 'pt-PT': 'Na ponta, longe do apoio', 'pt-BR': 'Na ponta, longe do apoio' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: lembra-te do baloiço de tábua: quem se senta mais longe do meio levanta o outro com mais facilidade.',
              'pt-BR': 'Dica: lembre da gangorra: quem senta mais longe do meio levanta o outro com mais facilidade.',
            },
          },
        ],
      },
    },
    {
      id: 'sistema-solar',
      nome: { 'pt-PT': 'Sistema solar', 'pt-BR': 'Sistema solar' },
      emoji: '🪐',
      zona: { x: 72.8, y: 31.7, largura: 20.0, altura: 23.3 },
      sucesso: {
        'pt-PT': 'O Sol acendeu-se e iluminou o número {n}!',
        'pt-BR': 'O Sol se acendeu e iluminou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas coisas dá luz e calor à Terra?',
                'pt-BR': 'Qual destas coisas dá luz e calor para a Terra?',
              },
              opcoes: [
                { emoji: '🌍', nome: { 'pt-PT': 'Terra', 'pt-BR': 'Terra' } },
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: é amarelo, brilha muito e aquece-nos de dia.',
              'pt-BR': 'Dica: é amarelo, brilha muito e esquenta a gente de dia.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪐 🪐 🪐 🪐 🪐 🪐 🪐 🪐',
              pergunta: {
                'pt-PT': 'Quantos planetas tem a maqueta do professor? Escreve o número.',
                'pt-BR': 'Quantos planetas tem a maquete do professor? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: conta os planetas um a um, com o dedo.',
              'pt-BR': 'Dica: conte os planetas um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️',
              pergunta: {
                'pt-PT': 'O Sol está no céu. É dia ou é noite?',
                'pt-BR': 'O Sol está no céu. É dia ou é noite?',
              },
              opcoes: [
                { emoji: '🌙', nome: { 'pt-PT': 'Noite', 'pt-BR': 'Noite' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Dia', 'pt-BR': 'Dia' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: à noite vemos a Lua e as estrelas. Quando o Sol brilha, está claro.',
              'pt-BR': 'Dica: à noite a gente vê a Lua e as estrelas. Quando o Sol brilha, está claro.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '💡 ⚽',
              pergunta: {
                'pt-PT': 'A lâmpada faz de Sol e ilumina uma bola, que faz de Terra. Em que lado da bola é dia?',
                'pt-BR': 'A lâmpada faz de conta que é o Sol e ilumina uma bola, que é a Terra. Em que lado da bola é dia?',
              },
              opcoes: [
                { emoji: '🌚', nome: { 'pt-PT': 'No lado de trás', 'pt-BR': 'No lado de trás' } },
                { emoji: '💡', nome: { 'pt-PT': 'No lado virado para a luz', 'pt-BR': 'No lado virado para a luz' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: é dia onde a luz do Sol chega.',
              'pt-BR': 'Dica: é dia onde a luz do Sol chega.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌍 🌙 ➕ 🔴 🌙 🌙',
              pergunta: {
                'pt-PT': 'A Terra tem 1 lua e Marte tem 2 luas. Quantas luas têm os dois juntos?',
                'pt-BR': 'A Terra tem 1 lua e Marte tem 2 luas. Quantas luas os dois têm juntos?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: conta as luas do desenho, de um lado e do outro.',
              'pt-BR': 'Dica: conte as luas do desenho, de um lado e do outro.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍',
              pergunta: {
                'pt-PT': 'Na maqueta, uma coisa anda à volta da Terra. Qual é?',
                'pt-BR': 'Na maquete, uma coisa anda em volta da Terra. Qual é?',
              },
              opcoes: [
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🪐', nome: { 'pt-PT': 'Saturno', 'pt-BR': 'Saturno' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: é a coisa que vemos no céu à noite, mais perto de nós.',
              'pt-BR': 'Dica: é a coisa que a gente vê no céu à noite, mais perto de nós.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍 ☀️',
              pergunta: {
                'pt-PT': 'Porque é que de noite fica escuro?',
                'pt-BR': 'Por que de noite fica escuro?',
              },
              opcoes: [
                { emoji: '☀️', nome: { 'pt-PT': 'O Sol apagou-se', 'pt-BR': 'O Sol se apagou' } },
                {
                  emoji: '🌍',
                  nome: {
                    'pt-PT': 'A Terra rodou e ficámos de costas para o Sol',
                    'pt-BR': 'A Terra girou e ficamos de costas para o Sol',
                  },
                },
                { emoji: '🌙', nome: { 'pt-PT': 'A Lua tapou o Sol', 'pt-BR': 'A Lua cobriu o Sol' } },
                { emoji: '☁️', nome: { 'pt-PT': 'As nuvens esconderam o Sol', 'pt-BR': 'As nuvens esconderam o Sol' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o Sol nunca se apaga. Quem se mexe todos os dias é a Terra.',
              'pt-BR': 'Dica: o Sol nunca se apaga. Quem se mexe todos os dias é a Terra.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍 ⏸️',
              pergunta: {
                'pt-PT': 'Se a Terra deixasse de rodar, o que acontecia?',
                'pt-BR': 'Se a Terra parasse de girar, o que aconteceria?',
              },
              opcoes: [
                { emoji: '🌧️', nome: { 'pt-PT': 'Chovia sempre', 'pt-BR': 'Choveria sempre' } },
                { emoji: '🌙', nome: { 'pt-PT': 'Era sempre noite em todo o lado', 'pt-BR': 'Seria sempre noite em todo lugar' } },
                {
                  emoji: '🌍',
                  nome: {
                    'pt-PT': 'De um lado era sempre dia e do outro sempre noite',
                    'pt-BR': 'De um lado seria sempre dia e do outro sempre noite',
                  },
                },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o Sol continuava a brilhar, mas só para um dos lados da Terra.',
              'pt-BR': 'Dica: o Sol continuaria brilhando, mas só para um dos lados da Terra.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💡 💡 💡 ⚫ ⚫ ⚫ ⚫ ⚫',
              pergunta: {
                'pt-PT': 'A maqueta tem 8 planetas e 3 têm a luz acesa. Quantos planetas estão apagados?',
                'pt-BR': 'A maquete tem 8 planetas e 3 estão com a luz acesa. Quantos planetas estão apagados?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa nos 8 e tira os 3 planetas acesos.',
              'pt-BR': 'Dica: comece nos 8 e tire os 3 planetas acesos.',
            },
          },
        ],
      },
    },
    {
      id: 'iman',
      nome: { 'pt-PT': 'Íman', 'pt-BR': 'Ímã' },
      emoji: '🧲',
      zona: { x: 32.1, y: 79.0, largura: 13.6, altura: 25.4 },
      sucesso: {
        'pt-PT': 'O íman apanhou um clipe com o número {n}!',
        'pt-BR': 'O ímã pegou um clipe com o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧲',
              pergunta: {
                'pt-PT': 'Qual destas coisas o íman consegue apanhar?',
                'pt-BR': 'Qual destas coisas o ímã consegue pegar?',
              },
              opcoes: [
                { emoji: '🪵', nome: { 'pt-PT': 'Pau', 'pt-BR': 'Pedaço de madeira' } },
                { emoji: '🧸', nome: { 'pt-PT': 'Ursinho', 'pt-BR': 'Ursinho' } },
                { emoji: '📎', nome: { 'pt-PT': 'Clipe', 'pt-BR': 'Clipe' } },
                { emoji: '🍎', nome: { 'pt-PT': 'Maçã', 'pt-BR': 'Maçã' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o íman só apanha coisas de metal. Qual destas é de metal?',
              'pt-BR': 'Dica: o ímã só pega coisas de metal. Qual destas é de metal?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧲 📎 📎 📎 📎 📎',
              pergunta: {
                'pt-PT': 'Quantos clipes estão presos ao íman? Escreve o número.',
                'pt-BR': 'Quantos clipes estão presos no ímã? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta os clipes um a um, com o dedo.',
              'pt-BR': 'Dica: conte os clipes um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas do íman caíram ao chão. Encontra os pares iguais!',
                'pt-BR': 'As coisas do ímã caíram no chão. Encontre os pares iguais!',
              },
              emojis: ['🧲', '📎', '🔩', '🔑'],
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
                'pt-PT': 'Qual destas coisas é de metal?',
                'pt-BR': 'Qual destas coisas é de metal?',
              },
              opcoes: [
                { emoji: '🔑', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🪵', nome: { 'pt-PT': 'Pau', 'pt-BR': 'Pedaço de madeira' } },
                { emoji: '🍪', nome: { 'pt-PT': 'Bolacha', 'pt-BR': 'Biscoito' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: o metal é duro, frio e brilhante. A meia é de pano.',
              'pt-BR': 'Dica: o metal é duro, frio e brilhante. A meia é de pano.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🧲 📎 📎 📎 📎 📎 📎',
              pergunta: {
                'pt-PT': 'O íman tinha 6 clipes presos e caíram 2. Quantos clipes ficaram presos?',
                'pt-BR': 'O ímã tinha 6 clipes presos e caíram 2. Quantos clipes ficaram presos?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: tapa dois clipes com o dedo e conta os que sobram.',
              'pt-BR': 'Dica: cubra dois clipes com o dedo e conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas de metal estão misturadas. Encontra os cinco pares iguais!',
                'pt-BR': 'As coisas de metal estão misturadas. Encontre os cinco pares iguais!',
              },
              emojis: ['🧲', '📎', '🔩', '🔑', '🥄'],
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
              tipo: 'codigo',
              visual: '🧲 🧲 🧲',
              pergunta: {
                'pt-PT': 'Cada íman segura 3 clipes. Quantos clipes seguram 3 ímanes?',
                'pt-BR': 'Cada ímã segura 3 clipes. Quantos clipes 3 ímãs seguram?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: 3 clipes no primeiro íman, mais 3 no segundo, mais 3 no terceiro.',
              'pt-BR': 'Dica: 3 clipes no primeiro ímã, mais 3 no segundo, mais 3 no terceiro.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha: apanho clipes, tenho dois polos e sou vermelho e azul. Quem sou?',
                'pt-BR': 'Adivinhe: pego clipes, tenho dois polos e sou vermelho e azul. Quem sou eu?',
              },
              opcoes: [
                { emoji: '🔋', nome: { 'pt-PT': 'Pilha', 'pt-BR': 'Pilha' } },
                { emoji: '🪛', nome: { 'pt-PT': 'Chave de fendas', 'pt-BR': 'Chave de fenda' } },
                { emoji: '🔑', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '🧲', nome: { 'pt-PT': 'Íman', 'pt-BR': 'Ímã' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Qual destas coisas puxa o metal para si?',
              'pt-BR': 'Dica: vá riscando. Qual destas coisas puxa o metal?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧲 🧲',
              pergunta: {
                'pt-PT':
                  'Os polos da mesma cor afastam-se e os de cores diferentes juntam-se. Qual destes pares de polos se junta?',
                'pt-BR':
                  'Os polos da mesma cor se afastam e os de cores diferentes se juntam. Qual destes pares de polos se junta?',
              },
              opcoes: [
                { emoji: '🔴🔴', nome: { 'pt-PT': 'Vermelho com vermelho', 'pt-BR': 'Vermelho com vermelho' } },
                { emoji: '🔴🔵', nome: { 'pt-PT': 'Vermelho com azul', 'pt-BR': 'Vermelho com azul' } },
                { emoji: '🔵🔵', nome: { 'pt-PT': 'Azul com azul', 'pt-BR': 'Azul com azul' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: procura o par em que as duas cores são diferentes.',
              'pt-BR': 'Dica: procure o par em que as duas cores são diferentes.',
            },
          },
        ],
      },
    },
    {
      id: 'aquario',
      nome: { 'pt-PT': 'Aquário', 'pt-BR': 'Aquário' },
      emoji: '🐠',
      zona: { x: 51.2, y: 78.3, largura: 17.9, altura: 23.3 },
      sucesso: {
        'pt-PT': 'O peixinho fez bolhas que formaram o número {n}!',
        'pt-BR': 'O peixinho fez bolhas que formaram o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destes animais vive no aquário?',
                'pt-BR': 'Qual destes animais vive no aquário?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐔', nome: { 'pt-PT': 'Galinha', 'pt-BR': 'Galinha' } },
                { emoji: '🐈', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o aquário está cheio de água. Que animal nada lá dentro?',
              'pt-BR': 'Dica: o aquário está cheio de água. Que animal nada lá dentro?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐟 🐠 🐟 🐡 🐟 🐠',
              pergunta: {
                'pt-PT': 'Quantos peixes há no aquário? Escreve o número.',
                'pt-BR': 'Quantos peixes tem no aquário? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os peixes um a um, com o dedo.',
              'pt-BR': 'Dica: conte os peixes um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧊 ☀️',
              pergunta: {
                'pt-PT': 'O professor deixou um cubo de gelo ao sol. O que lhe acontece?',
                'pt-BR': 'O professor deixou um cubo de gelo no sol. O que acontece com ele?',
              },
              opcoes: [
                { emoji: '💧', nome: { 'pt-PT': 'Derrete e fica água', 'pt-BR': 'Derrete e vira água' } },
                { emoji: '🧊', nome: { 'pt-PT': 'Fica igual', 'pt-BR': 'Fica igual' } },
                { emoji: '⛄', nome: { 'pt-PT': 'Fica um boneco de neve', 'pt-BR': 'Vira um boneco de neve' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: lembra-te de um gelado ao sol. O que lhe acontece?',
              'pt-BR': 'Dica: lembre de um sorvete no sol. O que acontece com ele?',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🧊 ➡️ 💧',
              pergunta: {
                'pt-PT': 'O professor pôs um cubo de gelo num copo de água morna. O que acontece ao gelo?',
                'pt-BR': 'O professor colocou um cubo de gelo em um copo de água morna. O que acontece com o gelo?',
              },
              opcoes: [
                { emoji: '🧊', nome: { 'pt-PT': 'Fica maior', 'pt-BR': 'Fica maior' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Fica duro como pedra', 'pt-BR': 'Fica duro como pedra' } },
                { emoji: '💧', nome: { 'pt-PT': 'Derrete', 'pt-BR': 'Derrete' } },
                { emoji: '❄️', nome: { 'pt-PT': 'Faz neve', 'pt-BR': 'Faz neve' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a água morna está quentinha. O que faz o calor ao gelo?',
              'pt-BR': 'Dica: a água morna está quentinha. O que o calor faz com o gelo?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪨 🪨 🪨',
              pergunta: {
                'pt-PT':
                  'A água do aquário estava na risca 2. Cada pedra que entra faz a água subir 1 risca. Puseste 3 pedras. Em que risca está a água?',
                'pt-BR':
                  'A água do aquário estava no risco 2. Cada pedra que entra faz a água subir 1 risco. Você colocou 3 pedras. Em que risco está a água?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 2 e sobe uma risca por cada pedra: 3, 4...',
              'pt-BR': 'Dica: comece no 2 e suba um risco para cada pedra: 3, 4...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Quatro cubos de gelo estão a derreter, um de cada vez. Põe os desenhos por ordem, do princípio ao fim.',
                'pt-BR': 'Quatro cubos de gelo estão derretendo, um de cada vez. Coloque os desenhos em ordem, do começo ao fim.',
              },
              itens: ['🧊🧊🧊🧊', '🧊🧊🧊💧', '🧊🧊💧💧', '🧊💧💧💧', '💧💧💧💧'],
            },
            dica: {
              'pt-PT': 'Dica: no princípio ainda não derreteu nada. Em cada desenho há mais uma gota.',
              'pt-BR': 'Dica: no começo ainda não derreteu nada. Em cada desenho tem mais uma gota.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪨 🪨 🪨',
              pergunta: {
                'pt-PT':
                  'A água está na risca 1. Uma pedra grande faz a água subir 2 riscas e uma pequena faz subir 1. Puseram 2 pedras grandes e 1 pequena. Em que risca está a água?',
                'pt-BR':
                  'A água está no risco 1. Uma pedra grande faz a água subir 2 riscos e uma pequena faz subir 1. Colocaram 2 pedras grandes e 1 pequena. Em que risco está a água?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 1. Sobe 2 por cada pedra grande e depois 1 pela pequena.',
              'pt-BR': 'Dica: comece no 1. Suba 2 para cada pedra grande e depois 1 para a pequena.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️',
              pergunta: {
                'pt-PT': 'Qual destas coisas não derrete ao sol?',
                'pt-BR': 'Qual destas coisas não derrete no sol?',
              },
              opcoes: [
                { emoji: '🧊', nome: { 'pt-PT': 'Gelo', 'pt-BR': 'Gelo' } },
                { emoji: '🍦', nome: { 'pt-PT': 'Gelado', 'pt-BR': 'Sorvete' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
                { emoji: '⛄', nome: { 'pt-PT': 'Boneco de neve', 'pt-BR': 'Boneco de neve' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: três destas coisas são frias e feitas de água ou de leite. A outra é sempre dura.',
              'pt-BR': 'Dica: três destas coisas são frias e feitas de água ou de leite. A outra é sempre dura.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe a viagem da água por ordem: o gelo derrete, a água aquece e vira vapor, o vapor faz uma nuvem e a nuvem dá chuva.',
                'pt-BR':
                  'Coloque a viagem da água em ordem: o gelo derrete, a água esquenta e vira vapor, o vapor forma uma nuvem e a nuvem dá chuva.',
              },
              itens: ['🧊', '💧', '♨️', '☁️', '🌧️'],
            },
            dica: {
              'pt-PT': 'Dica: começa no gelo. A chuva fica para o fim.',
              'pt-BR': 'Dica: comece no gelo. A chuva fica para o fim.',
            },
          },
        ],
      },
    },
    {
      id: 'balanca',
      nome: { 'pt-PT': 'Balança', 'pt-BR': 'Balança' },
      emoji: '⚖️',
      zona: { x: 71.2, y: 75.0, largura: 16.5, altura: 32.5 },
      sucesso: {
        'pt-PT': 'A balança equilibrou-se e mostrou o número {n}!',
        'pt-BR': 'A balança se equilibrou e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '⚖️',
              pergunta: {
                'pt-PT': 'Um prato da balança desceu e o outro subiu. Que lado pesa mais?',
                'pt-BR': 'Um prato da balança desceu e o outro subiu. Que lado pesa mais?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'O prato que está em cima', 'pt-BR': 'O prato que está em cima' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'O prato que está em baixo', 'pt-BR': 'O prato que está embaixo' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: as coisas pesadas puxam o prato para o chão.',
              'pt-BR': 'Dica: as coisas pesadas puxam o prato para o chão.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O que pesa mais?',
                'pt-BR': 'O que pesa mais?',
              },
              opcoes: [
                { emoji: '🍒', nome: { 'pt-PT': 'Cereja', 'pt-BR': 'Cereja' } },
                { emoji: '🍉', nome: { 'pt-PT': 'Melancia', 'pt-BR': 'Melancia' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: qual destas frutas é tão grande que precisas das duas mãos para a levar?',
              'pt-BR': 'Dica: qual destas frutas é tão grande que você precisa das duas mãos para carregar?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⚖️ 🍎 🍎 🍎 🍎 🍎',
              pergunta: {
                'pt-PT': 'Quantas maçãs há no prato da balança? Escreve o número.',
                'pt-BR': 'Quantas maçãs tem no prato da balança? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as maçãs uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as maçãs uma por uma, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍎🍎🍎🍎🍎 ⚖️ 🍎🍎 ❔',
              pergunta: {
                'pt-PT':
                  'A balança está equilibrada. Num prato há 5 maçãs e no outro há 2 maçãs e mais algumas escondidas. Quantas maçãs estão escondidas?',
                'pt-BR':
                  'A balança está equilibrada. Em um prato tem 5 maçãs e no outro tem 2 maçãs e mais algumas escondidas. Quantas maçãs estão escondidas?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: os dois pratos têm de ter o mesmo. Começa no 2 e conta até chegares ao 5.',
              'pt-BR': 'Dica: os dois pratos precisam ter o mesmo. Comece no 2 e conte até chegar no 5.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Uma melancia pesa o mesmo que 4 maçãs. O que pesa mais: a melancia ou 3 maçãs?',
                'pt-BR': 'Uma melancia pesa o mesmo que 4 maçãs. O que pesa mais: a melancia ou 3 maçãs?',
              },
              opcoes: [
                { emoji: '🍎🍎🍎', nome: { 'pt-PT': 'As 3 maçãs', 'pt-BR': 'As 3 maçãs' } },
                { emoji: '🍉', nome: { 'pt-PT': 'A melancia', 'pt-BR': 'A melancia' } },
                { emoji: '⚖️', nome: { 'pt-PT': 'Pesam o mesmo', 'pt-BR': 'Pesam o mesmo' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: para pesar o mesmo que a melancia são precisas 4 maçãs. 3 maçãs chegam?',
              'pt-BR': 'Dica: para pesar o mesmo que a melancia, precisa de 4 maçãs. 3 maçãs são suficientes?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas balanças fica equilibrada, com os dois pratos à mesma altura?',
                'pt-BR': 'Qual destas balanças fica equilibrada, com os dois pratos na mesma altura?',
              },
              opcoes: [
                { emoji: '🍎🍎⚖️🍎', nome: { 'pt-PT': 'Duas maçãs e uma maçã', 'pt-BR': 'Duas maçãs e uma maçã' } },
                { emoji: '🍉⚖️🍒', nome: { 'pt-PT': 'Melancia e cereja', 'pt-BR': 'Melancia e cereja' } },
                { emoji: '🍎⚖️🍎', nome: { 'pt-PT': 'Uma maçã e uma maçã', 'pt-BR': 'Uma maçã e uma maçã' } },
                { emoji: '🍎🍎🍎⚖️🍎', nome: { 'pt-PT': 'Três maçãs e uma maçã', 'pt-BR': 'Três maçãs e uma maçã' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a balança fica direita quando os dois pratos têm o mesmo peso.',
              'pt-BR': 'Dica: a balança fica reta quando os dois pratos têm o mesmo peso.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍉 🍉',
              pergunta: {
                'pt-PT': 'Uma melancia pesa o mesmo que 4 maçãs. Duas melancias pesam o mesmo que quantas maçãs?',
                'pt-BR': 'Uma melancia pesa o mesmo que 4 maçãs. Duas melancias pesam o mesmo que quantas maçãs?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: 4 maçãs pela primeira melancia, mais 4 pela segunda.',
              'pt-BR': 'Dica: 4 maçãs para a primeira melancia, mais 4 para a segunda.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍍 = 🍎🍎   🍉 = 🍍🍍',
              pergunta: {
                'pt-PT':
                  'Um ananás pesa o mesmo que 2 maçãs. Uma melancia pesa o mesmo que 2 ananases. A melancia pesa o mesmo que quantas maçãs?',
                'pt-BR':
                  'Um abacaxi pesa o mesmo que 2 maçãs. Uma melancia pesa o mesmo que 2 abacaxis. A melancia pesa o mesmo que quantas maçãs?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: troca cada ananás por 2 maçãs. Depois conta as maçãs.',
              'pt-BR': 'Dica: troque cada abacaxi por 2 maçãs. Depois conte as maçãs.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '⚫ ⚖️ ☁️',
              pergunta: {
                'pt-PT':
                  'Num prato da balança está uma bola de ferro e no outro uma bola de algodão, do mesmo tamanho. Para que lado desce a balança?',
                'pt-BR':
                  'Em um prato da balança está uma bola de ferro e no outro uma bola de algodão, do mesmo tamanho. Para que lado a balança desce?',
              },
              opcoes: [
                { emoji: '☁️', nome: { 'pt-PT': 'Para o lado do algodão', 'pt-BR': 'Para o lado do algodão' } },
                { emoji: '⚖️', nome: { 'pt-PT': 'Fica direita', 'pt-BR': 'Fica reta' } },
                { emoji: '⚫', nome: { 'pt-PT': 'Para o lado do ferro', 'pt-BR': 'Para o lado do ferro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: o tamanho é igual, mas não o peso. Pensa em qual das bolas é mais fácil levantar.',
              'pt-BR': 'Dica: o tamanho é igual, mas o peso não. Pense em qual das bolas é mais fácil levantar.',
            },
          },
        ],
      },
    },
    {
      id: 'robo',
      nome: { 'pt-PT': 'Robô de latas', 'pt-BR': 'Robô de latas' },
      emoji: '🤖',
      zona: { x: 89.8, y: 74.2, largura: 15.9, altura: 34.2 },
      requer: 'pilha',
      bloqueado: {
        'pt-PT': 'O robô não se mexe: não tem pilha. Procura uma pilha!',
        'pt-BR': 'O robô não se mexe: ele está sem pilha. Procure uma pilha!',
      },
      sucesso: {
        'pt-PT': 'O robô acordou e disse o número {n}!',
        'pt-BR': 'O robô acordou e disse o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🤖',
              pergunta: {
                'pt-PT': 'O que faz o robô andar?',
                'pt-BR': 'O que faz o robô andar?',
              },
              opcoes: [
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
                { emoji: '🔋', nome: { 'pt-PT': 'Pilha', 'pt-BR': 'Pilha' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: é a mesma coisa que faz andar os carrinhos de brincar e acender as lanternas.',
              'pt-BR': 'Dica: é a mesma coisa que faz andar os carrinhos de brinquedo e acender as lanternas.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🥫 🥫 🥫 🥫 🥫 🥫 🥫',
              pergunta: {
                'pt-PT': 'O professor fez o robô com latas. Quantas latas usou? Escreve o número.',
                'pt-BR': 'O professor fez o robô com latas. Quantas latas ele usou? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: conta as latas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as latas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As peças do robô espalharam-se. Encontra os pares iguais!',
                'pt-BR': 'As peças do robô se espalharam. Encontre os pares iguais!',
              },
              emojis: ['🥫', '🔩', '🔋', '💡'],
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
              visual: '⚡',
              pergunta: {
                'pt-PT': 'A eletricidade passa pelo metal. Por qual destas coisas passa a eletricidade?',
                'pt-BR': 'A eletricidade passa pelo metal. Por qual destas coisas a eletricidade passa?',
              },
              opcoes: [
                { emoji: '🧸', nome: { 'pt-PT': 'Ursinho', 'pt-BR': 'Ursinho' } },
                { emoji: '🪵', nome: { 'pt-PT': 'Pau', 'pt-BR': 'Pedaço de madeira' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🥄', nome: { 'pt-PT': 'Colher de metal', 'pt-BR': 'Colher de metal' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: procura a coisa feita de metal.',
              'pt-BR': 'Dica: procure a coisa feita de metal.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe por ordem o que acontece: pôr a pilha, ligar o fio, carregar no interruptor, a luz acende e o robô anda.',
                'pt-BR':
                  'Coloque em ordem o que acontece: colocar a pilha, ligar o fio, apertar o interruptor, a luz acende e o robô anda.',
              },
              itens: ['🔋', '🔌', '🔘', '💡', '🤖'],
            },
            dica: {
              'pt-PT': 'Dica: sem pilha nada funciona. O robô só anda no fim.',
              'pt-BR': 'Dica: sem pilha nada funciona. O robô só anda no fim.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 🔋',
              pergunta: {
                'pt-PT': 'O robô tem 2 pilhas e precisa de 5. Quantas pilhas faltam?',
                'pt-BR': 'O robô tem 2 pilhas e precisa de 5. Quantas pilhas faltam?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: começa no 2 e conta até chegares ao 5: 3, 4, 5...',
              'pt-BR': 'Dica: comece no 2 e conte até chegar no 5: 3, 4, 5...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Liga o circuito do robô pela ordem: a pilha, o fio vermelho, o interruptor, o fio azul e, no fim, a lâmpada.',
                'pt-BR':
                  'Ligue o circuito do robô na ordem: a pilha, o fio vermelho, o interruptor, o fio azul e, no fim, a lâmpada.',
              },
              itens: ['🔋', '🔴〰️', '🔘', '🔵〰️', '💡'],
            },
            dica: {
              'pt-PT': 'Dica: a eletricidade sai da pilha. O fio vermelho vai da pilha até ao interruptor.',
              'pt-BR': 'Dica: a eletricidade sai da pilha. O fio vermelho vai da pilha até o interruptor.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔋 〰️ 💡',
              pergunta: {
                'pt-PT': 'O robô tem uma pilha nova e o interruptor está ligado, mas a lâmpada não acende. Porquê?',
                'pt-BR': 'O robô tem uma pilha nova e o interruptor está ligado, mas a lâmpada não acende. Por quê?',
              },
              opcoes: [
                { emoji: '🔋', nome: { 'pt-PT': 'A pilha é nova', 'pt-BR': 'A pilha é nova' } },
                { emoji: '😊', nome: { 'pt-PT': 'O robô está contente', 'pt-BR': 'O robô está feliz' } },
                { emoji: '✂️', nome: { 'pt-PT': 'O fio está cortado', 'pt-BR': 'O fio está cortado' } },
                { emoji: '🔘', nome: { 'pt-PT': 'O interruptor está ligado', 'pt-BR': 'O interruptor está ligado' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a pilha e o interruptor estão bem. Por onde passa a eletricidade até à lâmpada?',
              'pt-BR': 'Dica: a pilha e o interruptor estão bons. Por onde a eletricidade passa até a lâmpada?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 🔋 🔋 🪫',
              pergunta: {
                'pt-PT': 'O robô tem 4 pilhas, mas 1 está gasta. Cada pilha boa dá 2 voltas ao robô. Quantas voltas dá o robô?',
                'pt-BR': 'O robô tem 4 pilhas, mas 1 está gasta. Cada pilha boa faz o robô dar 2 voltas. Quantas voltas o robô dá?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: primeiro vê quantas pilhas estão boas. Depois conta 2 voltas por cada uma.',
              'pt-BR': 'Dica: primeiro veja quantas pilhas estão boas. Depois conte 2 voltas para cada uma.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'estante',
      nome: { 'pt-PT': 'Estante do microscópio', 'pt-BR': 'Estante do microscópio' },
      emoji: '🔬',
      zona: { x: 92.7, y: 29.2, largura: 14.7, altura: 56.7 },
      recompensa: {
        id: 'oculos',
        emoji: '🥽',
        nome: { 'pt-PT': 'Óculos de proteção', 'pt-BR': 'Óculos de proteção' },
      },
      sucesso: {
        'pt-PT': 'Encontraste os óculos de proteção na estante! 🥽',
        'pt-BR': 'Você encontrou os óculos de proteção na estante! 🥽',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas da estante estão misturadas. Encontra os pares iguais!',
                'pt-BR': 'As coisas da estante estão misturadas. Encontre os pares iguais!',
              },
              emojis: ['🔬', '🔍', '🦠', '🥽'],
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas coisas serve para ver coisas muito pequeninas?',
                'pt-BR': 'Qual destas coisas serve para ver coisas muito pequenininhas?',
              },
              opcoes: [
                { emoji: '🥄', nome: { 'pt-PT': 'Colher', 'pt-BR': 'Colher' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🔍', nome: { 'pt-PT': 'Lupa', 'pt-BR': 'Lupa' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Procura a coisa com um vidro redondo.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Procure a coisa com um vidro redondo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦠 🦠 🦠 🦠 🦠',
              pergunta: {
                'pt-PT': 'A estante tem um cadeado. Quantos micróbios se veem no vidro do microscópio?',
                'pt-BR': 'A estante tem um cadeado. Quantos micróbios aparecem no vidro do microscópio?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Conta os micróbios um a um.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Conte os micróbios um por um.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas da estante estão misturadas. Encontra os cinco pares iguais!',
                'pt-BR': 'As coisas da estante estão misturadas. Encontre os cinco pares iguais!',
              },
              emojis: ['🔬', '🔍', '🦠', '🥽', '🧫'],
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐜 🔍',
              pergunta: {
                'pt-PT': 'O professor olhou para uma formiga com a lupa. Como é que a formiga parece?',
                'pt-BR': 'O professor olhou uma formiga com a lupa. Como a formiga parece?',
              },
              opcoes: [
                { emoji: '🤏', nome: { 'pt-PT': 'Mais pequena', 'pt-BR': 'Menor' } },
                { emoji: '🔍', nome: { 'pt-PT': 'Maior', 'pt-BR': 'Maior' } },
                { emoji: '💨', nome: { 'pt-PT': 'Desaparece', 'pt-BR': 'Desaparece' } },
                { emoji: '🎨', nome: { 'pt-PT': 'Muda de cor', 'pt-BR': 'Muda de cor' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. A lupa serve para ver melhor as coisas pequeninas.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. A lupa serve para ver melhor as coisas pequenininhas.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦠 🦠 🦠 🦠 🦠 🦠 🦠',
              pergunta: {
                'pt-PT': 'Havia 7 micróbios no vidro e o professor limpou 2. Quantos micróbios ficaram?',
                'pt-BR': 'Tinha 7 micróbios no vidro e o professor limpou 2. Quantos micróbios ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Tapa dois micróbios com o dedo e conta os que sobram.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Cubra dois micróbios com o dedo e conte os que sobram.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas da estante estão todas misturadas. Encontra os seis pares iguais!',
                'pt-BR': 'As coisas da estante estão todas misturadas. Encontre os seis pares iguais!',
              },
              emojis: ['🔬', '🔍', '🦠', '🥽', '🧫', '🧬'],
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Vira duas cartas de cada vez e lembra-te de onde viste cada uma.',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Vire duas cartas de cada vez e lembre onde viu cada uma.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destes animais tem as duas metades iguais, como se tivesse um espelho no meio?',
                'pt-BR': 'Qual destes animais tem as duas metades iguais, como se tivesse um espelho no meio?',
              },
              opcoes: [
                { emoji: '🐌', nome: { 'pt-PT': 'Caracol', 'pt-BR': 'Caracol' } },
                { emoji: '🦒', nome: { 'pt-PT': 'Girafa de lado', 'pt-BR': 'Girafa de lado' } },
                { emoji: '🦋', nome: { 'pt-PT': 'Borboleta', 'pt-BR': 'Borboleta' } },
                { emoji: '🦩', nome: { 'pt-PT': 'Flamingo', 'pt-BR': 'Flamingo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Imagina uma linha no meio de cada desenho. Os dois lados ficam iguais?',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Imagine uma linha no meio de cada desenho. Os dois lados ficam iguais?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦠 🦠',
              pergunta: {
                'pt-PT': 'Cada micróbio divide-se em 2. Havia 2 micróbios e dividiram-se duas vezes. Quantos micróbios há agora?',
                'pt-BR': 'Cada micróbio se divide em 2. Tinha 2 micróbios e eles se dividiram duas vezes. Quantos micróbios tem agora?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: os óculos de proteção estão na estante. Na primeira vez, os 2 micróbios ficam 4. E na segunda?',
              'pt-BR': 'Dica: os óculos de proteção estão na estante. Na primeira vez, os 2 micróbios viram 4. E na segunda?',
            },
          },
        ],
      },
    },
    {
      id: 'mesa',
      nome: { 'pt-PT': 'Mesa com gaveta', 'pt-BR': 'Mesa com gaveta' },
      emoji: '🗃️',
      zona: { x: 11.9, y: 77.2, largura: 21.4, altura: 26.9 },
      recompensa: {
        id: 'pilha',
        emoji: '🔋',
        nome: { 'pt-PT': 'Pilha', 'pt-BR': 'Pilha' },
      },
      sucesso: {
        'pt-PT': 'A gaveta abriu-se e lá dentro havia uma pilha! 🔋',
        'pt-BR': 'A gaveta se abriu e lá dentro tinha uma pilha! 🔋',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A gaveta tem um cadeado. Qual destas coisas precisa de pilha?',
                'pt-BR': 'A gaveta tem um cadeado. Qual destas coisas precisa de pilha?',
              },
              opcoes: [
                { emoji: '🕯️', nome: { 'pt-PT': 'Vela', 'pt-BR': 'Vela' } },
                { emoji: '🔦', nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' } },
                { emoji: '🪁', nome: { 'pt-PT': 'Papagaio de papel', 'pt-BR': 'Pipa' } },
                { emoji: '📖', nome: { 'pt-PT': 'Livro', 'pt-BR': 'Livro' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Qual destas coisas acende quando carregas num botão?',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Qual destas coisas acende quando você aperta um botão?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 🔋 🔋 🔋 🔋 🔋',
              pergunta: {
                'pt-PT': 'A gaveta tem um cadeado. Quantas pilhas há lá dentro?',
                'pt-BR': 'A gaveta tem um cadeado. Quantas pilhas tem lá dentro?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Conta as pilhas uma a uma.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Conte as pilhas uma por uma.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas da gaveta estão misturadas. Encontra os pares iguais!',
                'pt-BR': 'As coisas da gaveta estão misturadas. Encontre os pares iguais!',
              },
              emojis: ['🔋', '🔦', '📎', '✏️'],
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas coisas se apaga quando lhe tiras a pilha?',
                'pt-BR': 'Qual destas coisas apaga quando você tira a pilha dela?',
              },
              opcoes: [
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🕯️', nome: { 'pt-PT': 'Vela', 'pt-BR': 'Vela' } },
                { emoji: '🔥', nome: { 'pt-PT': 'Fogueira', 'pt-BR': 'Fogueira' } },
                { emoji: '🔦', nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. O Sol, a vela e a fogueira dão luz sem pilhas.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. O Sol, a vela e a fogueira dão luz sem pilhas.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 🔋 🔋 🔋 🔋 🔋 🔋 🔋 🔋',
              pergunta: {
                'pt-PT': 'Havia 9 pilhas na gaveta e o professor levou 4. Quantas pilhas ficaram?',
                'pt-BR': 'Tinha 9 pilhas na gaveta e o professor levou 4. Quantas pilhas ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Tapa 4 pilhas com os dedos e conta as que sobram.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Cubra 4 pilhas com os dedos e conte as que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas da gaveta estão misturadas. Encontra os cinco pares iguais!',
                'pt-BR': 'As coisas da gaveta estão misturadas. Encontre os cinco pares iguais!',
              },
              emojis: ['🔋', '🔦', '📎', '✏️', '📏'],
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas coisas não precisa de pilha nem de tomada para funcionar?',
                'pt-BR': 'Qual destas coisas não precisa de pilha nem de tomada para funcionar?',
              },
              opcoes: [
                { emoji: '🔦', nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' } },
                { emoji: '📻', nome: { 'pt-PT': 'Rádio', 'pt-BR': 'Rádio' } },
                { emoji: '🪁', nome: { 'pt-PT': 'Papagaio de papel', 'pt-BR': 'Pipa' } },
                { emoji: '💡', nome: { 'pt-PT': 'Lâmpada', 'pt-BR': 'Lâmpada' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. Vai riscando as coisas que precisam de eletricidade. Qual só precisa do vento?',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. Vá riscando as coisas que precisam de eletricidade. Qual só precisa do vento?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔦 🔦 🔦',
              pergunta: {
                'pt-PT': 'Cada lanterna leva 2 pilhas. Quantas pilhas são precisas para 3 lanternas?',
                'pt-BR': 'Cada lanterna usa 2 pilhas. Quantas pilhas são necessárias para 3 lanternas?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. 2 pilhas na primeira lanterna, mais 2 na segunda, mais 2 na terceira.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. 2 pilhas na primeira lanterna, mais 2 na segunda, mais 2 na terceira.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔦 🌙',
              pergunta: {
                'pt-PT': 'Qual das lanternas gasta a pilha mais depressa?',
                'pt-BR': 'Qual das lanternas gasta a pilha mais rápido?',
              },
              opcoes: [
                { emoji: '🔦', nome: { 'pt-PT': 'A que ficou desligada a noite toda', 'pt-BR': 'A que ficou desligada a noite toda' } },
                { emoji: '⚖️', nome: { 'pt-PT': 'Gastam o mesmo', 'pt-BR': 'Gastam o mesmo' } },
                { emoji: '💡', nome: { 'pt-PT': 'A que ficou ligada a noite toda', 'pt-BR': 'A que ficou ligada a noite toda' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a pilha do robô está na gaveta. A pilha só se gasta quando a lanterna está a dar luz.',
              'pt-BR': 'Dica: a pilha do robô está na gaveta. A pilha só gasta quando a lanterna está dando luz.',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta de engrenagens', 'pt-BR': 'Porta de engrenagens' },
    emoji: '🚪',
    zona: { x: 50.5, y: 28.5, largura: 19.7, altura: 48.8 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa do laboratório que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa do laboratório que esconde um número. Digite os números na ordem dos desenhos.',
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
    'pt-PT':
      'Clique! As engrenagens rodaram e a porta abriu-se. O Professor Parafuso voltou do almoço e deu-te os parabéns: que grande cientista!',
    'pt-BR':
      'Clique! As engrenagens giraram e a porta se abriu. O Professor Parafuso voltou do almoço e deu os parabéns para você: que grande cientista!',
  },
};
