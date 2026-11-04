/**
 * Variantes do português suportadas.
 * Todo texto exibido para a criança deve existir nas duas variantes.
 */
export type Idioma = 'pt-PT' | 'pt-BR';

export const IDIOMAS: { codigo: Idioma; rotulo: string }[] = [
  { codigo: 'pt-PT', rotulo: 'Português de Portugal' },
  { codigo: 'pt-BR', rotulo: 'Português do Brasil' },
];

/** Um texto com uma versão para cada variante. */
export type TextoPorIdioma = Record<Idioma, string>;

const CHAVE_ARMAZENAMENTO = 'bau-de-jogos:idioma';

/** Escolhe o idioma salvo; se não houver, tenta adivinhar pelo tablet. */
export function idiomaInicial(): Idioma {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (salvo === 'pt-PT' || salvo === 'pt-BR') return salvo;
  } catch {
    // armazenamento indisponível: segue para a detecção automática
  }
  return navigator.language.toLowerCase().startsWith('pt-pt') ? 'pt-PT' : 'pt-BR';
}

export function salvarIdioma(idioma: Idioma): void {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, idioma);
  } catch {
    // sem armazenamento: o idioma vale só para esta sessão
  }
}

/** Devolve o texto na variante pedida. */
export function t(texto: TextoPorIdioma, idioma: Idioma): string {
  return texto[idioma];
}

/** Troca `{chave}` pelos valores dados (ex.: "{nome} venceu!"). */
export function preencher(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (_, chave: string) => String(valores[chave] ?? ''));
}
