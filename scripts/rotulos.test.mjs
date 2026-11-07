/**
 * Confere que nenhum texto de interface está escrito direto no JSX: todo texto passa por um par 'pt-PT'/'pt-BR'
 * (e por isso tem tradução e áudio, conferidos em audio.test.mjs).
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { textosSoltosNoJsx } from './rotulos.mjs';

test('nenhum texto de interface fora do sistema de idioma', async () => {
  const soltos = await textosSoltosNoJsx();
  const lista = soltos.map((s) => `  ${s.arquivo}:${s.linha} (${s.tipo}) "${s.texto.slice(0, 60)}"`);
  assert.equal(
    soltos.length,
    0,
    `\nTexto escrito direto no JSX. Mova para um par { 'pt-PT': ..., 'pt-BR': ... } e use t(texto, idioma):\n${lista.join('\n')}\n`,
  );
});
