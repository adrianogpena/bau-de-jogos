#!/usr/bin/env node
/**
 * Gera a narração das histórias com o ElevenLabs e salva em public/audio/.
 * As vozes (uma por variante) ficam em scripts/vozes.json. Guia completo: docs/NARRACAO-ELEVENLABS.md
 *
 *   ELEVENLABS_API_KEY=... npm run audio -- --simular      # só mostra o que seria gerado e o custo em caracteres
 *   ELEVENLABS_API_KEY=... npm run audio                   # gera o que falta (não refaz o que já está pronto)
 *   npm run audio -- --variante pt-PT --historia lebre-tartaruga
 *   npm run audio -- --forcar                              # refaz tudo
 *   npm run audio -- --listar-vozes pt-PT                  # vozes da sua conta e da biblioteca
 *
 * A chave também pode ficar em .env.local (ignorado pelo git): ELEVENLABS_API_KEY=...
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VARIANTES, carregarHistorias, falasDaHistoria } from './textos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.elevenlabs.io/v1';

// ---------- argumentos e configuração ----------

function lerArgumentos(lista) {
  const args = { simular: false, forcar: false, variantes: VARIANTES, historia: null, listarVozes: null };
  for (let i = 0; i < lista.length; i++) {
    const a = lista[i];
    if (a === '--simular') args.simular = true;
    else if (a === '--forcar') args.forcar = true;
    else if (a === '--variante') args.variantes = [lista[++i]];
    else if (a === '--historia') args.historia = lista[++i];
    else if (a === '--listar-vozes') args.listarVozes = lista[i + 1]?.startsWith('--') ? 'todas' : (lista[++i] ?? 'todas');
    else throw new Error(`Argumento desconhecido: ${a}`);
  }
  for (const v of args.variantes) {
    if (!VARIANTES.includes(v)) throw new Error(`Variante inválida "${v}". Use pt-PT ou pt-BR.`);
  }
  return args;
}

function lerChave() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const arquivo = path.join(raiz, '.env.local');
  if (existsSync(arquivo)) {
    const linha = readFileSync(arquivo, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('ELEVENLABS_API_KEY='));
    if (linha) return linha.slice('ELEVENLABS_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

async function lerConfig() {
  return JSON.parse(await readFile(path.join(raiz, 'scripts', 'vozes.json'), 'utf8'));
}

// ---------- ElevenLabs ----------

async function pedir(chave, caminho, opcoes = {}) {
  const resposta = await fetch(`${API}${caminho}`, { ...opcoes, headers: { 'xi-api-key': chave, 'Content-Type': 'application/json' } });
  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(`ElevenLabs respondeu ${resposta.status} em ${caminho}: ${corpo.slice(0, 300)}`);
  }
  return resposta.json();
}

async function listarVozes(chave, variante) {
  const conta = await pedir(chave, '/voices');
  console.log('\nVozes da sua conta (use o "id" em scripts/vozes.json):');
  for (const v of conta.voices) {
    const idioma = v.labels?.language ?? v.labels?.accent ?? '';
    console.log(`  ${v.voice_id}  ${v.name}${idioma ? `  [${idioma}]` : ''}`);
  }
  const filtro = new URLSearchParams({ language: 'pt', page_size: '30' });
  if (variante === 'pt-PT') filtro.set('accent', 'portugal');
  if (variante === 'pt-BR') filtro.set('accent', 'brazilian');
  try {
    const biblioteca = await pedir(chave, `/shared-voices?${filtro}`);
    console.log(`\nBiblioteca de vozes (português${variante !== 'todas' ? `, ${variante}` : ''}). Adicione à sua conta antes de usar:`);
    for (const v of biblioteca.voices ?? []) {
      console.log(`  ${v.voice_id}  ${v.name}  [${v.accent ?? '?'} · ${v.gender ?? '?'} · ${v.age ?? '?'}]  ${v.description ?? ''}`.slice(0, 200));
    }
  } catch (erro) {
    console.log(`\n(Não foi possível listar a biblioteca: ${erro.message})`);
  }
}

/** Transforma os tempos por letra do ElevenLabs em tempos por palavra. */
function palavrasDoAlinhamento(alinhamento) {
  const { characters, character_start_times_seconds: inicios, character_end_times_seconds: fins } = alinhamento;
  const palavras = [];
  let atual = null;
  characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (atual) palavras.push(atual);
      atual = null;
    } else if (atual) {
      atual.texto += c;
      atual.fim = fins[i];
    } else {
      atual = { texto: c, inicio: inicios[i], fim: fins[i] };
    }
  });
  if (atual) palavras.push(atual);
  const arredondar = (n) => Math.round(n * 1000) / 1000;
  return palavras.map((p) => ({ texto: p.texto, inicio: arredondar(p.inicio), fim: arredondar(p.fim) }));
}

async function gerarFala(chave, config, voz, texto) {
  const corpo = {
    text: texto,
    model_id: config.modelo,
    voice_settings: config.configuracoes,
  };
  const dados = await pedir(chave, `/text-to-speech/${voz.id}/with-timestamps?output_format=${config.formato}`, {
    method: 'POST',
    body: JSON.stringify(corpo),
  });
  return { audio: Buffer.from(dados.audio_base64, 'base64'), palavras: palavrasDoAlinhamento(dados.alignment) };
}

// ---------- principal ----------

async function principal() {
  const args = lerArgumentos(process.argv.slice(2));
  const config = await lerConfig();
  const chave = lerChave();

  if (args.listarVozes) {
    if (!chave) throw new Error('Defina ELEVENLABS_API_KEY para listar as vozes.');
    await listarVozes(chave, args.listarVozes);
    return;
  }
  if (!args.simular && !chave) throw new Error('Defina ELEVENLABS_API_KEY (ou crie .env.local). Para só conferir, use --simular.');

  let historias = await carregarHistorias();
  if (args.historia) {
    historias = historias.filter((h) => h.id === args.historia);
    if (historias.length === 0) throw new Error(`História "${args.historia}" não encontrada.`);
  }

  let caracteres = 0;
  let feitos = 0;
  let prontos = 0;
  for (const variante of args.variantes) {
    const voz = config.vozes[variante];
    if (!voz?.id && !args.simular) {
      throw new Error(`Falta escolher a voz de ${variante} em scripts/vozes.json ("id"). Veja: npm run audio -- --listar-vozes ${variante}`);
    }
    for (const historia of historias) {
      const pasta = path.join(raiz, 'public', 'audio', variante, voz.pasta ?? 'elevenlabs', historia.id);
      for (const fala of falasDaHistoria(historia, variante)) {
        // a impressão digital muda se o texto, a voz ou os ajustes mudarem: só então o áudio é refeito
        const impressao = createHash('sha256')
          .update(JSON.stringify([fala.texto, voz?.id, config.modelo, config.formato, config.configuracoes]))
          .digest('hex')
          .slice(0, 16);
        const arquivoJson = path.join(pasta, `${fala.nome}.json`);
        const arquivoMp3 = path.join(pasta, `${fala.nome}.mp3`);
        if (!args.forcar && existsSync(arquivoMp3) && existsSync(arquivoJson)) {
          const anterior = JSON.parse(await readFile(arquivoJson, 'utf8'));
          if (anterior.impressao === impressao) {
            prontos++;
            continue;
          }
        }
        caracteres += fala.texto.length;
        feitos++;
        const rotulo = `${variante}/${historia.id}/${fala.nome}`;
        if (args.simular) {
          console.log(`  gerar ${rotulo} (${fala.texto.length} caracteres)`);
          continue;
        }
        console.log(`  gerando ${rotulo} (${fala.texto.length} caracteres)...`);
        const { audio, palavras } = await gerarFala(chave, config, voz, fala.texto);
        await mkdir(pasta, { recursive: true });
        await writeFile(arquivoMp3, audio);
        await writeFile(arquivoJson, JSON.stringify({ impressao, texto: fala.texto, palavras }, null, 1) + '\n');
      }
    }
  }
  const verbo = args.simular ? 'a gerar' : 'gerados';
  console.log(`\n${feitos} áudios ${verbo} (${caracteres} caracteres), ${prontos} já estavam prontos.`);
}

principal().catch((erro) => {
  console.error(`\nErro: ${erro.message}`);
  process.exit(1);
});
