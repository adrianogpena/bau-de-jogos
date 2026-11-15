/**
 * Plugin do servidor de testes do Vite: gera na hora, com as vozes neurais da Microsoft (edge-tts), o áudio de uma fala
 * que ainda não existe.
 *
 * O app pede `/audio/<variante>/<voz>/t/<hash>.mp3?t=<texto>`. Se o arquivo não está em public/audio/,
 * o texto é sintetizado e guardado ali (a próxima vez já está pronto). Só funciona em `npm run servidor`, com internet.
 *
 * Precisa do Python com edge-tts e imageio-ffmpeg (docs/NARRACAO.md); NARRADOR_PYTHON aponta para ele.
 */
const PADRAO = /\/audio\/(pt-PT|pt-BR)\/([a-z0-9-]+)\/t\/([0-9a-f]{14})\.mp3$/;
const MAXIMO_CARACTERES = 1000;

export function narradorDev({ raiz, hashTexto }) {
  const emAndamento = new Map();

  async function gerar(destino, voz, texto) {
    await mkdir(path.dirname(destino), { recursive: true });
    const lote = path.join(os.tmpdir(), `narrador-dev-${process.pid}-${hashTexto(texto)}.json`);
    await writeFile(lote, JSON.stringify([{ saida: destino, texto }]));
    try {
      await new Promise((resolve, reject) => {
        const filho = spawn(
          pythonDoNarrador(),
          [
            path.join(raiz, 'scripts', 'narrador_falar.py'),
            '--voz', voz.voz,
            '--lote', lote,
            `--ritmo=${voz.ritmo ?? '+0%'}`,
      ...(voz.ritmoPalavra ? [`--ritmo-palavra=${voz.ritmoPalavra}`] : []),
            `--tom=${voz.tom ?? '+0Hz'}`,
            '--tentativas', '3',
            ...(voz.vozCurta ? ['--voz-curta', voz.vozCurta, '--palavras-curta', String(voz.palavrasCurta ?? 4)] : []),
          ],
          { stdio: ['ignore', 'pipe', 'pipe'] },
        );
        let saida = '';
        filho.stdout.on('data', (d) => (saida += d));
        filho.stderr.on('data', (d) => (saida += d));
        filho.on('error', reject);
        filho.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(saida.trim().split('\n').pop() || `código ${codigo}`))));
      });
    } finally {
      await rm(lote, { force: true });
    }
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
    name: 'narrador-dev',
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
            if (!voz?.servico || !texto || texto.length > MAXIMO_CARACTERES || hashTexto(texto) !== hash) throw new Error('pedido inválido');
            if (!emAndamento.has(destino)) {
              const tarefa = gerar(destino, voz, texto).finally(() => emAndamento.delete(destino));
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
