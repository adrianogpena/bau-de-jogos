/**
 * Confere os personagens do RPG (4 heróis e 4 magos, 2 masculinos e 2 femininos, cada um com nome)
 * e a concordância dos textos da história com o nome e o gênero de cada um.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import { createServer } from 'vite';
import { raiz } from './textos.mjs';

let servidor;
let preencher;
let valoresPersonagem;
let PERSONAGENS;
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
  ({ valoresPersonagem, PERSONAGENS } = await servidor.ssrLoadModule('/src/jogos/rpg/personagem.ts'));
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

describe('personagens do herói e do mago', () => {
  test('cada história tem 4 personagens: 2 masculinos e 2 femininos, com nomes diferentes e imagem', () => {
    const todos = Object.values(PERSONAGENS).flat();
    assert.equal(new Set(todos.map((p) => p.nome)).size, 8);
    for (const [tipo, lista] of Object.entries(PERSONAGENS)) {
      assert.equal(lista.length, 4);
      assert.equal(lista.filter((p) => p.genero === 'm').length, 2);
      assert.equal(lista.filter((p) => p.genero === 'f').length, 2);
      for (const p of lista) {
        const pasta = tipo === 'heroi' ? 'herois' : 'magos';
        assert.ok(existsSync(path.join(raiz, 'public', 'imagens', 'rpg', pasta, `${p.id}.png`)), `falta a imagem de ${p.id}`);
      }
    }
  });

  test('os valores do personagem usam o nome', () => {
    const clara = PERSONAGENS.heroi.find((p) => p.nome === 'Clara');
    assert.deepEqual(valoresPersonagem(clara), { genero: 'f', nome: 'Clara', doNome: 'de Clara', aoNome: 'a Clara' });
  });

  test('preencher usa o nome, escolhe o gênero e põe maiúscula no início da frase', () => {
    const luna = valoresPersonagem(PERSONAGENS.mago.find((p) => p.nome === 'Luna'));
    const teo = valoresPersonagem(PERSONAGENS.mago.find((p) => p.nome === 'Teo'));
    assert.equal(preencher('{Nome} está {pronto|pronta}.', luna), 'Luna está pronta.');
    assert.equal(preencher('{Nome} está {pronto|pronta}.', teo), 'Teo está pronto.');
    assert.equal(preencher('Perto {doNome}.', luna), 'Perto de Luna.');
    assert.equal(preencher('{o|a} {mago|maga}', { genero: 'f' }), 'a maga');
    assert.equal(preencher('{o|a} {mago|maga}', {}), 'o mago');
  });

  test('há textos do RPG para conferir', () => {
    assert.ok(textos.length > 50);
  });

  for (const variante of ['pt-PT', 'pt-BR']) {
    test(`nenhum texto do RPG sobra com chave solta nem fica no masculino fixo (${variante})`, () => {
      const problemas = [];
      for (const { tipo, id, campo } of textos) {
        for (const personagem of PERSONAGENS[tipo]) {
          const pronto = preencher(campo[variante], { ...valoresPersonagem(personagem), escola: 'Fogo' });
          if (/[{}|]/.test(pronto) || /\s{2,}/.test(pronto.replace(/\n/g, ' ')) || /undefined/.test(pronto)) {
            problemas.push(`${tipo}/${id}/${personagem.nome}: ${pronto.slice(0, 80)}`);
          }
          if (personagem.genero === 'f' && /\b(o|ao|do) (herói|mago)\b/i.test(pronto.replace(/Mestre dos Magos/g, ''))) {
            problemas.push(`${tipo}/${id}/${personagem.nome} ficou no masculino: ${pronto.slice(0, 90)}`);
          }
        }
      }
      assert.deepEqual(problemas, []);
    });
  }
});
