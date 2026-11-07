/**
 * Confere que toda frase das histórias tem o áudio gerado com a voz de cada variante.
 *
 * Se um texto foi alterado ou acrescentado, o nome do arquivo (hash do texto) muda e o áudio novo não existe:
 * o teste falha e diz o que fazer (`npm run audio:piper`). Áudios que sobraram de textos antigos são avisados.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { before, describe, test } from 'node:test';
import { arquivoAudio, frasesDasHistorias, lerVozes, pastaAudio } from './frases-narradas.mjs';

let vozes;
let frases;

before(async () => {
  vozes = await lerVozes();
  frases = await frasesDasHistorias();
});

describe('áudio do narrador', () => {
  test('há uma voz para cada variante', () => {
    for (const variante of ['pt-PT', 'pt-BR']) {
      assert.ok(vozes.some((v) => v.variante === variante), `nenhuma voz para ${variante} em vozes-narrador.json`);
    }
  });

  test('toda frase de cada variante tem o áudio gerado', () => {
    const problemas = [];
    for (const voz of vozes) {
      const todas = [...frases[voz.variante]];
      assert.ok(todas.length > 0, `nenhuma frase encontrada para ${voz.variante}`);
      const faltam = todas.filter(([hash]) => !existsSync(arquivoAudio(voz, hash)));
      if (faltam.length > 0) {
        const exemplos = faltam.slice(0, 5).map(([, texto]) => `    - "${texto.slice(0, 70)}"`);
        problemas.push(
          `${voz.variante}/${voz.id}: faltam ${faltam.length} de ${todas.length} áudios\n${exemplos.join('\n')}${faltam.length > 5 ? '\n    ...' : ''}`,
        );
      }
    }
    assert.equal(
      problemas.length,
      0,
      `\nTexto novo ou alterado sem áudio. Rode "npm run audio:piper", confira os arquivos novos em public/audio/ e inclua-os no commit.\n${problemas.join('\n')}\n`,
    );
  });

  test('nenhum áudio está vazio', () => {
    const vazios = [];
    for (const voz of vozes) {
      for (const [hash] of frases[voz.variante]) {
        const arquivo = arquivoAudio(voz, hash);
        if (existsSync(arquivo) && statSync(arquivo).size < 500) vazios.push(arquivo);
      }
    }
    assert.deepEqual(vazios, [], 'áudios vazios ou corrompidos: apague-os e rode "npm run audio:piper"');
  });

  test('áudios de textos que não existem mais (aviso)', (t) => {
    for (const voz of vozes) {
      const pasta = pastaAudio(voz);
      if (!existsSync(pasta)) continue;
      const sobras = readdirSync(pasta).filter((f) => f.endsWith('.mp3') && !frases[voz.variante].has(f.slice(0, -4)));
      if (sobras.length > 0) {
        t.diagnostic(`${voz.variante}/${voz.id}: ${sobras.length} áudio(s) de textos antigos; apague com "npm run audio:piper -- --podar"`);
      }
    }
  });
});
