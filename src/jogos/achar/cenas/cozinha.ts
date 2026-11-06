import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena da Cozinha. Fundo em `public/imagens/achar/fundos/cozinha.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (frascos, vasos das prateleiras).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Em cima da bancada, à esquerda. */
const BANCADA = lugar([8, 55], [14, 53], [20, 50], [25, 48]);
/** Em cima do fogão. */
const FOGAO = lugar([30, 49], [36, 49]);
/** Em cima da mesa redonda. */
const MESA = lugar([66, 59], [74, 57], [82, 59], [77, 61]);
/** Nos assentos das cadeiras. */
const CADEIRA = lugar([62, 66], [86, 70]);
/** Em cima do frigorífico. */
const FRIGO = lugar([70, 29], [78, 29]);
/** Em cima do armário de parede. */
const ARMARIO = lugar([8, 14], [17, 16]);
/** No peitoril da janela. */
const PEITORIL = lugar([47, 43], [53, 43]);
/** No chão de ladrilhos. */
const CHAO = lugar([38, 74], [48, 72], [44, 82], [32, 88], [55, 90], [48, 96], [22, 92], [68, 94], [82, 94], [93, 92], [75, 82]);
/** Na parede, ao lado da janela. */
const PAREDE = lugar([77, 18]);

export const cozinha: Cena = {
  id: 'cozinha',
  emoji: '[[menu/comodo-cozinha]]',
  titulo: { 'pt-PT': 'A Cozinha', 'pt-BR': 'A Cozinha' },
  resumo: {
    'pt-PT': 'A cozinha está toda desarrumada. Consegues encontrar tudo?',
    'pt-BR': 'A cozinha está toda bagunçada. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/fundos/cozinha.jpg',
  fundoCss: 'linear-gradient(180deg, #f6df8a 0%, #f6df8a 62%, #d98a63 62%, #c4724d 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 30, x2: 90, y1: 70, y2: 96 },
  itens: [
    // Utensílios
    item('colher-de-pau', 'colher de pau', 9, [...BANCADA, ...MESA, ...CHAO, ...FOGAO]),
    item('concha', ['concha', 'concha de sopa'], 9, [...BANCADA, ...FOGAO, ...MESA, ...CHAO]),
    item('panela', 'panela', 10, [...FOGAO, ...BANCADA, ...CHAO, ...MESA]),
    item('frigideira', 'frigideira', 11, [...FOGAO, ...BANCADA, ...CHAO]),
    item('chaleira', 'chaleira', 10, [...FOGAO, ...BANCADA, ...MESA]),
    item('tabua', 'tábua de cortar', 10, [...BANCADA, ...MESA, ...FRIGO, ...CHAO]),
    item('rolo-de-massa', ['rolo da massa', 'rolo de macarrão'], 11, [...BANCADA, ...MESA, ...CHAO]),
    item('batedor', ['batedor de arames', 'batedor de ovos'], 8, [...BANCADA, ...MESA, ...FOGAO, ...CHAO]),
    item('avental', 'avental', 10, [...CADEIRA, ...BANCADA, ...MESA, ...CHAO]),
    item('luva-forno', ['luva de cozinha', 'luva de forno'], 8, [...FOGAO, ...BANCADA, ...CADEIRA, ...MESA]),
    item('tesoura', 'tesoura', 8, [...BANCADA, ...MESA, ...CHAO]),

    // Comida
    item('maca', 'maçã', 6, [...MESA, ...BANCADA, ...PEITORIL, ...FRIGO, ...CHAO, ...CADEIRA]),
    item('banana', 'banana', 8, [...MESA, ...BANCADA, ...PEITORIL, ...FRIGO, ...CADEIRA]),
    item('tomate', 'tomate', 6, [...MESA, ...BANCADA, ...PEITORIL, ...CHAO, ...CADEIRA]),
    item('cenoura', 'cenoura', 8, [...MESA, ...BANCADA, ...CHAO, ...CADEIRA]),
    item('ovo', 'ovo', 5, [...MESA, ...BANCADA, ...PEITORIL, ...CHAO]),
    item('pao', 'pão', 9, [...MESA, ...BANCADA, ...FRIGO, ...CADEIRA]),
    item('queijo', 'queijo', 7, [...MESA, ...BANCADA, ...FRIGO, ...CADEIRA]),
    item('bolacha', ['bolacha', 'biscoito'], 6, [...MESA, ...BANCADA, ...PEITORIL, ...CHAO, ...CADEIRA]),
    item('uva', 'uvas', 8, [...MESA, ...BANCADA, ...PEITORIL, ...CADEIRA]),
    item('limao', 'limão', 6, [...MESA, ...BANCADA, ...PEITORIL, ...CHAO, ...CADEIRA]),

    // Louça e coisas da casa
    item('copo', 'copo', 6, [...MESA, ...BANCADA, ...PEITORIL]),
    item('chavena', ['chávena', 'xícara'], 7, [...MESA, ...BANCADA, ...PEITORIL]),
    item('prato', 'prato', 8, [...MESA, ...BANCADA, ...CADEIRA]),
    item('garrafa', 'garrafa', 7, [...MESA, ...BANCADA, ...PEITORIL, ...CHAO]),
    item('cesto', 'cesto', 11, [...CHAO, ...MESA, ...BANCADA, ...ARMARIO]),
    item('despertador', 'despertador', 8, [...BANCADA, ...MESA, ...FRIGO, ...PEITORIL, ...ARMARIO]),
    item('relogio-parede', 'relógio de parede', 8, PAREDE),
  ],
};
