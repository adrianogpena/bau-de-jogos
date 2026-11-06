// Abre o app numa janela com o tamanho do tablet NXTPAPER 11 (2200x1440 px, ~2x de densidade).
// Uso: npm run dev:tablet[-- --retrato]
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import net from 'node:net'

const PORTA = 5199
const URL = `http://localhost:${PORTA}/bau-de-jogos/?tablet`
const DENSIDADE = 2
const retrato = process.argv.includes('--retrato')

const largura = (retrato ? 1440 : 2200) / DENSIDADE
const altura = (retrato ? 2200 : 1440) / DENSIDADE
const BARRA_TITULO = 32 // a janela em modo app inclui a barra de título

const candidatos = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const navegador = candidatos.find((c) => existsSync(c))
if (!navegador) {
  console.error('Chrome ou Edge não encontrado.')
  process.exit(1)
}

const portaAberta = () =>
  new Promise((resolve) => {
    const s = net.connect(PORTA, '127.0.0.1')
    s.once('connect', () => (s.destroy(), resolve(true)))
    s.once('error', () => resolve(false))
  })

let servidor
if (!(await portaAberta())) {
  servidor = spawn('npm run servidor', { shell: true, stdio: 'inherit' })
  for (let i = 0; i < 60 && !(await portaAberta()); i++) {
    await new Promise((r) => setTimeout(r, 500))
  }
}

const perfil = mkdtempSync(join(tmpdir(), 'bau-tablet-'))
const janela = spawn(
  navegador,
  [
    `--app=${URL}`,
    `--window-size=${largura},${altura + BARRA_TITULO}`,
    `--user-data-dir=${perfil}`,
    '--disable-features=Translate,TranslateUI,TranslateRPCs',
    '--lang=pt-BR',
    '--no-first-run',
    '--no-default-browser-check',
  ],
  { stdio: 'ignore' },
)

janela.on('exit', () => {
  servidor?.kill()
  process.exit(0)
})
process.on('SIGINT', () => {
  janela.kill()
  servidor?.kill()
  process.exit(0)
})
