import type { TextoPorIdioma } from '../../compartilhado/idioma';

/**
 * Modelo de dados do jogo "Achar itens".
 * Cada cena é um fundo + vários itens soltos (imagens com fundo transparente) postos em posições
 * conhecidas. Por isso o toque é exato, sem marcar nada à mão na imagem.
 * Para criar uma cena nova, descreva uma `Cena` em `cenas/` e liste-a em `cenas/index.ts`.
 */

/** Um item escondido na cena. */
export interface ItemCena {
  id: string;
  /** Caminho da imagem a partir de `public/` (ex.: `imagens/achar/quintal/gato.png`). */
  imagem: string;
  /** A palavra certa depende da variante (ex.: cão / cachorro). */
  palavra: TextoPorIdioma;
  /** Centro do item, em % da largura da cena (0 a 100). */
  x: number;
  /** Centro do item, em % da altura da cena (0 a 100). */
  y: number;
  /** Largura do item, em % da largura da cena. */
  largura: number;
  /** Ordem das camadas: maior fica na frente (para esconder um item atrás de outro). Padrão 0. */
  camada?: number;
  /** Giro em graus, para o item não parecer colado. Padrão 0. */
  giro?: number;
}

export interface Cena {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  resumo: TextoPorIdioma;
  /** Imagem de fundo (4:3) a partir de `public/`. Sem ela, usa-se `fundoCss`. */
  fundo?: string;
  /** Fundo provisório em CSS, usado enquanto não há imagem. */
  fundoCss: string;
  /** Quantos itens a criança procura em cada rodada (os outros ficam de enfeite). */
  alvos: number;
  itens: ItemCena[];
}

/** Caminho de um pictograma do ARASAAC (itens provisórios). */
export const arasaac = (numero: number) => `imagens/arasaac/${numero}.png`;
