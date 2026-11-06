import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena da Garagem (oficina). Fundo em `public/imagens/achar/fundos/garagem.jpg`, itens em `public/imagens/achar/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (caixas, vasos, escada, carro).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Em cima da bancada de trabalho. */
const BANCADA = lugar([8, 54], [15, 52], [22, 51], [28, 50]);
/** Na prateleira de baixo da bancada. */
const BANCADA_BAIXO = lugar([14, 66], [22, 64], [29, 62]);
/** Pendurado nos painéis perfurados. */
const PAINEL = lugar([7, 40], [12, 45], [16, 40], [27, 36], [30, 42]);
/** Em cima das caixas de cartão. */
const CAIXAS = lugar([88, 43], [92, 51], [81, 55]);
/** Em cima do carro (tejadilho e capô). */
const CARRO = lugar([50, 31], [57, 31], [45, 54], [55, 53]);
/** No chão de cimento. */
const CHAO = lugar([10, 84], [24, 82], [32, 92], [44, 88], [56, 90], [66, 87], [73, 71], [78, 76], [72, 95], [85, 88], [92, 94], [20, 96], [46, 97], [60, 96]);

export const garagem: Cena = {
  id: 'garagem',
  emoji: '🔧',
  titulo: { 'pt-PT': 'A Garagem', 'pt-BR': 'A Garagem' },
  resumo: {
    'pt-PT': 'As ferramentas fugiram para todo o lado. Consegues encontrá-las?',
    'pt-BR': 'As ferramentas foram parar em tudo quanto é lugar. Você consegue achar?',
  },
  fundo: 'imagens/achar/fundos/garagem.jpg',
  fundoCss: 'linear-gradient(180deg, #f5df91 0%, #f5df91 75%, #b9ada0 75%, #a39688 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 6, x2: 94, y1: 80, y2: 97 },
  itens: [
    // Ferramentas
    item('martelo', 'martelo', 9, [...BANCADA, ...PAINEL, ...CHAO, ...BANCADA_BAIXO]),
    item('chave-inglesa', 'chave inglesa', 10, [...BANCADA, ...PAINEL, ...CHAO, ...BANCADA_BAIXO]),
    item('chave-fendas', ['chave de fendas', 'chave de fenda'], 9, [...BANCADA, ...PAINEL, ...CHAO, ...BANCADA_BAIXO]),
    item('alicate', 'alicate', 8, [...BANCADA, ...PAINEL, ...CHAO, ...BANCADA_BAIXO]),
    item('serrote', 'serrote', 13, [...PAINEL, ...BANCADA, ...CHAO]),
    item('parafuso', 'parafuso', 5, [...BANCADA, ...CHAO, ...BANCADA_BAIXO, ...CARRO]),
    item('prego', 'prego', 4, [...BANCADA, ...CHAO, ...BANCADA_BAIXO, ...CARRO]),
    item('fita-metrica', ['fita métrica', 'trena'], 8, [...BANCADA, ...PAINEL, ...CHAO, ...BANCADA_BAIXO]),
    item('caixa-ferramentas', 'caixa de ferramentas', 12, [...BANCADA, ...CHAO, ...BANCADA_BAIXO, ...CAIXAS]),
    item('bomba-ar', 'bomba de ar', 12, [...CHAO, ...BANCADA_BAIXO]),
    item('lata-tinta', 'lata de tinta', 9, [...BANCADA, ...CHAO, ...CAIXAS, ...BANCADA_BAIXO]),
    item('funil', 'funil', 7, [...BANCADA, ...CARRO, ...CHAO]),
    item('chave', 'chave', 6, [...BANCADA, ...CARRO, ...CHAO, ...PAINEL]),
    item('lanterna', 'lanterna', 8, [...BANCADA, ...CARRO, ...CHAO, ...CAIXAS]),

    // Desporto e brincadeiras
    item('triciclo', 'triciclo', 13, CHAO),
    item('skate', 'skate', 12, CHAO),
    item('patins', 'patins', 10, [...CHAO, ...BANCADA_BAIXO]),
    item('capacete', 'capacete', 9, [...BANCADA, ...CARRO, ...CHAO, ...CAIXAS]),
    item('bicicleta', 'bicicleta', 16, CHAO),
    item('bola', 'bola', 8, [...CHAO, ...BANCADA, ...BANCADA_BAIXO]),
    item('raquete', 'raquete', 10, [...CHAO, ...BANCADA, ...CAIXAS]),
    item('carro', ['carrinho', 'carrinho'], 9, [...BANCADA, ...CHAO, ...BANCADA_BAIXO]),

    // Roupa e coisas da casa
    item('casaco', 'casaco', 11, [...BANCADA, ...CHAO, ...CAIXAS]),
    item('chapeu-palha', 'chapéu de palha', 12, [...CARRO, ...BANCADA, ...CHAO]),
    item('galochas', ['galochas', 'botas de chuva'], 10, CHAO),
    item('impermeavel', ['impermeável', 'capa de chuva'], 11, [...CHAO, ...BANCADA]),
    item('guarda-chuva', 'guarda-chuva', 11, CHAO),
    item('garrafa', 'garrafa', 7, [...BANCADA, ...CARRO, ...CAIXAS, ...CHAO]),
  ],
};
