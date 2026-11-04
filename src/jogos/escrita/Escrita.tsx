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
  ajuda: { 'pt-PT': 'Ajuda: mostrar uma letra', 'pt-BR': 'Ajuda: mostrar uma letra' },
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
  const [estado, setEstado] = useState<'digitando' | 'errou' | 'acertou'>('digitando');
  const [acertos, setAcertos] = useState(0);
  // quantas letras a lâmpada já mostrou na palavra atual
  const [dicas, setDicas] = useState(0);
  const [usouAjuda, setUsouAjuda] = useState(false);

  const item = rodada[indice];
  const certa = useMemo(() => (item ? palavraDe(item, idioma) : ''), [item, idioma]);
  const letras = useMemo(() => [...certa], [certa]);
  const terminou = indice >= rodada.length;

  function verificar() {
    if (!resposta.trim()) return;
    // aceita sem acentos, mas mostra a escrita correta
    if (normalizar(resposta) === normalizar(certa)) {
      somAcerto();
      setEstado('acertou');
      // estrela só quando acerta sem a ajuda da lâmpada
      if (!usouAjuda) setAcertos((n) => n + 1);
    } else {
      somTentarDeNovo();
      setEstado('errou');
    }
  }

  function mostrarLetra() {
    setDicas((n) => Math.min(n + 1, letras.length));
    setUsouAjuda(true);
  }

  function proxima() {
    setIndice((i) => i + 1);
    setResposta('');
    setEstado('digitando');
    setDicas(0);
    setUsouAjuda(false);
  }

  function reiniciar() {
    setRodada(sortear(PALAVRAS, RODADA));
    setIndice(0);
    setResposta('');
    setEstado('digitando');
    setAcertos(0);
    setDicas(0);
    setUsouAjuda(false);
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

  const acabouRodadaDaPalavra = estado === 'acertou';

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

      {/* um traço por letra, como na forca; a lâmpada mostra as letras aos poucos */}
      <div className="letras-palavra" lang={idioma} aria-label={`${letras.length}`}>
        {letras.map((letra, i) => (
          <span key={i} className="letra-palavra">
            {acabouRodadaDaPalavra || i < dicas ? letra : ''}
          </span>
        ))}
        <button
          type="button"
          className="botao-lampada"
          onClick={mostrarLetra}
          disabled={acabouRodadaDaPalavra || dicas >= letras.length}
          aria-label={t(TEXTOS.ajuda, idioma)}
        >
          💡
        </button>
      </div>

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

        <div className="acoes">
          {acabouRodadaDaPalavra ? (
            <button type="submit" className="botao">
              {t(TEXTOS.proxima, idioma)} →
            </button>
          ) : (
            <button type="submit" className="botao">
              {t(TEXTOS.verificar, idioma)}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
