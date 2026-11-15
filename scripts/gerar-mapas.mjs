#!/usr/bin/env node
/**
 * Gera as peças dos mapas do jogo "Mapa-múndi" a partir das fronteiras do Natural Earth (pacote world-atlas).
 * Cada mapa (mundo inteiro e continentes) vira um arquivo em src/jogos/mapa/dados/<mapa>.json com o desenho de cada
 * país já projetado (caminho SVG), o lugar dele no mapa e a cor (diferente da dos vizinhos).
 * Os nomes dos países e os continentes de cada um vêm de src/jogos/mapa/paises.ts.
 *
 *   npm run mapas:gerar
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { geoArea, geoAzimuthalEqualArea, geoCentroid, geoDistance, geoEqualEarth, geoPath } from 'd3-geo';
import { feature, merge, neighbors } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import { createServer } from 'vite';
import { raiz } from './textos.mjs';

const LARGURA = 1000;
const RAIO_TERRA_KM = 6371;
/** Quantas cores as peças usam (índices 0..N-1; as cores em si ficam no CSS do jogo). */
const CORES = 6;
/** Ilhas menores que isto (em unidades² do mapa de 1000 de largura) não são desenhadas. */
const AREA_MINIMA = 0.6;
/** Detalhe das fronteiras: quanto maior, mais simples o desenho (e menor o arquivo). */
const SIMPLIFICAR = 0.5;

/**
 * Mapas: caixa de longitude/latitude mostrada, centro da projeção e o menor tamanho de peça
 * (maior lado, em unidades do mapa): país menor que isso não vira peça, fica como terra de fundo.
 */
const MAPAS = [
  { id: 'mundo', graus: 360, minimo: 10 },
  { id: 'europa', caixa: [-25, 34, 45, 72], centro: [12, 53], minimo: 9 },
  { id: 'africa', caixa: [-26, -36, 52, 38], centro: [14, 2], minimo: 9 },
  { id: 'asia', caixa: [26, -11, 146, 76], centro: [88, 36], minimo: 9 },
  { id: 'america-norte', caixa: [-168, 6, -14, 83], centro: [-96, 48], minimo: 9 },
  { id: 'america-sul', caixa: [-83, -56, -33, 13], centro: [-59, -21], minimo: 9 },
  { id: 'oceania', caixa: [111, -48, 180, 1], centro: [146, -24], minimo: 9 },
];

const lerJson = async (arquivo) => JSON.parse(await readFile(path.join(raiz, 'node_modules', 'world-atlas', arquivo), 'utf8'));

async function carregarPaises() {
  const servidor = await createServer({
    root: raiz,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    return (await servidor.ssrLoadModule('/src/jogos/mapa/paises.ts')).PAISES;
  } finally {
    await servidor.close();
  }
}

const poligonosDe = (geometria) =>
  !geometria ? [] : geometria.type === 'Polygon' ? [geometria.coordinates] : geometria.type === 'MultiPolygon' ? geometria.coordinates : [];
const poligono = (coordinates) => ({ type: 'Polygon', coordinates });
const multi = (lista) => ({ type: 'MultiPolygon', coordinates: lista });

/**
 * Países dos dados, cada um com a lista de polígonos. Junta o Chipre do Norte ao Chipre e a Somalilândia à Somália,
 * separa a Guiana Francesa da França e manda para `soltos` (terra de fundo) os pedaços muito longe do país
 * (ilhas e territórios do outro lado do mundo), que deixariam a peça enorme.
 */
function prepararPaises(topologia) {
  const geometrias = topologia.objects.countries.geometries;
  const nomeDe = (g) => g.properties.name;
  const JUNTAR = { 'N. Cyprus': 'Cyprus', Somaliland: 'Somalia' };
  const paises = new Map();
  for (const g of geometrias) {
    const nome = nomeDe(g);
    if (nome === 'Antarctica' || JUNTAR[nome]) continue;
    const partes = geometrias.filter((o) => o === g || JUNTAR[nomeDe(o)] === nome);
    const geometria = partes.length > 1 ? merge(topologia, partes) : feature(topologia, g).geometry;
    // nome repetido nos dados (ex.: ilhas da Austrália): junta os polígonos
    paises.set(nome, [...(paises.get(nome) ?? []), ...poligonosDe(geometria)]);
  }

  // vizinhos (fronteira em comum), pelos nomes
  const vizinhos = new Map();
  const final = (g) => JUNTAR[nomeDe(g)] ?? nomeDe(g);
  neighbors(geometrias).forEach((lista, i) => {
    const a = final(geometrias[i]);
    for (const j of lista) {
      const b = final(geometrias[j]);
      if (a === b) continue;
      vizinhos.set(a, (vizinhos.get(a) ?? new Set()).add(b));
    }
  });

  // Guiana Francesa: os polígonos da França na América do Sul
  const franca = paises.get('France');
  const naGuiana = (p) => {
    const [lon, lat] = geoCentroid(poligono(p));
    return lon > -56 && lon < -50 && lat > 1 && lat < 7;
  };
  paises.set('Fr. Guiana', franca.filter(naGuiana));
  paises.set('France', franca.filter((p) => !naGuiana(p)));
  vizinhos.set('Fr. Guiana', new Set(['Brazil', 'Suriname']));
  for (const v of ['Brazil', 'Suriname']) {
    vizinhos.get(v).add('Fr. Guiana');
    vizinhos.get(v).delete('France');
    vizinhos.get('France').delete(v);
  }

  const soltos = [];
  for (const [nome, lista] of paises) {
    if (lista.length < 2) continue;
    const areas = lista.map((p) => geoArea(poligono(p)) * RAIO_TERRA_KM ** 2);
    const maior = areas.indexOf(Math.max(...areas));
    const centro = geoCentroid(poligono(lista[maior]));
    const limite = Math.max(2500, 4 * Math.sqrt(areas[maior]));
    const perto = lista.filter((p, i) => i === maior || geoDistance(centro, geoCentroid(poligono(p))) * RAIO_TERRA_KM <= limite);
    soltos.push(...lista.filter((p) => !perto.includes(p)));
    paises.set(nome, perto);
  }
  return { paises, vizinhos, soltos };
}

/** Cor de cada país: nunca a mesma de um vizinho; entre as livres, a menos usada (cores bem distribuídas). */
function colorir(nomes, vizinhos) {
  const cor = new Map();
  const usos = Array(CORES).fill(0);
  const grau = (n) => vizinhos.get(n)?.size ?? 0;
  for (const nome of [...nomes].sort((a, b) => grau(b) - grau(a) || a.localeCompare(b))) {
    const proibidas = new Set([...(vizinhos.get(nome) ?? [])].map((v) => cor.get(v)).filter((c) => c !== undefined));
    const livres = [...usos.keys()].filter((c) => !proibidas.has(c));
    if (livres.length === 0) throw new Error(`Sem cor livre para ${nome}: aumente CORES`);
    const escolhida = livres.sort((a, b) => usos[a] - usos[b])[0];
    cor.set(nome, escolhida);
    usos[escolhida]++;
  }
  return cor;
}

/** Tira das fronteiras os detalhes menores que um ponto do mapa (sem abrir buracos entre países vizinhos). */
function simplificar(topologia, mapa, fator = SIMPLIFICAR) {
  const grausPorUnidade = (mapa.graus ?? mapa.caixa[2] - mapa.caixa[0]) / LARGURA;
  return simplify(presimplify(topologia), fator * grausPorUnidade ** 2);
}

function projecaoDe(mapa) {
  if (!mapa.caixa) {
    // mundo inteiro: centrado um pouco a leste para a Rússia não ficar cortada; sem a Antártida
    const projecao = geoEqualEarth().rotate([-11, 0]).fitWidth(LARGURA, { type: 'Sphere' });
    const [, topo] = projecao([11, 84]);
    const [, base] = projecao([11, -57]);
    const [tx, ty] = projecao.translate();
    projecao.translate([tx, ty - topo]);
    return { projecao, altura: Math.round(base - topo) };
  }
  const [oeste, sul, leste, norte] = mapa.caixa;
  const borda = [];
  for (let i = 0; i <= 20; i++) {
    const lon = oeste + ((leste - oeste) * i) / 20;
    const lat = sul + ((norte - sul) * i) / 20;
    borda.push([lon, sul], [lon, norte], [oeste, lat], [leste, lat]);
  }
  const pontos = { type: 'MultiPoint', coordinates: borda };
  const projecao = geoAzimuthalEqualArea().rotate([-mapa.centro[0], -mapa.centro[1]]).fitWidth(LARGURA, pontos);
  const [[, y0], [, y1]] = geoPath(projecao).bounds(pontos);
  return { projecao, altura: Math.round(y1 - y0) };
}

const arredondar = (n) => Math.round(n * 10) / 10;

function gerarMapa(mapa, { paises, vizinhos, soltos }, PAISES, cores) {
  const { projecao, altura } = projecaoDe(mapa);
  projecao.clipExtent([[0, 0], [LARGURA, altura]]);
  const caminho = geoPath(projecao).digits(1);
  const area = (p) => caminho.area(poligono(p));

  const pecas = [];
  const fundo = [...soltos];
  for (const [nome, lista] of paises) {
    const dados = PAISES[nome];
    const ePeca = dados && (mapa.id === 'mundo' || dados.em.includes(mapa.id));
    const visiveis = lista.map((p) => ({ p, a: area(p) })).filter((x) => x.a > 0);
    if (!ePeca || visiveis.length === 0) {
      fundo.push(...lista);
      continue;
    }
    const maior = visiveis.reduce((m, x) => (x.a > m.a ? x : m));
    const usados = visiveis.filter((x) => x === maior || x.a >= AREA_MINIMA);
    // a moldura da peça (miniatura na bandeja) ignora ilhotas afastadas
    const principais = usados.filter((x) => x.a >= maior.a * 0.04);
    const [[x0, y0], [x1, y1]] = caminho.bounds(multi(principais.map((x) => x.p)));
    if (Math.max(x1 - x0, y1 - y0) < mapa.minimo) {
      fundo.push(...lista);
      continue;
    }
    const [cx, cy] = caminho.centroid(poligono(maior.p));
    pecas.push({
      id: nome,
      d: caminho(multi(usados.map((x) => x.p))),
      x: arredondar(x0),
      y: arredondar(y0),
      w: arredondar(x1 - x0),
      h: arredondar(y1 - y0),
      cx: arredondar(cx),
      cy: arredondar(cy),
      // "tamanho" da parte principal: dá a folga de encaixe
      t: arredondar(Math.sqrt(maior.a)),
      cor: cores.get(nome),
    });
  }
  pecas.sort((a, b) => a.id.localeCompare(b.id));
  const contexto = caminho(multi(fundo.filter((p) => area(p) >= AREA_MINIMA))) ?? '';
  return { projecao, altura, dados: { id: mapa.id, largura: LARGURA, altura, pecas, contexto } };
}

async function principal() {
  const PAISES = await carregarPaises();
  const fronteiras = await lerJson('countries-50m.json');
  const semDados = Object.keys(PAISES).filter((n) => !prepararPaises(fronteiras).paises.has(n));
  if (semDados.length > 0) throw new Error(`Países de paises.ts que não existem nos dados de fronteiras: ${semDados.join(', ')}`);
  const cores = colorir(Object.keys(PAISES), prepararPaises(fronteiras).vizinhos);

  // silhueta simples de cada mapa, para o cartão de escolha
  const terra110 = await lerJson('land-110m.json');

  const pasta = path.join(raiz, 'src', 'jogos', 'mapa', 'dados');
  await mkdir(pasta, { recursive: true });
  const indice = [];
  const emAlgumMapa = new Set();
  for (const mapa of MAPAS) {
    const { projecao, altura, dados } = gerarMapa(mapa, prepararPaises(simplificar(fronteiras, mapa)), PAISES, cores);
    const arquivo = path.join(pasta, `${mapa.id}.json`);
    const texto = JSON.stringify(dados);
    await writeFile(arquivo, texto);
    const simples = simplificar(terra110, mapa, 40);
    const terra = poligonosDe(feature(simples, simples.objects.land).features[0].geometry);
    const visivel = geoPath(projecao);
    const miniatura = visivel.digits(0)(multi(terra.filter((p) => visivel.area(poligono(p)) >= 60))) ?? '';
    indice.push({ id: mapa.id, largura: LARGURA, altura, total: dados.pecas.length, miniatura });
    dados.pecas.forEach((p) => emAlgumMapa.add(p.id));
    console.log(`${mapa.id}: ${dados.pecas.length} peças, ${LARGURA}x${altura}, ${(texto.length / 1024).toFixed(0)} KB`);
  }
  await writeFile(path.join(pasta, 'indice.json'), JSON.stringify(indice));
  const nunca = Object.keys(PAISES).filter((n) => !emAlgumMapa.has(n));
  if (nunca.length > 0) console.log(`\nPequenos demais em todos os mapas (nunca são peça): ${nunca.join(', ')}`);
  console.log('\nPronto.');
}

principal().catch((erro) => {
  console.error(`\nErro: ${erro.message}`);
  process.exit(1);
});
