import type { ContinenteId } from './paises';

export type MapaId = 'mundo' | ContinenteId;

/**
 * Um país como peça do quebra-cabeça. As medidas estão nas unidades do mapa (largura 1000),
 * geradas por `npm run mapas:gerar` (scripts/gerar-mapas.mjs).
 */
export interface Peca {
  /** Chave do país em `PAISES` (paises.ts), onde fica o nome por variante. */
  id: string;
  /** Desenho do país (caminho SVG), já no lugar certo do mapa. */
  d: string;
  /** Moldura da parte principal do país (sem ilhotas afastadas), para a miniatura da bandeja. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Centro da maior parte do país: é por onde a criança segura a peça. */
  cx: number;
  cy: number;
  /** Tamanho da maior parte do país; define a folga do encaixe. */
  t: number;
  /** Índice da cor (0 a 5), sempre diferente da dos países vizinhos. */
  cor: number;
}

export interface DadosMapa {
  id: MapaId;
  largura: number;
  altura: number;
  pecas: Peca[];
  /** Terra que não é peça neste mapa (países de outros continentes ou pequenos demais). */
  contexto: string;
}
