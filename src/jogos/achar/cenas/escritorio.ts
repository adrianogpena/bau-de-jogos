import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena do Escritório (cantinho de estudo). Fundo em `public/imagens/achar/fundos/escritorio.jpg`,
 * itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (livros, plantas, mapa-múndi).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Em cima da secretária (dos lados da cadeira). */
const SECRETARIA = lugar([38, 51], [42, 52], [57, 51], [61, 52]);
/** Em cima da cómoda. */
const COMODA = lugar([10, 56], [17, 55], [24, 53]);
/** Na estante (cubículo vazio e topo). */
const ESTANTE = lugar([77, 48], [76, 22], [81, 22]);
/** No peitoril da janela. */
const PEITORIL = lugar([88, 56], [93, 55]);
/** Dentro do cesto do lixo. */
const LIXO = lugar([82, 65]);
/** No tapete. */
const TAPETE = lugar([34, 89], [42, 84], [50, 89], [58, 84], [66, 89], [72, 84], [50, 80]);
/** No chão de madeira. */
const CHAO = lugar([10, 92], [22, 96], [40, 96], [60, 96], [78, 96], [90, 90], [91, 78], [34, 72], [66, 75], [75, 78]);
/** Na parede do fundo. */
const PAREDE = lugar([38, 28], [48, 24], [57, 32]);

export const escritorio: Cena = {
  id: 'escritorio',
  emoji: '✏️',
  titulo: { 'pt-PT': 'O Escritório', 'pt-BR': 'O Escritório' },
  resumo: {
    'pt-PT': 'Perdeu-se material de estudo por todo o escritório. Consegues encontrar tudo?',
    'pt-BR': 'Sumiu material de estudo pelo escritório todo. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/fundos/escritorio.jpg',
  fundoCss: 'linear-gradient(180deg, #f7e3a0 0%, #f7e3a0 66%, #d9a766 66%, #c89050 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 12, x2: 90, y1: 72, y2: 97 },
  itens: [
    // Material de escrita e escritório
    item('caneta', 'caneta', 6, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO, ...PEITORIL]),
    item('regua', 'régua', 11, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('caderno', 'caderno', 9, [...SECRETARIA, ...COMODA, ...TAPETE, ...PEITORIL]),
    item('agrafador', ['agrafador', 'grampeador'], 8, [...SECRETARIA, ...COMODA, ...PEITORIL]),
    item('clipe', 'clipe', 4, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('cola', 'cola', 6, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('calculadora', 'calculadora', 8, [...SECRETARIA, ...COMODA, ...PEITORIL]),
    item('apara-lapis', ['apara-lápis', 'apontador'], 5, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('fita-cola', ['fita-cola', 'fita adesiva'], 6, [...SECRETARIA, ...COMODA, ...TAPETE]),
    item('envelope', 'envelope', 9, [...SECRETARIA, ...COMODA, ...LIXO, ...TAPETE]),
    item('pasta', 'pasta', 10, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('tinteiro', 'tinteiro', 7, [...SECRETARIA, ...COMODA, ...ESTANTE]),
    item('lapis', 'lápis', 7, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('pincel', 'pincel', 8, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('giz-de-cera', ['lápis de cera', 'giz de cera'], 8, [...SECRETARIA, ...COMODA, ...TAPETE, ...PEITORIL]),
    item('tesoura', 'tesoura', 8, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('diario', 'diário', 9, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),

    // Explorador e coisas da secretária
    item('cadeado', 'cadeado', 6, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('chave', 'chave', 6, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE, ...CHAO]),
    item('bussola', 'bússola', 7, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('candeeiro-mesa', ['candeeiro de secretária', 'luminária de mesa'], 10, [...SECRETARIA, ...COMODA, ...ESTANTE]),
    item('mapa', 'mapa', 12, [...SECRETARIA, ...TAPETE, ...CHAO, ...COMODA]),
    item('lupa', 'lupa', 8, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('globo', 'globo terrestre', 9, [...SECRETARIA, ...COMODA, ...ESTANTE]),
    item('mochila', 'mochila', 11, [...CHAO, ...TAPETE]),
    item('telefone', 'telefone', 8, [...SECRETARIA, ...COMODA, ...PEITORIL]),
    item('relogio-pulso', 'relógio de pulso', 6, [...SECRETARIA, ...COMODA, ...PEITORIL, ...TAPETE]),
    item('moeda', 'moeda', 5, [...SECRETARIA, ...COMODA, ...TAPETE, ...CHAO]),
    item('despertador', 'despertador', 8, [...SECRETARIA, ...COMODA, ...ESTANTE, ...PEITORIL]),
    item('relogio-parede', 'relógio de parede', 8, PAREDE),
  ],
};
