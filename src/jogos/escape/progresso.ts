/** Estrelas por sala, guardadas no aparelho (localStorage). Sem dados pessoais. */
const CHAVE = 'bau-de-jogos:escape';

export function lerEstrelas(): Record<string, number> {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/** Guarda a melhor pontuação da sala (1 a 3 estrelas). */
export function salvarEstrelas(salaId: string, estrelas: number): void {
  try {
    const atual = lerEstrelas();
    atual[salaId] = Math.max(atual[salaId] ?? 0, estrelas);
    localStorage.setItem(CHAVE, JSON.stringify(atual));
  } catch {
    // sem armazenamento: o progresso vale só nesta sessão
  }
}

/** 3 estrelas sem dicas, 2 com até duas dicas, 1 com mais. */
export function estrelasPorDicas(dicas: number): number {
  return dicas === 0 ? 3 : dicas <= 2 ? 2 : 1;
}
