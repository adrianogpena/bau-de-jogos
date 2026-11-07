/**
 * Frases que o narrador diz com áudio gravado (as histórias dos jogos de escrita e leitura),
 * e onde fica o arquivo de cada uma. Usado por `npm run audio:piper` (gera) e por `npm test` (confere).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { raiz } from './textos.mjs';

export async function lerVozes() {
  const config = JSON.parse(await readFile(path.join(raiz, 'src', 'compartilhado', 'vozes-narrador.json'), 'utf8'));
  return config.vozes;
}

/** Pasta dos áudios de uma voz: public/audio/<variante>/<voz>/t */
export function pastaAudio(voz) {
  return path.join(raiz, 'public', 'audio', voz.variante, voz.id, 't');
}

export function arquivoAudio(voz, hash) {
  return path.join(pastaAudio(voz), `${hash}.mp3`);
}

/** Frases de cada variante, como o narrador as diz: parágrafos, história inteira e título. Mapa hash → texto. */
export async function frasesDasHistorias() {
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
