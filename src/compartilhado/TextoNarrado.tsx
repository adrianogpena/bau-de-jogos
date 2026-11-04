import { useEffect, useMemo, useRef, useState } from 'react';
import type { Idioma, TextoPorIdioma } from './idioma';
import { t } from './idioma';

const TEXTOS = {
  ouvir: { 'pt-PT': 'Ouvir', 'pt-BR': 'Ouvir' },
  parar: { 'pt-PT': 'Parar', 'pt-BR': 'Parar' },
} satisfies Record<string, TextoPorIdioma>;

/** Velocidade calma, boa para crianças que estão aprendendo a ler. */
const VELOCIDADE = 0.75;

const temVoz = typeof window !== 'undefined' && 'speechSynthesis' in window;

interface Palavra {
  texto: string;
  inicio: number;
  /** Há uma quebra de linha depois desta palavra. */
  quebra: boolean;
}

function separarPalavras(texto: string): Palavra[] {
  return [...texto.matchAll(/\S+(\s*)/g)].map((m) => ({
    texto: m[0].trimEnd(),
    inicio: m.index ?? 0,
    quebra: m[1].includes('\n'),
  }));
}

/**
 * Mostra o texto com um botão "Ouvir". A voz do aparelho lê o texto na variante
 * certa (pt-PT ou pt-BR) e a palavra falada muda de cor. Se o aparelho não avisar
 * qual palavra está sendo dita, a cor avança por um cálculo de tempo.
 */
export function TextoNarrado({ texto, idioma, className, compacto = false }: { texto: string; idioma: Idioma; className?: string; compacto?: boolean }) {
  const palavras = useMemo(() => separarPalavras(texto), [texto]);
  const [atual, setAtual] = useState<number | null>(null);
  const [lendo, setLendo] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  function parar() {
    window.clearTimeout(temporizador.current);
    if (temVoz) window.speechSynthesis.cancel();
    setLendo(false);
    setAtual(null);
  }

  // para a leitura quando o texto muda ou a tela sai
  useEffect(() => parar, [texto]); // eslint-disable-line react-hooks/exhaustive-deps

  function ler() {
    if (!temVoz) return;
    parar();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = idioma;
    fala.rate = VELOCIDADE;
    const voz = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.replace('_', '-').toLowerCase() === idioma.toLowerCase());
    if (voz) fala.voice = voz;

    let recebeuMarcacao = false;
    const avancarPorTempo = (i: number) => {
      if (recebeuMarcacao || i >= palavras.length) return;
      setAtual(i);
      const ms = (250 + palavras[i].texto.length * 75) / VELOCIDADE;
      temporizador.current = window.setTimeout(() => avancarPorTempo(i + 1), ms);
    };

    fala.onstart = () => {
      setLendo(true);
      setAtual(0);
      // se em meio segundo nenhuma marcação chegar, usa o cálculo de tempo
      temporizador.current = window.setTimeout(() => avancarPorTempo(0), 500);
    };
    fala.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      recebeuMarcacao = true;
      window.clearTimeout(temporizador.current);
      let indice = 0;
      palavras.forEach((p, i) => {
        if (p.inicio <= e.charIndex) indice = i;
      });
      setAtual(indice);
    };
    fala.onend = parar;
    fala.onerror = parar;
    window.speechSynthesis.speak(fala);
  }

  return (
    <div className={`texto-narrado ${compacto ? 'texto-narrado-linha' : ''}`}>
      <p className={className} lang={idioma}>
        {palavras.map((p, i) => (
          <span key={i} className={i === atual ? 'palavra-lida' : undefined}>
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
