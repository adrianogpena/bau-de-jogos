#!/usr/bin/env node
/**
 * Para cada palavra dada, acha as frases narradas do site que a contêm (a mais curta primeiro).
 * Saída: JSON em referencias-fonemas/frases-<variante>.json. Guia: docs/VALIDACAO-FONEMAS.md
 *
 *   node scripts/fonemas/frases-das-palavras.mjs pt-BR velhinho,debaixo,jardim [máximo por palavra, padrão 2]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { frasesDoSite } from '../frases-narradas.mjs';
import { raiz } from '../textos.mjs';

const [variante, lista, maximo = '2'] = process.argv.slice(2);
const palavras = lista.split(',').map((p) => p.trim().toLowerCase());
const { frases } = await frasesDoSite();
const textos = [...frases[variante].values()];

const resultado = {};
for (const palavra of palavras) {
  const re = new RegExp(`(?<![\\p{L}])${palavra}(?![\\p{L}])`, 'iu');
  resultado[palavra] = textos
    .filter((t) => re.test(t))
    .sort((a, b) => a.length - b.length)
    .slice(0, Number(maximo));
}
const pasta = path.join(raiz, 'referencias-fonemas');
await mkdir(pasta, { recursive: true });
await writeFile(path.join(pasta, `frases-${variante}.json`), JSON.stringify(resultado, null, 1));
for (const [p, f] of Object.entries(resultado)) console.log(`${p}: ${f.length} frase(s)`);
process.exit(0);
