import { useState } from 'react';
import { t } from '../../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import type { EnigmaCodigo } from '../tipos';
import { type PropsEnigma, TEXTOS_ENIGMA } from './tipos';

/** Cadeado com teclado numérico grande. */
export function Codigo({ enigma, idioma, aoAcertar }: PropsEnigma<EnigmaCodigo>) {
  const [digitos, setDigitos] = useState('');
  const [errou, setErrou] = useState(false);
  const tamanho = enigma.resposta.length;

  function verificar() {
    if (digitos === enigma.resposta) {
      somAcerto();
      aoAcertar();
    } else {
      somTentarDeNovo();
      setErrou(true);
      setDigitos('');
    }
  }

  return (
    <div className="enigma enigma-codigo">
      <div className="visor-codigo" aria-live="polite">
        {Array.from({ length: tamanho }, (_, i) => (
          <span key={i} className="digito-codigo">
            {digitos[i] ?? '·'}
          </span>
        ))}
      </div>
      {errou && <p className="mensagem">{t(TEXTOS_ENIGMA.tenteDeNovo, idioma)}</p>}
      <div className="teclado-codigo">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            className="botao botao-secundario"
            onClick={() => {
              setErrou(false);
              setDigitos((atual) => (atual.length < tamanho ? atual + d : atual));
            }}
          >
            {d}
          </button>
        ))}
        <button className="botao botao-secundario" onClick={() => setDigitos((a) => a.slice(0, -1))}>
          ⌫
        </button>
        <button
          className="botao botao-secundario"
          onClick={() => {
            setErrou(false);
            setDigitos((atual) => (atual.length < tamanho ? atual + '0' : atual));
          }}
        >
          0
        </button>
        <button className="botao" disabled={digitos.length < tamanho} onClick={verificar}>
          {t(TEXTOS_ENIGMA.abrir, idioma)}
        </button>
      </div>
    </div>
  );
}
