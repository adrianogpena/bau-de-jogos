import type { Idioma } from './idioma';

/** Maior número que o narrador diz com áudio próprio (0 a 100). */
export const NUMERO_MAXIMO_NARRADO = 100;

/**
 * Frase com até MAXIMO_NUMEROS_FRASE_INTEIRA números, todos até este valor, é gravada inteira, com os números por
 * extenso dentro do texto (voz e entonação contínuas). Acima disso, ou com mais números, a frase é tocada em pedaços (pecasDaFala.ts), porque
 * gravar todas as combinações não cabe no projeto.
 */
export const NUMERO_MAXIMO_FRASE_INTEIRA = 20;

/**
 * A frase é gravada inteira quando todos os seus números são até NUMERO_MAXIMO_FRASE_INTEIRA e ela tem um só número,
 * ou dois números que contam moedas ("Tens 15 moedas de ouro e 5 moedas de prata"). Outras frases com dois números
 * (ex.: "Tiraste 15 contra a defesa 12") têm combinações demais e ficam em pedaços.
 */
export function fraseInteira(texto: string): boolean {
  const numeros = [...texto.matchAll(/\d+/g)];
  if (numeros.length === 0 || numeros.length > 2) return false;
  if (!numeros.every((n) => String(Number(n[0])) === n[0] && Number(n[0]) <= NUMERO_MAXIMO_FRASE_INTEIRA)) return false;
  return numeros.length === 1 || numeros.every((n) => FEMININAS_DEPOIS_DE_NUMERO.test(texto.slice(n.index + n[0].length)));
}

const UNIDADES: Record<Idioma, string[]> = {
  'pt-PT': [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze',
    'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove',
  ],
  'pt-BR': [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze',
    'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove',
  ],
};

const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

/**
 * O número por extenso na variante (0 a 100): 16 é "dezasseis" em pt-PT e "dezesseis" em pt-BR. `feminino` muda só o
 * um e o dois: "uma moeda", "duas moedas", "vinte e uma moedas".
 */
export function numeroPorExtenso(n: number, idioma: Idioma, feminino = false): string {
  if (!Number.isInteger(n) || n < 0 || n > NUMERO_MAXIMO_NARRADO) throw new Error(`número fora de 0 a ${NUMERO_MAXIMO_NARRADO}: ${n}`);
  const unidade = (u: number) => (feminino && u === 1 ? 'uma' : feminino && u === 2 ? 'duas' : UNIDADES[idioma][u]);
  if (n < 20) return unidade(n);
  if (n === 100) return 'cem';
  const dezena = DEZENAS[Math.floor(n / 10)];
  return n % 10 === 0 ? dezena : `${dezena} e ${unidade(n % 10)}`;
}

/** Palavras femininas que podem vir logo depois de um número no texto (o número é dito no feminino). */
export const FEMININAS_DEPOIS_DE_NUMERO = /^\s+(moedas?)\b/u;
