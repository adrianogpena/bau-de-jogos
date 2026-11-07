#!/usr/bin/env node
/**
 * Gera com o Piper o áudio de todas as frases fixas do site (histórias dos jogos de escrita e leitura e textos do RPG, escape etc.), para as vozes
 * de src/compartilhado/vozes-narrador.json. Os arquivos ficam em public/audio/<variante>/<voz>/t/<hash>.mp3,
 * o mesmo lugar onde o app os procura. Guia: docs/NARRACAO-PIPER.md
 *
 *   npm run audio:piper -- --simular     # só conta frases e caracteres
 *   npm run audio:piper                  # gera o que falta (não refaz o que já existe)
 *   npm run audio:piper -- --voz faber
 *   npm run audio:piper -- --podar       # apaga os áudios de textos que não existem mais
 *   npm run audio:piper -- --refazer     # gera de novo todos, mesmo os que já existem
 *   npm run audio:piper -- --refazer-textos zero,cem   # gera de novo só esses textos (separados por vírgula)
 *   npm run audio:piper -- --voz faber --refazer-palavras meta,topo   # gera de novo todo texto que contém essas palavras
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { arquivoAudio, frasesDoSite, lerVozes, pastaAudio } from './frases-narradas.mjs';
import { raiz } from './textos.mjs';

const args = { simular: false, podar: false, refazer: false, refazerTextos: null, refazerPalavras: null, voz: null };
const lista = process.argv.slice(2);
for (let i = 0; i < lista.length; i++) {
  if (lista[i] === '--simular') args.simular = true;
  else if (lista[i] === '--podar') args.podar = true;
  else if (lista[i] === '--refazer') args.refazer = true;
  else if (lista[i] === '--refazer-textos') args.refazerTextos = new Set(lista[++i].split(','));
  else if (lista[i] === '--refazer-palavras') args.refazerPalavras = lista[++i].split(',').map((p) => p.toLowerCase());
  else if (lista[i] === '--voz') args.voz = lista[++i];
  else throw new Error(`Argumento desconhecido: ${lista[i]}`);
}

function rodar(comando, argumentos) {
  return new Promise((resolve, reject) => {
    const filho = spawn(comando, argumentos, { stdio: ['ignore', 'inherit', 'inherit'] });
    filho.on('error', reject);
    filho.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(`${comando} terminou com erro ${codigo}`))));
  });
}

async function principal() {
  const vozes = await lerVozes();
  const python = process.env.PIPER_PYTHON || 'python3';
  const pastaModelos = path.resolve(raiz, process.env.PIPER_MODELOS || 'modelos-piper');
  const { frases, dinamicos } = await frasesDoSite();
  if (dinamicos.length > 0) console.log(`(${dinamicos.length} textos com partes calculadas, como números e nomes de inimigos, ficam de fora)`);

  for (const voz of vozes.filter((v) => !args.voz || v.id === args.voz)) {
    const todas = [...frases[voz.variante]];
    const faltam = todas
      .map(([hash, texto]) => ({ texto, saida: arquivoAudio(voz, hash) }))
      .filter(
        (f) =>
          args.refazer ||
          args.refazerTextos?.has(f.texto) ||
          args.refazerPalavras?.some((p) => new RegExp(`(?<![\\p{L}])${p}(?![\\p{L}])`, 'iu').test(f.texto)) ||
          !existsSync(f.saida),
      );
    const caracteres = faltam.reduce((s, f) => s + f.texto.length, 0);
    console.log(`${voz.variante}/${voz.id}: ${todas.length} frases, ${faltam.length} a gerar (${caracteres} caracteres)`);
    if (args.podar) {
      const sobras = existsSync(pastaAudio(voz))
        ? readdirSync(pastaAudio(voz)).filter((f) => f.endsWith('.mp3') && !frases[voz.variante].has(f.slice(0, -4)))
        : [];
      console.log(`  ${sobras.length} áudio(s) de textos antigos${args.simular ? '' : ' apagados'}`);
      if (!args.simular) for (const f of sobras) await rm(path.join(pastaAudio(voz), f));
    }
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
