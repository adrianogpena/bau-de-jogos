import type { Nivel } from '../../compartilhado/niveis';

/**
 * Ajustes de cada nível das histórias do RPG. O difícil é o jogo original.
 * Os níveis mais fáceis não tiram o risco: a defesa dos inimigos não muda (o herói ainda falha golpes)
 * e um inimigo ainda pode vencer. Mudam as chances e os recursos.
 */
export interface AjustesNivel {
  /** Somado ao bônus de ataque dos inimigos (negativo: erram mais). */
  ataqueInimigo: number;
  /** Fração da vida dos inimigos (arredondada para cima). */
  vidaInimigo: number;
  /** Somado à dificuldade dos testes com d20. */
  dificuldadeTeste: number;
  /** Pedra da Lua: moedas iniciais, em pratas. */
  moedas: number;
  /** Pedra da Lua: poções que o herói já leva de casa. */
  pocoesIniciais: Record<string, number>;
  /** Pedra da Lua: tentativas para decifrar o mapa. */
  tentativasPuzzle: number;
  /** Torre Encantada: vida extra do mago. */
  vidaMago: number;
  /** Torre Encantada: energia mágica máxima extra. */
  energiaMago: number;
  /** Torre Encantada: menor e maior número das contas de somar para se concentrar. */
  conta: { minimo: number; maximo: number };
}

export const AJUSTES_NIVEL: Record<Nivel, AjustesNivel> = {
  facil: {
    ataqueInimigo: -2,
    vidaInimigo: 0.8,
    dificuldadeTeste: -3,
    moedas: 150,
    pocoesIniciais: { cura: 1 },
    tentativasPuzzle: 5,
    vidaMago: 4,
    energiaMago: 2,
    conta: { minimo: 1, maximo: 5 },
  },
  medio: {
    ataqueInimigo: -1,
    vidaInimigo: 0.85,
    dificuldadeTeste: -1,
    moedas: 130,
    pocoesIniciais: {},
    tentativasPuzzle: 4,
    vidaMago: 2,
    energiaMago: 1,
    conta: { minimo: 5, maximo: 20 },
  },
  dificil: {
    ataqueInimigo: 0,
    vidaInimigo: 1,
    dificuldadeTeste: 0,
    moedas: 105,
    pocoesIniciais: {},
    tentativasPuzzle: 3,
    vidaMago: 0,
    energiaMago: 0,
    conta: { minimo: 10, maximo: 50 },
  },
};

/** Inimigo com a vida e o ataque do nível. */
export function inimigoDoNivel<T extends { pontosDeVida: number; bonusAtaque: number }>(inimigo: T, nivel: Nivel): T {
  const a = AJUSTES_NIVEL[nivel];
  return {
    ...inimigo,
    pontosDeVida: Math.ceil(inimigo.pontosDeVida * a.vidaInimigo),
    bonusAtaque: inimigo.bonusAtaque + a.ataqueInimigo,
  };
}
