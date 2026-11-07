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

/** Gênero do personagem escolhido pela criança (masculino ou feminino), para concordar os textos. */
export type Genero = 'm' | 'f';

/**
 * Troca `{chave}` pelos valores dados (ex.: "{nome} venceu!") e escolhe o gênero.
 *
 * - `{o|a}`: texto masculino | texto feminino, conforme `valores.genero` ('m' ou 'f'; sem gênero, vale o masculino).
 *   Serve para artigos e concordância: "{O|A} {herói|heroína} está {pronto|pronta}".
 * - `{Chave}` com inicial maiúscula usa o valor de `{chave}` com a primeira letra maiúscula
 *   (início de frase: "{Nome} entra" vira "O herói entra").
 */
export function preencher(texto: string, valores: Record<string, string | number>): string {
  const feminino = valores.genero === 'f';
  return texto
    .replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, masculino: string, femininoTexto: string) =>
      feminino ? femininoTexto : masculino,
    )
    .replace(/\{(\w+)\}/g, (_, chave: string) => {
      if (valores[chave] !== undefined) return String(valores[chave]);
      const minuscula = chave[0].toLowerCase() + chave.slice(1);
      const valor = minuscula !== chave ? valores[minuscula] : undefined;
      return valor === undefined ? '' : String(valor).replace(/^./, (c) => c.toUpperCase());
    });
}
