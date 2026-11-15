#!/usr/bin/env node
/**
 * Gera o áudio de todas as frases fixas do site com as vozes neurais da Microsoft (Thalita em pt-BR, Raquel em pt-PT),
 * para as vozes de src/compartilhado/vozes-narrador.json que têm "servico". Os arquivos ficam em
 * public/audio/<variante>/<voz>/t/<hash>.mp3, o mesmo lugar onde o app os procura. Guia: docs/NARRACAO.md
 *
 *   npm run audio:narrador -- --simular     # só conta frases e caracteres
 *   npm run audio:narrador                  # gera o que falta (não refaz o que já existe; pode interromper e retomar)
 *   npm run audio:narrador -- --voz thalita
 *   npm run audio:narrador -- --podar       # apaga os áudios de textos que não existem mais
 *   npm run audio:narrador -- --refazer     # gera de novo todos, mesmo os que já existem
 *   npm run audio:narrador -- --refazer-textos zero,cem   # gera de novo só esses textos (separados por vírgula)
 *
 * Python com `edge-tts` e `imageio-ffmpeg` (fora do git): NARRADOR_PYTHON, ou o padrão abaixo (docs/NARRACAO.md).
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { arquivoAudio, frasesDoSite, lerVozes, pastaAudio } from './frases-narradas.mjs';
import { raiz } from './textos.mjs';

const args = { simular: false, podar: false, refazer: false, refazerTextos: null, voz: null, paralelo: '3' };
const lista = process.argv.slice(2);
for (let i = 0; i < lista.length; i++) {
  if (lista[i] === '--simular') args.simular = true;
  else if (lista[i] === '--podar') args.podar = true;
  else if (lista[i] === '--refazer') args.refazer = true;
  else if (lista[i] === '--refazer-textos') args.refazerTextos = new Set(lista[++i].split(','));
  else if (lista[i] === '--voz') args.voz = lista[++i];
  else if (lista[i] === '--paralelo') args.paralelo = lista[++i];
  else throw new Error(`Argumento desconhecido: ${lista[i]}`);
}

export function pythonDoNarrador() {
  if (process.env.NARRADOR_PYTHON) return process.env.NARRADOR_PYTHON;
  const local = process.env.LOCALAPPDATA;
  const venv = local && path.join(local, 'bau-edge-tts', 'Scripts', 'python.exe');
  return venv && existsSync(venv) ? venv : 'python3';
}

function rodar(comando, argumentos) {
  return new Promise((resolve, reject) => {
    const filho = spawn(comando, argumentos, { stdio: ['ignore', 'inherit', 'inherit'] });
    filho.on('error', reject);
    filho.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(`${comando} terminou com erro ${codigo} (veja as falhas acima; rode de novo para retomar)`))));
  });
}

/** Gera (o que falta de) uma lista de { texto, saida } com a voz; também usado por quem gera só uma amostra. */
export async function gerarLote(voz, falas, paralelo = '3') {
  const temporario = path.join(os.tmpdir(), `narrador-lote-${process.pid}-${voz.id}.json`);
  await writeFile(temporario, JSON.stringify(falas));
  try {
    await rodar(pythonDoNarrador(), [
      path.join(raiz, 'scripts', 'narrador_falar.py'),
      '--voz', voz.voz,
      '--lote', temporario,
      ...(voz.vozCurta ? ['--voz-curta', voz.vozCurta, '--palavras-curta', String(voz.palavrasCurta ?? 4)] : []),
      `--ritmo=${voz.ritmo ?? '+0%'}`,
      `--tom=${voz.tom ?? '+0Hz'}`,
      '--paralelo', String(paralelo),
    ]);
  } finally {
    await rm(temporario, { force: true });
  }
}

async function principal() {
  const vozes = (await lerVozes()).filter((v) => v.servico && (!args.voz || v.id === args.voz));
  const { frases, dinamicos } = await frasesDoSite();
  if (dinamicos.length > 0) console.log(`(${dinamicos.length} textos com partes calculadas, como números e nomes de inimigos, ficam de fora)`);

  for (const voz of vozes) {
    const todas = [...frases[voz.variante]];
    const faltam = todas
      .map(([hash, texto]) => ({ texto, saida: arquivoAudio(voz, hash) }))
      .filter((f) => args.refazer || args.refazerTextos?.has(f.texto) || !existsSync(f.saida));
    if (args.refazer || args.refazerTextos) {
      for (const f of faltam) await rm(f.saida, { force: true }); // o gerador só pula o que existe
    }
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
    await gerarLote(voz, faltam, args.paralelo);
  }
  console.log('\nPronto.');
}

if (import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
  principal().catch((erro) => {
    console.error(`\nErro: ${erro.message}`);
    process.exit(1);
  });
}
