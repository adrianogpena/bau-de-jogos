import type { LadosDado } from '../../compartilhado/dados';
import type { TextoPorIdioma } from '../../compartilhado/idioma';

export type NomeAtributo = 'forca' | 'agilidade' | 'inteligencia' | 'coragem';

/** Atributos da ficha de personagem do RPG. */
export type Atributos = Record<NomeAtributo, number>;

/** Ficha do personagem controlado pela criança. */
export interface FichaPersonagem {
  nome: string;
  /** Emoji do avatar escolhido. */
  avatar: string;
  pontosDeVida: number;
  pontosDeVidaMaximos: number;
  atributos: Atributos;
  pocoes: number;
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

/** Uma opção que a criança pode escolher em uma cena. */
export interface Escolha {
  texto: TextoPorIdioma;
  proximaCena: string;
}

/** Uma cena da história. Os textos existem nas duas variantes. */
export interface Cena {
  id: string;
  emoji: string;
  texto: TextoPorIdioma;
  escolhas?: Escolha[];
  /** Luta nesta cena; depois de vencer, segue para `aoVencer`. */
  luta?: { inimigo: string; aoVencer: string };
  /** Teste com d20 + atributo; sempre leva a algum lugar (sem beco sem saída). */
  teste?: { atributo: NomeAtributo; dificuldade: number; sucesso: string; falha: string };
  /** Vantagens ao chegar na cena. */
  recompensa?: { pocoes?: number; curar?: boolean };
  /** Última cena da aventura. */
  fim?: boolean;
}
