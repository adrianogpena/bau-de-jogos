import type { TextoPorIdioma } from '../../compartilhado/idioma';
import { livro } from './livro/regras';
import type { Final, ItemHistoria, Ponto } from './livro/tipos';
import type { Inimigo, NomeAtributo } from './tipos';

export const PONTOS_PARA_DISTRIBUIR = 6;
export const ATRIBUTO_MINIMO = 1;
export const ATRIBUTO_MAXIMO = 4;

export const ATRIBUTOS: {
  id: NomeAtributo;
  emoji: string;
  nome: TextoPorIdioma;
  ajuda: TextoPorIdioma;
}[] = [
  {
    id: 'forca',
    emoji: '[[interface/forca]]',
    nome: { 'pt-PT': 'Força', 'pt-BR': 'Força' },
    ajuda: { 'pt-PT': 'Acerta mais e bate mais forte', 'pt-BR': 'Acerta mais e bate mais forte' },
  },
  {
    id: 'agilidade',
    emoji: '[[interface/agilidade]]',
    nome: { 'pt-PT': 'Agilidade', 'pt-BR': 'Agilidade' },
    ajuda: { 'pt-PT': 'Foge dos golpes e salta bem', 'pt-BR': 'Foge dos golpes e pula bem' },
  },
  {
    id: 'inteligencia',
    emoji: '[[extras/inteligencia]]',
    nome: { 'pt-PT': 'Inteligência', 'pt-BR': 'Inteligência' },
    ajuda: { 'pt-PT': 'Mais tentativas nos enigmas', 'pt-BR': 'Mais tentativas nos enigmas' },
  },
  {
    id: 'coragem',
    emoji: '[[extras/coragem]]',
    nome: { 'pt-PT': 'Coragem', 'pt-BR': 'Coragem' },
    ajuda: { 'pt-PT': 'Dá mais vida', 'pt-BR': 'Dá mais vida' },
  },
];

/** A partir desta Inteligência, o herói tem uma tentativa a mais nos puzzles. */
export const INTELIGENCIA_PARA_TENTATIVA = 3;

/** Vida inicial do herói: a coragem dá mais vida. */
export function vidaMaxima(coragem: number): number {
  return 10 + coragem * 2;
}

export const INIMIGOS: Record<string, Inimigo> = {
  lobo: {
    id: 'lobo',
    emoji: '[[inimigos/lobo]]',
    nome: { 'pt-PT': 'O Lobo', 'pt-BR': 'O Lobo' },
    pontosDeVida: 8,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  lesma: {
    id: 'lesma',
    emoji: '[[inimigos/lesma]]',
    nome: { 'pt-PT': 'A Lesma Gigante', 'pt-BR': 'A Lesma Gigante' },
    pontosDeVida: 6,
    defesa: 8,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  morcego: {
    id: 'morcego',
    emoji: '[[inimigos/morcego]]',
    nome: { 'pt-PT': 'O Morcego', 'pt-BR': 'O Morcego' },
    pontosDeVida: 6,
    defesa: 12,
    bonusAtaque: 1,
    dadoDeDano: 4,
  },
  esqueleto: {
    id: 'esqueleto',
    emoji: '[[inimigos/esqueleto]]',
    nome: { 'pt-PT': 'O Esqueleto', 'pt-BR': 'O Esqueleto' },
    pontosDeVida: 9,
    defesa: 11,
    bonusAtaque: 1,
    dadoDeDano: 6,
  },
  sapo: {
    id: 'sapo',
    emoji: '[[inimigos/sapo-gigante]]',
    nome: { 'pt-PT': 'O Sapo Gigante', 'pt-BR': 'O Sapo Gigante' },
    pontosDeVida: 8,
    defesa: 9,
    bonusAtaque: 0,
    dadoDeDano: 4,
  },
  goblin: {
    id: 'goblin',
    emoji: '[[inimigos/goblin-chefe]]',
    nome: { 'pt-PT': 'O Goblin Chefe', 'pt-BR': 'O Goblin Chefe' },
    pontosDeVida: 16,
    defesa: 12,
    bonusAtaque: 2,
    dadoDeDano: 6,
  },
};

const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };
const O_QUE_FAZER: TextoPorIdioma = {
  'pt-PT': 'O que quer fazer {nome}?',
  'pt-BR': 'O que {nome} quer fazer?',
};
const TOCAR_FLAUTA: TextoPorIdioma = { 'pt-PT': 'Tocar a flauta de osso', 'pt-BR': 'Tocar a flauta de osso' };
const DECIFRAR: TextoPorIdioma = { 'pt-PT': '🧠 Decifrar a fechadura', 'pt-BR': '🧠 Decifrar a fechadura' };
const EMPURRAR: TextoPorIdioma = { 'pt-PT': '💪 Empurrar com força', 'pt-BR': '💪 Empurrar com força' };
const BATER: TextoPorIdioma = { 'pt-PT': 'Bater três vezes devagar', 'pt-BR': 'Bater três vezes devagar' };

/** Itens que aparecem na mochila. As outras marcas (`sabe`, `amigo`, `luz`) são fatos escondidos da história. */
const ITENS_HISTORIA: Record<string, ItemHistoria> = {
  mapa: { icone: 'interface/mapa', nome: { 'pt-PT': 'Mapa dos atalhos', 'pt-BR': 'Mapa dos atalhos' } },
  pao: { arquivo: 'pao', nome: { 'pt-PT': 'Pão quentinho', 'pt-BR': 'Pão quentinho' } },
  corda: { arquivo: 'corda', nome: { 'pt-PT': 'Corda', 'pt-BR': 'Corda' } },
  lanterna: { arquivo: 'lanterna', nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' } },
  flauta: { arquivo: 'flauta', nome: { 'pt-PT': 'Flauta de osso', 'pt-BR': 'Flauta de osso' } },
  cogumelos: { arquivo: 'cogumelo', nome: { 'pt-PT': 'Cogumelos de luz', 'pt-BR': 'Cogumelos de luz' } },
};

/** Os três finais: dependem do que a criança descobriu e trouxe pelo caminho. */
const FINAIS: Record<string, Final> = {
  forca: { emoji: '[[interface/espadas]]', titulo: { 'pt-PT': 'Vitória pela força', 'pt-BR': 'Vitória pela força' } },
  esperteza: { emoji: '[[cenas/lua]]', titulo: { 'pt-PT': 'Vitória pela esperteza', 'pt-BR': 'Vitória pela esperteza' } },
  amizade: { emoji: '[[cenas/abraco]]', titulo: { 'pt-PT': 'Vitória pela amizade', 'pt-BR': 'Vitória pela amizade' } },
};

/**
 * A Pedra da Lua, em livro-jogo. "{nome}" vira o nome do personagem (veja personagem.ts).
 *
 * Caminhos: na aldeia só há tempo para uma coisa (mapa, pão ou partir); depois floresta, rio ou atalho da montanha;
 * no vale, ponte, pântano ou túnel. O que se descobre (porque o goblin levou a Pedra) e o que se traz
 * (flauta, uma luz) decide o final: pela força, pela esperteza ou pela amizade.
 */
const PONTOS: Record<string, Ponto<NomeAtributo>> = {
  // ---------- aldeia ----------
  aldeia: {
    id: 'aldeia',
    emoji: '[[cenas/aldeia]]',
    texto: {
      'pt-PT':
        'O Chefe da aldeia chama {nome} à praça: «A Pedra da Lua foi roubada pelo Goblin Chefe e o céu ficou escuro! Ele escondeu-se numa caverna, longe daqui. Só tu podes trazer a Pedra de volta!»',
      'pt-BR':
        'O Chefe da vila chama {nome} até a praça: «A Pedra da Lua foi roubada pelo Goblin Chefe e o céu ficou escuro! Ele se escondeu em uma caverna, longe daqui. Só você pode trazer a Pedra de volta!»',
    },
    pergunta: {
      'pt-PT': 'Antes de partir, só há tempo para uma coisa. O que faz {nome}?',
      'pt-BR': 'Antes de partir, só dá tempo de fazer uma coisa. O que {nome} faz?',
    },
    escolhas: [
      { texto: { 'pt-PT': '📜 Abrir o mapa velho do Chefe', 'pt-BR': '📜 Abrir o mapa velho do Chefe' }, destino: 'mapa' },
      { texto: { 'pt-PT': 'Ajudar a padeira aflita', 'pt-BR': 'Ajudar a padeira aflita' }, destino: 'padaria' },
      { texto: { 'pt-PT': 'Partir já, sem perder tempo', 'pt-BR': 'Partir já, sem perder tempo' }, destino: 'saida' },
    ],
  },
  mapa: {
    id: 'mapa',
    emoji: '[[interface/mapa]]',
    texto: {
      'pt-PT':
        'O Chefe mostra um mapa velho, fechado por um cadeado mágico com um desenho: «Este mapa esconde atalhos secretos! O cadeado só abre para quem escrever o nome do desenho.»',
      'pt-BR':
        'O Chefe mostra um mapa velho, fechado por um cadeado mágico com um desenho: «Este mapa esconde atalhos secretos! O cadeado só abre para quem escrever o nome do desenho.»',
    },
    desafio: {
      tipo: 'escrever',
      palavras: [2933, 7252, 2256, 6140, 6594, 2729, 2623, 2966, 2638],
      enunciado: {
        'pt-PT': 'Escreve o nome do desenho para abrir o cadeado.',
        'pt-BR': 'Escreva o nome do desenho para abrir o cadeado.',
      },
      sucesso: 'mapa_certo',
      falha: 'mapa_errado',
    },
  },
  mapa_certo: {
    id: 'mapa_certo',
    emoji: '[[interface/mapa]]',
    texto: {
      'pt-PT':
        'Clique! O cadeado abre-se e o mapa mostra dois atalhos secretos: um na montanha e outro num túnel. {Nome} guarda o mapa na mochila.',
      'pt-BR':
        'Clique! O cadeado se abre e o mapa mostra dois atalhos secretos: um na montanha e outro em um túnel. {Nome} guarda o mapa na mochila.',
    },
    ganha: ['mapa'],
    escolhas: [{ texto: SEGUIR, destino: 'saida' }],
  },
  mapa_errado: {
    id: 'mapa_errado',
    emoji: '[[interface/pergaminho]]',
    texto: {
      'pt-PT':
        'O cadeado não abriu e o mapa continua fechado. «Não faz mal», diz o Chefe. «Quem tem coragem também encontra o caminho sem mapa!»',
      'pt-BR':
        'O cadeado não abriu e o mapa continua fechado. «Não faz mal», diz o Chefe. «Quem tem coragem também encontra o caminho sem mapa!»',
    },
    escolhas: [{ texto: SEGUIR, destino: 'saida' }],
  },
  padaria: {
    id: 'padaria',
    emoji: '[[cenas/aldeia]]',
    texto: {
      'pt-PT':
        'A padeira anda de um lado para o outro, aflita: «Tenho de entregar o pão antes de escurecer e já perdi a conta! Ajudas-me a contar?»',
      'pt-BR':
        'A padeira anda de um lado para o outro, aflita: «Tenho que entregar o pão antes de escurecer e já perdi a conta! Você me ajuda a contar?»',
    },
    desafio: {
      tipo: 'conta',
      operacao: 'soma',
      enunciado: {
        'pt-PT': 'Num cesto há {a} pães e no outro cesto há {b} pães. Quantos pães há ao todo?',
        'pt-BR': 'Em um cesto há {a} pães e no outro cesto há {b} pães. Quantos pães há ao todo?',
      },
      sucesso: 'padaria_certo',
      falha: 'padaria_errado',
    },
  },
  padaria_certo: {
    id: 'padaria_certo',
    emoji: '[[cenas/aldeia]]',
    texto: {
      'pt-PT':
        '«Contas certas!», ri-se a padeira. «Leva este pão quentinho para a viagem. Um pão partilhado faz amigos em qualquer lado!»',
      'pt-BR':
        '«Conta certa!», ri a padeira. «Leve este pão quentinho para a viagem. Um pão dividido faz amigos em qualquer lugar!»',
    },
    ganha: ['pao'],
    escolhas: [{ texto: SEGUIR, destino: 'saida' }],
  },
  padaria_errado: {
    id: 'padaria_errado',
    emoji: '[[cenas/aldeia]]',
    texto: {
      'pt-PT':
        'A padeira conta outra vez pelos dedos e sorri: «Deixa estar, eu resolvo! Obrigada por tentares. Agora vai, que a noite está a chegar!»',
      'pt-BR':
        'A padeira conta de novo nos dedos e sorri: «Pode deixar, eu resolvo! Obrigada por tentar. Agora vá, que a noite está chegando!»',
    },
    escolhas: [{ texto: SEGUIR, destino: 'saida' }],
  },

  // ---------- saída da aldeia: floresta, rio ou atalho ----------
  saida: {
    id: 'saida',
    emoji: '[[cenas/estrada]]',
    texto: {
      'pt-PT':
        '{Nome} chega ao fim da aldeia. O caminho divide-se: de um lado, a floresta escura; do outro, um rio com pedras no meio da água.',
      'pt-BR':
        '{Nome} chega ao fim da vila. O caminho se divide: de um lado, a floresta escura; do outro, um rio com pedras no meio da água.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      { texto: { 'pt-PT': '🌲 Entrar na floresta escura', 'pt-BR': '🌲 Entrar na floresta escura' }, destino: 'floresta' },
      { texto: { 'pt-PT': '🌊 Atravessar o rio', 'pt-BR': '🌊 Atravessar o rio' }, destino: 'rio' },
      {
        texto: { 'pt-PT': '🗺️ Seguir o atalho da montanha', 'pt-BR': '🗺️ Seguir o atalho da montanha' },
        destino: 'trilha',
        se: { tem: ['mapa'] },
      },
    ],
  },
  floresta: {
    id: 'floresta',
    emoji: '[[cenas/floresta]]',
    texto: {
      'pt-PT':
        '{Nome} entra na floresta escura e ouve um choro baixinho. Preso numa rede de caçador está um goblin pequenino! À volta dele anda um lobo de olhos amarelos, a rosnar.',
      'pt-BR':
        '{Nome} entra na floresta escura e ouve um choro baixinho. Preso em uma rede de caçador está um goblin pequenininho! Em volta dele anda um lobo de olhos amarelos, rosnando.',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'lobo', aoVencer: 'zip_livre' },
    escolhas: [
      {
        texto: { 'pt-PT': 'Atirar o pão ao lobo', 'pt-BR': 'Jogar o pão para o lobo' },
        destino: 'lobo_pao',
        se: { tem: ['pao'] },
      },
      {
        texto: { 'pt-PT': 'Passar às escondidas e seguir caminho', 'pt-BR': 'Passar escondido e seguir caminho' },
        destino: 'fuga',
      },
    ],
  },
  lobo_pao: {
    id: 'lobo_pao',
    emoji: '[[inimigos/lobo]]',
    texto: {
      'pt-PT':
        'O lobo cheira o pão quentinho, abana a cauda e leva-o para longe, todo contente. Afinal só tinha fome!',
      'pt-BR':
        'O lobo cheira o pão quentinho, abana o rabo e leva o pão para longe, todo contente. No fim, ele só estava com fome!',
    },
    perde: ['pao'],
    escolhas: [
      { texto: { 'pt-PT': 'Soltar o goblin pequenino', 'pt-BR': 'Soltar o goblin pequenininho' }, destino: 'zip_livre' },
    ],
  },
  fuga: {
    id: 'fuga',
    emoji: '[[cenas/floresta]]',
    texto: {
      'pt-PT': '{Nome} baixa-se atrás dos arbustos e avança pé ante pé, sem pisar nenhum ramo seco...',
      'pt-BR': '{Nome} se abaixa atrás dos arbustos e avança na ponta dos pés, sem pisar em nenhum galho seco...',
    },
    teste: { atributo: 'agilidade', dificuldade: 10, sucesso: 'fuga_certo', falha: 'fuga_errado' },
  },
  fuga_certo: {
    id: 'fuga_certo',
    emoji: '[[cenas/acrobata]]',
    texto: {
      'pt-PT':
        'O lobo nem deu por nada! {Nome} deixa a floresta para trás. O choro do goblin pequenino ainda se ouve ao longe...',
      'pt-BR':
        'O lobo nem percebeu! {Nome} deixa a floresta para trás. O choro do goblin pequenininho ainda dá para ouvir ao longe...',
    },
    escolhas: [{ texto: SEGUIR, destino: 'clareira' }],
  },
  fuga_errado: {
    id: 'fuga_errado',
    emoji: '[[inimigos/lobo]]',
    texto: {
      'pt-PT': 'Crac! Um ramo estalou. O lobo vira-se e salta para o meio do caminho!',
      'pt-BR': 'Crac! Um galho estalou. O lobo se vira e pula no meio do caminho!',
    },
    luta: { inimigo: 'lobo', aoVencer: 'zip_livre' },
  },
  zip_livre: {
    id: 'zip_livre',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT':
        '{Nome} corta a rede e o goblin pequenino salta cá para fora: «Obrigado! Chamo-me Zip. O nosso Chefe não é mau! Os cogumelos de luz da nossa caverna secaram e os goblins pequeninos têm medo do escuro. Foi por isso que ele levou a Pedra da Lua. Quando chegares à porta da caverna, bate três vezes devagar: é o nosso sinal secreto.»',
      'pt-BR':
        '{Nome} corta a rede e o goblin pequenininho pula para fora: «Obrigado! Eu me chamo Zip. O nosso Chefe não é mau! Os cogumelos de luz da nossa caverna secaram e os goblins pequenininhos têm medo do escuro. Foi por isso que ele levou a Pedra da Lua. Quando você chegar à porta da caverna, bata três vezes devagar: é o nosso sinal secreto.»',
    },
    ganha: ['sabe', 'amigo'],
    escolhas: [{ texto: SEGUIR, destino: 'clareira' }],
  },
  rio: {
    id: 'rio',
    emoji: '[[cenas/rio]]',
    texto: {
      'pt-PT':
        '{Nome} chega ao rio. Para atravessar há pedras com números pintados, mas a água apagou um deles. Só as pedras da sequência certa aguentam o peso!',
      'pt-BR':
        '{Nome} chega ao rio. Para atravessar há pedras com números pintados, mas a água apagou um deles. Só as pedras da sequência certa aguentam o peso!',
    },
    desafio: {
      tipo: 'sequencia',
      enunciado: { 'pt-PT': 'Que número falta nas pedras do rio?', 'pt-BR': 'Que número falta nas pedras do rio?' },
      sucesso: 'rio_certo',
      falha: 'rio_errado',
    },
  },
  rio_certo: {
    id: 'rio_certo',
    emoji: '[[cenas/coelho]]',
    texto: {
      'pt-PT':
        'Que saltos! {Nome} atravessou sem molhar os pés. Na outra margem, um velho pescador bate palmas: «Há muito tempo que ninguém acertava nas pedras! Leva esta corda, vais precisar dela.»',
      'pt-BR':
        'Que pulos! {Nome} atravessou sem molhar os pés. Na outra margem, um velho pescador bate palmas: «Fazia muito tempo que ninguém acertava as pedras! Leve esta corda, você vai precisar dela.»',
    },
    ganha: ['corda'],
    escolhas: [{ texto: SEGUIR, destino: 'clareira' }],
  },
  rio_errado: {
    id: 'rio_errado',
    emoji: '[[cenas/rio]]',
    texto: {
      'pt-PT': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
      'pt-BR': 'Escorregou! Plof! Uma lesma gigante saiu da água, toda gosmenta!',
    },
    luta: { inimigo: 'lesma', aoVencer: 'rio_depois' },
  },
  rio_depois: {
    id: 'rio_depois',
    emoji: '[[inimigos/lesma]]',
    texto: {
      'pt-PT': 'A lesma foge a escorregar pela margem. {Nome}, a pingar, chega ao outro lado do rio.',
      'pt-BR': 'A lesma foge escorregando pela margem. {Nome}, pingando, chega ao outro lado do rio.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'clareira' }],
  },
  trilha: {
    id: 'trilha',
    emoji: '[[cenas/montanha]]',
    texto: {
      'pt-PT':
        'Seguindo o mapa, {nome} encontra um trilho escondido na montanha. Ninguém passa por ali há anos! Numa cabana de mineiros abandonada estão uma poção de força e uma lanterna velha que ainda acende. Lá do alto vê-se a caverna dos goblins, toda às escuras.',
      'pt-BR':
        'Seguindo o mapa, {nome} encontra uma trilha escondida na montanha. Ninguém passa por ali há anos! Em uma cabana de mineiros abandonada estão uma poção de força e uma lanterna velha que ainda acende. Lá do alto dá para ver a caverna dos goblins, toda no escuro.',
    },
    recompensa: { pocoes: { forca: 1 } },
    ganha: ['lanterna', 'luz'],
    escolhas: [{ texto: SEGUIR, destino: 'clareira' }],
  },
  clareira: {
    id: 'clareira',
    emoji: '[[cenas/clareira]]',
    texto: {
      'pt-PT':
        'Numa clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {Nome} descansa um pouco e recupera as forças.',
      'pt-BR':
        'Em uma clareira, um baú brilha ao luar. Lá dentro está uma poção mágica! 🧪 {Nome} descansa um pouco e recupera as forças.',
    },
    recompensa: { pocoes: { cura: 1 }, curar: true },
    escolhas: [{ texto: SEGUIR, destino: 'vale' }],
  },

  // ---------- vale: ponte, pântano ou túnel ----------
  vale: {
    id: 'vale',
    emoji: '[[cenas/vale]]',
    texto: {
      'pt-PT':
        'Depois da clareira, o caminho chega a um vale. À frente há uma ponte velha de madeira e, ao lado, um pântano cheio de sapos.',
      'pt-BR':
        'Depois da clareira, o caminho chega a um vale. À frente há uma ponte velha de madeira e, ao lado, um pântano cheio de sapos.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      { texto: { 'pt-PT': '🌉 Atravessar a ponte velha', 'pt-BR': '🌉 Atravessar a ponte velha' }, destino: 'ponte' },
      { texto: { 'pt-PT': '🐸 Passar pelo pântano', 'pt-BR': '🐸 Passar pelo pântano' }, destino: 'pantano' },
      {
        texto: { 'pt-PT': '🗺️ Seguir o atalho do túnel', 'pt-BR': '🗺️ Seguir o atalho do túnel' },
        destino: 'tunel',
        se: { tem: ['mapa'] },
      },
    ],
  },
  ponte: {
    id: 'ponte',
    emoji: '[[inimigos/esqueleto]]',
    texto: {
      'pt-PT':
        'No meio da ponte velha está sentado um esqueleto, a baloiçar as pernas: «Alto! Guardo esta ponte há cem anos e aborreço-me muito. Só passa quem acertar na minha adivinha!»',
      'pt-BR':
        'No meio da ponte velha está sentado um esqueleto, balançando as pernas: «Alto! Eu guardo esta ponte há cem anos e fico muito entediado. Só passa quem acertar a minha adivinha!»',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'esqueleto', aoVencer: 'ponte_depois' },
    escolhas: [
      { texto: { 'pt-PT': 'Responder à adivinha', 'pt-BR': 'Responder à adivinha' }, destino: 'ponte_adivinha' },
      {
        texto: {
          'pt-PT': 'Descer com a corda e passar por baixo da ponte',
          'pt-BR': 'Descer com a corda e passar por baixo da ponte',
        },
        destino: 'ponte_corda',
        se: { tem: ['corda'] },
      },
    ],
  },
  ponte_adivinha: {
    id: 'ponte_adivinha',
    emoji: '[[inimigos/esqueleto]]',
    texto: {
      'pt-PT': 'O esqueleto esfrega as mãos, tac-tac-tac, e faz a pergunta.',
      'pt-BR': 'O esqueleto esfrega as mãos, tac-tac-tac, e faz a pergunta.',
    },
    desafio: {
      tipo: 'enigma',
      enunciado: { 'pt-PT': 'A adivinha do esqueleto:', 'pt-BR': 'A adivinha do esqueleto:' },
      enigmas: [
        {
          pergunta: { 'pt-PT': 'Tem dentes mas não morde. O que é?', 'pt-BR': 'Tem dentes, mas não morde. O que é?' },
          opcoes: [
            { 'pt-PT': 'Um pente', 'pt-BR': 'Um pente' },
            { 'pt-PT': 'Um lobo', 'pt-BR': 'Um lobo' },
            { 'pt-PT': 'Um sapo', 'pt-BR': 'Um sapo' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Quanto mais se tira, maior fica. O que é?',
            'pt-BR': 'Quanto mais se tira, maior fica. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'Um buraco', 'pt-BR': 'Um buraco' },
            { 'pt-PT': 'Uma montanha', 'pt-BR': 'Uma montanha' },
            { 'pt-PT': 'Um rio', 'pt-BR': 'Um rio' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Tem quatro pernas mas não anda. O que é?',
            'pt-BR': 'Tem quatro pernas, mas não anda. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'Uma mesa', 'pt-BR': 'Uma mesa' },
            { 'pt-PT': 'Um cavalo', 'pt-BR': 'Um cavalo' },
            { 'pt-PT': 'Um pato', 'pt-BR': 'Um pato' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Cai em pé e corre deitada. O que é?',
            'pt-BR': 'Cai em pé e corre deitada. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'A chuva', 'pt-BR': 'A chuva' },
            { 'pt-PT': 'Uma pedra', 'pt-BR': 'Uma pedra' },
            { 'pt-PT': 'Uma folha', 'pt-BR': 'Uma folha' },
          ],
          certa: 0,
        },
      ],
      sucesso: 'ponte_certo',
      falha: 'ponte_errado',
    },
  },
  ponte_certo: {
    id: 'ponte_certo',
    emoji: '[[inimigos/esqueleto]]',
    texto: {
      'pt-PT':
        '«Acertaste!», grita o esqueleto, a bater palmas de osso. «Há cem anos que ninguém acertava! Leva a minha flauta de osso: quem ouvir a sua música adormece logo.»',
      'pt-BR':
        '«Acertou!», grita o esqueleto, batendo palmas de osso. «Fazia cem anos que ninguém acertava! Leve a minha flauta de osso: quem ouve a música dela dorme na hora.»',
    },
    ganha: ['flauta'],
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },
  ponte_errado: {
    id: 'ponte_errado',
    emoji: '[[inimigos/esqueleto]]',
    texto: {
      'pt-PT': '«Errado!», chocalha o esqueleto. «Então vais ter de passar por mim!»',
      'pt-BR': '«Errado!», chacoalha o esqueleto. «Então você vai ter que passar por mim!»',
    },
    luta: { inimigo: 'esqueleto', aoVencer: 'ponte_depois' },
  },
  ponte_depois: {
    id: 'ponte_depois',
    emoji: '[[cenas/ponte]]',
    texto: {
      'pt-PT':
        'O esqueleto desmonta-se num monte de ossos e resmunga: «Está bem, está bem, podes passar...» {Nome} atravessa a ponte.',
      'pt-BR':
        'O esqueleto se desmonta em um monte de ossos e resmunga: «Está bem, está bem, pode passar...» {Nome} atravessa a ponte.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },
  ponte_corda: {
    id: 'ponte_corda',
    emoji: '[[cenas/gancho]]',
    texto: {
      'pt-PT':
        '{Nome} ata a corda a uma árvore e desce até ao fundo do vale sem fazer barulho. Lá em cima, o esqueleto continua à espera de alguém para a sua adivinha.',
      'pt-BR':
        '{Nome} amarra a corda em uma árvore e desce até o fundo do vale sem fazer barulho. Lá em cima, o esqueleto continua esperando alguém para a sua adivinha.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },
  pantano: {
    id: 'pantano',
    emoji: '[[inimigos/sapo-gigante]]',
    texto: {
      'pt-PT':
        '{Nome} entra no pântano. Plop! Um sapo gigante salta da lama e tapa o caminho: «Croac! Aqui só passa quem sabe fazer contas!»',
      'pt-BR':
        '{Nome} entra no pântano. Plop! Um sapo gigante pula da lama e fecha o caminho: «Croac! Aqui só passa quem sabe fazer contas!»',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'sapo', aoVencer: 'pantano_depois' },
    escolhas: [
      { texto: { 'pt-PT': 'Fazer a conta do sapo', 'pt-BR': 'Fazer a conta do sapo' }, destino: 'pantano_conta' },
    ],
  },
  pantano_conta: {
    id: 'pantano_conta',
    emoji: '[[inimigos/sapo-gigante]]',
    texto: {
      'pt-PT': 'O sapo conta pelos dedos compridos e faz a pergunta.',
      'pt-BR': 'O sapo conta nos dedos compridos e faz a pergunta.',
    },
    desafio: {
      tipo: 'conta',
      operacao: 'subtracao',
      enunciado: {
        'pt-PT': 'O sapo tinha {a} mosquitos para o jantar e já comeu {b}. Quantos mosquitos sobram?',
        'pt-BR': 'O sapo tinha {a} mosquitos para o jantar e já comeu {b}. Quantos mosquitos sobram?',
      },
      sucesso: 'pantano_certo',
      falha: 'pantano_errado',
    },
  },
  pantano_certo: {
    id: 'pantano_certo',
    emoji: '[[inimigos/sapo-gigante]]',
    texto: {
      'pt-PT':
        '«Croac, certíssimo!» O sapo fica tão contente que mostra um segredo: atrás dos juncos crescem cogumelos de luz, que brilham no escuro! {Nome} apanha alguns e guarda-os na mochila.',
      'pt-BR':
        '«Croac, certíssimo!» O sapo fica tão contente que mostra um segredo: atrás dos juncos crescem cogumelos de luz, que brilham no escuro! {Nome} pega alguns e guarda na mochila.',
    },
    ganha: ['cogumelos', 'luz'],
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },
  pantano_errado: {
    id: 'pantano_errado',
    emoji: '[[inimigos/sapo-gigante]]',
    texto: {
      'pt-PT': '«Croac! Errado!» O sapo incha, incha e salta para cima {doNome}!',
      'pt-BR': '«Croac! Errado!» O sapo incha, incha e pula para cima {doNome}!',
    },
    luta: { inimigo: 'sapo', aoVencer: 'pantano_depois' },
  },
  pantano_depois: {
    id: 'pantano_depois',
    emoji: '[[cenas/vale]]',
    texto: {
      'pt-PT': 'O sapo mergulha na lama, envergonhado. {Nome} atravessa o pântano com as botas cheias de lodo.',
      'pt-BR': 'O sapo mergulha na lama, envergonhado. {Nome} atravessa o pântano com as botas cheias de lama.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },
  tunel: {
    id: 'tunel',
    emoji: '[[cenas/tunel-lanterna]]',
    texto: {
      'pt-PT':
        'Seguindo o mapa, {nome} encontra um túnel secreto escondido atrás de umas pedras. Lá dentro há um cantinho quente para descansar e uma poção de cura. 🧪',
      'pt-BR':
        'Seguindo o mapa, {nome} encontra um túnel secreto escondido atrás de umas pedras. Lá dentro há um cantinho quentinho para descansar e uma poção de cura. 🧪',
    },
    recompensa: { pocoes: { cura: 1 }, curar: true },
    escolhas: [{ texto: SEGUIR, destino: 'caverna' }],
  },

  // ---------- porta da caverna ----------
  caverna: {
    id: 'caverna',
    emoji: '[[cenas/caverna]]',
    texto: {
      'pt-PT':
        '{Nome} chega a uma grande porta de pedra, na entrada da caverna do Goblin Chefe. Lá de dentro vem um som muito baixinho.',
      'pt-BR':
        '{Nome} chega a uma grande porta de pedra, na entrada da caverna do Goblin Chefe. Lá de dentro vem um som bem baixinho.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      { texto: { 'pt-PT': 'Encostar o ouvido à porta', 'pt-BR': 'Encostar o ouvido na porta' }, destino: 'escutar' },
      { texto: DECIFRAR, destino: 'fechadura' },
      { texto: EMPURRAR, destino: 'empurrar' },
      { texto: BATER, destino: 'porta_zip', se: { tem: ['amigo'] } },
    ],
  },
  escutar: {
    id: 'escutar',
    emoji: '[[cenas/porta-de-pedra]]',
    texto: {
      'pt-PT':
        '{Nome} encosta o ouvido à pedra fria. Lá dentro, uma voz rouca canta uma canção de embalar: «Dorme, pequenino, a Pedra dá luar... o escuro já não te vem assustar...» Os goblins pequeninos têm medo do escuro!',
      'pt-BR':
        '{Nome} encosta o ouvido na pedra fria. Lá dentro, uma voz rouca canta uma canção de ninar: «Dorme, pequenino, a Pedra dá luar... o escuro já não vem te assustar...» Os goblins pequenininhos têm medo do escuro!',
    },
    ganha: ['sabe'],
    pergunta: O_QUE_FAZER,
    escolhas: [
      { texto: DECIFRAR, destino: 'fechadura' },
      { texto: EMPURRAR, destino: 'empurrar' },
      { texto: BATER, destino: 'porta_zip', se: { tem: ['amigo'] } },
    ],
  },
  fechadura: {
    id: 'fechadura',
    emoji: '[[extras/inteligencia]]',
    texto: {
      'pt-PT': 'A fechadura tem rodas de letras e um desenho gravado na pedra. Só abre com o nome certo!',
      'pt-BR': 'A fechadura tem rodas de letras e um desenho gravado na pedra. Só abre com o nome certo!',
    },
    desafio: {
      tipo: 'escrever',
      palavras: [2933, 7252, 6594, 3244, 2972, 35051, 5563, 25016, 2252, 6229],
      enunciado: {
        'pt-PT': 'Escreve o nome do desenho para abrir a porta.',
        'pt-BR': 'Escreva o nome do desenho para abrir a porta.',
      },
      sucesso: 'porta_aberta',
      falha: 'porta_morcego',
    },
  },
  empurrar: {
    id: 'empurrar',
    emoji: '[[interface/forca]]',
    texto: {
      'pt-PT': '{Nome} encosta o ombro à porta e empurra com todas as forças!',
      'pt-BR': '{Nome} encosta o ombro na porta e empurra com todas as forças!',
    },
    teste: { atributo: 'forca', dificuldade: 13, sucesso: 'porta_aberta', falha: 'porta_morcego' },
  },
  porta_aberta: {
    id: 'porta_aberta',
    emoji: '[[cenas/porta-de-pedra]]',
    texto: {
      'pt-PT': 'Clique! A porta abre-se devagarinho. {Nome} conseguiu!',
      'pt-BR': 'Clique! A porta se abre devagarinho. {Nome} conseguiu!',
    },
    escolhas: [{ texto: SEGUIR, destino: 'fundo' }],
  },
  porta_morcego: {
    id: 'porta_morcego',
    emoji: '[[inimigos/morcego]]',
    texto: {
      'pt-PT': 'Ups! A porta tremeu com o barulho. Um morcego acordou e voou na direção {doNome}!',
      'pt-BR': 'Ops! A porta tremeu com o barulho. Um morcego acordou e voou na direção {doNome}!',
    },
    luta: { inimigo: 'morcego', aoVencer: 'porta_aberta' },
  },
  porta_zip: {
    id: 'porta_zip',
    emoji: '[[cenas/porta-de-pedra]]',
    texto: {
      'pt-PT':
        'Toc... toc... toc. A porta abre-se uma frincha e dois olhinhos espreitam. «É o sinal do Zip!», sussurra um goblin pequenino. {Nome} entra sem ninguém dar o alarme.',
      'pt-BR':
        'Toc... toc... toc. A porta abre uma frestinha e dois olhinhos espiam. «É o sinal do Zip!», cochicha um goblin pequenininho. {Nome} entra sem ninguém dar o alarme.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'fundo' }],
  },

  // ---------- fundo da caverna e finais ----------
  fundo: {
    id: 'fundo',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT':
        'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua bem alto. À luz dela, muitos goblins pequeninos dormem em sossego. «É minha!», grita ele. «Ninguém a leva daqui!»',
      'pt-BR':
        'No fundo da caverna, o Goblin Chefe segura a Pedra da Lua bem alto. À luz dela, muitos goblins pequenininhos dormem sossegados. «É minha!», grita ele. «Ninguém leva a Pedra daqui!»',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'goblin', aoVencer: 'fim_forca' },
    escolhas: [
      { texto: TOCAR_FLAUTA, destino: 'flauta_toca', se: { tem: ['flauta'] } },
      {
        texto: { 'pt-PT': 'Falar com o Goblin Chefe', 'pt-BR': 'Falar com o Goblin Chefe' },
        destino: 'conversa',
        se: { tem: ['sabe'] },
      },
    ],
  },
  conversa: {
    id: 'conversa',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT':
        '«Eu sei porque levaste a Pedra», diz {nome}. «Os teus pequeninos têm medo do escuro.» O Goblin Chefe baixa os olhos: «Os nossos cogumelos de luz secaram. Sem a Pedra, eles choram a noite toda. Tens outra luz para nos dar?»',
      'pt-BR':
        '«Eu sei por que você levou a Pedra», diz {nome}. «Os seus pequenininhos têm medo do escuro.» O Goblin Chefe baixa os olhos: «Os nossos cogumelos de luz secaram. Sem a Pedra, eles choram a noite toda. Você tem outra luz para nos dar?»',
    },
    escolhas: [
      {
        texto: { 'pt-PT': '✨ Oferecer a luz que traz na mochila', 'pt-BR': '✨ Oferecer a luz que está na mochila' },
        destino: 'oferta',
        se: { tem: ['luz'] },
      },
      {
        texto: { 'pt-PT': 'Dizer que não tem outra luz', 'pt-BR': 'Dizer que não tem outra luz' },
        destino: 'sem_luz',
        se: { naoTem: ['luz'] },
      },
    ],
  },
  sem_luz: {
    id: 'sem_luz',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT':
        'O Goblin Chefe abana a cabeça: «Palavras bonitas não iluminam uma caverna. Sem outra luz, não posso devolver a Pedra!» E levanta o seu bastão.',
      'pt-BR':
        'O Goblin Chefe balança a cabeça: «Palavras bonitas não iluminam uma caverna. Sem outra luz, não posso devolver a Pedra!» E levanta o seu bastão.',
    },
    luta: { inimigo: 'goblin', aoVencer: 'fim_forca' },
    escolhas: [{ texto: TOCAR_FLAUTA, destino: 'flauta_toca', se: { tem: ['flauta'] } }],
  },
  oferta: {
    id: 'oferta',
    emoji: '[[interface/faisca-magica]]',
    texto: {
      'pt-PT':
        '{Nome} abre a mochila e a luz espalha-se pela caverna. Os goblins pequeninos acordam, de boca aberta. «Uma luz só nossa?», pergunta o Chefe, desconfiado. «Então ajuda-me a reparti-la, para chegar a todos os cantos!»',
      'pt-BR':
        '{Nome} abre a mochila e a luz se espalha pela caverna. Os goblins pequenininhos acordam, de boca aberta. «Uma luz só nossa?», pergunta o Chefe, desconfiado. «Então me ajude a repartir, para chegar a todos os cantos!»',
    },
    desafio: {
      tipo: 'conta',
      operacao: 'soma',
      enunciado: {
        'pt-PT': 'Num canto ficam {a} pontos de luz e no outro canto ficam {b} pontos de luz. Quantos pontos de luz são ao todo?',
        'pt-BR': 'Em um canto ficam {a} pontos de luz e no outro canto ficam {b} pontos de luz. Quantos pontos de luz são ao todo?',
      },
      sucesso: 'fim_amizade',
      falha: 'oferta_errada',
    },
  },
  oferta_errada: {
    id: 'oferta_errada',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT': '«Hum, não bate certo», resmunga o Chefe, a contar pelos dedos. «Vamos contar outra vez, com calma.»',
      'pt-BR': '«Hum, não está batendo», resmunga o Chefe, contando nos dedos. «Vamos contar de novo, com calma.»',
    },
    escolhas: [{ texto: { 'pt-PT': 'Contar outra vez', 'pt-BR': 'Contar de novo' }, destino: 'oferta' }],
  },
  flauta_toca: {
    id: 'flauta_toca',
    emoji: '[[inimigos/goblin-chefe]]',
    texto: {
      'pt-PT':
        '{Nome} sopra a flauta de osso. Uma música suave enche a caverna... O Goblin Chefe boceja, senta-se e adormece a ressonar, com a Pedra da Lua no colo.',
      'pt-BR':
        '{Nome} sopra a flauta de osso. Uma música suave enche a caverna... O Goblin Chefe boceja, senta e adormece roncando, com a Pedra da Lua no colo.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        texto: { 'pt-PT': 'Pegar na Pedra e sair em silêncio', 'pt-BR': 'Pegar a Pedra e sair em silêncio' },
        destino: 'fim_esperteza',
      },
      {
        texto: {
          'pt-PT': '✨ Deixar a luz da mochila no lugar da Pedra',
          'pt-BR': '✨ Deixar a luz da mochila no lugar da Pedra',
        },
        destino: 'troca',
        se: { tem: ['luz'] },
      },
    ],
  },
  troca: {
    id: 'troca',
    emoji: '[[interface/faisca-magica]]',
    texto: {
      'pt-PT':
        '{Nome} pousa a luz ao lado dos goblins pequeninos e pega na Pedra com cuidado. Nesse instante, o Goblin Chefe abre um olho: «Trocaste... em vez de roubar?» E, pela primeira vez, sorri.',
      'pt-BR':
        '{Nome} coloca a luz ao lado dos goblins pequenininhos e pega a Pedra com cuidado. Nesse instante, o Goblin Chefe abre um olho: «Você trocou... em vez de roubar?» E, pela primeira vez, sorri.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'fim_amizade' }],
  },
  fim_forca: {
    id: 'fim_forca',
    emoji: '[[cenas/lua-cheia]]',
    texto: {
      'pt-PT':
        'O Goblin Chefe cai sentado e larga a Pedra. {Nome} leva-a de volta e a Lua acende-se no céu! A aldeia inteira festeja. Mas, lá longe, a caverna dos goblins ficou outra vez às escuras... Haveria outra maneira?',
      'pt-BR':
        'O Goblin Chefe cai sentado e solta a Pedra. {Nome} leva a Pedra de volta e a Lua se acende no céu! A vila inteira festeja. Mas, lá longe, a caverna dos goblins ficou de novo no escuro... Será que havia outro jeito?',
    },
    fim: 'forca',
  },
  fim_esperteza: {
    id: 'fim_esperteza',
    emoji: '[[cenas/lua]]',
    texto: {
      'pt-PT':
        'Pé ante pé, {nome} sai da caverna com a Pedra. A Lua volta ao céu e a aldeia festeja a esperteza {doNome}! Mas, quando o Goblin Chefe acordar, os pequeninos vão voltar a ter medo do escuro... Haveria outra maneira?',
      'pt-BR':
        'Na ponta dos pés, {nome} sai da caverna com a Pedra. A Lua volta ao céu e a vila festeja a esperteza {doNome}! Mas, quando o Goblin Chefe acordar, os pequenininhos vão ter medo do escuro de novo... Será que havia outro jeito?',
    },
    fim: 'esperteza',
  },
  fim_amizade: {
    id: 'fim_amizade',
    emoji: '[[cenas/abraco]]',
    texto: {
      'pt-PT':
        'A caverna ficou cheia de luz e nenhum goblin pequenino voltou a ter medo. O Goblin Chefe entrega a Pedra da Lua: «Leva-a. O lugar dela é no céu, para todos.» Nessa noite, a Lua brilhou sobre a aldeia e sobre a caverna, e aldeões e goblins fizeram uma grande festa em honra {doNome}.',
      'pt-BR':
        'A caverna ficou cheia de luz e nenhum goblin pequenininho teve medo de novo. O Goblin Chefe entrega a Pedra da Lua: «Pode levar. O lugar dela é no céu, para todos.» Naquela noite, a Lua brilhou sobre a vila e sobre a caverna, e o povo da vila e os goblins fizeram uma grande festa em homenagem {aoNome}.',
    },
    fim: 'amizade',
  },
};

export const LIVRO_PEDRA_DA_LUA = livro<NomeAtributo>({
  id: 'pedra-da-lua',
  pontos: PONTOS,
  inicial: 'aldeia',
  finais: FINAIS,
  itens: ITENS_HISTORIA,
});
