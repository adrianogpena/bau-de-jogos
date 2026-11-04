import type { ComponentType } from 'react';
import type { Idioma, TextoPorIdioma } from '../compartilhado/idioma';

/** Propriedades que todo jogo recebe do menu. */
export interface PropsJogo {
  idioma: Idioma;
  aoVoltar: () => void;
}

/** Descrição de um jogo para aparecer no menu. */
export interface Jogo {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  descricao: TextoPorIdioma;
  componente: ComponentType<PropsJogo>;
}
