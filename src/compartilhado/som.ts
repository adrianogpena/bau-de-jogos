/** Sons simples de acerto e de tentar de novo (sem arquivos de áudio). */
let contexto: AudioContext | null = null;

function tocar(notas: number[]): void {
  try {
    contexto ??= new AudioContext();
    const ctx = contexto;
    notas.forEach((frequencia, i) => {
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      const inicio = ctx.currentTime + i * 0.15;
      osc.frequency.value = frequencia;
      ganho.gain.setValueAtTime(0.15, inicio);
      ganho.gain.exponentialRampToValueAtTime(0.001, inicio + 0.14);
      osc.connect(ganho).connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.15);
    });
  } catch {
    // sem áudio disponível: o feedback visual basta
  }
}

export const somAcerto = () => tocar([523, 659, 784]);
/** Som suave e curto: sem punição dura. */
export const somTentarDeNovo = () => tocar([392, 349]);
