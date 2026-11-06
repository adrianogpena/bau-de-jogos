import type { Cena } from '../tipos';
import { item, lugar } from './util';

/**
 * Cena da Lavandaria (lavanderia). Fundo em `public/imagens/achar/fundos/lavanderia.jpg`, itens em `public/imagens/itens/`.
 * Não peça como item nada que já esteja desenhado no fundo (caixas das prateleiras, cesto de vime, vasos, molas do estendal).
 * Cada item lista os lugares onde faz sentido ficar; se todos estiverem ocupados, cai num ponto livre da `areaLivre`.
 */
/** Em cima da máquina de lavar e da de secar. */
const MAQUINA = lugar([34, 43], [41, 43], [48, 43], [55, 43]);
/** Na prateleira de cima (à direita das caixas). */
const PRATELEIRA_ALTA = lugar([40, 23], [46, 23], [51, 23]);
/** Na prateleira de baixo (à direita das caixas). */
const PRATELEIRA_BAIXA = lugar([39, 33], [43, 33]);
/** Em cima do armário alto. */
const ARMARIO_TOPO = lugar([60, 17], [68, 17], [76, 17]);
/** Nas prateleiras abertas do armário. */
const ARMARIO = lugar([77, 33], [77, 45], [77, 57], [77, 70]);
/** Na borda do tanque. */
const PIA = lugar([80, 53], [94, 52]);
/** No peitoril da janela. */
const PEITORIL = lugar([89, 39], [94, 39]);
/** Dentro do cesto grande do chão. */
const CESTO = lugar([84, 71], [92, 71]);
/** Pendurado no estendal. */
const VARAL = lugar([40, 20], [46, 21], [52, 21]);
/** No chão de ladrilhos. */
const CHAO = lugar([14, 92], [26, 87], [34, 95], [44, 88], [54, 95], [62, 87], [70, 94], [48, 82]);
const PRATELEIRAS = [...PRATELEIRA_ALTA, ...PRATELEIRA_BAIXA];

export const lavanderia: Cena = {
  id: 'lavanderia',
  emoji: '[[menu/comodo-lavanderia]]',
  titulo: { 'pt-PT': 'A Lavandaria', 'pt-BR': 'A Lavanderia' },
  resumo: {
    'pt-PT': 'Anda tudo fora do sítio na lavandaria. Consegues encontrar tudo?',
    'pt-BR': 'Tem tudo fora do lugar na lavanderia. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/fundos/lavanderia.jpg',
  fundoCss: 'linear-gradient(180deg, #f6e49a 0%, #f6e49a 80%, #efe6cf 80%, #e2d6b8 100%)',
  alvos: 6,
  itensPorRodada: 18,
  areaLivre: { x1: 14, x2: 72, y1: 82, y2: 97 },
  itens: [
    // Limpeza
    item('mola-roupa', ['mola da roupa', 'pregador de roupa'], 5, [...VARAL, ...MAQUINA, ...CHAO, ...PRATELEIRAS]),
    item('cabide', 'cabide', 9, [...ARMARIO_TOPO, ...MAQUINA, ...CHAO, ...VARAL]),
    item('detergente', ['detergente', 'sabão em pó'], 9, [...PRATELEIRAS, ...MAQUINA, ...ARMARIO, ...CHAO]),
    item('esfregona', ['esfregona', 'esfregão'], 12, CHAO),
    item('vassoura', 'vassoura', 13, CHAO),
    item('pa-lixo', ['pá do lixo', 'pá de lixo'], 9, CHAO),
    item('luvas-borracha', 'luvas de borracha', 8, [...PIA, ...MAQUINA, ...ARMARIO, ...CHAO, ...CESTO]),
    item('esponja-loica', 'esponja', 7, [...PIA, ...PEITORIL, ...ARMARIO, ...MAQUINA]),
    item('sabao-barra', 'sabão em barra', 7, [...PIA, ...PEITORIL, ...MAQUINA, ...ARMARIO]),
    item('balde-agua', 'balde', 10, [...CHAO, ...ARMARIO_TOPO]),
    item('ferro', ['ferro de engomar', 'ferro de passar'], 10, [...MAQUINA, ...ARMARIO_TOPO, ...CHAO, ...ARMARIO]),
    item('tabua-passar', ['tábua de engomar', 'tábua de passar'], 12, CHAO),

    // Roupa e panos
    item('bola-la', 'bola de lã', 8, [...CESTO, ...CHAO, ...MAQUINA, ...PRATELEIRAS]),
    item('lenco', 'lenço', 7, [...VARAL, ...CESTO, ...MAQUINA]),
    item('meia', 'meia', 6, [...VARAL, ...CESTO, ...CHAO, ...MAQUINA]),
    item('toalha-mao', 'toalha', 10, [...VARAL, ...CESTO, ...MAQUINA]),
    item('casaco', 'casaco', 12, [...CESTO, ...CHAO, ...ARMARIO_TOPO]),
    item('cesto', 'cesto', 11, [...CHAO, ...MAQUINA, ...ARMARIO_TOPO]),
    item('luva', 'luva', 7, [...CESTO, ...CHAO, ...MAQUINA, ...PEITORIL]),
    item('chinelo', 'chinelo', 9, CHAO),
    item('garrafa', 'garrafa', 7, [...MAQUINA, ...PRATELEIRAS, ...ARMARIO, ...PEITORIL, ...CHAO]),
  ],
};
