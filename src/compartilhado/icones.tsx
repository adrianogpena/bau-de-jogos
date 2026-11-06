import { Fragment, type ReactNode } from 'react';

/** Pasta das imagens dos ícones (public/imagens/icones). */
const PASTA = `${import.meta.env.BASE_URL}imagens/icones/`;

/**
 * Emojis que viram desenho do app, em qualquer texto. Os que têm mais de um sentido
 * (ex.: o 🌙 da categoria "Mil e Uma Noites") usam a forma `[[pasta/nome]]` direto nos dados.
 * Emojis que não estão aqui continuam como emoji.
 */
const EMOJIS: Record<string, string> = {
  // interface
  '❤': 'interface/coracao',
  '🤍': 'interface/coracao-vazio',
  '💔': 'interface/coracao-partido',
  '🛡': 'interface/escudo',
  '🧪': 'interface/pocao',
  '🎲': 'interface/dado',
  '⚔': 'interface/espadas',
  '🛒': 'interface/carrinho-loja',
  '📜': 'interface/pergaminho',
  '🗺': 'interface/mapa',
  '🔑': 'interface/chave',
  '⭐': 'interface/estrela',
  '☆': 'interface/estrela-vazia',
  '✅': 'interface/check',
  '✔': 'interface/check',
  '✕': 'interface/fechar',
  '💡': 'interface/lampada-dica',
  '🎉': 'interface/confete',
  '🏆': 'interface/trofeu',
  '🍀': 'interface/trevo',
  '🎯': 'interface/alvo',
  '💥': 'interface/explosao',
  '🔮': 'interface/bola-de-cristal',
  '🧘': 'interface/meditar',
  '🧙': 'interface/chapeu-de-mago',
  '💖': 'interface/cura',
  '✨': 'interface/faisca-magica',
  '💪': 'interface/forca',
  '⚡': 'interface/agilidade',
  '❔': 'interface/carta-virada',
  '➜': 'interface/seta-continuar',
  // menu
  '🐉': 'menu/jogo-rpg',
  '✏': 'menu/jogo-escrita',
  '📖': 'menu/jogo-leitura',
  '🔐': 'menu/jogo-escape',
  '🔍': 'menu/jogo-achar',
  // avatares antigos (fichas salvas com emoji)
  '🦊': 'menu/categoria-fabulas',
  '🐻': 'extras/ursinho',
  '🦁': 'historias/leao-rato',
  '🐰': 'cenas/coelho',
  // cenas e símbolos
  '🌲': 'cenas/floresta',
  '🌊': 'cenas/rio',
  '⛰': 'cenas/montanha',
  '🌉': 'cenas/ponte',
  '🐸': 'inimigos/sapo-gigante',
  '🔦': 'cenas/tunel-lanterna',
  '🌙': 'cenas/lua',
  '🌅': 'extras/amanhecer',
  '🌞': 'extras/meio-dia',
  '🌇': 'extras/por-do-sol',
  '🗝': 'extras/chave-antiga',
  '🧠': 'extras/inteligencia',
  '🧸': 'extras/ursinho',
  '🚂': 'extras/trenzinho',
  '🪁': 'extras/pipa',
  '🎈': 'extras/balao-de-festa',
  '📚': 'cenas/biblioteca',
  '🔥': 'feiticos/chama',
  '❄': 'feiticos/congelar',
  '🌿': 'feiticos/folhas-curativas',
  '🤗': 'cenas/abraco',
};

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const CHAVES = Object.keys(EMOJIS).sort((a, b) => b.length - a.length);
/** `[[pasta/nome]]` ou um dos emojis acima (com ou sem o seletor de emoji U+FE0F). */
const PADRAO = new RegExp(`\\[\\[([a-z0-9/-]+)\\]\\]|(${CHAVES.map(escapar).join('|')})\\uFE0F?`, 'g');

export function Icone({ id, alt = '' }: { id: string; alt?: string }) {
  return <img className="icone-texto" src={`${PASTA}${id}.png`} alt={alt} draggable={false} />;
}

/** Troca os emojis conhecidos e os `[[pasta/nome]]` do texto pelos desenhos do app. */
export function comIcones(texto: string): ReactNode {
  PADRAO.lastIndex = 0;
  if (!PADRAO.test(texto)) return texto;
  PADRAO.lastIndex = 0;
  const partes: ReactNode[] = [];
  let fim = 0;
  let achado: RegExpExecArray | null;
  while ((achado = PADRAO.exec(texto)) !== null) {
    if (achado.index > fim) partes.push(texto.slice(fim, achado.index));
    partes.push(<Icone key={achado.index} id={achado[1] ?? EMOJIS[achado[2]]} />);
    fim = achado.index + achado[0].length;
  }
  if (fim < texto.length) partes.push(texto.slice(fim));
  return <Fragment>{partes}</Fragment>;
}
