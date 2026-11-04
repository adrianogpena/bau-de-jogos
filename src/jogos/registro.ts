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
      'pt-PT': 'Completa as fábulas: escreve a palavra da imagem que falta em cada parte.',
      'pt-BR': 'Complete as fábulas: escreva a palavra da imagem que falta em cada parte.',
    },
    componente: Escrita,
  },
  {
    id: 'leitura',
    emoji: '📖',
    titulo: { 'pt-PT': 'Ler palavras', 'pt-BR': 'Ler palavras' },
    descricao: {
      'pt-PT': 'Lê as fábulas e escolhe a imagem da palavra em destaque.',
      'pt-BR': 'Leia as fábulas e escolha a imagem da palavra em destaque.',
    },
    componente: Leitura,
  },
];
