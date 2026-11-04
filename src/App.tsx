import { useState } from 'react';
import { IDIOMAS, type Idioma, idiomaInicial, salvarIdioma, t } from './compartilhado/idioma';
import { JOGOS } from './jogos/registro';

const TITULO = { 'pt-PT': 'Jogos Infantis', 'pt-BR': 'Jogos Infantis' };
const ESCOLHA_JOGO = {
  'pt-PT': 'Escolhe um jogo!',
  'pt-BR': 'Escolha um jogo!',
};

export function App() {
  const [idioma, setIdioma] = useState<Idioma>(idiomaInicial);
  const [jogoAtualId, setJogoAtualId] = useState<string | null>(null);

  function mudarIdioma(novo: Idioma) {
    setIdioma(novo);
    salvarIdioma(novo);
    document.documentElement.lang = novo;
  }

  const jogoAtual = JOGOS.find((jogo) => jogo.id === jogoAtualId);

  if (jogoAtual) {
    const Componente = jogoAtual.componente;
    return <Componente idioma={idioma} aoVoltar={() => setJogoAtualId(null)} />;
  }

  return (
    <main className="tela">
      <header className="cabecalho">
        <h1>{t(TITULO, idioma)}</h1>
        <div className="seletor-idioma" role="group" aria-label="Idioma">
          {IDIOMAS.map(({ codigo, rotulo }) => (
            <button
              key={codigo}
              className={codigo === idioma ? 'botao botao-ativo' : 'botao botao-secundario'}
              onClick={() => mudarIdioma(codigo)}
              aria-pressed={codigo === idioma}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </header>

      <h2>{t(ESCOLHA_JOGO, idioma)}</h2>

      <section className="grade-jogos">
        {JOGOS.map((jogo) => (
          <button key={jogo.id} className="cartao-jogo" onClick={() => setJogoAtualId(jogo.id)}>
            <span className="emoji-grande" aria-hidden="true">
              {jogo.emoji}
            </span>
            <strong>{t(jogo.titulo, idioma)}</strong>
            <span>{t(jogo.descricao, idioma)}</span>
          </button>
        ))}
      </section>
    </main>
  );
}
