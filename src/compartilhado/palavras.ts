import type { Idioma, TextoPorIdioma } from './idioma';

/**
 * Uma palavra ilustrada. A imagem é a mesma nas duas variantes, mas a palavra
 * certa muda (ex.: autocarro / ônibus). Cada variante tem a sua escrita.
 */
export interface PalavraIlustrada {
  /** Número do pictograma no ARASAAC (arquivo em public/imagens/arasaac/). */
  imagem: number;
  palavra: TextoPorIdioma;
}

/** Caminho da imagem de um pictograma do ARASAAC. */
export function caminhoImagem(imagem: number): string {
  return `${import.meta.env.BASE_URL}imagens/arasaac/${imagem}.png`;
}

/**
 * Amostra inicial de palavras. Revise sempre as duas variantes ao acrescentar.
 * Pictogramas: ARASAAC (CC BY-NC-SA). Ver tela de créditos e README.
 */
export const PALAVRAS: PalavraIlustrada[] = [
  { imagem: 2406, palavra: { 'pt-PT': 'gato', 'pt-BR': 'gato' } },
  { imagem: 2517, palavra: { 'pt-PT': 'cão', 'pt-BR': 'cachorro' } },
  { imagem: 2520, palavra: { 'pt-PT': 'peixe', 'pt-BR': 'peixe' } },
  { imagem: 2490, palavra: { 'pt-PT': 'pássaro', 'pt-BR': 'pássaro' } },
  { imagem: 2462, palavra: { 'pt-PT': 'maçã', 'pt-BR': 'maçã' } },
  { imagem: 2530, palavra: { 'pt-PT': 'banana', 'pt-BR': 'banana' } },
  { imagem: 2483, palavra: { 'pt-PT': 'laranja', 'pt-BR': 'laranja' } },
  { imagem: 2494, palavra: { 'pt-PT': 'pão', 'pt-BR': 'pão' } },
  { imagem: 2445, palavra: { 'pt-PT': 'leite', 'pt-BR': 'leite' } },
  { imagem: 2317, palavra: { 'pt-PT': 'casa', 'pt-BR': 'casa' } },
  { imagem: 2269, palavra: { 'pt-PT': 'bola', 'pt-BR': 'bola' } },
  { imagem: 2339, palavra: { 'pt-PT': 'carro', 'pt-BR': 'carro' } },
  { imagem: 26654, palavra: { 'pt-PT': 'autocarro', 'pt-BR': 'ônibus' } },
  { imagem: 2603, palavra: { 'pt-PT': 'comboio', 'pt-BR': 'trem' } },
  { imagem: 35209, palavra: { 'pt-PT': 'gelado', 'pt-BR': 'sorvete' } },
  { imagem: 11461, palavra: { 'pt-PT': 'sumo', 'pt-BR': 'suco' } },
  { imagem: 2586, palavra: { 'pt-PT': 'telemóvel', 'pt-BR': 'celular' } },
  { imagem: 2256, palavra: { 'pt-PT': 'árvore', 'pt-BR': 'árvore' } },
  { imagem: 3102, palavra: { 'pt-PT': 'flor', 'pt-BR': 'flor' } },
];

/** Palavra na variante pedida. */
export function palavraDe(item: PalavraIlustrada, idioma: Idioma): string {
  return item.palavra[idioma];
}

/** Minúsculas, sem espaços nas pontas e sem acentos (para comparar a resposta). */
export function normalizar(texto: string): string {
  return texto
    .trim()
    .toLocaleLowerCase('pt')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Sorteia `quantidade` itens diferentes, sem repetir. */
export function sortear<T>(lista: T[], quantidade: number): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, quantidade);
}
