import type { Plugin } from 'vite';

export function narradorDev(opcoes: { raiz: string; hashTexto: (texto: string) => string }): Plugin;
