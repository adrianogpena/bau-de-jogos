import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import type { PropsJogo } from '../../tipos';
import type { CenaMago, FichaMago } from './tipos';
import { CriarMago } from './CriarMago';
import { LutaMagica } from './LutaMagica';
import { CENAS_MAGO, CENA_INICIAL_MAGO } from './historia';
import {
  ENERGIA_POR_VITORIA,
  FEITICOS,
  HABILIDADES,
  escolaPorId,
  feiticosParaAprender,
  INIMIGOS_MAGO,
} from './feiticos';
import { Icone, comIcones } from '../../../compartilhado/icones';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  feiticos: { 'pt-PT': 'Feitiços', 'pt-BR': 'Feitiços' },
  lutar: { 'pt-PT': '⚔️ Lutar!', 'pt-BR': '⚔️ Lutar!' },
  lancar: { 'pt-PT': '🎲 Lançar o dado', 'pt-BR': '🎲 Jogar o dado' },
  instrucaoTeste: {
    'pt-PT': 'Lança o d20 e soma {habilidade} ({valor}). Precisas de {dificuldade} ou mais.',
    'pt-BR': 'Jogue o d20 e some {habilidade} ({valor}). Você precisa de {dificuldade} ou mais.',
  },
  resultado: {
    'pt-PT': 'Tiraste {dado} + {valor} = {total}.',
    'pt-BR': 'Você tirou {dado} + {valor} = {total}.',
  },
  passou: { 'pt-PT': 'Conseguiste! 🎉', 'pt-BR': 'Você conseguiu! 🎉' },
  naoPassou: { 'pt-PT': 'Não deu... mas a aventura continua!', 'pt-BR': 'Não deu... mas a aventura continua!' },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  aprenderPergunta: {
    'pt-PT': 'Qual feitiço queres aprender?',
    'pt-BR': 'Qual feitiço você quer aprender?',
  },
  aprendeu: { 'pt-PT': 'Aprendeste {feitico}! 🎉', 'pt-BR': 'Você aprendeu {feitico}! 🎉' },
  custo: { 'pt-PT': 'Custa {n} 🔮', 'pt-BR': 'Custa {n} 🔮' },
  fim: { 'pt-PT': 'Fim da aventura! 🏆', 'pt-BR': 'Fim da aventura! 🏆' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
} satisfies Record<string, TextoPorIdioma>;

/** História 2: A Torre Encantada. Cria o mago e conduz a aventura. */
export function TorreEncantada({ idioma, aoVoltar }: PropsJogo) {
  const [ficha, setFicha] = useState<FichaMago | null>(null);

  if (!ficha) return <CriarMago idioma={idioma} aoVoltar={aoVoltar} aoComecar={setFicha} />;
  return <Aventura idioma={idioma} aoVoltar={aoVoltar} fichaInicial={ficha} aoRecomecar={() => setFicha(null)} />;
}

interface PropsAventura extends PropsJogo {
  fichaInicial: FichaMago;
  aoRecomecar: () => void;
}

type Fase = 'cena' | 'luta' | 'teste';

function ResumoMago({ ficha, idioma }: { ficha: FichaMago; idioma: Idioma }) {
  const escola = escolaPorId(ficha.escola);
  return (
    <div className="resumo-ficha">
      <span className="resumo-avatar" aria-hidden="true">
        {comIcones(ficha.avatar)}
      </span>
      <strong>{ficha.nome}</strong>
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

function aplicarCena(ficha: FichaMago, cena: CenaMago): FichaMago {
  if (!cena.descanso) return ficha;
  return { ...ficha, pontosDeVida: ficha.pontosDeVidaMaximos, energia: ficha.energiaMaxima };
}

function Aventura({ idioma, aoVoltar, fichaInicial, aoRecomecar }: PropsAventura) {
  const [ficha, setFicha] = useState(() => aplicarCena(fichaInicial, CENAS_MAGO[CENA_INICIAL_MAGO]));
  const [cenaId, setCenaId] = useState(CENA_INICIAL_MAGO);
  const [fase, setFase] = useState<Fase>('cena');
  const [passou, setPassou] = useState<boolean | null>(null);
  const [resumoTeste, setResumoTeste] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [verFeiticos, setVerFeiticos] = useState(false);
  const [aprendido, setAprendido] = useState<string | null>(null);
  const dado = usarDado();

  const cena = CENAS_MAGO[cenaId];
  const escola = escolaPorId(ficha.escola);
  const valoresTexto = { nome: ficha.nome, escola: t(escola.curto, idioma) };

  function irPara(id: string, fichaAtual: FichaMago = ficha) {
    setFicha(aplicarCena(fichaAtual, CENAS_MAGO[id]));
    setCenaId(id);
    setFase('cena');
    setPassou(null);
    setResumoTeste('');
    setAprendido(null);
  }

  async function fazerTeste() {
    if (!cena.teste || ocupado) return;
    setOcupado(true);
    setFase('teste');
    const d20 = await dado.rolar(20);
    const valor = ficha.habilidades[cena.teste.habilidade];
    const total = d20 + valor;
    const ok = total >= cena.teste.dificuldade;
    ok ? somAcerto() : somTentarDeNovo();
    setPassou(ok);
    setResumoTeste(preencher(t(TEXTOS.resultado, idioma), { dado: d20, valor, total }));
    setOcupado(false);
  }

  function aprender(id: string) {
    somAcerto();
    setFicha({ ...ficha, feiticos: [...ficha.feiticos, id] });
    setAprendido(id);
  }

  const habilidadeTeste = cena.teste ? HABILIDADES.find((h) => h.id === cena.teste!.habilidade)! : null;
  const opcoesAprender = cena.aprender ? feiticosParaAprender(ficha.escola, ficha.feiticos) : [];

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <button
          className="botao botao-secundario"
          onClick={() => setVerFeiticos(!verFeiticos)}
          aria-pressed={verFeiticos}
        >
          <Icone id="interface/bola-de-cristal" /> {t(TEXTOS.feiticos, idioma)}
        </button>
      </header>

      {verFeiticos && <ListaFeiticos ficha={ficha} idioma={idioma} />}

      <ResumoMago ficha={ficha} idioma={idioma} />

      <div className="emoji-grande" aria-hidden="true">
        {comIcones(cena.emoji)}
      </div>
      <TextoNarrado
        className="texto-historia"
        idioma={idioma}
        texto={preencher(t(cena.texto, idioma), valoresTexto)}
      />

      {fase === 'luta' && cena.luta ? (
        <LutaMagica
          key={cena.id}
          idioma={idioma}
          ficha={ficha}
          inimigo={INIMIGOS_MAGO[cena.luta.inimigo]}
          aoVencer={(vida, energia) =>
            irPara(cena.luta!.aoVencer, {
              ...ficha,
              pontosDeVida: vida,
              energia: Math.min(ficha.energiaMaxima, energia + ENERGIA_POR_VITORIA),
            })
          }
        />
      ) : (
        <>
          {cena.teste && habilidadeTeste && (
            <div className="teste">
              <TextoNarrado
                idioma={idioma}
                texto={preencher(t(TEXTOS.instrucaoTeste, idioma), {
                  habilidade: t(habilidadeTeste.nome, idioma),
                  valor: ficha.habilidades[habilidadeTeste.id],
                  dificuldade: cena.teste.dificuldade,
                })}
              />
              {fase === 'teste' && <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />}
              {passou !== null && (
                <TextoNarrado
                  className="mensagem mensagem-acerto"
                  idioma={idioma}
                  texto={`${resumoTeste} ${t(passou ? TEXTOS.passou : TEXTOS.naoPassou, idioma)}`}
                />
              )}
            </div>
          )}

          {cena.aprender && (
            <div className="aprender">
              {aprendido ? (
                <TextoNarrado
                  className="mensagem mensagem-acerto"
                  idioma={idioma}
                  texto={preencher(t(TEXTOS.aprendeu, idioma), {
                    feitico: `${FEITICOS[aprendido].emoji} ${t(FEITICOS[aprendido].nome, idioma)}`,
                  })}
                />
              ) : (
                <>
                  <TextoNarrado
                    className="texto-grande"
                    idioma={idioma}
                    texto={t(TEXTOS.aprenderPergunta, idioma)}
                  />
                  <div className="lista-feiticos-luta">
                    {opcoesAprender.map((f) => (
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
          )}

          {cena.pergunta && (
            <TextoNarrado
              className="texto-grande"
              idioma={idioma}
              texto={preencher(t(cena.pergunta, idioma), valoresTexto)}
            />
          )}

          <div className="acoes">
            {cena.luta && (
              <button className="botao" onClick={() => setFase('luta')}>
                {comIcones(t(TEXTOS.lutar, idioma))}
              </button>
            )}
            {cena.teste && passou === null && (
              <button className="botao" onClick={fazerTeste} disabled={ocupado}>
                {comIcones(t(TEXTOS.lancar, idioma))}
              </button>
            )}
            {cena.teste && passou !== null && (
              <button className="botao" onClick={() => irPara(passou ? cena.teste!.sucesso : cena.teste!.falha)}>
                {comIcones(t(TEXTOS.continuar, idioma))}
              </button>
            )}
            {cena.aprender && aprendido && (
              <button className="botao" onClick={() => irPara(cena.aprender!.proxima)}>
                {comIcones(t(TEXTOS.continuar, idioma))}
              </button>
            )}
            {cena.escolhas
              ?.filter((e) => !e.escola || e.escola === ficha.escola)
              .map((escolha) => (
                <button key={escolha.proximaCena} className="botao" onClick={() => irPara(escolha.proximaCena)}>
                  {t(escolha.texto, idioma)}
                </button>
              ))}
          </div>

          {cena.fim && (
            <>
              <h2>{t(TEXTOS.fim, idioma)}</h2>
              <div className="acoes">
                <button className="botao" onClick={aoRecomecar}>
                  {t(TEXTOS.jogarDeNovo, idioma)}
                </button>
                <button className="botao botao-secundario" onClick={aoVoltar}>
                  {t(TEXTOS.voltar, idioma)}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
