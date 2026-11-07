import type { Idioma } from './idioma';
import { hashTexto } from './hashTexto';
import { pecasDaFala } from './pecasDaFala';
import config from './vozes-narrador.json';

/**
 * Narração com a voz de áudio da variante (Tugão em pt-PT, Faber em pt-BR), em vez da voz do aparelho.
 *
 * Cada fala tem um arquivo `audio/<variante>/<voz>/t/<hash do texto>.mp3`. No servidor de testes
 * (`npm run servidor`), se o arquivo ainda não existe, ele é gerado na hora com o Piper e fica guardado
 * em `public/audio/`. Se o áudio não puder ser tocado, a fala cai na voz do aparelho.
 * No app publicado só existem os áudios já gerados (textos fixos do site; números de 0 a 100 e nomes têm áudio próprio, ver pecasDaFala.ts); o resto fica com a voz do aparelho.
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

// ---------- voz do narrador ----------

/** Voz de áudio da variante (a primeira da lista), ou null para usar a voz do aparelho. */
export function vozEscolhida(idioma: Idioma): VozNarrador | null {
  return VOZES_NARRADOR.find((v) => v.variante === idioma) ?? null;
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
    falaAtual = this;
    // pedaços tocados em sequência: os números têm áudio próprio (ver pecasDaFala)
    const pecas = pecasDaFala(this.texto, this.idioma);
    if (pecas.length === 0) {
      this.onend?.();
      return;
    }
    const pesos = pecas.map((p) => p.length + 2);
    const pesoTotal = pesos.reduce((s, p) => s + p, 0);

    // palavras do texto e o momento aproximado em que cada uma começa (proporcional ao tamanho)
    const palavras = [...this.texto.matchAll(/\S+/g)].map((m) => ({ inicio: m.index ?? 0, peso: m[0].length + 2 }));
    const totalPalavras = palavras.reduce((s, p) => s + p.peso, 0);
    let ultima = -1;
    let indicePeca = 0;
    let pesoAntes = 0;
    const acompanhar = () => {
      const audio = this.audio;
      if (this.parada || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        this.quadro = requestAnimationFrame(acompanhar);
        return;
      }
      const fracao = (pesoAntes + (audio.currentTime / audio.duration) * pesos[indicePeca]) / pesoTotal;
      let acumulado = 0;
      let indice = 0;
      for (let i = 0; i < palavras.length; i++) {
        if (fracao * totalPalavras >= acumulado) indice = i;
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
    const cair = (i: number) => {
      // sem áudio (arquivo ausente, Piper indisponível...): o que falta é dito pela voz do aparelho
      if (this.parada || caiu) return;
      caiu = true;
      this.parar();
      this.parada = false;
      cancelAnimationFrame(this.quadro);
      if (!('speechSynthesis' in window)) {
        this.onerror?.({ error: 'audio-indisponivel' });
        return;
      }
      const resto = i === 0 ? this.texto : pecas.slice(i).join(' ');
      const reserva = new FalaAparelho(resto, this.idioma, this.opcoes);
      reserva.onstart = comecou ? null : this.onstart;
      reserva.onboundary = i === 0 ? this.onboundary : null;
      reserva.onend = this.onend;
      reserva.onerror = this.onerror;
      reserva.falar();
    };

    const tocar = (i: number) => {
      indicePeca = i;
      const texto = pecas[i];
      const url = `${import.meta.env.BASE_URL}audio/${this.idioma}/${this.voz.id}/t/${hashTexto(texto)}.mp3?t=${encodeURIComponent(texto)}`;
      const audio = new Audio(url);
      this.audio = audio;
      audio.onplaying = () => {
        if (comecou) return;
        comecou = true;
        this.onstart?.();
        this.quadro = requestAnimationFrame(acompanhar);
      };
      audio.onended = () => {
        if (this.parada) return;
        pesoAntes += pesos[i];
        if (i + 1 < pecas.length) {
          tocar(i + 1);
        } else {
          cancelAnimationFrame(this.quadro);
          this.onend?.();
        }
      };
      audio.onerror = () => cair(i);
      audio.play().catch(() => cair(i));
    };
    tocar(0);
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
