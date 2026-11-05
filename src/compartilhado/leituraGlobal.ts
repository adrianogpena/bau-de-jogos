import { IDIOMAS, type Idioma, idiomaInicial } from './idioma';
import { falarTexto } from './TextoNarrado';

const INTERATIVO = 'button, a, [role="button"], summary, label, select';
const CAMPO = 'input, textarea, [contenteditable="true"]';
/** Elementos marcados com isto não são lidos ao tocar (ex.: a história com a palavra em falta). */
const SEM_LEITURA = '[data-sem-leitura]';
const TEMPO_SEGURAR = 500;
const DISTANCIA_MAXIMA = 12;

function idiomaDe(el: Element): Idioma {
  const lang = el.closest('[lang]')?.getAttribute('lang');
  return IDIOMAS.find((i) => i.codigo === lang)?.codigo ?? idiomaInicial();
}

function temLetras(texto: string): boolean {
  return /\p{L}/u.test(texto);
}

function textoProprio(el: Element): boolean {
  return [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '');
}

/** Sobe do elemento tocado até o bloco de texto a que ele pertence (parágrafo, título, linha...). */
function blocoDeTexto(inicio: Element): HTMLElement | null {
  let el: Element | null = inicio;
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && (textoProprio(el) || /^(P|H[1-6]|LI|FIGCAPTION)$/.test(el.tagName))) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function textoDoBotao(el: HTMLElement): string {
  const visivel = el.innerText;
  return temLetras(visivel) ? visivel : (el.getAttribute('aria-label') ?? '');
}

/**
 * Leitura em qualquer parte do app:
 * - tocar num texto lê o bloco inteiro (os textos de TextoNarrado têm leitura própria, com destaque);
 * - segurar um botão (~0,5 s) lê o rótulo sem acionar o botão; o toque rápido continua agindo.
 */
export function instalarLeituraGlobal() {
  if (!('speechSynthesis' in window)) return;

  let temporizador: number | undefined;
  let inicioX = 0;
  let inicioY = 0;
  let segurou = false;

  const cancelar = () => {
    window.clearTimeout(temporizador);
    temporizador = undefined;
  };

  document.addEventListener(
    'pointerdown',
    (e) => {
      cancelar();
      segurou = false;
      const alvo = e.target instanceof Element ? e.target : null;
      if (!alvo || alvo.closest(CAMPO)) return;
      const botao = alvo.closest<HTMLElement>(INTERATIVO);
      if (!botao) return;
      inicioX = e.clientX;
      inicioY = e.clientY;
      temporizador = window.setTimeout(() => {
        temporizador = undefined;
        const texto = textoDoBotao(botao);
        if (!temLetras(texto)) return;
        segurou = true;
        falarTexto(texto, idiomaDe(botao), temLetras(botao.innerText) ? botao : undefined);
      }, TEMPO_SEGURAR);
    },
    true,
  );

  document.addEventListener(
    'pointermove',
    (e) => {
      if (temporizador === undefined) return;
      if (Math.hypot(e.clientX - inicioX, e.clientY - inicioY) > DISTANCIA_MAXIMA) cancelar();
    },
    true,
  );
  document.addEventListener('pointerup', cancelar, true);
  document.addEventListener('pointercancel', cancelar, true);

  // o menu de segurar do tablet atrapalharia a leitura
  document.addEventListener('contextmenu', (e) => {
    if (temporizador !== undefined || segurou) e.preventDefault();
  });

  document.addEventListener(
    'click',
    (e) => {
      if (!segurou) return;
      segurou = false;
      e.stopPropagation();
      e.preventDefault();
    },
    true,
  );

  document.addEventListener('click', (e) => {
    const alvo = e.target instanceof Element ? e.target : null;
    if (!alvo || alvo.closest(INTERATIVO) || alvo.closest(CAMPO) || alvo.closest('.texto-tocavel')) return;
    if (alvo.closest(SEM_LEITURA)) return;
    const bloco = blocoDeTexto(alvo);
    if (!bloco || !temLetras(bloco.innerText)) return;
    falarTexto(bloco.innerText, idiomaDe(bloco), bloco);
  });
}
