import { useEffect, useMemo, useRef, useState } from 'react';
import type { Idioma, TextoPorIdioma } from './idioma';
import { t } from './idioma';

const TEXTOS = {
  ouvir: { 'pt-PT': 'Ouvir', 'pt-BR': 'Ouvir' },
  parar: { 'pt-PT': 'Parar', 'pt-BR': 'Parar' },
} satisfies Record<string, TextoPorIdioma>;

/**
 * Presets de voz. Para voltar ao anterior, troque PRESET_ATIVO por 'anterior'.
 * - anterior: velocidade 0.9, qualquer voz portuguesa da variante, preferência leve por nomes "naturais".
 * - natural: voz neural/online da variante em primeiro lugar, tom e ritmo mais suaves.
 */
const PRESETS: Record<
  string,
  { velocidade: number; tom: number; bonusVozBoa: number; vozPreferida?: Partial<Record<Idioma, string>> }
> = {
  anterior: { velocidade: 0.9, tom: 1, bonusVozBoa: 5 },
  natural: {
    velocidade: 0.95,
    tom: 1.05,
    bonusVozBoa: 50,
    vozPreferida: { 'pt-BR': 'Thalita', 'pt-PT': 'Raquel' },
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
    const preferida = PRESETS[PRESET_ATIVO].vozPreferida?.[idioma];
    if (preferida && v.name.includes(preferida)) pontos += 200;
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
  const [lendo, setLendo] = useState(false);
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
    setLendo(false);
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
    if (pararLeituraAtiva && pararLeituraAtiva !== parar) pararLeituraAtiva();
    parar();
    pararLeituraAtiva = parar;
    const minhaLeitura = leitura.current;
    const voz = escolherVoz(idioma);
    setLendo(true);

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
      <p className={className} lang={idioma}>
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
      {temVoz && (
        <button
          className="botao botao-secundario"
          onClick={lendo ? parar : ler}
          aria-label={t(lendo ? TEXTOS.parar : TEXTOS.ouvir, idioma)}
        >
          {lendo ? '⏹️' : '🔊'}
          {!compacto && ` ${t(lendo ? TEXTOS.parar : TEXTOS.ouvir, idioma)}`}
        </button>
      )}
    </div>
  );
}
