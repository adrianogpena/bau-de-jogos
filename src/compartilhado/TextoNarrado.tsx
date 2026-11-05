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

const NOME_DESTAQUE = 'palavra-lida-global';

function limparDestaque() {
  window.clearTimeout(temporizadorSimples);
  if ('highlights' in CSS) CSS.highlights.delete(NOME_DESTAQUE);
}

/** Pedaços de texto de um elemento, com a posição de cada um no texto inteiro. */
function nosDeTexto(el: HTMLElement): { no: Text; inicio: number }[] {
  const nos: { no: Text; inicio: number }[] = [];
  const passeio = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let inicio = 0;
  for (let no = passeio.nextNode(); no; no = passeio.nextNode()) {
    nos.push({ no: no as Text, inicio });
    inicio += (no as Text).length;
  }
  return nos;
}

/**
 * Leitura de um texto qualquer da tela (leitura global). Com o elemento, a palavra falada
 * é marcada no próprio texto (CSS Custom Highlight), sem mexer na estrutura da página.
 */
export function falarTexto(texto: string, idioma: Idioma, elemento?: HTMLElement) {
  if (!temVoz) return;
  const nos = elemento ? nosDeTexto(elemento) : [];
  const bruto = nos.length > 0 ? nos.map((n) => n.no.data).join('') : texto;
  if (!bruto.trim()) return;
  pararLeituraAtiva?.();
  limparDestaque();
  const minha = ++leituraSimples;
  window.speechSynthesis.cancel();
  const voz = escolherVoz(idioma);
  const podeMarcar = nos.length > 0 && 'highlights' in CSS;

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

  // o Chrome corta a fala nova se ela vier logo depois de um cancel()
  window.setTimeout(() => {
    if (minha !== leituraSimples) return;
    const pedacos = [...bruto.matchAll(/[^.!?…:;]+[.!?…:;]*["'”»)]*\s*/g)];
    pedacos.forEach((m, n) => {
      const inicioPedaco = m.index ?? 0;
      if (!/\p{L}/u.test(m[0])) return;
      const fala = new SpeechSynthesisUtterance(m[0].trim());
      const deslocamento = m[0].length - m[0].trimStart().length;
      fala.lang = idioma;
      fala.rate = VELOCIDADE;
      fala.pitch = PRESETS[PRESET_ATIVO].tom;
      if (voz) fala.voice = voz;

      let recebeuMarcacao = false;
      // sem avisos do aparelho, a marca avança por um cálculo de tempo
      const avancarPorTempo = (posicao: number) => {
        window.clearTimeout(temporizadorSimples);
        if (minha !== leituraSimples) return;
        marcar(posicao);
        const resto = bruto.slice(posicao);
        const palavra = resto.match(/^\S+/)?.[0] ?? '';
        const proxima = resto.match(/^\S+\s+/)?.[0].length;
        if (!proxima || posicao + proxima >= inicioPedaco + m[0].length) return;
        const ms = tempoDaPalavra(palavra) * (recebeuMarcacao ? 1.6 : 1);
        temporizadorSimples = window.setTimeout(() => avancarPorTempo(posicao + proxima), ms);
      };
      fala.onstart = () => avancarPorTempo(inicioPedaco + deslocamento);
      fala.onboundary = (e) => {
        if (e.name && e.name !== 'word') return;
        recebeuMarcacao = true;
        avancarPorTempo(inicioPedaco + deslocamento + e.charIndex);
      };
      if (n === pedacos.length - 1 || pedacos.slice(n + 1).every((x) => !/\p{L}/u.test(x[0]))) {
        fala.onend = () => {
          if (minha === leituraSimples) limparDestaque();
        };
      }
      window.speechSynthesis.speak(fala);
    });
  }, 150);
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
      const fala = new SpeechSynthesisUtterance(frase.texto);
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
        lerFrase(n + 1);
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
