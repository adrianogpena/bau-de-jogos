import { useState } from 'react';
import type { ComponentType } from 'react';
import type { PropsJogo } from '../tipos';
import { type TextoPorIdioma, t } from '../../compartilhado/idioma';
import { PedraDaLua } from './PedraDaLua';
import { TorreEncantada } from './mago/AventuraMago';
import { Icone, comIcones } from '../../compartilhado/icones';

interface Historia {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  descricao: TextoPorIdioma;
  /** O que torna esta história diferente das outras. */
  destaque: TextoPorIdioma;
  componente: ComponentType<PropsJogo>;
}

/** Histórias do RPG. Para adicionar uma história nova, registre-a aqui. */
const HISTORIAS: Historia[] = [
  {
    id: 'pedra-da-lua',
    emoji: '[[historias/rpg-pedra-da-lua]]',
    titulo: { 'pt-PT': 'A Pedra da Lua', 'pt-BR': 'A Pedra da Lua' },
    descricao: {
      'pt-PT': 'O Goblin Chefe roubou a Pedra da Lua e o céu ficou escuro. Só o teu herói a pode trazer de volta!',
      'pt-BR': 'O Goblin Chefe roubou a Pedra da Lua e o céu ficou escuro. Só o seu herói pode trazê-la de volta!',
    },
    destaque: {
      'pt-PT': '⚔️ Espadas, loja, mapa com enigmas e lutas',
      'pt-BR': '⚔️ Espadas, loja, mapa com enigmas e lutas',
    },
    componente: PedraDaLua,
  },
  {
    id: 'torre-encantada',
    emoji: '[[historias/rpg-torre-encantada]]',
    titulo: { 'pt-PT': 'A Torre Encantada', 'pt-BR': 'A Torre Encantada' },
    descricao: {
      'pt-PT': 'Uma estrela caiu na torre dos magos e a magia ficou baralhada. Sobe até ao topo e descobre porquê!',
      'pt-BR': 'Uma estrela caiu na torre dos magos e a magia ficou bagunçada. Suba até o topo e descubra por quê!',
    },
    destaque: {
      'pt-PT': '🧙 Escolhe o teu tipo de mago e usa feitiços',
      'pt-BR': '🧙 Escolha seu tipo de mago e use feitiços',
    },
    componente: TorreEncantada,
  },
];

const TEXTOS = {
  escolha: { 'pt-PT': 'Escolhe a tua história!', 'pt-BR': 'Escolha sua história!' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
} satisfies Record<string, TextoPorIdioma>;

/** Jogo 3: Aventura RPG. A criança escolhe qual história quer viver. */
export function Rpg({ idioma, aoVoltar }: PropsJogo) {
  const [historiaId, setHistoriaId] = useState<string | null>(null);
  const historia = HISTORIAS.find((h) => h.id === historiaId);

  if (historia) {
    const Componente = historia.componente;
    return <Componente idioma={idioma} aoVoltar={() => setHistoriaId(null)} />;
  }

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1><Icone id="menu/jogo-rpg" /> {t(TEXTOS.escolha, idioma)}</h1>

      <section className="grade-jogos">
        {HISTORIAS.map((h) => (
          <button key={h.id} className="cartao-jogo" onClick={() => setHistoriaId(h.id)}>
            <span className="emoji-grande" aria-hidden="true">
              {comIcones(h.emoji)}
            </span>
            <strong>{t(h.titulo, idioma)}</strong>
            <span>{t(h.descricao, idioma)}</span>
            <small>{comIcones(t(h.destaque, idioma))}</small>
          </button>
        ))}
      </section>
    </main>
  );
}
