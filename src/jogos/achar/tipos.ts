import type { TextoPorIdioma } from '../../compartilhado/idioma';

/**
 * Modelo de dados do jogo "Achar itens".
 * Cada cena é um fundo + vários itens soltos (imagens com fundo transparente) postos em posições
 * conhecidas. Por isso o toque é exato, sem marcar nada à mão na imagem.
 * Para criar uma cena nova, descreva uma `Cena` em `cenas/` e liste-a em `cenas/index.ts`.
 */

/** Região (em % da cena) onde um item sem lugar livre pode cair ao acaso. */
export interface AreaLivre {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

/** Um lugar permitido para um item. */
export interface Posicao {
  /** Centro do item, em % da largura da cena (0 a 100). */
  x: number;
  /** Centro do item, em % da altura da cena (0 a 100). */
  y: number;
  /** Ordem das camadas: maior fica na frente (para esconder um item atrás de outro). Padrão 0. */
  camada?: number;
  /** Giro em graus. Sem valor, o jogo gira o item um pouco ao acaso para não parecer colado. */
  giro?: number;
}

/** Um item escondido na cena. */
export interface ItemCena {
  id: string;
  /** Caminho da imagem a partir de `public/` (ex.: `imagens/achar/quarto/ursinho.png`). */
  imagem: string;
  /** A palavra certa depende da variante (ex.: cão / cachorro). */
  palavra: TextoPorIdioma;
  /**
   * Lugares onde este item pode aparecer. A cada rodada o jogo sorteia um deles (evitando
   * sobrepor outros itens). Com um só lugar, o item fica sempre ali.
   */
  posicoes: Posicao[];
  /** Largura do item, em % da largura da cena. */
  largura: number;
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
  /** Quantos itens aparecem na cena por rodada (alvos + enfeites sorteados). Sem valor, todos. */
  itensPorRodada?: number;
  /** Onde um item cai ao acaso quando todos os seus lugares estão ocupados. Sem valor, usa o lugar permitido. */
  areaLivre?: AreaLivre;
  itens: ItemCena[];
}

/** Caminho de um pictograma do ARASAAC (itens provisórios). */
export const arasaac = (numero: number) => `imagens/arasaac/${numero}.png`;
