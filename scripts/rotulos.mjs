/**
 * Acha texto de interface escrito direto no JSX (fora de um par 'pt-PT'/'pt-BR'), que não teria áudio nem tradução:
 * texto solto (<button>Voltar</button>), aria-label/title/alt/placeholder fixos e textos entre chaves ({'Voltar'}).
 * Usado por `npm test` (scripts/rotulos.test.mjs).
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { raiz } from './textos.mjs';

const ATRIBUTOS = new Set(['aria-label', 'title', 'alt', 'placeholder']);
const TEM_LETRA = /\p{L}/u;
/** Siglas de jogo que não são palavras: ficam de fora ("CA" de classe de armadura, "d" de d20). */
const SIGLAS = new Set(['CA', 'd']);

async function arquivosTsx(pasta) {
  const achados = [];
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) achados.push(...(await arquivosTsx(caminho)));
    else if (entrada.name.endsWith('.tsx')) achados.push(caminho);
  }
  return achados;
}

/** Lista { arquivo, linha, tipo, texto } de cada texto de interface fora do sistema de idioma. */
export async function textosSoltosNoJsx() {
  const achados = [];
  for (const arquivo of await arquivosTsx(path.join(raiz, 'src'))) {
    const relativo = path.relative(raiz, arquivo).split(path.sep).join('/');
    const fonte = ts.createSourceFile(arquivo, await readFile(arquivo, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const registrar = (no, tipo, texto) =>
      !SIGLAS.has(texto.trim()) &&
      achados.push({ arquivo: relativo, linha: fonte.getLineAndCharacterOfPosition(no.getStart()).line + 1, tipo, texto: texto.trim() });
    const visitar = (no) => {
      if (ts.isJsxText(no) && TEM_LETRA.test(no.text)) registrar(no, 'texto', no.text);
      else if (ts.isJsxAttribute(no) && ATRIBUTOS.has(no.name.text) && no.initializer && ts.isStringLiteral(no.initializer) && TEM_LETRA.test(no.initializer.text)) {
        registrar(no, no.name.text, no.initializer.text);
      } else if (ts.isJsxExpression(no) && no.expression && ts.isStringLiteralLike(no.expression) && TEM_LETRA.test(no.expression.text) && !ts.isJsxAttribute(no.parent)) {
        registrar(no, 'texto', no.expression.text);
      }
      else if (ts.isJsxExpression(no) && no.expression && ts.isTemplateExpression(no.expression) && !ts.isJsxAttribute(no.parent)) {
        const partes = [no.expression.head.text, ...no.expression.templateSpans.map((sp) => sp.literal.text)].join(' ');
        if (TEM_LETRA.test(partes)) registrar(no, 'texto', partes);
      }
      ts.forEachChild(no, visitar);
    };
    visitar(fonte);
  }
  return achados;
}
