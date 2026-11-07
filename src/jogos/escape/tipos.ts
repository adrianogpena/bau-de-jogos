import type { TextoPorIdioma } from '../../compartilhado/idioma';

/**
 * Modelo de dados da Saída Secreta (jogo de fuga).
 *
 * Cada sala é um fundo desenhado (4:3) que já traz todos os objetos. Cada objeto é uma `Zona` fixa do desenho:
 * tocar nela abre o enigma do objeto. A sala tem 9 fontes de número, extras (ex.: o quadro que esconde a chave
 * do baú) e uma saída. A criança escolhe o nível (fácil, médio ou difícil); a cada rodada o jogo sorteia 3 ou 4
 * fontes e uma variante do enigma de cada uma, desse nível; o
 * cadeado da saída mostra o desenho dessas fontes, pela ordem do código. A história e a saída não mudam, mas o
 * caminho até lá muda sempre.
 *
 * Para criar uma sala nova, descreva uma `Sala` em `salas/` e liste-a em `salas/index.ts`.
 * Todo texto é escrito por variante (pt-PT e pt-BR).
 */

/** Nível de dificuldade: fácil (4 a 5 anos), médio (6 a 7 anos), difícil (8 anos ou mais). */
export type Nivel = 'facil' | 'medio' | 'dificil';

export const NIVEIS: Nivel[] = ['facil', 'medio', 'dificil'];

/** Uma lista para cada nível. */
export type PorNivel<T> = Record<Nivel, T>;

/** Retângulo do objeto no fundo, em % da cena: centro (x, y), largura e altura. */
export interface Zona {
  x: number;
  y: number;
  largura: number;
  altura: number;
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

/**
 * Jogo da memória: achar todos os pares. Um emoji sozinho vira duas cartas iguais; um par `['⚽', '🥅']` vira
 * duas cartas diferentes que combinam (pares associados, mais difíceis).
 */
export interface EnigmaPares extends EnigmaBase {
  tipo: 'pares';
  emojis: (string | [string, string])[];
}

export type Enigma = EnigmaCodigo | EnigmaOrdem | EnigmaEscolha | EnigmaPares;

/** Uma versão do enigma de um objeto. A cada rodada o jogo sorteia uma. */
export interface Variante {
  enigma: Enigma;
  /** Dica lida quando a criança pede ajuda e este objeto é o próximo. */
  dica: TextoPorIdioma;
}

interface ObjetoBase {
  id: string;
  nome: TextoPorIdioma;
  /** Emoji ou ícone `[[pasta/nome]]`, usado só enquanto a sala não tem imagem de fundo. */
  emoji: string;
  zona: Zona;
  /** Versões do enigma de cada nível (pelo menos 3 por nível). */
  variantes: PorNivel<Variante[]>;
  /** Pista (id de um extra) que precisa estar no inventário para abrir este objeto. */
  requer?: string;
  /** Mensagem quando falta a pista necessária. */
  bloqueado?: TextoPorIdioma;
}

/**
 * Objeto que pode esconder um número do código. Se o enigma sorteado for um cadeado de um dígito, o número é a
 * própria resposta; nos outros tipos, o jogo sorteia um número de 1 a 9.
 */
export interface FonteNumero extends ObjetoBase {
  /** Mensagem ao resolver; `{n}` vira o número achado. */
  sucesso: TextoPorIdioma;
}

/** Algo que o jogador ganha num extra e guarda no inventário (ex.: uma chave). */
export interface Pista {
  id: string;
  emoji: string;
  nome: TextoPorIdioma;
}

/** Objeto que não dá número, mas dá uma pista necessária para abrir outro objeto. */
export interface Extra extends ObjetoBase {
  recompensa: Pista;
  sucesso: TextoPorIdioma;
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
  /** Imagem de fundo (4:3) a partir de `public/`, com todos os objetos já desenhados. */
  fundo?: string;
  /** Fundo provisório em CSS, usado enquanto não há imagem (os objetos aparecem como emoji). */
  fundoCss: string;
  /** Quantos números pode ter o código em cada nível (o jogo sorteia um destes valores a cada rodada). */
  digitos: PorNivel<number[]>;
  /** As fontes de número da sala (9). */
  fontes: FonteNumero[];
  extras: Extra[];
  /** Mensagem ao tocar numa fonte que não faz parte do código desta rodada. */
  semNumero: TextoPorIdioma;
  /** O cadeado final que abre a saída. */
  saida: {
    nome: TextoPorIdioma;
    emoji: string;
    zona: Zona;
    /** Pergunta do cadeado (os desenhos dos objetos aparecem por cima dos números). */
    pergunta: TextoPorIdioma;
    /** Dica antes de a criança ver o cadeado. */
    dicaVer: TextoPorIdioma;
    /** Dica quando já tem todos os números. */
    dica: TextoPorIdioma;
  };
  /** História de fecho, mostrada ao escapar. */
  vitoria: TextoPorIdioma;
}
