import type { Jogo } from './tipos';
import { Rpg } from './rpg/Rpg';
import { Escrita } from './escrita/Escrita';
import { Leitura } from './leitura/Leitura';
import { Escape } from './escape/Escape';
import { Achar } from './achar/Achar';

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
    etiqueta: { 'pt-PT': 'Aventura', 'pt-BR': 'Aventura' },
    cor: '#ff6b81',
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
    etiqueta: { 'pt-PT': 'Escrita', 'pt-BR': 'Escrita' },
    cor: '#7c5cff',
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
    etiqueta: { 'pt-PT': 'Leitura', 'pt-BR': 'Leitura' },
    cor: '#22d3b6',
    componente: Leitura,
  },
  {
    id: 'escape',
    emoji: '🔐',
    titulo: { 'pt-PT': 'Escape Room', 'pt-BR': 'Escape Room' },
    descricao: {
      'pt-PT': 'Encontra pistas, resolve enigmas e descobre o código para escapar da sala!',
      'pt-BR': 'Encontre pistas, resolva enigmas e descubra o código para escapar da sala!',
    },
    etiqueta: { 'pt-PT': 'Lógica', 'pt-BR': 'Lógica' },
    cor: '#ffc94d',
    componente: Escape,
  },
  {
    id: 'achar',
    emoji: '🔍',
    titulo: { 'pt-PT': 'Achar itens', 'pt-BR': 'Achar itens' },
    descricao: {
      'pt-PT': 'Lê a lista e encontra as coisas escondidas na imagem!',
      'pt-BR': 'Leia a lista e ache as coisas escondidas na imagem!',
    },
    etiqueta: { 'pt-PT': 'Observação', 'pt-BR': 'Observação' },
    cor: '#4dabf7',
    componente: Achar,
  },
];
