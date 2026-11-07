/**
 * Frases que o narrador diz com áudio gravado (as histórias dos jogos de escrita e leitura),
 * e onde fica o arquivo de cada uma. Usado por `npm run audio:piper` (gera) e por `npm test` (confere).
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
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
    const { pecasDaFala } = await servidor.ssrLoadModule('/src/compartilhado/pecasDaFala.ts');
    const porVariante = { 'pt-PT': new Map(), 'pt-BR': new Map() };
    for (const variante of Object.keys(porVariante)) {
      const mapa = porVariante[variante];
      const juntar = (texto) => {
        for (const peca of pecasDaFala(texto, variante)) mapa.set(hashTexto(peca), peca);
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

// ---------- textos fixos do site (fora das histórias) ----------

const VARIANTES = ['pt-PT', 'pt-BR'];
/** Valores que `preencher()` recebe do personagem: o resto das chaves `{x}` é dinâmico (números, nomes de inimigos...). */
const CHAVES_GENERO = new Set(['genero', 'nome', 'doNome', 'aoNome']);

async function arquivosFonte(pasta) {
  const achados = [];
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) achados.push(...(await arquivosFonte(caminho)));
    else if (/\.tsx?$/.test(entrada.name) && !/\.d\.ts$/.test(entrada.name)) achados.push(caminho);
  }
  return achados;
}

/** Valor de texto fixo de uma expressão (aspas, crase sem ${}, ou soma de textos fixos); null se for calculado. */
function textoFixo(no) {
  if (ts.isStringLiteralLike(no)) return no.text;
  if (ts.isParenthesizedExpression(no)) return textoFixo(no.expression);
  if (ts.isBinaryExpression(no) && no.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const a = textoFixo(no.left);
    const b = textoFixo(no.right);
    return a === null || b === null ? null : a + b;
  }
  return null;
}

function nomeDaPropriedade(prop) {
  if (!ts.isPropertyAssignment(prop)) return null;
  return ts.isIdentifier(prop.name) || ts.isStringLiteralLike(prop.name) ? prop.name.text : null;
}

/** Todo objeto `{ 'pt-PT': '...', 'pt-BR': '...' }` de um arquivo: o texto de cada variante, ou null se for calculado. */
function paresDeTextos(arquivo, codigo) {
  const fonte = ts.createSourceFile(arquivo, codigo, ts.ScriptTarget.Latest, true, arquivo.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const pares = [];
  const visitar = (no) => {
    if (ts.isObjectLiteralExpression(no)) {
      const porNome = new Map(no.properties.map((p) => [nomeDaPropriedade(p), p]));
      if (VARIANTES.every((v) => porNome.has(v))) {
        const textos = {};
        for (const v of VARIANTES) textos[v] = textoFixo(porNome.get(v).initializer);
        if (VARIANTES.some((v) => typeof textos[v] === 'string')) {
          pares.push({ textos, linha: fonte.getLineAndCharacterOfPosition(no.getStart()).line + 1 });
        }
      }
    }
    ts.forEachChild(no, visitar);
  };
  visitar(fonte);
  return pares;
}

/** Chaves `{x}` que o jogo preenche com números (cada número de 0 a 100 tem áudio próprio); "conta" é "3 + 4". */
const NUMERICAS = {
  n: '0', total: '0', ca: '0', ataque: '0', dano: '0', cura: '0', valor: '0', dificuldade: '0', dado: '0', resposta: '0',
  conta: '0 + 0',
};

/** Valores possíveis das chaves `{x}` que o jogo preenche com um nome dos dados do jogo, por variante. */
async function nomesParaPreencher(servidor) {
  const rpg = await servidor.ssrLoadModule('/src/jogos/rpg/historia.ts');
  const itens = await servidor.ssrLoadModule('/src/jogos/rpg/itens.ts');
  const mago = await servidor.ssrLoadModule('/src/jogos/rpg/mago/feiticos.ts');
  const achar = await servidor.ssrLoadModule('/src/jogos/achar/cenas/index.ts');
  const resultado = {};
  for (const v of VARIANTES) {
    const unicos = (lista) => [...new Set(lista.map((x) => x[v]))];
    resultado[v] = {
      inimigo: unicos([...Object.values(rpg.INIMIGOS), ...Object.values(mago.INIMIGOS_MAGO)].map((i) => i.nome)),
      item: unicos(Object.values(itens.ITENS).map((i) => i.nome)),
      feitico: unicos(Object.values(mago.FEITICOS).map((f) => f.nome)),
      escola: unicos(mago.ESCOLAS.map((e) => e.curto)),
      habilidade: unicos(mago.HABILIDADES.map((h) => h.nome)),
      atributo: unicos(rpg.ATRIBUTOS.map((a) => a.nome)),
      palavra: unicos(achar.CENAS.flatMap((c) => c.itens.map((i) => i.palavra))),
    };
  }
  return resultado;
}

/** Chaves `{x}` que sobram depois de tirar as escolhas de gênero `{o|a}` e as chaves do personagem. */
function chavesDinamicas(texto) {
  return [...texto.replace(/\{[^{}|]*\|[^{}|]*\}/g, '').matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .filter((c) => !CHAVES_GENERO.has(c) && !CHAVES_GENERO.has(c[0].toLowerCase() + c.slice(1)));
}

/**
 * Frases de cada variante: as histórias e todos os textos fixos do site (os pares 'pt-PT'/'pt-BR' do código: RPG,
 * escape room, achar itens, menus, mensagens...), com o gênero do personagem expandido (herói/heroína, mago/maga).
 * Números (0 a 100) e nomes (inimigo, feitiço, item...) são expandidos em todos os valores possíveis; só textos com
 * outras partes calculadas ficam em `dinamicos`.
 * Devolve { frases: { variante → Map hash → texto }, dinamicos: [{ arquivo, linha, texto }] }.
 */
export async function frasesDoSite() {
  const frases = await frasesDasHistorias();
  const servidor = await createServer({
    root: raiz,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  const dinamicos = [];
  try {
    const { frasesFaladas } = await servidor.ssrLoadModule('/src/compartilhado/TextoNarrado.tsx');
    const { preencher } = await servidor.ssrLoadModule('/src/compartilhado/idioma.ts');
    const { valoresPersonagem } = await servidor.ssrLoadModule('/src/jogos/rpg/personagem.ts');
    const { hashTexto } = await servidor.ssrLoadModule('/src/compartilhado/hashTexto.ts');
    const { pecasDaFala } = await servidor.ssrLoadModule('/src/compartilhado/pecasDaFala.ts');
    const { numeroPorExtenso, NUMERO_MAXIMO_NARRADO } = await servidor.ssrLoadModule('/src/compartilhado/numeros.ts');
    const pastaHistorias = path.join(raiz, 'src', 'compartilhado', 'historias');
    const nomes = await nomesParaPreencher(servidor);

    const juntar = (variante, frase) => {
      for (const peca of pecasDaFala(frase, variante)) frases[variante].set(hashTexto(peca), peca);
    };

    // todo número de 0 a 100 tem áudio próprio
    for (const variante of VARIANTES) {
      for (let n = 0; n <= NUMERO_MAXIMO_NARRADO; n++) juntar(variante, numeroPorExtenso(n, variante));
    }

    for (const arquivo of await arquivosFonte(path.join(raiz, 'src'))) {
      if (arquivo.startsWith(pastaHistorias)) continue;
      const relativo = path.relative(raiz, arquivo).split(path.sep).join('/');
      const tipo = relativo.includes('/rpg/mago/') ? 'mago' : 'heroi';
      for (const { textos, linha } of paresDeTextos(arquivo, await readFile(arquivo, 'utf8'))) {
        for (const variante of VARIANTES) {
          const bruto = textos[variante];
          if (typeof bruto !== 'string') continue;
          const chaves = [...new Set(chavesDinamicas(bruto))];
          if (chaves.some((c) => !NUMERICAS[c] && !nomes[variante][c])) {
            dinamicos.push({ arquivo: relativo, linha, texto: bruto });
            continue;
          }
          // números viram "0" (cada número tem o seu áudio); nomes (inimigo, feitiço...) são todos os valores possíveis
          const combinacoes = chaves.reduce(
            (acc, c) => acc.flatMap((valores) => (NUMERICAS[c] ? [{ ...valores, [c]: NUMERICAS[c] }] : nomes[variante][c].map((v) => ({ ...valores, [c]: v })))),
            [{}],
          );
          for (const valores of combinacoes) {
            for (const genero of ['m', 'f']) {
              const texto = preencher(bruto, { ...valoresPersonagem(tipo, genero), ...valores });
              for (const frase of frasesFaladas(texto)) juntar(variante, frase);
            }
          }
        }
      }
    }
  } finally {
    await servidor.close();
  }
  return { frases, dinamicos };
}
