/**
 * Confere as imagens de objetos dos jogos (public/imagens/itens/): ver scripts/imagens.mjs.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';
import { PASTA_ITENS, arquivosDaPasta, hashImagem, imagensUsadas, porConferir } from './imagens.mjs';

describe('imagens dos jogos', () => {
  test('toda imagem usada existe', () => {
    const faltam = [...imagensUsadas()]
      .filter(([a]) => !existsSync(path.join(PASTA_ITENS, `${a}.png`)))
      .map(([a, u]) => `  ${a}.png (${[...u.usos].join(', ')})`);
    assert.deepEqual(faltam, [], `\nImagens que não existem em public/imagens/itens/:\n${faltam.join('\n')}\n`);
  });

  test('nenhuma imagem é cópia de outra', () => {
    const porHash = new Map();
    for (const a of arquivosDaPasta()) {
      const h = hashImagem(a);
      porHash.set(h, [...(porHash.get(h) ?? []), a]);
    }
    const copias = [...porHash.values()].filter((l) => l.length > 1).map((l) => `  ${l.join(' = ')}`);
    assert.deepEqual(copias, [], `\nArquivos com a mesma imagem (uma delas está no lugar errado?):\n${copias.join('\n')}\n`);
  });

  test('toda imagem foi conferida e não mudou desde então', () => {
    const pendentes = porConferir();
    assert.deepEqual(
      pendentes,
      [],
      `\nImagens novas, alteradas ou trocadas desde a última conferência:\n  ${pendentes.join(', ')}\n` +
        'Rode "npm run imagens:folha", confira se cada imagem mostra a palavra indicada e, se estiverem certas, ' +
        '"npm run imagens:conferir".\n',
    );
  });
});
