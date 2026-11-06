#!/usr/bin/env node
/**
 * Gera com o Piper o áudio de todas as frases das histórias (jogos de escrita e leitura), para as vozes
 * de src/compartilhado/vozes-narrador.json. Os arquivos ficam em public/audio/<variante>/<voz>/t/<hash>.mp3,
 * o mesmo lugar onde o app os procura. Guia: docs/NARRACAO-PIPER.md
 *
 *   npm run audio:piper -- --simular     # só conta frases e caracteres
 *   npm run audio:piper                  # gera o que falta (não refaz o que já existe)
 *   npm run audio:piper -- --voz cadu
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import { raiz } from './textos.mjs';

const args = { simular: false, voz: null };
const lista = process.argv.slice(2);
for (let i = 0; i < lista.length; i++) {
  if (lista[i] === '--simular') args.simular = true;
  else if (lista[i] === '--voz') args.voz = lista[++i];
  else throw new Error(`Argumento desconhecido: ${lista[i]}`);
}

/** Frases de cada variante, como o narrador as diz: parágrafos, história inteira e título. */
async function frasesDasHistorias() {
  const servidor = await createServer({
    root: raiz,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { COLECOES, paragrafoCompleto } = await servidor.ssrLoadModule('/src/compartilhado/historias/index.ts');
    const { frasesFaladas, semSimbolos } = await servidor.ssrLoadModule('/src/compartilhado/TextoNarrado.tsx');
    const { hashTexto } = await servidor.ssrLoadModule('/src/compartilhado/hashTexto.ts');
    const porVariante = { 'pt-PT': new Map(), 'pt-BR': new Map() };
    for (const variante of Object.keys(porVariante)) {
      const mapa = porVariante[variante];
      const juntar = (texto) => {
        if (/\p{L}/u.test(texto)) mapa.set(hashTexto(texto), texto);
      };
      for (const historia of COLECOES.flatMap((c) => c.historias)) {
        for (const p of historia.paragrafos) frasesFaladas(paragrafoCompleto(p, variante)).forEach(juntar);
        frasesFaladas(historia.titulo[variante]).forEach(juntar);
        // o título tocado na tela de escolha: sem ícones, como o narrador o lê
        juntar(semSimbolos(historia.titulo[variante]).trim());
      }
    }
    return porVariante;
  } finally {
    await servidor.close();
  }
}

function rodar(comando, argumentos) {
  return new Promise((resolve, reject) => {
    const filho = spawn(comando, argumentos, { stdio: ['ignore', 'inherit', 'inherit'] });
    filho.on('error', reject);
    filho.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(`${comando} terminou com erro ${codigo}`))));
  });
}

async function principal() {
  const config = JSON.parse(await readFile(path.join(raiz, 'src', 'compartilhado', 'vozes-narrador.json'), 'utf8'));
  const python = process.env.PIPER_PYTHON || 'python3';
  const pastaModelos = path.resolve(raiz, process.env.PIPER_MODELOS || 'modelos-piper');
  const frases = await frasesDasHistorias();

  for (const voz of config.vozes.filter((v) => !args.voz || v.id === args.voz)) {
    const todas = [...frases[voz.variante]];
    const faltam = todas
      .map(([hash, texto]) => ({ texto, saida: path.join(raiz, 'public', 'audio', voz.variante, voz.id, 't', `${hash}.mp3`) }))
      .filter((f) => !existsSync(f.saida));
    const caracteres = faltam.reduce((s, f) => s + f.texto.length, 0);
    console.log(`${voz.variante}/${voz.id}: ${todas.length} frases, ${faltam.length} a gerar (${caracteres} caracteres)`);
    if (args.simular || faltam.length === 0) continue;

    const modelo = path.join(pastaModelos, voz.modelo);
    if (!existsSync(modelo)) throw new Error(`Modelo não encontrado: ${modelo} (veja docs/NARRACAO-PIPER.md)`);
    const temporario = path.join(os.tmpdir(), `piper-lote-${process.pid}-${voz.id}.json`);
    await writeFile(temporario, JSON.stringify(faltam));
    try {
      await rodar(python, [path.join(raiz, 'scripts', 'piper_falar.py'), modelo, '--lote', temporario]);
    } finally {
      await rm(temporario, { force: true });
    }
  }
  console.log('\nPronto.');
}

principal().catch((erro) => {
  console.error(`\nErro: ${erro.message}`);
  process.exit(1);
});
