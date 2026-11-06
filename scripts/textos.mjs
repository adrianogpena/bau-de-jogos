/** Textos das histórias, usados pelo script de narração. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VARIANTES = ['pt-PT', 'pt-BR'];

/** Carrega as histórias do projeto (TypeScript) usando o próprio Vite. */
export async function carregarHistorias() {
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
    return COLECOES.flatMap((c) => c.historias).map((h) => ({
      id: h.id,
      titulo: h.titulo,
      paragrafos: h.paragrafos.map((p) => ({
        'pt-PT': paragrafoCompleto(p, 'pt-PT'),
        'pt-BR': paragrafoCompleto(p, 'pt-BR'),
      })),
    }));
  } finally {
    await servidor.close();
  }
}

/** Falas de uma história numa variante: o título (arquivo "titulo") e cada parágrafo ("p01", "p02"...). */
export function falasDaHistoria(historia, variante) {
  const limpar = (t) => t.replace(/\[\[[^\]]*\]\]/g, '').replace(/\s+/g, ' ').trim();
  return [
    { nome: 'titulo', texto: limpar(historia.titulo[variante]) },
    ...historia.paragrafos.map((p, i) => ({ nome: `p${String(i + 1).padStart(2, '0')}`, texto: limpar(p[variante]) })),
  ].filter((f) => f.texto);
}
