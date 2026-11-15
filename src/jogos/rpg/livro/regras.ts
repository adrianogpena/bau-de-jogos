import { palavraPorImagem } from '../../../compartilhado/palavras';
import type { Condicao, Livro, Ponto } from './tipos';

/** A escolha aparece para quem tem estas marcas? */
export function permite(se: Condicao | undefined, marcas: readonly string[]): boolean {
  if (!se) return true;
  if (se.tem && !se.tem.every((m) => marcas.includes(m))) return false;
  if (se.temAlguma && !se.temAlguma.some((m) => marcas.includes(m))) return false;
  if (se.naoTem && se.naoTem.some((m) => marcas.includes(m))) return false;
  return true;
}

/** Marcas depois de chegar a um ponto. */
export function aplicarMarcas(marcas: readonly string[], ponto: Ponto): string[] {
  const novas = marcas.filter((m) => !ponto.perde?.includes(m));
  for (const m of ponto.ganha ?? []) if (!novas.includes(m)) novas.push(m);
  return novas;
}

/** Para onde um ponto pode levar com estas marcas (escolhas visíveis, luta, teste, puzzle e feitiço). */
export function saidas(ponto: Ponto, marcas: readonly string[]): string[] {
  return [
    ...(ponto.escolhas ?? []).filter((e) => permite(e.se, marcas)).map((e) => e.destino),
    ...(ponto.luta ? [ponto.luta.aoVencer] : []),
    ...(ponto.teste ? [ponto.teste.sucesso, ponto.teste.falha] : []),
    ...(ponto.desafio ? [ponto.desafio.sucesso, ponto.desafio.falha] : []),
    ...(ponto.aprender ? [ponto.aprender.proxima] : []),
  ];
}

/**
 * Confere a história ao carregar (falha cedo, como `fabula()`): ids, destinos, finais, palavras dos puzzles
 * e se todo ponto tem saída para qualquer criança (uma saída sem condição, ou escolhas "tem X" / "não tem X").
 */
export function livro<Atributo extends string>(dados: Livro<Atributo>): Livro<Atributo> {
  const erro = (texto: string) => new Error(`Livro-jogo "${dados.id}": ${texto}`);
  if (!dados.pontos[dados.inicial]) throw erro(`ponto inicial "${dados.inicial}" não existe`);
  for (const [chave, ponto] of Object.entries<Ponto>(dados.pontos)) {
    if (ponto.id !== chave) throw erro(`o ponto "${chave}" tem id "${ponto.id}"`);
    const todas = saidas(ponto, []).concat((ponto.escolhas ?? []).map((e) => e.destino));
    for (const destino of todas) if (!dados.pontos[destino]) throw erro(`"${chave}" leva a "${destino}", que não existe`);
    if (ponto.fim) {
      if (!dados.finais[ponto.fim]) throw erro(`"${chave}" termina no final "${ponto.fim}", que não existe`);
      if (todas.length > 0) throw erro(`"${chave}" é um final e não pode ter saídas`);
      continue;
    }
    const semCondicao = saidas(ponto, []).length > 0;
    const complementares = (ponto.escolhas ?? []).some((e) =>
      e.se?.tem?.length === 1 && !e.se.temAlguma && !e.se.naoTem
        ? ponto.escolhas!.some((o) => o.se?.naoTem?.length === 1 && o.se.naoTem[0] === e.se!.tem![0] && !o.se.tem && !o.se.temAlguma)
        : false,
    );
    if (!semCondicao && !complementares) throw erro(`"${chave}" pode ficar sem saída`);
    if (ponto.desafio?.tipo === 'escrever') ponto.desafio.palavras.forEach(palavraPorImagem);
    if (ponto.desafio?.tipo === 'enigma') {
      for (const e of ponto.desafio.enigmas) if (!e.opcoes[e.certa]) throw erro(`adivinha de "${chave}" sem resposta certa`);
    }
  }
  const usados = new Set(Object.values<Ponto>(dados.pontos).map((p) => p.fim));
  for (const id of Object.keys(dados.finais)) if (!usados.has(id)) throw erro(`nenhum ponto chega ao final "${id}"`);
  return dados;
}
