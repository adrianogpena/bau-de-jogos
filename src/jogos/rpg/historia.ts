import type { TextoPorIdioma } from '../../compartilhado/idioma';
import type { Cena, Inimigo, NomeAtributo } from './tipos';

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
    emoji: '[[interface/forca]]',
    nome: { 'pt-PT': 'Força', 'pt-BR': 'Força' },
    ajuda: { 'pt-PT': 'Acerta mais e bate mais forte', 'pt-BR': 'Acerta mais e bate mais forte' },
  },
  {
    id: 'agilidade',
    emoji: '[[interface/agilidade]]',
    nome: { 'pt-PT': 'Agilidade', 'pt-BR': 'Agilidade' },
    ajuda: { 'pt-PT': 'Foge dos golpes e salta bem', 'pt-BR': 'Foge dos golpes e pula bem' },
  },
  {
    id: 'inteligencia',
    emoji: '[[extras/inteligencia]]',
    nome: { 'pt-PT': 'Inteligência', 'pt-BR': 'Inteligência' },
    ajuda: { 'pt-PT': 'Resolve enigmas', 'pt-BR': 'Resolve enigmas' },
  },
  {
    id: 'coragem',
    emoji: '[[extras/coragem]]',
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
    emoji: '[[inimigos/lobo]]',
    nome: { 'pt-PT': 'O Lobo', 'pt-BR': 'O Lobo' },
    pontosDeVida: 8,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  lesma: {
    id: 'lesma',
    emoji: '[[inimigos/lesma]]',
    nome: { 'pt-PT': 'A Lesma Gigante', 'pt-BR': 'A Lesma Gigante' },
    pontosDeVida: 6,
    defesa: 8,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  morcego: {
    id: 'morcego',
    emoji: '[[inimigos/morcego]]',
    nome: { 'pt-PT': 'O Morcego', 'pt-BR': 'O Morcego' },
    pontosDeVida: 6,
    defesa: 12,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  esqueleto: {
    id: 'esqueleto',
    emoji: '[[inimigos/esqueleto]]',
    nome: { 'pt-PT': 'O Esqueleto', 'pt-BR': 'O Esqueleto' },
    pontosDeVida: 9,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 6,
  },
  sapo: {
    id: 'sapo',
    emoji: '[[inimigos/sapo-gigante]]',
    nome: { 'pt-PT': 'O Sapo Gigante', 'pt-BR': 'O Sapo Gigante' },
    pontosDeVida: 8,
    defesa: 9,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  goblin: {
    id: 'goblin',
    emoji: '[[inimigos/goblin-chefe]]',
    nome: { 'pt-PT': 'O Goblin Chefe', 'pt-BR': 'O Goblin Chefe' },
    pontosDeVida: 16,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
};

/** Puzzle do mapa do Chefe: três enigmas que se resolvem com as pistas. */
export interface PerguntaPuzzle {
  id: string;
  titulo: TextoPorIdioma;
  opcoes: { id: string; emoji: string; nome: TextoPorIdioma }[];
  certa: string;
}

export const PUZZLE: { tentativas: number; pistas: TextoPorIdioma[]; perguntas: PerguntaPuzzle[] } = {
  tentativas: 3,
  pistas: [
    {
      'pt-PT': 'O atalho da saída da aldeia não passa por onde o lobo uiva.',
      'pt-BR': 'O atalho da saída da vila não passa por onde o lobo uiva.',
    },
    {
      'pt-PT': 'Esse atalho também não passa por onde é preciso atravessar a água.',
      'pt-BR': 'Esse atalho também não passa por onde é preciso atravessar a água.',
    },
    {
      'pt-PT': 'O atalho do vale foge da lama onde vivem os sapos.',
      'pt-BR': 'O atalho do vale foge da lama onde vivem os sapos.',
    },
    {
      'pt-PT': 'E foge da ponte velha, onde dorme um esqueleto.',
      'pt-BR': 'E foge da ponte velha, onde dorme um esqueleto.',
    },
    {
      'pt-PT': 'A porta da caverna abre-se para quem tem o mesmo nome da Pedra.',
      'pt-BR': 'A porta da caverna se abre para quem tem o mesmo nome da Pedra.',
    },
    {
      'pt-PT': 'O Sol acorda o goblin e a estrela é pequena demais para a fechadura.',
      'pt-BR': 'O Sol acorda o goblin e a estrela é pequena demais para a fechadura.',
    },
  ],
  perguntas: [
    {
      id: 'saida',
      titulo: {
        'pt-PT': 'Na saída da aldeia, onde fica o atalho?',
        'pt-BR': 'Na saída da vila, onde fica o atalho?',
      },
      opcoes: [
        { id: 'floresta', emoji: '🌲', nome: { 'pt-PT': 'Floresta', 'pt-BR': 'Floresta' } },
        { id: 'rio', emoji: '🌊', nome: { 'pt-PT': 'Rio', 'pt-BR': 'Rio' } },
        { id: 'montanha', emoji: '⛰️', nome: { 'pt-PT': 'Montanha', 'pt-BR': 'Montanha' } },
      ],
      certa: 'montanha',
    },
    {
      id: 'vale',
      titulo: { 'pt-PT': 'No vale, onde fica o atalho?', 'pt-BR': 'No vale, onde fica o atalho?' },
      opcoes: [
        { id: 'ponte', emoji: '🌉', nome: { 'pt-PT': 'Ponte', 'pt-BR': 'Ponte' } },
        { id: 'pantano', emoji: '🐸', nome: { 'pt-PT': 'Pântano', 'pt-BR': 'Pântano' } },
        { id: 'tunel', emoji: '🔦', nome: { 'pt-PT': 'Túnel', 'pt-BR': 'Túnel' } },
      ],
      certa: 'tunel',
    },
    {
      id: 'porta',
      titulo: {
        'pt-PT': 'Na porta da caverna, que símbolo a abre?',
        'pt-BR': 'Na porta da caverna, que símbolo a abre?',
      },
      opcoes: [
        { id: 'lua', emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
        { id: 'estrela', emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
        { id: 'sol', emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
      ],
      certa: 'lua',
    },
  ],
};

const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };
const CAMINHO_DO_MAPA: TextoPorIdioma = {
  'pt-PT': '🗺️ Seguir o caminho do mapa',
  'pt-BR': '🗺️ Seguir o caminho do mapa',
};
const O_QUE_FAZER: TextoPorIdioma = {
  'pt-PT': 'O que quer fazer {nome}?',
  'pt-BR': 'O que {nome} quer fazer?',
};

/** A história. "{nome}" vira "o herói/a heroína" (veja personagem.ts). */
export const CENAS: Record<string, Cena> = {
  aldeia: {
    id: 'aldeia',
    emoji: '[[cenas/aldeia]]',
    texto: {
      'pt-PT':
        'O Chefe da aldeia chama {nome} à praça: «A Pedra da Lua foi roubada pelo Goblin Chefe e o céu ficou escuro! Ele escondeu-se numa caverna, longe daqui. Só tu podes trazer a Pedra de volta!»',
      'pt-BR':
        'O Chefe da vila chama {nome} até a praça: «A Pedra da Lua foi roubada pelo Goblin Chefe e o céu ficou escuro! Ele se escondeu em uma caverna, longe daqui. Só você pode trazer a Pedra de volta!»',
    },
    escolhas: [
      {
        texto: { 'pt-PT': '📜 Ver o mapa velho', 'pt-BR': '📜 Ver o mapa velho' },
        proximaCena: 'mapa',
      },
    ],
  },
  mapa: {
    id: 'mapa',
    emoji: '[[interface/mapa]]',
    texto: {
      'pt-PT':
        'O Chefe desenrola um mapa velho e cheio de enigmas: «Este mapa esconde atalhos secretos! Lê as pistas com atenção e descobre onde fica cada atalho. Se acertares tudo, o caminho será mais fácil.»',
      'pt-BR':
        'O Chefe abre um mapa velho e cheio de enigmas: «Este mapa esconde atalhos secretos! Leia as pistas com atenção e descubra onde fica cada atalho. Se acertar tudo, o caminho será mais fácil.»',
    },
    puzzle: { proxima: 'saida' },
  },
  saida: {
    id: 'saida',
    emoji: '[[cenas/estrada]]',
    texto: {
      'pt-PT':
        '{Nome} chega ao fim da aldeia. O caminho divide-se: de um lado, a floresta escura; do outro, um rio com pedras no meio da água.',
      'pt-BR':
        '{Nome} chega ao fim da vila. O caminho se divide: de um lado, a floresta escura; do outro, um rio com pedras no meio da água.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        texto: { 'pt-PT': '🌲 Entrar na floresta escura', 'pt-BR': '🌲 Entrar na floresta escura' },
        proximaCena: 'floresta',
      },
      {
        texto: { 'pt-PT': '🌊 Atravessar o rio', 'pt-BR': '🌊 Atravessar o rio' },
        proximaCena: 'rio',
      },
      { texto: CAMINHO_DO_MAPA, proximaCena: 'trilha', exigeMapa: true },
    ],
  },
  floresta: {
    id: 'floresta',
    emoji: '[[cenas/floresta]]',
    texto: {
      'pt-PT': '{Nome} entra na floresta escura. Dois olhos amarelos brilham entre as árvores... É um lobo!',
      'pt-BR': '{Nome} entra na floresta escura. Dois olhos amarelos brilham entre as árvores... É um lobo!',
    },
    luta: { inimigo: 'lobo', aoVencer: 'clareira' },
  },
  rio: {
    id: 'rio',
    emoji: '[[cenas/rio]]',
    texto: {
      'pt-PT': '{Nome} chega ao rio. Há pedras no meio da água para atravessar. Salta de pedra em pedra sem cair!',
      'pt-BR': '{Nome} chega ao rio. Há pedras no meio da água para atravessar. Pule de pedra em pedra sem cair!',
    },
    teste: { atributo: 'agilidade', dificuldade: 10, sucesso: 'rio_certo', falha: 'rio_errado' },
  },
  rio_certo: {
    id: 'rio_certo',
    emoji: '[[cenas/coelho]]',
    texto: {
      'pt-PT': 'Que salto! {Nome} atravessou como um coelho, sem molhar os pés.',
      'pt-BR': 'Que pulo! {Nome} atravessou como um coelho, sem molhar os pés.',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'clareira' }],
  },
  rio_errado: {
    id: 'rio_errado',
    emoji: '[[cenas/rio]]',
    texto: {
      'pt-PT': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
      'pt-BR': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
    },
    luta: { inimigo: 'lesma', aoVencer: 'clareira' },
  },
  trilha: {
    id: 'trilha',
    emoji: '[[cenas/montanha]]',
    texto: {
      'pt-PT':
        'Seguindo o mapa, {nome} encontra uma trilha escondida na montanha. Ninguém passa por ali há anos! Sobre uma pedra, está esquecida uma poção de força. 💥',
      'pt-BR':
        'Seguindo o mapa, {nome} encontra uma trilha escondida na montanha. Ninguém passa por ali há anos! Sobre uma pedra, está esquecida uma poção de força. 💥',
    },
    recompensa: { pocoes: { forca: 1 } },
    escolhas: [{ texto: SEGUIR, proximaCena: 'clareira' }],
  },
  clareira: {
    id: 'clareira',
    emoji: '[[cenas/clareira]]',
    texto: {
      'pt-PT':
        'Numa clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {Nome} descansa um pouco e recupera as forças.',
      'pt-BR':
        'Em uma clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {Nome} descansa um pouco e recupera as forças.',
    },
    recompensa: { pocoes: { cura: 1 }, curar: true },
    escolhas: [{ texto: SEGUIR, proximaCena: 'vale' }],
  },
  vale: {
    id: 'vale',
    emoji: '[[cenas/vale]]',
    texto: {
      'pt-PT':
        'Depois da clareira, o caminho chega a um vale. À frente há uma ponte velha de madeira e, ao lado, um pântano cheio de sapos.',
      'pt-BR':
        'Depois da clareira, o caminho chega a um vale. À frente há uma ponte velha de madeira e, ao lado, um pântano cheio de sapos.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        texto: { 'pt-PT': '🌉 Atravessar a ponte velha', 'pt-BR': '🌉 Atravessar a ponte velha' },
        proximaCena: 'ponte',
      },
      {
        texto: { 'pt-PT': '🐸 Passar pelo pântano', 'pt-BR': '🐸 Passar pelo pântano' },
        proximaCena: 'pantano',
      },
      { texto: CAMINHO_DO_MAPA, proximaCena: 'tunel', exigeMapa: true },
    ],
  },
  ponte: {
    id: 'ponte',
    emoji: '[[cenas/ponte]]',
    texto: {
      'pt-PT': 'A ponte velha range e abana. Cuidado com as tábuas podres! Atravessa com equilíbrio.',
      'pt-BR': 'A ponte velha range e balança. Cuidado com as tábuas podres! Atravesse com equilíbrio.',
    },
    teste: { atributo: 'agilidade', dificuldade: 11, sucesso: 'ponte_certo', falha: 'ponte_errado' },
  },
  ponte_certo: {
    id: 'ponte_certo',
    emoji: '[[cenas/acrobata]]',
    texto: {
      'pt-PT': 'Que equilíbrio! {Nome} atravessou a ponte sem partir nenhuma tábua.',
      'pt-BR': 'Que equilíbrio! {Nome} atravessou a ponte sem quebrar nenhuma tábua.',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'caverna' }],
  },
  ponte_errado: {
    id: 'ponte_errado',
    emoji: '[[inimigos/esqueleto]]',
    texto: {
      'pt-PT': 'Crac! Uma tábua partiu-se e um esqueleto saiu de baixo da ponte, a chocalhar os ossos!',
      'pt-BR': 'Crac! Uma tábua quebrou e um esqueleto saiu de baixo da ponte, chacoalhando os ossos!',
    },
    luta: { inimigo: 'esqueleto', aoVencer: 'ponte_certo' },
  },
  pantano: {
    id: 'pantano',
    emoji: '[[inimigos/sapo-gigante]]',
    texto: {
      'pt-PT': '{Nome} entra no pântano. Plop! Um sapo gigante salta da lama!',
      'pt-BR': '{Nome} entra no pântano. Plop! Um sapo gigante pula da lama!',
    },
    luta: { inimigo: 'sapo', aoVencer: 'caverna' },
  },
  tunel: {
    id: 'tunel',
    emoji: '[[cenas/tunel-lanterna]]',
    texto: {
      'pt-PT':
        'Seguindo o mapa, {nome} encontra um túnel secreto escondido atrás de umas pedras. Lá dentro há um cantinho quente para descansar e uma poção de cura. 🧪',
      'pt-BR':
        'Seguindo o mapa, {nome} encontra um túnel secreto escondido atrás de umas pedras. Lá dentro há um cantinho quentinho para descansar e uma poção de cura. 🧪',
    },
    recompensa: { pocoes: { cura: 1 }, curar: true },
    escolhas: [{ texto: SEGUIR, proximaCena: 'caverna' }],
  },
  caverna: {
    id: 'caverna',
    emoji: '[[cenas/caverna]]',
    texto: {
      'pt-PT':
        '{Nome} chega a uma grande porta de pedra, na entrada da caverna do Goblin Chefe. Tem três símbolos a brilhar: 🌙 ⭐ ☀️.',
      'pt-BR':
        '{Nome} chega a uma grande porta de pedra, na entrada da caverna do Goblin Chefe. Tem três símbolos brilhando: 🌙 ⭐ ☀️.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        texto: { 'pt-PT': '🧠 Decifrar a fechadura', 'pt-BR': '🧠 Decifrar a fechadura' },
        proximaCena: 'fechadura',
      },
      {
        texto: { 'pt-PT': '💪 Empurrar com força', 'pt-BR': '💪 Empurrar com força' },
        proximaCena: 'empurrar',
      },
      {
        texto: { 'pt-PT': '🌙 Tocar no símbolo do mapa', 'pt-BR': '🌙 Tocar no símbolo do mapa' },
        proximaCena: 'porta_mapa',
        exigeMapa: true,
      },
    ],
  },
  fechadura: {
    id: 'fechadura',
    emoji: '[[extras/inteligencia]]',
    texto: {
      'pt-PT': 'A fechadura tem engrenagens e símbolos que rodam. Pensa bem na ordem certa!',
      'pt-BR': 'A fechadura tem engrenagens e símbolos que giram. Pense bem na ordem certa!',
    },
    teste: { atributo: 'inteligencia', dificuldade: 11, sucesso: 'porta_aberta', falha: 'porta_morcego' },
  },
  empurrar: {
    id: 'empurrar',
    emoji: '[[interface/forca]]',
    texto: {
      'pt-PT': '{Nome} encosta o ombro à porta e empurra com todas as forças!',
      'pt-BR': '{Nome} encosta o ombro na porta e empurra com todas as forças!',
    },
    teste: { atributo: 'forca', dificuldade: 13, sucesso: 'porta_aberta', falha: 'porta_morcego' },
  },
  porta_mapa: {
    id: 'porta_mapa',
    emoji: '[[cenas/lua]]',
    texto: {
      'pt-PT': 'Seguindo o mapa, {nome} toca no símbolo da Lua. A porta brilha e abre-se sozinha!',
      'pt-BR': 'Seguindo o mapa, {nome} toca no símbolo da Lua. A porta brilha e se abre sozinha!',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'fundo' }],
  },
  porta_aberta: {
    id: 'porta_aberta',
    emoji: '[[cenas/porta-de-pedra]]',
    texto: {
      'pt-PT': 'Clique! A porta abre-se devagarinho. {Nome} conseguiu!',
      'pt-BR': 'Clique! A porta se abre devagarinho. {Nome} conseguiu!',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'fundo' }],
  },
  porta_morcego: {
    id: 'porta_morcego',
    emoji: '[[inimigos/morcego]]',
    texto: {
      'pt-PT': 'Ups! A porta tremeu com o barulho. Um morcego acordou e voou na direção {doNome}!',
      'pt-BR': 'Ops! A porta tremeu com o barulho. Um morcego acordou e voou na direção {doNome}!',
    },
    luta: { inimigo: 'morcego', aoVencer: 'porta_aberta' },
  },
  fundo: {
    id: 'fundo',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT': 'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua. «É minha!», grita ele.',
      'pt-BR': 'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua. «É minha!», grita ele.',
    },
    luta: { inimigo: 'goblin', aoVencer: 'fim' },
  },
  fim: {
    id: 'fim',
    emoji: '[[cenas/lua-cheia]]',
    texto: {
      'pt-PT':
        'A Pedra da Lua voltou ao céu e a noite ficou clara! A aldeia inteira festeja {nome}, que salvou a noite.',
      'pt-BR':
        'A Pedra da Lua voltou ao céu e a noite ficou clara! A vila inteira festeja {nome}, que salvou a noite.',
    },
    fim: true,
  },
};

export const CENA_INICIAL = 'aldeia';
