import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena da Sala. Fundo em `public/imagens/achar/fundos/sala.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (livros, planta da estante, candeeiro de pé).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Assento do sofá. */
const SOFA = lugar([42, 58], [52, 59], [62, 58]);
/** Assento da poltrona. */
const POLTRONA = lugar([26, 64]);
/** Em cima da mesa de centro. */
const MESA = lugar([46, 67], [58, 67]);
/** No tapete. */
const TAPETE = lugar([24, 88], [34, 83], [45, 88], [56, 89], [67, 83], [78, 88], [52, 82]);
/** No chão de madeira. */
const CHAO = lugar([16, 92], [30, 96], [50, 97], [72, 96], [90, 92], [94, 82]);
/** Em cima da estante. */
const ESTANTE = lugar([74, 14], [83, 14]);
/** Na parede, entre a janela e a estante. */
const PAREDE = lugar([50, 25], [58, 33]);

export const sala: Cena = {
  id: 'sala',
  emoji: '[[menu/comodo-sala]]',
  titulo: { 'pt-PT': 'A Sala', 'pt-BR': 'A Sala' },
  resumo: {
    'pt-PT': 'Há coisas perdidas pela sala toda. Consegues encontrá-las?',
    'pt-BR': 'Tem coisa perdida pela sala toda. Você consegue achar?',
  },
  fundo: 'imagens/achar/fundos/sala.jpg',
  fundoCss: 'linear-gradient(180deg, #f6e08a 0%, #f6e08a 66%, #d9a766 66%, #c89050 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 14, x2: 92, y1: 74, y2: 96 },
  itens: [
    // Jogos e música
    item('controle-remoto', ['comando', 'controle remoto'], 6, [...SOFA, ...MESA, ...POLTRONA, ...TAPETE, ...CHAO]),
    item('quebra-cabeca', ['puzzle', 'quebra-cabeça'], 9, [...MESA, ...TAPETE, ...CHAO, ...SOFA]),
    item('domino', 'dominó', 6, [...MESA, ...TAPETE, ...SOFA]),
    item('damas', 'jogo de damas', 10, [...MESA, ...TAPETE]),
    item('novelo', 'novelo de lã', 8, [...POLTRONA, ...SOFA, ...TAPETE, ...CHAO]),
    item('violao', ['guitarra', 'violão'], 12, [...SOFA, ...TAPETE, ...CHAO]),
    item('flauta', 'flauta', 8, [...MESA, ...SOFA, ...TAPETE, ...CHAO]),
    item('maracas', 'maracas', 8, [...MESA, ...TAPETE, ...SOFA, ...CHAO]),
    item('pandeiro', ['pandeireta', 'pandeiro'], 9, [...TAPETE, ...SOFA, ...CHAO, ...POLTRONA]),
    item('gato-pelucia', ['gato de peluche', 'gato de pelúcia'], 10, [...SOFA, ...POLTRONA, ...TAPETE, ...CHAO]),

    // Coisas da casa
    item('porta-retrato', ['moldura', 'porta-retratos'], 8, [...MESA, ...ESTANTE, ...PAREDE]),
    item('vaso-flor', 'vaso com flor', 8, [...MESA, ...ESTANTE]),
    item('jornal', 'jornal', 9, [...SOFA, ...MESA, ...POLTRONA, ...TAPETE]),
    item('oculos', 'óculos', 7, [...SOFA, ...MESA, ...POLTRONA, ...TAPETE]),
    item('almofada', 'almofada', 10, [...SOFA, ...POLTRONA, ...CHAO]),
    item('relogio-parede', 'relógio de parede', 8, PAREDE),
    item('chavena', ['chávena', 'xícara'], 7, MESA),
    item('telefone', 'telefone', 8, [...MESA, ...SOFA, ...TAPETE]),
    item('moeda', 'moeda', 5, [...MESA, ...SOFA, ...TAPETE]),
    item('oculos-sol', 'óculos de sol', 7, [...MESA, ...SOFA, ...POLTRONA]),
    item('guarda-chuva', 'guarda-chuva', 11, CHAO),
    item('meia', 'meia', 6, [...TAPETE, ...CHAO, ...SOFA]),
    item('globo', 'globo terrestre', 9, [...MESA, ...ESTANTE]),

    // Brinquedos e material de desenho
    item('bola', 'bola', 8, [...TAPETE, ...CHAO]),
    item('ursinho', ['urso de peluche', 'ursinho'], 10, [...SOFA, ...POLTRONA, ...TAPETE]),
    item('boneca', 'boneca', 10, [...SOFA, ...POLTRONA, ...TAPETE]),
    item('carro', ['carrinho', 'carrinho'], 9, [...TAPETE, ...CHAO]),
    item('blocos', ['cubos de construção', 'blocos de montar'], 9, [...TAPETE, ...MESA]),
    item('aviao', 'avião', 11, [...TAPETE, ...CHAO, ...SOFA]),
    item('pipa', ['papagaio de papel', 'pipa'], 10, [...SOFA, ...TAPETE, ...CHAO]),
    item('lapis', 'lápis', 7, [...MESA, ...TAPETE, ...SOFA]),
    item('giz-de-cera', ['lápis de cera', 'giz de cera'], 8, [...MESA, ...TAPETE, ...SOFA]),
  ],
};
