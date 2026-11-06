import type { Idioma } from './idioma';
import { hashTexto } from './hashTexto';
import config from './vozes-narrador.json';

/**
 * Narração com áudio de vozes escolhidas (em vez da voz do aparelho).
 *
 * Cada fala tem um arquivo `audio/<variante>/<voz>/t/<hash do texto>.mp3`. No servidor de testes
 * (`npm run servidor`), se o arquivo ainda não existe, ele é gerado na hora com o Piper e fica guardado
 * em `public/audio/`. Se o áudio não puder ser tocado, a fala cai na voz do aparelho.
 * A troca de voz só aparece no servidor de testes (veja SeletorVoz).
 */

export interface VozNarrador {
  id: string;
  nome: string;
  variante: Idioma;
}

export const VOZES_NARRADOR = config.vozes as VozNarrador[];

/** Uma fala a ser dita, com avisos parecidos com os da voz do aparelho (SpeechSynthesisUtterance). */
export interface FalaNarrada {
  onstart: (() => void) | null;
  /** `charIndex` é a posição, no texto da fala, da palavra que começa agora. */
  onboundary: ((e: { name?: string; charIndex: number }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  falar(): void;
}

export interface OpcoesAparelho {
  rate: number;
  pitch: number;
  voz?: SpeechSynthesisVoice;
}

// ---------- voz escolhida ----------

const CHAVE = 'bau-de-jogos:voz-narrador';

function lerEscolhas(): Partial<Record<Idioma, string>> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}');
  } catch {
    return {};
  }
}

export function vozesDaVariante(idioma: Idioma): VozNarrador[] {
  return VOZES_NARRADOR.filter((v) => v.variante === idioma);
}

/** Voz de áudio escolhida para a variante, ou null para usar a voz do aparelho. */
export function vozEscolhida(idioma: Idioma): VozNarrador | null {
  if (!import.meta.env.DEV) return null;
  const id = lerEscolhas()[idioma];
  return vozesDaVariante(idioma).find((v) => v.id === id) ?? null;
}

export function escolherVozNarrador(idioma: Idioma, id: string | null): void {
  const escolhas = lerEscolhas();
  if (id) escolhas[idioma] = id;
  else delete escolhas[idioma];
  try {
    localStorage.setItem(CHAVE, JSON.stringify(escolhas));
  } catch {
    // sem armazenamento: a escolha vale só até recarregar
  }
}

// ---------- falas ----------

let falaAtual: { parar(): void } | null = null;

/** Interrompe qualquer fala em curso, de áudio ou do aparelho. */
export function cancelarFala(): void {
  falaAtual?.parar();
  falaAtual = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

class FalaAparelho implements FalaNarrada {
  onstart: FalaNarrada['onstart'] = null;
  onboundary: FalaNarrada['onboundary'] = null;
  onend: FalaNarrada['onend'] = null;
  onerror: FalaNarrada['onerror'] = null;
  /** Guardado para o Chrome não perder a fala (sem isto ele pode nunca avisar o fim). */
  enunciado: SpeechSynthesisUtterance | null = null;

  constructor(
    private texto: string,
    private idioma: Idioma,
    private opcoes: OpcoesAparelho,
  ) {}

  falar() {
    const u = new SpeechSynthesisUtterance(this.texto);
    u.lang = this.idioma;
    u.rate = this.opcoes.rate;
    u.pitch = this.opcoes.pitch;
    if (this.opcoes.voz) u.voice = this.opcoes.voz;
    u.onstart = () => this.onstart?.();
    u.onboundary = (e) => this.onboundary?.({ name: e.name, charIndex: e.charIndex });
    u.onend = () => this.onend?.();
    u.onerror = (e) => this.onerror?.({ error: e.error });
    this.enunciado = u;
    window.speechSynthesis.speak(u);
  }
}

class FalaAudio implements FalaNarrada {
  onstart: FalaNarrada['onstart'] = null;
  onboundary: FalaNarrada['onboundary'] = null;
  onend: FalaNarrada['onend'] = null;
  onerror: FalaNarrada['onerror'] = null;
  private audio: HTMLAudioElement | null = null;
  private quadro = 0;
  private parada = false;

  constructor(
    private texto: string,
    private idioma: Idioma,
    private voz: VozNarrador,
    private opcoes: OpcoesAparelho,
  ) {}

  falar() {
    const url = `${import.meta.env.BASE_URL}audio/${this.idioma}/${this.voz.id}/t/${hashTexto(this.texto)}.mp3?t=${encodeURIComponent(this.texto)}`;
    const audio = new Audio(url);
    this.audio = audio;
    falaAtual = this;

    // palavras e o momento aproximado em que cada uma começa (proporcional ao tamanho)
    const palavras = [...this.texto.matchAll(/\S+/g)].map((m) => ({ inicio: m.index ?? 0, peso: m[0].length + 2 }));
    const total = palavras.reduce((s, p) => s + p.peso, 0);
    let ultima = -1;
    const acompanhar = () => {
      if (this.parada || !this.audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        this.quadro = requestAnimationFrame(acompanhar);
        return;
      }
      const fracao = audio.currentTime / audio.duration;
      let acumulado = 0;
      let indice = 0;
      for (let i = 0; i < palavras.length; i++) {
        if (fracao * total >= acumulado) indice = i;
        acumulado += palavras[i].peso;
      }
      if (indice !== ultima) {
        ultima = indice;
        this.onboundary?.({ name: 'word', charIndex: palavras[indice].inicio });
      }
      this.quadro = requestAnimationFrame(acompanhar);
    };

    let comecou = false;
    let caiu = false;
    const cair = () => {
      // sem áudio (arquivo ausente, Piper indisponível...): usa a voz do aparelho
      if (this.parada || comecou || caiu) return;
      caiu = true;
      this.parar();
      this.parada = false;
      if (!('speechSynthesis' in window)) {
        this.onerror?.({ error: 'audio-indisponivel' });
        return;
      }
      const reserva = new FalaAparelho(this.texto, this.idioma, this.opcoes);
      reserva.onstart = this.onstart;
      reserva.onboundary = this.onboundary;
      reserva.onend = this.onend;
      reserva.onerror = this.onerror;
      reserva.falar();
    };

    audio.onplaying = () => {
      if (comecou) return;
      comecou = true;
      this.onstart?.();
      this.quadro = requestAnimationFrame(acompanhar);
    };
    audio.onended = () => {
      cancelAnimationFrame(this.quadro);
      if (!this.parada) this.onend?.();
    };
    audio.onerror = cair;
    audio.play().catch(cair);
  }

  parar() {
    this.parada = true;
    cancelAnimationFrame(this.quadro);
    if (this.audio) {
      this.audio.onplaying = this.audio.onended = this.audio.onerror = null;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
  }
}

/** Cria a fala com a voz escolhida para a variante; sem escolha, com a voz do aparelho. */
export function criarFala(texto: string, idioma: Idioma, opcoes: OpcoesAparelho): FalaNarrada {
  const voz = vozEscolhida(idioma);
  return voz ? new FalaAudio(texto, idioma, voz, opcoes) : new FalaAparelho(texto, idioma, opcoes);
}
