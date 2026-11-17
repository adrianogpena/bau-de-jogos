#!/usr/bin/env node
/**
 * Gera o áudio de todas as frases fixas do site com as vozes neurais da Microsoft (Thalita em pt-BR, Raquel em pt-PT),
 * para as vozes de src/compartilhado/vozes-narrador.json que têm "servico". Os arquivos ficam em
 * public/audio/<variante>/<voz>/t/<hash>.mp3, o mesmo lugar onde o app os procura. Guia: docs/NARRACAO.md
 *
 *   npm run audio:narrador -- --simular     # só conta frases e caracteres
 *   npm run audio:narrador                  # gera o que falta (não refaz o que já existe; pode interromper e retomar)
 *   npm run audio:narrador -- --voz thalita
 *   npm run audio:narrador -- --podar       # apaga os áudios de textos que não existem mais
 *   npm run audio:narrador -- --refazer     # gera de novo todos, mesmo os que já existem
 *   npm run audio:narrador -- --refazer-textos zero,cem   # gera de novo só esses textos (separados por vírgula)
 *   npm run audio:narrador -- --paralelo 8  # conexões ao mesmo tempo, divididas entre as vozes (padrão 8)
 *   npm run audio:narrador -- --frases-por-pedido 1   # sem lote: uma fala por pedido (padrão 8; ver narrador_falar.py)
 *   npm run audio:andamento                 # mostra o andamento de uma geração em curso (de outro terminal)
 *   npm run audio:acompanhar                # idem, atualizando sozinho até a geração acabar
 *
 * As vozes são geradas ao mesmo tempo. Só pode haver uma geração por vez (trava em ARQUIVO_TRAVA); o andamento fica
 * em ARQUIVO_ANDAMENTO, atualizado a cada segundo.
 *
 * Python com `edge-tts` e `imageio-ffmpeg` (fora do git): NARRADOR_PYTHON, ou o padrão abaixo (docs/NARRACAO.md).
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { arquivoAudio, frasesDoSite, lerVozes, pastaAudio } from './frases-narradas.mjs';
import { pythonDoNarrador } from './python-narrador.mjs';
import { raiz } from './textos.mjs';

const ARQUIVO_TRAVA = path.join(os.tmpdir(), 'bau-de-jogos-narrador.trava');
const ARQUIVO_ANDAMENTO = path.join(os.tmpdir(), 'bau-de-jogos-narrador-andamento.json');

// ---------- andamento ----------

function duracao(segundos) {
  if (!Number.isFinite(segundos)) return '?';
  const s = Math.max(0, Math.round(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m > 0) return `${m} min ${String(s % 60).padStart(2, '0')} s`;
  return `${s} s`;
}

function barra(fracao, largura = 30) {
  const cheio = Math.round(Math.min(1, Math.max(0, fracao)) * largura);
  return '█'.repeat(cheio) + '░'.repeat(largura - cheio);
}

/** Conta o andamento das vozes; a velocidade é a dos últimos 5 min (acompanha o serviço quando ele oscila, sem pular a cada lote de 8 falas). */
class Andamento {
  constructor(vozes) {
    this.inicio = Date.now();
    this.vozes = vozes.map((v) => ({ id: v.id, variante: v.variante, total: v.total, feitas: 0, falhas: 0, novasTentativas: 0 }));
    this.marcas = []; // [instante, concluídas]
  }

  get total() { return this.vozes.reduce((s, v) => s + v.total, 0); }
  get concluidas() { return this.vozes.reduce((s, v) => s + v.feitas + v.falhas, 0); }

  registrar(idVoz, nome) {
    const v = this.vozes.find((x) => x.id === idVoz);
    if (nome === 'feita' || nome === 'pulada') v.feitas++;
    else if (nome === 'falha') v.falhas++;
    else if (nome === 'nova-tentativa') v.novasTentativas++;
  }

  resumo() {
    const agora = Date.now();
    this.marcas.push([agora, this.concluidas]);
    while (this.marcas.length > 1 && agora - this.marcas[0][0] > 300_000) this.marcas.shift();
    const [t0, c0] = this.marcas[0];
    const janela = (agora - t0) / 1000;
    const porSegundo = janela >= 5 ? (this.concluidas - c0) / janela : this.concluidas / Math.max(1, (agora - this.inicio) / 1000);
    const faltam = this.total - this.concluidas;
    return {
      pid: process.pid,
      inicio: this.inicio,
      atualizado: agora,
      total: this.total,
      concluidas: this.concluidas,
      porSegundo,
      restanteSegundos: faltam === 0 ? 0 : porSegundo > 0 ? faltam / porSegundo : null,
      vozes: this.vozes,
    };
  }
}

function linhaAndamento(r) {
  const fracao = r.total ? r.concluidas / r.total : 1;
  const falhas = r.vozes.reduce((s, v) => s + v.falhas, 0);
  const novas = r.vozes.reduce((s, v) => s + v.novasTentativas, 0);
  const restante = r.restanteSegundos == null ? 'calculando…' : `faltam ~${duracao(r.restanteSegundos)}`;
  return (
    `${barra(fracao)} ${(fracao * 100).toFixed(1)}%  ${r.concluidas}/${r.total}  ` +
    `${r.porSegundo.toFixed(1)}/s  ${restante}  (decorrido ${duracao((r.atualizado - r.inicio) / 1000)})` +
    (falhas ? `  ${falhas} falha(s)` : '') +
    (novas ? `  ${novas} nova(s) tentativa(s)` : '')
  );
}

function linhasPorVoz(r) {
  return r.vozes.map((v) => `  ${v.variante}/${v.id}: ${v.feitas + v.falhas}/${v.total}${v.falhas ? ` (${v.falhas} falha(s))` : ''}`);
}

function processoVivo(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (erro) {
    return erro.code === 'EPERM';
  }
}

/** Linhas do andamento gravado pela geração em curso; `ativa` diz se ela ainda roda. */
function lerAndamento() {
  if (!existsSync(ARQUIVO_ANDAMENTO)) return { linhas: ['Nenhuma geração registrada.'], ativa: false };
  let r;
  try {
    r = JSON.parse(readFileSync(ARQUIVO_ANDAMENTO, 'utf8'));
  } catch {
    return null; // arquivo no meio de uma gravação: tenta de novo na próxima leitura
  }
  const vivo = processoVivo(r.pid);
  const estado = r.terminou ? 'terminou' : vivo ? 'em andamento' : 'parada (interrompida antes do fim; rode de novo para retomar)';
  const linhas = [
    `Geração ${estado}, iniciada às ${new Date(r.inicio).toLocaleTimeString('pt-PT')}, atualizada há ${duracao((Date.now() - r.atualizado) / 1000)}`,
    linhaAndamento(r),
    ...linhasPorVoz(r),
  ];
  if (vivo && !r.terminou && r.restanteSegundos != null) {
    linhas.push(`Previsão de término: ${new Date(r.atualizado + r.restanteSegundos * 1000).toLocaleTimeString('pt-PT')}`);
  }
  return { linhas, ativa: vivo && !r.terminou, concluidas: r.concluidas };
}

/** `npm run audio:andamento`: mostra o andamento uma vez. */
function mostrarAndamento() {
  console.log((lerAndamento() ?? { linhas: ['Andamento sendo gravado; tente de novo.'] }).linhas.join('\n'));
}

/**
 * `npm run audio:acompanhar`: mostra o andamento até a geração acabar. No terminal, redesenha no mesmo lugar a cada 2 s;
 * fora dele (Shell details do Claude Code, log), que não volta linhas, escreve uma linha nova a cada 10 s.
 */
async function acompanharAndamento() {
  const interativo = process.stdout.isTTY;
  let desenhadas = 0;
  let ultima = 0;
  for (;;) {
    const a = lerAndamento();
    if (a) {
      if (interativo) {
        process.stdout.write((desenhadas ? `\x1b[${desenhadas}F\x1b[J` : '') + a.linhas.join('\n') + '\n');
        const largura = process.stdout.columns || 80;
        desenhadas = a.linhas.reduce((n, l) => n + Math.max(1, Math.ceil(l.length / largura)), 0);
      } else if (!a.ativa || Date.now() - ultima >= 10_000) {
        console.log(a.linhas[1] ?? a.linhas[0]);
        ultima = Date.now();
      }
      if (!a.ativa) {
        if (!interativo) console.log(a.linhas[0]);
        return;
      }
    }
    await new Promise((fim) => setTimeout(fim, 2000));
  }
}

// ---------- trava (uma geração por vez) ----------

function travar() {
  if (existsSync(ARQUIVO_TRAVA)) {
    const pid = Number(readFileSync(ARQUIVO_TRAVA, 'utf8'));
    if (pid && pid !== process.pid && processoVivo(pid)) {
      throw new Error(
        `já há uma geração em curso (processo ${pid}). Veja o andamento com "npm run audio:andamento". ` +
          'Duas ao mesmo tempo disputam o serviço e ficam mais lentas.',
      );
    }
  }
  writeFileSync(ARQUIVO_TRAVA, String(process.pid));
  const soltar = () => {
    try {
      if (readFileSync(ARQUIVO_TRAVA, 'utf8') === String(process.pid)) rmSync(ARQUIVO_TRAVA);
    } catch {
      // já não existe
    }
  };
  process.on('exit', soltar);
  for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => process.exit(130));
}

// ---------- geração ----------

/**
 * Texto que vai ao serviço quando difere do da tela (o nome do arquivo continua sendo o hash do texto da tela).
 * `virgulaAposFeitico`: a Thalita (voz multilíngue) fala "Faísca Mágica!" com sotaque de inglês quando o nome do feitiço
 * é uma frase sozinha; com vírgula, dentro da frase seguinte, sai em português ("Faísca Mágica, causa treze de dano…").
 */
export function faladoDiferente(voz, texto, feiticos = []) {
  if (!voz.virgulaAposFeitico) return {};
  for (const nome of feiticos) {
    const inicio = `${nome}! `;
    const resto = texto.startsWith(inicio) ? texto.slice(inicio.length) : '';
    if (/^\p{L}/u.test(resto)) return { falado: `${nome}, ${resto[0].toLowerCase()}${resto.slice(1)}` };
  }
  return {};
}

/**
 * Gera (o que falta de) várias vozes num processo só: `trabalhos` = [{ voz, faltam: [{ texto, saida, falado? }] }].
 * As vozes dividem as `paralelo` conexões; quando uma acaba, as conexões passam todas para a outra.
 * `aoEvento(nome, idVoz)` recebe feita/pulada/falha/nova-tentativa; `aoTexto(linha)` as demais linhas do Python.
 */
export async function gerarVozes(trabalhos, paralelo = '8', { aoEvento, aoTexto = console.log, frasesPorPedido } = {}) {
  const temporario = path.join(os.tmpdir(), `narrador-lote-${process.pid}.json`);
  const configuracao = ({ voz, vozCurta, palavrasCurta, ritmo, ritmoPalavra, frasePalavra, tom }) => ({ voz, vozCurta, palavrasCurta, ritmo, ritmoPalavra, frasePalavra, tom });
  await writeFile(
    temporario,
    JSON.stringify({
      vozes: Object.fromEntries(trabalhos.map(({ voz }) => [voz.id, configuracao(voz)])),
      falas: trabalhos.flatMap(({ voz, faltam }) => faltam.map((f) => ({ ...f, voz: voz.id }))),
    }),
  );
  const argumentos = [
    path.join(raiz, 'scripts', 'narrador_falar.py'),
    '--lote', temporario,
    '--paralelo', String(paralelo),
    ...(frasesPorPedido ? ['--frases-por-pedido', String(frasesPorPedido)] : []),
    ...(aoEvento ? ['--eventos'] : []),
  ];
  try {
    await new Promise((resolve, reject) => {
      const filho = spawn(pythonDoNarrador(), argumentos, { stdio: ['ignore', 'pipe', 'inherit'] });
      readline.createInterface({ input: filho.stdout }).on('line', (linha) => {
        if (aoEvento && linha.startsWith('@')) {
          const [nome, idVoz] = linha.slice(1).split(' ');
          aoEvento(nome, idVoz);
        } else aoTexto(linha);
      });
      filho.on('error', reject);
      filho.on('close', (codigo) =>
        codigo === 0 ? resolve() : reject(new Error(`o gerador terminou com erro ${codigo} (veja as falhas acima; rode de novo para retomar)`)),
      );
    });
  } finally {
    await rm(temporario, { force: true });
  }
}

async function principal(args) {
  const vozes = (await lerVozes()).filter((v) => v.servico && (!args.voz || v.id === args.voz));
  const { frases, dinamicos, feiticos } = await frasesDoSite();
  if (dinamicos.length > 0) console.log(`(${dinamicos.length} textos com partes calculadas, como números e nomes de inimigos, ficam de fora)`);
  if (!args.simular) travar();

  const trabalhos = [];
  for (const voz of vozes) {
    const todas = [...frases[voz.variante]];
    const faltam = todas
      .map(([hash, texto]) => ({ texto, saida: arquivoAudio(voz, hash), ...faladoDiferente(voz, texto, feiticos[voz.variante]) }))
      .filter((f) => args.refazer || args.refazerTextos?.has(f.texto) || (args.refazerPalavras && /^[\p{L}\p{N}'-]+$/u.test(f.texto.trim())) || !existsSync(f.saida));
    if (!args.simular && (args.refazer || args.refazerTextos || args.refazerPalavras)) {
      for (const f of faltam) await rm(f.saida, { force: true }); // o gerador só pula o que existe
    }
    const caracteres = faltam.reduce((s, f) => s + f.texto.length, 0);
    console.log(`${voz.variante}/${voz.id}: ${todas.length} frases, ${faltam.length} a gerar (${caracteres} caracteres)`);
    if (args.podar) {
      const sobras = existsSync(pastaAudio(voz))
        ? readdirSync(pastaAudio(voz)).filter((f) => f.endsWith('.mp3') && !frases[voz.variante].has(f.slice(0, -4)))
        : [];
      console.log(`  ${sobras.length} áudio(s) de textos antigos${args.simular ? '' : ' apagados'}`);
      if (!args.simular) for (const f of sobras) await rm(path.join(pastaAudio(voz), f));
    }
    if (faltam.length > 0) trabalhos.push({ voz, faltam });
  }
  if (args.simular || trabalhos.length === 0) {
    console.log('\nPronto.');
    return;
  }

  // Terminal interativo: barra redesenhada na mesma linha. Saída redirecionada (log, outra ferramenta): uma linha a cada 10 s.
  const interativo = process.stdout.isTTY;
  const andamento = new Andamento(trabalhos.map((t) => ({ ...t.voz, total: t.faltam.length })));
  let ultimaLinha = 0;
  const desenhar = (final = false) => {
    const r = andamento.resumo();
    if (final) r.terminou = true;
    writeFileSync(ARQUIVO_ANDAMENTO, JSON.stringify(r));
    if (interativo) {
      process.stdout.write(`\r\x1b[2K${linhaAndamento(r)}${final ? '\n' : ''}`);
    } else if (final || Date.now() - ultimaLinha >= 10_000) {
      ultimaLinha = Date.now();
      console.log(linhaAndamento(r));
    }
  };
  const escrever = (linha) => {
    if (interativo) process.stdout.write('\r\x1b[2K');
    console.log(linha);
  };
  console.log(`\nGerando ${andamento.total} áudios (${trabalhos.length} voz(es) dividindo ${args.paralelo} conexões, até ${args.frasesPorPedido} falas por pedido)…`);
  console.log(`Andamento também em: npm run audio:andamento\n`);
  ultimaLinha = Date.now();
  const relogio = setInterval(desenhar, 1000);
  try {
    await gerarVozes(trabalhos, args.paralelo, {
      aoEvento: (nome, idVoz) => andamento.registrar(idVoz, nome),
      aoTexto: escrever,
      frasesPorPedido: args.frasesPorPedido,
    });
  } finally {
    clearInterval(relogio);
    desenhar(true);
    for (const l of linhasPorVoz(andamento.resumo())) console.log(l);
  }
  console.log('\nPronto.');
}

function lerArgumentos(lista) {
  const args = { simular: false, podar: false, refazer: false, refazerTextos: null, refazerPalavras: false, voz: null, paralelo: '8', frasesPorPedido: '8', andamento: false, acompanhar: false };
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] === '--simular') args.simular = true;
    else if (lista[i] === '--podar') args.podar = true;
    else if (lista[i] === '--refazer') args.refazer = true;
    else if (lista[i] === '--refazer-textos') args.refazerTextos = new Set(lista[++i].split(','));
    else if (lista[i] === '--refazer-palavras') args.refazerPalavras = true;
    else if (lista[i] === '--voz') args.voz = lista[++i];
    else if (lista[i] === '--paralelo') args.paralelo = lista[++i];
    else if (lista[i] === '--frases-por-pedido') args.frasesPorPedido = lista[++i];
    else if (lista[i] === '--andamento') args.andamento = true;
    else if (lista[i] === '--acompanhar') args.acompanhar = true;
    else throw new Error(`Argumento desconhecido: ${lista[i]}`);
  }
  return args;
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
  try {
    const args = lerArgumentos(process.argv.slice(2));
    if (args.acompanhar) await acompanharAndamento();
    else if (args.andamento) mostrarAndamento();
    else {
      await principal(args).catch((erro) => {
        console.error(`\nErro: ${erro.message}`);
        process.exit(1);
      });
    }
  } catch (erro) {
    console.error(`Erro: ${erro.message}`);
    process.exit(1);
  }
}
