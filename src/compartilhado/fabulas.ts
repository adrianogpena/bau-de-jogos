import type { Idioma, TextoPorIdioma } from './idioma';
import { type PalavraIlustrada, palavraDe, palavraPorImagem } from './palavras';

/** Marca, no texto do parágrafo, o lugar da palavra da imagem. */
export const MARCA_PALAVRA = '{palavra}';

/**
 * Um parágrafo da fábula. O texto existe nas duas variantes e tem a marca
 * `{palavra}` exatamente uma vez; a palavra vem do dicionário (PALAVRAS) pela imagem.
 */
interface ParagrafoBruto {
  imagem: number;
  texto: TextoPorIdioma;
}

export interface Paragrafo {
  palavra: PalavraIlustrada;
  texto: TextoPorIdioma;
}

export interface Fabula {
  id: string;
  emoji: string;
  titulo: TextoPorIdioma;
  paragrafos: Paragrafo[];
}

/** Partes de um parágrafo: texto antes da palavra, a palavra e o texto depois. */
export interface PartesParagrafo {
  antes: string;
  palavra: string;
  depois: string;
}

export function partesDoParagrafo(paragrafo: Paragrafo, idioma: Idioma): PartesParagrafo {
  const [antes, depois] = paragrafo.texto[idioma].split(MARCA_PALAVRA);
  return { antes, palavra: palavraDe(paragrafo.palavra, idioma), depois };
}

/** O parágrafo inteiro, com a palavra no lugar (para ler em voz alta). */
export function paragrafoCompleto(paragrafo: Paragrafo, idioma: Idioma): string {
  const { antes, palavra, depois } = partesDoParagrafo(paragrafo, idioma);
  return `${antes}${palavra}${depois}`;
}

function fabula(id: string, emoji: string, titulo: TextoPorIdioma, paragrafos: ParagrafoBruto[]): Fabula {
  return {
    id,
    emoji,
    titulo,
    paragrafos: paragrafos.map(({ imagem, texto }) => {
      for (const variante of Object.keys(texto) as Idioma[]) {
        if (texto[variante].split(MARCA_PALAVRA).length !== 2) {
          throw new Error(`Fábula "${id}" (${variante}): o parágrafo precisa ter ${MARCA_PALAVRA} uma vez.`);
        }
      }
      return { palavra: palavraPorImagem(imagem), texto };
    }),
  };
}

/**
 * Fábulas (Esopo e La Fontaine) usadas nos jogos de escrita e de leitura.
 * Cada texto é escrito à parte para pt-PT e pt-BR: revise as duas variantes ao mudar.
 */
export const FABULAS: Fabula[] = [
  fabula('lebre-tartaruga', '🐢', { 'pt-PT': 'A Lebre e a Tartaruga', 'pt-BR': 'A Lebre e a Tartaruga' }, [
    {
      imagem: 17265,
      texto: {
        'pt-PT': 'Era uma vez uma {palavra} muito vaidosa. Corria mais depressa do que todos os animais da floresta e adorava gabar-se.',
        'pt-BR': 'Era uma vez uma {palavra} muito convencida. Corria mais rápido do que todos os animais da floresta e adorava se gabar.',
      },
    },
    {
      imagem: 2596,
      texto: {
        'pt-PT': 'Um dia, uma {palavra} muito lenta disse-lhe: — Aposto que te ganho numa corrida! A lebre riu-se muito.',
        'pt-BR': 'Um dia, uma {palavra} muito lenta disse para ela: — Aposto que ganho de você numa corrida! A lebre riu muito.',
      },
    },
    {
      imagem: 2256,
      texto: {
        'pt-PT': 'A corrida começou. A lebre disparou à frente e, como a tartaruga ficou tão para trás, deitou-se a dormir à sombra de uma {palavra}.',
        'pt-BR': 'A corrida começou. A lebre disparou na frente e, como a tartaruga ficou tão para trás, resolveu tirar um cochilo à sombra de uma {palavra}.',
      },
    },
    {
      imagem: 7252,
      texto: {
        'pt-PT': 'Enquanto a lebre dormia, a tartaruga continuou, passo a passo, debaixo do {palavra} quente, sem nunca parar.',
        'pt-BR': 'Enquanto a lebre dormia, a tartaruga continuou, passo a passo, debaixo do {palavra} quente, sem parar nunca.',
      },
    },
    {
      imagem: 16817,
      texto: {
        'pt-PT': 'Quando a lebre acordou, correu o mais que pôde, mas a tartaruga já estava a cruzar a {palavra}. Devagar se vai ao longe!',
        'pt-BR': 'Quando a lebre acordou, correu o máximo que pôde, mas a tartaruga já estava cruzando a {palavra}. Devagar se vai ao longe!',
      },
    },
  ]),

  fabula('leao-rato', '🦁', { 'pt-PT': 'O Leão e o Rato', 'pt-BR': 'O Leão e o Rato' }, [
    {
      imagem: 2449,
      texto: {
        'pt-PT': 'Um {palavra} enorme dormia a sesta no meio da floresta.',
        'pt-BR': 'Um {palavra} enorme tirava um cochilo no meio da floresta.',
      },
    },
    {
      imagem: 2546,
      texto: {
        'pt-PT': 'Um {palavra} pequenino passou a correr por cima do nariz dele e acordou-o. O leão apanhou-o com a pata.',
        'pt-BR': 'Um {palavra} pequenininho passou correndo por cima do nariz dele e o acordou. O leão o pegou com a pata.',
      },
    },
    {
      imagem: 6594,
      texto: {
        'pt-PT': '— Deixa-me ir e um dia eu ajudo-te! — pediu o rato. O leão achou graça e soltou-o. O rato foi esconder-se atrás de uma {palavra}.',
        'pt-BR': '— Me deixe ir e um dia eu ajudo você! — pediu o rato. O leão achou graça e o soltou. O rato foi se esconder atrás de uma {palavra}.',
      },
    },
    {
      imagem: 2548,
      texto: {
        'pt-PT': 'Dias depois, uns caçadores prenderam o leão numa {palavra}. O leão rugia, mas não conseguia sair.',
        'pt-BR': 'Dias depois, uns caçadores prenderam o leão em uma {palavra}. O leão rugia, mas não conseguia sair.',
      },
    },
    {
      imagem: 26026,
      texto: {
        'pt-PT': 'O rato ouviu-o, correu até lá e roeu cada {palavra} com os seus dentes pequeninos. O leão ficou livre! Os amigos pequenos também podem ajudar os grandes.',
        'pt-BR': 'O rato o ouviu, correu até lá e roeu cada {palavra} com seus dentes pequenininhos. O leão ficou livre! Os amigos pequenos também podem ajudar os grandes.',
      },
    },
  ]),

  fabula('cigarra-formiga', '🐜', { 'pt-PT': 'A Cigarra e a Formiga', 'pt-BR': 'A Cigarra e a Formiga' }, [
    {
      imagem: 16613,
      texto: {
        'pt-PT': 'No verão, uma {palavra} passava os dias a cantar, deitada à sombra.',
        'pt-BR': 'No verão, uma {palavra} passava os dias cantando, deitada na sombra.',
      },
    },
    {
      imagem: 2425,
      texto: {
        'pt-PT': 'Perto dela, uma {palavra} trabalhava sem parar, a guardar comida para o inverno.',
        'pt-BR': 'Perto dela, uma {palavra} trabalhava sem parar, guardando comida para o inverno.',
      },
    },
    {
      imagem: 7285,
      texto: {
        'pt-PT': 'A formiga carregava grãos de {palavra} para casa. — Vem cantar comigo! — dizia a cigarra. — Agora não, tenho de trabalhar — respondia a formiga.',
        'pt-BR': 'A formiga carregava grãos de {palavra} para casa. — Venha cantar comigo! — dizia a cigarra. — Agora não, preciso trabalhar — respondia a formiga.',
      },
    },
    {
      imagem: 2615,
      texto: {
        'pt-PT': 'A cigarra encolhia os ombros e continuava a tocar o seu {palavra}.',
        'pt-BR': 'A cigarra dava de ombros e continuava tocando seu {palavra}.',
      },
    },
    {
      imagem: 3135,
      texto: {
        'pt-PT': 'Chegou o inverno e caiu muita {palavra}. A cigarra não tinha comida e estava cheia de frio. Bateu à porta da formiga, que a deixou entrar e partilhou a comida com ela. Juntas, aprenderam que é bom trabalhar e também é bom brincar.',
        'pt-BR': 'Chegou o inverno e caiu muita {palavra}. A cigarra não tinha comida e estava com muito frio. Bateu na porta da formiga, que a deixou entrar e dividiu a comida com ela. Juntas, aprenderam que é bom trabalhar e também é bom brincar.',
      },
    },
  ]),

  fabula('corvo-raposa', '🦊', { 'pt-PT': 'O Corvo e a Raposa', 'pt-BR': 'O Corvo e a Raposa' }, [
    {
      imagem: 4619,
      texto: {
        'pt-PT': 'Um {palavra} encontrou um pedaço de comida e voou para o ramo de uma árvore.',
        'pt-BR': 'Um {palavra} encontrou um pedaço de comida e voou para o galho de uma árvore.',
      },
    },
    {
      imagem: 2541,
      texto: {
        'pt-PT': 'Era um {palavra} amarelo e cheiroso. O corvo segurava-o com muito cuidado.',
        'pt-BR': 'Era um {palavra} amarelo e cheiroso. O corvo o segurava com muito cuidado.',
      },
    },
    {
      imagem: 2623,
      texto: {
        'pt-PT': 'Uma {palavra} esfomeada viu-o lá de baixo e teve uma ideia.',
        'pt-BR': 'Uma {palavra} faminta o viu lá de baixo e teve uma ideia.',
      },
    },
    {
      imagem: 2490,
      texto: {
        'pt-PT': '— Que penas tão bonitas! — disse a raposa. — Deves ser o {palavra} mais lindo da floresta. Canta para mim!',
        'pt-BR': '— Que penas lindas! — disse a raposa. — Você deve ser o {palavra} mais bonito da floresta. Cante para mim!',
      },
    },
    {
      imagem: 5538,
      texto: {
        'pt-PT': 'O corvo, todo vaidoso, abriu o {palavra} para cantar... e o queijo caiu! A raposa apanhou-o e fugiu. Cuidado com quem faz elogios só para enganar!',
        'pt-BR': 'O corvo, todo convencido, abriu o {palavra} para cantar... e o queijo caiu! A raposa pegou o queijo e fugiu. Cuidado com quem faz elogios só para enganar!',
      },
    },
  ]),

  fabula('tres-porquinhos', '🐷', { 'pt-PT': 'Os Três Porquinhos', 'pt-BR': 'Os Três Porquinhos' }, [
    {
      imagem: 5954,
      texto: {
        'pt-PT': 'Era uma vez três irmãos. Cada um era um {palavra} cor-de-rosa, e cada um quis construir a sua casa.',
        'pt-BR': 'Era uma vez três irmãos. Cada um era um {palavra} cor-de-rosa, e cada um quis construir a própria casa.',
      },
    },
    {
      imagem: 6163,
      texto: {
        'pt-PT': 'O mais novo fez a casa de {palavra}, muito depressa, para ir brincar.',
        'pt-BR': 'O mais novo fez a casa de {palavra}, bem rápido, para ir brincar.',
      },
    },
    {
      imagem: 6143,
      texto: {
        'pt-PT': 'O do meio fez a casa de {palavra}. Também acabou depressa.',
        'pt-BR': 'O do meio fez a casa de {palavra}. Também terminou rápido.',
      },
    },
    {
      imagem: 2951,
      texto: {
        'pt-PT': 'O mais velho trabalhou muito e fez a casa de {palavra}, forte e segura.',
        'pt-BR': 'O mais velho trabalhou muito e fez a casa de {palavra}, forte e segura.',
      },
    },
    {
      imagem: 6140,
      texto: {
        'pt-PT': 'Então chegou o {palavra} mau. Soprou, soprou e deitou abaixo as casas de palha e de madeira! Os porquinhos fugiram para a casa de tijolo. O lobo soprou com toda a força, mas a casa não caiu. Os três irmãos ficaram a salvo!',
        'pt-BR': 'Então chegou o {palavra} mau. Soprou, soprou e derrubou as casas de palha e de madeira! Os porquinhos fugiram para a casa de tijolo. O lobo soprou com toda a força, mas a casa não caiu. Os três irmãos ficaram a salvo!',
      },
    },
  ]),
];

/** Contos dos Irmãos Grimm (versões curtas e suaves, para crianças). */
export const CONTOS_GRIMM: Fabula[] = [
  fabula(
    'capuchinho-vermelho',
    '🧺',
    { 'pt-PT': 'O Capuchinho Vermelho', 'pt-BR': 'Chapeuzinho Vermelho' },
    [
      {
        imagem: 3012,
        texto: {
          'pt-PT': 'Era uma vez uma menina que usava sempre um capuchinho vermelho. Um dia, a mãe deu-lhe um {palavra} com bolo e sumo para levar à avó.',
          'pt-BR': 'Era uma vez uma menina que usava sempre um chapeuzinho vermelho. Um dia, a mãe deu a ela uma {palavra} com bolo e suco para levar para a vovó.',
        },
      },
      {
        imagem: 6140,
        texto: {
          'pt-PT': 'No caminho pela floresta, apareceu um {palavra} muito esperto. — Onde vais, menina? — perguntou ele. — Vou a casa da minha avó! — respondeu ela.',
          'pt-BR': 'No caminho pela floresta, apareceu um {palavra} muito esperto. — Aonde você vai, menina? — perguntou ele. — Vou para a casa da minha avó! — respondeu ela.',
        },
      },
      {
        imagem: 23710,
        texto: {
          'pt-PT': 'O lobo correu por um atalho, chegou primeiro a casa da {palavra}, fechou-a no armário e deitou-se na cama dela.',
          'pt-BR': 'O lobo correu por um atalho, chegou primeiro na casa da {palavra}, trancou a velhinha no armário e se deitou na cama dela.',
        },
      },
      {
        imagem: 2876,
        texto: {
          'pt-PT': 'Quando a menina chegou, achou a avó muito estranha. — Avó, que {palavra} tão grandes tens! — São para te ver melhor! — disse o lobo.',
          'pt-BR': 'Quando a menina chegou, achou a vovó muito estranha. — Vovó, que {palavra} grandes você tem! — São para ver você melhor! — disse o lobo.',
        },
      },
      {
        imagem: 2943,
        texto: {
          'pt-PT': 'O lobo saltou da cama, mas um {palavra} que passava ouviu os gritos e expulsou-o. A avó saiu do armário e todos comeram o bolo juntos.',
          'pt-BR': 'O lobo pulou da cama, mas um {palavra} que passava ouviu os gritos e o expulsou. A vovó saiu do armário e todos comeram o bolo juntos.',
        },
      },
    ],
  ),

  fabula('hansel-gretel', '🍫', { 'pt-PT': 'Hansel e Gretel', 'pt-BR': 'João e Maria' }, [
    {
      imagem: 2494,
      texto: {
        'pt-PT': 'Hansel e Gretel eram irmãos e viviam perto de uma floresta muito grande. Um dia, perderam-se lá dentro. Pelo caminho, Hansel tinha deixado cair migalhas de {palavra}.',
        'pt-BR': 'João e Maria eram irmãos e moravam perto de uma floresta muito grande. Um dia, eles se perderam lá dentro. Pelo caminho, João tinha deixado cair migalhas de {palavra}.',
      },
    },
    {
      imagem: 2490,
      texto: {
        'pt-PT': 'Mas um {palavra} esfomeado comeu as migalhas todas, e eles não conseguiram encontrar o caminho de volta.',
        'pt-BR': 'Mas um {palavra} faminto comeu todas as migalhas, e eles não conseguiram achar o caminho de volta.',
      },
    },
    {
      imagem: 25940,
      texto: {
        'pt-PT': 'Depois de muito andar, encontraram uma casinha feita de bolo e {palavra}! Tinham tanta fome que começaram a comer as paredes.',
        'pt-BR': 'Depois de andar muito, encontraram uma casinha feita de bolo e {palavra}! Estavam com tanta fome que começaram a comer as paredes.',
      },
    },
    {
      imagem: 5404,
      texto: {
        'pt-PT': 'Mas a casa era de uma {palavra} má, que prendeu o Hansel numa jaula e pôs a Gretel a trabalhar.',
        'pt-BR': 'Mas a casa era de uma {palavra} malvada, que prendeu João numa jaula e colocou Maria para trabalhar.',
      },
    },
    {
      imagem: 10135,
      texto: {
        'pt-PT': 'Um dia, a bruxa foi espreitar o {palavra} e a Gretel, muito esperta, deu-lhe um empurrão e fechou a porta. Os irmãos fugiram e voltaram para casa, onde o pai os esperava.',
        'pt-BR': 'Um dia, a bruxa foi espiar o {palavra} e Maria, muito esperta, deu um empurrão nela e fechou a porta. Os irmãos fugiram e voltaram para casa, onde o pai esperava por eles.',
      },
    },
  ]),

  fabula('branca-de-neve', '🍎', { 'pt-PT': 'A Branca de Neve', 'pt-BR': 'Branca de Neve' }, [
    {
      imagem: 2385,
      texto: {
        'pt-PT': 'Uma rainha muito vaidosa tinha um {palavra} mágico. Todos os dias lhe perguntava: — Espelho meu, espelho meu, haverá alguém mais bela do que eu?',
        'pt-BR': 'Uma rainha muito vaidosa tinha um {palavra} mágico. Todo dia ela perguntava: — Espelho, espelho meu, existe alguém mais bela do que eu?',
      },
    },
    {
      imagem: 2317,
      texto: {
        'pt-PT': 'O espelho respondeu que a Branca de Neve era a mais bela. A rainha ficou furiosa, e a Branca de Neve fugiu para a floresta, onde encontrou uma {palavra} pequenina.',
        'pt-BR': 'O espelho respondeu que Branca de Neve era a mais bela. A rainha ficou furiosa, e Branca de Neve fugiu para a floresta, onde encontrou uma {palavra} pequenininha.',
      },
    },
    {
      imagem: 5450,
      texto: {
        'pt-PT': 'Lá viviam sete anões, que trabalhavam numa mina. Cada {palavra} tinha a sua caminha, e todos ficaram amigos dela.',
        'pt-BR': 'Lá moravam sete anões, que trabalhavam numa mina. Cada {palavra} tinha sua caminha, e todos ficaram amigos dela.',
      },
    },
    {
      imagem: 2462,
      texto: {
        'pt-PT': 'A rainha disfarçou-se de velhinha e deu à Branca de Neve uma {palavra} envenenada. Ela deu uma dentada e adormeceu num sono profundo.',
        'pt-BR': 'A rainha se disfarçou de velhinha e deu a Branca de Neve uma {palavra} envenenada. Ela deu uma mordida e caiu num sono profundo.',
      },
    },
    {
      imagem: 5555,
      texto: {
        'pt-PT': 'Um {palavra} que passava pela floresta viu-a e quis levá-la para o seu castelo. No caminho, o pedaço de maçã saltou-lhe da boca e a Branca de Neve acordou! Viveram felizes para sempre.',
        'pt-BR': 'Um {palavra} que passava pela floresta a viu e quis levá-la para o castelo dele. No caminho, o pedaço de maçã saiu da boca dela e Branca de Neve acordou! Eles viveram felizes para sempre.',
      },
    },
  ]),

  fabula('musicos-de-bremen', '🎺', { 'pt-PT': 'Os Músicos de Bremen', 'pt-BR': 'Os Músicos de Bremen' }, [
    {
      imagem: 2291,
      texto: {
        'pt-PT': 'Um {palavra} já velhinho fugiu da quinta onde vivia. Queria ir para a cidade de Bremen para ser músico.',
        'pt-BR': 'Um {palavra} já velhinho fugiu da fazenda onde morava. Queria ir para a cidade de Bremen para ser músico.',
      },
    },
    {
      imagem: 2517,
      texto: {
        'pt-PT': 'No caminho, encontrou um {palavra} cansado. — Anda comigo! — disse o burro. — Tu podes tocar tambor!',
        'pt-BR': 'No caminho, encontrou um {palavra} cansado. — Venha comigo! — disse o burro. — Você pode tocar tambor!',
      },
    },
    {
      imagem: 2406,
      texto: {
        'pt-PT': 'Mais à frente, juntou-se a eles um {palavra} triste, que miava muito bem.',
        'pt-BR': 'Mais adiante, um {palavra} triste, que miava muito bem, se juntou a eles.',
      },
    },
    {
      imagem: 2404,
      texto: {
        'pt-PT': 'Depois apareceu um {palavra} que cantava cocorocó com toda a força. Agora eram quatro músicos!',
        'pt-BR': 'Depois apareceu um {palavra} que cantava cocoricó com toda a força. Agora eram quatro músicos!',
      },
    },
    {
      imagem: 2611,
      texto: {
        'pt-PT': 'À noite, viram uma casa de ladrões. Subiram uns para cima dos outros, espreitaram pela {palavra} e cantaram todos ao mesmo tempo! Os ladrões fugiram cheios de medo, e os quatro amigos ficaram lá a viver, muito felizes.',
        'pt-BR': 'À noite, viram uma casa de ladrões. Subiram um em cima do outro, espiaram pela {palavra} e cantaram todos ao mesmo tempo! Os ladrões fugiram morrendo de medo, e os quatro amigos ficaram morando lá, muito felizes.',
      },
    },
  ]),

  fabula('principe-sapo', '🐸', { 'pt-PT': 'O Príncipe Sapo', 'pt-BR': 'O Príncipe Sapo' }, [
    {
      imagem: 5554,
      texto: {
        'pt-PT': 'Era uma vez uma {palavra} que adorava brincar no jardim do palácio.',
        'pt-BR': 'Era uma vez uma {palavra} que adorava brincar no jardim do palácio.',
      },
    },
    {
      imagem: 2269,
      texto: {
        'pt-PT': 'O seu brinquedo preferido era uma {palavra} de ouro, que atirava ao ar e apanhava outra vez.',
        'pt-BR': 'Seu brinquedo preferido era uma {palavra} de ouro, que ela jogava para o alto e pegava de novo.',
      },
    },
    {
      imagem: 8197,
      texto: {
        'pt-PT': 'Um dia, a bola escorregou-lhe das mãos e caiu dentro de um {palavra} muito fundo. A princesa começou a chorar.',
        'pt-BR': 'Um dia, a bola escorregou das mãos dela e caiu dentro de um {palavra} muito fundo. A princesa começou a chorar.',
      },
    },
    {
      imagem: 3384,
      texto: {
        'pt-PT': 'Então apareceu um {palavra}: — Eu vou buscar a tua bola, se prometeres ser minha amiga! A princesa prometeu, e o sapo trouxe-lhe a bola.',
        'pt-BR': 'Então apareceu um {palavra}: — Eu pego sua bola, se você prometer ser minha amiga! A princesa prometeu, e o sapo trouxe a bola para ela.',
      },
    },
    {
      imagem: 25016,
      texto: {
        'pt-PT': 'A princesa cumpriu a promessa e cuidou do sapo. Um dia, ele transformou-se num príncipe com uma {palavra} dourada! Afinal, estava enfeitiçado. Os dois ficaram amigos para sempre.',
        'pt-BR': 'A princesa cumpriu a promessa e cuidou do sapo. Um dia, ele se transformou num príncipe com uma {palavra} dourada! Ele estava enfeitiçado. Os dois ficaram amigos para sempre.',
      },
    },
  ]),
];

/** Contos das Mil e Uma Noites (versões curtas, para crianças). */
export const CONTOS_MIL_E_UMA_NOITES: Fabula[] = [
  fabula('ali-baba', '💰', { 'pt-PT': 'Ali Babá e os Quarenta Ladrões', 'pt-BR': 'Ali Babá e os Quarenta Ladrões' }, [
    {
      imagem: 2291,
      texto: {
        'pt-PT': 'Ali Babá era um homem pobre que ia à floresta buscar lenha com o seu {palavra}.',
        'pt-BR': 'Ali Babá era um homem pobre que ia à floresta buscar lenha com seu {palavra}.',
      },
    },
    {
      imagem: 2256,
      texto: {
        'pt-PT': 'Um dia, viu chegar quarenta ladrões a cavalo. Cheio de medo, escondeu-se em cima de uma {palavra}.',
        'pt-BR': 'Um dia, viu chegarem quarenta ladrões a cavalo. Morrendo de medo, ele se escondeu em cima de uma {palavra}.',
      },
    },
    {
      imagem: 3244,
      texto: {
        'pt-PT': 'O chefe dos ladrões parou em frente a uma rocha e gritou: — Abre-te, Sésamo! E uma {palavra} secreta abriu-se na rocha!',
        'pt-BR': 'O chefe dos ladrões parou na frente de uma rocha e gritou: — Abre-te, Sésamo! E uma {palavra} secreta se abriu na rocha!',
      },
    },
    {
      imagem: 2729,
      texto: {
        'pt-PT': 'Quando os ladrões se foram embora, Ali Babá disse as palavras mágicas e entrou numa {palavra} escura.',
        'pt-BR': 'Quando os ladrões foram embora, Ali Babá disse as palavras mágicas e entrou em uma {palavra} escura.',
      },
    },
    {
      imagem: 6229,
      texto: {
        'pt-PT': 'Lá dentro havia um {palavra} enorme, com moedas de ouro e joias brilhantes! Ali Babá levou só um bocadinho para a sua família e, com a ajuda da esperta Morgiana, os ladrões nunca o apanharam.',
        'pt-BR': 'Lá dentro havia um {palavra} enorme, com moedas de ouro e joias brilhantes! Ali Babá levou só um pouquinho para a família e, com a ajuda da esperta Morgiana, os ladrões nunca o pegaram.',
      },
    },
  ]),

  fabula('aladino', '🧞', { 'pt-PT': 'Aladino e a Lâmpada Mágica', 'pt-BR': 'Aladim e a Lâmpada Maravilhosa' }, [
    {
      imagem: 2729,
      texto: {
        'pt-PT': 'Aladino era um rapaz pobre. Um feiticeiro pediu-lhe para entrar numa {palavra} e trazer de lá uma lâmpada velha.',
        'pt-BR': 'Aladim era um garoto pobre. Um feiticeiro pediu a ele que entrasse em uma {palavra} e trouxesse de lá uma lâmpada velha.',
      },
    },
    {
      imagem: 2252,
      texto: {
        'pt-PT': 'Antes de ele entrar, o feiticeiro deu-lhe um {palavra} para o proteger. Lá dentro, Aladino encontrou a lâmpada, mas a entrada fechou-se e ele ficou preso!',
        'pt-BR': 'Antes de ele entrar, o feiticeiro lhe deu um {palavra} para protegê-lo. Lá dentro, Aladim encontrou a lâmpada, mas a entrada se fechou e ele ficou preso!',
      },
    },
    {
      imagem: 6004,
      texto: {
        'pt-PT': 'Aladino esfregou a lâmpada para a limpar e... puf! Saiu um {palavra} enorme! — Os teus desejos são ordens! — disse ele.',
        'pt-BR': 'Aladim esfregou a lâmpada para limpar e... puf! Saiu um {palavra} enorme! — Seus desejos são ordens! — disse ele.',
      },
    },
    {
      imagem: 5554,
      texto: {
        'pt-PT': 'O génio tirou-o da gruta. Mais tarde, Aladino conheceu uma {palavra} muito simpática e ficaram grandes amigos.',
        'pt-BR': 'O gênio o tirou da caverna. Mais tarde, Aladim conheceu uma {palavra} muito simpática e eles ficaram grandes amigos.',
      },
    },
    {
      imagem: 17279,
      texto: {
        'pt-PT': 'Com a ajuda do génio, Aladino construiu um {palavra} bonito, cheio de jardins, e viveu lá feliz com a princesa e com a sua mãe.',
        'pt-BR': 'Com a ajuda do gênio, Aladim construiu um {palavra} lindo, cheio de jardins, e viveu lá feliz com a princesa e com a mãe.',
      },
    },
  ]),

  fabula('simbad', '⛵', { 'pt-PT': 'Simbad, o Marinheiro', 'pt-BR': 'Simbad, o Marinheiro' }, [
    {
      imagem: 2273,
      texto: {
        'pt-PT': 'Simbad era um marinheiro que adorava aventuras. Um dia, partiu pelo mar fora no seu {palavra}.',
        'pt-BR': 'Simbad era um marinheiro que adorava aventuras. Um dia, saiu navegando pelo mar no seu {palavra}.',
      },
    },
    {
      imagem: 2966,
      texto: {
        'pt-PT': 'Depois de muitos dias, o barco parou ao pé de uma {palavra} cheia de palmeiras. Simbad desceu para a explorar.',
        'pt-BR': 'Depois de muitos dias, o barco parou perto de uma {palavra} cheia de palmeiras. Simbad desceu para explorar.',
      },
    },
    {
      imagem: 2427,
      texto: {
        'pt-PT': 'No meio da ilha, encontrou uma coisa branca e redonda, do tamanho de uma casa. Era um {palavra} gigante!',
        'pt-BR': 'No meio da ilha, encontrou uma coisa branca e redonda, do tamanho de uma casa. Era um {palavra} gigante!',
      },
    },
    {
      imagem: 2490,
      texto: {
        'pt-PT': 'De repente, o céu ficou escuro. Era o Roc, um {palavra} tão grande que tapava o sol! Simbad agarrou-se à pata dele e voou pelos ares.',
        'pt-BR': 'De repente, o céu ficou escuro. Era o Roc, um {palavra} tão grande que cobria o sol! Simbad se agarrou na pata dele e voou pelos ares.',
      },
    },
    {
      imagem: 6475,
      texto: {
        'pt-PT': 'O Roc pousou num vale onde o chão brilhava: cada pedra era um {palavra}! Simbad apanhou alguns, encontrou um barco e voltou para casa para contar a aventura.',
        'pt-BR': 'O Roc pousou num vale onde o chão brilhava: cada pedra era um {palavra}! Simbad pegou alguns, encontrou um barco e voltou para casa para contar a aventura.',
      },
    },
  ]),
];

/** Um grupo de histórias na tela de escolha. */
export interface Colecao {
  id: string;
  titulo: TextoPorIdioma;
  historias: Fabula[];
}

export const COLECOES: Colecao[] = [
  { id: 'fabulas', titulo: { 'pt-PT': '🦊 Fábulas', 'pt-BR': '🦊 Fábulas' }, historias: FABULAS },
  { id: 'grimm', titulo: { 'pt-PT': '🏰 Irmãos Grimm', 'pt-BR': '🏰 Irmãos Grimm' }, historias: CONTOS_GRIMM },
  {
    id: 'mil-e-uma-noites',
    titulo: { 'pt-PT': '🌙 As Mil e Uma Noites', 'pt-BR': '🌙 As Mil e Uma Noites' },
    historias: CONTOS_MIL_E_UMA_NOITES,
  },
];
