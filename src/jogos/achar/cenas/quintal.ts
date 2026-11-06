import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena do Quintal (jardim). Fundo em `public/imagens/achar/fundos/quintal.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (árvore, baloiço, banco, arbustos e flores do canteiro).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Na relva. */
const GRAMA = lugar([11, 72], [17, 79], [26, 76], [34, 72], [58, 72], [64, 79], [72, 80], [55, 88], [63, 91], [48, 92], [28, 88]);
/** Nas pedras do caminho. */
const PEDRAS = lugar([52, 64], [56, 67], [48, 75], [44, 80], [37, 92]);
/** No banco do jardim. */
const BANCO = lugar([69, 63], [75, 63], [81, 64]);
/** No assento do baloiço. */
const BALANCO = lugar([36, 58]);
/** Nos ramos da árvore. */
const GALHO = lugar([32, 29], [37, 28], [43, 25]);
/** No telhado do barracão. */
const TELHADO = lugar([42, 38], [49, 37]);
/** Em cima da cerca. */
const CERCA = lugar([7, 40], [14, 41], [70, 42], [76, 42], [82, 41]);
/** Na terra dos canteiros. */
const CANTEIRO = lugar([7, 67], [13, 66], [88, 74], [20, 69]);
/** Entre as flores da esquerda (margaridas e lavanda). */
const FLORES_ESQ = lugar([7, 84], [12, 88], [19, 85]);
/** Entre as flores da direita (papoilas e rosas). */
const FLORES_DIR = lugar([82, 86], [90, 84], [95, 92]);
const FLORES = [...FLORES_ESQ, ...FLORES_DIR];

export const quintal: Cena = {
  id: 'quintal',
  emoji: '🌳',
  titulo: { 'pt-PT': 'O Quintal', 'pt-BR': 'O Quintal' },
  resumo: {
    'pt-PT': 'Há coisas escondidas no jardim todo. Consegues encontrá-las?',
    'pt-BR': 'Tem coisa escondida pelo jardim todo. Você consegue achar?',
  },
  fundo: 'imagens/achar/fundos/quintal.jpg',
  fundoCss: 'linear-gradient(180deg, #bfe0f5 0%, #bfe0f5 45%, #8fc46a 45%, #6fae4f 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 12, x2: 76, y1: 70, y2: 92 },
  itens: [
    // Ferramentas de jardim
    item('regador', 'regador', 11, [...GRAMA, ...PEDRAS, ...BANCO, ...CANTEIRO]),
    item('pa-jardim', 'pá', 10, [...GRAMA, ...CANTEIRO, ...PEDRAS]),
    item('ancinho', 'ancinho', 12, [...GRAMA, ...CANTEIRO]),
    item('mangueira', 'mangueira', 11, [...GRAMA, ...PEDRAS]),
    item('luvas-jardim', ['luvas de jardinagem', 'luvas de jardinagem'], 8, [...GRAMA, ...BANCO, ...CANTEIRO, ...PEDRAS]),
    item('balde', 'balde', 9, [...GRAMA, ...PEDRAS, ...CANTEIRO]),

    // Plantas
    item('flor', 'flor', 7, [...GRAMA, ...CANTEIRO, ...FLORES]),
    item('girassol', 'girassol', 9, [...GRAMA, ...CANTEIRO]),
    item('cogumelo', 'cogumelo', 7, [...GRAMA, ...CANTEIRO]),
    item('pinha', 'pinha', 6, [...GRAMA, ...PEDRAS, ...CANTEIRO]),
    item('folha', 'folha', 6, [...GRAMA, ...PEDRAS, ...BANCO, ...GALHO]),

    // Bichinhos
    item('joaninha', 'joaninha', 4, [...FLORES, ...PEDRAS, ...GRAMA, ...BANCO]),
    item('borboleta', 'borboleta', 6, [...FLORES, ...GALHO, ...BANCO, ...CANTEIRO]),
    item('caracol', 'caracol', 6, [...PEDRAS, ...GRAMA, ...CANTEIRO]),
    item('minhoca', 'minhoca', 6, [...GRAMA, ...PEDRAS, ...CANTEIRO]),
    item('abelha', 'abelha', 5, [...FLORES, ...CANTEIRO, ...GALHO]),
    item('sapo', 'sapo', 8, [...GRAMA, ...PEDRAS, ...CANTEIRO]),
    item('passaro', ['pássaro', 'passarinho'], 7, [...GALHO, ...CERCA, ...TELHADO, ...BANCO, ...BALANCO]),
    item('ninho', 'ninho', 8, [...GALHO, ...CERCA, ...TELHADO]),
    item('casa-passaro', ['casa de pássaros', 'casinha de passarinho'], 10, [...TELHADO, ...GRAMA, ...BANCO, ...CERCA]),
    item('coelho', 'coelho', 10, [...GRAMA, ...PEDRAS]),

    // Brincadeiras e coisas de passeio
    item('bola', 'bola', 8, [...GRAMA, ...PEDRAS]),
    item('pipa', ['papagaio de papel', 'pipa'], 11, [...GRAMA, ...BANCO]),
    item('raquete', 'raquete', 10, [...GRAMA, ...BANCO]),
    item('bicicleta', 'bicicleta', 16, GRAMA),
    item('lanterna', 'lanterna', 7, [...BANCO, ...GRAMA]),
    item('guarda-chuva', 'guarda-chuva', 11, [...BANCO, ...GRAMA]),
    item('cesto', 'cesto', 11, [...GRAMA, ...BANCO]),
    item('prato', 'prato', 8, [...BANCO, ...GRAMA]),
    item('garrafa', 'garrafa', 7, [...BANCO, ...GRAMA, ...PEDRAS]),
    item('chinelo', 'chinelo', 9, [...GRAMA, ...PEDRAS]),
    item('sandalia', 'sandália', 9, [...GRAMA, ...PEDRAS]),
    item('galochas', ['galochas', 'botas de chuva'], 10, [...GRAMA, ...PEDRAS]),
    item('oculos-sol', 'óculos de sol', 7, [...BANCO, ...GRAMA]),
    item('impermeavel', ['impermeável', 'capa de chuva'], 12, [...BANCO, ...GRAMA]),
    item('chapeu-palha', 'chapéu de palha', 12, [...BANCO, ...GRAMA]),
  ],
};
