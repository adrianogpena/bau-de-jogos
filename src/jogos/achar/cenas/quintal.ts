import { type Cena, arasaac } from '../tipos';

/**
 * Cena de teste, com pictogramas do ARASAAC como itens provisórios e fundo em CSS.
 * Quando houver as imagens finais: ponha o fundo em `fundo` e troque cada `imagem`
 * por `imagens/achar/quintal/<id>.png` (veja docs/GERAR-IMAGENS.md).
 */
export const quintal: Cena = {
  id: 'quintal',
  emoji: '🌳',
  titulo: { 'pt-PT': 'O Quintal', 'pt-BR': 'O Quintal' },
  resumo: {
    'pt-PT': 'Há muita coisa escondida no quintal. Consegues encontrar tudo?',
    'pt-BR': 'Tem muita coisa escondida no quintal. Você consegue achar tudo?',
  },
  fundoCss:
    'linear-gradient(180deg, #8fd3ff 0%, #c9ecff 45%, #7ccf6a 45%, #4fa84a 100%)',
  alvos: 6,
  itens: [
    { id: 'sol', imagem: arasaac(7252), palavra: { 'pt-PT': 'sol', 'pt-BR': 'sol' }, x: 88, y: 12, largura: 14 },
    { id: 'passaro', imagem: arasaac(2490), palavra: { 'pt-PT': 'pássaro', 'pt-BR': 'pássaro' }, x: 45, y: 16, largura: 11, giro: -8 },
    { id: 'arvore', imagem: arasaac(2256), palavra: { 'pt-PT': 'árvore', 'pt-BR': 'árvore' }, x: 15, y: 33, largura: 24, camada: 1 },
    { id: 'casa', imagem: arasaac(2317), palavra: { 'pt-PT': 'casa', 'pt-BR': 'casa' }, x: 70, y: 34, largura: 26 },
    { id: 'borboleta', imagem: arasaac(2465), palavra: { 'pt-PT': 'borboleta', 'pt-BR': 'borboleta' }, x: 36, y: 40, largura: 10, giro: 12 },
    { id: 'gato', imagem: arasaac(2406), palavra: { 'pt-PT': 'gato', 'pt-BR': 'gato' }, x: 54, y: 58, largura: 15 },
    { id: 'cao', imagem: arasaac(2517), palavra: { 'pt-PT': 'cão', 'pt-BR': 'cachorro' }, x: 27, y: 66, largura: 17 },
    { id: 'flor', imagem: arasaac(3102), palavra: { 'pt-PT': 'flor', 'pt-BR': 'flor' }, x: 6, y: 62, largura: 10 },
    { id: 'abelha', imagem: arasaac(2239), palavra: { 'pt-PT': 'abelha', 'pt-BR': 'abelha' }, x: 33, y: 52, largura: 8, giro: -10 },
    { id: 'bola', imagem: arasaac(2269), palavra: { 'pt-PT': 'bola', 'pt-BR': 'bola' }, x: 80, y: 64, largura: 10 },
    { id: 'bicicleta', imagem: arasaac(2277), palavra: { 'pt-PT': 'bicicleta', 'pt-BR': 'bicicleta' }, x: 66, y: 80, largura: 20 },
    { id: 'coelho', imagem: arasaac(2351), palavra: { 'pt-PT': 'coelho', 'pt-BR': 'coelho' }, x: 40, y: 82, largura: 13 },
    { id: 'chapeu', imagem: arasaac(2572), palavra: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' }, x: 90, y: 84, largura: 10, giro: 10 },
    { id: 'maca', imagem: arasaac(2462), palavra: { 'pt-PT': 'maçã', 'pt-BR': 'maçã' }, x: 20, y: 90, largura: 8 },
    { id: 'tartaruga', imagem: arasaac(2596), palavra: { 'pt-PT': 'tartaruga', 'pt-BR': 'tartaruga' }, x: 52, y: 92, largura: 12 },
  ],
};
