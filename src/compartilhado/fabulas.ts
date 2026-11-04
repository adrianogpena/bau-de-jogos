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

/** Atalho para escrever um parágrafo: imagem, texto em pt-PT e texto em pt-BR. */
function p(imagem: number, ptPT: string, ptBR: string): ParagrafoBruto {
  return { imagem, texto: { 'pt-PT': ptPT, 'pt-BR': ptBR } };
}

function fabula(id: string, emoji: string, titulo: TextoPorIdioma, paragrafos: ParagrafoBruto[]): Fabula {
  const imagens = new Set<number>();
  return {
    id,
    emoji,
    titulo,
    paragrafos: paragrafos.map(({ imagem, texto }) => {
      for (const variante of Object.keys(texto) as Idioma[]) {
        if (texto[variante].split(MARCA_PALAVRA).length !== 2) {
          throw new Error(`História "${id}" (${variante}): o parágrafo precisa ter ${MARCA_PALAVRA} uma vez.`);
        }
      }
      // no jogo de leitura as outras palavras da história viram opções: não podem repetir
      if (imagens.has(imagem)) throw new Error(`História "${id}": a imagem ${imagem} aparece em dois parágrafos.`);
      imagens.add(imagem);
      return { palavra: palavraPorImagem(imagem), texto };
    }),
  };
}

/**
 * Fábulas (Esopo e La Fontaine) usadas nos jogos de escrita e de leitura.
 * Cada texto é escrito à parte para pt-PT e pt-BR: revise as duas variantes ao mudar.
 * Evite que a palavra da imagem apareça noutro ponto do mesmo parágrafo (daria a resposta).
 */
export const FABULAS: Fabula[] = [
  fabula('lebre-tartaruga', '🐢', { 'pt-PT': 'A Lebre e a Tartaruga', 'pt-BR': 'A Lebre e a Tartaruga' }, [
    p(
      17265,
      'Era uma vez uma {palavra} muito vaidosa. Corria mais depressa do que todos os animais da floresta e passava o dia a gabar-se.',
      'Era uma vez uma {palavra} muito convencida. Corria mais rápido do que todos os animais da floresta e passava o dia se gabando.',
    ),
    p(
      2596,
      'Um dia, uma {palavra} muito lenta cansou-se de a ouvir e disse-lhe: — Aposto que te ganho numa corrida!',
      'Um dia, uma {palavra} muito lenta cansou de ouvir aquilo e disse: — Aposto que ganho de você numa corrida!',
    ),
    p(
      2623,
      'A lebre riu-se tanto que até caiu no chão. Todos os animais vieram ver, e a {palavra} ficou de juíza. Desenhou uma linha na terra e gritou: — Prontos? Já!',
      'A lebre riu tanto que até caiu no chão. Todos os animais vieram assistir, e a {palavra} foi a juíza. Ela desenhou uma linha na terra e gritou: — Preparados? Já!',
    ),
    p(
      2619,
      'A lebre disparou e, num instante, a tartaruga já nem se via. A meio do caminho, a lebre encontrou uma horta e parou para comer uma {palavra} bem fresquinha.',
      'A lebre disparou e, num instante, a tartaruga já nem aparecia. No meio do caminho, a lebre encontrou uma horta e parou para comer uma {palavra} bem fresquinha.',
    ),
    p(
      2256,
      'Com a barriga cheia, pensou: «Aquela tartaruga tão lenta nunca me vai apanhar.» E deitou-se a dormir à sombra de uma {palavra}.',
      'De barriga cheia, ela pensou: «Aquela tartaruga lerda nunca vai me alcançar.» E resolveu tirar um cochilo à sombra de uma {palavra}.',
    ),
    p(
      7252,
      'Enquanto isso, a tartaruga continuava, passo a passo, debaixo do {palavra} quente. Estava cansada, mas nunca parou.',
      'Enquanto isso, a tartaruga continuava, passo a passo, debaixo do {palavra} quente. Estava cansada, mas não parou nem um minuto.',
    ),
    p(
      2490,
      'Ao fim da tarde, um {palavra} viu a tartaruga quase a chegar e voou depressa para acordar a lebre: — Acorda, dorminhoca!',
      'No fim da tarde, um {palavra} viu a tartaruga quase chegando e voou depressa para acordar a lebre: — Acorde, dorminhoca!',
    ),
    p(
      16817,
      'A lebre deu um salto e correu o mais que pôde, mas já era tarde: a tartaruga estava a cruzar a {palavra}! Os animais aplaudiram. Devagar se vai ao longe!',
      'A lebre deu um pulo e correu o máximo que pôde, mas já era tarde: a tartaruga estava cruzando a {palavra}! Os animais aplaudiram. Devagar se vai ao longe!',
    ),
  ]),

  fabula('leao-rato', '🦁', { 'pt-PT': 'O Leão e o Rato', 'pt-BR': 'O Leão e o Rato' }, [
    p(
      2449,
      'Num dia de muito calor, um {palavra} enorme dormia a sesta no meio da floresta.',
      'Num dia muito quente, um {palavra} enorme tirava um cochilo no meio da floresta.',
    ),
    p(
      2546,
      'Um {palavra} pequenino passou a correr por cima do nariz dele e acordou-o. O leão, furioso, apanhou-o com a pata.',
      'Um {palavra} pequenininho passou correndo por cima do nariz dele e o acordou. O leão, furioso, o pegou com a pata.',
    ),
    p(
      2663,
      'Já ia abrir a {palavra} para o comer quando o ratinho gritou: — Por favor, deixa-me ir! Um dia, eu ajudo-te!',
      'Ele já ia abrir a {palavra} para comer o ratinho quando ele gritou: — Por favor, me deixe ir! Um dia, eu ajudo você!',
    ),
    p(
      6594,
      'O leão riu-se: — Tu, tão pequenino, a ajudar-me a mim? Mas achou graça e soltou-o. O rato fugiu e escondeu-se atrás de uma {palavra}.',
      'O leão riu: — Você, tão pequenininho, me ajudar? Mas achou graça e o soltou. O rato fugiu e se escondeu atrás de uma {palavra}.',
    ),
    p(
      8533,
      'Dias depois, um {palavra} entrou na floresta. Queria apanhar o rei dos animais para o levar para a cidade.',
      'Dias depois, um {palavra} entrou na floresta. Queria capturar o rei dos animais para levá-lo para a cidade.',
    ),
    p(
      2548,
      'Escondeu uma {palavra} grande entre as folhas. Quando o leão passou, ficou preso lá dentro! Rugia e esperneava, mas não conseguia sair.',
      'Ele escondeu uma {palavra} grande no meio das folhas. Quando o leão passou, ficou preso lá dentro! Rugia e se debatia, mas não conseguia sair.',
    ),
    p(
      26026,
      'O rato ouviu os rugidos e correu até lá. Com os seus dentes pequeninos, roeu cada {palavra} da rede, uma a uma, até o leão ficar livre.',
      'O rato ouviu os rugidos e correu até lá. Com seus dentes pequenininhos, roeu cada {palavra} da rede, uma por uma, até o leão ficar livre.',
    ),
    p(
      2933,
      'Quando o caçador voltou, a rede estava vazia. Nessa noite, debaixo da {palavra}, o leão agradeceu ao rato. Os amigos pequenos também podem ajudar os grandes!',
      'Quando o caçador voltou, a rede estava vazia. Naquela noite, debaixo da {palavra}, o leão agradeceu ao rato. Os amigos pequenos também podem ajudar os grandes!',
    ),
  ]),

  fabula('cigarra-formiga', '🐜', { 'pt-PT': 'A Cigarra e a Formiga', 'pt-BR': 'A Cigarra e a Formiga' }, [
    p(
      16613,
      'No verão, uma {palavra} passava os dias a cantar, deitada à sombra, sem nenhuma preocupação.',
      'No verão, uma {palavra} passava os dias cantando, deitada na sombra, sem nenhuma preocupação.',
    ),
    p(
      2425,
      'Perto dela, uma {palavra} trabalhava sem parar, de manhã à noite, a guardar comida para o inverno.',
      'Perto dela, uma {palavra} trabalhava sem parar, de manhã até a noite, guardando comida para o inverno.',
    ),
    p(
      7285,
      'A formiga carregava grãos de {palavra} maiores do que ela, um de cada vez, até ao formigueiro.',
      'A formiga carregava grãos de {palavra} maiores do que ela, um de cada vez, até o formigueiro.',
    ),
    p(
      2615,
      '— Vem cantar comigo! — dizia a cigarra, a tocar o seu {palavra}. — Agora não, tenho de trabalhar — respondia a formiga. — O inverno está a chegar.',
      '— Venha cantar comigo! — dizia a cigarra, tocando seu {palavra}. — Agora não, preciso trabalhar — respondia a formiga. — O inverno está chegando.',
    ),
    p(
      5077,
      'Chegou o outono. Cada {palavra} das árvores ficou amarela e caiu, e o vento começou a soprar frio. A cigarra continuava a cantar.',
      'Chegou o outono. Cada {palavra} das árvores ficou amarela e caiu, e o vento começou a soprar frio. A cigarra continuava cantando.',
    ),
    p(
      3135,
      'Depois veio o inverno e caiu muita {palavra}. Já não havia nada para comer. A cigarra estava cheia de fome e a tremer de frio.',
      'Depois veio o inverno e caiu muita {palavra}. Não havia mais nada para comer. A cigarra estava morrendo de fome e tremendo de frio.',
    ),
    p(
      3244,
      'Sem saber o que fazer, foi bater à {palavra} da formiga. — Formiga, dás-me um bocadinho de comida? — pediu, envergonhada.',
      'Sem saber o que fazer, foi bater na {palavra} da formiga. — Formiga, você me dá um pouquinho de comida? — pediu, envergonhada.',
    ),
    p(
      2573,
      '— Que fizeste tu no verão? — perguntou a formiga. — Cantei — respondeu a cigarra. A formiga pensou um pouco, deixou-a entrar e deu-lhe uma {palavra} quente. E a cigarra aprendeu: no verão seguinte, trabalhou e cantou.',
      '— O que você fez no verão? — perguntou a formiga. — Cantei — respondeu a cigarra. A formiga pensou um pouco, a deixou entrar e lhe deu uma {palavra} quente. E a cigarra aprendeu: no verão seguinte, trabalhou e cantou.',
    ),
  ]),

  fabula('corvo-raposa', '🦊', { 'pt-PT': 'O Corvo e a Raposa', 'pt-BR': 'O Corvo e a Raposa' }, [
    p(
      4619,
      'Um {palavra} preto e esperto voava pela aldeia à procura de comida.',
      'Um {palavra} preto e esperto voava pelo vilarejo procurando comida.',
    ),
    p(
      2611,
      'Numa casa, viu uma {palavra} aberta. Lá dentro, em cima da mesa, estava um prato com comida.',
      'Em uma casa, viu uma {palavra} aberta. Lá dentro, em cima da mesa, havia um prato com comida.',
    ),
    p(
      2541,
      'Entrou de mansinho, agarrou um {palavra} amarelo e cheiroso e fugiu antes que alguém o visse.',
      'Entrou de mansinho, pegou um {palavra} amarelo e cheiroso e fugiu antes que alguém o visse.',
    ),
    p(
      2256,
      'Pousou no ramo mais alto de uma {palavra} para o comer com calma.',
      'Pousou no galho mais alto de uma {palavra} para comer com calma.',
    ),
    p(
      2623,
      'Lá em baixo passava uma {palavra} esfomeada. Sentiu o cheiro do queijo e lambeu os beiços. «Aquele queijo vai ser meu», pensou.',
      'Lá embaixo passava uma {palavra} faminta. Sentiu o cheiro do queijo e lambeu os beiços. «Aquele queijo vai ser meu», pensou.',
    ),
    p(
      2490,
      '— Bom dia, senhor corvo! Que penas tão bonitas! Deves ser o {palavra} mais lindo da floresta. Se a tua voz for tão bela como as tuas penas, és o rei das aves!',
      '— Bom dia, senhor corvo! Que penas lindas! Você deve ser o {palavra} mais bonito da floresta. Se sua voz for tão bela quanto suas penas, você é o rei das aves!',
    ),
    p(
      5538,
      'O corvo, todo vaidoso, quis mostrar a sua voz. Abriu o {palavra} e cantou: — Cróóó! E o queijo caiu lá de cima.',
      'O corvo, todo convencido, quis mostrar sua voz. Abriu o {palavra} e cantou: — Cróóó! E o queijo caiu lá de cima.',
    ),
    p(
      2786,
      'A raposa apanhou-o e comeu-o de uma só vez. — Obrigada! Aprende: quem elogia demais quer alguma coisa! E o corvo ficou ali, com a {palavra} a roncar de fome.',
      'A raposa pegou o queijo e comeu de uma vez só. — Obrigada! Aprenda: quem elogia demais quer alguma coisa! E o corvo ficou ali, com a {palavra} roncando de fome.',
    ),
  ]),

  fabula('tres-porquinhos', '🐷', { 'pt-PT': 'Os Três Porquinhos', 'pt-BR': 'Os Três Porquinhos' }, [
    p(
      5954,
      'Era uma vez três irmãos. Cada um era um {palavra} cor-de-rosa. Um dia, a mãe disse-lhes: — Já são crescidos. Vão construir as vossas casas!',
      'Era uma vez três irmãos. Cada um era um {palavra} cor-de-rosa. Um dia, a mãe disse: — Vocês já estão grandes. Vão construir suas casas!',
    ),
    p(
      6163,
      'O mais novo só queria brincar. Fez uma casa de {palavra} num instante e foi logo tocar flauta.',
      'O mais novo só queria brincar. Fez uma casa de {palavra} num instante e foi logo tocar flauta.',
    ),
    p(
      6143,
      'O do meio também tinha pressa. Fez uma casa de {palavra}, pregou umas tábuas e foi tocar violino.',
      'O do meio também estava com pressa. Fez uma casa de {palavra}, pregou umas tábuas e foi tocar violino.',
    ),
    p(
      2951,
      'O mais velho trabalhou o dia todo. Fez uma casa de {palavra}, com paredes grossas e uma lareira. — Vão ver que vale a pena! — disse aos irmãos.',
      'O mais velho trabalhou o dia inteiro. Fez uma casa de {palavra}, com paredes grossas e uma lareira. — Vocês vão ver que vale a pena! — disse aos irmãos.',
    ),
    p(
      6140,
      'Então chegou o {palavra} mau, cheio de fome. Foi à casa de palha: — Porquinho, porquinho, deixa-me entrar! — Não! — Então vou soprar, soprar e a tua casa vai voar! Soprou e a casa voou. O porquinho fugiu a correr para casa do irmão.',
      'Então chegou o {palavra} mau, morrendo de fome. Foi até a casa de palha: — Porquinho, porquinho, me deixe entrar! — Não! — Então vou soprar, soprar e sua casa vai voar! Soprou e a casa voou. O porquinho fugiu correndo para a casa do irmão.',
    ),
    p(
      3244,
      'O lobo bateu à {palavra} da casa de madeira. Soprou, soprou e a casa caiu! Os dois porquinhos fugiram para a casa de tijolo.',
      'O lobo bateu na {palavra} da casa de madeira. Soprou, soprou e a casa caiu! Os dois porquinhos fugiram para a casa de tijolo.',
    ),
    p(
      2333,
      'O lobo soprou com toda a força, mas a casa de tijolo não se mexeu. Então teve uma ideia: subiu ao telhado para entrar pela {palavra}.',
      'O lobo soprou com toda a força, mas a casa de tijolo nem se mexeu. Então teve uma ideia: subiu no telhado para entrar pela {palavra}.',
    ),
    p(
      9086,
      'Mas o porquinho mais velho pôs uma {palavra} de água a ferver na lareira. O lobo caiu lá dentro, queimou o rabo e fugiu aos uivos para nunca mais voltar! Os três irmãos ficaram a viver juntos na casa de tijolo.',
      'Mas o porquinho mais velho colocou uma {palavra} de água fervendo na lareira. O lobo caiu lá dentro, queimou o rabo e fugiu uivando para nunca mais voltar! Os três irmãos ficaram morando juntos na casa de tijolo.',
    ),
  ]),
];

/** Contos dos Irmãos Grimm (versões para crianças, perto das originais). */
export const CONTOS_GRIMM: Fabula[] = [
  fabula('capuchinho-vermelho', '🧺', { 'pt-PT': 'O Capuchinho Vermelho', 'pt-BR': 'Chapeuzinho Vermelho' }, [
    p(
      3012,
      'Era uma vez uma menina que usava sempre um capuchinho vermelho. Um dia, a mãe deu-lhe um {palavra} com bolo e sumo e disse: — Leva isto à avó, que está doente. E não saias do caminho!',
      'Era uma vez uma menina que usava sempre um chapeuzinho vermelho. Um dia, a mãe lhe deu uma {palavra} com bolo e suco e disse: — Leve isto para a vovó, que está doente. E não saia do caminho!',
    ),
    p(
      6140,
      'No meio da floresta, apareceu um {palavra}. — Onde vais, menina? — Vou a casa da minha avó, ao fundo do caminho! — respondeu ela, sem saber que ele era mau.',
      'No meio da floresta, apareceu um {palavra}. — Aonde você vai, menina? — Vou para a casa da minha avó, no fim do caminho! — respondeu ela, sem saber que ele era mau.',
    ),
    p(
      3102,
      '— Olha que bonito está o campo! — disse o lobo. — Porque não levas uma {palavra} à tua avó? A menina saiu do caminho para fazer um ramo, e o lobo correu à frente.',
      '— Olhe que lindo está o campo! — disse o lobo. — Por que você não leva uma {palavra} para sua avó? A menina saiu do caminho para fazer um buquê, e o lobo correu na frente.',
    ),
    p(
      23710,
      'O lobo chegou primeiro e bateu à porta. Entrou, engoliu a {palavra} de uma só vez, vestiu a camisa de dormir dela e deitou-se na cama.',
      'O lobo chegou primeiro e bateu na porta. Entrou, engoliu a {palavra} de uma vez só, vestiu a camisola dela e se deitou na cama.',
    ),
    p(
      2871,
      'Quando a menina chegou, achou a avó muito estranha. — Avó, que {palavra} tão grandes tens! — São para te ouvir melhor!',
      'Quando a menina chegou, achou a vovó muito estranha. — Vovó, que {palavra} grandes você tem! — São para ouvir você melhor!',
    ),
    p(
      2876,
      'A menina chegou-se mais perto. — Avó, que {palavra} tão grandes tens! — São para te ver melhor!',
      'A menina chegou mais perto. — Vovó, que {palavra} grandes você tem! — São para ver você melhor!',
    ),
    p(
      2663,
      '— Avó, que {palavra} tão grande tens! — É para te comer melhor! E o lobo saltou da cama e engoliu a menina também. Depois, de barriga cheia, adormeceu a ressonar.',
      '— Vovó, que {palavra} grande você tem! — É para comer você melhor! E o lobo pulou da cama e engoliu a menina também. Depois, de barriga cheia, dormiu roncando.',
    ),
    p(
      8533,
      'Um {palavra} que passava ouviu o ressonar tão alto que desconfiou. Entrou e viu o lobo com a barriga enorme. Com uma tesoura, abriu-lhe a barriga e saltaram cá para fora a menina e a avó, vivas!',
      'Um {palavra} que passava ouviu o ronco tão alto que desconfiou. Entrou e viu o lobo com a barriga enorme. Com uma tesoura, abriu a barriga dele e de lá saíram a menina e a avó, vivas!',
    ),
    p(
      6594,
      'Depois, puseram na barriga do lobo uma {palavra} enorme e pesada e coseram-na. Quando acordou, o lobo quis fugir, mas a barriga pesava tanto que caiu e nunca mais se levantou. E a menina prometeu nunca mais sair do caminho.',
      'Depois, colocaram na barriga do lobo uma {palavra} enorme e pesada e a costuraram. Quando acordou, o lobo quis fugir, mas a barriga pesava tanto que ele caiu e nunca mais se levantou. E a menina prometeu nunca mais sair do caminho.',
    ),
  ]),

  fabula('hansel-gretel', '🍫', { 'pt-PT': 'Hansel e Gretel', 'pt-BR': 'João e Maria' }, [
    p(
      2943,
      'Hansel e Gretel eram irmãos. O pai era um {palavra} muito pobre, e a madrasta, que não gostava das crianças, convenceu-o a deixá-las sozinhas na floresta.',
      'João e Maria eram irmãos. O pai era um {palavra} muito pobre, e a madrasta, que não gostava das crianças, o convenceu a deixá-los sozinhos na floresta.',
    ),
    p(
      2494,
      'O Hansel ouviu tudo. Pelo caminho, foi deixando cair migalhas de {palavra} para conseguirem voltar para casa.',
      'João ouviu tudo. Pelo caminho, foi deixando cair migalhas de {palavra} para conseguirem voltar para casa.',
    ),
    p(
      2490,
      'Mas, à noite, quando quiseram regressar, já não havia migalhas: um {palavra} esfomeado tinha-as comido todas! Estavam perdidos.',
      'Mas, à noite, quando quiseram voltar, não havia mais migalhas: um {palavra} faminto tinha comido todas! Eles estavam perdidos.',
    ),
    p(
      25940,
      'Andaram três dias pela floresta até encontrarem uma casinha feita de bolo, com janelas de açúcar e telhado de {palavra}! Cheios de fome, começaram a comer.',
      'Andaram três dias pela floresta até encontrarem uma casinha feita de bolo, com janelas de açúcar e telhado de {palavra}! Morrendo de fome, começaram a comer.',
    ),
    p(
      5404,
      'A porta abriu-se e saiu uma velhinha muito simpática, que os convidou a entrar. Mas era uma {palavra} má, que gostava de comer crianças!',
      'A porta se abriu e saiu uma velhinha muito simpática, que os convidou para entrar. Mas era uma {palavra} malvada, que gostava de comer crianças!',
    ),
    p(
      5494,
      'No dia seguinte, a bruxa fechou o Hansel numa {palavra} e pôs a Gretel a cozinhar para ele. Queria engordá-lo para o comer.',
      'No dia seguinte, a bruxa trancou João numa {palavra} e colocou Maria para cozinhar para ele. Queria engordar o menino para comê-lo.',
    ),
    p(
      2972,
      'A bruxa via muito mal. Todos os dias pedia ao Hansel para mostrar o dedo, para ver se já estava gordo. Mas ele, esperto, mostrava-lhe um {palavra} fininho.',
      'A bruxa enxergava muito mal. Todo dia pedia para João mostrar o dedo, para ver se ele já estava gordo. Mas ele, esperto, mostrava um {palavra} fininho.',
    ),
    p(
      10135,
      'Um dia, a bruxa perdeu a paciência e acendeu o {palavra}. — Gretel, espreita lá para dentro, para ver se está quente! A Gretel percebeu o truque: — Não sei como se faz. A bruxa espreitou para lhe mostrar, e a Gretel empurrou-a lá para dentro e fechou a porta!',
      'Um dia, a bruxa perdeu a paciência e acendeu o {palavra}. — Maria, olhe lá dentro para ver se está quente! Maria percebeu o truque: — Não sei como faz. A bruxa se abaixou para mostrar, e Maria a empurrou lá para dentro e fechou a porta!',
    ),
    p(
      6229,
      'A Gretel soltou o irmão. Na casa da bruxa, encontraram um {palavra} cheio de pérolas e pedras preciosas, e encheram os bolsos.',
      'Maria soltou o irmão. Na casa da bruxa, encontraram um {palavra} cheio de pérolas e pedras preciosas, e encheram os bolsos.',
    ),
    p(
      2563,
      'No caminho de volta, um rio largo não os deixava passar. Um {palavra} branco levou-os às costas, um de cada vez. Em casa, o pai chorou de alegria. A madrasta já se tinha ido embora, e viveram felizes para sempre.',
      'No caminho de volta, um rio largo não os deixava passar. Um {palavra} branco os levou nas costas, um de cada vez. Em casa, o pai chorou de alegria. A madrasta já tinha ido embora, e eles viveram felizes para sempre.',
    ),
  ]),

  fabula('branca-de-neve', '🍎', { 'pt-PT': 'A Branca de Neve', 'pt-BR': 'Branca de Neve' }, [
    p(
      2385,
      'Uma rainha muito vaidosa tinha um {palavra} mágico que falava. Todos os dias lhe perguntava: — Quem é a mais bela de todas? E ele respondia: — És tu, minha rainha!',
      'Uma rainha muito vaidosa tinha um {palavra} mágico que falava. Todo dia ela perguntava: — Quem é a mais bela de todas? E ele respondia: — É você, minha rainha!',
    ),
    p(
      8533,
      'Mas a enteada, a Branca de Neve, crescia e ficava cada vez mais bonita. Um dia, o espelho disse: — A Branca de Neve é a mais bela! A rainha, furiosa, mandou um {palavra} levá-la para a floresta e matá-la.',
      'Mas a enteada, Branca de Neve, crescia e ficava cada vez mais bonita. Um dia, o espelho disse: — Branca de Neve é a mais bela! A rainha, furiosa, mandou um {palavra} levar a menina para a floresta e matá-la.',
    ),
    p(
      2317,
      'O caçador teve pena e deixou-a fugir. A Branca de Neve correu pela floresta escura até encontrar uma {palavra} pequenina, com tudo muito arrumadinho.',
      'O caçador teve pena e a deixou fugir. Branca de Neve correu pela floresta escura até encontrar uma {palavra} pequenininha, com tudo muito arrumadinho.',
    ),
    p(
      3129,
      'Em cima da {palavra} havia sete pratinhos, sete copinhos e sete colherzinhas. Tinha tanta fome que comeu um bocadinho de cada prato.',
      'Em cima da {palavra} havia sete pratinhos, sete copinhos e sete colherzinhas. Ela estava com tanta fome que comeu um pouquinho de cada prato.',
    ),
    p(
      2304,
      'Depois, cheia de sono, deitou-se numa {palavra} pequenina e adormeceu.',
      'Depois, morrendo de sono, ela se deitou numa {palavra} pequenininha e dormiu.',
    ),
    p(
      5450,
      'À noite, chegaram os donos da casa: sete anões que trabalhavam numa mina. Cada {palavra} quis saber quem era aquela menina. Ouviram a história e deixaram-na ficar, mas avisaram: — Não abras a porta a ninguém!',
      'À noite, chegaram os donos da casa: sete anões que trabalhavam numa mina. Cada {palavra} quis saber quem era aquela menina. Eles ouviram a história e a deixaram ficar, mas avisaram: — Não abra a porta para ninguém!',
    ),
    p(
      2462,
      'O espelho contou à rainha que a Branca de Neve estava viva. A rainha disfarçou-se de velhinha e levou-lhe uma {palavra} envenenada. A Branca de Neve deu uma dentada e caiu no chão, como morta.',
      'O espelho contou para a rainha que Branca de Neve estava viva. A rainha se disfarçou de velhinha e levou para ela uma {palavra} envenenada. Branca de Neve deu uma mordida e caiu no chão, como se estivesse morta.',
    ),
    p(
      5555,
      'Os anões, muito tristes, puseram-na numa caixa de vidro. Um dia, passou por ali um {palavra}, que pediu para a levar. Quando a carregavam, tropeçaram, e o pedaço de maçã saltou-lhe da garganta. A Branca de Neve acordou!',
      'Os anões, muito tristes, a colocaram numa caixa de vidro. Um dia, passou por ali um {palavra}, que pediu para levá-la. Quando a carregavam, tropeçaram, e o pedaço de maçã saiu da garganta dela. Branca de Neve acordou!',
    ),
    p(
      25016,
      'A Branca de Neve casou com o príncipe e recebeu uma {palavra} de rainha. A rainha má ficou tão zangada que fugiu para longe, e nunca mais ninguém a viu.',
      'Branca de Neve se casou com o príncipe e ganhou uma {palavra} de rainha. A rainha má ficou tão furiosa que fugiu para longe, e ninguém nunca mais a viu.',
    ),
  ]),

  fabula('musicos-de-bremen', '🎺', { 'pt-PT': 'Os Músicos de Bremen', 'pt-BR': 'Os Músicos de Bremen' }, [
    p(
      2291,
      'Um {palavra} trabalhou muitos anos numa quinta. Quando ficou velhinho, o dono já não o queria. Então fugiu e decidiu ir para Bremen ser músico.',
      'Um {palavra} trabalhou muitos anos numa fazenda. Quando ficou velhinho, o dono não queria mais saber dele. Então ele fugiu e decidiu ir para Bremen ser músico.',
    ),
    p(
      2517,
      'No caminho, encontrou um {palavra} deitado, muito cansado. — Já sou velho para caçar e o meu dono quer livrar-se de mim. — Anda comigo para Bremen! — disse o burro. — Tu podes tocar tambor!',
      'No caminho, encontrou um {palavra} deitado, muito cansado. — Estou velho demais para caçar e meu dono quer se livrar de mim. — Venha comigo para Bremen! — disse o burro. — Você pode tocar tambor!',
    ),
    p(
      2406,
      'Mais à frente, estava um {palavra} com cara triste. — Já não apanho ratos e querem pôr-me fora de casa! — Vem connosco! — disseram os outros.',
      'Mais adiante, havia um {palavra} com cara triste. — Não consigo mais caçar ratos e querem me pôr para fora de casa! — Venha com a gente! — disseram os outros.',
    ),
    p(
      2404,
      'Depois, passaram por uma quinta onde um {palavra} cantava cocorocó com toda a força. — Amanhã vão pôr-me na sopa! — Foge connosco! E assim ficaram quatro músicos.',
      'Depois, passaram por uma fazenda onde um {palavra} cantava cocoricó com toda a força. — Amanhã vão me cozinhar na sopa! — Fuja com a gente! E assim eles viraram quatro músicos.',
    ),
    p(
      2256,
      'À noite, pararam na floresta para dormir. O galo voou até ao topo de uma {palavra} e viu, ao longe, uma luz acesa. — Há ali uma casa!',
      'À noite, pararam na floresta para dormir. O galo voou até o topo de uma {palavra} e viu, ao longe, uma luz acesa. — Tem uma casa lá!',
    ),
    p(
      2611,
      'Foram até lá, e o burro, que era o mais alto, espreitou pela {palavra}. — Vejo ladrões a jantar e muita comida!',
      'Foram até lá, e o burro, que era o mais alto, espiou pela {palavra}. — Estou vendo uns ladrões jantando e muita comida!',
    ),
    p(
      3129,
      'Subiram uns para cima dos outros: o cão em cima do burro, o gato em cima do cão e o galo lá no alto. Cantaram todos ao mesmo tempo! Os ladrões fugiram cheios de medo e deixaram a {palavra} cheia de comida.',
      'Subiram um em cima do outro: o cachorro em cima do burro, o gato em cima do cachorro e o galo lá no alto. Cantaram todos ao mesmo tempo! Os ladrões fugiram morrendo de medo e deixaram a {palavra} cheia de comida.',
    ),
    p(
      8072,
      'Os quatro amigos comeram até não poder mais. Depois, o gato deitou-se junto à {palavra}, o cão atrás da porta, o burro no quintal e o galo no telhado.',
      'Os quatro amigos comeram até não aguentar mais. Depois, o gato se deitou perto da {palavra}, o cachorro atrás da porta, o burro no quintal e o galo no telhado.',
    ),
    p(
      4674,
      'A meio da noite, um {palavra} voltou às escondidas. O gato arranhou-lhe a cara, o cão mordeu-lhe a perna, o burro deu-lhe um coice e o galo gritou: — Cocorocó! O homem fugiu e nunca mais voltou, e os quatro músicos ficaram lá a viver, felizes.',
      'No meio da noite, um {palavra} voltou escondido. O gato arranhou a cara dele, o cachorro mordeu sua perna, o burro deu um coice e o galo gritou: — Cocoricó! O homem fugiu e nunca mais voltou, e os quatro músicos ficaram morando lá, felizes.',
    ),
  ]),

  fabula('principe-sapo', '🐸', { 'pt-PT': 'O Príncipe Sapo', 'pt-BR': 'O Príncipe Sapo' }, [
    p(
      5554,
      'Era uma vez uma {palavra} muito bonita, que adorava brincar no jardim do palácio.',
      'Era uma vez uma {palavra} muito bonita, que adorava brincar no jardim do palácio.',
    ),
    p(
      2269,
      'O seu brinquedo preferido era uma {palavra} de ouro, que atirava ao ar e apanhava outra vez.',
      'Seu brinquedo preferido era uma {palavra} de ouro, que ela jogava para o alto e pegava de novo.',
    ),
    p(
      8197,
      'Um dia, a bola escorregou-lhe das mãos e caiu dentro de um {palavra} muito fundo. A princesa começou a chorar.',
      'Um dia, a bola escorregou das mãos dela e caiu dentro de um {palavra} muito fundo. A princesa começou a chorar.',
    ),
    p(
      3384,
      'Então apareceu um {palavra} verde e feio: — Eu vou buscar a tua bola, se prometeres ser minha amiga e me deixares viver contigo! — Prometo! — disse a princesa. Mas, quando ele lhe trouxe a bola, ela agarrou-a e fugiu a correr.',
      'Então apareceu um {palavra} verde e feio: — Eu pego sua bola, se você prometer ser minha amiga e me deixar morar com você! — Prometo! — disse a princesa. Mas, quando ele trouxe a bola, ela a pegou e fugiu correndo.',
    ),
    p(
      3244,
      'No dia seguinte, ao jantar, alguém bateu à {palavra} do palácio: toc, toc! Era o sapo. — Princesa, deixa-me entrar! Lembra-te do que prometeste!',
      'No dia seguinte, na hora do jantar, alguém bateu na {palavra} do palácio: toc, toc! Era o sapo. — Princesa, me deixe entrar! Lembre-se do que você prometeu!',
    ),
    p(
      5563,
      'A princesa não queria, mas o {palavra}, o seu pai, ficou muito sério: — O que se promete, cumpre-se! Deixa-o entrar.',
      'A princesa não queria, mas o {palavra}, seu pai, ficou muito sério: — Promessa é dívida! Deixe o sapo entrar.',
    ),
    p(
      16857,
      'O sapo saltou para a mesa e comeu do {palavra} de ouro da princesa. Ela quase não conseguiu comer, de tanto nojo.',
      'O sapo pulou na mesa e comeu no {palavra} de ouro da princesa. Ela quase não conseguiu comer, de tanto nojo.',
    ),
    p(
      2304,
      'À noite, o sapo quis dormir na {palavra} dela. A princesa ficou tão zangada que o agarrou e o atirou contra a parede: — Toma, sapo nojento!',
      'À noite, o sapo quis dormir na {palavra} dela. A princesa ficou tão brava que o pegou e jogou contra a parede: — Tome, sapo nojento!',
    ),
    p(
      25016,
      'Mas, ao bater na parede, o sapo transformou-se num príncipe com uma {palavra} dourada! Uma bruxa tinha-o enfeitiçado, e a princesa quebrou o feitiço. Ficaram amigos e, anos mais tarde, casaram-se.',
      'Mas, ao bater na parede, o sapo se transformou num príncipe com uma {palavra} dourada! Uma bruxa o tinha enfeitiçado, e a princesa quebrou o feitiço. Eles ficaram amigos e, anos depois, se casaram.',
    ),
  ]),
];

/** Contos das Mil e Uma Noites (versões para crianças). */
export const CONTOS_MIL_E_UMA_NOITES: Fabula[] = [
  fabula('ali-baba', '💰', { 'pt-PT': 'Ali Babá e os Quarenta Ladrões', 'pt-BR': 'Ali Babá e os Quarenta Ladrões' }, [
    p(
      2291,
      'Ali Babá era um homem pobre que ia todos os dias à floresta buscar lenha com o seu {palavra}.',
      'Ali Babá era um homem pobre que ia todo dia à floresta buscar lenha com seu {palavra}.',
    ),
    p(
      2294,
      'Um dia, ouviu um barulho ao longe. Eram quarenta ladrões, cada um montado no seu {palavra}, a galopar na sua direção!',
      'Um dia, ouviu um barulho ao longe. Eram quarenta ladrões, cada um montado em seu {palavra}, galopando na direção dele!',
    ),
    p(
      2256,
      'Cheio de medo, Ali Babá subiu a uma {palavra} e escondeu-se entre os ramos.',
      'Morrendo de medo, Ali Babá subiu em uma {palavra} e se escondeu entre os galhos.',
    ),
    p(
      3244,
      'O chefe dos ladrões parou em frente a uma rocha e gritou: — Abre-te, Sésamo! E uma {palavra} secreta abriu-se na rocha. Os ladrões entraram e, mais tarde, foram-se embora.',
      'O chefe dos ladrões parou na frente de uma rocha e gritou: — Abre-te, Sésamo! E uma {palavra} secreta se abriu na rocha. Os ladrões entraram e, mais tarde, foram embora.',
    ),
    p(
      2729,
      'Ali Babá desceu da árvore, disse as palavras mágicas e entrou numa {palavra} escura e enorme.',
      'Ali Babá desceu da árvore, disse as palavras mágicas e entrou em uma {palavra} escura e enorme.',
    ),
    p(
      6229,
      'Lá dentro havia um {palavra} enorme: moedas de ouro, joias e tecidos brilhantes, tudo roubado pelos ladrões!',
      'Lá dentro havia um {palavra} enorme: moedas de ouro, joias e tecidos brilhantes, tudo roubado pelos ladrões!',
    ),
    p(
      6210,
      'Ali Babá encheu um {palavra} de moedas, pô-lo em cima do burro e voltou para casa. Mas os ladrões descobriram e quiseram vingar-se.',
      'Ali Babá encheu um {palavra} de moedas, colocou em cima do burro e voltou para casa. Mas os ladrões descobriram e quiseram se vingar.',
    ),
    p(
      37689,
      'O chefe disfarçou-se de vendedor de azeite e pediu para dormir em casa de Ali Babá. Trazia muitos animais carregados e, dentro de cada {palavra}, em vez de azeite, havia um ladrão escondido!',
      'O chefe se disfarçou de vendedor de azeite e pediu para dormir na casa de Ali Babá. Trazia muitos animais carregados e, dentro de cada {palavra}, em vez de azeite, havia um ladrão escondido!',
    ),
    p(
      9086,
      'Mas a esperta Morgiana, a criada, descobriu o truque. Aqueceu azeite numa {palavra} enorme e despejou-o nos jarros. Os ladrões fugiram aos gritos e nunca mais voltaram, e Ali Babá viveu feliz e rico com a família.',
      'Mas a esperta Morgiana, a criada, descobriu o truque. Esquentou azeite numa {palavra} enorme e jogou nos jarros. Os ladrões fugiram gritando e nunca mais voltaram, e Ali Babá viveu feliz e rico com a família.',
    ),
  ]),

  fabula('aladino', '🧞', { 'pt-PT': 'Aladino e a Lâmpada Mágica', 'pt-BR': 'Aladim e a Lâmpada Maravilhosa' }, [
    p(
      38024,
      'Aladino era um rapaz pobre que vivia com a mãe. Um dia, apareceu um {palavra} que fingiu ser seu tio e lhe prometeu riquezas.',
      'Aladim era um garoto pobre que morava com a mãe. Um dia, apareceu um {palavra} que fingiu ser tio dele e lhe prometeu riquezas.',
    ),
    p(
      2729,
      'Levou-o até ao deserto, disse umas palavras mágicas e a terra abriu-se. Lá em baixo havia uma {palavra} cheia de tesouros.',
      'Ele levou o garoto até o deserto, disse umas palavras mágicas e a terra se abriu. Lá embaixo havia uma {palavra} cheia de tesouros.',
    ),
    p(
      9178,
      '— Desce e traz-me uma {palavra} velha que está lá ao fundo. Não toques em mais nada! — ordenou o feiticeiro.',
      '— Desça e me traga uma {palavra} velha que está lá no fundo. Não toque em mais nada! — ordenou o feiticeiro.',
    ),
    p(
      2252,
      'Aladino encontrou a lâmpada, mas não a quis entregar antes de sair. O feiticeiro, zangado, fechou a gruta com ele lá dentro! Sem querer, Aladino esfregou o {palavra} que trazia no dedo... e apareceu um espírito mágico que o levou para casa.',
      'Aladim encontrou a lâmpada, mas não quis entregá-la antes de sair. O feiticeiro, furioso, fechou a caverna com ele lá dentro! Sem querer, Aladim esfregou o {palavra} que usava no dedo... e apareceu um espírito mágico que o levou para casa.',
    ),
    p(
      6004,
      'Em casa, a mãe quis limpar a lâmpada velha. Esfregou-a e... puf! Saiu um {palavra} enorme: — Os teus desejos são ordens!',
      'Em casa, a mãe quis limpar a lâmpada velha. Esfregou e... puf! Saiu um {palavra} enorme: — Seus desejos são ordens!',
    ),
    p(
      5554,
      'Um dia, Aladino viu passar a {palavra} mais bonita do reino e ficou apaixonado.',
      'Um dia, Aladim viu passar a {palavra} mais bonita do reino e se apaixonou.',
    ),
    p(
      5563,
      'Para casar com ela, pediu ao génio presentes maravilhosos e levou-os ao {palavra}, o pai da princesa.',
      'Para se casar com ela, pediu ao gênio presentes maravilhosos e os levou ao {palavra}, o pai da princesa.',
    ),
    p(
      6475,
      'Eram taças de ouro, pérolas e um {palavra} do tamanho de um ovo! O rei ficou tão admirado que deixou Aladino casar com a princesa.',
      'Eram taças de ouro, pérolas e um {palavra} do tamanho de um ovo! O rei ficou tão impressionado que deixou Aladim se casar com a princesa.',
    ),
    p(
      17279,
      'Numa só noite, o génio construiu um {palavra} de mármore e ouro. Aladino e a princesa foram lá viver, com a mãe dele, e foram muito felizes.',
      'Em uma única noite, o gênio construiu um {palavra} de mármore e ouro. Aladim e a princesa foram morar lá, com a mãe dele, e foram muito felizes.',
    ),
  ]),

  fabula('simbad', '⛵', { 'pt-PT': 'Simbad, o Marinheiro', 'pt-BR': 'Simbad, o Marinheiro' }, [
    p(
      2273,
      'Simbad era um marinheiro que adorava aventuras. Um dia, partiu pelo mar fora no seu {palavra}, com outros marinheiros.',
      'Simbad era um marinheiro que adorava aventuras. Um dia, saiu navegando pelo mar no seu {palavra}, com outros marinheiros.',
    ),
    p(
      2966,
      'Depois de muitos dias, viram uma {palavra} pequena e verde. Desceram, acenderam uma fogueira e começaram a cozinhar.',
      'Depois de muitos dias, viram uma {palavra} pequena e verde. Desceram, acenderam uma fogueira e começaram a cozinhar.',
    ),
    p(
      2268,
      'De repente, o chão começou a tremer! Não era uma ilha: eram as costas de uma {palavra} gigante, que acordou com o calor do fogo e mergulhou.',
      'De repente, o chão começou a tremer! Não era uma ilha: eram as costas de uma {palavra} gigante, que acordou com o calor do fogo e mergulhou.',
    ),
    p(
      2427,
      'Simbad agarrou-se a um tronco e foi parar a outra ilha. Lá, encontrou uma coisa branca e redonda, do tamanho de uma casa. Era um {palavra} gigante!',
      'Simbad se agarrou num tronco e foi parar em outra ilha. Lá, encontrou uma coisa branca e redonda, do tamanho de uma casa. Era um {palavra} gigante!',
    ),
    p(
      2490,
      'De repente, o céu ficou escuro. Era o Roc, um {palavra} tão grande que tapava o sol! Simbad amarrou-se à pata dele com o turbante, e o Roc levou-o pelos ares.',
      'De repente, o céu ficou escuro. Era o Roc, um {palavra} tão grande que cobria o sol! Simbad se amarrou na pata dele com o turbante, e o Roc o levou pelos ares.',
    ),
    p(
      6475,
      'O Roc pousou num vale fundo, onde o chão brilhava: cada pedra era um {palavra}!',
      'O Roc pousou num vale fundo, onde o chão brilhava: cada pedra era um {palavra}!',
    ),
    p(
      35051,
      'Mas no vale vivia também uma {palavra} enorme, que dormia de dia e caçava à noite. Simbad escondeu-se, a tremer.',
      'Mas no vale também vivia uma {palavra} enorme, que dormia de dia e caçava à noite. Simbad se escondeu, tremendo.',
    ),
    p(
      2638,
      'Lá de cima, uns mercadores atiravam pedaços de carne para o vale, para os diamantes ficarem colados. Simbad agarrou-se a um pedaço, e uma {palavra} levou-o para fora do vale!',
      'Lá de cima, uns comerciantes jogavam pedaços de carne no vale, para os diamantes grudarem neles. Simbad se agarrou num pedaço, e uma {palavra} o levou para fora do vale!',
    ),
    p(
      2317,
      'Os mercadores ajudaram-no a voltar. Simbad chegou a {palavra} com os bolsos cheios de diamantes e uma aventura incrível para contar.',
      'Os comerciantes o ajudaram a voltar. Simbad chegou em {palavra} com os bolsos cheios de diamantes e uma aventura incrível para contar.',
    ),
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
