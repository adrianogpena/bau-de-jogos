import type { TextoPorIdioma } from '../../../compartilhado/idioma';
import type { Escola, EscolaId, Feitico, Habilidades, InimigoMago, NomeHabilidade } from './tipos';

export const PONTOS_MAGO = 5;
export const HABILIDADE_MINIMA = 1;
export const HABILIDADE_MAXIMA = 4;
export const VIDA_MAGO = 12;
/** Energia que o mago recupera ao vencer uma luta. */
export const ENERGIA_POR_VITORIA = 2;
/** Energia ao se concentrar: depende de acertar ou errar a conta de matemática. */
export const ENERGIA_CONTA_CERTA = 2;
export const ENERGIA_CONTA_ERRADA = 1;

export const HABILIDADES: {
  id: NomeHabilidade;
  emoji: string;
  nome: TextoPorIdioma;
  ajuda: TextoPorIdioma;
}[] = [
  {
    id: 'poder',
    emoji: '[[feiticos/habilidade-poder]]',
    nome: { 'pt-PT': 'Poder', 'pt-BR': 'Poder' },
    ajuda: {
      'pt-PT': 'Os feitiços acertam mais e batem mais forte',
      'pt-BR': 'Os feitiços acertam mais e batem mais forte',
    },
  },
  {
    id: 'energia',
    emoji: '[[feiticos/habilidade-energia]]',
    nome: { 'pt-PT': 'Energia mágica', 'pt-BR': 'Energia mágica' },
    ajuda: {
      'pt-PT': 'Mais energia para lançar feitiços',
      'pt-BR': 'Mais energia para lançar feitiços',
    },
  },
  {
    id: 'sabedoria',
    emoji: '[[feiticos/habilidade-sabedoria]]',
    nome: { 'pt-PT': 'Sabedoria', 'pt-BR': 'Sabedoria' },
    ajuda: {
      'pt-PT': 'Resolve enigmas e descobre segredos',
      'pt-BR': 'Resolve enigmas e descobre segredos',
    },
  },
];

/** Energia mágica máxima: quem estudou mais tem mais energia. */
export function energiaMaxima(energia: number): number {
  return 4 + energia * 2;
}

export const FEITICOS: Record<string, Feitico> = {
  faisca: {
    id: 'faisca',
    escola: 'comum',
    emoji: '[[feiticos/faisca]]',
    nome: { 'pt-PT': 'Faísca Mágica', 'pt-BR': 'Faísca Mágica' },
    descricao: {
      'pt-PT': 'Um estalo de magia. Não gasta energia!',
      'pt-BR': 'Um estalo de magia. Não gasta energia!',
    },
    custo: 0,
    tipo: 'ataque',
    dado: 6,
  },

  // Fogo: ataques fortes
  chama: {
    id: 'chama',
    escola: 'fogo',
    emoji: '[[feiticos/chama]]',
    nome: { 'pt-PT': 'Chama', 'pt-BR': 'Chama' },
    descricao: { 'pt-PT': 'Lança uma chama. Dano d8.', 'pt-BR': 'Lança uma chama. Dano d8.' },
    custo: 1,
    tipo: 'ataque',
    dado: 8,
  },
  bola_de_fogo: {
    id: 'bola_de_fogo',
    escola: 'fogo',
    emoji: '[[feiticos/bola-de-fogo]]',
    nome: { 'pt-PT': 'Bola de Fogo', 'pt-BR': 'Bola de Fogo' },
    descricao: {
      'pt-PT': 'Nunca falha! Dano d10 +2.',
      'pt-BR': 'Nunca erra! Dano d10 +2.',
    },
    custo: 3,
    tipo: 'certeiro',
    dado: 10,
    bonusDano: 2,
    ensinavel: true,
  },
  capa_de_brasas: {
    id: 'capa_de_brasas',
    escola: 'fogo',
    emoji: '[[feiticos/capa-de-brasas]]',
    nome: { 'pt-PT': 'Capa de Brasas', 'pt-BR': 'Capa de Brasas' },
    descricao: {
      'pt-PT': 'Sobe +3 de defesa no próximo ataque do inimigo.',
      'pt-BR': 'Sobe +3 de defesa no próximo ataque do inimigo.',
    },
    custo: 2,
    tipo: 'protecao',
    bonusExtra: 3,
  },

  // Gelo: segura os inimigos
  estilhaco: {
    id: 'estilhaco',
    escola: 'gelo',
    emoji: '[[feiticos/estilhaco-de-gelo]]',
    nome: { 'pt-PT': 'Estilhaço de Gelo', 'pt-BR': 'Estilhaço de Gelo' },
    descricao: {
      'pt-PT': 'Pontaria afiada: +2 para acertar. Dano d6.',
      'pt-BR': 'Pontaria afiada: +2 para acertar. Dano d6.',
    },
    custo: 1,
    tipo: 'ataque',
    dado: 6,
    bonusAcerto: 2,
  },
  congelar: {
    id: 'congelar',
    escola: 'gelo',
    emoji: '[[feiticos/congelar]]',
    nome: { 'pt-PT': 'Congelar', 'pt-BR': 'Congelar' },
    descricao: {
      'pt-PT': 'Nunca falha! Dano d4 e o inimigo perde a vez.',
      'pt-BR': 'Nunca erra! Dano d4 e o inimigo perde a vez.',
    },
    custo: 2,
    tipo: 'atordoar',
    dado: 4,
    ensinavel: true,
  },
  armadura_de_gelo: {
    id: 'armadura_de_gelo',
    escola: 'gelo',
    emoji: '[[feiticos/armadura-de-gelo]]',
    nome: { 'pt-PT': 'Armadura de Gelo', 'pt-BR': 'Armadura de Gelo' },
    descricao: {
      'pt-PT': 'Sobe +4 de defesa no próximo ataque do inimigo.',
      'pt-BR': 'Sobe +4 de defesa no próximo ataque do inimigo.',
    },
    custo: 2,
    tipo: 'protecao',
    bonusExtra: 4,
  },

  // Natureza: cura e prende
  espinhos: {
    id: 'espinhos',
    escola: 'natureza',
    emoji: '[[feiticos/espinhos]]',
    nome: { 'pt-PT': 'Espinhos', 'pt-BR': 'Espinhos' },
    descricao: {
      'pt-PT': 'Espinhos voadores: +1 para acertar. Dano d6.',
      'pt-BR': 'Espinhos voadores: +1 para acertar. Dano d6.',
    },
    custo: 1,
    tipo: 'ataque',
    dado: 6,
    bonusAcerto: 1,
  },
  raizes: {
    id: 'raizes',
    escola: 'natureza',
    emoji: '[[feiticos/raizes-presas]]',
    nome: { 'pt-PT': 'Raízes Presas', 'pt-BR': 'Raízes Presas' },
    descricao: {
      'pt-PT': 'Nunca falha! Dano d4 e o inimigo perde a vez.',
      'pt-BR': 'Nunca erra! Dano d4 e o inimigo perde a vez.',
    },
    custo: 2,
    tipo: 'atordoar',
    dado: 4,
  },
  folhas: {
    id: 'folhas',
    escola: 'natureza',
    emoji: '[[feiticos/folhas-curativas]]',
    nome: { 'pt-PT': 'Folhas Curativas', 'pt-BR': 'Folhas Curativas' },
    descricao: {
      'pt-PT': 'Recupera vida: d6 +4.',
      'pt-BR': 'Recupera vida: d6 +4.',
    },
    custo: 2,
    tipo: 'cura',
    dado: 6,
    bonusExtra: 4,
    ensinavel: true,
  },

  // Estrelas: pontaria e luz
  raio_de_estrela: {
    id: 'raio_de_estrela',
    escola: 'estrelas',
    emoji: '[[feiticos/raio-de-estrela]]',
    nome: { 'pt-PT': 'Raio de Estrela', 'pt-BR': 'Raio de Estrela' },
    descricao: {
      'pt-PT': 'Um raio de luz: +1 para acertar. Dano d8.',
      'pt-BR': 'Um raio de luz: +1 para acertar. Dano d8.',
    },
    custo: 1,
    tipo: 'ataque',
    dado: 8,
    bonusAcerto: 1,
  },
  chuva_de_estrelas: {
    id: 'chuva_de_estrelas',
    escola: 'estrelas',
    emoji: '[[feiticos/chuva-de-estrelas]]',
    nome: { 'pt-PT': 'Chuva de Estrelas', 'pt-BR': 'Chuva de Estrelas' },
    descricao: {
      'pt-PT': 'Nunca falha! Dano d8 +3.',
      'pt-BR': 'Nunca erra! Dano d8 +3.',
    },
    custo: 3,
    tipo: 'certeiro',
    dado: 8,
    bonusDano: 3,
    ensinavel: true,
  },
  brilho_curador: {
    id: 'brilho_curador',
    escola: 'estrelas',
    emoji: '[[feiticos/brilho-curador]]',
    nome: { 'pt-PT': 'Brilho Curador', 'pt-BR': 'Brilho Curador' },
    descricao: {
      'pt-PT': 'Recupera vida: d6 +2.',
      'pt-BR': 'Recupera vida: d6 +2.',
    },
    custo: 2,
    tipo: 'cura',
    dado: 6,
    bonusExtra: 2,
  },
};

export const ESCOLAS: Escola[] = [
  {
    id: 'fogo',
    emoji: '[[extras/escola-fogo]]',
    nome: { 'pt-PT': 'Mago de Fogo', 'pt-BR': 'Mago de Fogo' },
    curto: { 'pt-PT': 'Fogo', 'pt-BR': 'Fogo' },
    resumo: { 'pt-PT': 'Ataques muito fortes', 'pt-BR': 'Ataques muito fortes' },
    feiticos: ['chama', 'bola_de_fogo', 'capa_de_brasas'],
  },
  {
    id: 'gelo',
    emoji: '[[extras/escola-gelo]]',
    nome: { 'pt-PT': 'Mago de Gelo', 'pt-BR': 'Mago de Gelo' },
    curto: { 'pt-PT': 'Gelo', 'pt-BR': 'Gelo' },
    resumo: { 'pt-PT': 'Segura os inimigos', 'pt-BR': 'Segura os inimigos' },
    feiticos: ['estilhaco', 'congelar', 'armadura_de_gelo'],
  },
  {
    id: 'natureza',
    emoji: '[[extras/escola-natureza]]',
    nome: { 'pt-PT': 'Mago da Natureza', 'pt-BR': 'Mago da Natureza' },
    curto: { 'pt-PT': 'Natureza', 'pt-BR': 'Natureza' },
    resumo: { 'pt-PT': 'Cura e prende os inimigos', 'pt-BR': 'Cura e prende os inimigos' },
    feiticos: ['espinhos', 'raizes', 'folhas'],
  },
  {
    id: 'estrelas',
    emoji: '[[extras/escola-estrelas]]',
    nome: { 'pt-PT': 'Mago das Estrelas', 'pt-BR': 'Mago das Estrelas' },
    curto: { 'pt-PT': 'Estrelas', 'pt-BR': 'Estrelas' },
    resumo: { 'pt-PT': 'Pontaria certeira e cura', 'pt-BR': 'Pontaria certeira e cura' },
    feiticos: ['raio_de_estrela', 'chuva_de_estrelas', 'brilho_curador'],
  },
];

export function escolaPorId(id: EscolaId): Escola {
  return ESCOLAS.find((e) => e.id === id)!;
}

/** Feitiços que o mago pode escolher aprender: os "ensináveis" das outras escolas. */
export function feiticosParaAprender(escola: EscolaId, conhecidos: string[]): Feitico[] {
  return Object.values(FEITICOS).filter(
    (f) => f.ensinavel && f.escola !== escola && !conhecidos.includes(f.id),
  );
}

export const HABILIDADES_INICIAIS: Habilidades = {
  poder: HABILIDADE_MINIMA,
  energia: HABILIDADE_MINIMA,
  sabedoria: HABILIDADE_MINIMA,
};

export const INIMIGOS_MAGO: Record<string, InimigoMago> = {
  livro: {
    id: 'livro',
    emoji: '[[inimigos/livro-mordilhao]]',
    nome: { 'pt-PT': 'O Livro Mordilhão', 'pt-BR': 'O Livro Mordilhão' },
    pontosDeVida: 7,
    defesa: 9,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  planta: {
    id: 'planta',
    emoji: '[[inimigos/planta-comilona]]',
    nome: { 'pt-PT': 'A Planta Comilona', 'pt-BR': 'A Planta Comilona' },
    pontosDeVida: 9,
    defesa: 10,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  fantasma: {
    id: 'fantasma',
    emoji: '[[inimigos/fantasma-brincalhao]]',
    nome: { 'pt-PT': 'O Fantasma Brincalhão', 'pt-BR': 'O Fantasma Brincalhão' },
    pontosDeVida: 10,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  gargula: {
    id: 'gargula',
    emoji: '[[inimigos/gargula]]',
    nome: { 'pt-PT': 'A Gárgula', 'pt-BR': 'A Gárgula' },
    pontosDeVida: 10,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 6,
  },
  golem: {
    id: 'golem',
    emoji: '[[inimigos/golem-guardiao]]',
    nome: { 'pt-PT': 'O Golem Guardião', 'pt-BR': 'O Golem Guardião' },
    pontosDeVida: 18,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
};
