import { useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, t } from '../../compartilhado/idioma';
import { MotorSala } from './MotorSala';
import { lerEstrelas } from './progresso';
import { SALAS } from './salas';
import type { Sala } from './tipos';
import { Icone, comIcones } from '../../compartilhado/icones';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  titulo: { 'pt-PT': 'Escolhe uma sala!', 'pt-BR': 'Escolha uma sala!' },
  instrucao: {
    'pt-PT': 'Toca nos objetos, resolve os enigmas e descobre o código para escapar.',
    'pt-BR': 'Toque nos objetos, resolva os enigmas e descubra o código para escapar.',
  },
} satisfies Record<string, TextoPorIdioma>;

/** Jogo de escape room: escolher a sala e jogar. As salas ficam em `salas/`. */
export function Escape({ idioma, aoVoltar }: PropsJogo) {
  const [sala, setSala] = useState<Sala | null>(null);
  const estrelas = lerEstrelas();

  if (sala) return <MotorSala key={sala.id} sala={sala} idioma={idioma} aoSair={() => setSala(null)} />;

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>
      <h1><Icone id="menu/jogo-escape" /> {t(TEXTOS.titulo, idioma)}</h1>
      <p>{t(TEXTOS.instrucao, idioma)}</p>
      <div className="grade-jogos">
        {SALAS.map((s) => (
          <button key={s.id} className="cartao-jogo cartao-historia" onClick={() => setSala(s)}>
            <span className="emoji-grande" aria-hidden="true">
              {comIcones(s.emoji)}
            </span>
            <strong>{t(s.titulo, idioma)}</strong>
            <small>{t(s.resumo, idioma)}</small>
            {estrelas[s.id] ? <span className="estrelas">{comIcones('⭐'.repeat(estrelas[s.id]))}</span> : null}
          </button>
        ))}
      </div>
    </main>
  );
}
