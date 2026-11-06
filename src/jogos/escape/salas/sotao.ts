import type { Sala } from '../tipos';

/** Sala de exemplo: mostra os quatro tipos de enigma e um objeto que precisa de uma chave. */
export const sotao: Sala = {
  id: 'sotao',
  emoji: '[[extras/sotao]]',
  cor: '#ffc94d',
  titulo: { 'pt-PT': 'O Sótão Misterioso', 'pt-BR': 'O Sótão Misterioso' },
  resumo: {
    'pt-PT': 'A porta bateu e ficaste preso no sótão. Encontra o código!',
    'pt-BR': 'A porta bateu e você ficou preso no sótão. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Subiste ao sótão da avó para procurar um brinquedo. De repente, a porta fechou-se com um estrondo! Em cima da porta há um cadeado com três números. Procura pistas pelo sótão e descobre o código.',
    'pt-BR':
      'Você subiu ao sótão da vovó para procurar um brinquedo. De repente, a porta se fechou com um estrondo! Na porta há um cadeado com três números. Procure pistas pelo sótão e descubra o código.',
  },
  fundo: 'linear-gradient(180deg, #3b2a4f 0%, #2a2040 60%, #4a3524 100%)',
  objetos: [
    {
      id: 'relogio',
      emoji: '🕰️',
      nome: { 'pt-PT': 'Relógio', 'pt-BR': 'Relógio' },
      x: 20,
      y: 22,
      enigma: {
        tipo: 'ordem',
        visual: '🕰️',
        pergunta: {
          'pt-PT': 'O relógio parou! Põe as partes do dia por ordem, da manhã até à noite.',
          'pt-BR': 'O relógio parou! Coloque as partes do dia em ordem, da manhã até a noite.',
        },
        itens: ['🌅', '🌞', '🌇', '🌙'],
      },
      recompensa: {
        id: 'numero-3',
        emoji: '🕰️',
        valor: '3',
        nome: { 'pt-PT': 'Relógio', 'pt-BR': 'Relógio' },
      },
      sucesso: {
        'pt-PT': 'O relógio voltou a andar e mostra o número 3!',
        'pt-BR': 'O relógio voltou a andar e mostra o número 3!',
      },
      dica: {
        'pt-PT': 'Dica: o dia começa com o nascer do sol e acaba com a lua.',
        'pt-BR': 'Dica: o dia começa com o nascer do sol e termina com a lua.',
      },
    },
    {
      id: 'quadro',
      emoji: '[[extras/quadro]]',
      nome: { 'pt-PT': 'Quadro', 'pt-BR': 'Quadro' },
      x: 78,
      y: 22,
      enigma: {
        tipo: 'codigo',
        visual: '🐱🐱🐱 🐶🐶',
        pergunta: {
          'pt-PT': 'Quantos animais há no quadro? Escreve o número no cadeado.',
          'pt-BR': 'Quantos animais há no quadro? Digite o número no cadeado.',
        },
        resposta: '5',
      },
      recompensa: {
        id: 'chave',
        emoji: '[[extras/chave-antiga]]',
        nome: { 'pt-PT': 'Chave pequena', 'pt-BR': 'Chave pequena' },
      },
      sucesso: {
        'pt-PT': 'Havia uma chave pequena atrás do quadro! 🗝️',
        'pt-BR': 'Havia uma chave pequena atrás do quadro! 🗝️',
      },
      dica: {
        'pt-PT': 'Dica: conta os gatos e depois os cães. Quantos são ao todo?',
        'pt-BR': 'Dica: conte os gatos e depois os cachorros. Quantos são ao todo?',
      },
    },
    {
      id: 'estante',
      emoji: '[[cenas/biblioteca]]',
      nome: { 'pt-PT': 'Estante', 'pt-BR': 'Estante' },
      x: 50,
      y: 48,
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
      recompensa: {
        id: 'numero-7',
        emoji: '[[cenas/biblioteca]]',
        valor: '7',
        nome: { 'pt-PT': 'Estante', 'pt-BR': 'Estante' },
      },
      sucesso: {
        'pt-PT': 'Um livro caiu da estante com o número 7!',
        'pt-BR': 'Um livro caiu da estante com o número 7!',
      },
      dica: {
        'pt-PT': 'Dica: três destas coisas comem-se. Uma anda na estrada.',
        'pt-BR': 'Dica: três destas coisas a gente come. Uma anda na rua.',
      },
    },
    {
      id: 'bau',
      emoji: '[[extras/ursinho]]',
      nome: { 'pt-PT': 'Baú de brinquedos', 'pt-BR': 'Baú de brinquedos' },
      x: 22,
      y: 72,
      requer: 'chave',
      bloqueado: {
        'pt-PT': 'O baú está trancado. Procura uma chave!',
        'pt-BR': 'O baú está trancado. Procure uma chave!',
      },
      enigma: {
        tipo: 'pares',
        pergunta: {
          'pt-PT': 'Os brinquedos estão misturados. Encontra os pares iguais!',
          'pt-BR': 'Os brinquedos estão misturados. Encontre os pares iguais!',
        },
        emojis: ['🧸', '🚂', '🪁', '🎈'],
      },
      recompensa: {
        id: 'numero-1',
        emoji: '[[extras/ursinho]]',
        valor: '1',
        nome: { 'pt-PT': 'Baú', 'pt-BR': 'Baú' },
      },
      sucesso: {
        'pt-PT': 'No fundo do baú estava o número 1!',
        'pt-BR': 'No fundo do baú estava o número 1!',
      },
      dica: {
        'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
        'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
      },
    },
  ],
  saida: {
    emoji: '[[cenas/porta-de-pedra]]',
    nome: { 'pt-PT': 'Porta', 'pt-BR': 'Porta' },
    enigma: {
      tipo: 'codigo',
      visual: '🕰️ 📚 🧸',
      pergunta: {
        'pt-PT': 'Escreve os três números pela ordem dos desenhos: relógio, estante e baú.',
        'pt-BR': 'Digite os três números na ordem dos desenhos: relógio, estante e baú.',
      },
      resposta: '371',
    },
    dica: {
      'pt-PT': 'Dica: já tens as pistas todas? Junta os números pela ordem 🕰️ 📚 🧸.',
      'pt-BR': 'Dica: você já tem todas as pistas? Junte os números na ordem 🕰️ 📚 🧸.',
    },
  },
  vitoria: {
    'pt-PT': 'Clique! O cadeado abriu e a porta rangeu. Saíste do sótão e a avó esperava-te com um lanche. Que aventura!',
    'pt-BR': 'Clique! O cadeado abriu e a porta rangeu. Você saiu do sótão e a vovó esperava com um lanche. Que aventura!',
  },
};
