import type { ItemCena, Posicao } from '../tipos';

/** Caminho da imagem de um item. Todos os itens ficam em `public/imagens/achar/itens/`. */
export const img = (id: string) => `imagens/achar/itens/${id}.png`;

/** Lista de pontos `[x, y]` (em % da cena 4:3) onde um item pode ficar. */
export const lugar = (...pontos: [x: number, y: number][]): Posicao[] => pontos.map(([x, y]) => ({ x, y }));

/** Atalho: item com o mesmo nome nas duas variantes, ou com a palavra de cada uma `[pt-PT, pt-BR]`. */
export const item = (id: string, nome: string | [string, string], largura: number, posicoes: Posicao[]): ItemCena => ({
  id,
  imagem: img(id),
  palavra: Array.isArray(nome) ? { 'pt-PT': nome[0], 'pt-BR': nome[1] } : { 'pt-PT': nome, 'pt-BR': nome },
  largura,
  posicoes,
});
