import type { TextoPorIdioma } from './idioma';

/** Nível de dificuldade: fácil (4 a 5 anos), médio (6 a 7 anos), difícil (8 anos ou mais). */
export type Nivel = 'facil' | 'medio' | 'dificil';

export const NIVEIS: Nivel[] = ['facil', 'medio', 'dificil'];

/** Nome e idade de cada nível (botões de escolha e cartões). */
export const TEXTOS_NIVEL: Record<Nivel, { nome: TextoPorIdioma; idade: TextoPorIdioma }> = {
  facil: { nome: { 'pt-PT': 'Fácil', 'pt-BR': 'Fácil' }, idade: { 'pt-PT': '4 a 5 anos', 'pt-BR': '4 a 5 anos' } },
  medio: { nome: { 'pt-PT': 'Médio', 'pt-BR': 'Médio' }, idade: { 'pt-PT': '6 a 7 anos', 'pt-BR': '6 a 7 anos' } },
  dificil: { nome: { 'pt-PT': 'Difícil', 'pt-BR': 'Difícil' }, idade: { 'pt-PT': '8 anos ou mais', 'pt-BR': '8 anos ou mais' } },
};
