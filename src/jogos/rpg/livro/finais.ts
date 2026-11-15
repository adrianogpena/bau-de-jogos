/** Finais que a criança já descobriu em cada história do RPG (guardados no aparelho, para convidar a jogar de novo). */
const CHAVE = 'bau-de-jogos:rpg-finais';

function ler(): Record<string, string[]> {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? '{}');
    return salvo && typeof salvo === 'object' ? (salvo as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

export function finaisDescobertos(historia: string): string[] {
  const lista = ler()[historia];
  return Array.isArray(lista) ? lista : [];
}

/** Guarda o final e devolve todos os já descobertos nesta história. */
export function registrarFinal(historia: string, final: string): string[] {
  const todos = ler();
  const lista = finaisDescobertos(historia);
  if (lista.includes(final)) return lista;
  const nova = [...lista, final];
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ ...todos, [historia]: nova }));
  } catch {
    // sem armazenamento: vale só para esta sessão
  }
  return nova;
}
