import { useState } from 'react';
import { type Idioma, t } from './idioma';
import { escolherVozNarrador, vozEscolhida, vozesDaVariante } from './narradorAudio';

/**
 * Troca da voz do narrador, para testar. No servidor de testes (`npm run servidor`) as vozes valem para
 * qualquer texto (geradas na hora com o Piper). No app publicado só as histórias de escrita e leitura
 * têm áudio pronto; o resto continua na voz do aparelho.
 */
const AVISO = {
  'pt-PT': 'Vozes de teste: só nas histórias de Escrever e Ler palavras.',
  'pt-BR': 'Vozes de teste: só nas histórias de Escrever e Ler palavras.',
};

export function SeletorVoz({ idioma }: { idioma: Idioma }) {
  const [, atualizar] = useState(0);
  const vozes = vozesDaVariante(idioma);
  if (vozes.length === 0) return null;
  const escolhida = vozEscolhida(idioma)?.id ?? null;

  function escolher(id: string | null) {
    escolherVozNarrador(idioma, id);
    atualizar((n) => n + 1);
  }

  return (
    <div className="seletor-voz-bloco">
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
      {!import.meta.env.DEV && <p className="seletor-voz-aviso">{t(AVISO, idioma)}</p>}
    </div>
  );
}
