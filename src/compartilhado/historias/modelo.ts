import type { Idioma, TextoPorIdioma } from '../idioma';
import { type PalavraIlustrada, palavraDe, palavraPorImagem } from '../palavras';

/**
 * Um parágrafo como é escrito nos arquivos das histórias: os números dos pictogramas
 * (`palavras`) e o texto de cada variante. No texto, `{1}` marca o lugar da primeira
 * palavra, `{2}` o da segunda, e assim por diante, na ordem de `palavras`.
 */
export type ParagrafoBruto = TextoPorIdioma & { palavras: number[] };

export interface HistoriaBruta {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  paragrafos: ParagrafoBruto[];
}

export interface Paragrafo {
  /** As palavras do parágrafo, na ordem em que aparecem no texto. */
  palavras: PalavraIlustrada[];
  texto: TextoPorIdioma;
}

/**
 * Uma jogada: uma palavra de um parágrafo. Parágrafo com duas palavras vira duas jogadas,
 * na ordem do texto; as outras palavras do parágrafo aparecem como contexto.
 */
export interface Rodada {
  paragrafo: Paragrafo;
  /** Posição da palavra desta jogada em `paragrafo.palavras`. */
  alvo: number;
  palavra: PalavraIlustrada;
  /** É a última palavra do parágrafo (então o parágrafo inteiro pode ser lido). */
  ultima: boolean;
}

export interface Fabula {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  paragrafos: Paragrafo[];
  rodadas: Rodada[];
}

/** Um pedaço de parágrafo: texto corrido ou o lugar de uma palavra. */
export type Segmento =
  | { tipo: 'texto'; texto: string }
  | { tipo: 'palavra'; posicao: number; texto: string };

const MARCAS = /\{(\d+)\}/g;

/** Quebra o parágrafo em texto e palavras, na ordem em que aparecem. */
export function segmentosDoParagrafo(paragrafo: Paragrafo, idioma: Idioma): Segmento[] {
  const segmentos: Segmento[] = [];
  let fim = 0;
  const texto = paragrafo.texto[idioma];
  for (const marca of texto.matchAll(MARCAS)) {
    if (marca.index > fim) segmentos.push({ tipo: 'texto', texto: texto.slice(fim, marca.index) });
    const posicao = Number(marca[1]) - 1;
    segmentos.push({ tipo: 'palavra', posicao, texto: palavraDe(paragrafo.palavras[posicao], idioma) });
    fim = marca.index + marca[0].length;
  }
  if (fim < texto.length) segmentos.push({ tipo: 'texto', texto: texto.slice(fim) });
  return segmentos;
}

/** O parágrafo inteiro, com as palavras no lugar (para ler em voz alta). */
export function paragrafoCompleto(paragrafo: Paragrafo, idioma: Idioma): string {
  return segmentosDoParagrafo(paragrafo, idioma)
    .map((s) => s.texto)
    .join('');
}

/** Cria uma história a partir dos dados escritos à mão, conferindo tudo ao carregar. */
export function fabula({ id, emoji, titulo, paragrafos }: HistoriaBruta): Fabula {
  // no jogo de leitura as palavras da história viram opções umas das outras: não podem repetir
  const imagens = new Set<number>();
  const prontos = paragrafos.map((bruto, n): Paragrafo => {
    const onde = `História "${id}", parágrafo ${n + 1}`;
    const { palavras: numeros, ...texto } = bruto;
    if (numeros.length === 0) throw new Error(`${onde}: faltam palavras.`);
    for (const variante of Object.keys(texto) as Idioma[]) {
      const usadas = [...texto[variante].matchAll(MARCAS)].map((m) => Number(m[1]));
      const esperadas = numeros.map((_, i) => i + 1);
      if (usadas.join() !== esperadas.join()) {
        throw new Error(
          `${onde} (${variante}): o texto precisa ter ${esperadas.map((i) => `{${i}}`).join(' ')} nessa ordem, uma vez cada.`,
        );
      }
    }
    for (const imagem of numeros) {
      if (imagens.has(imagem)) throw new Error(`${onde}: a imagem ${imagem} aparece duas vezes na história.`);
      imagens.add(imagem);
    }
    return { palavras: numeros.map(palavraPorImagem), texto };
  });

  const rodadas = prontos.flatMap((paragrafo) =>
    paragrafo.palavras.map((palavra, alvo) => ({
      paragrafo,
      alvo,
      palavra,
      ultima: alvo === paragrafo.palavras.length - 1,
    })),
  );
  return { id, emoji, titulo, paragrafos: prontos, rodadas };
}
