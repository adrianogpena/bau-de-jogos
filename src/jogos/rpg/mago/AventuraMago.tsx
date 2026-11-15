import { FiguraPersonagem } from '../FiguraPersonagem';
import { personagemPorId, valoresPersonagem } from '../personagem';
import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { somAcerto } from '../../../compartilhado/som';
import type { PropsJogo } from '../../tipos';
import type { Nivel } from '../../../compartilhado/niveis';
import type { PropsHistoria } from '../Rpg';
import { AJUSTES_NIVEL, inimigoDoNivel } from '../niveis';
import { AventuraLivro } from '../livro/AventuraLivro';
import type { FichaMago } from './tipos';
import { CriarMago } from './CriarMago';
import { LutaMagica } from './LutaMagica';
import { LIVRO_TORRE_ENCANTADA } from './historia';
import {
  ENERGIA_POR_VITORIA,
  FEITICOS,
  HABILIDADES,
  SABEDORIA_PARA_TENTATIVA,
  escolaPorId,
  feiticosParaAprender,
  INIMIGOS_MAGO,
} from './feiticos';
import { Icone, comIcones } from '../../../compartilhado/icones';

const TEXTOS = {
  feiticos: { 'pt-PT': 'Feitiços', 'pt-BR': 'Feitiços' },
  instrucaoTeste: {
    'pt-PT': 'Lança o d20 e soma {habilidade} ({valor}). Precisas de {dificuldade} ou mais.',
    'pt-BR': 'Jogue o d20 e some {habilidade} ({valor}). Você precisa de {dificuldade} ou mais.',
  },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  aprenderPergunta: {
    'pt-PT': 'Qual feitiço queres aprender?',
    'pt-BR': 'Qual feitiço você quer aprender?',
  },
  aprendeu: { 'pt-PT': 'Aprendeste {feitico}! 🎉', 'pt-BR': 'Você aprendeu {feitico}! 🎉' },
  custo: { 'pt-PT': 'Custa {n} 🔮', 'pt-BR': 'Custa {n} 🔮' },
} satisfies Record<string, TextoPorIdioma>;

/** História 2: A Torre Encantada. Cria o mago e conduz a aventura. */
export function TorreEncantada({ idioma, aoVoltar, nivel }: PropsHistoria) {
  const [ficha, setFicha] = useState<FichaMago | null>(null);

  if (!ficha) return <CriarMago idioma={idioma} nivel={nivel} aoVoltar={aoVoltar} aoComecar={setFicha} />;
  return (
    <Aventura
      idioma={idioma}
      aoVoltar={aoVoltar}
      nivel={nivel}
      fichaInicial={ficha}
      aoRecomecar={() => setFicha(null)}
    />
  );
}

interface PropsAventura extends PropsJogo {
  nivel: Nivel;
  fichaInicial: FichaMago;
  aoRecomecar: () => void;
}

function ResumoMago({ ficha, idioma }: { ficha: FichaMago; idioma: Idioma }) {
  const escola = escolaPorId(ficha.escola);
  return (
    <div className="resumo-ficha">
      <span className="resumo-avatar" aria-hidden="true">
        <FiguraPersonagem personagem={personagemPorId('mago', ficha.personagem)} classe="resumo-imagem" />
      </span>
      <strong>{personagemPorId('mago', ficha.personagem).nome}</strong>
      <span>
        {comIcones(escola.emoji)} {t(escola.nome, idioma)}
      </span>
      <span>
        <Icone id="interface/coracao" /> {ficha.pontosDeVida}/{ficha.pontosDeVidaMaximos}
      </span>
      <span>
        <Icone id="interface/bola-de-cristal" /> {ficha.energia}/{ficha.energiaMaxima}
      </span>
      {HABILIDADES.map((hab) => (
        <span key={hab.id} title={t(hab.nome, idioma)}>
          {comIcones(hab.emoji)} {ficha.habilidades[hab.id]}
        </span>
      ))}
    </div>
  );
}

/** Lista dos feitiços que o mago conhece, com leitura em voz alta. */
function ListaFeiticos({ ficha, idioma }: { ficha: FichaMago; idioma: Idioma }) {
  return (
    <ul className="lista-feiticos feiticos-conhecidos">
      {ficha.feiticos.map((id) => {
        const f = FEITICOS[id];
        return (
          <li key={id} className="feitico-linha">
            <span className="feitico-emoji" aria-hidden="true">
              {comIcones(f.emoji)}
            </span>
            <span className="feitico-texto">
              <strong>
                {t(f.nome, idioma)} ·{' '}
                <small>{f.custo === 0 ? '—' : preencher(t(TEXTOS.custo, idioma), { n: f.custo })}</small>
              </strong>
              <TextoNarrado compacto idioma={idioma} texto={t(f.descricao, idioma)} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** A aventura em livro-jogo (motor em ../livro/AventuraLivro.tsx), com a ficha, os feitiços e as lutas do mago. */
function Aventura({ idioma, aoVoltar, nivel, fichaInicial, aoRecomecar }: PropsAventura) {
  const [ficha, setFicha] = useState(fichaInicial);
  const [verFeiticos, setVerFeiticos] = useState(false);
  const [aprendido, setAprendido] = useState<string | null>(null);

  const escola = escolaPorId(ficha.escola);

  function aprender(id: string) {
    somAcerto();
    setFicha((atual) => ({ ...atual, feiticos: [...atual.feiticos, id] }));
    setAprendido(id);
  }

  return (
    <AventuraLivro
      idioma={idioma}
      nivel={nivel}
      livro={LIVRO_TORRE_ENCANTADA}
      // a escola abre as escolhas de magia próprias (fogo, gelo, natureza, estrelas)
      marcasIniciais={[ficha.escola]}
      valoresTexto={{ ...valoresPersonagem(personagemPorId('mago', ficha.personagem)), escola: t(escola.curto, idioma) }}
      teste={(habilidade, dificuldade) => ({
        valor: ficha.habilidades[habilidade],
        instrucao: preencher(t(TEXTOS.instrucaoTeste, idioma), {
          habilidade: t(HABILIDADES.find((h) => h.id === habilidade)!.nome, idioma),
          valor: ficha.habilidades[habilidade],
          dificuldade,
        }),
      })}
      // a sabedoria dá uma tentativa a mais nos puzzles
      tentativasExtras={ficha.habilidades.sabedoria >= SABEDORIA_PARA_TENTATIVA ? 1 : 0}
      barra={
        <button className="botao botao-secundario" onClick={() => setVerFeiticos(!verFeiticos)} aria-pressed={verFeiticos}>
          <Icone id="interface/bola-de-cristal" /> {t(TEXTOS.feiticos, idioma)}
        </button>
      }
      painel={verFeiticos && <ListaFeiticos ficha={ficha} idioma={idioma} />}
      resumo={<ResumoMago ficha={ficha} idioma={idioma} />}
      aoEntrar={(ponto) => {
        setAprendido(null);
        // descanso: recupera a vida e a energia mágica
        if (ponto.recompensa?.curar) {
          setFicha((atual) => ({ ...atual, pontosDeVida: atual.pontosDeVidaMaximos, energia: atual.energiaMaxima }));
        }
      }}
      luta={(ponto, vencer) => (
        <LutaMagica
          key={ponto.id}
          idioma={idioma}
          ficha={ficha}
          inimigo={inimigoDoNivel(INIMIGOS_MAGO[ponto.luta!.inimigo], nivel)}
          conta={AJUSTES_NIVEL[nivel].conta}
          aoVencer={(vida, energia) => {
            setFicha((atual) => ({
              ...atual,
              pontosDeVida: vida,
              energia: Math.min(atual.energiaMaxima, energia + ENERGIA_POR_VITORIA),
            }));
            vencer();
          }}
        />
      )}
      extra={(ponto, irPara) =>
        ponto.aprender && (
          <div className="aprender">
            {aprendido ? (
              <>
                <TextoNarrado
                  className="mensagem mensagem-acerto"
                  idioma={idioma}
                  texto={preencher(t(TEXTOS.aprendeu, idioma), {
                    feitico: `${FEITICOS[aprendido].emoji} ${t(FEITICOS[aprendido].nome, idioma)}`,
                  })}
                />
                <button className="botao" onClick={() => irPara(ponto.aprender!.proxima)}>
                  {comIcones(t(TEXTOS.continuar, idioma))}
                </button>
              </>
            ) : (
              <>
                <TextoNarrado className="texto-grande" idioma={idioma} texto={t(TEXTOS.aprenderPergunta, idioma)} />
                <div className="lista-feiticos-luta">
                  {feiticosParaAprender(ficha.escola, ficha.feiticos).map((f) => (
                    <button key={f.id} className="botao botao-feitico" onClick={() => aprender(f.id)}>
                      <span>
                        {comIcones(f.emoji)} {t(f.nome, idioma)} · <span className="sem-quebra">{f.custo} <Icone id="interface/bola-de-cristal" /></span>
                      </span>
                      <small>{t(f.descricao, idioma)}</small>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      }
      aoVoltar={aoVoltar}
      aoRecomecar={aoRecomecar}
    />
  );
}
