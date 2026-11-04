import type { TextoPorIdioma } from '../../compartilhado/idioma';
import type { Cena, Inimigo, NomeAtributo } from './tipos';

export const AVATARES = ['🦊', '🐻', '🦁', '🐰'];

export const PONTOS_PARA_DISTRIBUIR = 6;
export const ATRIBUTO_MINIMO = 1;
export const ATRIBUTO_MAXIMO = 4;

export const ATRIBUTOS: {
  id: NomeAtributo;
  emoji: string;
  nome: TextoPorIdioma;
  ajuda: TextoPorIdioma;
}[] = [
  {
    id: 'forca',
    emoji: '💪',
    nome: { 'pt-PT': 'Força', 'pt-BR': 'Força' },
    ajuda: { 'pt-PT': 'Acerta mais e bate mais forte', 'pt-BR': 'Acerta mais e bate mais forte' },
  },
  {
    id: 'agilidade',
    emoji: '⚡',
    nome: { 'pt-PT': 'Agilidade', 'pt-BR': 'Agilidade' },
    ajuda: { 'pt-PT': 'Foge dos golpes e salta bem', 'pt-BR': 'Foge dos golpes e pula bem' },
  },
  {
    id: 'inteligencia',
    emoji: '🧠',
    nome: { 'pt-PT': 'Inteligência', 'pt-BR': 'Inteligência' },
    ajuda: { 'pt-PT': 'Resolve enigmas', 'pt-BR': 'Resolve enigmas' },
  },
  {
    id: 'coragem',
    emoji: '❤️',
    nome: { 'pt-PT': 'Coragem', 'pt-BR': 'Coragem' },
    ajuda: { 'pt-PT': 'Dá mais vida', 'pt-BR': 'Dá mais vida' },
  },
];

/** Vida inicial do herói: a coragem dá mais vida. */
export function vidaMaxima(coragem: number): number {
  return 10 + coragem * 2;
}

export const INIMIGOS: Record<string, Inimigo> = {
  lobo: {
    id: 'lobo',
    emoji: '🐺',
    nome: { 'pt-PT': 'O Lobo', 'pt-BR': 'O Lobo' },
    pontosDeVida: 8,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  lesma: {
    id: 'lesma',
    emoji: '🐌',
    nome: { 'pt-PT': 'A Lesma Gigante', 'pt-BR': 'A Lesma Gigante' },
    pontosDeVida: 6,
    defesa: 8,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  morcego: {
    id: 'morcego',
    emoji: '🦇',
    nome: { 'pt-PT': 'O Morcego', 'pt-BR': 'O Morcego' },
    pontosDeVida: 6,
    defesa: 12,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  goblin: {
    id: 'goblin',
    emoji: '👺',
    nome: { 'pt-PT': 'O Goblin Chefe', 'pt-BR': 'O Goblin Chefe' },
    pontosDeVida: 16,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
};

const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };

/** A história. "{nome}" é trocado pelo nome do herói. */
export const CENAS: Record<string, Cena> = {
  aldeia: {
    id: 'aldeia',
    emoji: '🏘️',
    texto: {
      'pt-PT':
        '{nome} vive numa aldeia tranquila. Uma noite, a Pedra da Lua desapareceu e o céu ficou escuro! O Sábio da aldeia pede ajuda: «Só tu podes encontrá-la!»',
      'pt-BR':
        '{nome} vive em uma vila tranquila. Uma noite, a Pedra da Lua sumiu e o céu ficou escuro! O Sábio da vila pede ajuda: «Só você pode achá-la!»',
    },
    escolhas: [
      {
        texto: { 'pt-PT': '🌲 Seguir pela floresta escura', 'pt-BR': '🌲 Seguir pela floresta escura' },
        proximaCena: 'floresta',
      },
      {
        texto: { 'pt-PT': '🌊 Seguir pelo rio', 'pt-BR': '🌊 Seguir pelo rio' },
        proximaCena: 'rio',
      },
    ],
  },
  floresta: {
    id: 'floresta',
    emoji: '🌲',
    texto: {
      'pt-PT': '{nome} entra na floresta escura. Dois olhos amarelos brilham entre as árvores... É um lobo!',
      'pt-BR': '{nome} entra na floresta escura. Dois olhos amarelos brilham entre as árvores... É um lobo!',
    },
    luta: { inimigo: 'lobo', aoVencer: 'clareira' },
  },
  rio: {
    id: 'rio',
    emoji: '🌊',
    texto: {
      'pt-PT': '{nome} chega ao rio. Há pedras no meio da água para atravessar. Salta de pedra em pedra sem cair!',
      'pt-BR': '{nome} chega ao rio. Há pedras no meio da água para atravessar. Pule de pedra em pedra sem cair!',
    },
    teste: { atributo: 'agilidade', dificuldade: 10, sucesso: 'rio_certo', falha: 'rio_errado' },
  },
  rio_certo: {
    id: 'rio_certo',
    emoji: '🐇',
    texto: {
      'pt-PT': 'Que salto! {nome} atravessou como um coelho, sem molhar os pés.',
      'pt-BR': 'Que pulo! {nome} atravessou como um coelho, sem molhar os pés.',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'clareira' }],
  },
  rio_errado: {
    id: 'rio_errado',
    emoji: '💦',
    texto: {
      'pt-PT': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
      'pt-BR': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
    },
    luta: { inimigo: 'lesma', aoVencer: 'clareira' },
  },
  clareira: {
    id: 'clareira',
    emoji: '🧪',
    texto: {
      'pt-PT':
        'Numa clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {nome} descansa um pouco e recupera as forças.',
      'pt-BR':
        'Em uma clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {nome} descansa um pouco e recupera as forças.',
    },
    recompensa: { pocoes: { cura: 1 }, curar: true },
    escolhas: [
      {
        texto: { 'pt-PT': '🕳️ Entrar na caverna', 'pt-BR': '🕳️ Entrar na caverna' },
        proximaCena: 'caverna',
      },
    ],
  },
  caverna: {
    id: 'caverna',
    emoji: '🕳️',
    texto: {
      'pt-PT':
        'Uma porta de pedra tem três símbolos: 🌙 ⭐ ☀️. Qual é a ordem certa para a abrir? Pensa bem!',
      'pt-BR':
        'Uma porta de pedra tem três símbolos: 🌙 ⭐ ☀️. Qual é a ordem certa para abri-la? Pense bem!',
    },
    teste: { atributo: 'inteligencia', dificuldade: 11, sucesso: 'caverna_certo', falha: 'caverna_errado' },
  },
  caverna_certo: {
    id: 'caverna_certo',
    emoji: '🚪',
    texto: {
      'pt-PT': 'Clique! A porta abre-se devagarinho. {nome} pensou muito bem!',
      'pt-BR': 'Clique! A porta se abre devagarinho. {nome} pensou muito bem!',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'fundo' }],
  },
  caverna_errado: {
    id: 'caverna_errado',
    emoji: '🦇',
    texto: {
      'pt-PT': 'Ups! A ordem estava errada e a porta tremeu. Um morcego acordou e voou na direção de {nome}!',
      'pt-BR': 'Ops! A ordem estava errada e a porta tremeu. Um morcego acordou e voou na direção de {nome}!',
    },
    luta: { inimigo: 'morcego', aoVencer: 'caverna_certo' },
  },
  fundo: {
    id: 'fundo',
    emoji: '👺',
    texto: {
      'pt-PT': 'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua. «É minha!», grita ele.',
      'pt-BR': 'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua. «É minha!», grita ele.',
    },
    luta: { inimigo: 'goblin', aoVencer: 'fim' },
  },
  fim: {
    id: 'fim',
    emoji: '🌕',
    texto: {
      'pt-PT':
        'A Pedra da Lua voltou ao céu e a noite ficou clara! A aldeia inteira festeja {nome}, o herói da aventura.',
      'pt-BR':
        'A Pedra da Lua voltou ao céu e a noite ficou clara! A vila inteira festeja {nome}, o herói da aventura.',
    },
    fim: true,
  },
};

export const CENA_INICIAL = 'aldeia';
