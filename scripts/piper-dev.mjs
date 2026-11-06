/**
 * Plugin do servidor de testes do Vite: gera na hora, com o Piper, o áudio de uma fala que ainda não existe.
 *
 * O app pede `/audio/<variante>/<voz>/t/<hash>.mp3?t=<texto>`. Se o arquivo não está em public/audio/,
 * o texto é sintetizado e guardado ali (a próxima vez já está pronto). Só funciona em `npm run servidor`.
 *
 * Precisa de python3 com `pip install piper-tts` e ffmpeg; os modelos .onnx ficam em modelos-piper/.
 * Variáveis: PIPER_PYTHON (python que tem o piper) e PIPER_MODELOS (pasta dos modelos).
 */
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir, readFile, rename } from 'node:fs/promises';
import path from 'node:path';

const PADRAO = /\/audio\/(pt-PT|pt-BR)\/([a-z0-9-]+)\/t\/([0-9a-f]{14})\.mp3$/;
const MAXIMO_CARACTERES = 1000;

export function piperDev({ raiz, hashTexto }) {
  const python = process.env.PIPER_PYTHON || 'python3';
  const pastaModelos = path.resolve(raiz, process.env.PIPER_MODELOS || 'modelos-piper');
  const emAndamento = new Map();

  async function gerar(destino, modelo, texto) {
    await mkdir(path.dirname(destino), { recursive: true });
    const temporario = `${destino}.${process.pid}.tmp.mp3`;
    await new Promise((resolve, reject) => {
      const filho = spawn(python, [path.join(raiz, 'scripts', 'piper_falar.py'), modelo, temporario], {
        stdio: ['pipe', 'ignore', 'pipe'],
      });
      let erro = '';
      filho.stderr.on('data', (d) => (erro += d));
      filho.on('error', reject);
      filho.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(erro.trim().split('\n').pop() || `código ${codigo}`))));
      filho.stdin.end(texto);
    });
    await rename(temporario, destino);
  }

  function enviar(req, res, arquivo) {
    const { size } = statSync(arquivo);
    const faixa = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    if (faixa && (faixa[1] || faixa[2])) {
      const inicio = faixa[1] ? Number(faixa[1]) : Math.max(size - Number(faixa[2]), 0);
      const fim = faixa[1] && faixa[2] ? Math.min(Number(faixa[2]), size - 1) : size - 1;
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${inicio}-${fim}/${size}`);
      res.setHeader('Content-Length', fim - inicio + 1);
      createReadStream(arquivo, { start: inicio, end: fim }).pipe(res);
    } else {
      res.setHeader('Content-Length', size);
      createReadStream(arquivo).pipe(res);
    }
  }

  return {
    name: 'piper-dev',
    apply: 'serve',
    async configureServer(servidor) {
      const config = JSON.parse(await readFile(path.join(raiz, 'src', 'compartilhado', 'vozes-narrador.json'), 'utf8'));
      servidor.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '', 'http://localhost');
        const achou = PADRAO.exec(url.pathname);
        if (!achou) return next();
        const [, variante, idVoz, hash] = achou;
        const voz = config.vozes.find((v) => v.id === idVoz && v.variante === variante);
        const destino = path.join(raiz, 'public', 'audio', variante, idVoz, 't', `${hash}.mp3`);
        try {
          if (!existsSync(destino)) {
            const texto = url.searchParams.get('t') ?? '';
            if (!voz || !texto || texto.length > MAXIMO_CARACTERES || hashTexto(texto) !== hash) throw new Error('pedido inválido');
            const modelo = path.join(pastaModelos, voz.modelo);
            if (!existsSync(modelo)) throw new Error(`modelo não encontrado: ${modelo}`);
            if (!emAndamento.has(destino)) {
              const tarefa = gerar(destino, modelo, texto).finally(() => emAndamento.delete(destino));
              emAndamento.set(destino, tarefa);
              console.log(`[narrador] ${variante}/${idVoz}: "${texto.slice(0, 60)}${texto.length > 60 ? '…' : ''}"`);
            }
            await emAndamento.get(destino);
          }
          enviar(req, res, destino);
        } catch (erro) {
          console.warn(`[narrador] sem áudio (${erro.message}); o app usa a voz do aparelho.`);
          res.statusCode = 404;
          res.end();
        }
      });
    },
  };
}
