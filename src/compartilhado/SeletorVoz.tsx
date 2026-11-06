import { useState } from 'react';
import type { Idioma } from './idioma';
import { escolherVozNarrador, vozEscolhida, vozesDaVariante } from './narradorAudio';

/**
 * Troca da voz do narrador, para testar. Só aparece no servidor de testes (`npm run servidor`):
 * as vozes de áudio são geradas ali na hora com o Piper. A escolha vale para todos os textos do app.
 */
export function SeletorVoz({ idioma }: { idioma: Idioma }) {
  const [, atualizar] = useState(0);
  const vozes = vozesDaVariante(idioma);
  if (!import.meta.env.DEV || vozes.length === 0) return null;
  const escolhida = vozEscolhida(idioma)?.id ?? null;

  function escolher(id: string | null) {
    escolherVozNarrador(idioma, id);
    atualizar((n) => n + 1);
  }

  return (
    <div className="seletor-idioma seletor-voz" role="group" aria-label="Voz">
      <span className="seletor-voz-rotulo">Voz</span>
      <button
        className={escolhida === null ? 'botao botao-ativo' : 'botao botao-secundario'}
        onClick={() => escolher(null)}
        aria-pressed={escolhida === null}
      >
        Aparelho
      </button>
      {vozes.map((voz) => (
        <button
          key={voz.id}
          className={escolhida === voz.id ? 'botao botao-ativo' : 'botao botao-secundario'}
          onClick={() => escolher(voz.id)}
          aria-pressed={escolhida === voz.id}
        >
          {voz.nome}
        </button>
      ))}
    </div>
  );
}
