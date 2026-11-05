import { useEffect, useMemo, useRef, useState } from 'react';
import type { Idioma } from './idioma';

/**
 * Presets de voz. Para voltar ao anterior, troque PRESET_ATIVO por 'anterior'.
 * - anterior: velocidade 0.9, qualquer voz portuguesa da variante, preferência leve por nomes "naturais".
 * - natural: voz neural/online da variante em primeiro lugar, tom e ritmo mais suaves.
 */
const PRESETS: Record<
  string,
  { velocidade: number; tom: number; bonusVozBoa: number; vozPreferida?: Partial<Record<Idioma, string[]>> }
> = {
  anterior: { velocidade: 0.9, tom: 1, bonusVozBoa: 5 },
  natural: {
    velocidade: 0.95,
    tom: 1.05,
    bonusVozBoa: 50,
    vozPreferida: { 'pt-BR': ['Thalita', 'Maria'], 'pt-PT': ['Raquel'] },
  },
};
const PRESET_ATIVO: keyof typeof PRESETS = 'natural';
const VELOCIDADE = PRESETS[PRESET_ATIVO].velocidade;

const temVoz = typeof window !== 'undefined' && 'speechSynthesis' in window;

interface Palavra {
  texto: string;
  inicio: number;
  /** Há uma quebra de linha depois desta palavra. */
  quebra: boolean;
}

/** Um pedaço do texto lido de uma vez (uma frase), com as palavras que o compõem. */
interface Frase {
  texto: string;
  inicio: number;
  /** Índice da primeira e da última palavra da frase. */
  primeira: number;
  ultima: number;
}

function separarPalavras(texto: string): Palavra[] {
  return [...texto.matchAll(/\S+(\s*)/g)].map((m) => ({
    texto: m[0].trimEnd(),
    inicio: m.index ?? 0,
    quebra: m[1].includes('\n'),
  }));
}

/**
 * Divide o texto em frases. Ler frase a frase evita que a voz do aparelho pare a meio
 * de textos longos (alguns navegadores cortam a fala ao fim de uns 15 segundos) e
 * permite acertar o destaque no início de cada frase.
 */
function separarFrases(texto: string, palavras: Palavra[]): Frase[] {
  const frases: Frase[] = [];
  let primeira = 0;
  palavras.forEach((p, i) => {
    const fimDeFrase = p.quebra || /[.!?…:;]["'”»)]*$/.test(p.texto) || i === palavras.length - 1;
    if (!fimDeFrase) return;
    frases.push({
      // o mesmo pedaço do texto original, para as posições das marcações baterem certo
      texto: texto.slice(palavras[primeira].inicio, p.inicio + p.texto.length),
      inicio: palavras[primeira].inicio,
      primeira,
      ultima: i,
    });
    primeira = i + 1;
  });
  return frases;
}

/** Palavra sem pontuação e em minúsculas, para comparar com a palavra em destaque. */
function limparPontuacao(palavra: string): string {
  return palavra.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').toLocaleLowerCase('pt');
}

/** Vozes mais naturais costumam ter estes nomes. */
const VOZ_BOA = /natural|neural|enhanced|premium|melhorad|online|google|siri/i;

/** Escolhe a melhor voz do aparelho para a variante: primeiro a mesma variante, depois qualquer português. */
function escolherVoz(idioma: Idioma): SpeechSynthesisVoice | undefined {
  const vozes = window.speechSynthesis.getVoices();
  const normalizar = (lang: string) => lang.replace('_', '-').toLowerCase();
  const pontuar = (v: SpeechSynthesisVoice) => {
    const lang = normalizar(v.lang);
    let pontos = 0;
    if (lang === idioma.toLowerCase()) pontos += 100;
    else if (lang.startsWith('pt')) pontos += 10;
    else return -1;
    // a lista está por ordem de preferência: quem vem primeiro vale mais
    const preferidas = PRESETS[PRESET_ATIVO].vozPreferida?.[idioma] ?? [];
    const posicao = preferidas.findIndex((nome) => v.name.includes(nome));
    if (posicao >= 0) pontos += 200 - posicao * 50;
    if (/desktop/i.test(v.name)) pontos -= 5;
    if (VOZ_BOA.test(v.name)) pontos += PRESETS[PRESET_ATIVO].bonusVozBoa;
    if (/compact|espeak|eloquence/i.test(v.name)) pontos -= 20;
    if (v.default) pontos += 1;
    return pontos;
  };
  return vozes
    .map((v) => ({ v, pontos: pontuar(v) }))
    .filter((x) => x.pontos >= 0)
    .sort((a, b) => b.pontos - a.pontos)[0]?.v;
}

// No Chrome a lista de vozes chega depois; pedir cedo faz com que esteja pronta ao tocar em "Ouvir".
if (temVoz) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
}

/** Função de parar do botão que está lendo agora; só um texto lê por vez. */
let pararLeituraAtiva: (() => void) | null = null;

let leituraSimples = 0;
let temporizadorSimples: number | undefined;
/** Guarda a fala em curso (sem isto o Chrome pode perdê-la e nunca avisar o fim). */
const falaSimples: { atual: SpeechSynthesisUtterance | null } = { atual: null };

const NOME_DESTAQUE = 'palavra-lida-global';

function limparDestaque() {
  window.clearTimeout(temporizadorSimples);
  if ('highlights' in CSS) CSS.highlights.delete(NOME_DESTAQUE);
}

/** Pausa entre dois blocos de texto (título → corpo → botão) e entre parágrafos. */
const PAUSA_ENTRE_BLOCOS = 650;

/**
 * Ícones, emojis e setas (ex.: o triângulo "▶" dos botões) não são lidos: viram espaços,
 * do mesmo tamanho, para as posições das palavras continuarem certas.
 */
const SIMBOLO = /[\p{Extended_Pictographic}\p{So}←-⇿■-◿☀-➿️‍⃣]/gu;

export function semSimbolos(texto: string): string {
  return texto.replace(SIMBOLO, (s) => ' '.repeat(s.length));
}

/** Pedaço de texto da tela, com a posição dele no texto inteiro e o bloco a que pertence. */
interface NoDeTexto {
  no: Text;
  inicio: number;
  bloco: Element;
}

/** Elemento visual mais próximo que não é "em linha": título, parágrafo, linha do botão... */
function blocoDoNo(no: Text, raiz: HTMLElement): Element {
  let el = no.parentElement;
  while (el && el !== raiz) {
    if (!getComputedStyle(el).display.startsWith('inline')) return el;
    el = el.parentElement;
  }
  return raiz;
}

/** Pedaços de texto de um elemento, sem os que estão escondidos ou marcados como ícone (aria-hidden). */
function nosDeTexto(el: HTMLElement): NoDeTexto[] {
  const nos: NoDeTexto[] = [];
  const passeio = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (no) => {
      const pai = no.parentElement;
      if (!pai || pai.closest('[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      if (pai.getClientRects().length === 0) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let inicio = 0;
  for (let no = passeio.nextNode(); no; no = passeio.nextNode()) {
    nos.push({ no: no as Text, inicio, bloco: blocoDoNo(no as Text, el) });
    inicio += (no as Text).length;
  }
  return nos;
}

/** Um pedaço lido de uma vez e a pausa que vem antes dele. */
interface PedacoFalado {
  texto: string;
  inicio: number;
  pausaAntes: number;
}

/** Divide em frases; quando o bloco muda (ou o parágrafo), a frase seguinte vem depois de uma pausa. */
function pedacosParaFalar(bruto: string, nos: NoDeTexto[]): PedacoFalado[] {
  const limpo = semSimbolos(bruto);
  // cortes: onde começa cada bloco novo e cada linha nova, para o título não colar no texto seguinte
  const cortes = new Set([0, limpo.length]);
  nos.forEach((n, i) => {
    if (i > 0 && n.bloco !== nos[i - 1].bloco) cortes.add(n.inicio);
  });
  for (const m of limpo.matchAll(/\n+/g)) cortes.add((m.index ?? 0) + m[0].length);
  const ordenados = [...cortes].sort((x, y) => x - y);

  const pedacos: PedacoFalado[] = [];
  for (let b = 0; b < ordenados.length - 1; b++) {
    const trecho = limpo.slice(ordenados[b], ordenados[b + 1]);
    let primeiroDoTrecho = true;
    for (const m of trecho.matchAll(/[^.!?…:;]+[.!?…:;]*["'”»)]*\s*/g)) {
      if (!/\p{L}/u.test(m[0])) continue;
      const deslocamento = m[0].length - m[0].trimStart().length;
      pedacos.push({
        texto: m[0].trim(),
        inicio: ordenados[b] + (m.index ?? 0) + deslocamento,
        pausaAntes: primeiroDoTrecho && pedacos.length > 0 ? PAUSA_ENTRE_BLOCOS : 0,
      });
      primeiroDoTrecho = false;
    }
  }
  return pedacos;
}

/**
 * Leitura de um texto qualquer da tela (leitura global). Com o elemento, a palavra falada
 * é marcada no próprio texto (CSS Custom Highlight), sem mexer na estrutura da página.
 * Ícones e emojis não são lidos, e entre blocos (título, texto, botão) há uma pequena pausa.
 */
export function falarTexto(texto: string, idioma: Idioma, elemento?: HTMLElement) {
  if (!temVoz) return;
  const nos = elemento ? nosDeTexto(elemento) : [];
  const bruto = nos.length > 0 ? nos.map((n) => n.no.data).join('') : texto;
  if (!/\p{L}/u.test(semSimbolos(bruto))) return;
  pararLeituraAtiva?.();
  limparDestaque();
  const minha = ++leituraSimples;
  window.speechSynthesis.cancel();
  const voz = escolherVoz(idioma);
  const podeMarcar = nos.length > 0 && 'highlights' in CSS;
  const pedacos = pedacosParaFalar(bruto, nos);

  const marcar = (posicao: number) => {
    if (!podeMarcar || minha !== leituraSimples) return;
    let fim = posicao;
    while (fim < bruto.length && !/\s/.test(bruto[fim])) fim++;
    const alvo = [...nos].reverse().find((n) => n.inicio <= posicao);
    if (!alvo || fim <= posicao) return;
    const faixa = new Range();
    faixa.setStart(alvo.no, posicao - alvo.inicio);
    faixa.setEnd(alvo.no, Math.min(fim - alvo.inicio, alvo.no.length));
    CSS.highlights.set(NOME_DESTAQUE, new Highlight(faixa));
  };

  const falarPedaco = (n: number) => {
    if (minha !== leituraSimples) return;
    if (n >= pedacos.length) {
      limparDestaque();
      falaSimples.atual = null;
      return;
    }
    const pedaco = pedacos[n];
    const fala = new SpeechSynthesisUtterance(pedaco.texto);
    falaSimples.atual = fala;
    fala.lang = idioma;
    fala.rate = VELOCIDADE;
    fala.pitch = PRESETS[PRESET_ATIVO].tom;
    if (voz) fala.voice = voz;
    const fimPedaco = pedaco.inicio + pedaco.texto.length;

    let recebeuMarcacao = false;
    // sem avisos do aparelho, a marca avança por um cálculo de tempo
    const avancarPorTempo = (posicao: number) => {
      window.clearTimeout(temporizadorSimples);
      if (minha !== leituraSimples) return;
      marcar(posicao);
      const resto = bruto.slice(posicao);
      const palavra = resto.match(/^\S+/)?.[0] ?? '';
      const proxima = resto.match(/^\S+\s+/)?.[0].length;
      if (!proxima || posicao + proxima >= fimPedaco) return;
      const ms = tempoDaPalavra(palavra) * (recebeuMarcacao ? 1.6 : 1);
      temporizadorSimples = window.setTimeout(() => avancarPorTempo(posicao + proxima), ms);
    };
    fala.onstart = () => avancarPorTempo(pedaco.inicio);
    fala.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      recebeuMarcacao = true;
      avancarPorTempo(pedaco.inicio + e.charIndex);
    };
    const seguinte = () => {
      if (minha !== leituraSimples) return;
      window.clearTimeout(temporizadorSimples);
      const pausa = pedacos[n + 1]?.pausaAntes ?? 0;
      if (pausa > 0) temporizadorSimples = window.setTimeout(() => falarPedaco(n + 1), pausa);
      else falarPedaco(n + 1);
    };
    fala.onend = seguinte;
    fala.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      seguinte();
    };
    window.speechSynthesis.speak(fala);
  };

  // o Chrome corta a fala nova se ela vier logo depois de um cancel()
  temporizadorSimples = window.setTimeout(() => falarPedaco(0), 150);
}

/** Tempo estimado para dizer uma palavra, quando o aparelho não avisa onde vai. */
function tempoDaPalavra(palavra: string): number {
  const pausa = /[.!?…:;,]$/.test(palavra) ? 250 : 0;
  return (220 + palavra.length * 70 + pausa) / VELOCIDADE;
}

/**
 * Mostra o texto com um botão "Ouvir". A voz do aparelho lê o texto na variante
 * certa (pt-PT ou pt-BR), frase a frase, e a palavra falada muda de cor. Se o
 * aparelho não avisar qual palavra está sendo dita, a cor avança por um cálculo
 * de tempo, sem nunca passar para a frase seguinte antes de a voz chegar lá.
 */
export function TextoNarrado({
  texto,
  idioma,
  className,
  compacto = false,
  lerAoAbrir = false,
  destacar,
}: {
  texto: string;
  idioma: Idioma;
  className?: string;
  compacto?: boolean;
  /** Começa a ler sozinho assim que aparece (ex.: depois de a criança acertar). */
  lerAoAbrir?: boolean;
  /** Palavra que fica sempre em destaque no texto (ex.: a palavra da imagem). */
  destacar?: string;
}) {
  const palavras = useMemo(() => separarPalavras(texto), [texto]);
  const frases = useMemo(() => separarFrases(texto, palavras), [texto, palavras]);
  const [atual, setAtual] = useState<number | null>(null);
  const temporizador = useRef<number | undefined>(undefined);
  /** Muda a cada leitura; avisos de uma leitura antiga são ignorados. */
  const leitura = useRef(0);
  /** Guarda a fala em curso (sem isto o Chrome pode perdê-la e nunca avisar o fim). */
  const falaAtual = useRef<SpeechSynthesisUtterance | null>(null);

  function parar() {
    leitura.current += 1;
    window.clearTimeout(temporizador.current);
    falaAtual.current = null;
    if (pararLeituraAtiva === parar) pararLeituraAtiva = null;
    if (temVoz) window.speechSynthesis.cancel();
    setAtual(null);
  }

  // para a leitura quando o texto muda ou a tela sai
  useEffect(() => parar, [texto]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lerAoAbrir) ler();
  }, [texto, lerAoAbrir]); // eslint-disable-line react-hooks/exhaustive-deps

  const palavraDestacada = destacar ? limparPontuacao(destacar) : null;

  function ler() {
    if (!temVoz || frases.length === 0) return;
    leituraSimples += 1;
    limparDestaque();
    if (pararLeituraAtiva && pararLeituraAtiva !== parar) pararLeituraAtiva();
    parar();
    pararLeituraAtiva = parar;
    const minhaLeitura = leitura.current;
    const voz = escolherVoz(idioma);

    const lerFrase = (n: number) => {
      if (leitura.current !== minhaLeitura) return;
      if (n >= frases.length) {
        parar();
        return;
      }
      const frase = frases[n];
      const falado = semSimbolos(frase.texto);
      // frase só com ícones: não há nada para dizer
      if (!/\p{L}/u.test(falado)) {
        lerFrase(n + 1);
        return;
      }
      const fala = new SpeechSynthesisUtterance(falado);
      falaAtual.current = fala;
      fala.lang = idioma;
      fala.rate = VELOCIDADE;
      fala.pitch = PRESETS[PRESET_ATIVO].tom;
      if (voz) fala.voice = voz;

      let recebeuMarcacao = false;
      // avança a cor por tempo, mas só até à última palavra desta frase
      const avancarPorTempo = (i: number) => {
        window.clearTimeout(temporizador.current);
        if (leitura.current !== minhaLeitura) return;
        setAtual(i);
        if (i >= frase.ultima) return;
        // com marcações, o tempo é só uma rede de segurança: espera um pouco mais
        const ms = tempoDaPalavra(palavras[i].texto) * (recebeuMarcacao ? 1.6 : 1);
        temporizador.current = window.setTimeout(() => avancarPorTempo(i + 1), ms);
      };

      fala.onstart = () => avancarPorTempo(frase.primeira);
      fala.onboundary = (e) => {
        if (leitura.current !== minhaLeitura) return;
        if (e.name && e.name !== 'word') return;
        recebeuMarcacao = true;
        const posicao = frase.inicio + e.charIndex;
        let indice = frase.primeira;
        for (let i = frase.primeira; i <= frase.ultima; i++) {
          if (palavras[i].inicio <= posicao) indice = i;
        }
        avancarPorTempo(indice);
      };
      fala.onend = () => {
        if (leitura.current !== minhaLeitura) return;
        window.clearTimeout(temporizador.current);
        // depois de uma quebra de linha (novo parágrafo), uma pequena pausa
        if (palavras[frase.ultima].quebra && n + 1 < frases.length) {
          temporizador.current = window.setTimeout(() => lerFrase(n + 1), PAUSA_ENTRE_BLOCOS);
        } else {
          lerFrase(n + 1);
        }
      };
      fala.onerror = (e) => {
        if (leitura.current !== minhaLeitura) return;
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        parar();
      };
      window.speechSynthesis.speak(fala);
    };

    // o Chrome corta a fala nova se ela vier logo depois de um cancel()
    temporizador.current = window.setTimeout(() => lerFrase(0), 150);
  }

  return (
    <div className={`texto-narrado ${compacto ? 'texto-narrado-linha' : ''}`}>
      <p
        className={[className, temVoz ? 'texto-tocavel' : ''].filter(Boolean).join(' ')}
        lang={idioma}
        onClick={temVoz ? ler : undefined}
      >
        {palavras.map((p, i) => (
          <span
            key={i}
            className={
              [
                i === atual ? 'palavra-lida' : '',
                palavraDestacada && limparPontuacao(p.texto) === palavraDestacada ? 'palavra-destacada' : '',
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
          >
            {p.texto}{' '}
            {p.quebra && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}
