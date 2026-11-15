import type { LadosDado } from '../../compartilhado/dados';
import type { TextoPorIdioma } from '../../compartilhado/idioma';

export type NomeAtributo = 'forca' | 'agilidade' | 'inteligencia' | 'coragem';

/** Atributos da ficha de personagem do RPG. */
export type Atributos = Record<NomeAtributo, number>;

/** Ficha do personagem controlado pela criança. */
export interface FichaPersonagem {
  /** Id do personagem escolhido (veja personagem.ts). */
  personagem: string;
  pontosDeVida: number;
  pontosDeVidaMaximos: number;
  atributos: Atributos;
  /** Dinheiro em pratas (1 ouro = 10 pratas). */
  prata: number;
  /** Id da melhor arma comprada. */
  arma: string | null;
  /** Id da melhor armadura comprada. */
  armadura: string | null;
  escudo: boolean;
  /** Poções que a criança tem: id do item -> quantidade. */
  pocoes: Record<string, number>;
}

export interface Inimigo {
  id: string;
  emoji: string;
  nome: TextoPorIdioma;
  pontosDeVida: number;
  /** O ataque do herói (d20 + força) precisa chegar a este valor. */
  defesa: number;
  /** Somado ao d20 quando o inimigo ataca. */
  bonusAtaque: number;
  dadoDeDano: LadosDado;
}
