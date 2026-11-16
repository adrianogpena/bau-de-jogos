import type { Idioma } from './idioma';
import { FEMININAS_DEPOIS_DE_NUMERO, NUMERO_MAXIMO_FRASE_INTEIRA, NUMERO_MAXIMO_NARRADO, numeroPorExtenso } from './numeros';

/**
 * Sinais de matemática lidos como palavras, só quando ligados a números: "3 + 4 = 7" vira "3 mais 4 igual a 7" e
 * "+2 de dano" vira "mais 2 de dano" (igual nas duas variantes). Hífen só vale como "menos" entre números, com espaços.
 */
function simbolosPorPalavras(texto: string): string {
  return texto
    .replace(/(?<=\d)\s*\+\s*(?=\d)|(?<![\p{L}\d])\+(?=\d)/gu, ' mais ')
    .replace(/(?<=\d)\s*=\s*(?=\d)/g, ' igual a ')
    .replace(/(?<=\d)\s*×\s*(?=\d)/g, ' vezes ')
    .replace(/(?<=\d)\s*÷\s*(?=\d)/g, ' dividido por ')
    .replace(/(?<=\d)(?:\s*−\s*|\s+-\s+)(?=\d)/g, ' menos ');
}

/**
 * Divide uma frase nos pedaços que o narrador toca em sequência, cada um com o seu arquivo de áudio.
 * Todo número de 0 a 100 vira um pedaço próprio (por extenso, ex.: "quinze"), e o resto do texto fica nos pedaços
 * entre eles. Assim "Tiraste 15 contra a defesa 12!" usa os áudios "Tiraste", "quinze", "contra a defesa", "doze".
 * Exceção: frase com um único número até NUMERO_MAXIMO_FRASE_INTEIRA (20) é um pedaço só, com o número por extenso
 * dentro ("Tiraste quinze"), para sair numa voz e entonação contínuas.
 * Sem número, o texto inteiro (um parágrafo, ver separarFrases em TextoNarrado.tsx) é um pedaço só. Sinais como "+" e "=" são lidos como palavras (simbolosPorPalavras). Os espaços são normalizados e pedaços sem letras somem.
 *
 * Usado pelo app (narradorAudio.ts) e pelo gerador/teste de áudios (scripts/frases-narradas.mjs): é a única
 * definição de "qual texto tem qual áudio".
 */
export function pecasDaFala(texto: string, idioma: Idioma): string[] {
  if (/\p{L}/u.test(texto)) texto = simbolosPorPalavras(texto);
  // um único número pequeno: a frase inteira num áudio só, com o número por extenso no texto
  const numeros = texto.match(/\d+/g) ?? [];
  if (numeros.length === 1 && String(Number(numeros[0])) === numeros[0] && Number(numeros[0]) <= NUMERO_MAXIMO_FRASE_INTEIRA) {
    const inteira = texto
      .replace(/\d+(.*)$/su, (_, resto: string) => `${numeroPorExtenso(Number(numeros[0]), idioma, FEMININAS_DEPOIS_DE_NUMERO.test(resto))}${resto}`)
      .replace(/\s+/g, ' ')
      .trim();
    return /\p{L}/u.test(inteira) ? [inteira] : [];
  }
  const pecas: string[] = [];
  let corrente = '';
  // antes de um número, "Vida:" usa o áudio de "Vida"
  const fechar = (antesDeNumero = false) => {
    // "12. Você conseguiu!" deixa ". Você conseguiu!" depois do número: o pedaço começa na palavra
    let limpo = corrente.replace(/\s+/g, ' ').trim().replace(/^[.,;:!?…]+\s*/u, '');
    if (antesDeNumero) limpo = limpo.replace(/\s*:$/, '');
    if (/\p{L}/u.test(limpo)) pecas.push(limpo);
    corrente = '';
  };
  const partes = texto.split(/(\d+)/);
  for (const [i, parte] of partes.entries()) {
    const numero = /^\d+$/.test(parte) && String(Number(parte)) === parte ? Number(parte) : null;
    if (numero !== null && numero <= NUMERO_MAXIMO_NARRADO) {
      fechar(true);
      // "1 moeda" é "uma moeda"
      pecas.push(numeroPorExtenso(numero, idioma, FEMININAS_DEPOIS_DE_NUMERO.test(partes[i + 1] ?? '')));
    } else {
      corrente += parte;
    }
  }
  fechar();
  return pecas;
}
