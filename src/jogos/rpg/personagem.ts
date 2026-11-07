import type { Genero } from '../../compartilhado/idioma';

/** O personagem não tem nome digitado: é "o herói / a heroína" ou "o mago / a maga". */
export type TipoPersonagem = 'heroi' | 'mago';

const NOMES: Record<TipoPersonagem, Record<Genero, string>> = {
  heroi: { m: 'herói', f: 'heroína' },
  mago: { m: 'mago', f: 'maga' },
};

/** Nome curto para mostrar na tela (ex.: "Heroína"). */
export function tituloPersonagem(tipo: TipoPersonagem, genero: Genero): string {
  return NOMES[tipo][genero].replace(/^./, (c) => c.toUpperCase());
}

/**
 * Valores para `preencher()` nos textos das histórias:
 * `{nome}` = "o herói", `{doNome}` = "do herói", `{aoNome}` = "ao herói" (no feminino: "a heroína", "da heroína", "à heroína").
 * `{Nome}` (maiúscula) abre frase. `{o|a}` e outras escolhas usam o `genero`.
 */
export function valoresPersonagem(tipo: TipoPersonagem, genero: Genero): Record<string, string> {
  const nome = NOMES[tipo][genero];
  const feminino = genero === 'f';
  return {
    genero,
    nome: `${feminino ? 'a' : 'o'} ${nome}`,
    doNome: `d${feminino ? 'a' : 'o'} ${nome}`,
    aoNome: `${feminino ? 'à' : 'ao'} ${nome}`,
  };
}

/** Figura do personagem na tela: a própria criança como herói, heroína, mago ou maga. */
export function avatarPersonagem(tipo: TipoPersonagem, genero: Genero): string {
  const figura = tipo === 'heroi' ? '🦸' : '🧙';
  return `${figura}\u200d${genero === 'f' ? '♀' : '♂'}\ufe0f`;
}
