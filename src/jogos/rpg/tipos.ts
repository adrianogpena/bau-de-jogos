import type { LadosDado } from '../../compartilhado/dados';
import type { Genero, TextoPorIdioma } from '../../compartilhado/idioma';

export type NomeAtributo = 'forca' | 'agilidade' | 'inteligencia' | 'coragem';

/** Atributos da ficha de personagem do RPG. */
export type Atributos = Record<NomeAtributo, number>;

/** Ficha do personagem controlado pela criança. */
export interface FichaPersonagem {
  genero: Genero;
  /** Emoji do avatar escolhido. */
  avatar: string;
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

/** Uma opção que a criança pode escolher em uma cena. */
export interface Escolha {
  texto: TextoPorIdioma;
  proximaCena: string;
  /** Só aparece se o herói decifrou o mapa do Chefe (caminho mais fácil). */
  exigeMapa?: boolean;
}

/** Uma cena da história. Os textos existem nas duas variantes. */
export interface Cena {
  id: string;
  emoji: string;
  texto: TextoPorIdioma;
  escolhas?: Escolha[];
  /** Pergunta mostrada acima das escolhas (ex.: "O que quer fazer?"). */
  pergunta?: TextoPorIdioma;
  /** Cena do puzzle do mapa; depois dele a história segue para `proxima`. */
  puzzle?: { proxima: string };
  /** Luta nesta cena; depois de vencer, segue para `aoVencer`. */
  luta?: { inimigo: string; aoVencer: string };
  /** Teste com d20 + atributo; sempre leva a algum lugar (sem beco sem saída). */
  teste?: { atributo: NomeAtributo; dificuldade: number; sucesso: string; falha: string };
  /** Vantagens ao chegar na cena. */
  recompensa?: { pocoes?: Record<string, number>; curar?: boolean };
  /** Última cena da aventura. */
  fim?: boolean;
}
