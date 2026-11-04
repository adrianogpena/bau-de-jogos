import type { Jogo } from './tipos';
import { Rpg } from './rpg/Rpg';
import { Escrita } from './escrita/Escrita';
import { Leitura } from './leitura/Leitura';

/** Lista de todos os jogos. Para adicionar um jogo novo, registre-o aqui. */
export const JOGOS: Jogo[] = [
  {
    id: 'rpg',
    emoji: '🐉',
    titulo: { 'pt-PT': 'Aventura RPG', 'pt-BR': 'Aventura RPG' },
    descricao: {
      'pt-PT': 'Vive uma história, cria o teu herói e lança os dados nas lutas!',
      'pt-BR': 'Viva uma história, crie seu herói e jogue os dados nas lutas!',
    },
    componente: Rpg,
  },
  {
    id: 'escrita',
    emoji: '✏️',
    titulo: { 'pt-PT': 'Escrever palavras', 'pt-BR': 'Escrever palavras' },
    descricao: {
      'pt-PT': 'Aprende a escrever palavras a brincar.',
      'pt-BR': 'Aprenda a escrever palavras brincando.',
    },
    componente: Escrita,
  },
  {
    id: 'leitura',
    emoji: '📖',
    titulo: { 'pt-PT': 'Ler palavras', 'pt-BR': 'Ler palavras' },
    descricao: {
      'pt-PT': 'Descobre como se lêem as palavras.',
      'pt-BR': 'Descubra como se leem as palavras.',
    },
    componente: Leitura,
  },
];
