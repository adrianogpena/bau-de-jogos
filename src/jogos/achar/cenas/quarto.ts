import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena do Quarto. Fundo em `public/imagens/achar/fundos/quarto.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (livros, baú, cestos, plantas, abajur).
 *
 * Cada item tem uma lista de `posicoes` permitidas; a cada rodada o jogo sorteia uma.
 * As listas são montadas juntando os "lugares" abaixo (coordenadas em % do fundo 4:3).
 * Para mudar onde algo pode aparecer, edite o lugar ou a lista do item.
 */
/** Cobertor da cama (e o travesseiro). */
const CAMA = lugar([8, 56], [16, 57], [23, 59], [14, 41]);
/** Em cima do baú, ao pé da cama. */
const BAU = lugar([6, 59], [15, 60]);
/** Em cima do criado-mudo. */
const CRIADO = lugar([37, 44]);
/** Na prateleira da parede (só coisas pequenas). */
const PRATELEIRA = lugar([12, 14]);
/** No peitoril da janela. */
const PEITORIL = lugar([44, 42], [52, 42], [60, 42]);
/** No tapete oval. */
const TAPETE = lugar([28, 82], [40, 80], [52, 84], [64, 82], [74, 84], [36, 88], [60, 89]);
/** No chão, junto à parede do fundo. */
const CHAO_FUNDO = lugar([42, 63], [50, 62], [58, 63], [66, 64], [34, 68], [72, 70]);
/** No chão, ao lado da cama. */
const CHAO_ESQ = lugar([26, 70], [22, 78], [19, 88]);
/** No chão, junto ao armário e ao cesto. */
const CHAO_DIREITA = lugar([76, 73], [82, 77]);
/** No chão, na frente do tapete. */
const CHAO_FRENTE = lugar([30, 95], [48, 95], [66, 95]);
/** Pendurado na parede. */
const PAREDE = lugar([24, 31], [54, 56]);

const CHAO = [...TAPETE, ...CHAO_FUNDO, ...CHAO_ESQ, ...CHAO_DIREITA, ...CHAO_FRENTE];
const SOBRE_MOVEIS = [...CRIADO, ...PEITORIL, ...PRATELEIRA, ...BAU];


export const quarto: Cena = {
  id: 'quarto',
  emoji: '🛏️',
  titulo: { 'pt-PT': 'O Quarto', 'pt-BR': 'O Quarto' },
  resumo: {
    'pt-PT': 'Anda tudo espalhado pelo quarto. Consegues encontrar tudo?',
    'pt-BR': 'Tem coisa espalhada pelo quarto todo. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/fundos/quarto.jpg',
  fundoCss: 'linear-gradient(180deg, #b9c8f0 0%, #b9c8f0 60%, #e0a24a 60%, #c98a35 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 22, x2: 84, y1: 62, y2: 94 },
  itens: [
    // Roupas e acessórios
    item('chapeu', 'chapéu', 12, [...CAMA, ...CHAO_FUNDO, ...TAPETE]),
    item('luva', 'luva', 7, [...CAMA, ...CRIADO, ...CHAO_ESQ, ...TAPETE, ...BAU]),
    item('cachecol', 'cachecol', 15, [...CAMA, ...CHAO_FRENTE, ...TAPETE]),
    item('meia', 'meia', 6, [...CAMA, ...CHAO_DIREITA, ...CHAO_ESQ, { x: 91, y: 80 }]),
    item('tenis', ['ténis', 'tênis'], 11, [...CHAO_ESQ, ...CHAO_DIREITA, ...TAPETE, ...CHAO_FUNDO]),
    item('camiseta', ['t-shirt', 'camiseta'], 12, [...CAMA, ...CHAO_ESQ, ...CHAO_DIREITA, ...TAPETE]),
    item('camisola', ['camisola', 'suéter'], 12, [...CAMA, ...CHAO_ESQ, ...CHAO_DIREITA, ...TAPETE]),
    item('casaco', 'casaco', 13, [...CAMA, ...CHAO_ESQ, ...CHAO_DIREITA, ...CHAO_FUNDO]),
    item('jeans', ['calças de ganga', 'calça jeans'], 11, [...CAMA, ...TAPETE, ...CHAO_FRENTE, ...CHAO_ESQ]),
    item('saia', 'saia', 11, [...CAMA, ...TAPETE, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('vestido', 'vestido', 10, [...CAMA, ...TAPETE, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('impermeavel', ['impermeável', 'capa de chuva'], 12, [...CAMA, ...CHAO_ESQ, ...CHAO_DIREITA, ...CHAO_FUNDO]),
    item('gorro', 'gorro', 8, [...CAMA, ...CRIADO, ...BAU, ...CHAO, ...PEITORIL]),
    item('chapeu-palha', ['chapéu de palha', 'chapéu de palha'], 12, [...CAMA, ...CHAO_FUNDO, ...TAPETE]),
    item('bota', 'bota', 10, [...CHAO_ESQ, ...CHAO_DIREITA, ...CHAO_FUNDO, ...TAPETE]),
    item('galochas', ['galochas', 'botas de chuva'], 11, [...CHAO_ESQ, ...CHAO_DIREITA, ...CHAO_FUNDO, ...CHAO_FRENTE]),
    item('pantufa', 'pantufa', 10, [...CHAO_ESQ, ...CHAO_FRENTE, ...CHAO_DIREITA, ...TAPETE]),
    item('sandalia', ['sandália', 'sandália'], 10, [...CHAO_ESQ, ...CHAO_FRENTE, ...CHAO_FUNDO, ...TAPETE]),

    // Brinquedos
    item('bola', 'bola', 8, [...TAPETE, ...CHAO_FUNDO, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('carro', ['carro', 'carrinho'], 9, [...TAPETE, ...CHAO_FUNDO, ...CHAO_DIREITA, ...CAMA]),
    item('ursinho', ['urso de peluche', 'ursinho'], 10, [...CAMA, ...BAU, ...TAPETE, ...CHAO_ESQ]),
    item('patinho', 'patinho', 8, [...TAPETE, ...CHAO_FUNDO, ...CAMA, ...CHAO_DIREITA]),
    item('piao', 'pião', 7, [...TAPETE, ...CHAO_FUNDO, ...CHAO_ESQ, ...CRIADO]),
    item('aviao', ['avião', 'avião'], 11, [...TAPETE, ...CHAO_FUNDO, ...CAMA, ...CHAO_DIREITA]),
    item('helicoptero', ['helicóptero', 'helicóptero'], 11, [...TAPETE, ...CHAO_FUNDO, ...CAMA, ...CHAO_DIREITA]),
    item('barco', 'barco', 11, [...TAPETE, ...CHAO_FUNDO, ...CHAO_DIREITA, ...CAMA]),
    item('trem', ['comboio', 'trem'], 12, [...TAPETE, ...CHAO_FRENTE, ...CHAO_FUNDO, ...CHAO_DIREITA]),
    item('onibus', ['autocarro', 'ônibus'], 11, [...TAPETE, ...CHAO_FRENTE, ...CHAO_FUNDO, ...CHAO_DIREITA]),
    item('robo', ['robô', 'robô'], 9, [...TAPETE, ...CHAO_FUNDO, ...CAMA, ...BAU, ...CHAO_ESQ]),
    item('boneca', 'boneca', 10, [...CAMA, ...BAU, ...TAPETE, ...CHAO_ESQ]),
    item('fantoche', 'fantoche', 8, [...CAMA, ...BAU, ...TAPETE, ...CHAO_ESQ]),
    item('caixa-surpresa', ['caixa de surpresas', 'caixa de surpresa'], 9, [...TAPETE, ...CHAO_FUNDO, ...BAU, ...CHAO_DIREITA]),
    item('blocos', ['cubos de construção', 'blocos de montar'], 9, [...TAPETE, ...CHAO_FUNDO, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('cavalinho', ['cavalo de brincar', 'cavalinho de pau'], 12, [...TAPETE, ...CHAO_FUNDO, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('tambor', 'tambor', 10, [...TAPETE, ...CHAO_FUNDO, ...CHAO_DIREITA, ...CHAO_FRENTE]),
    item('xilofone', 'xilofone', 12, [...TAPETE, ...CHAO_FRENTE, ...CHAO_FUNDO, ...CAMA]),
    item('ioio', ['ioiô', 'ioiô'], 7, [...CAMA, ...TAPETE, ...CRIADO, ...CHAO_ESQ, ...BAU]),
    item('corda', ['corda de saltar', 'corda de pular'], 10, [...TAPETE, ...CHAO_FRENTE, ...CHAO_ESQ, ...CHAO_DIREITA]),
    item('pipa', ['papagaio de papel', 'pipa'], 10, [...CAMA, ...TAPETE, ...CHAO_FUNDO, ...CHAO_DIREITA]),
    item('caleidoscopio', ['caleidoscópio', 'caleidoscópio'], 10, [...CAMA, ...SOBRE_MOVEIS, ...TAPETE]),
    {
      ...item('raquete', 'raquete', 10, []),
      posicoes: [
        { x: 88, y: 69, giro: 70 },
        { x: 30, y: 66, giro: 70 },
        { x: 56, y: 87, giro: 20 },
        { x: 40, y: 84, giro: -30 },
        { x: 20, y: 77, giro: 70 },
      ],
    },

    // Material de escola e coisas da casa
    item('lapis', ['lápis', 'lápis'], 7, [...CRIADO, ...CAMA, ...TAPETE, ...CHAO_ESQ, ...CHAO_FUNDO]),
    item('pincel', 'pincel', 8, [...CRIADO, ...CAMA, ...TAPETE, ...CHAO_ESQ, ...CHAO_FUNDO]),
    item('tesoura', 'tesoura', 8, [...CRIADO, ...CAMA, ...TAPETE, ...CHAO_ESQ, ...CHAO_FUNDO]),
    item('giz-de-cera', ['lápis de cera', 'giz de cera'], 8, [...CRIADO, ...CAMA, ...TAPETE, ...CHAO_ESQ, ...PEITORIL]),
    item('diario', ['diário', 'diário'], 9, [...CRIADO, ...CAMA, ...PEITORIL, ...TAPETE, ...BAU]),
    item('despertador', 'despertador', 8, [...CRIADO, ...PEITORIL, ...PRATELEIRA, ...BAU, ...CHAO_ESQ]),
    item('globo', ['globo terrestre', 'globo terrestre'], 9, [...CRIADO, ...PEITORIL, ...BAU, ...TAPETE]),
    item('relogio-parede', ['relógio de parede', 'relógio de parede'], 8, PAREDE),
  ],
};
