#!/usr/bin/env node
/**
 * Lista as palavras distintas de todas as frases narradas do site, por variante.
 * Saída: referencias-fonemas/palavras-<variante>.json (lista ordenada). Guia: docs/VALIDACAO-FONEMAS.md
 *
 *   node scripts/fonemas/extrair-palavras.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { frasesDoSite } from '../frases-narradas.mjs';
import { raiz } from '../textos.mjs';

const { frases } = await frasesDoSite();
const pasta = path.join(raiz, 'referencias-fonemas');
await mkdir(pasta, { recursive: true });

for (const variante of ['pt-PT', 'pt-BR']) {
  const palavras = new Set();
  for (const texto of frases[variante].values()) {
    for (const p of texto.toLowerCase().match(/[\p{L}]+(?:-[\p{L}]+)*/gu) ?? []) palavras.add(p);
  }
  const lista = [...palavras].sort((a, b) => a.localeCompare(b, 'pt'));
  await writeFile(path.join(pasta, `palavras-${variante}.json`), JSON.stringify(lista, null, 0));
  console.log(`${variante}: ${lista.length} palavras distintas`);
}
process.exit(0);
