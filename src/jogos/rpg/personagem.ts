import type { Genero } from '../../compartilhado/idioma';

/** O personagem é escolhido entre 4 modelos (2 masculinos e 2 femininos) e cada um tem nome. */
export type TipoPersonagem = 'heroi' | 'mago';

export interface Personagem {
  /** Também é o nome do arquivo em `public/imagens/rpg/herois|magos/<id>.png`. */
  id: string;
  tipo: TipoPersonagem;
  genero: Genero;
  /** Nome próprio, igual em pt-PT e pt-BR. */
  nome: string;
}

/** Os 8 personagens do RPG. Nomes novos precisam de áudio (`npm run audio:piper`). */
export const PERSONAGENS: Record<TipoPersonagem, Personagem[]> = {
  heroi: [
    { id: 'heroi-masculino-1', tipo: 'heroi', genero: 'm', nome: 'Davi' },
    { id: 'heroi-masculino-2', tipo: 'heroi', genero: 'm', nome: 'Malik' },
    { id: 'heroi-feminino-1', tipo: 'heroi', genero: 'f', nome: 'Clara' },
    { id: 'heroi-feminino-2', tipo: 'heroi', genero: 'f', nome: 'Amara' },
  ],
  mago: [
    { id: 'mago-masculino-1', tipo: 'mago', genero: 'm', nome: 'Teo' },
    { id: 'mago-masculino-2', tipo: 'mago', genero: 'm', nome: 'Noé' },
    { id: 'mago-feminino-1', tipo: 'mago', genero: 'f', nome: 'Íris' },
    { id: 'mago-feminino-2', tipo: 'mago', genero: 'f', nome: 'Luna' },
  ],
};

export function personagemPorId(tipo: TipoPersonagem, id: string): Personagem {
  return PERSONAGENS[tipo].find((p) => p.id === id) ?? PERSONAGENS[tipo][0];
}

/** Caminho da imagem do personagem (sem o `BASE_URL`). */
export function imagemPersonagem(personagem: Personagem): string {
  return `imagens/rpg/${personagem.tipo === 'heroi' ? 'herois' : 'magos'}/${personagem.id}.png`;
}

/**
 * Valores para `preencher()` nos textos das histórias, com o nome do personagem (ex.: Clara):
 * `{nome}` = "Clara", `{doNome}` = "de Clara", `{aoNome}` = "a Clara".
 * `{Nome}` (maiúscula) abre frase. `{o|a}` e outras escolhas usam o `genero` do personagem.
 */
export function valoresPersonagem(personagem: Personagem): Record<string, string> {
  return {
    genero: personagem.genero,
    nome: personagem.nome,
    doNome: `de ${personagem.nome}`,
    aoNome: `a ${personagem.nome}`,
  };
}
