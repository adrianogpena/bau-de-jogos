import { useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import type { Cena, FichaPersonagem } from './tipos';
import { ATRIBUTOS, CENAS, CENA_INICIAL, INIMIGOS } from './historia';
import { CriarFicha, ResumoFicha } from './Ficha';
import { Luta } from './Luta';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  lutar: { 'pt-PT': '⚔️ Lutar!', 'pt-BR': '⚔️ Lutar!' },
  lancar: { 'pt-PT': '🎲 Lançar o dado', 'pt-BR': '🎲 Jogar o dado' },
  instrucaoTeste: {
    'pt-PT': 'Lança o d20 e soma {atributo} ({valor}). Precisas de {dificuldade} ou mais.',
    'pt-BR': 'Jogue o d20 e some {atributo} ({valor}). Você precisa de {dificuldade} ou mais.',
  },
  resultado: {
    'pt-PT': 'Tiraste {dado} + {valor} = {total}.',
    'pt-BR': 'Você tirou {dado} + {valor} = {total}.',
  },
  passou: { 'pt-PT': 'Conseguiste! 🎉', 'pt-BR': 'Você conseguiu! 🎉' },
  naoPassou: { 'pt-PT': 'Não deu... mas a aventura continua!', 'pt-BR': 'Não deu... mas a aventura continua!' },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  fim: { 'pt-PT': 'Fim da aventura! 🏆', 'pt-BR': 'Fim da aventura! 🏆' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
} satisfies Record<string, TextoPorIdioma>;

/** Jogo 3: aventura com ficha de personagem, testes e lutas com dados. */
export function Rpg({ idioma, aoVoltar }: PropsJogo) {
  const [ficha, setFicha] = useState<FichaPersonagem | null>(null);

  if (!ficha) {
    return <CriarFicha idioma={idioma} aoVoltar={aoVoltar} aoComecar={setFicha} />;
  }
  return (
    <Aventura
      key={ficha.nome + ficha.avatar}
      idioma={idioma}
      aoVoltar={aoVoltar}
      fichaInicial={ficha}
      aoRecomecar={() => setFicha(null)}
    />
  );
}

interface PropsAventura extends PropsJogo {
  fichaInicial: FichaPersonagem;
  aoRecomecar: () => void;
}

type Fase = 'cena' | 'luta' | 'teste';

function aplicarRecompensa(ficha: FichaPersonagem, cena: Cena): FichaPersonagem {
  if (!cena.recompensa) return ficha;
  return {
    ...ficha,
    pocoes: ficha.pocoes + (cena.recompensa.pocoes ?? 0),
    pontosDeVida: cena.recompensa.curar ? ficha.pontosDeVidaMaximos : ficha.pontosDeVida,
  };
}

function Aventura({ idioma, aoVoltar, fichaInicial, aoRecomecar }: PropsAventura) {
  const [ficha, setFicha] = useState(() => aplicarRecompensa(fichaInicial, CENAS[CENA_INICIAL]));
  const [cenaId, setCenaId] = useState(CENA_INICIAL);
  const [fase, setFase] = useState<Fase>('cena');
  const [passou, setPassou] = useState<boolean | null>(null);
  const [resumoTeste, setResumoTeste] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const dado = usarDado();

  const cena = CENAS[cenaId];

  function irPara(id: string, fichaAtual: FichaPersonagem = ficha) {
    setFicha(aplicarRecompensa(fichaAtual, CENAS[id]));
    setCenaId(id);
    setFase('cena');
    setPassou(null);
    setResumoTeste('');
  }

  async function fazerTeste() {
    if (!cena.teste || ocupado) return;
    setOcupado(true);
    setFase('teste');
    const d20 = await dado.rolar(20);
    const valor = ficha.atributos[cena.teste.atributo];
    const total = d20 + valor;
    const ok = total >= cena.teste.dificuldade;
    ok ? somAcerto() : somTentarDeNovo();
    setPassou(ok);
    setResumoTeste(preencher(t(TEXTOS.resultado, idioma), { dado: d20, valor, total }));
    setOcupado(false);
  }

  const nomeAtributo = cena.teste
    ? t(ATRIBUTOS.find((a) => a.id === cena.teste!.atributo)!.nome, idioma)
    : '';

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <ResumoFicha ficha={ficha} idioma={idioma} />

      <div className="emoji-grande" aria-hidden="true">
        {cena.emoji}
      </div>
      <TextoNarrado
        className="texto-historia"
        idioma={idioma}
        texto={preencher(t(cena.texto, idioma), { nome: ficha.nome })}
      />

      {fase === 'luta' && cena.luta ? (
        <Luta
          key={cena.id}
          idioma={idioma}
          ficha={ficha}
          inimigo={INIMIGOS[cena.luta.inimigo]}
          aoVencer={(vida, pocoes) => irPara(cena.luta!.aoVencer, { ...ficha, pontosDeVida: vida, pocoes })}
        />
      ) : (
        <>
          {cena.teste && (
            <div className="teste">
              <TextoNarrado
                idioma={idioma}
                texto={preencher(t(TEXTOS.instrucaoTeste, idioma), {
                  atributo: nomeAtributo,
                  valor: ficha.atributos[cena.teste.atributo],
                  dificuldade: cena.teste.dificuldade,
                })}
              />
              {fase === 'teste' && <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />}
              {passou !== null && (
                <>
                  <TextoNarrado
                    className="mensagem mensagem-acerto"
                    idioma={idioma}
                    texto={`${resumoTeste} ${t(passou ? TEXTOS.passou : TEXTOS.naoPassou, idioma)}`}
                  />
                </>
              )}
            </div>
          )}

          <div className="acoes">
            {cena.luta && (
              <button className="botao" onClick={() => setFase('luta')}>
                {t(TEXTOS.lutar, idioma)}
              </button>
            )}
            {cena.teste && passou === null && (
              <button className="botao" onClick={fazerTeste} disabled={ocupado}>
                {t(TEXTOS.lancar, idioma)}
              </button>
            )}
            {cena.teste && passou !== null && (
              <button
                className="botao"
                onClick={() => irPara(passou ? cena.teste!.sucesso : cena.teste!.falha)}
              >
                {t(TEXTOS.continuar, idioma)}
              </button>
            )}
            {cena.escolhas?.map((escolha) => (
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
