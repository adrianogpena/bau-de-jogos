import { useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, t } from '../../compartilhado/idioma';
import { type PalavraIlustrada, caminhoImagem, palavraDe, sortear } from '../../compartilhado/palavras';
import { type Fabula, paragrafoCompleto, segmentosDoParagrafo } from '../../compartilhado/historias';
import { EscolherFabula } from '../../compartilhado/EscolherFabula';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import { Icone, comIcones } from '../../compartilhado/icones';

const OPCOES = 4;

const TEXTOS = {
  escolha: {
    'pt-PT': 'Lê cada parte da história e escolhe a imagem da palavra em destaque!',
    'pt-BR': 'Leia cada parte da história e escolha a imagem da palavra em destaque!',
  },
  instrucao: {
    'pt-PT': 'Lê a palavra em destaque e escolhe a imagem certa.',
    'pt-BR': 'Leia a palavra em destaque e escolha a imagem certa.',
  },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  proxima: { 'pt-PT': 'Continuar', 'pt-BR': 'Continuar' },
  outraHistoria: { 'pt-PT': 'Escolher outra história', 'pt-BR': 'Escolher outra história' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  muitoBem: { 'pt-PT': 'Muito bem! 🎉', 'pt-BR': 'Muito bem! 🎉' },
  tentaOutra: { 'pt-PT': 'Tenta outra vez!', 'pt-BR': 'Tente de novo!' },
  fim: { 'pt-PT': 'Acabaste a história! 🏆', 'pt-BR': 'Você terminou a história! 🏆' },
  historiaToda: { 'pt-PT': 'Aqui está a história toda:', 'pt-BR': 'Aqui está a história inteira:' },
} satisfies Record<string, TextoPorIdioma>;

/**
 * Opções de imagem para cada parágrafo: a certa e outras palavras da mesma fábula,
 * que são parecidas no tema e obrigam a criança a ler a palavra.
 */
function opcoesDaFabula(fabula: Fabula): PalavraIlustrada[][] {
  const todas = fabula.rodadas.map((r) => r.palavra);
  return todas.map((certa) =>
    sortear([certa, ...sortear(todas.filter((p) => p.imagem !== certa.imagem), OPCOES - 1)], OPCOES),
  );
}

/** Jogo 2: a criança escolhe uma fábula e, em cada parte, a imagem da palavra em destaque. */
export function Leitura({ idioma, aoVoltar }: PropsJogo) {
  const [fabula, setFabula] = useState<Fabula | null>(null);

  if (!fabula) {
    return (
      <EscolherFabula
        idioma={idioma}
        emoji="📖"
        instrucao={t(TEXTOS.escolha, idioma)}
        aoEscolher={setFabula}
        aoVoltar={aoVoltar}
      />
    );
  }
  return <LeituraFabula key={fabula.id} fabula={fabula} idioma={idioma} aoVoltar={() => setFabula(null)} />;
}

function LeituraFabula({ fabula, idioma, aoVoltar }: PropsJogo & { fabula: Fabula }) {
  const [opcoes, setOpcoes] = useState(() => opcoesDaFabula(fabula));
  const [indice, setIndice] = useState(0);
  const [erradas, setErradas] = useState<number[]>([]);
  const [acertou, setAcertou] = useState(false);
  const [pontos, setPontos] = useState(0);

  const rodada = fabula.rodadas[indice];

  function escolher(opcao: PalavraIlustrada) {
    if (acertou || erradas.includes(opcao.imagem)) return;
    if (opcao.imagem === rodada.palavra.imagem) {
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
    setOpcoes(opcoesDaFabula(fabula));
    setIndice(0);
    setErradas([]);
    setAcertou(false);
    setPontos(0);
  }

  if (!rodada) {
    return (
      <main className="tela tela-centro">
        <h1>{comIcones(t(TEXTOS.fim, idioma))}</h1>
        <p className="texto-grande">
          <Icone id="interface/estrela" /> {pontos} / {fabula.rodadas.length}
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

  const { paragrafo } = rodada;
  const certaTexto = palavraDe(rodada.palavra, idioma);

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso">
          {indice + 1} / {fabula.rodadas.length}
        </span>
      </header>

      <h2>
        {comIcones(fabula.emoji)} {t(fabula.titulo, idioma)}
      </h2>

      {acertou && rodada.ultima ? (
        // depois de acertar a última palavra, o parágrafo é lido em voz alta
        <TextoNarrado
          key={indice}
          className="texto-historia"
          idioma={idioma}
          texto={paragrafoCompleto(paragrafo, idioma)}
          destacar={certaTexto}
          lerAoAbrir
        />
      ) : (
        <>
          <p className="texto-historia" lang={idioma}>
            {segmentosDoParagrafo(paragrafo, idioma).map((segmento, i) =>
              segmento.tipo === 'palavra' && segmento.posicao === rodada.alvo ? (
                <span key={i} className="palavra-destacada">
                  {segmento.texto}
                </span>
              ) : (
                segmento.texto
              ),
            )}
          </p>
          {!acertou && <p>{t(TEXTOS.instrucao, idioma)}</p>}
        </>
      )}

      <div className="grade-opcoes">
        {opcoes[indice].map((opcao) => {
          const errada = erradas.includes(opcao.imagem);
          const certa = acertou && opcao.imagem === rodada.palavra.imagem;
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
        {acertou ? comIcones(t(TEXTOS.muitoBem, idioma)) : erradas.length > 0 ? t(TEXTOS.tentaOutra, idioma) : ''}
      </p>

      {acertou && (
        <button className="botao" onClick={proxima}>
          {t(TEXTOS.proxima, idioma)} →
        </button>
      )}
    </main>
  );
}
