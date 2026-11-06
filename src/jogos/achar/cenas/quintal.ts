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
    { id: 'sol', imagem: arasaac(7252), palavra: { 'pt-PT': 'sol', 'pt-BR': 'sol' }, largura: 14, posicoes: [{ x: 88, y: 12 }] },
    { id: 'passaro', imagem: arasaac(2490), palavra: { 'pt-PT': 'pássaro', 'pt-BR': 'pássaro' }, largura: 11, posicoes: [{ x: 45, y: 16, giro: -8 }] },
    { id: 'arvore', imagem: arasaac(2256), palavra: { 'pt-PT': 'árvore', 'pt-BR': 'árvore' }, largura: 24, posicoes: [{ x: 15, y: 33, camada: 1 }] },
    { id: 'casa', imagem: arasaac(2317), palavra: { 'pt-PT': 'casa', 'pt-BR': 'casa' }, largura: 26, posicoes: [{ x: 70, y: 34 }] },
    { id: 'borboleta', imagem: arasaac(2465), palavra: { 'pt-PT': 'borboleta', 'pt-BR': 'borboleta' }, largura: 10, posicoes: [{ x: 36, y: 40, giro: 12 }] },
    { id: 'gato', imagem: arasaac(2406), palavra: { 'pt-PT': 'gato', 'pt-BR': 'gato' }, largura: 15, posicoes: [{ x: 54, y: 58 }] },
    { id: 'cao', imagem: arasaac(2517), palavra: { 'pt-PT': 'cão', 'pt-BR': 'cachorro' }, largura: 17, posicoes: [{ x: 27, y: 66 }] },
    { id: 'flor', imagem: arasaac(3102), palavra: { 'pt-PT': 'flor', 'pt-BR': 'flor' }, largura: 10, posicoes: [{ x: 6, y: 62 }] },
    { id: 'abelha', imagem: arasaac(2239), palavra: { 'pt-PT': 'abelha', 'pt-BR': 'abelha' }, largura: 8, posicoes: [{ x: 33, y: 52, giro: -10 }] },
    { id: 'bola', imagem: arasaac(2269), palavra: { 'pt-PT': 'bola', 'pt-BR': 'bola' }, largura: 10, posicoes: [{ x: 80, y: 64 }] },
    { id: 'bicicleta', imagem: arasaac(2277), palavra: { 'pt-PT': 'bicicleta', 'pt-BR': 'bicicleta' }, largura: 20, posicoes: [{ x: 66, y: 80 }] },
    { id: 'coelho', imagem: arasaac(2351), palavra: { 'pt-PT': 'coelho', 'pt-BR': 'coelho' }, largura: 13, posicoes: [{ x: 40, y: 82 }] },
    { id: 'chapeu', imagem: arasaac(2572), palavra: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' }, largura: 10, posicoes: [{ x: 90, y: 84, giro: 10 }] },
    { id: 'maca', imagem: arasaac(2462), palavra: { 'pt-PT': 'maçã', 'pt-BR': 'maçã' }, largura: 8, posicoes: [{ x: 20, y: 90 }] },
    { id: 'tartaruga', imagem: arasaac(2596), palavra: { 'pt-PT': 'tartaruga', 'pt-BR': 'tartaruga' }, largura: 12, posicoes: [{ x: 52, y: 92 }] },
  ],
};
