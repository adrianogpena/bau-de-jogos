import { useEffect, useRef, useState } from 'react';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import type { EnigmaPares } from '../tipos';
import { type PropsEnigma, embaralhar } from './tipos';
import { comIcones } from '../../../compartilhado/icones';

/** Jogo da memória: virar duas cartas de cada vez até achar todos os pares. */
export function Pares({ enigma, aoAcertar }: PropsEnigma<EnigmaPares>) {
  // cada carta guarda o índice do seu par: iguais ('🧸', '🧸') ou associadas ('⚽', '🥅')
  const [cartas] = useState(() =>
    embaralhar(enigma.emojis.flatMap((e, par) => (typeof e === 'string' ? [e, e] : e).map((emoji) => ({ emoji, par })))),
  );
  const [viradas, setViradas] = useState<number[]>([]);
  const [achadas, setAchadas] = useState<number[]>([]);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  function virar(i: number) {
    if (viradas.length >= 2 || viradas.includes(i) || achadas.includes(i)) return;
    const novas = [...viradas, i];
    setViradas(novas);
    if (novas.length < 2) return;
    const [a, b] = novas;
    if (cartas[a].par === cartas[b].par) {
      somAcerto();
      const todas = [...achadas, a, b];
      setAchadas(todas);
      setViradas([]);
      if (todas.length === cartas.length) temporizador.current = window.setTimeout(aoAcertar, 600);
    } else {
      somTentarDeNovo();
      temporizador.current = window.setTimeout(() => setViradas([]), 800);
    }
  }

  return (
    <div className="enigma">
      <div className="grade-memoria">
        {cartas.map(({ emoji }, i) => {
          const aberta = viradas.includes(i) || achadas.includes(i);
          return (
            <button
              key={i}
              className={`carta-memoria ${aberta ? 'carta-aberta' : ''} ${achadas.includes(i) ? 'carta-achada' : ''}`}
              onClick={() => virar(i)}
              aria-label={aberta ? emoji : '?'}
            >
              {comIcones(aberta ? emoji : '❔')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
