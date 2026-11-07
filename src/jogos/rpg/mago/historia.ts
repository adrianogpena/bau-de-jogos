import type { TextoPorIdioma } from '../../../compartilhado/idioma';
import type { CenaMago } from './tipos';

const SUBIR: TextoPorIdioma = { 'pt-PT': 'Subir a escada ➜', 'pt-BR': 'Subir a escada ➜' };
const SEGUIR: TextoPorIdioma = { 'pt-PT': 'Seguir caminho ➜', 'pt-BR': 'Seguir caminho ➜' };
const O_QUE_FAZER: TextoPorIdioma = {
  'pt-PT': 'O que quer fazer {nome}?',
  'pt-BR': 'O que {nome} quer fazer?',
};

/**
 * A Torre Encantada. "{nome}" vira "o herói/a heroína" e "{escola}" o tipo de mago.
 * Nos desafios (estufa, abismo e dragão) cada escola tem a sua solução com magia.
 */
export const CENAS_MAGO: Record<string, CenaMago> = {
  hall: {
    id: 'hall',
    emoji: '[[cenas/hall]]',
    texto: {
      'pt-PT':
        '{Nome}, aprendiz de {escola}, chega ao grande hall da Torre Encantada. O Mestre dos Magos está preocupado: «Ontem caiu uma estrela no topo da torre e a magia ficou toda baralhada! Os livros voam, as plantas crescem sozinhas e as escadas mudam de lugar. Sobe até ao topo e descobre o que se passa. Os teus feitiços vão ajudar-te!»',
      'pt-BR':
        '{Nome}, aprendiz de {escola}, chega ao grande hall da Torre Encantada. O Mestre dos Magos está preocupado: «Ontem caiu uma estrela no topo da torre e a magia ficou toda bagunçada! Os livros voam, as plantas crescem sozinhas e as escadas trocam de lugar. Suba até o topo e descubra o que está acontecendo. Seus feitiços vão ajudar você!»',
    },
    escolhas: [{ texto: SUBIR, proximaCena: 'biblioteca' }],
  },

  biblioteca: {
    id: 'biblioteca',
    emoji: '[[cenas/biblioteca]]',
    texto: {
      'pt-PT':
        'No primeiro andar fica a biblioteca, e está uma loucura! Os livros voam pelo ar. Um deles, o Livro Mordilhão, vem a bater as capas na direção {doNome}!',
      'pt-BR':
        'No primeiro andar fica a biblioteca, e está uma loucura! Os livros voam pelo ar. Um deles, o Livro Mordilhão, vem batendo as capas na direção {doNome}!',
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
        escola: 'fogo',
        texto: {
          'pt-PT': '🔥 Queimar as trepadeiras com fogo',
          'pt-BR': '🔥 Queimar as trepadeiras com fogo',
        },
        proximaCena: 'estufa_fogo',
      },
      {
        escola: 'gelo',
        texto: {
          'pt-PT': '❄️ Congelar as trepadeiras e parti-las',
          'pt-BR': '❄️ Congelar as trepadeiras e quebrá-las',
        },
        proximaCena: 'estufa_gelo',
      },
      {
        escola: 'natureza',
        texto: {
          'pt-PT': '🌿 Pedir às plantas que abram caminho',
          'pt-BR': '🌿 Pedir às plantas que abram caminho',
        },
        proximaCena: 'estufa_natureza',
      },
      {
        escola: 'estrelas',
        texto: {
          'pt-PT': '⭐ Iluminar a porta escondida',
          'pt-BR': '⭐ Iluminar a porta escondida',
        },
        proximaCena: 'estufa_estrelas',
      },
      {
        texto: {
          'pt-PT': '📚 Procurar um segredo (Sabedoria)',
          'pt-BR': '📚 Procurar um segredo (Sabedoria)',
        },
        proximaCena: 'estufa_procura',
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'laboratorio' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'laboratorio' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'laboratorio' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'laboratorio' }],
  },
  estufa_procura: {
    id: 'estufa_procura',
    emoji: '[[cenas/lupa]]',
    texto: {
      'pt-PT': '{Nome} espreita entre as folhas e procura uma alavanca ou um segredo. Pensa bem!',
      'pt-BR': '{Nome} espia entre as folhas e procura uma alavanca ou um segredo. Pense bem!',
    },
    teste: { habilidade: 'sabedoria', dificuldade: 10, sucesso: 'estufa_alavanca', falha: 'estufa_planta' },
  },
  estufa_alavanca: {
    id: 'estufa_alavanca',
    emoji: '[[cenas/gancho]]',
    texto: {
      'pt-PT': 'Achou! Uma alavanca escondida atrás de um vaso. Clic! As trepadeiras recolhem-se.',
      'pt-BR': 'Achou! Uma alavanca escondida atrás de um vaso. Clic! As trepadeiras se recolhem.',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'laboratorio' }],
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

  laboratorio: {
    id: 'laboratorio',
    emoji: '[[cenas/laboratorio]]',
    texto: {
      'pt-PT':
        'No terceiro andar fica o laboratório, com poções a borbulhar e ninguém por perto. {Nome} encontra uma caminha quentinha e uma chávena de chá mágico. Descansa um pouco e recupera a vida e a energia mágica.',
      'pt-BR':
        'No terceiro andar fica o laboratório, com poções borbulhando e ninguém por perto. {Nome} encontra uma caminha quentinha e uma xícara de chá mágico. Descansa um pouco e recupera a vida e a energia mágica.',
    },
    descanso: true,
    escolhas: [{ texto: SUBIR, proximaCena: 'corredor' }],
  },

  corredor: {
    id: 'corredor',
    emoji: '[[cenas/corredor]]',
    texto: {
      'pt-PT':
        'No quarto andar, o corredor está cheio de névoa. De repente, um fantasma aparece a rir: «Buuu! Ninguém passa sem brincar comigo!»',
      'pt-BR':
        'No quarto andar, o corredor está cheio de névoa. De repente, um fantasma aparece rindo: «Buuu! Ninguém passa sem brincar comigo!»',
    },
    luta: { inimigo: 'fantasma', aoVencer: 'abismo' },
  },

  abismo: {
    id: 'abismo',
    emoji: '[[cenas/abismo]]',
    texto: {
      'pt-PT':
        'No quinto andar, o chão da escada desabou! Há um buraco enorme e, do outro lado, está a porta que leva ao topo. Como vai {nome} atravessar?',
      'pt-BR':
        'No quinto andar, o chão da escada desabou! Há um buraco enorme e, do outro lado, está a porta que leva ao topo. Como {nome} vai atravessar?',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        escola: 'fogo',
        texto: {
          'pt-PT': '🔥 Criar uma corrente de ar quente para voar',
          'pt-BR': '🔥 Criar uma corrente de ar quente para voar',
        },
        proximaCena: 'abismo_fogo',
      },
      {
        escola: 'gelo',
        texto: { 'pt-PT': '❄️ Fazer uma ponte de gelo', 'pt-BR': '❄️ Fazer uma ponte de gelo' },
        proximaCena: 'abismo_gelo',
      },
      {
        escola: 'natureza',
        texto: {
          'pt-PT': '🌱 Fazer crescer uma ponte de raízes',
          'pt-BR': '🌱 Fazer crescer uma ponte de raízes',
        },
        proximaCena: 'abismo_natureza',
      },
      {
        escola: 'estrelas',
        texto: { 'pt-PT': '✨ Fazer uma ponte de luz', 'pt-BR': '✨ Fazer uma ponte de luz' },
        proximaCena: 'abismo_estrelas',
      },
      {
        texto: {
          'pt-PT': '⚡ Saltar com um impulso mágico (Poder)',
          'pt-BR': '⚡ Pular com um impulso mágico (Poder)',
        },
        proximaCena: 'abismo_salto',
      },
    ],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'topo' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'topo' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'topo' }],
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
    escolhas: [{ texto: SEGUIR, proximaCena: 'topo' }],
  },
  abismo_salto: {
    id: 'abismo_salto',
    emoji: '[[cenas/raio]]',
    texto: {
      'pt-PT': '{Nome} junta toda a magia nas pernas, respira fundo e... salta por cima do buraco!',
      'pt-BR': '{Nome} junta toda a magia nas pernas, respira fundo e... pula por cima do buraco!',
    },
    teste: { habilidade: 'poder', dificuldade: 11, sucesso: 'abismo_saltou', falha: 'abismo_gargula' },
  },
  abismo_saltou: {
    id: 'abismo_saltou',
    emoji: '[[cenas/acrobata]]',
    texto: {
      'pt-PT': 'Que salto! {Nome} aterra do outro lado, com a capa a esvoaçar.',
      'pt-BR': 'Que pulo! {Nome} aterrissa do outro lado, com a capa esvoaçando.',
    },
    escolhas: [{ texto: SEGUIR, proximaCena: 'topo' }],
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

  topo: {
    id: 'topo',
    emoji: '[[inimigos/golem-guardiao]]',
    texto: {
      'pt-PT':
        'No topo da torre, uma luz dourada enche a sala. À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra: «Ninguém se aproxima da estrela!»',
      'pt-BR':
        'No topo da torre, uma luz dourada enche a sala. À frente, o Golem Guardião bloqueia a porta e grita com voz de pedra: «Ninguém se aproxima da estrela!»',
    },
    luta: { inimigo: 'golem', aoVencer: 'dragao' },
  },

  dragao: {
    id: 'dragao',
    emoji: '[[inimigos/dragao]]',
    texto: {
      'pt-PT':
        'O Golem desfaz-se em pedrinhas. Atrás dele, {nome} vê a estrela caída e, enroscado nela, um dragãozinho de estrelas a tremer de medo. Foi ele que, sem querer, baralhou toda a magia da torre! Como vai {nome} acalmá-lo?',
      'pt-BR':
        'O Golem se desfaz em pedrinhas. Atrás dele, {nome} vê a estrela caída e, enroscado nela, um dragãozinho de estrelas tremendo de medo. Foi ele que, sem querer, bagunçou toda a magia da torre! Como {nome} vai acalmá-lo?',
    },
    pergunta: O_QUE_FAZER,
    escolhas: [
      {
        escola: 'fogo',
        texto: {
          'pt-PT': '🔥 Acender uma fogueirinha quente',
          'pt-BR': '🔥 Acender uma fogueirinha quentinha',
        },
        proximaCena: 'fim_fogo',
      },
      {
        escola: 'gelo',
        texto: { 'pt-PT': '❄️ Fazer cair neve macia', 'pt-BR': '❄️ Fazer cair neve macia' },
        proximaCena: 'fim_gelo',
      },
      {
        escola: 'natureza',
        texto: {
          'pt-PT': '🌿 Fazer crescer uma caminha de folhas',
          'pt-BR': '🌿 Fazer crescer uma caminha de folhas',
        },
        proximaCena: 'fim_natureza',
      },
      {
        escola: 'estrelas',
        texto: {
          'pt-PT': '⭐ Fazer dançar estrelinhas no ar',
          'pt-BR': '⭐ Fazer dançar estrelinhas no ar',
        },
        proximaCena: 'fim_estrelas',
      },
      {
        texto: {
          'pt-PT': '🤗 Falar baixinho e fazer festinhas',
          'pt-BR': '🤗 Falar baixinho e fazer carinho',
        },
        proximaCena: 'fim_carinho',
      },
    ],
  },
  fim_fogo: {
    id: 'fim_fogo',
    emoji: '[[feiticos/chama]]',
    texto: {
      'pt-PT':
        '{Nome} acende uma fogueirinha, quentinha como uma noite de acampamento. O dragãozinho aquece-se, sorri e deixa de tremer. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz de Fogo!»',
      'pt-BR':
        '{Nome} acende uma fogueirinha, quentinha como uma noite de acampamento. O dragãozinho se aquece, sorri e para de tremer. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz de Fogo!»',
    },
    fim: true,
  },
  fim_gelo: {
    id: 'fim_gelo',
    emoji: '[[feiticos/congelar]]',
    texto: {
      'pt-PT':
        '{Nome} faz cair uma neve macia e brilhante. O dragãozinho ri, apanha os flocos com as patinhas e acalma-se. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz de Gelo!»',
      'pt-BR':
        '{Nome} faz cair uma neve macia e brilhante. O dragãozinho ri, pega os flocos com as patinhas e se acalma. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz de Gelo!»',
    },
    fim: true,
  },
  fim_natureza: {
    id: 'fim_natureza',
    emoji: '[[feiticos/folhas-curativas]]',
    texto: {
      'pt-PT':
        '{Nome} faz crescer uma caminha de folhas macias e flores cheirosas. O dragãozinho deita-se, boceja e adormece sem medo. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz da Natureza!»',
      'pt-BR':
        '{Nome} faz crescer uma caminha de folhas macias e flores cheirosas. O dragãozinho se deita, boceja e adormece sem medo. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz da Natureza!»',
    },
    fim: true,
  },
  fim_estrelas: {
    id: 'fim_estrelas',
    emoji: '[[feiticos/chuva-de-estrelas]]',
    texto: {
      'pt-PT':
        '{Nome} faz dançar pequenas estrelinhas no ar. O dragãozinho reconhece aquelas luzes, é como estar em casa, e acalma-se. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz das Estrelas!»',
      'pt-BR':
        '{Nome} faz dançar pequenas estrelinhas no ar. O dragãozinho reconhece aquelas luzes, é como estar em casa, e se acalma. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Que grande aprendiz das Estrelas!»',
    },
    fim: true,
  },
  fim_carinho: {
    id: 'fim_carinho',
    emoji: '[[cenas/abraco]]',
    texto: {
      'pt-PT':
        '{Nome} senta-se ao lado do dragãozinho, fala baixinho e faz-lhe festinhas na cabeça. Sem magia nenhuma, ele deixa de ter medo. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Às vezes, a melhor magia é a gentileza!»',
      'pt-BR':
        '{Nome} senta ao lado do dragãozinho, fala baixinho e faz carinho na cabeça dele. Sem magia nenhuma, ele para de ter medo. A estrela sobe ao céu e a Torre Encantada volta a brilhar. O Mestre dos Magos aplaude: «Às vezes, a melhor magia é a gentileza!»',
    },
    fim: true,
  },
};

export const CENA_INICIAL_MAGO = 'hall';
