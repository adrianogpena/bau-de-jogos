/** Lados dos dados usados nos jogos (ex.: lutas do RPG). */
export type LadosDado = 4 | 6 | 8 | 10 | 12 | 20;

/** Rola um dado com a quantidade de lados informada. Devolve de 1 até `lados`. */
export function rolarDado(lados: LadosDado): number {
  const sorteio = new Uint32Array(1);
  crypto.getRandomValues(sorteio);
  return (sorteio[0] % lados) + 1;
}

/** Rola vários dados de uma vez (ex.: 2d6). */
export function rolarDados(quantidade: number, lados: LadosDado): number[] {
  return Array.from({ length: quantidade }, () => rolarDado(lados));
}

export function somar(valores: number[]): number {
  return valores.reduce((total, valor) => total + valor, 0);
}
