import { personagemPorId, valoresPersonagem } from './personagem';
import { useState } from 'react';
import type { PropsJogo } from '../tipos';
import type { Nivel } from '../../compartilhado/niveis';
import type { PropsHistoria } from './Rpg';
import { inimigoDoNivel } from './niveis';
import { type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import type { FichaPersonagem, NomeAtributo } from './tipos';
import { ATRIBUTOS, INIMIGOS, INTELIGENCIA_PARA_TENTATIVA, LIVRO_PEDRA_DA_LUA } from './historia';
import { CriarFicha, ResumoFicha } from './Ficha';
import { Luta } from './Luta';
import { Loja, PerguntaLoja } from './Loja';
import { AventuraLivro } from './livro/AventuraLivro';
import type { Ponto } from './livro/tipos';

const TEXTOS = {
  instrucaoTeste: {
    'pt-PT': 'Lança o d20 e soma {atributo} ({valor}). Precisas de {dificuldade} ou mais.',
    'pt-BR': 'Jogue o d20 e some {atributo} ({valor}). Você precisa de {dificuldade} ou mais.',
  },
} satisfies Record<string, TextoPorIdioma>;

/** História 1: A Pedra da Lua. Guerreiro com ficha, loja, livro-jogo com puzzles, testes e lutas com dados. */
export function PedraDaLua({ idioma, aoVoltar, nivel }: PropsHistoria) {
  const [ficha, setFicha] = useState<FichaPersonagem | null>(null);
  const [etapa, setEtapa] = useState<'pergunta' | 'loja' | 'aventura'>('pergunta');

  if (!ficha) {
    return (
      <CriarFicha
        idioma={idioma}
        nivel={nivel}
        aoVoltar={aoVoltar}
        aoComecar={(nova) => {
          setFicha(nova);
          setEtapa('pergunta');
        }}
      />
    );
  }
  if (etapa === 'pergunta') {
    return (
      <PerguntaLoja
        idioma={idioma}
        ficha={ficha}
        aoVoltar={() => setFicha(null)}
        aoIrLoja={() => setEtapa('loja')}
        aoComecar={() => setEtapa('aventura')}
      />
    );
  }
  if (etapa === 'loja') {
    return (
      <Loja
        idioma={idioma}
        ficha={ficha}
        aoVoltar={() => setEtapa('pergunta')}
        aoAtualizar={setFicha}
        aoComecar={() => setEtapa('aventura')}
      />
    );
  }
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
  fichaInicial: FichaPersonagem;
  aoRecomecar: () => void;
}

function aplicarRecompensa(ficha: FichaPersonagem, ponto: Ponto<NomeAtributo>): FichaPersonagem {
  if (!ponto.recompensa) return ficha;
  const pocoes = { ...ficha.pocoes };
  for (const [id, n] of Object.entries(ponto.recompensa.pocoes ?? {})) pocoes[id] = (pocoes[id] ?? 0) + n;
  return {
    ...ficha,
    pocoes,
    pontosDeVida: ponto.recompensa.curar ? ficha.pontosDeVidaMaximos : ficha.pontosDeVida,
  };
}

/** A aventura em livro-jogo (motor em livro/AventuraLivro.tsx), com a ficha, as poções e as lutas do herói. */
function Aventura({ idioma, aoVoltar, nivel, fichaInicial, aoRecomecar }: PropsAventura) {
  const [ficha, setFicha] = useState(fichaInicial);

  return (
    <AventuraLivro
      idioma={idioma}
      nivel={nivel}
      livro={LIVRO_PEDRA_DA_LUA}
      valoresTexto={valoresPersonagem(personagemPorId('heroi', ficha.personagem))}
      teste={(atributo, dificuldade) => ({
        valor: ficha.atributos[atributo],
        instrucao: preencher(t(TEXTOS.instrucaoTeste, idioma), {
          atributo: t(ATRIBUTOS.find((a) => a.id === atributo)!.nome, idioma),
          valor: ficha.atributos[atributo],
          dificuldade,
        }),
      })}
      // a inteligência dá uma tentativa a mais nos puzzles
      tentativasExtras={ficha.atributos.inteligencia >= INTELIGENCIA_PARA_TENTATIVA ? 1 : 0}
      resumo={<ResumoFicha ficha={ficha} idioma={idioma} />}
      aoEntrar={(ponto) => setFicha((atual) => aplicarRecompensa(atual, ponto))}
      luta={(ponto, vencer) => (
        <Luta
          key={ponto.id}
          idioma={idioma}
          ficha={ficha}
          inimigo={inimigoDoNivel(INIMIGOS[ponto.luta!.inimigo], nivel)}
          aoVencer={(vida, pocoes) => {
            setFicha((atual) => ({ ...atual, pontosDeVida: vida, pocoes }));
            vencer();
          }}
        />
      )}
      aoVoltar={aoVoltar}
      aoRecomecar={aoRecomecar}
    />
  );
}
