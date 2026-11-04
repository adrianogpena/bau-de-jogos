import { useMemo, useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type Idioma, type TextoPorIdioma, t } from '../../compartilhado/idioma';
import { caminhoImagem, normalizar } from '../../compartilhado/palavras';
import { type Fabula, paragrafoCompleto, partesDoParagrafo } from '../../compartilhado/fabulas';
import { EscolherFabula } from '../../compartilhado/EscolherFabula';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';

const TEXTOS = {
  escolha: {
    'pt-PT': 'Em cada parte da história falta uma palavra. Olha para a imagem e escreve-a!',
    'pt-BR': 'Em cada parte da história falta uma palavra. Olhe a imagem e escreva a palavra!',
  },
  instrucao: {
    'pt-PT': 'Que palavra falta? Escreve o que vês na imagem.',
    'pt-BR': 'Que palavra está faltando? Escreva o que você vê na imagem.',
  },
  placeholder: { 'pt-PT': 'Escreve aqui', 'pt-BR': 'Escreva aqui' },
  verificar: { 'pt-PT': 'Verificar', 'pt-BR': 'Verificar' },
  proxima: { 'pt-PT': 'Continuar', 'pt-BR': 'Continuar' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  outraHistoria: { 'pt-PT': 'Escolher outra história', 'pt-BR': 'Escolher outra história' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  muitoBem: { 'pt-PT': 'Muito bem! 🎉', 'pt-BR': 'Muito bem! 🎉' },
  quase: { 'pt-PT': 'Quase! Tenta outra vez.', 'pt-BR': 'Quase! Tente de novo.' },
  ajuda: { 'pt-PT': 'Ajuda: mostrar uma letra', 'pt-BR': 'Ajuda: mostrar uma letra' },
  fim: { 'pt-PT': 'Acabaste a história! 🏆', 'pt-BR': 'Você terminou a história! 🏆' },
  historiaToda: { 'pt-PT': 'Aqui está a história toda:', 'pt-BR': 'Aqui está a história inteira:' },
} satisfies Record<string, TextoPorIdioma>;

function escreveSe(palavra: string, idioma: Idioma): string {
  return idioma === 'pt-PT' ? `Escreve-se: ${palavra}` : `Escreve-se assim: ${palavra}`;
}

/** Jogo 1: a criança escolhe uma fábula e escreve a palavra que falta em cada parte. */
export function Escrita({ idioma, aoVoltar }: PropsJogo) {
  const [fabula, setFabula] = useState<Fabula | null>(null);

  if (!fabula) {
    return (
      <EscolherFabula
        idioma={idioma}
        emoji="✏️"
        instrucao={t(TEXTOS.escolha, idioma)}
        aoEscolher={setFabula}
        aoVoltar={aoVoltar}
      />
    );
  }
  return <EscritaFabula key={fabula.id} fabula={fabula} idioma={idioma} aoVoltar={() => setFabula(null)} />;
}

function EscritaFabula({ fabula, idioma, aoVoltar }: PropsJogo & { fabula: Fabula }) {
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState('');
  const [estado, setEstado] = useState<'digitando' | 'errou' | 'acertou'>('digitando');
  const [acertos, setAcertos] = useState(0);
  // quantas letras a lâmpada já mostrou na palavra atual
  const [dicas, setDicas] = useState(0);
  const [usouAjuda, setUsouAjuda] = useState(false);

  const paragrafo = fabula.paragrafos[indice];
  const partes = useMemo(() => (paragrafo ? partesDoParagrafo(paragrafo, idioma) : null), [paragrafo, idioma]);
  const certa = partes?.palavra ?? '';
  const letras = useMemo(() => [...certa], [certa]);

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
    setIndice(0);
    setResposta('');
    setEstado('digitando');
    setAcertos(0);
    setDicas(0);
    setUsouAjuda(false);
  }

  if (!paragrafo || !partes) {
    return (
      <main className="tela tela-centro">
        <h1>{t(TEXTOS.fim, idioma)}</h1>
        <p className="texto-grande">
          ⭐ {acertos} / {fabula.paragrafos.length}
        </p>
        <p>{t(TEXTOS.historiaToda, idioma)}</p>
        <TextoNarrado
          className="texto-historia"
          idioma={idioma}
          texto={fabula.paragrafos.map((p) => paragrafoCompleto(p, idioma)).join('\n')}
        />
        <div className="acoes">
          <button className="botao" onClick={reiniciar}>
            {t(TEXTOS.jogarDeNovo, idioma)}
          </button>
          <button className="botao botao-secundario" onClick={aoVoltar}>
            {t(TEXTOS.outraHistoria, idioma)}
          </button>
        </div>
      </main>
    );
  }

  const acertou = estado === 'acertou';

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso">
          {indice + 1} / {fabula.paragrafos.length}
        </span>
      </header>

      <h2>
        {fabula.emoji} {t(fabula.titulo, idioma)}
      </h2>

      {acertou ? (
        // depois de acertar, o parágrafo completo é lido em voz alta
        <TextoNarrado
          key={indice}
          className="texto-historia"
          idioma={idioma}
          texto={paragrafoCompleto(paragrafo, idioma)}
          destacar={certa}
          lerAoAbrir
        />
      ) : (
        <p className="texto-historia" lang={idioma}>
          {partes.antes}
          <span className="lacuna" aria-label={t(TEXTOS.instrucao, idioma)}>
            {letras.map((letra, i) => (i < dicas ? letra : '_')).join(' ')}
          </span>
          {partes.depois}
        </p>
      )}

      <img
        className={`imagem-jogo ${acertou ? 'imagem-acerto' : ''}`}
        src={caminhoImagem(paragrafo.palavra.imagem)}
        alt=""
        draggable={false}
      />

      {!acertou && (
        <>
          <p>{t(TEXTOS.instrucao, idioma)}</p>
          {/* um traço por letra, como na forca; a lâmpada mostra as letras aos poucos */}
          <div className="letras-palavra" lang={idioma} aria-label={`${letras.length}`}>
            {letras.map((letra, i) => (
              <span key={i} className="letra-palavra">
                {i < dicas ? letra : ''}
              </span>
            ))}
            <button
              type="button"
              className="botao-lampada"
              onClick={mostrarLetra}
              disabled={dicas >= letras.length}
              aria-label={t(TEXTOS.ajuda, idioma)}
            >
              💡
            </button>
          </div>
        </>
      )}

      <form
        className="formulario-resposta"
        onSubmit={(e) => {
          e.preventDefault();
          if (acertou) proxima();
          else verificar();
        }}
      >
        {!acertou && (
          <input
            className="campo-resposta"
            value={resposta}
            onChange={(e) => {
              setResposta(e.target.value);
              if (estado === 'errou') setEstado('digitando');
            }}
            placeholder={t(TEXTOS.placeholder, idioma)}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            lang={idioma}
            aria-label={t(TEXTOS.instrucao, idioma)}
          />
        )}

        {acertou && (
          <p className="mensagem mensagem-acerto">
            {t(TEXTOS.muitoBem, idioma)}
            {resposta.trim().toLocaleLowerCase('pt') !== certa ? ` ${escreveSe(certa, idioma)}` : ''}
          </p>
        )}
        {estado === 'errou' && <p className="mensagem">{t(TEXTOS.quase, idioma)}</p>}

        <div className="acoes">
          <button type="submit" className="botao">
            {acertou ? `${t(TEXTOS.proxima, idioma)} →` : t(TEXTOS.verificar, idioma)}
          </button>
        </div>
      </form>
    </main>
  );
}
