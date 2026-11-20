import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { Icone, comIcones } from '../../../compartilhado/icones';
import type { PropsJogo } from '../../tipos';
import type { Nivel } from '../../../compartilhado/niveis';
import type { PropsHistoria } from '../Rpg';
import { AJUSTES_NIVEL, inimigoDoNivel } from '../niveis';
import { AventuraLivro } from '../livro/AventuraLivro';
import { EscolherPersonagem } from '../EscolherPersonagem';
import { FiguraPersonagem } from '../FiguraPersonagem';
import { personagemPorId, valoresPersonagem } from '../personagem';
import {
  ATRIBUTOS_ARQUEIRO,
  ATRIBUTO_MAXIMO,
  ATRIBUTO_MINIMO,
  FLECHAS_INICIAIS,
  INIMIGOS_NAVIO,
  LIVRO_NAVIO_FANTASMA,
  PONTOS_PARA_DISTRIBUIR,
  VISAO_PARA_TENTATIVA,
  defesaArqueiro,
  vidaMaxima,
} from './historia';
import { LutaArqueiro } from './LutaArqueiro';
import type { AtributosArqueiro, FichaArqueiro, NomeAtributoArqueiro } from './tipos';

const TEXTOS = {
  titulo: { 'pt-PT': 'Cria o teu arqueiro', 'pt-BR': 'Crie seu arqueiro' },
  pontos: { 'pt-PT': 'Pontos para distribuir: {n}', 'pt-BR': 'Pontos para distribuir: {n}' },
  gasta: { 'pt-PT': 'Gasta todos os pontos para começar!', 'pt-BR': 'Use todos os pontos para começar!' },
  falta: { 'pt-PT': 'Escolhe o teu arqueiro para começar!', 'pt-BR': 'Escolha seu arqueiro para começar!' },
  vida: { 'pt-PT': 'Vida', 'pt-BR': 'Vida' },
  defesa: { 'pt-PT': 'Defesa', 'pt-BR': 'Defesa' },
  comecar: { 'pt-PT': 'Começar a aventura!', 'pt-BR': 'Começar a aventura!' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  menos: { 'pt-PT': 'Menos', 'pt-BR': 'Menos' },
  mais: { 'pt-PT': 'Mais', 'pt-BR': 'Mais' },
  flechas: { 'pt-PT': 'Flechas', 'pt-BR': 'Flechas' },
  instrucaoTeste: {
    'pt-PT': 'Lança o d20 e soma {atributo} ({valor}). Precisas de {dificuldade} ou mais.',
    'pt-BR': 'Jogue o d20 e some {atributo} ({valor}). Você precisa de {dificuldade} ou mais.',
  },
} satisfies Record<string, TextoPorIdioma>;

/** O Navio Fantasma. Cria o arqueiro (com a aljava de flechas) e conduz a aventura. */
export function NavioFantasma({ idioma, aoVoltar, nivel }: PropsHistoria) {
  const [ficha, setFicha] = useState<FichaArqueiro | null>(null);

  if (!ficha) return <CriarArqueiro idioma={idioma} nivel={nivel} aoVoltar={aoVoltar} aoComecar={setFicha} />;
  return <Aventura idioma={idioma} aoVoltar={aoVoltar} nivel={nivel} fichaInicial={ficha} aoRecomecar={() => setFicha(null)} />;
}

interface PropsCriar {
  idioma: Idioma;
  nivel: Nivel;
  aoVoltar: () => void;
  aoComecar: (ficha: FichaArqueiro) => void;
}

function CriarArqueiro({ idioma, nivel, aoVoltar, aoComecar }: PropsCriar) {
  const [personagem, setPersonagem] = useState<string | null>(null);
  const [atributos, setAtributos] = useState<AtributosArqueiro>({
    pontaria: ATRIBUTO_MINIMO,
    agilidade: ATRIBUTO_MINIMO,
    visao: ATRIBUTO_MINIMO,
    coragem: ATRIBUTO_MINIMO,
  });

  const gastos = Object.values(atributos).reduce((soma, v) => soma + v - ATRIBUTO_MINIMO, 0);
  const sobram = PONTOS_PARA_DISTRIBUIR - gastos;

  function mudar(id: NomeAtributoArqueiro, delta: number) {
    const novo = atributos[id] + delta;
    if (novo < ATRIBUTO_MINIMO || novo > ATRIBUTO_MAXIMO) return;
    if (delta > 0 && sobram <= 0) return;
    setAtributos({ ...atributos, [id]: novo });
  }

  function comecar() {
    if (!personagem) return;
    const vida = vidaMaxima(atributos.coragem);
    const flechas = FLECHAS_INICIAIS[nivel];
    aoComecar({ personagem, atributos, pontosDeVida: vida, pontosDeVidaMaximos: vida, flechas, flechasIniciais: flechas });
  }

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1>
        <Icone id="interface/pergaminho" /> {t(TEXTOS.titulo, idioma)}
      </h1>

      <div className="ficha-papel">
        <EscolherPersonagem idioma={idioma} tipo="arqueiro" escolhido={personagem} aoEscolher={setPersonagem} />

        <TextoNarrado className="texto-grande" idioma={idioma} texto={preencher(t(TEXTOS.pontos, idioma), { n: sobram })} />

        {ATRIBUTOS_ARQUEIRO.map((atr) => (
          <div key={atr.id} className="linha-atributo">
            <span className="atributo-nome">
              <span aria-hidden="true">{comIcones(atr.emoji)}</span>
              <TextoNarrado compacto idioma={idioma} texto={`${t(atr.nome, idioma)}\n${t(atr.ajuda, idioma)}`} />
            </span>
            <span className="controle-atributo">
              <button
                className="botao botao-secundario botao-redondo"
                onClick={() => mudar(atr.id, -1)}
                disabled={atributos[atr.id] <= ATRIBUTO_MINIMO}
                aria-label={t(TEXTOS.menos, idioma)}
              >
                −
              </button>
              <strong className="atributo-valor">{atributos[atr.id]}</strong>
              <button
                className="botao botao-redondo"
                onClick={() => mudar(atr.id, 1)}
                disabled={sobram <= 0 || atributos[atr.id] >= ATRIBUTO_MAXIMO}
                aria-label={t(TEXTOS.mais, idioma)}
              >
                +
              </button>
            </span>
          </div>
        ))}

        <p className="texto-grande">
          <Icone id="interface/coracao" /> {t(TEXTOS.vida, idioma)}: {vidaMaxima(atributos.coragem)} · 🏹 {t(TEXTOS.flechas, idioma)}:{' '}
          {FLECHAS_INICIAIS[nivel]}
        </p>
      </div>

      <p className="mensagem">{!personagem ? t(TEXTOS.falta, idioma) : sobram > 0 ? t(TEXTOS.gasta, idioma) : ''}</p>
      <button className="botao" onClick={comecar} disabled={sobram > 0 || !personagem}>
        {t(TEXTOS.comecar, idioma)}
      </button>
    </main>
  );
}

function ResumoArqueiro({ ficha, idioma }: { ficha: FichaArqueiro; idioma: Idioma }) {
  const personagem = personagemPorId('arqueiro', ficha.personagem);
  return (
    <div className="resumo-ficha">
      <span className="resumo-avatar" aria-hidden="true">
        <FiguraPersonagem personagem={personagem} classe="resumo-imagem" />
      </span>
      <strong>{personagem.nome}</strong>
      <span>
        <Icone id="interface/coracao" /> {ficha.pontosDeVida}/{ficha.pontosDeVidaMaximos}
      </span>
      <span>
        <Icone id="interface/escudo" /> {t(TEXTOS.defesa, idioma)} {defesaArqueiro(ficha.atributos.agilidade)}
      </span>
      <span>
        🏹 {ficha.flechas}/{ficha.flechasIniciais}
      </span>
      {ATRIBUTOS_ARQUEIRO.map((atr) => (
        <span key={atr.id} title={t(atr.nome, idioma)}>
          {comIcones(atr.emoji)} {ficha.atributos[atr.id]}
        </span>
      ))}
    </div>
  );
}

interface PropsAventura extends PropsJogo {
  nivel: Nivel;
  fichaInicial: FichaArqueiro;
  aoRecomecar: () => void;
}

/** A aventura em livro-jogo (motor em ../livro/AventuraLivro.tsx), com a aljava, a distância e as lutas do arqueiro. */
function Aventura({ idioma, aoVoltar, nivel, fichaInicial, aoRecomecar }: PropsAventura) {
  const [ficha, setFicha] = useState(fichaInicial);

  return (
    <AventuraLivro
      idioma={idioma}
      nivel={nivel}
      livro={LIVRO_NAVIO_FANTASMA}
      valoresTexto={valoresPersonagem(personagemPorId('arqueiro', ficha.personagem))}
      teste={(atributo, dificuldade) => ({
        valor: ficha.atributos[atributo],
        instrucao: preencher(t(TEXTOS.instrucaoTeste, idioma), {
          atributo: t(ATRIBUTOS_ARQUEIRO.find((a) => a.id === atributo)!.nome, idioma),
          valor: ficha.atributos[atributo],
          dificuldade,
        }),
      })}
      // a visão dá uma tentativa a mais nos puzzles
      tentativasExtras={ficha.atributos.visao >= VISAO_PARA_TENTATIVA ? 1 : 0}
      resumo={<ResumoArqueiro ficha={ficha} idioma={idioma} />}
      aoEntrar={(ponto) => {
        if (ponto.recompensa?.flechas) {
          setFicha((atual) => ({ ...atual, flechas: atual.flechas + ponto.recompensa!.flechas! }));
        }
      }}
      luta={(ponto, vencer, marcas) => {
        const luta = ponto.luta!;
        const bonusMarca = luta.bonusAcertoCom && marcas.includes(luta.bonusAcertoCom.marca) ? luta.bonusAcertoCom.bonus : 0;
        return (
          <LutaArqueiro
            key={ponto.id}
            idioma={idioma}
            ficha={ficha}
            inimigo={inimigoDoNivel(INIMIGOS_NAVIO[luta.inimigo], nivel)}
            posicaoInicial={luta.posicao ?? 'perto'}
            bonusAcerto={(luta.bonusAcerto ?? 0) + bonusMarca}
            dificuldadeRecuar={AJUSTES_NIVEL[nivel].dificuldadeTeste}
            temFogo={marcas.includes('flecha-fogo')}
            aoVencer={(vida, flechasFim, gastas) => {
              setFicha((atual) => {
                // depois da luta, a aljava recupera metade das flechas gastas (arredondado para cima)
                const gastasNaLuta = atual.flechas - flechasFim;
                const teto = Math.max(atual.flechasIniciais, atual.flechas);
                return { ...atual, pontosDeVida: vida, flechas: Math.min(teto, flechasFim + Math.ceil(gastasNaLuta / 2)) };
              });
              vencer(gastas);
            }}
          />
        );
      }}
      aoVoltar={aoVoltar}
      aoRecomecar={aoRecomecar}
    />
  );
}
