import type { LadosDado } from '../../compartilhado/dados';

/** Atributos da ficha de personagem do RPG. */
export interface Atributos {
  forca: number;
  agilidade: number;
  inteligencia: number;
  coragem: number;
}

/** Ficha do personagem controlado pela criança. */
export interface FichaPersonagem {
  nome: string;
  /** Identificador do avatar escolhido (ex.: emoji ou nome de imagem). */
  avatar: string;
  nivel: number;
  pontosDeVida: number;
  pontosDeVidaMaximos: number;
  atributos: Atributos;
  inventario: string[];
}

/** Uma opção que a criança pode escolher em uma cena da história. */
export interface Escolha {
  /** Id da cena para onde a escolha leva. */
  proximaCena: string;
  /** Chaves de texto da escolha (o texto em si vem por idioma). */
  textoId: string;
}

/** Uma cena da história. O texto fica separado por idioma (pt-PT / pt-BR). */
export interface Cena {
  id: string;
  textoId: string;
  escolhas: Escolha[];
  /** Se houver luta nesta cena, descreve o inimigo. */
  luta?: Inimigo;
}

export interface Inimigo {
  nomeId: string;
  pontosDeVida: number;
  dadoDeAtaque: LadosDado;
}
