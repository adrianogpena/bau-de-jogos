import { type CSSProperties, useEffect, useState } from 'react';
import { IDIOMAS, type Idioma, idiomaInicial, salvarIdioma, t } from './compartilhado/idioma';
import { JOGOS } from './jogos/registro';
import { Creditos } from './Creditos';
import { comIcones } from './compartilhado/icones';

const TITULO = { 'pt-PT': 'Baú de Jogos', 'pt-BR': 'Baú de Jogos' };
const ROTULO_IDIOMA = { 'pt-PT': 'Idioma', 'pt-BR': 'Idioma' };
const CREDITOS = { 'pt-PT': 'Créditos', 'pt-BR': 'Créditos' };
const ESCOLHA_JOGO = {
  'pt-PT': 'O que vamos jogar hoje?',
  'pt-BR': 'O que vamos jogar hoje?',
};
const SUBTITULO = {
  'pt-PT': 'Aventuras, histórias e desafios de palavras.',
  'pt-BR': 'Aventuras, histórias e desafios de palavras.',
};
const JOGAR = { 'pt-PT': 'Jogar', 'pt-BR': 'Jogar' };

export function App() {
  const [idioma, setIdioma] = useState<Idioma>(idiomaInicial);
  const [jogoAtualId, setJogoAtualId] = useState<string | null>(null);
  const [verCreditos, setVerCreditos] = useState(false);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  function mudarIdioma(novo: Idioma) {
    setIdioma(novo);
    salvarIdioma(novo);
  }

  if (verCreditos) return <Creditos idioma={idioma} aoVoltar={() => setVerCreditos(false)} />;

  const jogoAtual = JOGOS.find((jogo) => jogo.id === jogoAtualId);

  if (jogoAtual) {
    const Componente = jogoAtual.componente;
    return <Componente idioma={idioma} aoVoltar={() => setJogoAtualId(null)} />;
  }

  return (
    <main className="tela">
      <header className="cabecalho">
        <div className="marca">
          <img className="marca-icone" src={`${import.meta.env.BASE_URL}icone-192.png`} alt="" draggable={false} />
          <h1>{t(TITULO, idioma)}</h1>
        </div>
        <div className="seletor-idioma" role="group" aria-label={t(ROTULO_IDIOMA, idioma)}>
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

      <section className="boas-vindas">
        <h2>{t(ESCOLHA_JOGO, idioma)}</h2>
        <p>{t(SUBTITULO, idioma)}</p>
      </section>

      <section className="grade-jogos">
        {JOGOS.map((jogo, i) => (
          <button
            key={jogo.id}
            className={`cartao-jogo cartao-menu ${i === 0 ? 'cartao-principal' : ''}`}
            style={{ '--cor': jogo.cor } as CSSProperties}
            onClick={() => setJogoAtualId(jogo.id)}
          >
            <span className="cartao-menu-topo">
              <span className="icone-jogo" aria-hidden="true">
                {comIcones(jogo.emoji)}
              </span>
              <span className="etiqueta">{t(jogo.etiqueta, idioma)}</span>
            </span>
            <span className="cartao-menu-texto">
              <strong>{t(jogo.titulo, idioma)}</strong>
              <span className="cartao-menu-descricao">{t(jogo.descricao, idioma)}</span>
            </span>
            <span className="jogar">
              {t(JOGAR, idioma)} ▶
            </span>
          </button>
        ))}
      </section>

      <footer className="rodape">
        <button className="botao botao-secundario" onClick={() => setVerCreditos(true)}>
          {t(CREDITOS, idioma)}
        </button>
      </footer>
    </main>
  );
}
