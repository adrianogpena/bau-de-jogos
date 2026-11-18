/**
 * Imagens de objetos dos jogos (public/imagens/itens/): as palavras de escrita e leitura, os itens do Achar itens e os
 * ícones `itens/...`. Um teste não sabe ver se o desenho é mesmo um leão; por isso cada imagem é conferida por uma pessoa
 * (ou IA) na folha de conferência e fica registrada em scripts/imagens-conferidas.json com a impressão digital (hash)
 * do arquivo. Imagem nova, alterada, renomeada ou trocada com outra muda o hash e o teste pede nova conferência.
 *
 *   npm run imagens:folha     folha (HTML) com as imagens por conferir, cada uma com a palavra que deve mostrar
 *                             (--todas: todas as imagens)
 *   npm run imagens:conferir  depois de olhar a folha: registra as imagens por conferir como certas
 *                             (ou só as indicadas: npm run imagens:conferir -- leao morango)
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { raiz } from './textos.mjs';

export const PASTA_ITENS = path.join(raiz, 'public', 'imagens', 'itens');
const REGISTRO = path.join(raiz, 'scripts', 'imagens-conferidas.json');

export function hashImagem(arquivo) {
  return createHash('sha256').update(readFileSync(path.join(PASTA_ITENS, `${arquivo}.png`))).digest('hex').slice(0, 16);
}

/** Imagens referidas pelos jogos: { arquivo: { palavras: Set, usos: Set } }. */
export function imagensUsadas() {
  const usadas = new Map();
  const usar = (arquivo, uso, ...palavras) => {
    if (!usadas.has(arquivo)) usadas.set(arquivo, { palavras: new Set(), usos: new Set() });
    const u = usadas.get(arquivo);
    u.usos.add(uso);
    palavras.filter(Boolean).forEach((p) => u.palavras.add(p));
  };
  const palavras = readFileSync(path.join(raiz, 'src', 'compartilhado', 'palavras.ts'), 'utf-8');
  for (const m of palavras.matchAll(/arquivo: '([^']+)', palavra: \{ 'pt-PT': '([^']+)', 'pt-BR': '([^']+)'/g)) {
    usar(m[1], 'escrita e leitura', m[2], m[3]);
  }
  const pastaCenas = path.join(raiz, 'src', 'jogos', 'achar', 'cenas');
  for (const nome of readdirSync(pastaCenas).filter((f) => f.endsWith('.ts'))) {
    const fonte = readFileSync(path.join(pastaCenas, nome), 'utf-8');
    for (const m of fonte.matchAll(/item\(\s*'([^']+)',\s*(?:'([^']+)'|\[\s*'([^']+)',\s*'([^']+)'\s*\])/g)) {
      usar(m[1], `achar: ${nome.replace(/\.ts$/, '')}`, m[2], m[3], m[4]);
    }
  }
  const icones = readFileSync(path.join(raiz, 'src', 'compartilhado', 'icones.tsx'), 'utf-8');
  for (const m of icones.matchAll(/'itens\/([a-z0-9-]+)'/g)) usar(m[1], 'ícone');
  return usadas;
}

export function lerRegistro() {
  return existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf-8')) : {};
}

/** Imagens da pasta cujo hash não bate com o registro (novas, alteradas ou trocadas). */
export function porConferir(registro = lerRegistro()) {
  return arquivosDaPasta().filter((a) => registro[a] !== hashImagem(a));
}

export function arquivosDaPasta() {
  return readdirSync(PASTA_ITENS)
    .filter((f) => f.endsWith('.png'))
    .map((f) => f.slice(0, -4))
    .sort();
}

function folha(todas) {
  const usadas = imagensUsadas();
  const lista = todas ? arquivosDaPasta() : porConferir();
  if (lista.length === 0) {
    console.log('Nenhuma imagem por conferir.');
    return;
  }
  const cartao = (a) => {
    const u = usadas.get(a);
    const palavras = u ? [...u.palavras].join(' / ') : '';
    const usos = u ? [...u.usos].join(', ') : 'não usada';
    return `<figure><img src="${pathToFileURL(path.join(PASTA_ITENS, `${a}.png`)).href}"><figcaption><b>${palavras || a}</b><br>${a}.png<br><small>${usos}</small></figcaption></figure>`;
  };
  const html = `<!doctype html><meta charset="utf-8"><title>Conferência de imagens</title>
<style>body{font-family:sans-serif;margin:16px;background:#f4f4f4}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
figure{margin:0;background:#fff;border-radius:8px;padding:8px;text-align:center}img{width:160px;height:160px;object-fit:contain;background:#ff00ff22}
figcaption{font-size:14px}small{color:#666}</style>
<h1>${lista.length} imagem(ns): a imagem mostra a palavra em negrito?</h1><main>${lista.map(cartao).join('')}</main>`;
  const saida = path.join(os.tmpdir(), 'bau-de-jogos-conferir-imagens.html');
  writeFileSync(saida, html);
  console.log(`Folha de conferência: ${saida}\nSe todas estiverem certas: npm run imagens:conferir`);
}

function conferir(nomes) {
  const registro = lerRegistro();
  const lista = nomes.length > 0 ? nomes : porConferir(registro);
  for (const a of lista) {
    if (!existsSync(path.join(PASTA_ITENS, `${a}.png`))) throw new Error(`imagem não encontrada: ${a}.png`);
    registro[a] = hashImagem(a);
  }
  for (const a of Object.keys(registro)) if (!existsSync(path.join(PASTA_ITENS, `${a}.png`))) delete registro[a];
  const ordenado = Object.fromEntries(Object.keys(registro).sort().map((a) => [a, registro[a]]));
  writeFileSync(REGISTRO, `${JSON.stringify(ordenado, null, 2)}\n`);
  console.log(`${lista.length} imagem(ns) registrada(s) como conferida(s).`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [comando, ...resto] = process.argv.slice(2);
  if (comando === 'folha') folha(resto.includes('--todas'));
  else if (comando === 'conferir') conferir(resto);
  else console.log('uso: node scripts/imagens.mjs folha [--todas] | conferir [nomes...]');
}
