import { useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, t } from '../../compartilhado/idioma';
import {
  PALAVRAS,
  type PalavraIlustrada,
  caminhoImagem,
  palavraDe,
  sortear,
} from '../../compartilhado/palavras';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';

const RODADA = 8;
const OPCOES = 4;

const TEXTOS = {
  titulo: { 'pt-PT': 'Qual é a imagem?', 'pt-BR': 'Qual é a imagem?' },
  instrucao: {
    'pt-PT': 'Lê a palavra e escolhe a imagem certa.',
    'pt-BR': 'Leia a palavra e escolha a imagem certa.',
  },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  proxima: { 'pt-PT': 'Próxima', 'pt-BR': 'Próxima' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  muitoBem: { 'pt-PT': 'Muito bem! 🎉', 'pt-BR': 'Muito bem! 🎉' },
  tentaOutra: { 'pt-PT': 'Tenta outra vez!', 'pt-BR': 'Tente de novo!' },
  fim: { 'pt-PT': 'Acabaste! 🏆', 'pt-BR': 'Você terminou! 🏆' },
} satisfies Record<string, TextoPorIdioma>;

interface Pergunta {
  certa: PalavraIlustrada;
  opcoes: PalavraIlustrada[];
}

function novaRodada(): Pergunta[] {
  return sortear(PALAVRAS, RODADA).map((certa) => ({
    certa,
    opcoes: sortear(
      [certa, ...sortear(PALAVRAS.filter((p) => p.imagem !== certa.imagem), OPCOES - 1)],
      OPCOES,
    ),
  }));
}

/** Jogo 2: aparece uma palavra e a criança escolhe a imagem certa. */
export function Leitura({ idioma, aoVoltar }: PropsJogo) {
  const [rodada, setRodada] = useState(novaRodada);
  const [indice, setIndice] = useState(0);
  const [erradas, setErradas] = useState<number[]>([]);
  const [acertou, setAcertou] = useState(false);
  const [pontos, setPontos] = useState(0);

  const pergunta = rodada[indice];

  function escolher(opcao: PalavraIlustrada) {
    if (acertou || erradas.includes(opcao.imagem)) return;
    if (opcao.imagem === pergunta.certa.imagem) {
      somAcerto();
      setAcertou(true);
      // acertar de primeira vale ponto
      if (erradas.length === 0) setPontos((n) => n + 1);
    } else {
      somTentarDeNovo();
      setErradas((lista) => [...lista, opcao.imagem]);
    }
  }

  function proxima() {
    setIndice((i) => i + 1);
    setErradas([]);
    setAcertou(false);
  }

  function reiniciar() {
    setRodada(novaRodada());
    setIndice(0);
    setErradas([]);
    setAcertou(false);
    setPontos(0);
  }

  if (!pergunta) {
    return (
      <main className="tela tela-centro">
        <h1>{t(TEXTOS.fim, idioma)}</h1>
        <p className="texto-grande">
          ⭐ {pontos} / {rodada.length}
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

      <p className="palavra-grande" lang={idioma}>
        {palavraDe(pergunta.certa, idioma)}
      </p>

      <div className="grade-opcoes">
        {pergunta.opcoes.map((opcao) => {
          const errada = erradas.includes(opcao.imagem);
          const certa = acertou && opcao.imagem === pergunta.certa.imagem;
          return (
            <button
              key={opcao.imagem}
              className={`opcao-imagem ${errada ? 'opcao-errada' : ''} ${certa ? 'opcao-certa' : ''}`}
              onClick={() => escolher(opcao)}
              disabled={errada}
            >
              <img src={caminhoImagem(opcao.imagem)} alt="" draggable={false} />
            </button>
          );
        })}
      </div>

      <p className="mensagem mensagem-acerto">
        {acertou
          ? t(TEXTOS.muitoBem, idioma)
          : erradas.length > 0
            ? t(TEXTOS.tentaOutra, idioma)
            : ''}
      </p>

      {acertou && (
        <button className="botao" onClick={proxima}>
          {t(TEXTOS.proxima, idioma)} →
        </button>
      )}
    </main>
  );
}
