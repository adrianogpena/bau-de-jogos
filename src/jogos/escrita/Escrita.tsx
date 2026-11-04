import { useMemo, useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, t } from '../../compartilhado/idioma';
import {
  PALAVRAS,
  caminhoImagem,
  normalizar,
  palavraDe,
  sortear,
} from '../../compartilhado/palavras';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';

const RODADA = 8;

const TEXTOS = {
  titulo: { 'pt-PT': 'Qual é a palavra?', 'pt-BR': 'Qual é a palavra?' },
  instrucao: {
    'pt-PT': 'Escreve o que vês na imagem.',
    'pt-BR': 'Escreva o que você vê na imagem.',
  },
  placeholder: { 'pt-PT': 'Escreve aqui', 'pt-BR': 'Escreva aqui' },
  verificar: { 'pt-PT': 'Verificar', 'pt-BR': 'Verificar' },
  proxima: { 'pt-PT': 'Próxima', 'pt-BR': 'Próxima' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  muitoBem: { 'pt-PT': 'Muito bem! 🎉', 'pt-BR': 'Muito bem! 🎉' },
  quase: { 'pt-PT': 'Quase! Tenta outra vez.', 'pt-BR': 'Quase! Tente de novo.' },
  verResposta: { 'pt-PT': 'Ver a resposta', 'pt-BR': 'Ver a resposta' },
  fim: { 'pt-PT': 'Acabaste! 🏆', 'pt-BR': 'Você terminou! 🏆' },
} satisfies Record<string, TextoPorIdioma>;

function escreveSe(palavra: string, idioma: PropsJogo['idioma']): string {
  return idioma === 'pt-PT' ? `Escreve-se: ${palavra}` : `Escreve-se assim: ${palavra}`;
}

/** Jogo 1: aparece uma imagem e a criança escreve o que é. */
export function Escrita({ idioma, aoVoltar }: PropsJogo) {
  const [rodada, setRodada] = useState(() => sortear(PALAVRAS, RODADA));
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState('');
  const [estado, setEstado] = useState<'digitando' | 'errou' | 'acertou' | 'revelou'>('digitando');
  const [acertos, setAcertos] = useState(0);

  const item = rodada[indice];
  const certa = useMemo(() => (item ? palavraDe(item, idioma) : ''), [item, idioma]);
  const terminou = indice >= rodada.length;

  function verificar() {
    if (!resposta.trim()) return;
    // aceita sem acentos, mas mostra a escrita correta
    if (normalizar(resposta) === normalizar(certa)) {
      somAcerto();
      setEstado('acertou');
      setAcertos((n) => n + 1);
    } else {
      somTentarDeNovo();
      setEstado('errou');
    }
  }

  function proxima() {
    setIndice((i) => i + 1);
    setResposta('');
    setEstado('digitando');
  }

  function reiniciar() {
    setRodada(sortear(PALAVRAS, RODADA));
    setIndice(0);
    setResposta('');
    setEstado('digitando');
    setAcertos(0);
  }

  if (terminou) {
    return (
      <main className="tela tela-centro">
        <h1>{t(TEXTOS.fim, idioma)}</h1>
        <p className="texto-grande">
          ⭐ {acertos} / {rodada.length}
        </p>
        <button className="botao" onClick={reiniciar}>
          {t(TEXTOS.jogarDeNovo, idioma)}
        </button>
        <button className="botao botao-secundario" onClick={aoVoltar}>
          {t(TEXTOS.voltar, idioma)}
        </button>
      </main>
    );
  }

  const acabouRodadaDaPalavra = estado === 'acertou' || estado === 'revelou';

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso">
          {indice + 1} / {rodada.length}
        </span>
      </header>

      <h1>{t(TEXTOS.titulo, idioma)}</h1>
      <p>{t(TEXTOS.instrucao, idioma)}</p>

      <img
        className={`imagem-jogo ${estado === 'acertou' ? 'imagem-acerto' : ''}`}
        src={caminhoImagem(item.imagem)}
        alt=""
        draggable={false}
      />

      <form
        className="formulario-resposta"
        onSubmit={(e) => {
          e.preventDefault();
          if (acabouRodadaDaPalavra) proxima();
          else verificar();
        }}
      >
        <input
          className="campo-resposta"
          value={resposta}
          onChange={(e) => {
            setResposta(e.target.value);
            if (estado === 'errou') setEstado('digitando');
          }}
          placeholder={t(TEXTOS.placeholder, idioma)}
          disabled={acabouRodadaDaPalavra}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          lang={idioma}
          aria-label={t(TEXTOS.instrucao, idioma)}
        />

        {estado === 'acertou' && (
          <p className="mensagem mensagem-acerto">
            {t(TEXTOS.muitoBem, idioma)}
            {normalizar(resposta) === normalizar(certa) && resposta.trim().toLocaleLowerCase('pt') !== certa
              ? ` ${escreveSe(certa, idioma)}`
              : ''}
          </p>
        )}
        {estado === 'errou' && <p className="mensagem">{t(TEXTOS.quase, idioma)}</p>}
        {estado === 'revelou' && <p className="mensagem">{escreveSe(certa, idioma)}</p>}

        <div className="acoes">
          {acabouRodadaDaPalavra ? (
            <button type="submit" className="botao">
              {t(TEXTOS.proxima, idioma)} →
            </button>
          ) : (
            <>
              <button type="submit" className="botao">
                {t(TEXTOS.verificar, idioma)}
              </button>
              {estado === 'errou' && (
                <button
                  type="button"
                  className="botao botao-secundario"
                  onClick={() => setEstado('revelou')}
                >
                  {t(TEXTOS.verResposta, idioma)}
                </button>
              )}
            </>
          )}
        </div>
      </form>
    </main>
  );
}
