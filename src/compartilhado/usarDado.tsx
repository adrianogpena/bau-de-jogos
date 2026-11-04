import { useEffect, useRef, useState } from 'react';
import { type LadosDado, rolarDado } from './dados';

/** Dado animado: mostra números a girar e entrega o resultado no fim. */
export function usarDado() {
  const [valor, setValor] = useState<number | null>(null);
  const [lados, setLados] = useState<LadosDado>(20);
  const [rolando, setRolando] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(temporizador.current), []);

  function rolar(novosLados: LadosDado): Promise<number> {
    return new Promise((resolver) => {
      const final = rolarDado(novosLados);
      let passos = 0;
      setLados(novosLados);
      setRolando(true);
      window.clearInterval(temporizador.current);
      temporizador.current = window.setInterval(() => {
        passos++;
        if (passos >= 10) {
          window.clearInterval(temporizador.current);
          setValor(final);
          setRolando(false);
          resolver(final);
        } else {
          setValor(rolarDado(novosLados));
        }
      }, 70);
    });
  }

  return { valor, lados, rolando, rolar };
}

/** Desenho do dado na tela. */
export function Dado({ valor, lados, rolando }: { valor: number | null; lados: LadosDado; rolando: boolean }) {
  return (
    <div className={`dado ${rolando ? 'dado-rolando' : ''}`} aria-live="polite">
      <span className="dado-lados">d{lados}</span>
      <span className="dado-valor">{valor ?? '?'}</span>
    </div>
  );
}
