import type { Idioma, TextoPorIdioma } from '../../compartilhado/idioma';
import type { FichaPersonagem } from './tipos';

/** Moedas: 1 ouro vale 10 pratas. Os preços e o dinheiro são guardados em pratas. */
export const PRATAS_POR_OURO = 10;
export const MOEDAS_INICIAIS = 105; // 10 ouro e 5 prata

export type TipoItem = 'arma' | 'armadura' | 'escudo' | 'pocao';
export type EfeitoPocao = 'cura' | 'precisao' | 'forca';

export interface Item {
  id: string;
  tipo: TipoItem;
  emoji: string;
  nome: TextoPorIdioma;
  descricao: TextoPorIdioma;
  /** Preço em pratas. */
  preco: number;
  /** Arma: somado ao dano. */
  bonusDano?: number;
  /** Arma: somado ao d20 para acertar. */
  bonusAtaque?: number;
  /** Armadura: somado à CA (classe de armadura). */
  bonusCA?: number;
  efeito?: EfeitoPocao;
  /** Poção: quanto cura (somado ao d6) ou quanto aumenta. */
  valor?: number;
}

/** Quanto o escudo soma à CA no próximo ataque do inimigo (ação bônus). */
export const BONUS_ESCUDO = 3;

export const ITENS: Record<string, Item> = {
  adaga: {
    id: 'adaga',
    tipo: 'arma',
    emoji: '🗡️',
    nome: { 'pt-PT': 'Adaga', 'pt-BR': 'Adaga' },
    descricao: {
      'pt-PT': 'Pequena e rápida: +1 para acertar e +1 de dano.',
      'pt-BR': 'Pequena e rápida: +1 para acertar e +1 de dano.',
    },
    preco: 20,
    bonusAtaque: 1,
    bonusDano: 1,
  },
  espada: {
    id: 'espada',
    tipo: 'arma',
    emoji: '⚔️',
    nome: { 'pt-PT': 'Espada', 'pt-BR': 'Espada' },
    descricao: { 'pt-PT': '+2 de dano em cada golpe.', 'pt-BR': '+2 de dano em cada golpe.' },
    preco: 50,
    bonusDano: 2,
  },
  machado: {
    id: 'machado',
    tipo: 'arma',
    emoji: '🪓',
    nome: { 'pt-PT': 'Machado', 'pt-BR': 'Machado' },
    descricao: {
      'pt-PT': 'Pesado e forte: +4 de dano em cada golpe.',
      'pt-BR': 'Pesado e forte: +4 de dano em cada golpe.',
    },
    preco: 80,
    bonusDano: 4,
  },
  couro: {
    id: 'couro',
    tipo: 'armadura',
    emoji: '🧥',
    nome: { 'pt-PT': 'Roupa de couro', 'pt-BR': 'Roupa de couro' },
    descricao: { 'pt-PT': '+1 de CA (armadura).', 'pt-BR': '+1 de CA (armadura).' },
    preco: 30,
    bonusCA: 1,
  },
  malha: {
    id: 'malha',
    tipo: 'armadura',
    emoji: '⛓️',
    nome: { 'pt-PT': 'Cota de malha', 'pt-BR': 'Cota de malha' },
    descricao: { 'pt-PT': '+2 de CA (armadura).', 'pt-BR': '+2 de CA (armadura).' },
    preco: 60,
    bonusCA: 2,
  },
  placas: {
    id: 'placas',
    tipo: 'armadura',
    emoji: '🪖',
    nome: { 'pt-PT': 'Armadura de placas', 'pt-BR': 'Armadura de placas' },
    descricao: { 'pt-PT': '+3 de CA (armadura).', 'pt-BR': '+3 de CA (armadura).' },
    preco: 100,
    bonusCA: 3,
  },
  escudo: {
    id: 'escudo',
    tipo: 'escudo',
    emoji: '🛡️',
    nome: { 'pt-PT': 'Escudo', 'pt-BR': 'Escudo' },
    descricao: {
      'pt-PT': `Como ação bónus, levanta o escudo: ganhas +${BONUS_ESCUDO} de CA no próximo ataque do inimigo.`,
      'pt-BR': `Como ação bônus, levante o escudo: você ganha +${BONUS_ESCUDO} de CA no próximo ataque do inimigo.`,
    },
    preco: 40,
  },
  cura: {
    id: 'cura',
    tipo: 'pocao',
    emoji: '🧪',
    nome: { 'pt-PT': 'Poção de cura', 'pt-BR': 'Poção de cura' },
    descricao: { 'pt-PT': 'Recupera vida: d6 + 3.', 'pt-BR': 'Recupera vida: d6 + 3.' },
    preco: 15,
    efeito: 'cura',
    valor: 3,
  },
  cura_grande: {
    id: 'cura_grande',
    tipo: 'pocao',
    emoji: '💖',
    nome: { 'pt-PT': 'Poção de cura grande', 'pt-BR': 'Poção de cura grande' },
    descricao: { 'pt-PT': 'Recupera muita vida: d6 + 6.', 'pt-BR': 'Recupera muita vida: d6 + 6.' },
    preco: 35,
    efeito: 'cura',
    valor: 6,
  },
  precisao: {
    id: 'precisao',
    tipo: 'pocao',
    emoji: '🎯',
    nome: { 'pt-PT': 'Poção de pontaria', 'pt-BR': 'Poção de pontaria' },
    descricao: {
      'pt-PT': '+3 para acertar até ao fim da luta.',
      'pt-BR': '+3 para acertar até o fim da luta.',
    },
    preco: 25,
    efeito: 'precisao',
    valor: 3,
  },
  forca: {
    id: 'forca',
    tipo: 'pocao',
    emoji: '💥',
    nome: { 'pt-PT': 'Poção de força', 'pt-BR': 'Poção de força' },
    descricao: {
      'pt-PT': '+2 de dano até ao fim da luta.',
      'pt-BR': '+2 de dano até o fim da luta.',
    },
    preco: 25,
    efeito: 'forca',
    valor: 2,
  },
};

export const CATEGORIAS: { id: string; emoji: string; nome: TextoPorIdioma; tipos: TipoItem[] }[] = [
  { id: 'armas', emoji: '⚔️', nome: { 'pt-PT': 'Armas', 'pt-BR': 'Armas' }, tipos: ['arma'] },
  { id: 'defesa', emoji: '🛡️', nome: { 'pt-PT': 'Defesa', 'pt-BR': 'Defesa' }, tipos: ['armadura', 'escudo'] },
  { id: 'pocoes', emoji: '🧪', nome: { 'pt-PT': 'Poções', 'pt-BR': 'Poções' }, tipos: ['pocao'] },
];

export function nomeItem(item: Item, idioma: Idioma): string {
  return item.nome[idioma];
}

/** Números do herói em luta, já com arma e armadura. */
export function estatisticas(ficha: FichaPersonagem) {
  const arma = ficha.arma ? ITENS[ficha.arma] : undefined;
  const armadura = ficha.armadura ? ITENS[ficha.armadura] : undefined;
  return {
    ca: 10 + ficha.atributos.agilidade + (armadura?.bonusCA ?? 0),
    bonusAtaque: ficha.atributos.forca + (arma?.bonusAtaque ?? 0),
    bonusDano: Math.floor(ficha.atributos.forca / 2) + (arma?.bonusDano ?? 0),
  };
}

export function totalPocoes(ficha: FichaPersonagem): number {
  return Object.values(ficha.pocoes).reduce((soma, n) => soma + n, 0);
}
