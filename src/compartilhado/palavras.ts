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
 * Palavras do jogo (comece pelas mais simples). Revise sempre as duas variantes ao acrescentar.
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
  { imagem: 38090, palavra: { 'pt-PT': 'autocarro', 'pt-BR': 'ônibus' } },
  { imagem: 2603, palavra: { 'pt-PT': 'comboio', 'pt-BR': 'trem' } },
  { imagem: 35209, palavra: { 'pt-PT': 'gelado', 'pt-BR': 'sorvete' } },
  { imagem: 11461, palavra: { 'pt-PT': 'sumo', 'pt-BR': 'suco' } },
  { imagem: 2586, palavra: { 'pt-PT': 'telemóvel', 'pt-BR': 'celular' } },
  { imagem: 2256, palavra: { 'pt-PT': 'árvore', 'pt-BR': 'árvore' } },
  { imagem: 3102, palavra: { 'pt-PT': 'flor', 'pt-BR': 'flor' } },
  { imagem: 2239, palavra: { 'pt-PT': 'abelha', 'pt-BR': 'abelha' } },
  { imagem: 2264, palavra: { 'pt-PT': 'avião', 'pt-BR': 'avião' } },
  { imagem: 2273, palavra: { 'pt-PT': 'barco', 'pt-BR': 'barco' } },
  { imagem: 2275, palavra: { 'pt-PT': 'bebé', 'pt-BR': 'bebê' } },
  { imagem: 2277, palavra: { 'pt-PT': 'bicicleta', 'pt-BR': 'bicicleta' } },
  { imagem: 2281, palavra: { 'pt-PT': 'sandes', 'pt-BR': 'sanduíche' } },
  { imagem: 2294, palavra: { 'pt-PT': 'cavalo', 'pt-BR': 'cavalo' } },
  { imagem: 2304, palavra: { 'pt-PT': 'cama', 'pt-BR': 'cama' } },
  { imagem: 2306, palavra: { 'pt-PT': 'camião', 'pt-BR': 'caminhão' } },
  { imagem: 2327, palavra: { 'pt-PT': 'porco', 'pt-BR': 'porco' } },
  { imagem: 2351, palavra: { 'pt-PT': 'coelho', 'pt-BR': 'coelho' } },
  { imagem: 2362, palavra: { 'pt-PT': 'colher', 'pt-BR': 'colher' } },
  { imagem: 2372, palavra: { 'pt-PT': 'elefante', 'pt-BR': 'elefante' } },
  { imagem: 2400, palavra: { 'pt-PT': 'morango', 'pt-BR': 'morango' } },
  { imagem: 2427, palavra: { 'pt-PT': 'ovo', 'pt-BR': 'ovo' } },
  { imagem: 2440, palavra: { 'pt-PT': 'lápis', 'pt-BR': 'lápis' } },
  { imagem: 2449, palavra: { 'pt-PT': 'leão', 'pt-BR': 'leão' } },
  { imagem: 2450, palavra: { 'pt-PT': 'livro', 'pt-BR': 'livro' } },
  { imagem: 2465, palavra: { 'pt-PT': 'borboleta', 'pt-BR': 'borboleta' } },
  { imagem: 2477, palavra: { 'pt-PT': 'macaco', 'pt-BR': 'macaco' } },
  { imagem: 2541, palavra: { 'pt-PT': 'queijo', 'pt-BR': 'queijo' } },
  { imagem: 2549, palavra: { 'pt-PT': 'relógio', 'pt-BR': 'relógio' } },
  { imagem: 2561, palavra: { 'pt-PT': 'pera', 'pt-BR': 'pera' } },
  { imagem: 2563, palavra: { 'pt-PT': 'pato', 'pt-BR': 'pato' } },
  { imagem: 2572, palavra: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' } },
  { imagem: 2594, palavra: { 'pt-PT': 'tomate', 'pt-BR': 'tomate' } },
  { imagem: 2596, palavra: { 'pt-PT': 'tartaruga', 'pt-BR': 'tartaruga' } },
  { imagem: 2609, palavra: { 'pt-PT': 'vaca', 'pt-BR': 'vaca' } },
  { imagem: 2619, palavra: { 'pt-PT': 'cenoura', 'pt-BR': 'cenoura' } },
  { imagem: 3129, palavra: { 'pt-PT': 'mesa', 'pt-BR': 'mesa' } },
  { imagem: 3155, palavra: { 'pt-PT': 'cadeira', 'pt-BR': 'cadeira' } },
  { imagem: 3247, palavra: { 'pt-PT': 'uvas', 'pt-BR': 'uvas' } },
  { imagem: 3272, palavra: { 'pt-PT': 'frigorífico', 'pt-BR': 'geladeira' } },
  { imagem: 3329, palavra: { 'pt-PT': 'óculos', 'pt-BR': 'óculos' } },
  { imagem: 7252, palavra: { 'pt-PT': 'sol', 'pt-BR': 'sol' } },
  { imagem: 8042, palavra: { 'pt-PT': 'bolo', 'pt-BR': 'bolo' } },
  { imagem: 32923, palavra: { 'pt-PT': 'sapato', 'pt-BR': 'sapato' } },
  // palavras usadas nas fábulas
  { imagem: 17265, palavra: { 'pt-PT': 'lebre', 'pt-BR': 'lebre' } },
  { imagem: 16817, palavra: { 'pt-PT': 'meta', 'pt-BR': 'meta' } },
  { imagem: 2546, palavra: { 'pt-PT': 'rato', 'pt-BR': 'rato' } },
  { imagem: 6594, palavra: { 'pt-PT': 'pedra', 'pt-BR': 'pedra' } },
  { imagem: 2548, palavra: { 'pt-PT': 'rede', 'pt-BR': 'rede' } },
  { imagem: 26026, palavra: { 'pt-PT': 'corda', 'pt-BR': 'corda' } },
  { imagem: 16613, palavra: { 'pt-PT': 'cigarra', 'pt-BR': 'cigarra' } },
  { imagem: 2425, palavra: { 'pt-PT': 'formiga', 'pt-BR': 'formiga' } },
  { imagem: 7285, palavra: { 'pt-PT': 'trigo', 'pt-BR': 'trigo' } },
  { imagem: 2615, palavra: { 'pt-PT': 'violino', 'pt-BR': 'violino' } },
  { imagem: 3135, palavra: { 'pt-PT': 'neve', 'pt-BR': 'neve' } },
  { imagem: 4619, palavra: { 'pt-PT': 'corvo', 'pt-BR': 'corvo' } },
  { imagem: 2623, palavra: { 'pt-PT': 'raposa', 'pt-BR': 'raposa' } },
  { imagem: 5538, palavra: { 'pt-PT': 'bico', 'pt-BR': 'bico' } },
  { imagem: 5954, palavra: { 'pt-PT': 'porquinho', 'pt-BR': 'porquinho' } },
  { imagem: 6163, palavra: { 'pt-PT': 'palha', 'pt-BR': 'palha' } },
  { imagem: 6143, palavra: { 'pt-PT': 'madeira', 'pt-BR': 'madeira' } },
  { imagem: 2951, palavra: { 'pt-PT': 'tijolo', 'pt-BR': 'tijolo' } },
  { imagem: 6140, palavra: { 'pt-PT': 'lobo', 'pt-BR': 'lobo' } },
  // palavras dos contos dos Irmãos Grimm e das Mil e Uma Noites
  { imagem: 3012, palavra: { 'pt-PT': 'cesto', 'pt-BR': 'cesta' } },
  { imagem: 23710, palavra: { 'pt-PT': 'avó', 'pt-BR': 'avó' } },
  { imagem: 2876, palavra: { 'pt-PT': 'olhos', 'pt-BR': 'olhos' } },
  { imagem: 2943, palavra: { 'pt-PT': 'lenhador', 'pt-BR': 'lenhador' } },
  { imagem: 25940, palavra: { 'pt-PT': 'chocolate', 'pt-BR': 'chocolate' } },
  { imagem: 5404, palavra: { 'pt-PT': 'bruxa', 'pt-BR': 'bruxa' } },
  { imagem: 10135, palavra: { 'pt-PT': 'forno', 'pt-BR': 'forno' } },
  { imagem: 2385, palavra: { 'pt-PT': 'espelho', 'pt-BR': 'espelho' } },
  { imagem: 5450, palavra: { 'pt-PT': 'anão', 'pt-BR': 'anão' } },
  { imagem: 5555, palavra: { 'pt-PT': 'príncipe', 'pt-BR': 'príncipe' } },
  { imagem: 2291, palavra: { 'pt-PT': 'burro', 'pt-BR': 'burro' } },
  { imagem: 2404, palavra: { 'pt-PT': 'galo', 'pt-BR': 'galo' } },
  { imagem: 2611, palavra: { 'pt-PT': 'janela', 'pt-BR': 'janela' } },
  { imagem: 5554, palavra: { 'pt-PT': 'princesa', 'pt-BR': 'princesa' } },
  { imagem: 8197, palavra: { 'pt-PT': 'poço', 'pt-BR': 'poço' } },
  { imagem: 3384, palavra: { 'pt-PT': 'sapo', 'pt-BR': 'sapo' } },
  { imagem: 25016, palavra: { 'pt-PT': 'coroa', 'pt-BR': 'coroa' } },
  { imagem: 3244, palavra: { 'pt-PT': 'porta', 'pt-BR': 'porta' } },
  { imagem: 2729, palavra: { 'pt-PT': 'gruta', 'pt-BR': 'caverna' } },
  { imagem: 6229, palavra: { 'pt-PT': 'tesouro', 'pt-BR': 'tesouro' } },
  { imagem: 2252, palavra: { 'pt-PT': 'anel', 'pt-BR': 'anel' } },
  { imagem: 6004, palavra: { 'pt-PT': 'génio', 'pt-BR': 'gênio' } },
  { imagem: 17279, palavra: { 'pt-PT': 'palácio', 'pt-BR': 'palácio' } },
  { imagem: 2966, palavra: { 'pt-PT': 'ilha', 'pt-BR': 'ilha' } },
  { imagem: 6475, palavra: { 'pt-PT': 'diamante', 'pt-BR': 'diamante' } },
  // palavras das histórias mais longas
  { imagem: 8533, palavra: { 'pt-PT': 'caçador', 'pt-BR': 'caçador' } },
  { imagem: 16857, palavra: { 'pt-PT': 'prato', 'pt-BR': 'prato' } },
  { imagem: 2268, palavra: { 'pt-PT': 'baleia', 'pt-BR': 'baleia' } },
  { imagem: 2573, palavra: { 'pt-PT': 'sopa', 'pt-BR': 'sopa' } },
  { imagem: 2638, palavra: { 'pt-PT': 'águia', 'pt-BR': 'águia' } },
  { imagem: 2663, palavra: { 'pt-PT': 'boca', 'pt-BR': 'boca' } },
  { imagem: 2786, palavra: { 'pt-PT': 'barriga', 'pt-BR': 'barriga' } },
  { imagem: 2871, palavra: { 'pt-PT': 'orelhas', 'pt-BR': 'orelhas' } },
  { imagem: 38024, palavra: { 'pt-PT': 'feiticeiro', 'pt-BR': 'feiticeiro' } },
  { imagem: 2933, palavra: { 'pt-PT': 'lua', 'pt-BR': 'lua' } },
  { imagem: 2972, palavra: { 'pt-PT': 'osso', 'pt-BR': 'osso' } },
  { imagem: 5077, palavra: { 'pt-PT': 'folha', 'pt-BR': 'folha' } },
  { imagem: 35051, palavra: { 'pt-PT': 'cobra', 'pt-BR': 'cobra' } },
  { imagem: 37689, palavra: { 'pt-PT': 'jarro', 'pt-BR': 'jarro' } },
  { imagem: 4674, palavra: { 'pt-PT': 'ladrão', 'pt-BR': 'ladrão' } },
  { imagem: 5494, palavra: { 'pt-PT': 'jaula', 'pt-BR': 'jaula' } },
  { imagem: 5563, palavra: { 'pt-PT': 'rei', 'pt-BR': 'rei' } },
  { imagem: 8072, palavra: { 'pt-PT': 'lareira', 'pt-BR': 'lareira' } },
  { imagem: 9086, palavra: { 'pt-PT': 'panela', 'pt-BR': 'panela' } },
  { imagem: 9178, palavra: { 'pt-PT': 'lâmpada', 'pt-BR': 'lâmpada' } },
  { imagem: 6210, palavra: { 'pt-PT': 'saco', 'pt-BR': 'saco' } },
  { imagem: 2333, palavra: { 'pt-PT': 'chaminé', 'pt-BR': 'chaminé' } },
];

/** Procura a palavra de um pictograma (falha cedo se faltar no dicionário). */
export function palavraPorImagem(imagem: number): PalavraIlustrada {
  const item = PALAVRAS.find((p) => p.imagem === imagem);
  if (!item) throw new Error(`Palavra do pictograma ${imagem} não encontrada em PALAVRAS.`);
  return item;
}

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
