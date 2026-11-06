import { useState } from 'react';
import { t } from '../../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import type { EnigmaEscolha } from '../tipos';
import { type PropsEnigma, TEXTOS_ENIGMA } from './tipos';
import { comIcones } from '../../../compartilhado/icones';

/** Escolher a opção certa; as erradas ficam apagadas, sem punição. */
export function Escolha({ enigma, idioma, aoAcertar }: PropsEnigma<EnigmaEscolha>) {
  const [erradas, setErradas] = useState<number[]>([]);

  function escolher(i: number) {
    if (i === enigma.certa) {
      somAcerto();
      aoAcertar();
    } else {
      somTentarDeNovo();
      setErradas((e) => [...e, i]);
    }
  }

  return (
    <div className="enigma">
      {erradas.length > 0 && <p className="mensagem">{t(TEXTOS_ENIGMA.tenteDeNovo, idioma)}</p>}
      <div className="grade-opcoes">
        {enigma.opcoes.map((opcao, i) => (
          <button
            key={i}
            className="botao botao-secundario botao-opcao"
            disabled={erradas.includes(i)}
            onClick={() => escolher(i)}
          >
            <span className="emoji-opcao" aria-hidden="true">
              {comIcones(opcao.emoji)}
            </span>
            {t(opcao.nome, idioma)}
          </button>
        ))}
      </div>
    </div>
  );
}
