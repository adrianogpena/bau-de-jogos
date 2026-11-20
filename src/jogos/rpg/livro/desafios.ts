import type { Idioma } from '../../../compartilhado/idioma';
import type { Nivel } from '../../../compartilhado/niveis';
import { normalizar, palavraDe, palavraPorImagem, sortear } from '../../../compartilhado/palavras';
import { AJUSTES_NIVEL } from '../niveis';
import type { DefDesafio, Enigma, Figura } from './tipos';

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
  | { tipo: 'enigma'; enigma: Enigma; ordem: number[] }
  /** `figuras` na ordem certa; `mostradas` é a ordem em que as cartas aparecem (índices de `figuras`). */
  | { tipo: 'ordem'; figuras: Figura[]; mostradas: number[] }
  /** `diario`: cada figura com o seu número; `cadeado`: ordem das figuras no cadeado (índices de `diario`). */
  | { tipo: 'codigo'; diario: { figura: Figura; digito: number }[]; cadeado: number[]; resposta: string }
  /** Par i = `a[i]` com `b[i]`; `ordemB` é a ordem em que a coluna `b` aparece. */
  | { tipo: 'pares'; a: Figura[]; b: Figura[]; ordemB: number[] }
  | { tipo: 'luzes'; inicial: boolean[]; luz: string }
  /** `notas`: 0 a 3 (quatro botões coloridos). */
  | { tipo: 'som'; notas: number[] }
  | { tipo: 'padrao'; sequencia: Figura[]; opcoes: Figura[]; certa: number }
  | { tipo: 'contar'; itens: { x: number; y: number; figura: Figura; conta: boolean }[]; resposta: number };

/** Frequências dos quatro botões da melodia. */
export const NOTAS_SOM = [392, 440, 523, 659];

const porNivel = <T,>(nivel: Nivel, [facil, medio, dificil]: [T, T, T]): T =>
  nivel === 'facil' ? facil : nivel === 'medio' ? medio : dificil;

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

/** Ordem sorteada de 0 a n−1, diferente da certa. */
function ordemSorteada(n: number): number[] {
  return baralhar(Array.from({ length: n }, (_, i) => i));
}

function rodadaLuzes(luz: string, nivel: Nivel): Rodada {
  const n = porNivel(nivel, [3, 5, 6]);
  for (;;) {
    // parte de tudo aceso e aplica toques ao acaso: sempre dá para resolver
    const estado = Array<boolean>(n).fill(true);
    const toques = entre(2, 3);
    for (let k = 0; k < toques; k++) {
      const i = entre(0, n - 1);
      for (const j of [i - 1, i, i + 1]) if (j >= 0 && j < n) estado[j] = !estado[j];
    }
    if (estado.some((x) => !x)) return { tipo: 'luzes', inicial: estado, luz };
  }
}

function rodadaPadrao(pecas: Figura[], nivel: Nivel): Rodada {
  const molde = porNivel<number[]>(nivel, [[0, 1], [0, 0, 1], [0, 1, 2]]);
  const usadas = sortear(pecas, nivel === 'facil' ? 2 : 3);
  const sequencia = Array.from({ length: molde.length * 3 - 1 }, (_, i) => usadas[molde[i % molde.length]]);
  const certa = molde[(molde.length * 3 - 1) % molde.length];
  return { tipo: 'padrao', sequencia, opcoes: usadas, certa };
}

function rodadaContar(figura: Figura, parecida: Figura | undefined, nivel: Nivel): Rodada {
  const resposta = porNivel(nivel, [entre(2, 5), entre(4, 10), entre(8, 15)]);
  const outras = nivel === 'dificil' && parecida ? entre(3, 5) : 0;
  const celulas = sortear(Array.from({ length: 24 }, (_, i) => i), resposta + outras);
  const itens = celulas.map((c, i) => ({
    x: ((c % 6) + 0.5) * (100 / 6) + (Math.random() - 0.5) * 6,
    y: (Math.floor(c / 6) + 0.5) * 25 + (Math.random() - 0.5) * 8,
    figura: i < resposta ? figura : parecida!,
    conta: i < resposta,
  }));
  return { tipo: 'contar', itens, resposta };
}

function rodadaCodigo(figuras: Figura[], nivel: Nivel): Rodada {
  const n = Math.min(figuras.length, porNivel(nivel, [2, 3, 4]));
  const digitos = sortear([1, 2, 3, 4, 5, 6, 7, 8, 9], n);
  const diario = figuras.slice(0, n).map((figura, i) => ({ figura, digito: digitos[i] }));
  const cadeado = ordemSorteada(n);
  return { tipo: 'codigo', diario, cadeado, resposta: cadeado.map((i) => diario[i].digito).join('') };
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
    case 'ordem': {
      const n = Math.min(desafio.figuras.length, porNivel(nivel, [3, 4, 5]));
      return { tipo: 'ordem', figuras: desafio.figuras.slice(0, n), mostradas: ordemSorteada(n) };
    }
    case 'codigo':
      return rodadaCodigo(desafio.figuras, nivel);
    case 'pares': {
      const n = Math.min(desafio.a.length, porNivel(nivel, [3, 4, 5]));
      return { tipo: 'pares', a: desafio.a.slice(0, n), b: desafio.b.slice(0, n), ordemB: ordemSorteada(n) };
    }
    case 'luzes':
      return rodadaLuzes(desafio.luz, nivel);
    case 'som':
      return { tipo: 'som', notas: Array.from({ length: porNivel(nivel, [3, 4, 5]) }, () => entre(0, 3)) };
    case 'padrao':
      return rodadaPadrao(desafio.pecas, nivel);
    case 'contar':
      return rodadaContar(desafio.figura, desafio.parecida, nivel);
  }
}
