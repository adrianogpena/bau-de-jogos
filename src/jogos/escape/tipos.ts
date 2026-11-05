import type { TextoPorIdioma } from '../../compartilhado/idioma';

/**
 * Modelo de dados do motor de escape room.
 * Para criar uma sala nova, basta descrever uma `Sala` em `salas/` e listá-la em `salas/index.ts`.
 * Todo texto é escrito por variante (pt-PT e pt-BR).
 */

/** Algo que o jogador ganha ao resolver um enigma e guarda no inventário. */
export interface Pista {
  id: string;
  emoji: string;
  nome: TextoPorIdioma;
  /** Valor curto mostrado junto ao emoji (ex.: um dígito do código final). */
  valor?: string;
}

interface EnigmaBase {
  /** Pergunta ou instrução do enigma. */
  pergunta: TextoPorIdioma;
  /** Imagem grande (emojis) mostrada acima da pergunta. */
  visual?: string;
}

/** Cadeado numérico: a resposta é uma sequência de dígitos. */
export interface EnigmaCodigo extends EnigmaBase {
  tipo: 'codigo';
  resposta: string;
}

/** Colocar os símbolos na ordem certa (`itens` já está na ordem correta; o jogo embaralha). */
export interface EnigmaOrdem extends EnigmaBase {
  tipo: 'ordem';
  itens: string[];
}

/** Escolher uma opção (ex.: o intruso, a resposta certa). */
export interface EnigmaEscolha extends EnigmaBase {
  tipo: 'escolha';
  opcoes: { emoji: string; nome: TextoPorIdioma }[];
  /** Posição da opção certa em `opcoes`. */
  certa: number;
}

/** Jogo da memória: achar todos os pares (cada emoji aparece uma vez aqui e o jogo duplica). */
export interface EnigmaPares extends EnigmaBase {
  tipo: 'pares';
  emojis: string[];
}

export type Enigma = EnigmaCodigo | EnigmaOrdem | EnigmaEscolha | EnigmaPares;

/** Um objeto tocável na sala. Resolver o enigma dele dá uma pista. */
export interface ObjetoSala {
  id: string;
  emoji: string;
  nome: TextoPorIdioma;
  /** Posição na cena, em percentagem (0 a 100). */
  x: number;
  y: number;
  enigma: Enigma;
  recompensa: Pista;
  /** Mensagem mostrada ao resolver. */
  sucesso: TextoPorIdioma;
  /** Dica gradual: lida quando a criança pede ajuda e este é o próximo objeto. */
  dica: TextoPorIdioma;
  /** Pista (id) que precisa estar no inventário para abrir este objeto. */
  requer?: string;
  /** Mensagem quando falta a pista necessária. */
  bloqueado?: TextoPorIdioma;
}

export interface Sala {
  id: string;
  emoji: string;
  cor: string;
  titulo: TextoPorIdioma;
  /** Resumo mostrado no cartão de escolha da sala. */
  resumo: TextoPorIdioma;
  /** História de abertura. */
  intro: TextoPorIdioma;
  /** Fundo da cena (CSS `background`). */
  fundo: string;
  objetos: ObjetoSala[];
  /** O cadeado final que abre a saída. */
  saida: { emoji: string; nome: TextoPorIdioma; enigma: Enigma; dica: TextoPorIdioma };
  /** História de fecho, mostrada ao escapar. */
  vitoria: TextoPorIdioma;
}
