import type { TextoPorIdioma } from '../../../compartilhado/idioma';
import { livro } from '../livro/regras';
import type { EscolhaLivro, Final, ItemHistoria, Ponto } from '../livro/tipos';
import type { NomeHabilidade } from './tipos';

const SUBIR: TextoPorIdioma = { 'pt-PT': 'Subir a escada ➜', 'pt-BR': 'Subir a escada ➜' };
const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };
const O_QUE_FAZER: TextoPorIdioma = {
  'pt-PT': 'O que quer fazer {nome}?',
  'pt-BR': 'O que {nome} quer fazer?',
};

/** Itens que aparecem na capa do mago. A marca `barulho` e a escola (fogo, gelo...) são fatos escondidos. */
const ITENS_MAGO: Record<string, ItemHistoria> = {
  livro: { icone: 'inimigos/livro-mordilhao', nome: { 'pt-PT': 'Livro Mordilhão amigo', 'pt-BR': 'Livro Mordilhão amigo' } },
  cha: { arquivo: 'chavena', nome: { 'pt-PT': 'Chá calmante', 'pt-BR': 'Chá calmante' } },
  cancao: { icone: 'interface/faisca-magica', nome: { 'pt-PT': 'Canção das estrelas', 'pt-BR': 'Canção das estrelas' } },
  pedaco: { icone: 'interface/estrela', nome: { 'pt-PT': 'Pedaço da estrela', 'pt-BR': 'Pedaço da estrela' } },
};

/** Os três finais: dependem de como o Golem foi vencido, do que o mago traz e do que decide no fim. */
const FINAIS_MAGO: Record<string, Final> = {
  ceu: { emoji: '[[feiticos/chuva-de-estrelas]]', titulo: { 'pt-PT': 'De volta ao céu', 'pt-BR': 'De volta ao céu' } },
  torre: { emoji: '[[cenas/topo-da-torre]]', titulo: { 'pt-PT': 'O novo morador da torre', 'pt-BR': 'O novo morador da torre' } },
  fuga: { emoji: '[[inimigos/dragao]]', titulo: { 'pt-PT': 'A fuga do dragãozinho', 'pt-BR': 'A fuga do dragãozinho' } },
};

/** Maneiras de atravessar o buraco do quinto andar: cada escola tem a sua, e todos podem saltar. */
const TRAVESSIAS: EscolhaLivro[] = [
  {
    se: { tem: ['fogo'] },
    texto: {
      'pt-PT': '🔥 Criar uma corrente de ar quente para voar',
      'pt-BR': '🔥 Criar uma corrente de ar quente para voar',
    },
    destino: 'abismo_fogo',
  },
  {
    se: { tem: ['gelo'] },
    texto: { 'pt-PT': '❄️ Fazer uma ponte de gelo', 'pt-BR': '❄️ Fazer uma ponte de gelo' },
    destino: 'abismo_gelo',
  },
  {
    se: { tem: ['natureza'] },
    texto: {
      'pt-PT': '🌱 Fazer crescer uma ponte de raízes',
      'pt-BR': '🌱 Fazer crescer uma ponte de raízes',
    },
    destino: 'abismo_natureza',
  },
  {
    se: { tem: ['estrelas'] },
    texto: { 'pt-PT': '✨ Fazer uma ponte de luz', 'pt-BR': '✨ Fazer uma ponte de luz' },
    destino: 'abismo_estrelas',
  },
  {
    texto: {
      'pt-PT': '⚡ Saltar com um impulso mágico (Poder)',
      'pt-BR': '⚡ Pular com um impulso mágico (Poder)',
    },
    destino: 'abismo_salto',
  },
];

/** Maneiras de acalmar o dragãozinho que servem com ou sem susto. */
const ACALMAR_COM_ITEM: EscolhaLivro[] = [
  {
    se: { tem: ['cancao'] },
    texto: { 'pt-PT': 'Cantar a canção das estrelas', 'pt-BR': 'Cantar a canção das estrelas' },
    destino: 'calmo_cancao',
  },
  {
    se: { tem: ['cha'] },
    texto: { 'pt-PT': 'Oferecer o chá calmante', 'pt-BR': 'Oferecer o chá calmante' },
    destino: 'calmo_cha',
  },
];

const CONVIDAR: EscolhaLivro = {
  texto: {
    'pt-PT': 'Convidar o dragãozinho para morar na torre',
    'pt-BR': 'Convidar o dragãozinho para morar na torre',
  },
  destino: 'fim_torre',
};

/**
 * A Torre Encantada, em livro-jogo. "{nome}" vira o nome do personagem e "{escola}" o tipo de mago.
 *
 * Em cada andar há mais de uma maneira de passar (lutar, resolver um puzzle, usar a magia da escola), e o que
 * o mago consegue pelo caminho (o Livro amigo, o chá, a canção, o pedaço da estrela) muda o topo da torre:
 * um Golem vencido à força assusta o dragãozinho, e só quem achou o pedaço consegue mandar a estrela de volta ao céu.
 */
const PONTOS: Record<string, Ponto<NomeHabilidade>> = {
  hall: {
    id: 'hall',
    emoji: '[[cenas/hall]]',
    texto: {
      'pt-PT':
        '{Nome}, aprendiz de {escola}, chega ao grande hall da Torre Encantada. O Mestre dos Magos está preocupado: «Ontem caiu uma estrela no topo da torre e a magia ficou toda baralhada! Os livros voam, as plantas crescem sozinhas e as escadas mudam de lugar. Sobe até ao topo e descobre o que se passa. Os teus feitiços vão ajudar-te!»',
      'pt-BR':
        '{Nome}, aprendiz de {escola}, chega ao grande hall da Torre Encantada. O Mestre dos Magos está preocupado: «Ontem caiu uma estrela no topo da torre e a magia ficou toda bagunçada! Os livros voam, as plantas crescem sozinhas e as escadas trocam de lugar. Suba até o topo e descubra o que está acontecendo. Seus feitiços vão ajudar você!»',
    },
    escolhas: [{ texto: SUBIR, destino: 'biblioteca' }],
  },

  // ---------- 1.º andar: biblioteca ----------
  biblioteca: {
    id: 'biblioteca',
    emoji: '[[cenas/biblioteca]]',
    texto: {
      'pt-PT':
        'No primeiro andar fica a biblioteca, e está uma loucura! Os livros voam pelo ar. Um deles, o Livro Mordilhão, vem a bater as capas na direção {doNome}!',
      'pt-BR':
        'No primeiro andar fica a biblioteca, e está uma loucura! Os livros voam pelo ar. Um deles, o Livro Mordilhão, vem batendo as capas na direção {doNome}!',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'livro', aoVencer: 'estudo' },
    escolhas: [
      {
        texto: { 'pt-PT': '📖 Olhar para o desenho da capa', 'pt-BR': '📖 Olhar o desenho da capa' },
        destino: 'livro_capa',
      },
    ],
  },
  livro_capa: {
    id: 'livro_capa',
    emoji: '[[inimigos/livro-mordilhao]]',
    texto: {
      'pt-PT':
        'Na capa do Livro Mordilhão há um desenho e, por baixo, um espaço em branco. O livro só quer que alguém acabe de escrever o seu título!',
      'pt-BR':
        'Na capa do Livro Mordilhão há um desenho e, embaixo, um espaço em branco. O livro só quer que alguém termine de escrever o título dele!',
    },
    desafio: {
      tipo: 'escrever',
      palavras: [2450, 2440, 3129, 2611, 2549, 2572, 3329, 3244, 5563, 25016, 38024],
      enunciado: {
        'pt-PT': 'Escreve o nome do desenho na capa do livro.',
        'pt-BR': 'Escreva o nome do desenho na capa do livro.',
      },
      sucesso: 'livro_amigo',
      falha: 'livro_zangado',
    },
  },
  livro_amigo: {
    id: 'livro_amigo',
    emoji: '[[inimigos/livro-mordilhao]]',
    texto: {
      'pt-PT':
        'O Livro Mordilhão fecha a boca, ronrona como um gato e pousa no ombro {doNome}. Depois abre-se numa página que diz: «A estrela partiu-se ao cair. Um pedaço dela brilha no fundo de um buraco.»',
      'pt-BR':
        'O Livro Mordilhão fecha a boca, ronrona como um gato e pousa no ombro {doNome}. Depois se abre em uma página que diz: «A estrela se quebrou ao cair. Um pedaço dela brilha no fundo de um buraco.»',
    },
    ganha: ['livro'],
    escolhas: [{ texto: SEGUIR, destino: 'estudo' }],
  },
  livro_zangado: {
    id: 'livro_zangado',
    emoji: '[[inimigos/livro-mordilhao]]',
    texto: {
      'pt-PT': 'Título errado! O Livro Mordilhão fica furioso e avança a bater as capas!',
      'pt-BR': 'Título errado! O Livro Mordilhão fica furioso e avança batendo as capas!',
    },
    luta: { inimigo: 'livro', aoVencer: 'estudo' },
  },
  estudo: {
    id: 'estudo',
    emoji: '[[cenas/estudo]]',
    texto: {
      'pt-PT':
        'Depois da confusão, um livro velho cai aberto aos pés {doNome}. Lá dentro há feitiços de outras escolas de magia! Um bom mago aprende sempre algo novo.',
      'pt-BR':
        'Depois da confusão, um livro velho cai aberto aos pés {doNome}. Lá dentro há feitiços de outras escolas de magia! Um bom mago aprende sempre algo novo.',
    },
    aprender: { proxima: 'estufa' },
  },

  // ---------- 2.º andar: estufa ----------
  estufa: {
    id: 'estufa',
    emoji: '[[cenas/estufa]]',
    texto: {
      'pt-PT':
        'No segundo andar fica a estufa. Trepadeiras gigantes taparam a porta da escada! É preciso abrir caminho.',
      'pt-BR':
        'No segundo andar fica a estufa. Trepadeiras gigantes taparam a porta da escada! É preciso abrir caminho.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        se: { tem: ['fogo'] },
        texto: {
          'pt-PT': '🔥 Queimar as trepadeiras com fogo',
          'pt-BR': '🔥 Queimar as trepadeiras com fogo',
        },
        destino: 'estufa_fogo',
      },
      {
        se: { tem: ['gelo'] },
        texto: {
          'pt-PT': '❄️ Congelar as trepadeiras e parti-las',
          'pt-BR': '❄️ Congelar as trepadeiras e quebrá-las',
        },
        destino: 'estufa_gelo',
      },
      {
        se: { tem: ['natureza'] },
        texto: {
          'pt-PT': '🌿 Pedir às plantas que abram caminho',
          'pt-BR': '🌿 Pedir às plantas que abram caminho',
        },
        destino: 'estufa_natureza',
      },
      {
        se: { tem: ['estrelas'] },
        texto: {
          'pt-PT': '⭐ Iluminar a porta escondida',
          'pt-BR': '⭐ Iluminar a porta escondida',
        },
        destino: 'estufa_estrelas',
      },
      {
        texto: {
          'pt-PT': '📚 Procurar um segredo (Sabedoria)',
          'pt-BR': '📚 Procurar um segredo (Sabedoria)',
        },
        destino: 'estufa_procura',
      },
    ],
  },
  estufa_fogo: {
    id: 'estufa_fogo',
    emoji: '[[feiticos/chama]]',
    texto: {
      'pt-PT':
        '{Nome} estala os dedos e uma chama bem pequenina salta para as trepadeiras. Fuuuum! Elas encolhem e a porta fica livre, sem estragar nenhuma flor.',
      'pt-BR':
        '{Nome} estala os dedos e uma chama bem pequenininha pula para as trepadeiras. Fuuuum! Elas encolhem e a porta fica livre, sem estragar nenhuma flor.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'laboratorio' }],
  },
  estufa_gelo: {
    id: 'estufa_gelo',
    emoji: '[[feiticos/estilhaco-de-gelo]]',
    texto: {
      'pt-PT':
        '{Nome} sopra um vento gelado. As trepadeiras ficam duras como vidro e, com um toque, partem-se em mil pedacinhos a tilintar. A porta está livre!',
      'pt-BR':
        '{Nome} sopra um vento gelado. As trepadeiras ficam duras como vidro e, com um toque, quebram em mil pedacinhos tilintando. A porta está livre!',
    },
    escolhas: [{ texto: SEGUIR, destino: 'laboratorio' }],
  },
  estufa_natureza: {
    id: 'estufa_natureza',
    emoji: '[[cenas/broto]]',
    texto: {
      'pt-PT':
        '{Nome} fala baixinho com as plantas. As trepadeiras percebem que estavam a atrapalhar, desenrolam-se devagar e até fazem uma vénia. A porta está livre!',
      'pt-BR':
        '{Nome} fala baixinho com as plantas. As trepadeiras percebem que estavam atrapalhando, se desenrolam devagar e até fazem uma reverência. A porta está livre!',
    },
    escolhas: [{ texto: SEGUIR, destino: 'laboratorio' }],
  },
  estufa_estrelas: {
    id: 'estufa_estrelas',
    emoji: '[[interface/lampada-dica]]',
    texto: {
      'pt-PT':
        '{Nome} faz brilhar uma estrelinha no ar. A luz mostra uma porta secreta atrás das folhas, uma passagem que ninguém via. Está livre o caminho!',
      'pt-BR':
        '{Nome} faz brilhar uma estrelinha no ar. A luz mostra uma porta secreta atrás das folhas, uma passagem que ninguém via. O caminho está livre!',
    },
    escolhas: [{ texto: SEGUIR, destino: 'laboratorio' }],
  },
  estufa_procura: {
    id: 'estufa_procura',
    emoji: '[[cenas/lupa]]',
    texto: {
      'pt-PT': '{Nome} espreita entre as folhas e procura uma alavanca ou um segredo. Pensa bem!',
      'pt-BR': '{Nome} espia entre as folhas e procura uma alavanca ou um segredo. Pense bem!',
    },
    teste: { atributo: 'sabedoria', dificuldade: 10, sucesso: 'estufa_alavanca', falha: 'estufa_planta' },
  },
  estufa_alavanca: {
    id: 'estufa_alavanca',
    emoji: '[[cenas/gancho]]',
    texto: {
      'pt-PT': 'Achou! Uma alavanca escondida atrás de um vaso. Clic! As trepadeiras recolhem-se.',
      'pt-BR': 'Achou! Uma alavanca escondida atrás de um vaso. Clic! As trepadeiras se recolhem.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'laboratorio' }],
  },
  estufa_planta: {
    id: 'estufa_planta',
    emoji: '[[inimigos/planta-comilona]]',
    texto: {
      'pt-PT': 'Ups! Com o barulho, uma planta comilona acordou e abriu a boca enorme!',
      'pt-BR': 'Ops! Com o barulho, uma planta comilona acordou e abriu a boca enorme!',
    },
    luta: { inimigo: 'planta', aoVencer: 'estufa_alavanca' },
  },

  // ---------- 3.º andar: laboratório ----------
  laboratorio: {
    id: 'laboratorio',
    emoji: '[[cenas/laboratorio]]',
    texto: {
      'pt-PT':
        'No terceiro andar fica o laboratório, com poções a borbulhar e ninguém por perto. {Nome} encontra uma caminha quentinha e uma chávena de chá mágico. Descansa um pouco e recupera a vida e a energia mágica.',
      'pt-BR':
        'No terceiro andar fica o laboratório, com poções borbulhando e ninguém por perto. {Nome} encontra uma caminha quentinha e uma xícara de chá mágico. Descansa um pouco e recupera a vida e a energia mágica.',
    },
    recompensa: { curar: true },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        texto: {
          'pt-PT': '🧪 Preparar um chá calmante no caldeirão',
          'pt-BR': '🧪 Preparar um chá calmante no caldeirão',
        },
        destino: 'caldeirao',
      },
      { texto: SUBIR, destino: 'corredor' },
    ],
  },
  caldeirao: {
    id: 'caldeirao',
    emoji: '[[cenas/laboratorio]]',
    texto: {
      'pt-PT':
        'Ao lado do caldeirão há uma receita: «Chá calmante: acalma qualquer criatura assustada.» É preciso deitar os cristais certos, nem mais nem menos!',
      'pt-BR':
        'Ao lado do caldeirão há uma receita: «Chá calmante: acalma qualquer criatura assustada.» É preciso colocar os cristais certos, nem mais nem menos!',
    },
    desafio: {
      tipo: 'conta',
      operacao: 'soma',
      enunciado: {
        'pt-PT': 'A receita pede {a} cristais azuis e {b} cristais verdes. Quantos cristais são ao todo?',
        'pt-BR': 'A receita pede {a} cristais azuis e {b} cristais verdes. Quantos cristais são ao todo?',
      },
      sucesso: 'cha_certo',
      falha: 'cha_errado',
    },
  },
  cha_certo: {
    id: 'cha_certo',
    emoji: '[[interface/pocao]]',
    texto: {
      'pt-PT':
        'O caldeirão solta um fumo cor-de-rosa com cheiro a camomila. Ficou perfeito! {Nome} enche um frasquinho de chá calmante e guarda-o na capa.',
      'pt-BR':
        'O caldeirão solta uma fumaça cor-de-rosa com cheiro de camomila. Ficou perfeito! {Nome} enche um frasquinho de chá calmante e guarda na capa.',
    },
    ganha: ['cha'],
    escolhas: [{ texto: SUBIR, destino: 'corredor' }],
  },
  cha_errado: {
    id: 'cha_errado',
    emoji: '[[interface/explosao]]',
    texto: {
      'pt-PT':
        'Puf! O caldeirão cospe uma nuvem de fuligem e {nome} fica com a cara toda preta. O chá estragou-se, mas ninguém se magoou.',
      'pt-BR':
        'Puf! O caldeirão cospe uma nuvem de fuligem e {nome} fica com o rosto todo preto. O chá estragou, mas ninguém se machucou.',
    },
    escolhas: [{ texto: SUBIR, destino: 'corredor' }],
  },

  // ---------- 4.º andar: corredor do fantasma ----------
  corredor: {
    id: 'corredor',
    emoji: '[[cenas/corredor]]',
    texto: {
      'pt-PT':
        'No quarto andar, o corredor está cheio de névoa. De repente, um fantasma aparece a rir: «Buuu! Ninguém passa sem brincar comigo!»',
      'pt-BR':
        'No quarto andar, o corredor está cheio de névoa. De repente, um fantasma aparece rindo: «Buuu! Ninguém passa sem brincar comigo!»',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'fantasma', aoVencer: 'abismo' },
    escolhas: [
      {
        texto: { 'pt-PT': 'Brincar às adivinhas com o fantasma', 'pt-BR': 'Brincar de adivinhas com o fantasma' },
        destino: 'adivinha',
      },
    ],
  },
  adivinha: {
    id: 'adivinha',
    emoji: '[[inimigos/fantasma-brincalhao]]',
    texto: {
      'pt-PT': 'O fantasma dá uma cambalhota no ar: «Adivinhas! Adoro adivinhas! Vê lá se sabes esta.»',
      'pt-BR': 'O fantasma dá uma cambalhota no ar: «Adivinhas! Adoro adivinhas! Vamos ver se você sabe esta.»',
    },
    desafio: {
      tipo: 'enigma',
      enunciado: { 'pt-PT': 'A adivinha do fantasma:', 'pt-BR': 'A adivinha do fantasma:' },
      enigmas: [
        {
          pergunta: {
            'pt-PT': 'Tem folhas mas não é árvore, tem capa mas não é mago. O que é?',
            'pt-BR': 'Tem folhas, mas não é árvore; tem capa, mas não é mago. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'Um livro', 'pt-BR': 'Um livro' },
            { 'pt-PT': 'Uma flor', 'pt-BR': 'Uma flor' },
            { 'pt-PT': 'Uma floresta', 'pt-BR': 'Uma floresta' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Aparece de noite sem ser chamada e some-se de dia sem ser roubada. O que é?',
            'pt-BR': 'Aparece de noite sem ser chamada e some de dia sem ser roubada. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'Uma estrela', 'pt-BR': 'Uma estrela' },
            { 'pt-PT': 'Uma vela', 'pt-BR': 'Uma vela' },
            { 'pt-PT': 'Uma coruja', 'pt-BR': 'Uma coruja' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Sobe e desce sem nunca sair do lugar. O que é?',
            'pt-BR': 'Sobe e desce sem nunca sair do lugar. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'Uma escada', 'pt-BR': 'Uma escada' },
            { 'pt-PT': 'Um pássaro', 'pt-BR': 'Um pássaro' },
            { 'pt-PT': 'Uma bola', 'pt-BR': 'Uma bola' },
          ],
          certa: 0,
        },
        {
          pergunta: {
            'pt-PT': 'Quanto maior é, menos se vê. O que é?',
            'pt-BR': 'Quanto maior é, menos se vê. O que é?',
          },
          opcoes: [
            { 'pt-PT': 'A escuridão', 'pt-BR': 'A escuridão' },
            { 'pt-PT': 'Um gigante', 'pt-BR': 'Um gigante' },
            { 'pt-PT': 'Uma torre', 'pt-BR': 'Uma torre' },
          ],
          certa: 0,
        },
      ],
      sucesso: 'fantasma_amigo',
      falha: 'fantasma_zangado',
    },
  },
  fantasma_amigo: {
    id: 'fantasma_amigo',
    emoji: '[[inimigos/fantasma-brincalhao]]',
    texto: {
      'pt-PT':
        '«Acertaste!» O fantasma rodopia de alegria. «Fui o astrónomo desta torre. Vou ensinar-te a canção de embalar das estrelas: quem vem do céu acalma-se ao ouvi-la.» E canta baixinho, até {nome} a saber de cor.',
      'pt-BR':
        '«Acertou!» O fantasma rodopia de alegria. «Eu fui o astrônomo desta torre. Vou ensinar a você a canção de ninar das estrelas: quem vem do céu se acalma ao ouvi-la.» E canta baixinho, até {nome} saber a canção de cor.',
    },
    ganha: ['cancao'],
    escolhas: [{ texto: SUBIR, destino: 'abismo' }],
  },
  fantasma_zangado: {
    id: 'fantasma_zangado',
    emoji: '[[inimigos/fantasma-brincalhao]]',
    texto: {
      'pt-PT': '«Errado! Então vamos brincar às lutas!», ri o fantasma, a atirar almofadas de névoa.',
      'pt-BR': '«Errado! Então vamos brincar de luta!», ri o fantasma, jogando almofadas de névoa.',
    },
    luta: { inimigo: 'fantasma', aoVencer: 'abismo' },
  },

  // ---------- 5.º andar: o buraco ----------
  abismo: {
    id: 'abismo',
    emoji: '[[cenas/abismo]]',
    texto: {
      'pt-PT':
        'No quinto andar, o chão da escada desabou! Há um buraco enorme e, do outro lado, está a porta que leva ao topo. Lá no fundo do buraco, algo pequenino brilha.',
      'pt-BR':
        'No quinto andar, o chão da escada desabou! Há um buraco enorme e, do outro lado, está a porta que leva ao topo. Lá no fundo do buraco, algo pequenininho brilha.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        se: { tem: ['livro'] },
        texto: {
          'pt-PT': '📖 Descer ao fundo do buraco com a luz do Livro',
          'pt-BR': '📖 Descer ao fundo do buraco com a luz do Livro',
        },
        destino: 'fundo_livro',
      },
      {
        se: { naoTem: ['livro'] },
        texto: {
          'pt-PT': 'Descer ao fundo do buraco, às escuras (Sabedoria)',
          'pt-BR': 'Descer ao fundo do buraco, no escuro (Sabedoria)',
        },
        destino: 'descer',
      },
      ...TRAVESSIAS,
    ],
  },
  fundo_livro: {
    id: 'fundo_livro',
    emoji: '[[inimigos/livro-mordilhao]]',
    texto: {
      'pt-PT':
        'O Livro Mordilhão abre-se e as suas páginas brilham como uma lanterna. {Nome} desce em segurança e encontra, entre as pedras, um pedaço da estrela, ainda morno!',
      'pt-BR':
        'O Livro Mordilhão se abre e as páginas dele brilham como uma lanterna. {Nome} desce em segurança e encontra, entre as pedras, um pedaço da estrela, ainda morno!',
    },
    ganha: ['pedaco'],
    escolhas: [{ texto: { 'pt-PT': 'Subir de volta', 'pt-BR': 'Subir de volta' }, destino: 'abismo_volta' }],
  },
  descer: {
    id: 'descer',
    emoji: '[[cenas/abismo]]',
    texto: {
      'pt-PT': '{Nome} desce às apalpadelas pela parede do buraco, à procura de sítios seguros para pôr os pés. Atenção!',
      'pt-BR': '{Nome} desce tateando pela parede do buraco, procurando lugares seguros para pôr os pés. Atenção!',
    },
    teste: { atributo: 'sabedoria', dificuldade: 11, sucesso: 'fundo_buraco', falha: 'fundo_gargula' },
  },
  fundo_gargula: {
    id: 'fundo_gargula',
    emoji: '[[inimigos/gargula]]',
    texto: {
      'pt-PT': 'Uma pedra solta-se e cai com estrondo. No fundo do buraco, uma gárgula de pedra acorda, toda zangada!',
      'pt-BR': 'Uma pedra se solta e cai com estrondo. No fundo do buraco, uma gárgula de pedra acorda, toda zangada!',
    },
    luta: { inimigo: 'gargula', aoVencer: 'fundo_buraco' },
  },
  fundo_buraco: {
    id: 'fundo_buraco',
    emoji: '[[interface/estrela]]',
    texto: {
      'pt-PT':
        'No fundo do buraco, entre as pedras, {nome} encontra um pedaço da estrela, ainda morno! Brilha como uma brasa dourada.',
      'pt-BR':
        'No fundo do buraco, entre as pedras, {nome} encontra um pedaço da estrela, ainda morno! Ele brilha como uma brasa dourada.',
    },
    ganha: ['pedaco'],
    escolhas: [{ texto: { 'pt-PT': 'Subir de volta', 'pt-BR': 'Subir de volta' }, destino: 'abismo_volta' }],
  },
  abismo_volta: {
    id: 'abismo_volta',
    emoji: '[[cenas/abismo]]',
    texto: {
      'pt-PT':
        '{Nome} trepa de volta até à beira do buraco, com o pedaço da estrela bem guardado. Agora falta atravessar para o outro lado!',
      'pt-BR':
        '{Nome} sobe de volta até a beira do buraco, com o pedaço da estrela bem guardado. Agora falta atravessar para o outro lado!',
    },
    pergunta: O_QUE_FAZER,
    escolhas: TRAVESSIAS,
  },
  abismo_fogo: {
    id: 'abismo_fogo',
    emoji: '[[cenas/balao]]',
    texto: {
      'pt-PT':
        '{Nome} acende uma fogueira mágica e o ar quente sobe, sobe, sobe! Leve como uma pena, {nome} flutua até ao outro lado.',
      'pt-BR':
        '{Nome} acende uma fogueira mágica e o ar quente sobe, sobe, sobe! Leve como uma pena, {nome} flutua até o outro lado.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'topo' }],
  },
  abismo_gelo: {
    id: 'abismo_gelo',
    emoji: '[[cenas/ponte]]',
    texto: {
      'pt-PT':
        '{Nome} aponta o cajado e o gelo cresce, cresce, até formar uma ponte brilhante e escorregadia. Deslizar por ela é uma festa!',
      'pt-BR':
        '{Nome} aponta o cajado e o gelo cresce, cresce, até formar uma ponte brilhante e escorregadia. Deslizar por ela é uma festa!',
    },
    escolhas: [{ texto: SEGUIR, destino: 'topo' }],
  },
  abismo_natureza: {
    id: 'abismo_natureza',
    emoji: '[[cenas/arvore]]',
    texto: {
      'pt-PT':
        '{Nome} planta uma sementinha no chão e, num instante, raízes grossas e fortes crescem e formam uma ponte cheia de florzinhas.',
      'pt-BR':
        '{Nome} planta uma sementinha no chão e, num instante, raízes grossas e fortes crescem e formam uma ponte cheia de florzinhas.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'topo' }],
  },
  abismo_estrelas: {
    id: 'abismo_estrelas',
    emoji: '[[cenas/arco-iris]]',
    texto: {
      'pt-PT':
        '{Nome} risca o ar com o cajado e deixa um rasto de estrelas. A luz fica firme como pedra e forma uma ponte para atravessar.',
      'pt-BR':
        '{Nome} risca o ar com o cajado e deixa um rastro de estrelas. A luz fica firme como pedra e forma uma ponte para atravessar.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'topo' }],
  },
  abismo_salto: {
    id: 'abismo_salto',
    emoji: '[[cenas/raio]]',
    texto: {
      'pt-PT': '{Nome} junta toda a magia nas pernas, respira fundo e... salta por cima do buraco!',
      'pt-BR': '{Nome} junta toda a magia nas pernas, respira fundo e... pula por cima do buraco!',
    },
    teste: { atributo: 'poder', dificuldade: 11, sucesso: 'abismo_saltou', falha: 'abismo_gargula' },
  },
  abismo_saltou: {
    id: 'abismo_saltou',
    emoji: '[[cenas/acrobata]]',
    texto: {
      'pt-PT': 'Que salto! {Nome} aterra do outro lado, com a capa a esvoaçar.',
      'pt-BR': 'Que pulo! {Nome} aterrissa do outro lado, com a capa esvoaçando.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'topo' }],
  },
  abismo_gargula: {
    id: 'abismo_gargula',
    emoji: '[[inimigos/gargula]]',
    texto: {
      'pt-PT':
        'Quase! {Nome} agarra-se à borda e uma gárgula de pedra acorda, toda zangada por ter sido incomodada!',
      'pt-BR':
        'Quase! {Nome} se agarra na borda e uma gárgula de pedra acorda, toda zangada por ter sido incomodada!',
    },
    luta: { inimigo: 'gargula', aoVencer: 'abismo_saltou' },
  },

  // ---------- topo: o Golem ----------
  topo: {
    id: 'topo',
    emoji: '[[inimigos/golem-guardiao]]',
    texto: {
      'pt-PT':
        'No topo da torre, uma luz dourada enche a sala. À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra: «Ninguém se aproxima da estrela!» No peito dele brilham runas com números, e uma delas está apagada.',
      'pt-BR':
        'No topo da torre, uma luz dourada enche a sala. À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra: «Ninguém se aproxima da estrela!» No peito dele brilham runas com números, e uma delas está apagada.',
    },
    pergunta: O_QUE_FAZER,
    luta: { inimigo: 'golem', aoVencer: 'golem_caiu' },
    escolhas: [
      {
        texto: { 'pt-PT': '🧠 Acender a runa apagada do Golem', 'pt-BR': '🧠 Acender a runa apagada do Golem' },
        destino: 'runas',
      },
    ],
  },
  runas: {
    id: 'runas',
    emoji: '[[inimigos/golem-guardiao]]',
    texto: {
      'pt-PT': 'As runas seguem uma sequência. Se a runa apagada acender com o número certo, o Golem volta a dormir!',
      'pt-BR': 'As runas seguem uma sequência. Se a runa apagada acender com o número certo, o Golem volta a dormir!',
    },
    desafio: {
      tipo: 'sequencia',
      enunciado: { 'pt-PT': 'Que número falta nas runas do Golem?', 'pt-BR': 'Que número falta nas runas do Golem?' },
      sucesso: 'golem_dorme',
      falha: 'golem_acorda',
    },
  },
  golem_dorme: {
    id: 'golem_dorme',
    emoji: '[[inimigos/golem-guardiao]]',
    texto: {
      'pt-PT':
        'A runa acende-se. O Golem Guardião boceja como uma montanha, senta-se devagarinho e adormece sem fazer barulho. O caminho está livre!',
      'pt-BR':
        'A runa se acende. O Golem Guardião boceja como uma montanha, senta devagarinho e adormece sem fazer barulho. O caminho está livre!',
    },
    escolhas: [{ texto: { 'pt-PT': 'Entrar em silêncio', 'pt-BR': 'Entrar em silêncio' }, destino: 'dragao' }],
  },
  golem_acorda: {
    id: 'golem_acorda',
    emoji: '[[inimigos/golem-guardiao]]',
    texto: {
      'pt-PT': 'Número errado! As runas piscam a vermelho e o Golem levanta os punhos de pedra!',
      'pt-BR': 'Número errado! As runas piscam em vermelho e o Golem levanta os punhos de pedra!',
    },
    luta: { inimigo: 'golem', aoVencer: 'golem_caiu' },
  },
  golem_caiu: {
    id: 'golem_caiu',
    emoji: '[[interface/explosao]]',
    texto: {
      'pt-PT':
        'CABRUM! O Golem desfaz-se em pedrinhas, com um estrondo que faz tremer a torre inteira. Atrás da porta, ouve-se um guincho assustado...',
      'pt-BR':
        'CABRUM! O Golem se desfaz em pedrinhas, com um estrondo que faz a torre inteira tremer. Atrás da porta, dá para ouvir um guincho assustado...',
    },
    ganha: ['barulho'],
    escolhas: [{ texto: { 'pt-PT': 'Abrir a porta', 'pt-BR': 'Abrir a porta' }, destino: 'dragao_medo' }],
  },

  // ---------- o dragãozinho ----------
  dragao: {
    id: 'dragao',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        '{Nome} entra em bicos de pés. Junto à janela está a estrela caída e, enroscado nela, um dragãozinho de estrelas a tremer de medo. Foi ele que, sem querer, baralhou toda a magia da torre! Como vai {nome} acalmá-lo?',
      'pt-BR':
        '{Nome} entra na ponta dos pés. Perto da janela está a estrela caída e, enroscado nela, um dragãozinho de estrelas tremendo de medo. Foi ele que, sem querer, bagunçou toda a magia da torre! Como {nome} vai acalmá-lo?',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        se: { tem: ['fogo'] },
        texto: { 'pt-PT': '🔥 Acender uma fogueirinha quente', 'pt-BR': '🔥 Acender uma fogueirinha quentinha' },
        destino: 'calmo_fogo',
      },
      {
        se: { tem: ['gelo'] },
        texto: { 'pt-PT': '❄️ Fazer cair neve macia', 'pt-BR': '❄️ Fazer cair neve macia' },
        destino: 'calmo_gelo',
      },
      {
        se: { tem: ['natureza'] },
        texto: {
          'pt-PT': '🌿 Fazer crescer uma caminha de folhas',
          'pt-BR': '🌿 Fazer crescer uma caminha de folhas',
        },
        destino: 'calmo_natureza',
      },
      {
        se: { tem: ['estrelas'] },
        texto: { 'pt-PT': '⭐ Fazer dançar estrelinhas no ar', 'pt-BR': '⭐ Fazer dançar estrelinhas no ar' },
        destino: 'calmo_estrelas',
      },
      ...ACALMAR_COM_ITEM,
      {
        texto: { 'pt-PT': '🤗 Falar baixinho e fazer festinhas', 'pt-BR': '🤗 Falar baixinho e fazer carinho' },
        destino: 'calmo_carinho',
      },
    ],
  },
  dragao_medo: {
    id: 'dragao_medo',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        'Com o estrondo, o dragãozinho de estrelas que estava escondido na sala entrou em pânico! Voa às voltas, bate nas paredes e a estrela caída pisca, quase a apagar-se. Foi ele que, sem querer, baralhou a magia da torre. Assim tão assustado, já não liga a feitiços!',
      'pt-BR':
        'Com o estrondo, o dragãozinho de estrelas que estava escondido na sala entrou em pânico! Ele voa em círculos, bate nas paredes, e a estrela caída pisca, quase apagando. Foi ele que, sem querer, bagunçou a magia da torre. Assustado desse jeito, ele nem liga para feitiços!',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      ...ACALMAR_COM_ITEM,
      {
        texto: { 'pt-PT': 'Aproximar-se devagar, sem magia (Sabedoria)', 'pt-BR': 'Chegar perto devagar, sem magia (Sabedoria)' },
        destino: 'aproximar',
      },
    ],
  },
  aproximar: {
    id: 'aproximar',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT': '{Nome} guarda o cajado, baixa-se e estende a mão aberta, sem dizer nada. É preciso muita calma...',
      'pt-BR': '{Nome} guarda o cajado, se abaixa e estende a mão aberta, sem dizer nada. É preciso muita calma...',
    },
    teste: { atributo: 'sabedoria', dificuldade: 12, sucesso: 'calmo_carinho', falha: 'fim_fuga' },
  },
  calmo_fogo: {
    id: 'calmo_fogo',
    emoji: '[[feiticos/chama]]',
    texto: {
      'pt-PT':
        '{Nome} acende uma fogueirinha, quentinha como uma noite de acampamento. O dragãozinho aquece-se, sorri e deixa de tremer.',
      'pt-BR':
        '{Nome} acende uma fogueirinha, quentinha como uma noite de acampamento. O dragãozinho se aquece, sorri e para de tremer.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_gelo: {
    id: 'calmo_gelo',
    emoji: '[[feiticos/congelar]]',
    texto: {
      'pt-PT':
        '{Nome} faz cair uma neve macia e brilhante. O dragãozinho ri, apanha os flocos com as patinhas e acalma-se.',
      'pt-BR':
        '{Nome} faz cair uma neve macia e brilhante. O dragãozinho ri, pega os flocos com as patinhas e se acalma.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_natureza: {
    id: 'calmo_natureza',
    emoji: '[[feiticos/folhas-curativas]]',
    texto: {
      'pt-PT':
        '{Nome} faz crescer uma caminha de folhas macias e flores cheirosas. O dragãozinho deita-se nela, boceja e deixa de ter medo.',
      'pt-BR':
        '{Nome} faz crescer uma caminha de folhas macias e flores cheirosas. O dragãozinho se deita nela, boceja e para de ter medo.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_estrelas: {
    id: 'calmo_estrelas',
    emoji: '[[feiticos/chuva-de-estrelas]]',
    texto: {
      'pt-PT':
        '{Nome} faz dançar pequenas estrelinhas no ar. O dragãozinho reconhece aquelas luzes, é como estar em casa, e acalma-se.',
      'pt-BR':
        '{Nome} faz dançar pequenas estrelinhas no ar. O dragãozinho reconhece aquelas luzes, é como estar em casa, e se acalma.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_cancao: {
    id: 'calmo_cancao',
    emoji: '[[interface/faisca-magica]]',
    texto: {
      'pt-PT':
        '{Nome} canta baixinho a canção de embalar das estrelas. O dragãozinho fica quieto, de orelhas no ar: é a canção da sua casa! Pousa devagar e encosta a cabeça ao ombro {doNome}.',
      'pt-BR':
        '{Nome} canta baixinho a canção de ninar das estrelas. O dragãozinho fica quieto, de orelhas em pé: é a canção da casa dele! Ele pousa devagar e encosta a cabeça no ombro {doNome}.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_cha: {
    id: 'calmo_cha',
    emoji: '[[interface/pocao]]',
    texto: {
      'pt-PT':
        '{Nome} deita o chá calmante num pires. O dragãozinho cheira, prova com a ponta da língua e bebe tudo. Um soluço de faíscas, um suspiro... e fica calminho.',
      'pt-BR':
        '{Nome} coloca o chá calmante em um pires. O dragãozinho cheira, prova com a ponta da língua e bebe tudo. Um soluço de faíscas, um suspiro... e ele fica calminho.',
    },
    perde: ['cha'],
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },
  calmo_carinho: {
    id: 'calmo_carinho',
    emoji: '[[cenas/abraco]]',
    texto: {
      'pt-PT':
        '{Nome} senta-se ao lado do dragãozinho, fala baixinho e faz-lhe festinhas na cabeça. Sem magia nenhuma, ele deixa de ter medo.',
      'pt-BR':
        '{Nome} senta ao lado do dragãozinho, fala baixinho e faz carinho na cabeça dele. Sem magia nenhuma, ele para de ter medo.',
    },
    escolhas: [{ texto: SEGUIR, destino: 'decisao' }],
  },

  // ---------- a decisão e os finais ----------
  decisao: {
    id: 'decisao',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        'Já calmo, o dragãozinho olha para a estrela caída e depois para o céu, com os olhos cheios de saudade. A estrela tem uma racha: falta-lhe um pedaço e, assim, não consegue voar.',
      'pt-BR':
        'Já calmo, o dragãozinho olha para a estrela caída e depois para o céu, com os olhos cheios de saudade. A estrela tem uma rachadura: falta um pedaço e, assim, ela não consegue voar.',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        se: { tem: ['pedaco'] },
        texto: {
          'pt-PT': '⭐ Consertar a estrela com o pedaço encontrado',
          'pt-BR': '⭐ Consertar a estrela com o pedaço encontrado',
        },
        destino: 'conserto',
      },
      CONVIDAR,
    ],
  },
  conserto: {
    id: 'conserto',
    emoji: '[[interface/estrela]]',
    texto: {
      'pt-PT': 'O pedaço tem pontas com números, e a estrela também. Só encaixa se a sequência ficar certa!',
      'pt-BR': 'O pedaço tem pontas com números, e a estrela também. Só encaixa se a sequência ficar certa!',
    },
    desafio: {
      tipo: 'sequencia',
      enunciado: {
        'pt-PT': 'Que número falta nas pontas da estrela?',
        'pt-BR': 'Que número falta nas pontas da estrela?',
      },
      sucesso: 'fim_ceu',
      falha: 'conserto_falha',
    },
  },
  conserto_falha: {
    id: 'conserto_falha',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        'O pedaço não encaixou. O dragãozinho encosta o focinho à mão {doNome}, como quem diz: «Tenta outra vez, eu espero.»',
      'pt-BR':
        'O pedaço não encaixou. O dragãozinho encosta o focinho na mão {doNome}, como quem diz: «Tente de novo, eu espero.»',
    },
    escolhas: [
      { texto: { 'pt-PT': 'Tentar outra vez', 'pt-BR': 'Tentar de novo' }, destino: 'conserto' },
      CONVIDAR,
    ],
  },
  fim_ceu: {
    id: 'fim_ceu',
    emoji: '[[feiticos/chuva-de-estrelas]]',
    texto: {
      'pt-PT':
        'Clique! A estrela fica inteira e acende-se como nunca. O dragãozinho lambe a cara {doNome}, salta para cima da estrela e sobe, sobe, até ao céu. A magia da torre volta ao lugar e o Mestre dos Magos aplaude. Desde então, todas as noites, uma estrela pisca o olho {aoNome}.',
      'pt-BR':
        'Clique! A estrela fica inteira e se acende como nunca. O dragãozinho lambe o rosto {doNome}, pula para cima da estrela e sobe, sobe, até o céu. A magia da torre volta ao lugar e o Mestre dos Magos aplaude. Desde então, todas as noites, uma estrela pisca para {nome}.',
    },
    fim: 'ceu',
  },
  fim_torre: {
    id: 'fim_torre',
    emoji: '[[cenas/topo-da-torre]]',
    texto: {
      'pt-PT':
        'O dragãozinho dá uma cambalhota de alegria: fica! O Mestre dos Magos pendura a estrela no topo da torre, como um farol, e a magia volta ao lugar. O dragãozinho ganha uma caminha ao lado do laboratório e um novo trabalho: acender as velas da torre todas as noites, com {nome}.',
      'pt-BR':
        'O dragãozinho dá uma cambalhota de alegria: ele fica! O Mestre dos Magos pendura a estrela no topo da torre, como um farol, e a magia volta ao lugar. O dragãozinho ganha uma caminha ao lado do laboratório e um novo trabalho: acender as velas da torre todas as noites, com {nome}.',
    },
    fim: 'torre',
  },
  fim_fuga: {
    id: 'fim_fuga',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        'O dragãozinho assusta-se ainda mais, agarra a estrela e foge pela janela, noite fora! Sem ele, a magia da torre volta ao lugar e o Mestre dos Magos agradece. Mas {nome} fica a olhar para o céu... Um dragãozinho com tanto medo precisava de um amigo. Haveria outra maneira?',
      'pt-BR':
        'O dragãozinho se assusta ainda mais, agarra a estrela e foge pela janela, noite afora! Sem ele, a magia da torre volta ao lugar e o Mestre dos Magos agradece. Mas {nome} fica olhando para o céu... Um dragãozinho com tanto medo precisava de um amigo. Será que havia outro jeito?',
    },
    fim: 'fuga',
  },
};

export const LIVRO_TORRE_ENCANTADA = livro<NomeHabilidade>({
  id: 'torre-encantada',
  pontos: PONTOS,
  inicial: 'hall',
  finais: FINAIS_MAGO,
  itens: ITENS_MAGO,
});
