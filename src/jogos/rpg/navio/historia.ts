import type { TextoPorIdioma } from '../../../compartilhado/idioma';
import { livro } from '../livro/regras';
import type { Final, ItemHistoria, Ponto } from '../livro/tipos';
import type { InimigoNavio, NomeAtributoArqueiro } from './tipos';

export const PONTOS_PARA_DISTRIBUIR = 6;
export const ATRIBUTO_MINIMO = 1;
export const ATRIBUTO_MAXIMO = 4;

/** A partir desta Visão, o arqueiro tem uma tentativa a mais nos puzzles. */
export const VISAO_PARA_TENTATIVA = 3;

/** Flechas com que o arqueiro começa, por nível. */
export const FLECHAS_INICIAIS = { facil: 14, medio: 12, dificil: 10 } as const;

export const ATRIBUTOS_ARQUEIRO: {
  id: NomeAtributoArqueiro;
  emoji: string;
  nome: TextoPorIdioma;
  ajuda: TextoPorIdioma;
}[] = [
  {
    id: 'pontaria',
    emoji: '[[interface/alvo]]',
    nome: { 'pt-PT': 'Pontaria', 'pt-BR': 'Pontaria' },
    ajuda: { 'pt-PT': 'Acerta mais com as flechas', 'pt-BR': 'Acerta mais com as flechas' },
  },
  {
    id: 'agilidade',
    emoji: '[[interface/agilidade]]',
    nome: { 'pt-PT': 'Agilidade', 'pt-BR': 'Agilidade' },
    ajuda: { 'pt-PT': 'Sobe, recua e foge dos golpes', 'pt-BR': 'Sobe, recua e foge dos golpes' },
  },
  {
    id: 'visao',
    emoji: '[[cenas/lupa]]',
    nome: { 'pt-PT': 'Visão', 'pt-BR': 'Visão' },
    ajuda: { 'pt-PT': 'Mais tentativas nos enigmas', 'pt-BR': 'Mais tentativas nos enigmas' },
  },
  {
    id: 'coragem',
    emoji: '[[extras/coragem]]',
    nome: { 'pt-PT': 'Coragem', 'pt-BR': 'Coragem' },
    ajuda: { 'pt-PT': 'Dá mais vida', 'pt-BR': 'Dá mais vida' },
  },
];

/** Vida inicial do arqueiro: a coragem dá mais vida. */
export function vidaMaxima(coragem: number): number {
  return 10 + coragem * 2;
}

/** Defesa do arqueiro: a agilidade ajuda a fugir dos golpes. */
export function defesaArqueiro(agilidade: number): number {
  return 9 + agilidade;
}

export const INIMIGOS_NAVIO: Record<string, InimigoNavio> = {
  caranguejo: {
    id: 'caranguejo',
    emoji: '[[objetos/caranguejo]]',
    nome: { 'pt-PT': 'O Caranguejo', 'pt-BR': 'O Caranguejo' },
    pontosDeVida: 6,
    defesa: 9,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  ratos: {
    id: 'ratos',
    emoji: '[[itens/rato]]',
    nome: { 'pt-PT': 'O Bando de Ratos', 'pt-BR': 'O Bando de Ratos' },
    pontosDeVida: 7,
    defesa: 10,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  gaivota: {
    id: 'gaivota',
    emoji: '[[inimigos/gaivota-fantasma]]',
    nome: { 'pt-PT': 'A Gaivota Fantasma', 'pt-BR': 'A Gaivota Fantasma' },
    pontosDeVida: 6,
    defesa: 12,
    bonusAtaque: 1,
    dadoDeDano: 4,
    voa: true,
  },
  marinheiro: {
    id: 'marinheiro',
    emoji: '[[inimigos/fantasma-brincalhao]]',
    nome: { 'pt-PT': 'O Marinheiro Fantasma', 'pt-BR': 'O Marinheiro Fantasma' },
    pontosDeVida: 9,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 6,
  },
  polvo: {
    id: 'polvo',
    emoji: '[[inimigos/polvo-gigante]]',
    nome: { 'pt-PT': 'O Polvo Gigante', 'pt-BR': 'O Polvo Gigante' },
    pontosDeVida: 18,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
  polvo_ferido: {
    id: 'polvo_ferido',
    emoji: '[[inimigos/polvo-ferido]]',
    nome: { 'pt-PT': 'O Polvo Ferido', 'pt-BR': 'O Polvo Ferido' },
    pontosDeVida: 12,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
};

const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };

/** Itens da mochila. As outras marcas (`furtivo`, `sabe-rota`, `amigo`, `vantagem`) são fatos escondidos. */
const ITENS_HISTORIA: Record<string, ItemHistoria> = {
  'flecha-fogo': { arquivo: 'flecha-fogo', nome: { 'pt-PT': 'Flecha de fogo', 'pt-BR': 'Flecha de fogo' } },
  sino: { arquivo: 'sino', nome: { 'pt-PT': 'Sino de prata', 'pt-BR': 'Sino de prata' } },
  luz: { arquivo: 'lanterna', nome: { 'pt-PT': 'Lampiões acesos', 'pt-BR': 'Lampiões acesos' } },
  'mapa-nautico': { arquivo: 'mapa', nome: { 'pt-PT': 'Mapa náutico', 'pt-BR': 'Mapa náutico' } },
  perola: { arquivo: 'concha', nome: { 'pt-PT': 'Pérola brilhante', 'pt-BR': 'Pérola brilhante' } },
};

const FINAIS: Record<string, Final> = {
  forca: { emoji: '[[interface/espadas]]', titulo: { 'pt-PT': 'Vitória pela força', 'pt-BR': 'Vitória pela força' } },
  esperteza: { emoji: '🐚', titulo: { 'pt-PT': 'Vitória pela esperteza', 'pt-BR': 'Vitória pela esperteza' } },
  amizade: { emoji: '[[cenas/abraco]]', titulo: { 'pt-PT': 'Vitória pela amizade', 'pt-BR': 'Vitória pela amizade' } },
};

/**
 * O Navio Fantasma, em livro-jogo. "{nome}" vira o nome do personagem (veja personagem.ts).
 *
 * Caminhos: no porto só há tempo para uma coisa (flechas, o sino ou partir); no convés, porão, cabine ou ninho do corvo.
 * O que se traz decide o final: só a pérola abre a esperteza, só o sino com a melodia certa abre a amizade;
 * sem nada disso sobra o duelo com o Polvo, que a criança também pode vencer.
 */
const PONTOS: Record<string, Ponto<NomeAtributoArqueiro>> = {
  // ---------- porto ----------
  a01: {
    id: 'a01',
    emoji: '⚓',
    texto: {
      'pt-PT':
        'Uma névoa grossa cobre o porto e um navio fantasma apareceu ao longe. Ele levou as lembranças dos pescadores e esconde a Bússola de Ouro no porão da proa. O Chefe do porto pede ajuda: «Só {nome} tem a pontaria para a trazer de volta!»',
      'pt-BR':
        'Uma névoa grossa cobre o porto e um navio fantasma apareceu ao longe. Ele levou as lembranças dos pescadores e esconde a Bússola de Ouro no porão da proa. O Chefe do porto pede ajuda: «Só {nome} tem a pontaria para trazê-la de volta!»',
    },
    pergunta: {
      'pt-PT': 'Só há tempo para uma coisa antes de o bote partir. O que faz {nome}?',
      'pt-BR': 'Só dá tempo de fazer uma coisa antes de o bote partir. O que {nome} faz?',
    },
    escolhas: [
      { texto: { 'pt-PT': 'Ir ao ferreiro de flechas', 'pt-BR': 'Ir ao ferreiro de flechas' }, destino: 'a02' },
      { texto: { 'pt-PT': 'Falar com a velha pescadora', 'pt-BR': 'Falar com a velha pescadora' }, destino: 'a03' },
      { texto: { 'pt-PT': 'Embarcar já, sem perder tempo', 'pt-BR': 'Embarcar já, sem perder tempo' }, destino: 'a04' },
    ],
  },
  a02: {
    id: 'a02',
    emoji: '🔨',
    texto: {
      'pt-PT':
        'O ferreiro está rodeado de flechas e de caixas. «Troco flechas a quem souber contar!», diz ele, a rir.',
      'pt-BR':
        'O ferreiro está rodeado de flechas e de caixas. «Troco flechas por quem souber contar!», diz ele, rindo.',
    },
    desafio: {
      tipo: 'conta',
      operacao: 'soma',
      enunciado: {
        'pt-PT': 'Há {a} flechas numa caixa e {b} flechas na outra caixa. Quantas flechas há ao todo?',
        'pt-BR': 'Há {a} flechas em uma caixa e {b} flechas na outra caixa. Quantas flechas há ao todo?',
      },
      sucesso: 'a02c',
      falha: 'a02e',
    },
  },
  a02c: {
    id: 'a02c',
    emoji: '🔥',
    texto: {
      'pt-PT':
        '«Contas certas!», ri-se o ferreiro. Dá seis flechas a {nome} e, no fundo da caixa, uma flecha de fogo que nunca se apaga.',
      'pt-BR':
        '«Contas certas!», ri o ferreiro. Ele dá seis flechas a {nome} e, no fundo da caixa, uma flecha de fogo que nunca se apaga.',
    },
    ganha: ['flecha-fogo'],
    recompensa: { flechas: 6 },
    escolhas: [{ texto: SEGUIR, destino: 'a04' }],
  },
  a02e: {
    id: 'a02e',
    emoji: '🏹',
    texto: {
      'pt-PT': 'O ferreiro coça a cabeça: «Não faz mal, a conta é difícil.» Dá duas flechas a {nome} e deseja-lhe boa sorte.',
      'pt-BR': 'O ferreiro coça a cabeça: «Não faz mal, a conta é difícil.» Ele dá duas flechas a {nome} e deseja boa sorte.',
    },
    recompensa: { flechas: 2 },
    escolhas: [{ texto: SEGUIR, destino: 'a04' }],
  },
  a03: {
    id: 'a03',
    emoji: '🎣',
    texto: {
      'pt-PT':
        'A velha pescadora remenda uma rede, sentada no cais. «Eu sei o que o fantasma teme», sussurra. «Se acertares, ensino-te.»',
      'pt-BR':
        'A velha pescadora remenda uma rede, sentada no cais. «Eu sei o que o fantasma teme», sussurra. «Se acertar, eu ensino.»',
    },
    desafio: {
      tipo: 'enigma',
      enigmas: [
        {
          pergunta: {
            'pt-PT': 'O que os fantasmas do mar mais temem?',
            'pt-BR': 'O que os fantasmas do mar mais temem?',
          },
          opcoes: [
            { 'pt-PT': 'o sino', 'pt-BR': 'o sino' },
            { 'pt-PT': 'o sal', 'pt-BR': 'o sal' },
            { 'pt-PT': 'o vento', 'pt-BR': 'o vento' },
            { 'pt-PT': 'a luz', 'pt-BR': 'a luz' },
          ],
          certa: 0,
        },
      ],
      enunciado: {
        'pt-PT': 'Escolhe o que mais assusta os fantasmas.',
        'pt-BR': 'Escolha o que mais assusta os fantasmas.',
      },
      sucesso: 'a03c',
      falha: 'a04',
    },
  },
  a03c: {
    id: 'a03c',
    emoji: '🔔',
    texto: {
      'pt-PT': '«Isso mesmo!», sorri a pescadora. Entrega a {nome} um pequeno sino de prata: «O som dele acalma os fantasmas.»',
      'pt-BR': '«Isso mesmo!», sorri a pescadora. Ela entrega a {nome} um pequeno sino de prata: «O som dele acalma os fantasmas.»',
    },
    ganha: ['sino'],
    escolhas: [{ texto: SEGUIR, destino: 'a04' }],
  },
  // ---------- chegada ao navio ----------
  a04: {
    id: 'a04',
    emoji: '⛵',
    texto: {
      'pt-PT':
        'O bote desliza pela névoa e o navio fantasma aparece, enorme, à frente. Há uma corda a pender do convés. {Nome} precisa de subir sem fazer barulho.',
      'pt-BR':
        'O bote desliza pela névoa e o navio fantasma aparece, enorme, à frente. Há uma corda pendurada no convés. {Nome} precisa subir sem fazer barulho.',
    },
    teste: { atributo: 'agilidade', dificuldade: 9, sucesso: 'a06f', falha: 'a05' },
  },
  a05: {
    id: 'a05',
    emoji: '🦀',
    texto: {
      'pt-PT': 'Escorrega! Algo agarra o bote por baixo: é um caranguejo enorme, agarrado ao casco!',
      'pt-BR': 'Escorrega! Algo agarra o bote por baixo: é um caranguejo enorme, agarrado ao casco!',
    },
    luta: { inimigo: 'caranguejo', posicao: 'perto', aoVencer: 'a06' },
  },
  a06f: {
    id: 'a06f',
    emoji: '🤫',
    texto: {
      'pt-PT': 'Sem fazer um único ruído, {nome} sobe pela corda e chega ao convés. Ninguém reparou!',
      'pt-BR': 'Sem fazer um único ruído, {nome} sobe pela corda e chega ao convés. Ninguém reparou!',
    },
    ganha: ['furtivo'],
    escolhas: [{ texto: SEGUIR, destino: 'a06' }],
  },
  a06: {
    id: 'a06',
    emoji: '🚢',
    texto: {
      'pt-PT':
        'No convés, a madeira range e as velas rasgadas balançam sozinhas. Há uma escada para o porão, a porta da cabine do capitão e um mastro com o ninho do corvo.',
      'pt-BR':
        'No convés, a madeira range e as velas rasgadas balançam sozinhas. Há uma escada para o porão, a porta da cabine do capitão e um mastro com o ninho do corvo.',
    },
    pergunta: {
      'pt-PT': 'Só há tempo para um lugar. Aonde vai {nome}?',
      'pt-BR': 'Só dá tempo de ir a um lugar. Aonde {nome} vai?',
    },
    escolhas: [
      { texto: { 'pt-PT': 'Descer ao porão', 'pt-BR': 'Descer ao porão' }, destino: 'a07' },
      { texto: { 'pt-PT': 'Entrar na cabine do capitão', 'pt-BR': 'Entrar na cabine do capitão' }, destino: 'a08' },
      { texto: { 'pt-PT': 'Subir ao ninho do corvo', 'pt-BR': 'Subir ao ninho do corvo' }, destino: 'a09' },
    ],
  },
  // ---------- porão ----------
  a07: {
    id: 'a07',
    emoji: '🏮',
    texto: {
      'pt-PT': 'O porão está às escuras. Pelo chão, lampiões velhos esperam em fila. Cada toque acende um e muda os vizinhos.',
      'pt-BR': 'O porão está escuro. No chão, lampiões velhos esperam em fila. Cada toque acende um e muda os vizinhos.',
    },
    desafio: {
      tipo: 'luzes',
      luz: '🏮',
      enunciado: {
        'pt-PT': 'Acende todos os lampiões do porão.',
        'pt-BR': 'Acenda todos os lampiões do porão.',
      },
      sucesso: 'a07c',
      falha: 'a07b',
    },
  },
  a07b: {
    id: 'a07b',
    emoji: '🐀',
    texto: {
      'pt-PT': 'No escuro, uma multidão de ratos corre aos guinchos. Sem luz, é difícil mirar!',
      'pt-BR': 'No escuro, uma multidão de ratos corre guinchando. Sem luz, é difícil mirar!',
    },
    luta: { inimigo: 'ratos', posicao: 'perto', bonusAcerto: -2, aoVencer: 'a10' },
  },
  a07c: {
    id: 'a07c',
    emoji: '💡',
    texto: {
      'pt-PT': 'Todos os lampiões se acendem e o porão enche-se de luz dourada. Os ratos fogem, assustados.',
      'pt-BR': 'Todos os lampiões se acendem e o porão se enche de luz dourada. Os ratos fogem, assustados.',
    },
    ganha: ['luz'],
    escolhas: [{ texto: SEGUIR, destino: 'a10' }],
  },
  a10: {
    id: 'a10',
    emoji: '🧰',
    texto: {
      'pt-PT': 'Ao fundo do porão há um baú cheio de coisas do mar. Uma delas brilha mais do que as outras!',
      'pt-BR': 'No fundo do porão há um baú cheio de coisas do mar. Uma delas brilha mais do que as outras!',
    },
    desafio: {
      tipo: 'escrever',
      // peixe, barco, corda, chapéu, rato
      palavras: [2520, 2273, 26026, 2572, 2546],
      enunciado: {
        'pt-PT': 'Escreve o nome da coisa que brilha no baú.',
        'pt-BR': 'Escreva o nome da coisa que brilha no baú.',
      },
      sucesso: 'a10c',
      falha: 'a11',
    },
  },
  a10c: {
    id: 'a10c',
    emoji: '🐚',
    texto: {
      'pt-PT': 'Debaixo da coisa que brilhava, {nome} encontra uma pérola redonda e brilhante. Guarda-a com cuidado.',
      'pt-BR': 'Debaixo da coisa que brilhava, {nome} encontra uma pérola redonda e brilhante. Guarda com cuidado.',
    },
    ganha: ['perola'],
    escolhas: [{ texto: SEGUIR, destino: 'a11' }],
  },
  // ---------- cabine ----------
  a08: {
    id: 'a08',
    emoji: '📖',
    texto: {
      'pt-PT':
        'A porta da cabine está trancada com um cadeado de figuras. Sobre a mesa, o diário do capitão diz que número tinha cada figura.',
      'pt-BR':
        'A porta da cabine está trancada com um cadeado de figuras. Em cima da mesa, o diário do capitão diz que número tinha cada figura.',
    },
    desafio: {
      tipo: 'codigo',
      figuras: [
        { emoji: '☀️', nome: { 'pt-PT': 'sol', 'pt-BR': 'sol' } },
        { emoji: '🌙', nome: { 'pt-PT': 'lua', 'pt-BR': 'lua' } },
        { emoji: '🌊', nome: { 'pt-PT': 'onda', 'pt-BR': 'onda' } },
        { emoji: '⭐', nome: { 'pt-PT': 'estrela', 'pt-BR': 'estrela' } },
      ],
      enunciado: {
        'pt-PT': 'Abre o cadeado com os números do diário.',
        'pt-BR': 'Abra o cadeado com os números do diário.',
      },
      sucesso: 'a08c',
      falha: 'a08b',
    },
  },
  a08b: {
    id: 'a08b',
    emoji: '👻',
    texto: {
      'pt-PT': 'O cadeado dá um estalo e um marinheiro fantasma acorda, de espada na mão!',
      'pt-BR': 'O cadeado dá um estalo e um marinheiro fantasma acorda, de espada na mão!',
    },
    luta: { inimigo: 'marinheiro', posicao: 'perto', aoVencer: 'a11' },
  },
  a08c: {
    id: 'a08c',
    emoji: '🗺️',
    texto: {
      'pt-PT': 'Clique! A porta abre-se. Dentro, {nome} encontra um mapa náutico com o caminho para o antro do Polvo.',
      'pt-BR': 'Clique! A porta se abre. Lá dentro, {nome} encontra um mapa náutico com o caminho para o antro do Polvo.',
    },
    ganha: ['mapa-nautico'],
    escolhas: [{ texto: SEGUIR, destino: 'a11' }],
  },
  // ---------- ninho do corvo ----------
  a09: {
    id: 'a09',
    emoji: '🚩',
    texto: {
      'pt-PT':
        'No ninho do corvo, bandeiras de sinal esperam num cesto. O diário mostrou a ordem em que o capitão as usava para dar o rumo.',
      'pt-BR':
        'No ninho do corvo, bandeiras de sinal esperam em um cesto. O diário mostrou a ordem em que o capitão as usava para dar o rumo.',
    },
    desafio: {
      tipo: 'ordem',
      figuras: [
        { emoji: '🟥', nome: { 'pt-PT': 'vermelha', 'pt-BR': 'vermelha' } },
        { emoji: '🟨', nome: { 'pt-PT': 'amarela', 'pt-BR': 'amarela' } },
        { emoji: '🟦', nome: { 'pt-PT': 'azul', 'pt-BR': 'azul' } },
        { emoji: '🟩', nome: { 'pt-PT': 'verde', 'pt-BR': 'verde' } },
        { emoji: '🟪', nome: { 'pt-PT': 'roxa', 'pt-BR': 'roxa' } },
      ],
      enunciado: {
        'pt-PT': 'Põe as bandeiras na ordem do diário: a vermelha primeiro, depois a amarela, a azul, a verde e por fim a roxa.',
        'pt-BR': 'Coloque as bandeiras na ordem do diário: a vermelha primeiro, depois a amarela, a azul, a verde e por fim a roxa.',
      },
      sucesso: 'a09c',
      falha: 'a09b',
    },
  },
  a09b: {
    id: 'a09b',
    emoji: '[[inimigos/gaivota-fantasma]]',
    texto: {
      'pt-PT': 'As bandeiras caem e uma gaivota fantasma desce em voo rasante. Ela guarda o ninho!',
      'pt-BR': 'As bandeiras caem e uma gaivota fantasma desce em voo rasante. Ela guarda o ninho!',
    },
    luta: { inimigo: 'gaivota', posicao: 'longe', aoVencer: 'a11' },
  },
  a09c: {
    id: 'a09c',
    emoji: '🔭',
    texto: {
      'pt-PT': 'As bandeiras brilham na ordem certa. De cima, {nome} vê a proa inteira e o rumo até ao antro do Polvo.',
      'pt-BR': 'As bandeiras brilham na ordem certa. De cima, {nome} vê a proa inteira e o rumo até o antro do Polvo.',
    },
    ganha: ['sabe-rota'],
    escolhas: [{ texto: SEGUIR, destino: 'a11' }],
  },
  // ---------- salão dos fantasmas ----------
  a11: {
    id: 'a11',
    emoji: '🎭',
    texto: {
      'pt-PT': 'No salão, a tripulação fantasma dança sem fazer som, num círculo que nunca pára. A escada da proa fica do outro lado.',
      'pt-BR': 'No salão, a tripulação fantasma dança sem fazer som, em um círculo que nunca pára. A escada da proa fica do outro lado.',
    },
    pergunta: {
      'pt-PT': 'Como atravessa {nome} o salão?',
      'pt-BR': 'Como {nome} atravessa o salão?',
    },
    escolhas: [
      { texto: { 'pt-PT': 'Tocar o sino de prata', 'pt-BR': 'Tocar o sino de prata' }, destino: 'a12', se: { tem: ['sino'] } },
      { texto: { 'pt-PT': 'Passar às escondidas', 'pt-BR': 'Passar às escondidas' }, destino: 'a14', se: { tem: ['furtivo'] } },
      { texto: { 'pt-PT': 'Atravessar no meio da dança', 'pt-BR': 'Atravessar no meio da dança' }, destino: 'a13' },
    ],
  },
  a12: {
    id: 'a12',
    emoji: '🔔',
    texto: {
      'pt-PT': 'Ding! Os fantasmas param de dançar. O capitão aproxima-se e pede: «Toca-nos a melodia do nosso navio, como antigamente.»',
      'pt-BR': 'Ding! Os fantasmas param de dançar. O capitão se aproxima e pede: «Toque a melodia do nosso navio, como antigamente.»',
    },
    desafio: {
      tipo: 'som',
      enunciado: {
        'pt-PT': 'Repete a melodia do sino do navio.',
        'pt-BR': 'Repita a melodia do sino do navio.',
      },
      sucesso: 'a12c',
      falha: 'a14',
    },
  },
  a12c: {
    id: 'a12c',
    emoji: '🤝',
    texto: {
      'pt-PT': 'A melodia enche o salão e os fantasmas sorriem pela primeira vez em cem anos. O capitão faz uma vénia: «Conta connosco, {amigo|amiga}.»',
      'pt-BR': 'A melodia enche o salão e os fantasmas sorriem pela primeira vez em cem anos. O capitão faz uma reverência: «Conte conosco, {amigo|amiga}.»',
    },
    ganha: ['amigo'],
    escolhas: [{ texto: SEGUIR, destino: 'a14' }],
  },
  a13: {
    id: 'a13',
    emoji: '💃',
    texto: {
      'pt-PT': 'Pé ante pé, {nome} entra na roda de fantasmas, a desviar-se de braços e de capas.',
      'pt-BR': 'Pé ante pé, {nome} entra na roda de fantasmas, desviando de braços e de capas.',
    },
    teste: { atributo: 'agilidade', dificuldade: 10, sucesso: 'a14', falha: 'a13b' },
  },
  a13b: {
    id: 'a13b',
    emoji: '👻',
    texto: {
      'pt-PT': 'Tropeço! {Nome} cai aos pés de um marinheiro fantasma, que levanta a espada.',
      'pt-BR': 'Tropeço! {Nome} cai aos pés de um marinheiro fantasma, que levanta a espada.',
    },
    luta: { inimigo: 'marinheiro', posicao: 'perto', aoVencer: 'a14' },
  },
  // ---------- escada da proa ----------
  a14: {
    id: 'a14',
    emoji: '🪜',
    texto: {
      'pt-PT': 'A escada da proa desce para o antro do Polvo. Há argolas e cabos na parede, que mostram o rumo certo.',
      'pt-BR': 'A escada da proa desce para o antro do Polvo. Há argolas e cabos na parede, que mostram o rumo certo.',
    },
    pergunta: { 'pt-PT': 'Como encontra {nome} o rumo?', 'pt-BR': 'Como {nome} encontra o rumo?' },
    escolhas: [
      {
        texto: { 'pt-PT': 'Seguir o rumo que viu do ninho', 'pt-BR': 'Seguir o rumo que viu do ninho' },
        destino: 'a14c',
        se: { tem: ['sabe-rota'] },
      },
      {
        texto: { 'pt-PT': 'Contar as argolas do cabo', 'pt-BR': 'Contar as argolas do cabo' },
        destino: 'a14p',
        se: { naoTem: ['sabe-rota'] },
      },
    ],
  },
  a14p: {
    id: 'a14p',
    emoji: '⭕',
    texto: {
      'pt-PT': 'Há argolas no cabo da escada. O número delas é o rumo certo.',
      'pt-BR': 'Há argolas no cabo da escada. O número delas é o rumo certo.',
    },
    desafio: {
      tipo: 'contar',
      figura: { emoji: '⭕' },
      parecida: { emoji: '🟠' },
      enunciado: {
        'pt-PT': 'Conta as argolas e escreve o número.',
        'pt-BR': 'Conte as argolas e digite o número.',
      },
      sucesso: 'a14c',
      falha: 'a15',
    },
  },
  a14c: {
    id: 'a14c',
    emoji: '🧭',
    texto: {
      'pt-PT': 'O rumo está certo! {Nome} desce sem se perder e já sabe onde o Polvo é mais fraco.',
      'pt-BR': 'O rumo está certo! {Nome} desce sem se perder e já sabe onde o Polvo é mais fraco.',
    },
    ganha: ['vantagem'],
    escolhas: [{ texto: SEGUIR, destino: 'a15' }],
  },
  // ---------- antro do Polvo ----------
  a15: {
    id: 'a15',
    emoji: '[[inimigos/polvo-gigante]]',
    texto: {
      'pt-PT': 'No fundo do navio, o Polvo Gigante guarda a Bússola de Ouro entre os tentáculos. Ela brilha como o sol.',
      'pt-BR': 'No fundo do navio, o Polvo Gigante guarda a Bússola de Ouro entre os tentáculos. Ela brilha como o sol.',
    },
    pergunta: { 'pt-PT': 'O que faz {nome}?', 'pt-BR': 'O que {nome} faz?' },
    escolhas: [
      { texto: { 'pt-PT': 'Atirar de longe', 'pt-BR': 'Atirar de longe' }, destino: 'a16' },
      { texto: { 'pt-PT': 'Mirar no ponto fraco', 'pt-BR': 'Mirar no ponto fraco' }, destino: 'a16f', se: { tem: ['vantagem'] } },
      { texto: { 'pt-PT': 'Oferecer a pérola', 'pt-BR': 'Oferecer a pérola' }, destino: 'a17', se: { tem: ['perola'] } },
      { texto: { 'pt-PT': 'Chamar o capitão', 'pt-BR': 'Chamar o capitão' }, destino: 'a18', se: { tem: ['amigo'] } },
    ],
  },
  a16: {
    id: 'a16',
    emoji: '🏹',
    texto: {
      'pt-PT': '{Nome} aperta o arco, respira fundo e dispara. O Polvo ruge e estica os tentáculos!',
      'pt-BR': '{Nome} aperta o arco, respira fundo e dispara. O Polvo ruge e estica os tentáculos!',
    },
    luta: { inimigo: 'polvo', posicao: 'longe', aoVencer: 'a19' },
  },
  a16f: {
    id: 'a16f',
    emoji: '🎯',
    texto: {
      'pt-PT': 'A flecha voa direta ao ponto fraco, ali, entre dois olhos. O Polvo recua, ferido!',
      'pt-BR': 'A flecha voa direto ao ponto fraco, ali, entre dois olhos. O Polvo recua, ferido!',
    },
    luta: {
      inimigo: 'polvo_ferido',
      posicao: 'longe',
      bonusAcertoCom: { marca: 'flecha-fogo', bonus: 1 },
      aoVencer: 'a19',
    },
  },
  a17: {
    id: 'a17',
    emoji: '🐚',
    texto: {
      'pt-PT': '{Nome} mostra a pérola. Os olhos do Polvo brilham, mas ele desconfia: «Só trocamos se abrires a minha concha de ondas.»',
      'pt-BR': '{Nome} mostra a pérola. Os olhos do Polvo brilham, mas ele desconfia: «Só trocamos se você abrir a minha concha de ondas.»',
    },
    desafio: {
      tipo: 'padrao',
      pecas: [
        { emoji: '[[objetos/bolinha-azul]]', nome: { 'pt-PT': 'onda azul', 'pt-BR': 'onda azul' } },
        { emoji: '[[objetos/bolinha-verde]]', nome: { 'pt-PT': 'onda verde', 'pt-BR': 'onda verde' } },
        { emoji: '[[objetos/bolinha-roxa]]', nome: { 'pt-PT': 'onda roxa', 'pt-BR': 'onda roxa' } },
      ],
      enunciado: {
        'pt-PT': 'A concha abre com o padrão das ondas. Qual é a próxima?',
        'pt-BR': 'A concha abre com o padrão das ondas. Qual é a próxima?',
      },
      sucesso: 'a20',
      falha: 'a16',
    },
  },
  a18: {
    id: 'a18',
    emoji: '👻',
    texto: {
      'pt-PT': 'O capitão e os marinheiros entram, de cabeça baixa. Cada um perdeu uma coisa que o Polvo guarda. «Ajuda-nos a lembrar», pedem.',
      'pt-BR': 'O capitão e os marinheiros entram, de cabeça baixa. Cada um perdeu uma coisa que o Polvo guarda. «Ajude a gente a lembrar», pedem.',
    },
    desafio: {
      tipo: 'pares',
      a: [
        { emoji: '👻', nome: { 'pt-PT': 'Pé Frio', 'pt-BR': 'Pé Frio' } },
        { emoji: '👻', nome: { 'pt-PT': 'Cabeça ao Vento', 'pt-BR': 'Cabeça ao Vento' } },
        { emoji: '👻', nome: { 'pt-PT': 'Pescoço Gelado', 'pt-BR': 'Pescoço Gelado' } },
        { emoji: '👻', nome: { 'pt-PT': 'Mão Vazia', 'pt-BR': 'Mão Vazia' } },
      ],
      b: [
        { emoji: '[[itens/bota]]', nome: { 'pt-PT': 'bota', 'pt-BR': 'bota' } },
        { emoji: '[[itens/chapeu]]', nome: { 'pt-PT': 'chapéu', 'pt-BR': 'chapéu' } },
        { emoji: '[[itens/lenco]]', nome: { 'pt-PT': 'lenço', 'pt-BR': 'lenço' } },
        { emoji: '🔪', nome: { 'pt-PT': 'canivete', 'pt-BR': 'canivete' } },
      ],
      enunciado: {
        'pt-PT': 'Devolve a cada marinheiro a coisa que perdeu.',
        'pt-BR': 'Devolva a cada marinheiro a coisa que perdeu.',
      },
      sucesso: 'a21',
      falha: 'a16',
    },
  },
  // ---------- finais ----------
  a19: {
    id: 'a19',
    emoji: '🏆',
    texto: {
      'pt-PT':
        'A última flecha de {nome} acerta em cheio. O Polvo solta a Bússola de Ouro e mergulha, assustado. A névoa levanta e as lembranças voltam ao porto: venceu a pontaria!',
      'pt-BR':
        'A última flecha de {nome} acerta em cheio. O Polvo solta a Bússola de Ouro e mergulha, assustado. A névoa levanta e as lembranças voltam ao porto: venceu a pontaria!',
    },
    fim: 'forca',
  },
  a20: {
    id: 'a20',
    emoji: '🐚',
    texto: {
      'pt-PT':
        'A concha abre-se e {nome} troca a pérola pela Bússola de Ouro. O Polvo abraça a pérola, feliz: era dele! A névoa levanta e as lembranças voltam ao porto. Venceu a esperteza!',
      'pt-BR':
        'A concha se abre e {nome} troca a pérola pela Bússola de Ouro. O Polvo abraça a pérola, feliz: era dele! A névoa levanta e as lembranças voltam ao porto. Venceu a esperteza!',
    },
    fim: 'esperteza',
  },
  a21: {
    id: 'a21',
    emoji: '🤝',
    texto: {
      'pt-PT':
        'Cada marinheiro recebe o que perdeu e chora de alegria. O Polvo, comovido, entrega a Bússola de Ouro a {nome}. A tripulação inteira acompanha-o até ao porto e a névoa levanta. Venceu a amizade!',
      'pt-BR':
        'Cada marinheiro recebe o que perdeu e chora de alegria. O Polvo, comovido, entrega a Bússola de Ouro a {nome}. A tripulação inteira acompanha até o porto e a névoa levanta. Venceu a amizade!',
    },
    fim: 'amizade',
  },
};

export const LIVRO_NAVIO_FANTASMA = livro<NomeAtributoArqueiro>({
  id: 'navio-fantasma',
  pontos: PONTOS,
  inicial: 'a01',
  finais: FINAIS,
  itens: ITENS_HISTORIA,
});
