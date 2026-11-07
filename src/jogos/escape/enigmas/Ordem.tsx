import { useState } from 'react';
import { t } from '../../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import type { EnigmaOrdem } from '../tipos';
import { type PropsEnigma, TEXTOS_ENIGMA, embaralhar } from './tipos';
import { comIcones } from '../../../compartilhado/icones';

/** Tocar nos símbolos pela ordem certa. */
export function Ordem({ enigma, idioma, aoAcertar }: PropsEnigma<EnigmaOrdem>) {
  // posições embaralhadas (índices em `itens`), garantindo que não começa já resolvido
  const [baralho] = useState(() => {
    const indices = enigma.itens.map((_, i) => i);
    let b = embaralhar(indices);
    while (enigma.itens.length > 1 && b.every((v, i) => v === i)) b = embaralhar(indices);
    return b;
  });
  const [escolhidos, setEscolhidos] = useState<number[]>([]);
  const [errou, setErrou] = useState(false);

  function tocar(indice: number) {
    if (escolhidos.includes(indice)) return;
    setErrou(false);
    const novos = [...escolhidos, indice];
    setEscolhidos(novos);
    if (novos.length < enigma.itens.length) return;
    if (novos.every((v, i) => v === i)) {
      somAcerto();
      aoAcertar();
    } else {
      somTentarDeNovo();
      setErrou(true);
      window.setTimeout(() => setEscolhidos([]), 700);
    }
  }

  return (
    <div className="enigma">
      <div className="fila-ordem" aria-label={t(TEXTOS_ENIGMA.ordem, idioma)}>
        {enigma.itens.map((_, posicao) => (
          <span key={posicao} className={`casa-ordem ${errou ? 'casa-erro' : ''}`}>
            {escolhidos[posicao] !== undefined ? comIcones(enigma.itens[escolhidos[posicao]]) : posicao + 1}
          </span>
        ))}
      </div>
      {errou && <p className="mensagem">{t(TEXTOS_ENIGMA.tenteDeNovo, idioma)}</p>}
      <div className="fila-ordem">
        {baralho.map((indice) => (
          <button
            key={indice}
            className="botao botao-secundario botao-simbolo"
            disabled={escolhidos.includes(indice)}
            onClick={() => tocar(indice)}
          >
            {comIcones(enigma.itens[indice])}
          </button>
        ))}
      </div>
    </div>
  );
}
