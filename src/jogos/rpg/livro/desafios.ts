import type { Idioma } from '../../../compartilhado/idioma';
import type { Nivel } from '../../../compartilhado/niveis';
import { normalizar, palavraDe, palavraPorImagem, sortear } from '../../../compartilhado/palavras';
import { AJUSTES_NIVEL } from '../niveis';
import type { DefDesafio, Enigma } from './tipos';

/** Uma rodada sorteada de um puzzle: o que a criança vê e a resposta certa. */
export type Rodada =
  | {
      tipo: 'escrever';
      imagem: number;
      certa: string;
      /** Letras para tocar na ordem (fácil: só as da palavra; médio: com intrusas). `null`: escreve no teclado. */
      pecas: string[] | null;
    }
  | { tipo: 'conta'; a: number; b: number; sinal: '+' | '−'; resposta: number; mostrarConta: boolean }
  | { tipo: 'sequencia'; numeros: number[]; falta: number; resposta: number }
  | { tipo: 'enigma'; enigma: Enigma; ordem: number[] };

const entre = (minimo: number, maximo: number) => minimo + Math.floor(Math.random() * (maximo - minimo + 1));
const LETRAS = [...'abcdefgilmnoprstuv'];

function baralhar<T>(lista: T[]): T[] {
  for (let i = 0; i < 8; i++) {
    const nova = sortear(lista, lista.length);
    if (lista.length < 2 || nova.some((x, j) => x !== lista[j])) return nova;
  }
  return lista;
}

function rodadaEscrever(palavras: number[], nivel: Nivel, idioma: Idioma): Rodada {
  const todas = palavras.map((imagem) => ({ imagem, certa: palavraDe(palavraPorImagem(imagem), idioma) }));
  // fácil: palavras curtas, quando houver
  const curtas = todas.filter((p) => [...p.certa].length <= 5);
  const { imagem, certa } = sortear(nivel === 'facil' && curtas.length > 0 ? curtas : todas, 1)[0];
  if (nivel === 'dificil') return { tipo: 'escrever', imagem, certa, pecas: null };
  const letras = [...certa];
  const usadas = new Set([...normalizar(certa)]);
  const intrusas = nivel === 'medio' ? sortear(LETRAS.filter((l) => !usadas.has(l)), 3) : [];
  return { tipo: 'escrever', imagem, certa, pecas: baralhar([...letras, ...intrusas]) };
}

/** Números do nível, a partir de 2 (o enunciado fala sempre no plural: "{a} pães"). */
function rodadaConta(operacao: 'soma' | 'subtracao', nivel: Nivel): Rodada {
  const { minimo, maximo } = AJUSTES_NIVEL[nivel].conta;
  const numero = () => entre(Math.max(2, minimo), maximo);
  const x = numero();
  const y = numero();
  const mostrarConta = nivel !== 'dificil';
  return operacao === 'soma'
    ? { tipo: 'conta', a: x, b: y, sinal: '+', resposta: x + y, mostrarConta }
    : { tipo: 'conta', a: x + y, b: y, sinal: '−', resposta: x, mostrarConta };
}

/** Fácil: de 1 em 1. Médio: de 2 em 2, de 5 em 5 ou de 10 em 10. Difícil: outros passos, a subir ou a descer, com a falta no meio. */
function rodadaSequencia(nivel: Nivel): Rodada {
  let numeros: number[];
  let falta: number;
  if (nivel === 'facil') {
    const inicio = entre(1, 6);
    numeros = [0, 1, 2, 3].map((i) => inicio + i);
    falta = 3;
  } else if (nivel === 'medio') {
    const passo = sortear([2, 5, 10], 1)[0];
    const inicio = passo * entre(1, 4);
    numeros = [0, 1, 2, 3, 4].map((i) => inicio + i * passo);
    falta = 4;
  } else {
    const passo = entre(3, 9);
    const inicio = entre(1, 20);
    numeros = [0, 1, 2, 3, 4].map((i) => inicio + i * passo);
    if (Math.random() < 0.5) numeros.reverse();
    falta = entre(1, 4);
  }
  return { tipo: 'sequencia', numeros, falta, resposta: numeros[falta] };
}

/** Sorteia a rodada de um puzzle para o nível e a variante. */
export function novaRodada(desafio: DefDesafio, nivel: Nivel, idioma: Idioma): Rodada {
  switch (desafio.tipo) {
    case 'escrever':
      return rodadaEscrever(desafio.palavras, nivel, idioma);
    case 'conta':
      return rodadaConta(desafio.operacao, nivel);
    case 'sequencia':
      return rodadaSequencia(nivel);
    case 'enigma': {
      const enigma = sortear(desafio.enigmas, 1)[0];
      return { tipo: 'enigma', enigma, ordem: sortear(enigma.opcoes.map((_, i) => i), enigma.opcoes.length) };
    }
  }
}
