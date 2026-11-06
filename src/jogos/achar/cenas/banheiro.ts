import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena da Casa de banho (banheiro). Fundo em `public/imagens/achar/fundos/banheiro.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (plantas, livros do armário).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** No tapete de banho. */
const TAPETE = lugar([21, 89], [26, 85], [31, 82]);
/** Na borda do lavatório. */
const PIA = lugar([33, 50], [46, 50]);
/** Em cima do depósito da sanita. */
const CISTERNA = lugar([56, 47], [62, 47]);
/** Em cima do cesto da roupa suja. */
const CESTO = lugar([88, 60], [93, 61]);
/** Pendurado no toalheiro. */
const TOALHEIRO = lugar([70, 38], [78, 38], [85, 38]);
/** Na borda da banheira. */
const BORDA = lugar([5, 60], [12, 58], [19, 56]);
/** Dentro da banheira. */
const BANHEIRA = lugar([8, 68], [16, 66]);
/** No chão de azulejo. */
const CHAO = lugar([38, 82], [48, 88], [58, 82], [68, 86], [78, 83], [88, 92], [44, 95], [62, 95], [76, 95], [50, 76], [34, 94]);

export const banheiro: Cena = {
  id: 'banheiro',
  emoji: '[[menu/comodo-banheiro]]',
  titulo: { 'pt-PT': 'A Casa de Banho', 'pt-BR': 'O Banheiro' },
  resumo: {
    'pt-PT': 'Alguém deixou tudo espalhado pela casa de banho. Consegues encontrar tudo?',
    'pt-BR': 'Alguém deixou tudo espalhado pelo banheiro. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/fundos/banheiro.jpg',
  fundoCss: 'linear-gradient(180deg, #f7e19a 0%, #f7e19a 70%, #bfe0f0 70%, #a9d2e6 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 36, x2: 94, y1: 78, y2: 96 },
  itens: [
    // Higiene
    item('sabonete', 'sabonete', 7, [...PIA, ...BORDA, ...TAPETE, ...CHAO]),
    item('escova-de-dentes', 'escova de dentes', 8, [...PIA, ...CISTERNA, ...CHAO]),
    item('pasta-dentes', ['pasta de dentes', 'pasta de dente'], 8, [...PIA, ...CISTERNA, ...CHAO]),
    item('pente', 'pente', 7, [...PIA, ...CISTERNA, ...CHAO, ...TAPETE]),
    item('escova-cabelo', 'escova de cabelo', 9, [...PIA, ...CISTERNA, ...CHAO, ...TAPETE]),
    item('esponja', 'esponja', 7, [...BORDA, ...PIA, ...BANHEIRA, ...CHAO]),
    item('champo', ['champô', 'xampu'], 9, [...BORDA, ...CISTERNA, ...CHAO]),
    item('papel-higienico', ['rolo de papel higiénico', 'rolo de papel higiênico'], 8, [...CISTERNA, ...CHAO, ...CESTO]),
    item('espelho-mao', 'espelho de mão', 9, [...PIA, ...CISTERNA, ...CHAO, ...TAPETE]),
    item('secador', 'secador de cabelo', 11, [...CESTO, ...CHAO, ...PIA]),
    item('elastico', 'elástico de cabelo', 5, [...PIA, ...CISTERNA, ...TAPETE, ...CHAO]),
    item('cotonete', 'cotonete', 6, [...PIA, ...CISTERNA, ...CHAO, ...TAPETE]),
    item('copo', 'copo', 6, [...PIA, ...CISTERNA]),
    item('espelho', 'espelho', 8, [...CHAO, ...TAPETE, ...CESTO]),
    item('relogio-pulso', 'relógio de pulso', 6, [...PIA, ...CISTERNA, ...CESTO]),

    // Banho
    item('toalha', 'toalha', 11, [...TOALHEIRO, ...CESTO, ...TAPETE, ...CHAO, ...BORDA]),
    item('touca-banho', 'touca de banho', 9, [...BORDA, ...CESTO, ...CHAO]),
    item('barquinho-banho', 'barquinho de banho', 9, [...BANHEIRA, ...BORDA]),
    item('bolhas', ['bolas de sabão', 'bolhas de sabão'], 8, [...BORDA, ...CHAO, ...PIA]),
    item('balde', 'balde', 9, [...CHAO, ...BANHEIRA]),

    // Calçado e roupa
    item('pantufa', 'pantufa', 9, [...CHAO, ...TAPETE]),
    item('chinelo', 'chinelo', 9, [...CHAO, ...TAPETE]),
    item('sandalia', 'sandália', 9, [...CHAO, ...TAPETE]),
    item('meia', 'meia', 6, [...CHAO, ...TAPETE, ...CESTO]),
  ],
};
