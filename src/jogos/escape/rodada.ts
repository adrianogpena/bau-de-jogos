import { embaralhar } from './enigmas/tipos';
import type { Extra, FonteNumero, Nivel, Sala, Variante } from './tipos';

/** Uma fonte sorteada para o código desta rodada. */
export interface FonteSorteada {
  fonte: FonteNumero;
  variante: Variante;
  /** O número que esta fonte dá. */
  numero: number;
}

/** O que muda de uma rodada para outra na mesma sala. */
export interface Rodada {
  /** As fontes do código, pela ordem dos números no cadeado. */
  codigo: FonteSorteada[];
  /** Variante sorteada de cada extra (por id). */
  extras: Record<string, Variante>;
}

const sortear = <T>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)];

/** Número que uma variante dá: a resposta de um cadeado de um dígito, ou um número de 1 a 9 ao acaso. */
function numeroDa(variante: Variante): number {
  const { enigma } = variante;
  if (enigma.tipo === 'codigo' && /^\d$/.test(enigma.resposta)) return Number(enigma.resposta);
  return 1 + Math.floor(Math.random() * 9);
}

/** Sorteia o código (quais fontes, por que ordem, com que variante do nível) e as variantes dos extras. */
export function sortearRodada(sala: Sala, nivel: Nivel): Rodada {
  const tamanho = sortear(sala.digitos[nivel]);
  if (tamanho > sala.fontes.length) throw new Error(`Sala ${sala.id}: código de ${tamanho} com ${sala.fontes.length} fontes`);
  const codigo = embaralhar(sala.fontes)
    .slice(0, tamanho)
    .map((fonte) => {
      const variante = sortear(fonte.variantes[nivel]);
      return { fonte, variante, numero: numeroDa(variante) };
    });
  const extras = Object.fromEntries(sala.extras.map((e) => [e.id, sortear(e.variantes[nivel])]));
  return { codigo, extras };
}

/** O extra que dá a pista de que um objeto precisa. */
export function extraQueDa(sala: Sala, pista: string): Extra | undefined {
  return sala.extras.find((e) => e.recompensa.id === pista);
}
