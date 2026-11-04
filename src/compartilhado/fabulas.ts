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
 * Fábulas usadas nos jogos de escrita e de leitura.
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
