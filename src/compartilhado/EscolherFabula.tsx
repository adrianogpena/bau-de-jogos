import { type Idioma, type TextoPorIdioma, t } from './idioma';
import { COLECOES, type Fabula } from './fabulas';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  escolha: { 'pt-PT': 'Escolhe uma história!', 'pt-BR': 'Escolha uma história!' },
  paragrafos: { 'pt-PT': 'partes', 'pt-BR': 'partes' },
} satisfies Record<string, TextoPorIdioma>;

/** Tela para escolher a história, separada por coleção (usada nos jogos de escrita e de leitura). */
export function EscolherFabula({
  idioma,
  emoji,
  instrucao,
  aoEscolher,
  aoVoltar,
}: {
  idioma: Idioma;
  emoji: string;
  instrucao: string;
  aoEscolher: (fabula: Fabula) => void;
  aoVoltar: () => void;
}) {
  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1>
        {emoji} {t(TEXTOS.escolha, idioma)}
      </h1>
      <p>{instrucao}</p>

      {COLECOES.map((colecao) => (
        <section key={colecao.id} className="colecao-historias">
          <h2>{t(colecao.titulo, idioma)}</h2>
          <div className="grade-jogos">
            {colecao.historias.map((fabula) => (
              <button key={fabula.id} className="cartao-jogo cartao-historia" onClick={() => aoEscolher(fabula)}>
                <span className="emoji-grande" aria-hidden="true">
                  {fabula.emoji}
                </span>
                <strong>{t(fabula.titulo, idioma)}</strong>
                <small>
                  {fabula.paragrafos.length} {t(TEXTOS.paragrafos, idioma)}
                </small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
