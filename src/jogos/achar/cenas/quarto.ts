import type { Cena } from '../tipos';

/**
 * Cena do Quarto. Fundo e itens em `public/imagens/achar/quarto/`.
 * Não peça como item nada que já esteja desenhado no fundo (livros, baú, cestos, plantas, abajur).
 */
const img = (id: string) => `imagens/achar/quarto/${id}.png`;

export const quarto: Cena = {
  id: 'quarto',
  emoji: '🛏️',
  titulo: { 'pt-PT': 'O Quarto', 'pt-BR': 'O Quarto' },
  resumo: {
    'pt-PT': 'Anda tudo espalhado pelo quarto. Consegues encontrar tudo?',
    'pt-BR': 'Tem coisa espalhada pelo quarto todo. Você consegue achar tudo?',
  },
  fundo: 'imagens/achar/quarto/fundo.jpg',
  fundoCss: 'linear-gradient(180deg, #b9c8f0 0%, #b9c8f0 60%, #e0a24a 60%, #c98a35 100%)',
  alvos: 6,
  itens: [
    { id: 'chapeu', imagem: img('chapeu'), palavra: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' }, x: 13, y: 46, largura: 12, giro: -6 },
    { id: 'luva', imagem: img('luva'), palavra: { 'pt-PT': 'luva', 'pt-BR': 'luva' }, x: 31, y: 60, largura: 7, giro: 15 },
    { id: 'bola', imagem: img('bola'), palavra: { 'pt-PT': 'bola', 'pt-BR': 'bola' }, x: 23, y: 82, largura: 8 },
    { id: 'raquete', imagem: img('raquete'), palavra: { 'pt-PT': 'raquete', 'pt-BR': 'raquete' }, x: 88, y: 69, largura: 10, giro: 70 },
    { id: 'carro', imagem: img('carro'), palavra: { 'pt-PT': 'carro', 'pt-BR': 'carrinho' }, x: 62, y: 69, largura: 9 },
    { id: 'cachecol', imagem: img('cachecol'), palavra: { 'pt-PT': 'cachecol', 'pt-BR': 'cachecol' }, x: 52, y: 93, largura: 15 },
    { id: 'ursinho', imagem: img('ursinho'), palavra: { 'pt-PT': 'urso de peluche', 'pt-BR': 'ursinho' }, x: 20, y: 40, largura: 10, giro: -8 },
    { id: 'meia', imagem: img('meia'), palavra: { 'pt-PT': 'meia', 'pt-BR': 'meia' }, x: 91, y: 80, largura: 6, giro: 25 },
    { id: 'tenis', imagem: img('tenis'), palavra: { 'pt-PT': 'ténis', 'pt-BR': 'tênis' }, x: 19, y: 74, largura: 11, giro: -5 },
    { id: 'patinho', imagem: img('patinho'), palavra: { 'pt-PT': 'patinho', 'pt-BR': 'patinho' }, x: 68, y: 63, largura: 8 },
    { id: 'piao', imagem: img('piao'), palavra: { 'pt-PT': 'pião', 'pt-BR': 'pião' }, x: 41, y: 76, largura: 7, giro: 20 },
  ],
};
