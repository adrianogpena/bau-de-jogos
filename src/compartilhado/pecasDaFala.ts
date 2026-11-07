import type { Idioma } from './idioma';
import { NUMERO_MAXIMO_NARRADO, numeroPorExtenso } from './numeros';

/**
 * Divide uma frase nos pedaços que o narrador toca em sequência, cada um com o seu arquivo de áudio.
 * Todo número de 0 a 100 vira um pedaço próprio (por extenso, ex.: "quinze"), e o resto do texto fica nos pedaços
 * entre eles. Assim "Tiraste 15 contra a defesa 12!" usa os áudios "Tiraste", "quinze", "contra a defesa", "doze".
 * Sem número, a frase inteira é um pedaço só. Os espaços são normalizados e pedaços sem letras (ex.: "+", "=") somem.
 *
 * Usado pelo app (narradorAudio.ts) e pelo gerador/teste de áudios (scripts/frases-narradas.mjs): é a única
 * definição de "qual texto tem qual áudio".
 */
export function pecasDaFala(texto: string, idioma: Idioma): string[] {
  const pecas: string[] = [];
  let corrente = '';
  const fechar = () => {
    const limpo = corrente.replace(/\s+/g, ' ').trim();
    if (/\p{L}/u.test(limpo)) pecas.push(limpo);
    corrente = '';
  };
  for (const parte of texto.split(/(\d+)/)) {
    const numero = /^\d+$/.test(parte) && String(Number(parte)) === parte ? Number(parte) : null;
    if (numero !== null && numero <= NUMERO_MAXIMO_NARRADO) {
      fechar();
      pecas.push(numeroPorExtenso(numero, idioma));
    } else {
      corrente += parte;
    }
  }
  fechar();
  return pecas;
}
