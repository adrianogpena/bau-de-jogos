import type { Inimigo } from '../tipos';

export type NomeAtributoArqueiro = 'pontaria' | 'agilidade' | 'visao' | 'coragem';

export type AtributosArqueiro = Record<NomeAtributoArqueiro, number>;

/** Ficha do arqueiro: a aljava (flechas) é o recurso da história. */
export interface FichaArqueiro {
  /** Id do personagem escolhido (veja personagem.ts). */
  personagem: string;
  pontosDeVida: number;
  pontosDeVidaMaximos: number;
  atributos: AtributosArqueiro;
  flechas: number;
  /** Flechas com que a aventura começou: depois de cada luta, a aljava recupera até este valor. */
  flechasIniciais: number;
}

/** Inimigo do navio. `voa`: ao ficar perto, foge e a luta volta a ser de longe. */
export interface InimigoNavio extends Inimigo {
  voa?: boolean;
}
