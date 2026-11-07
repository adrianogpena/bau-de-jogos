import type { Idioma } from '../../../compartilhado/idioma';

/** Propriedades de todo componente de enigma. */
export interface PropsEnigma<E> {
  enigma: E;
  idioma: Idioma;
  aoAcertar: () => void;
}

export const TEXTOS_ENIGMA = {
  tenteDeNovo: { 'pt-PT': 'Quase! Tenta outra vez.', 'pt-BR': 'Quase! Tente de novo.' },
  abrir: { 'pt-PT': 'Abrir', 'pt-BR': 'Abrir' },
  apagar: { 'pt-PT': 'Apagar', 'pt-BR': 'Apagar' },
  verificar: { 'pt-PT': 'Verificar', 'pt-BR': 'Verificar' },
  ordem: { 'pt-PT': 'Ordem', 'pt-BR': 'Ordem' },
} as const;

/** Embaralha sem alterar a lista original. */
export function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
