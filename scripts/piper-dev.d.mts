import type { Plugin } from 'vite';

export function piperDev(opcoes: { raiz: string; hashTexto: (texto: string) => string }): Plugin;
