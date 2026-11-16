import type { Idioma, TextoPorIdioma } from './idioma';

/**
 * Uma palavra ilustrada. A imagem é a mesma nas duas variantes, mas a palavra
 * certa muda (ex.: autocarro / ônibus). Cada variante tem a sua escrita.
 */
export interface PalavraIlustrada {
  /** Identificador numérico da palavra (usado nas histórias). */
  imagem: number;
  /** Nome do arquivo em public/imagens/itens/ (sem .png). */
  arquivo: string;
  palavra: TextoPorIdioma;
}

/** Caminho da imagem de uma palavra, em public/imagens/itens/. */
export function caminhoImagem(imagem: number): string {
  return `${import.meta.env.BASE_URL}imagens/itens/${ARQUIVOS.get(imagem)}.png`;
}

/**
 * Palavras do jogo (comece pelas mais simples). Revise sempre as duas variantes ao acrescentar.
 */
export const PALAVRAS: PalavraIlustrada[] = [
  { imagem: 2406, arquivo: 'gato', palavra: { 'pt-PT': 'gato', 'pt-BR': 'gato' } },
  { imagem: 2517, arquivo: 'cachorro', palavra: { 'pt-PT': 'cão', 'pt-BR': 'cachorro' } },
  { imagem: 2520, arquivo: 'peixe', palavra: { 'pt-PT': 'peixe', 'pt-BR': 'peixe' } },
  { imagem: 2490, arquivo: 'passaro', palavra: { 'pt-PT': 'pássaro', 'pt-BR': 'pássaro' } },
  { imagem: 2462, arquivo: 'maca', palavra: { 'pt-PT': 'maçã', 'pt-BR': 'maçã' } },
  { imagem: 2530, arquivo: 'banana', palavra: { 'pt-PT': 'banana', 'pt-BR': 'banana' } },
  { imagem: 2483, arquivo: 'laranja', palavra: { 'pt-PT': 'laranja', 'pt-BR': 'laranja' } },
  { imagem: 2494, arquivo: 'pao', palavra: { 'pt-PT': 'pão', 'pt-BR': 'pão' } },
  { imagem: 2445, arquivo: 'leite', palavra: { 'pt-PT': 'leite', 'pt-BR': 'leite' } },
  { imagem: 2317, arquivo: 'casa', palavra: { 'pt-PT': 'casa', 'pt-BR': 'casa' } },
  { imagem: 2269, arquivo: 'bola', palavra: { 'pt-PT': 'bola', 'pt-BR': 'bola' } },
  { imagem: 2339, arquivo: 'carro', palavra: { 'pt-PT': 'carro', 'pt-BR': 'carro' } },
  { imagem: 38090, arquivo: 'onibus', palavra: { 'pt-PT': 'autocarro', 'pt-BR': 'ônibus' } },
  { imagem: 2603, arquivo: 'trem', palavra: { 'pt-PT': 'comboio', 'pt-BR': 'trem' } },
  { imagem: 35209, arquivo: 'sorvete', palavra: { 'pt-PT': 'gelado', 'pt-BR': 'sorvete' } },
  { imagem: 11461, arquivo: 'suco', palavra: { 'pt-PT': 'sumo', 'pt-BR': 'suco' } },
  { imagem: 2586, arquivo: 'celular', palavra: { 'pt-PT': 'telemóvel', 'pt-BR': 'celular' } },
  { imagem: 2256, arquivo: 'arvore', palavra: { 'pt-PT': 'árvore', 'pt-BR': 'árvore' } },
  { imagem: 3102, arquivo: 'flor', palavra: { 'pt-PT': 'flor', 'pt-BR': 'flor' } },
  { imagem: 2239, arquivo: 'abelha', palavra: { 'pt-PT': 'abelha', 'pt-BR': 'abelha' } },
  { imagem: 2264, arquivo: 'aviao', palavra: { 'pt-PT': 'avião', 'pt-BR': 'avião' } },
  { imagem: 2273, arquivo: 'barco', palavra: { 'pt-PT': 'barco', 'pt-BR': 'barco' } },
  { imagem: 2275, arquivo: 'bebe', palavra: { 'pt-PT': 'bebé', 'pt-BR': 'bebê' } },
  { imagem: 2277, arquivo: 'bicicleta', palavra: { 'pt-PT': 'bicicleta', 'pt-BR': 'bicicleta' } },
  { imagem: 2281, arquivo: 'sanduiche', palavra: { 'pt-PT': 'sandes', 'pt-BR': 'sanduíche' } },
  { imagem: 2294, arquivo: 'cavalo', palavra: { 'pt-PT': 'cavalo', 'pt-BR': 'cavalo' } },
  { imagem: 2304, arquivo: 'cama', palavra: { 'pt-PT': 'cama', 'pt-BR': 'cama' } },
  { imagem: 2306, arquivo: 'caminhao', palavra: { 'pt-PT': 'camião', 'pt-BR': 'caminhão' } },
  { imagem: 2327, arquivo: 'porco', palavra: { 'pt-PT': 'porco', 'pt-BR': 'porco' } },
  { imagem: 2351, arquivo: 'coelho', palavra: { 'pt-PT': 'coelho', 'pt-BR': 'coelho' } },
  { imagem: 2362, arquivo: 'colher', palavra: { 'pt-PT': 'colher', 'pt-BR': 'colher' } },
  { imagem: 2372, arquivo: 'elefante', palavra: { 'pt-PT': 'elefante', 'pt-BR': 'elefante' } },
  { imagem: 2400, arquivo: 'morango', palavra: { 'pt-PT': 'morango', 'pt-BR': 'morango' } },
  { imagem: 2427, arquivo: 'ovo', palavra: { 'pt-PT': 'ovo', 'pt-BR': 'ovo' } },
  { imagem: 2440, arquivo: 'lapis', palavra: { 'pt-PT': 'lápis', 'pt-BR': 'lápis' } },
  { imagem: 2449, arquivo: 'leao', palavra: { 'pt-PT': 'leão', 'pt-BR': 'leão' } },
  { imagem: 2450, arquivo: 'livro', palavra: { 'pt-PT': 'livro', 'pt-BR': 'livro' } },
  { imagem: 2465, arquivo: 'borboleta', palavra: { 'pt-PT': 'borboleta', 'pt-BR': 'borboleta' } },
  { imagem: 2477, arquivo: 'macaco', palavra: { 'pt-PT': 'macaco', 'pt-BR': 'macaco' } },
  { imagem: 2541, arquivo: 'queijo', palavra: { 'pt-PT': 'queijo', 'pt-BR': 'queijo' } },
  { imagem: 2549, arquivo: 'relogio-parede', palavra: { 'pt-PT': 'relógio', 'pt-BR': 'relógio' } },
  { imagem: 2561, arquivo: 'pera', palavra: { 'pt-PT': 'pera', 'pt-BR': 'pera' } },
  { imagem: 2563, arquivo: 'pato', palavra: { 'pt-PT': 'pato', 'pt-BR': 'pato' } },
  { imagem: 2572, arquivo: 'chapeu', palavra: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' } },
  { imagem: 2594, arquivo: 'tomate', palavra: { 'pt-PT': 'tomate', 'pt-BR': 'tomate' } },
  { imagem: 2596, arquivo: 'tartaruga', palavra: { 'pt-PT': 'tartaruga', 'pt-BR': 'tartaruga' } },
  { imagem: 2609, arquivo: 'vaca', palavra: { 'pt-PT': 'vaca', 'pt-BR': 'vaca' } },
  { imagem: 2619, arquivo: 'cenoura', palavra: { 'pt-PT': 'cenoura', 'pt-BR': 'cenoura' } },
  { imagem: 3129, arquivo: 'mesa', palavra: { 'pt-PT': 'mesa', 'pt-BR': 'mesa' } },
  { imagem: 3155, arquivo: 'cadeira', palavra: { 'pt-PT': 'cadeira', 'pt-BR': 'cadeira' } },
  { imagem: 3247, arquivo: 'uva', palavra: { 'pt-PT': 'uvas', 'pt-BR': 'uvas' } },
  { imagem: 3272, arquivo: 'geladeira', palavra: { 'pt-PT': 'frigorífico', 'pt-BR': 'geladeira' } },
  { imagem: 3329, arquivo: 'oculos', palavra: { 'pt-PT': 'óculos', 'pt-BR': 'óculos' } },
  { imagem: 7252, arquivo: 'sol', palavra: { 'pt-PT': 'sol', 'pt-BR': 'sol' } },
  { imagem: 8042, arquivo: 'bolo', palavra: { 'pt-PT': 'bolo', 'pt-BR': 'bolo' } },
  { imagem: 32923, arquivo: 'sapato', palavra: { 'pt-PT': 'sapato', 'pt-BR': 'sapato' } },
  // palavras usadas nas fábulas
  { imagem: 17265, arquivo: 'lebre', palavra: { 'pt-PT': 'lebre', 'pt-BR': 'lebre' } },
  { imagem: 16817, arquivo: 'meta', palavra: { 'pt-PT': 'meta', 'pt-BR': 'meta' } },
  { imagem: 2546, arquivo: 'rato', palavra: { 'pt-PT': 'rato', 'pt-BR': 'rato' } },
  { imagem: 6594, arquivo: 'pedra', palavra: { 'pt-PT': 'pedra', 'pt-BR': 'pedra' } },
  { imagem: 2548, arquivo: 'rede', palavra: { 'pt-PT': 'rede', 'pt-BR': 'rede' } },
  { imagem: 26026, arquivo: 'corda', palavra: { 'pt-PT': 'corda', 'pt-BR': 'corda' } },
  { imagem: 16613, arquivo: 'cigarra', palavra: { 'pt-PT': 'cigarra', 'pt-BR': 'cigarra' } },
  { imagem: 2425, arquivo: 'formiga', palavra: { 'pt-PT': 'formiga', 'pt-BR': 'formiga' } },
  { imagem: 7285, arquivo: 'trigo', palavra: { 'pt-PT': 'trigo', 'pt-BR': 'trigo' } },
  { imagem: 2615, arquivo: 'violino', palavra: { 'pt-PT': 'violino', 'pt-BR': 'violino' } },
  { imagem: 3135, arquivo: 'neve', palavra: { 'pt-PT': 'neve', 'pt-BR': 'neve' } },
  { imagem: 4619, arquivo: 'corvo', palavra: { 'pt-PT': 'corvo', 'pt-BR': 'corvo' } },
  { imagem: 2623, arquivo: 'raposa', palavra: { 'pt-PT': 'raposa', 'pt-BR': 'raposa' } },
  { imagem: 5538, arquivo: 'bico', palavra: { 'pt-PT': 'bico', 'pt-BR': 'bico' } },
  { imagem: 5954, arquivo: 'porquinho', palavra: { 'pt-PT': 'porquinho', 'pt-BR': 'porquinho' } },
  { imagem: 6163, arquivo: 'palha', palavra: { 'pt-PT': 'palha', 'pt-BR': 'palha' } },
  { imagem: 6143, arquivo: 'madeira', palavra: { 'pt-PT': 'madeira', 'pt-BR': 'madeira' } },
  { imagem: 2951, arquivo: 'tijolo', palavra: { 'pt-PT': 'tijolo', 'pt-BR': 'tijolo' } },
  { imagem: 6140, arquivo: 'lobo', palavra: { 'pt-PT': 'lobo', 'pt-BR': 'lobo' } },
  // palavras dos contos dos Irmãos Grimm e das Mil e Uma Noites
  { imagem: 3012, arquivo: 'cesto', palavra: { 'pt-PT': 'cesto', 'pt-BR': 'cesta' } },
  { imagem: 23710, arquivo: 'avo', palavra: { 'pt-PT': 'avó', 'pt-BR': 'avó' } },
  { imagem: 2876, arquivo: 'olhos', palavra: { 'pt-PT': 'olhos', 'pt-BR': 'olhos' } },
  { imagem: 2943, arquivo: 'lenhador', palavra: { 'pt-PT': 'lenhador', 'pt-BR': 'lenhador' } },
  { imagem: 25940, arquivo: 'chocolate', palavra: { 'pt-PT': 'chocolate', 'pt-BR': 'chocolate' } },
  { imagem: 5404, arquivo: 'bruxa', palavra: { 'pt-PT': 'bruxa', 'pt-BR': 'bruxa' } },
  { imagem: 10135, arquivo: 'forno', palavra: { 'pt-PT': 'forno', 'pt-BR': 'forno' } },
  { imagem: 2385, arquivo: 'espelho', palavra: { 'pt-PT': 'espelho', 'pt-BR': 'espelho' } },
  { imagem: 5450, arquivo: 'anao', palavra: { 'pt-PT': 'anão', 'pt-BR': 'anão' } },
  { imagem: 5555, arquivo: 'principe', palavra: { 'pt-PT': 'príncipe', 'pt-BR': 'príncipe' } },
  { imagem: 2291, arquivo: 'burro', palavra: { 'pt-PT': 'burro', 'pt-BR': 'burro' } },
  { imagem: 2404, arquivo: 'galo', palavra: { 'pt-PT': 'galo', 'pt-BR': 'galo' } },
  { imagem: 2611, arquivo: 'janela', palavra: { 'pt-PT': 'janela', 'pt-BR': 'janela' } },
  { imagem: 5554, arquivo: 'princesa', palavra: { 'pt-PT': 'princesa', 'pt-BR': 'princesa' } },
  { imagem: 8197, arquivo: 'poco', palavra: { 'pt-PT': 'poço', 'pt-BR': 'poço' } },
  { imagem: 3384, arquivo: 'sapo', palavra: { 'pt-PT': 'sapo', 'pt-BR': 'sapo' } },
  { imagem: 25016, arquivo: 'coroa', palavra: { 'pt-PT': 'coroa', 'pt-BR': 'coroa' } },
  { imagem: 3244, arquivo: 'porta', palavra: { 'pt-PT': 'porta', 'pt-BR': 'porta' } },
  { imagem: 2729, arquivo: 'caverna', palavra: { 'pt-PT': 'gruta', 'pt-BR': 'caverna' } },
  { imagem: 6229, arquivo: 'tesouro', palavra: { 'pt-PT': 'tesouro', 'pt-BR': 'tesouro' } },
  { imagem: 2252, arquivo: 'anel', palavra: { 'pt-PT': 'anel', 'pt-BR': 'anel' } },
  { imagem: 6004, arquivo: 'genio', palavra: { 'pt-PT': 'génio', 'pt-BR': 'gênio' } },
  { imagem: 17279, arquivo: 'palacio', palavra: { 'pt-PT': 'palácio', 'pt-BR': 'palácio' } },
  { imagem: 2966, arquivo: 'ilha', palavra: { 'pt-PT': 'ilha', 'pt-BR': 'ilha' } },
  { imagem: 6475, arquivo: 'diamante', palavra: { 'pt-PT': 'diamante', 'pt-BR': 'diamante' } },
  // palavras das histórias mais longas
  { imagem: 8533, arquivo: 'cacador', palavra: { 'pt-PT': 'caçador', 'pt-BR': 'caçador' } },
  { imagem: 16857, arquivo: 'prato', palavra: { 'pt-PT': 'prato', 'pt-BR': 'prato' } },
  { imagem: 2268, arquivo: 'baleia', palavra: { 'pt-PT': 'baleia', 'pt-BR': 'baleia' } },
  { imagem: 2573, arquivo: 'sopa', palavra: { 'pt-PT': 'sopa', 'pt-BR': 'sopa' } },
  { imagem: 2638, arquivo: 'aguia', palavra: { 'pt-PT': 'águia', 'pt-BR': 'águia' } },
  { imagem: 2663, arquivo: 'boca', palavra: { 'pt-PT': 'boca', 'pt-BR': 'boca' } },
  { imagem: 2786, arquivo: 'barriga', palavra: { 'pt-PT': 'barriga', 'pt-BR': 'barriga' } },
  { imagem: 2871, arquivo: 'orelhas', palavra: { 'pt-PT': 'orelhas', 'pt-BR': 'orelhas' } },
  { imagem: 38024, arquivo: 'feiticeiro', palavra: { 'pt-PT': 'feiticeiro', 'pt-BR': 'feiticeiro' } },
  { imagem: 2933, arquivo: 'lua', palavra: { 'pt-PT': 'lua', 'pt-BR': 'lua' } },
  { imagem: 2972, arquivo: 'osso', palavra: { 'pt-PT': 'osso', 'pt-BR': 'osso' } },
  { imagem: 5077, arquivo: 'folha', palavra: { 'pt-PT': 'folha', 'pt-BR': 'folha' } },
  { imagem: 35051, arquivo: 'cobra', palavra: { 'pt-PT': 'cobra', 'pt-BR': 'cobra' } },
  { imagem: 37689, arquivo: 'jarro', palavra: { 'pt-PT': 'jarro', 'pt-BR': 'jarro' } },
  { imagem: 4674, arquivo: 'ladrao', palavra: { 'pt-PT': 'ladrão', 'pt-BR': 'ladrão' } },
  { imagem: 5494, arquivo: 'jaula', palavra: { 'pt-PT': 'jaula', 'pt-BR': 'jaula' } },
  { imagem: 5563, arquivo: 'rei', palavra: { 'pt-PT': 'rei', 'pt-BR': 'rei' } },
  { imagem: 8072, arquivo: 'lareira', palavra: { 'pt-PT': 'lareira', 'pt-BR': 'lareira' } },
  { imagem: 9086, arquivo: 'panela', palavra: { 'pt-PT': 'panela', 'pt-BR': 'panela' } },
  { imagem: 9178, arquivo: 'lampada', palavra: { 'pt-PT': 'lâmpada', 'pt-BR': 'lâmpada' } },
  { imagem: 6210, arquivo: 'saco', palavra: { 'pt-PT': 'saco', 'pt-BR': 'saco' } },
  { imagem: 2333, arquivo: 'chamine', palavra: { 'pt-PT': 'chaminé', 'pt-BR': 'chaminé' } },
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

const ARQUIVOS = new Map(PALAVRAS.map((p) => [p.imagem, p.arquivo] as const));
