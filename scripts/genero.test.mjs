/**
 * Confere a concordância de gênero nos textos do RPG: o herói e o mago não têm nome digitado,
 * são "o herói / a heroína" e "o mago / a maga", e todo texto da história tem de funcionar nos dois gêneros.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { createServer } from 'vite';
import { raiz } from './textos.mjs';

let servidor;
let preencher;
let valoresPersonagem;
let textos = [];

before(async () => {
  servidor = await createServer({
    root: raiz,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  ({ preencher } = await servidor.ssrLoadModule('/src/compartilhado/idioma.ts'));
  ({ valoresPersonagem } = await servidor.ssrLoadModule('/src/jogos/rpg/personagem.ts'));
  const { CENAS } = await servidor.ssrLoadModule('/src/jogos/rpg/historia.ts');
  const { CENAS_MAGO } = await servidor.ssrLoadModule('/src/jogos/rpg/mago/historia.ts');
  const coletar = (tipo, cenas) => {
    for (const cena of Object.values(cenas)) {
      for (const campo of [cena.texto, cena.pergunta, ...(cena.escolhas ?? []).map((e) => e.texto)]) {
        if (campo) textos.push({ tipo, id: cena.id, campo });
      }
    }
  };
  coletar('heroi', CENAS);
  coletar('mago', CENAS_MAGO);
});

after(() => servidor?.close());

describe('gênero do herói e do mago', () => {
  test('os valores do personagem concordam em cada gênero', () => {
    assert.deepEqual(valoresPersonagem('heroi', 'm'), { genero: 'm', nome: 'o herói', doNome: 'do herói', aoNome: 'ao herói' });
    assert.deepEqual(valoresPersonagem('heroi', 'f'), { genero: 'f', nome: 'a heroína', doNome: 'da heroína', aoNome: 'à heroína' });
    assert.equal(valoresPersonagem('mago', 'f').nome, 'a maga');
  });

  test('preencher escolhe o gênero e põe maiúscula no início da frase', () => {
    const f = valoresPersonagem('mago', 'f');
    const m = valoresPersonagem('mago', 'm');
    assert.equal(preencher('{Nome} está {pronto|pronta}.', f), 'A maga está pronta.');
    assert.equal(preencher('{Nome} está {pronto|pronta}.', m), 'O mago está pronto.');
    assert.equal(preencher('Perto {doNome}.', f), 'Perto da maga.');
    assert.equal(preencher('{o|a} {mago|maga}', { genero: 'f' }), 'a maga');
    assert.equal(preencher('{o|a} {mago|maga}', {}), 'o mago');
  });

  test('há textos do RPG para conferir', () => {
    assert.ok(textos.length > 50);
  });

  for (const genero of ['m', 'f']) {
    for (const variante of ['pt-PT', 'pt-BR']) {
      test(`nenhum texto do RPG sobra com chave solta (${genero}, ${variante})`, () => {
        const problemas = [];
        for (const { tipo, id, campo } of textos) {
          const bruto = campo[variante];
          const pronto = preencher(bruto, { ...valoresPersonagem(tipo, genero), escola: 'Fogo' });
          if (/[{}|]/.test(pronto) || /\s{2,}/.test(pronto.replace(/\n/g, ' ')) || /\bde (o|a) (herói|heroína|mago|maga)\b/.test(pronto)) {
            problemas.push(`${tipo}/${id}: ${pronto.slice(0, 80)}`);
          }
          // o nome digitado saiu: ninguém deve usar {nome} sem ser o personagem
          assert.ok(!/undefined/.test(pronto), `${tipo}/${id} tem "undefined"`);
        }
        assert.deepEqual(problemas, []);
      });
    }
  }

  test('cada frase tem a concordância certa no feminino', () => {
    for (const { tipo, id, campo } of textos) {
      for (const variante of ['pt-PT', 'pt-BR']) {
        const pronto = preencher(campo[variante], { ...valoresPersonagem(tipo, 'f'), escola: 'Fogo' });
        assert.ok(!/\b(o|ao|do) (herói|mago)\b/i.test(pronto.replace(/Mestre dos Magos/g, '')), `${tipo}/${id} (${variante}) ficou no masculino: ${pronto.slice(0, 90)}`);
      }
    }
  });
});
