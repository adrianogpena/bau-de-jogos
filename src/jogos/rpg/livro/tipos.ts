import type { TextoPorIdioma } from '../../../compartilhado/idioma';

/**
 * Livro-jogo: a história é um grafo de pontos (como os parágrafos numerados de um livro-jogo).
 * O que a criança escolhe e consegue fica guardado em **marcas** (itens da mochila e fatos da história),
 * e as marcas abrem ou fecham escolhas mais à frente, até um dos finais.
 */

/** Quando uma escolha aparece. Sem condição, aparece sempre. */
export interface Condicao {
  /** Precisa de todas estas marcas. */
  tem?: string[];
  /** Precisa de pelo menos uma destas marcas. */
  temAlguma?: string[];
  /** Não pode ter nenhuma destas marcas. */
  naoTem?: string[];
}

export interface EscolhaLivro {
  texto: TextoPorIdioma;
  destino: string;
  se?: Condicao;
}

/** Adivinha de escolha: uma pergunta e as respostas (a certa é `certa`, posição em `opcoes`). */
export interface Enigma {
  pergunta: TextoPorIdioma;
  opcoes: TextoPorIdioma[];
  certa: number;
}

/**
 * Base de puzzles, igual para todas as histórias. A história dá o tema (o `enunciado` e os dados);
 * a base sorteia a rodada conforme o nível (veja desafios.ts):
 * - escrever: escrever o nome de um desenho (ids de `PALAVRAS`; a palavra certa depende da variante)
 * - conta: problema de somar ou de tirar; o enunciado usa `{a}` e `{b}` (com substantivo masculino: "{a} pães")
 * - sequencia: descobrir o número que falta numa sequência
 * - enigma: adivinha com respostas para escolher
 */
export type DefDesafio =
  | { tipo: 'escrever'; palavras: number[] }
  | { tipo: 'conta'; operacao: 'soma' | 'subtracao' }
  | { tipo: 'sequencia' }
  | { tipo: 'enigma'; enigmas: Enigma[] };

/** Puzzle de um ponto: acertar e falhar levam a pontos diferentes (nunca a um beco sem saída). */
export type DesafioPonto = DefDesafio & {
  enunciado: TextoPorIdioma;
  sucesso: string;
  falha: string;
};

/** Um ponto da história. `Atributo` é o nome dos atributos da ficha (herói) ou das habilidades (mago). */
export interface Ponto<Atributo extends string = string> {
  id: string;
  emoji: string;
  texto: TextoPorIdioma;
  /** Pergunta mostrada acima das escolhas. */
  pergunta?: TextoPorIdioma;
  escolhas?: EscolhaLivro[];
  desafio?: DesafioPonto;
  /** Luta neste ponto; depois de vencer, segue para `aoVencer`. */
  luta?: { inimigo: string; aoVencer: string };
  /** Teste com d20 + atributo. */
  teste?: { atributo: Atributo; dificuldade: number; sucesso: string; falha: string };
  /** Marcas ganhas ao chegar aqui. */
  ganha?: string[];
  /** Marcas perdidas ao chegar aqui (item gasto). */
  perde?: string[];
  /** Vantagens ao chegar: poções (herói) e descanso (vida e, no mago, energia). */
  recompensa?: { pocoes?: Record<string, number>; curar?: boolean };
  /** Mago: aprende um feitiço de outra escola; depois segue para `proxima`. */
  aprender?: { proxima: string };
  /** Último ponto: id do final (em `finais` da história). */
  fim?: string;
}

/** Item da mochila: uma marca que a criança vê. As marcas fora desta lista são fatos escondidos. */
export interface ItemHistoria {
  nome: TextoPorIdioma;
  /** Desenho em `public/imagens/icones/` (ex.: `interface/mapa`). */
  icone?: string;
  /** Desenho em `public/imagens/itens/` (sem `.png`). */
  arquivo?: string;
}

export interface Final {
  emoji: string;
  titulo: TextoPorIdioma;
}

export interface Livro<Atributo extends string = string> {
  /** Usado para guardar os finais já descobertos. */
  id: string;
  pontos: Record<string, Ponto<Atributo>>;
  inicial: string;
  finais: Record<string, Final>;
  itens: Record<string, ItemHistoria>;
}
