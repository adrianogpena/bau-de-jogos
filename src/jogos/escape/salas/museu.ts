import type { Sala } from '../tipos';

/**
 * O Museu dos Dinossauros. A saída é sempre a porta grande do museu; o código (3 ou 4 números) sai de objetos
 * sorteados entre os 9 abaixo, cada um com várias versões do enigma. A escavação é um extra que dá a chave do
 * caixote; o caixote é outro extra que dá a lanterna para ver a vitrine de cristais.
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: tempo (ontem, hoje, amanhã; antes e
 * depois), ciclos de vida, comprimento e classificar animais.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/museu.jpg); para conferir, abra a sala com ?zonas.
 */
export const museu: Sala = {
  id: 'museu',
  emoji: '🦖',
  cor: '#f4c27a',
  titulo: { 'pt-PT': 'O Museu dos Dinossauros', 'pt-BR': 'O Museu dos Dinossauros' },
  resumo: {
    'pt-PT': 'Adormeceste no museu e a porta está trancada. Descobre o código!',
    'pt-BR': 'Você pegou no sono no museu e a porta está trancada. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Foste ao museu com a escola e adormeceste atrás de um dinossauro. Quando acordaste, já era de noite e a porta grande estava trancada! Na porta há um cadeado com desenhos de coisas do museu. Cada uma dessas coisas esconde um número. Descobre os números e abre a porta!',
    'pt-BR':
      'Você foi ao museu com a escola e pegou no sono atrás de um dinossauro. Quando acordou, já era noite e a porta grande estava trancada! Na porta há um cadeado com desenhos de coisas do museu. Cada uma dessas coisas esconde um número. Descubra os números e abra a porta!',
  },
  fundo: 'imagens/saida-secreta/museu.jpg',
  fundoCss: 'linear-gradient(180deg, #2b3a5c 0%, #8a6a45 55%, #d9b98a 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da porta!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da porta!',
  },
  fontes: [
    {
      id: 'trex',
      nome: { 'pt-PT': 'Esqueleto de T-rex', 'pt-BR': 'Esqueleto de T-rex' },
      emoji: '🦖',
      zona: { x: 10, y: 33.5, largura: 20, altura: 53 },
      sucesso: {
        'pt-PT': 'Na pata do T-rex estava escrito o número {n}!',
        'pt-BR': 'Na pata do T-rex estava escrito o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦖',
              pergunta: {
                'pt-PT': 'Caíram quatro ossos do T-rex! Qual é o osso mais comprido?',
                'pt-BR': 'Caíram quatro ossos do T-rex! Qual é o osso mais comprido?',
              },
              opcoes: [
                { emoji: '▬▬', nome: { 'pt-PT': 'Osso da cauda', 'pt-BR': 'Osso da cauda' } },
                { emoji: '▬', nome: { 'pt-PT': 'Osso do braço', 'pt-BR': 'Osso do braço' } },
                { emoji: '▬▬▬▬', nome: { 'pt-PT': 'Osso da perna', 'pt-BR': 'Osso da perna' } },
                { emoji: '▬▬▬', nome: { 'pt-PT': 'Costela', 'pt-BR': 'Costela' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: olha para o tamanho de cada risco. Qual é o que vai mais longe?',
              'pt-BR': 'Dica: olhe o tamanho de cada risco. Qual é o que vai mais longe?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦷 🦷 🦷 🦷 🦷 🦷 🦷 🦷',
              pergunta: {
                'pt-PT': 'Olha para os dentes do T-rex! Quantos dentes há no desenho? Escreve o número.',
                'pt-BR': 'Olhe os dentes do T-rex! Quantos dentes tem no desenho? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: conta os dentes um a um, com o dedo.',
              'pt-BR': 'Dica: conte os dentes um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O esqueleto desmontou-se! Encontra os pares iguais.',
                'pt-BR': 'O esqueleto se desmontou! Encontre os pares iguais.',
              },
              emojis: ['🦴', '💀', '🦷', '🦖'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦖 🦷🦷🦷',
              pergunta: {
                'pt-PT': 'O T-rex tinha dentes muito afiados. O que é que ele comia?',
                'pt-BR': 'O T-rex tinha dentes muito afiados. O que ele comia?',
              },
              opcoes: [
                { emoji: '🥕', nome: { 'pt-PT': 'Cenouras', 'pt-BR': 'Cenouras' } },
                { emoji: '🍞', nome: { 'pt-PT': 'Pão', 'pt-BR': 'Pão' } },
                { emoji: '🍖', nome: { 'pt-PT': 'Carne', 'pt-BR': 'Carne' } },
                { emoji: '🍦', nome: { 'pt-PT': 'Gelado', 'pt-BR': 'Sorvete' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os dentes afiados servem para rasgar. Qual destas comidas precisa de ser rasgada?',
              'pt-BR': 'Dica: os dentes afiados servem para rasgar. Qual destas comidas precisa ser rasgada?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦖 👣👣👣👣 ➕ 🦕 👣👣👣',
              pergunta: {
                'pt-PT': 'O T-rex mede 4 passos e o tricerátops mede 3 passos. Quantos passos medem os dois juntos?',
                'pt-BR': 'O T-rex mede 4 passos e o tricerátops mede 3 passos. Quantos passos os dois medem juntos?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: começa no 4 e conta mais três: cinco, seis...',
              'pt-BR': 'Dica: comece no 4 e conte mais três: cinco, seis...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Quem viveu primeiro na Terra: o T-rex ou o teu avô?',
                'pt-BR': 'Quem viveu primeiro na Terra: o T-rex ou o seu avô?',
              },
              opcoes: [
                { emoji: '👴', nome: { 'pt-PT': 'O meu avô', 'pt-BR': 'Meu avô' } },
                { emoji: '🦖', nome: { 'pt-PT': 'O T-rex', 'pt-BR': 'O T-rex' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: alguma vez o teu avô viu um dinossauro vivo? Os ossos do museu são muito, muito antigos.',
              'pt-BR': 'Dica: alguma vez o seu avô viu um dinossauro vivo? Os ossos do museu são muito, muito antigos.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦖 ✌️ ✌️',
              pergunta: {
                'pt-PT': 'O T-rex tem 2 braços pequeninos e cada braço tem 2 dedos. Quantos dedos tem nos braços?',
                'pt-BR': 'O T-rex tem 2 braços pequenininhos e cada braço tem 2 dedos. Quantos dedos ele tem nos braços?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta os dedos do primeiro braço e continua no segundo.',
              'pt-BR': 'Dica: conte os dedos do primeiro braço e continue no segundo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦖 👣👣👣👣👣👣👣👣👣',
              pergunta: {
                'pt-PT': 'O T-rex adulto mede 9 passos e o T-rex bebé mede 3. Quantos passos mede o adulto a mais do que o bebé?',
                'pt-BR': 'O T-rex adulto mede 9 passos e o T-rex bebê mede 3. Quantos passos o adulto mede a mais que o bebê?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: tapa 3 passos com o dedo, os que o bebé também tem. Conta os que sobram.',
              'pt-BR': 'Dica: cubra 3 passos com o dedo, os que o bebê também tem. Conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe por ordem, do mais antigo ao mais recente: os dinossauros, o mamute, as pessoas das cavernas, o castelo e o avião.',
                'pt-BR':
                  'Coloque em ordem, do mais antigo ao mais recente: os dinossauros, o mamute, as pessoas das cavernas, o castelo e o avião.',
              },
              itens: ['🦕', '🦣', '🔥', '🏰', '✈️'],
            },
            dica: {
              'pt-PT': 'Dica: os dinossauros vêm primeiro e o avião é o mais novo. As pessoas das cavernas já caçavam mamutes.',
              'pt-BR': 'Dica: os dinossauros vêm primeiro e o avião é o mais novo. As pessoas das cavernas já caçavam mamutes.',
            },
          },
        ],
      },
    },
    {
      id: 'quadro',
      nome: { 'pt-PT': 'Quadro dos dinossauros', 'pt-BR': 'Quadro dos dinossauros' },
      emoji: '🖼️',
      zona: { x: 29.4, y: 24.5, largura: 17.8, altura: 24 },
      sucesso: {
        'pt-PT': 'Atrás de um dinossauro do quadro apareceu o número {n}!',
        'pt-BR': 'Atrás de um dinossauro do quadro apareceu o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦕 🦖 🦕 🦕 🦖 🦕',
              pergunta: {
                'pt-PT': 'Quantos dinossauros há no quadro? Escreve o número.',
                'pt-BR': 'Quantos dinossauros tem no quadro? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os dinossauros um a um, da esquerda para a direita.',
              'pt-BR': 'Dica: conte os dinossauros um por um, da esquerda para a direita.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'No quadro há um intruso! Qual destes não é um dinossauro?',
                'pt-BR': 'No quadro há um intruso! Qual destes não é um dinossauro?',
              },
              opcoes: [
                { emoji: '🦕', nome: { 'pt-PT': 'Dinossauro de pescoço comprido', 'pt-BR': 'Dinossauro de pescoço comprido' } },
                { emoji: '🦖', nome: { 'pt-PT': 'T-rex', 'pt-BR': 'T-rex' } },
                { emoji: '🚗', nome: { 'pt-PT': 'Carro', 'pt-BR': 'Carro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os dinossauros eram animais. Qual destes tem rodas?',
              'pt-BR': 'Dica: os dinossauros eram animais. Qual destes tem rodas?',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As coisas do quadro misturaram-se. Encontra os pares iguais!',
                'pt-BR': 'As coisas do quadro se misturaram. Encontre os pares iguais!',
              },
              emojis: ['🦕', '🦖', '🥚', '🌋'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦕 🦖 🦕 🦖 🦕 🦕 🦖',
              pergunta: {
                'pt-PT': 'Quantos dinossauros do quadro têm o pescoço comprido? Não contes os outros.',
                'pt-BR': 'Quantos dinossauros do quadro têm o pescoço comprido? Não conte os outros.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: procura os dinossauros de pescoço comprido e conta só esses.',
              'pt-BR': 'Dica: procure os dinossauros de pescoço comprido e conte só esses.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦖',
              pergunta: {
                'pt-PT': 'Os dinossauros tinham a pele coberta de escamas. Que animal de hoje também tem escamas?',
                'pt-BR': 'Os dinossauros tinham a pele coberta de escamas. Que animal de hoje também tem escamas?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐍', nome: { 'pt-PT': 'Cobra', 'pt-BR': 'Cobra' } },
                { emoji: '🐑', nome: { 'pt-PT': 'Ovelha', 'pt-BR': 'Ovelha' } },
                { emoji: '🐕', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: três destes animais têm pelo ou lã. Qual tem a pele lisa e brilhante?',
              'pt-BR': 'Dica: três destes animais têm pelo ou lã. Qual tem a pele lisa e brilhante?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌳 🌿',
              pergunta: {
                'pt-PT': 'No quadro, um dos animais está a comer as folhas das árvores. Qual é?',
                'pt-BR': 'No quadro, um dos animais está comendo as folhas das árvores. Qual é?',
              },
              opcoes: [
                { emoji: '🦖', nome: { 'pt-PT': 'T-rex', 'pt-BR': 'T-rex' } },
                { emoji: '🐊', nome: { 'pt-PT': 'Crocodilo', 'pt-BR': 'Crocodilo' } },
                { emoji: '🦕', nome: { 'pt-PT': 'Dinossauro de pescoço comprido', 'pt-BR': 'Dinossauro de pescoço comprido' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: as folhas estão lá no alto das árvores. Quem chega lá acima?',
              'pt-BR': 'Dica: as folhas estão lá no alto das árvores. Quem alcança lá em cima?',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Um destes animais de hoje já vivia no tempo dos dinossauros. Qual é?',
                'pt-BR': 'Um destes animais de hoje já vivia no tempo dos dinossauros. Qual é?',
              },
              opcoes: [
                { emoji: '🐘', nome: { 'pt-PT': 'Elefante', 'pt-BR': 'Elefante' } },
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐕', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
                { emoji: '🐊', nome: { 'pt-PT': 'Crocodilo', 'pt-BR': 'Crocodilo' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: procura o animal que se parece mais com um dinossauro: tem escamas, cauda grande e muitos dentes.',
              'pt-BR': 'Dica: procure o animal mais parecido com um dinossauro: tem escamas, cauda grande e muitos dentes.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦕 🦕 🦕',
              pergunta: {
                'pt-PT':
                  'No quadro há 3 dinossauros de pescoço comprido e o dobro de dinossauros pequenos. Quantos dinossauros pequenos há?',
                'pt-BR':
                  'No quadro tem 3 dinossauros de pescoço comprido e o dobro de dinossauros pequenos. Quantos dinossauros pequenos tem?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: o dobro é o mesmo número duas vezes: 3 e mais 3.',
              'pt-BR': 'Dica: o dobro é o mesmo número duas vezes: 3 e mais 3.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦕 🦖 🦕 🦖 🦕 🦖 🦕',
              pergunta: {
                'pt-PT': 'Quantos dinossauros do quadro não comem plantas?',
                'pt-BR': 'Quantos dinossauros do quadro não comem plantas?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: os de pescoço comprido comem folhas. Não os contes e conta os outros.',
              'pt-BR': 'Dica: os de pescoço comprido comem folhas. Não conte esses e conte os outros.',
            },
          },
        ],
      },
    },
    {
      id: 'ninho',
      nome: { 'pt-PT': 'Ninho de ovos', 'pt-BR': 'Ninho de ovos' },
      emoji: '🥚',
      zona: { x: 28.8, y: 48.3, largura: 15, altura: 20 },
      sucesso: {
        'pt-PT': 'Um ovo abriu-se e lá dentro estava o número {n}!',
        'pt-BR': 'Um ovo se abriu e lá dentro estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🥚 🥚 🥚 🥚 🥚 🥚 🥚',
              pergunta: {
                'pt-PT': 'Quantos ovos há no ninho? Escreve o número.',
                'pt-BR': 'Quantos ovos tem no ninho? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: conta os ovos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os ovos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe o dinossauro por ordem: o ovo, o ovo a rachar, o bebé e o adulto. O risco mostra o tamanho.',
                'pt-BR': 'Coloque o dinossauro em ordem: o ovo, o ovo rachando, o bebê e o adulto. O risco mostra o tamanho.',
              },
              itens: ['🥚', '🐣', '🦖▬', '🦖▬▬▬'],
            },
            dica: {
              'pt-PT': 'Dica: tudo começa no ovo inteiro. O adulto é o maior e fica no fim.',
              'pt-BR': 'Dica: tudo começa no ovo inteiro. O adulto é o maior e fica no fim.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O ninho está cheio de surpresas. Encontra os pares iguais!',
                'pt-BR': 'O ninho está cheio de surpresas. Encontre os pares iguais!',
              },
              emojis: ['🥚', '🐣', '🐥', '🍳'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐣 🐣 🐣 🐣 🐣 🥚 🥚 🥚 🥚',
              pergunta: {
                'pt-PT': 'No ninho havia 9 ovos e já nasceram 5 bebés. Quantos ovos faltam nascer?',
                'pt-BR': 'No ninho tinha 9 ovos e já nasceram 5 bebês. Quantos ovos faltam nascer?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: começa nos 9 e conta para trás 5 vezes.',
              'pt-BR': 'Dica: comece no 9 e conte para trás 5 vezes.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe o dinossauro por ordem: o ovo, o ovo a rachar, o bebé, o jovem e o adulto. O risco mostra o tamanho.',
                'pt-BR':
                  'Coloque o dinossauro em ordem: o ovo, o ovo rachando, o bebê, o jovem e o adulto. O risco mostra o tamanho.',
              },
              itens: ['🥚', '🐣', '🦖▬', '🦖▬▬', '🦖▬▬▬'],
            },
            dica: {
              'pt-PT': 'Dica: depois de o ovo rachar, o dinossauro vai crescendo. Olha para o tamanho do risco.',
              'pt-BR': 'Dica: depois que o ovo racha, o dinossauro vai crescendo. Olhe o tamanho do risco.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐔',
              pergunta: {
                'pt-PT': 'A galinha também põe ovos. Qual é o bebé da galinha?',
                'pt-BR': 'A galinha também bota ovos. Qual é o bebê da galinha?',
              },
              opcoes: [
                { emoji: '🐛', nome: { 'pt-PT': 'Lagarta', 'pt-BR': 'Lagarta' } },
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
                { emoji: '🐸', nome: { 'pt-PT': 'Rã', 'pt-BR': 'Sapo' } },
                { emoji: '🐥', nome: { 'pt-PT': 'Pintainho', 'pt-BR': 'Pintinho' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o bebé parece-se com a mãe: tem bico e penas amarelas.',
              'pt-BR': 'Dica: o bebê se parece com a mãe: tem bico e penas amarelas.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe o ciclo de vida do dinossauro por ordem: o ovo, o ovo a rachar, o bebé, o jovem, o adulto e o adulto a pôr ovos.',
                'pt-BR':
                  'Coloque o ciclo de vida do dinossauro em ordem: o ovo, o ovo rachando, o bebê, o jovem, o adulto e o adulto botando ovos.',
              },
              itens: ['🥚', '🐣', '🦖▬', '🦖▬▬', '🦖▬▬▬', '🦖🥚'],
            },
            dica: {
              'pt-PT': 'Dica: o dinossauro cresce do mais pequeno ao maior. Só o adulto põe ovos, e aí o ciclo recomeça.',
              'pt-BR': 'Dica: o dinossauro cresce do menor ao maior. Só o adulto bota ovos, e aí o ciclo recomeça.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐣 🐣 🥚 🥚 🥚',
              pergunta: {
                'pt-PT':
                  'No ninho nasce 1 ovo por dia. Hoje já nasceram 2 e ainda há 3 por nascer. Daqui a quantos dias nasce o último?',
                'pt-BR':
                  'No ninho nasce 1 ovo por dia. Hoje já nasceram 2 e ainda tem 3 para nascer. Daqui a quantos dias nasce o último?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: os que já nasceram não contam. Amanhã nasce um ovo, depois de amanhã outro...',
              'pt-BR': 'Dica: os que já nasceram não contam. Amanhã nasce um ovo, depois de amanhã outro...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🐛',
              pergunta: {
                'pt-PT': 'Há bichos que mudam muito quando crescem. A lagarta transforma-se em quê?',
                'pt-BR': 'Tem bichos que mudam muito quando crescem. A lagarta se transforma em quê?',
              },
              opcoes: [
                { emoji: '🐝', nome: { 'pt-PT': 'Abelha', 'pt-BR': 'Abelha' } },
                { emoji: '🦋', nome: { 'pt-PT': 'Borboleta', 'pt-BR': 'Borboleta' } },
                { emoji: '🪲', nome: { 'pt-PT': 'Escaravelho', 'pt-BR': 'Besouro' } },
                { emoji: '🐞', nome: { 'pt-PT': 'Joaninha', 'pt-BR': 'Joaninha' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a lagarta fecha-se num casulo e sai de lá com asas grandes e coloridas.',
              'pt-BR': 'Dica: a lagarta se fecha em um casulo e sai de lá com asas grandes e coloridas.',
            },
          },
        ],
      },
    },
    {
      id: 'fossil',
      nome: { 'pt-PT': 'Fóssil de concha', 'pt-BR': 'Fóssil de concha' },
      emoji: '🐚',
      zona: { x: 73, y: 22.1, largura: 18.4, altura: 20.8 },
      sucesso: {
        'pt-PT': 'Na pedra do fóssil estava gravado o número {n}!',
        'pt-BR': 'Na pedra do fóssil estava gravado o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Na pedra está uma concha muito antiga. Qual destas coisas é uma concha?',
                'pt-BR': 'Na pedra tem uma concha muito antiga. Qual destas coisas é uma concha?',
              },
              opcoes: [
                { emoji: '🍕', nome: { 'pt-PT': 'Piza', 'pt-BR': 'Pizza' } },
                { emoji: '🐚', nome: { 'pt-PT': 'Concha', 'pt-BR': 'Concha' } },
                { emoji: '🚗', nome: { 'pt-PT': 'Carro', 'pt-BR': 'Carro' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a concha encontra-se na praia e tem a forma de um caracol.',
              'pt-BR': 'Dica: a concha a gente encontra na praia e tem a forma de um caracol.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐚 🦴 🐚 🦴 🐚',
              pergunta: {
                'pt-PT': 'Quantos fósseis há na pedra? Escreve o número.',
                'pt-BR': 'Quantos fósseis tem na pedra? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as conchas e os ossos, um a um.',
              'pt-BR': 'Dica: conte as conchas e os ossos, um por um.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os fósseis caíram da pedra. Encontra os pares iguais!',
                'pt-BR': 'Os fósseis caíram da pedra. Encontre os pares iguais!',
              },
              emojis: ['🐚', '🦴', '🪨', '🦕'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🪨 🐚',
              pergunta: {
                'pt-PT': 'Esta pedra é um fóssil. O que é um fóssil?',
                'pt-BR': 'Esta pedra é um fóssil. O que é um fóssil?',
              },
              opcoes: [
                { emoji: '🌱', nome: { 'pt-PT': 'Uma planta nova', 'pt-BR': 'Uma planta nova' } },
                { emoji: '🧸', nome: { 'pt-PT': 'Um brinquedo de pedra', 'pt-BR': 'Um brinquedo de pedra' } },
                {
                  emoji: '🐚',
                  nome: {
                    'pt-PT': 'A marca de um animal muito antigo na pedra',
                    'pt-BR': 'A marca de um animal muito antigo na pedra',
                  },
                },
                { emoji: '🍪', nome: { 'pt-PT': 'Uma bolacha muito dura', 'pt-BR': 'Um biscoito muito duro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os fósseis estão no museu porque são muito, muito antigos. Qual destas coisas é antiga?',
              'pt-BR': 'Dica: os fósseis estão no museu porque são muito, muito antigos. Qual destas coisas é antiga?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌊',
              pergunta: {
                'pt-PT': 'A concha do fóssil viveu no mar. Qual destes animais também vive no mar?',
                'pt-BR': 'A concha do fóssil viveu no mar. Qual destes animais também vive no mar?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐓', nome: { 'pt-PT': 'Galo', 'pt-BR': 'Galo' } },
                { emoji: '🐿️', nome: { 'pt-PT': 'Esquilo', 'pt-BR': 'Esquilo' } },
                { emoji: '🐚', nome: { 'pt-PT': 'Búzio', 'pt-BR': 'Concha' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: três destes animais vivem em terra, na quinta ou nas árvores. Qual se encontra na praia?',
              'pt-BR': 'Dica: três destes animais vivem em terra, na fazenda ou nas árvores. Qual a gente encontra na praia?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐚 🐚 🐚 ➕ 🐚 🐚 🐚 🐚',
              pergunta: {
                'pt-PT': 'Havia 3 conchas na pedra e a cientista encontrou mais 4. Quantas conchas há agora?',
                'pt-BR': 'Tinha 3 conchas na pedra e a cientista encontrou mais 4. Quantas conchas tem agora?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais quatro: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais quatro: quatro, cinco...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Os ossos dos animais ficam na pedra como fósseis. Qual destes animais não tem ossos?',
                'pt-BR': 'Os ossos dos animais ficam na pedra como fósseis. Qual destes animais não tem ossos?',
              },
              opcoes: [
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
                { emoji: '🐸', nome: { 'pt-PT': 'Rã', 'pt-BR': 'Sapo' } },
                { emoji: '🐌', nome: { 'pt-PT': 'Caracol', 'pt-BR': 'Caracol' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Passarinho' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: pensa em qual destes é mole por dentro e se protege só com uma casca.',
              'pt-BR': 'Dica: pense em qual destes é mole por dentro e se protege só com uma casca.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟨 🟧 🟫',
              pergunta: {
                'pt-PT': 'A rocha tem camadas, umas por cima das outras. Onde está o fóssil mais antigo?',
                'pt-BR': 'A rocha tem camadas, umas em cima das outras. Onde está o fóssil mais antigo?',
              },
              opcoes: [
                { emoji: '⬆️', nome: { 'pt-PT': 'Na camada de cima', 'pt-BR': 'Na camada de cima' } },
                { emoji: '↔️', nome: { 'pt-PT': 'Na camada do meio', 'pt-BR': 'Na camada do meio' } },
                { emoji: '⬇️', nome: { 'pt-PT': 'Na camada de baixo', 'pt-BR': 'Na camada de baixo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: pensa numa pilha de folhas. A primeira folha que puseste fica onde?',
              'pt-BR': 'Dica: pense em uma pilha de folhas. A primeira folha que você colocou fica onde?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐟 🐌 🐦 🐙 🪱',
              pergunta: {
                'pt-PT': 'Quantos destes animais não têm ossos?',
                'pt-BR': 'Quantos destes animais não têm ossos?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: o peixe e o pássaro têm esqueleto. Não os contes e vê os outros.',
              'pt-BR': 'Dica: o peixe e o passarinho têm esqueleto. Não conte esses e veja os outros.',
            },
          },
        ],
      },
    },
    {
      id: 'vitrine',
      nome: { 'pt-PT': 'Vitrine de cristais', 'pt-BR': 'Vitrine de cristais' },
      emoji: '💎',
      zona: { x: 72.3, y: 46.3, largura: 19.1, altura: 24.2 },
      requer: 'lanterna',
      bloqueado: {
        'pt-PT': 'A vitrine está às escuras e não se vê nada. Procura uma lanterna!',
        'pt-BR': 'A vitrine está no escuro e não dá para ver nada. Procure uma lanterna!',
      },
      sucesso: {
        'pt-PT': 'Com a luz da lanterna, um cristal mostrou o número {n}!',
        'pt-BR': 'Com a luz da lanterna, um cristal mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os cristais brilham com a lanterna. Encontra os pares iguais!',
                'pt-BR': 'Os cristais brilham com a lanterna. Encontre os pares iguais!',
              },
              emojis: ['💎', '🔷', '🔶', '🔺'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💎 🔷 🔶 💎 🔷 🔶',
              pergunta: {
                'pt-PT': 'Quantos cristais há na vitrine? Escreve o número.',
                'pt-BR': 'Quantos cristais tem na vitrine? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os cristais um a um, com o dedo.',
              'pt-BR': 'Dica: conte os cristais um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔦',
              pergunta: {
                'pt-PT': 'Apontaste a lanterna para a vitrine. Qual destas coisas brilha com a luz?',
                'pt-BR': 'Você apontou a lanterna para a vitrine. Qual destas coisas brilha com a luz?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
                { emoji: '🪵', nome: { 'pt-PT': 'Madeira', 'pt-BR': 'Madeira' } },
                { emoji: '💎', nome: { 'pt-PT': 'Cristal', 'pt-BR': 'Cristal' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura a coisa transparente e cheia de cantinhos, como um vidro.',
              'pt-BR': 'Dica: procure a coisa transparente e cheia de cantinhos, como um vidro.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os cristais brilham com a lanterna. Encontra os cinco pares iguais!',
                'pt-BR': 'Os cristais brilham com a lanterna. Encontre os cinco pares iguais!',
              },
              emojis: ['💎', '🔷', '🔶', '🔺', '🟣'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Os cristais crescem dentro da rocha. Qual destes cristais é o mais comprido?',
                'pt-BR': 'Os cristais crescem dentro da rocha. Qual destes cristais é o mais comprido?',
              },
              opcoes: [
                { emoji: '💜▬▬▬', nome: { 'pt-PT': 'Cristal roxo', 'pt-BR': 'Cristal roxo' } },
                { emoji: '💚▬▬', nome: { 'pt-PT': 'Cristal verde', 'pt-BR': 'Cristal verde' } },
                { emoji: '🧡▬▬▬', nome: { 'pt-PT': 'Cristal laranja', 'pt-BR': 'Cristal laranja' } },
                { emoji: '💙▬▬▬▬', nome: { 'pt-PT': 'Cristal azul', 'pt-BR': 'Cristal azul' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: há dois cristais quase iguais. Compara bem os riscos e vê qual vai mais longe.',
              'pt-BR': 'Dica: há dois cristais quase iguais. Compare bem os riscos e veja qual vai mais longe.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔷 🔶 🔷 🟣 🔷 🔶',
              pergunta: {
                'pt-PT': 'Quantos cristais azuis há na vitrine? Não contes os outros.',
                'pt-BR': 'Quantos cristais azuis tem na vitrine? Não conte os outros.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: procura só os cristais azuis e conta-os com o dedo.',
              'pt-BR': 'Dica: procure só os cristais azuis e conte com o dedo.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os cristais da vitrine são parecidos. Encontra os seis pares iguais!',
                'pt-BR': 'Os cristais da vitrine são parecidos. Encontre os seis pares iguais!',
              },
              emojis: ['💎', '🔷', '🔶', '🔹', '🔸', '🔺'],
            },
            dica: {
              'pt-PT': 'Dica: há cristais grandes e pequenos da mesma cor. Olha bem para o tamanho.',
              'pt-BR': 'Dica: tem cristais grandes e pequenos da mesma cor. Olhe bem o tamanho.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Quatro caixas de cristais parecem iguais, mas uma é diferente. Qual é?',
                'pt-BR': 'Quatro caixas de cristais parecem iguais, mas uma é diferente. Qual é?',
              },
              opcoes: [
                { emoji: '🔷🔷🔶', nome: { 'pt-PT': 'Primeira caixa', 'pt-BR': 'Primeira caixa' } },
                { emoji: '🔷🔷🔶', nome: { 'pt-PT': 'Segunda caixa', 'pt-BR': 'Segunda caixa' } },
                { emoji: '🔷🔶🔷', nome: { 'pt-PT': 'Terceira caixa', 'pt-BR': 'Terceira caixa' } },
                { emoji: '🔷🔷🔶', nome: { 'pt-PT': 'Quarta caixa', 'pt-BR': 'Quarta caixa' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: olha para o cristal laranja de cada caixa. Em que lugar está?',
              'pt-BR': 'Dica: olhe o cristal laranja de cada caixa. Em que lugar ele está?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💎 📏',
              pergunta: {
                'pt-PT': 'Este cristal cresce 1 centímetro por ano. Hoje mede 3 centímetros. Quanto vai medir daqui a 2 anos?',
                'pt-BR': 'Este cristal cresce 1 centímetro por ano. Hoje mede 3 centímetros. Quanto vai medir daqui a 2 anos?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: no próximo ano cresce 1 e fica com 4. E no ano a seguir?',
              'pt-BR': 'Dica: no ano que vem cresce 1 e fica com 4. E no ano seguinte?',
            },
          },
        ],
      },
    },
    {
      id: 'vulcao',
      nome: { 'pt-PT': 'Vulcão', 'pt-BR': 'Vulcão' },
      emoji: '🌋',
      zona: { x: 91.3, y: 33, largura: 17.4, altura: 54 },
      sucesso: {
        'pt-PT': 'O vulcão deitou fumo com a forma do número {n}!',
        'pt-BR': 'O vulcão soltou fumaça com a forma do número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌋',
              pergunta: {
                'pt-PT': 'O vulcão está a acordar! O que sai do vulcão?',
                'pt-BR': 'O vulcão está acordando! O que sai do vulcão?',
              },
              opcoes: [
                { emoji: '🍦', nome: { 'pt-PT': 'Gelado', 'pt-BR': 'Sorvete' } },
                { emoji: '🔥', nome: { 'pt-PT': 'Lava quente', 'pt-BR': 'Lava quente' } },
                { emoji: '💧', nome: { 'pt-PT': 'Água', 'pt-BR': 'Água' } },
                { emoji: '❄️', nome: { 'pt-PT': 'Neve', 'pt-BR': 'Neve' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: olha para o vulcão do museu. De que cor é o que escorre por ele abaixo?',
              'pt-BR': 'Dica: olhe o vulcão do museu. De que cor é o que escorre por ele?',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe o vulcão por ordem, a acordar: a montanha calma, o fumo, o fogo e a lava a sair.',
                'pt-BR': 'Coloque o vulcão em ordem, acordando: a montanha calma, a fumaça, o fogo e a lava saindo.',
              },
              itens: ['🏔️', '💨', '🔥', '🌋'],
            },
            dica: {
              'pt-PT': 'Dica: primeiro a montanha está quieta, a dormir. Depois começa a deitar fumo.',
              'pt-BR': 'Dica: primeiro a montanha está quieta, dormindo. Depois começa a soltar fumaça.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌋 ☁️ ☁️ ☁️ ☁️',
              pergunta: {
                'pt-PT': 'Quantas nuvens de fumo saíram do vulcão? Escreve o número.',
                'pt-BR': 'Quantas nuvens de fumaça saíram do vulcão? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta as nuvens uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as nuvens uma por uma, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe por ordem o que acontece: o vulcão calmo, o fumo, a terra a tremer, a lava e a rocha nova.',
                'pt-BR':
                  'Coloque em ordem o que acontece: o vulcão calmo, a fumaça, a terra tremendo, a lava e a rocha nova.',
              },
              itens: ['🏔️', '💨', '〰️', '🔥', '🪨'],
            },
            dica: {
              'pt-PT': 'Dica: começa no vulcão calmo. A rocha nova só aparece no fim, quando a lava para.',
              'pt-BR': 'Dica: comece no vulcão calmo. A rocha nova só aparece no fim, quando a lava para.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔥 ➡️ ❔',
              pergunta: {
                'pt-PT': 'A lava quente saiu do vulcão e arrefeceu. Em que se transforma?',
                'pt-BR': 'A lava quente saiu do vulcão e esfriou. Em que ela se transforma?',
              },
              opcoes: [
                { emoji: '💧', nome: { 'pt-PT': 'Água', 'pt-BR': 'Água' } },
                { emoji: '❄️', nome: { 'pt-PT': 'Gelo', 'pt-BR': 'Gelo' } },
                { emoji: '🔥', nome: { 'pt-PT': 'Fogo', 'pt-BR': 'Fogo' } },
                { emoji: '🪨', nome: { 'pt-PT': 'Rocha', 'pt-BR': 'Rocha' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a lava é pedra derretida. Quando arrefece, fica dura outra vez.',
              'pt-BR': 'Dica: a lava é pedra derretida. Quando esfria, fica dura de novo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💨 💨 💨',
              pergunta: {
                'pt-PT': 'O vulcão deitou fumo ontem e hoje, e amanhã vai deitar fumo também. Em quantos dias deita fumo ao todo?',
                'pt-BR': 'O vulcão soltou fumaça ontem e hoje, e amanhã vai soltar fumaça também. Em quantos dias ele solta fumaça ao todo?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: conta pelos dedos: ontem é um, hoje é outro...',
              'pt-BR': 'Dica: conte nos dedos: ontem é um, hoje é outro...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌋 📅',
              pergunta: {
                'pt-PT': 'O vulcão acordou anteontem. Há quantos dias foi isso?',
                'pt-BR': 'O vulcão acordou anteontem. Faz quantos dias que isso aconteceu?',
              },
              resposta: '2',
            },
            dica: {
              'pt-PT': 'Dica: ontem foi há um dia. Anteontem foi o dia antes de ontem.',
              'pt-BR': 'Dica: ontem foi há um dia. Anteontem foi o dia antes de ontem.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT':
                  'Põe por ordem o que acontece depois da lava: a lava quente, a lava a arrefecer, a rocha, uma planta a nascer e a floresta.',
                'pt-BR':
                  'Coloque em ordem o que acontece depois da lava: a lava quente, a lava esfriando, a rocha, uma planta nascendo e a floresta.',
              },
              itens: ['🔥', '🌡️', '🪨', '🌱', '🌲🌳🌲'],
            },
            dica: {
              'pt-PT': 'Dica: a lava tem de arrefecer antes de virar rocha. As plantas só crescem em cima da rocha.',
              'pt-BR': 'Dica: a lava precisa esfriar antes de virar rocha. As plantas só crescem em cima da rocha.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦕 💨 🏃',
              pergunta: {
                'pt-PT': 'O dinossauro viu o fumo do vulcão e fugiu. O que aconteceu primeiro?',
                'pt-BR': 'O dinossauro viu a fumaça do vulcão e fugiu. O que aconteceu primeiro?',
              },
              opcoes: [
                { emoji: '🏃', nome: { 'pt-PT': 'O dinossauro fugiu', 'pt-BR': 'O dinossauro fugiu' } },
                { emoji: '💨', nome: { 'pt-PT': 'O vulcão deitou fumo', 'pt-BR': 'O vulcão soltou fumaça' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: porque é que o dinossauro fugiu? O que o assustou tem de vir antes.',
              'pt-BR': 'Dica: por que o dinossauro fugiu? O que o assustou precisa vir antes.',
            },
          },
        ],
      },
    },
    {
      id: 'pegadas',
      nome: { 'pt-PT': 'Pegadas', 'pt-BR': 'Pegadas' },
      emoji: '🐾',
      zona: { x: 31.4, y: 81.5, largura: 14, altura: 20.4 },
      sucesso: {
        'pt-PT': 'As pegadas levaram-te até ao número {n}!',
        'pt-BR': 'As pegadas levaram você até o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'No chão há quatro pegadas. Qual é a maior?',
                'pt-BR': 'No chão tem quatro pegadas. Qual é a maior?',
              },
              opcoes: [
                { emoji: '•', nome: { 'pt-PT': 'Primeira pegada', 'pt-BR': 'Primeira pegada' } },
                { emoji: '⬤', nome: { 'pt-PT': 'Segunda pegada', 'pt-BR': 'Segunda pegada' } },
                { emoji: '●', nome: { 'pt-PT': 'Terceira pegada', 'pt-BR': 'Terceira pegada' } },
                { emoji: '∙', nome: { 'pt-PT': 'Quarta pegada', 'pt-BR': 'Quarta pegada' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: compara as pegadas duas a duas. Qual ocupa mais espaço?',
              'pt-BR': 'Dica: compare as pegadas de duas em duas. Qual ocupa mais espaço?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐾 🐾 🐾 🐾 🐾 🐾 🐾 🐾',
              pergunta: {
                'pt-PT': 'Quantas pegadas há no chão? Escreve o número.',
                'pt-BR': 'Quantas pegadas tem no chão? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: conta as pegadas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as pegadas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Esta pegada é enorme! De quem é?',
                'pt-BR': 'Esta pegada é enorme! De quem é?',
              },
              opcoes: [
                { emoji: '🐈', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Passarinho' } },
                { emoji: '🐜', nome: { 'pt-PT': 'Formiga', 'pt-BR': 'Formiga' } },
                { emoji: '🦖', nome: { 'pt-PT': 'T-rex', 'pt-BR': 'T-rex' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: uma pegada enorme é de um animal enorme. Qual destes é o maior?',
              'pt-BR': 'Dica: uma pegada enorme é de um animal enorme. Qual destes é o maior?',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Estas pegadas são quase iguais. Qual é a mais comprida?',
                'pt-BR': 'Estas pegadas são quase iguais. Qual é a mais comprida?',
              },
              opcoes: [
                { emoji: '🐾▬▬▬▬', nome: { 'pt-PT': 'Primeira pegada', 'pt-BR': 'Primeira pegada' } },
                { emoji: '🐾▬▬▬', nome: { 'pt-PT': 'Segunda pegada', 'pt-BR': 'Segunda pegada' } },
                { emoji: '🐾▬▬▬▬', nome: { 'pt-PT': 'Terceira pegada', 'pt-BR': 'Terceira pegada' } },
                { emoji: '🐾▬▬▬▬▬', nome: { 'pt-PT': 'Quarta pegada', 'pt-BR': 'Quarta pegada' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: conta os bocadinhos do risco de cada pegada.',
              'pt-BR': 'Dica: conte os pedacinhos do risco de cada pegada.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦶 🦶',
              pergunta: {
                'pt-PT': 'Cada pegada mede 3 palmos. Quantos palmos medem as duas pegadas juntas?',
                'pt-BR': 'Cada pegada mede 3 palmos. Quantos palmos as duas pegadas medem juntas?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais três: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais três: quatro, cinco...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Esta pegada tem três dedos finos e compridos. De que animal é?',
                'pt-BR': 'Esta pegada tem três dedos finos e compridos. De que animal é?',
              },
              opcoes: [
                { emoji: '🐴', nome: { 'pt-PT': 'Cavalo', 'pt-BR': 'Cavalo' } },
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Passarinho' } },
                { emoji: '🐷', nome: { 'pt-PT': 'Porco', 'pt-BR': 'Porco' } },
                { emoji: '🐶', nome: { 'pt-PT': 'Cão', 'pt-BR': 'Cachorro' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o cavalo e o porco têm cascos, e o cão tem almofadas redondas. Quem tem dedos finos?',
              'pt-BR': 'Dica: o cavalo e o porco têm cascos, e o cachorro tem almofadas redondas. Quem tem dedos finos?',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦖 👣 👣 👣',
              pergunta: {
                'pt-PT': 'O T-rex dá passos de 3 palmos e deu 3 passos. Quantos palmos andou?',
                'pt-BR': 'O T-rex dá passos de 3 palmos e deu 3 passos. Quantos palmos ele andou?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: 3 palmos no primeiro passo, mais 3 no segundo, mais 3 no terceiro.',
              'pt-BR': 'Dica: 3 palmos no primeiro passo, mais 3 no segundo, mais 3 no terceiro.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦖 🐾',
              pergunta: {
                'pt-PT': 'A pegada grande mede 8 palmos e a pequena mede 3. Quantos palmos tem a grande a mais?',
                'pt-BR': 'A pegada grande mede 8 palmos e a pequena mede 3. Quantos palmos a grande tem a mais?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta até chegares ao 8. Quantos números contaste?',
              'pt-BR': 'Dica: comece no 3 e conte até chegar ao 8. Quantos números você contou?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha de quem é a pegada: não tem garras, é redonda e não é a mais pequena.',
                'pt-BR': 'Adivinhe de quem é a pegada: não tem garras, é redonda e não é a menor.',
              },
              opcoes: [
                { emoji: '🦖', nome: { 'pt-PT': 'T-rex: grande, com garras', 'pt-BR': 'T-rex: grande, com garras' } },
                { emoji: '🐈', nome: { 'pt-PT': 'Gato: redonda e pequenina', 'pt-BR': 'Gato: redonda e pequenininha' } },
                { emoji: '🐔', nome: { 'pt-PT': 'Galinha: fina, com garras', 'pt-BR': 'Galinha: fina, com garras' } },
                { emoji: '🐘', nome: { 'pt-PT': 'Elefante: redonda e grande', 'pt-BR': 'Elefante: redonda e grande' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira as pegadas com garras. Depois vê qual das que sobram é maior.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire as pegadas com garras. Depois veja qual das que sobram é maior.',
            },
          },
        ],
      },
    },
    {
      id: 'ampulheta',
      nome: { 'pt-PT': 'Ampulheta', 'pt-BR': 'Ampulheta' },
      emoji: '⏳',
      zona: { x: 49.5, y: 72.9, largura: 14.7, altura: 34.2 },
      sucesso: {
        'pt-PT': 'A areia caiu toda e desenhou o número {n}!',
        'pt-BR': 'A areia caiu toda e desenhou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destas ampulhetas já acabou? A areia já está toda em baixo.',
                'pt-BR': 'Qual destas ampulhetas já acabou? A areia já está toda embaixo.',
              },
              opcoes: [
                { emoji: '⏳', nome: { 'pt-PT': 'Primeira ampulheta', 'pt-BR': 'Primeira ampulheta' } },
                { emoji: '⌛', nome: { 'pt-PT': 'Segunda ampulheta', 'pt-BR': 'Segunda ampulheta' } },
                { emoji: '⏳', nome: { 'pt-PT': 'Terceira ampulheta', 'pt-BR': 'Terceira ampulheta' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: olha para a parte de cima de cada ampulheta. Em qual já não há areia a cair?',
              'pt-BR': 'Dica: olhe a parte de cima de cada ampulheta. Em qual não tem mais areia caindo?',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe por ordem, do que demora menos ao que demora mais: piscar os olhos, lavar os dentes, almoçar e dormir a noite toda.',
                'pt-BR': 'Coloque em ordem, do que demora menos ao que demora mais: piscar os olhos, escovar os dentes, almoçar e dormir a noite toda.',
              },
              itens: ['😉', '🪥', '🍽️', '🛌'],
            },
            dica: {
              'pt-PT': 'Dica: piscar os olhos é rapidíssimo. Dormir a noite toda é o que demora mais.',
              'pt-BR': 'Dica: piscar os olhos é rapidinho. Dormir a noite toda é o que demora mais.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⏳ ⌛ ⏳ ⌛ ⏳',
              pergunta: {
                'pt-PT': 'Quantas ampulhetas há na mesa? Escreve o número.',
                'pt-BR': 'Quantas ampulhetas tem na mesa? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as ampulhetas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as ampulhetas uma por uma, com o dedo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '📅',
              pergunta: {
                'pt-PT': 'Hoje é segunda-feira. Que dia é amanhã?',
                'pt-BR': 'Hoje é segunda-feira. Que dia é amanhã?',
              },
              opcoes: [
                { emoji: '📅', nome: { 'pt-PT': 'Domingo', 'pt-BR': 'Domingo' } },
                { emoji: '📅', nome: { 'pt-PT': 'Terça-feira', 'pt-BR': 'Terça-feira' } },
                { emoji: '📅', nome: { 'pt-PT': 'Quarta-feira', 'pt-BR': 'Quarta-feira' } },
                { emoji: '📅', nome: { 'pt-PT': 'Sábado', 'pt-BR': 'Sábado' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: amanhã é o dia que vem logo a seguir. Diz os dias da semana a partir de segunda-feira.',
              'pt-BR': 'Dica: amanhã é o dia que vem logo depois. Fale os dias da semana a partir de segunda-feira.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '📅',
              pergunta: {
                'pt-PT': 'Hoje é segunda-feira. Que dia foi ontem?',
                'pt-BR': 'Hoje é segunda-feira. Que dia foi ontem?',
              },
              opcoes: [
                { emoji: '📅', nome: { 'pt-PT': 'Terça-feira', 'pt-BR': 'Terça-feira' } },
                { emoji: '📅', nome: { 'pt-PT': 'Sábado', 'pt-BR': 'Sábado' } },
                { emoji: '📅', nome: { 'pt-PT': 'Domingo', 'pt-BR': 'Domingo' } },
                { emoji: '📅', nome: { 'pt-PT': 'Sexta-feira', 'pt-BR': 'Sexta-feira' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: ontem é o dia que vem logo antes. Que dia da semana vem antes da segunda-feira?',
              'pt-BR': 'Dica: ontem é o dia que vem logo antes. Que dia da semana vem antes da segunda-feira?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⏳ ⏳',
              pergunta: {
                'pt-PT':
                  'Viraste a ampulheta de 3 minutos e, quando acabou, viraste a de 2 minutos. Quantos minutos passaram?',
                'pt-BR':
                  'Você virou a ampulheta de 3 minutos e, quando acabou, virou a de 2 minutos. Quantos minutos passaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e conta mais dois: quatro, cinco...',
              'pt-BR': 'Dica: comece no 3 e conte mais dois: quatro, cinco...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '📅',
              pergunta: {
                'pt-PT': 'Anteontem foi sábado. Que dia é hoje?',
                'pt-BR': 'Anteontem foi sábado. Que dia é hoje?',
              },
              opcoes: [
                { emoji: '📅', nome: { 'pt-PT': 'Domingo', 'pt-BR': 'Domingo' } },
                { emoji: '📅', nome: { 'pt-PT': 'Segunda-feira', 'pt-BR': 'Segunda-feira' } },
                { emoji: '📅', nome: { 'pt-PT': 'Sexta-feira', 'pt-BR': 'Sexta-feira' } },
                { emoji: '📅', nome: { 'pt-PT': 'Terça-feira', 'pt-BR': 'Terça-feira' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: anteontem foi há dois dias. Começa no sábado e anda dois dias para a frente.',
              'pt-BR': 'Dica: anteontem foi há dois dias. Comece no sábado e ande dois dias para a frente.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⏳ ⏳ ⏳',
              pergunta: {
                'pt-PT': 'A areia da ampulheta demora 3 minutos a cair. Viraste-a 3 vezes. Quantos minutos passaram?',
                'pt-BR': 'A areia da ampulheta demora 3 minutos para cair. Você virou a ampulheta 3 vezes. Quantos minutos passaram?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: 3 minutos da primeira vez, mais 3 da segunda, mais 3 da terceira.',
              'pt-BR': 'Dica: 3 minutos da primeira vez, mais 3 da segunda, mais 3 da terceira.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🏫',
              pergunta: {
                'pt-PT': 'Põe os dias da escola por ordem, do primeiro ao último da semana.',
                'pt-BR': 'Coloque os dias de aula em ordem, do primeiro ao último da semana.',
              },
              itens: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
            },
            dica: {
              'pt-PT': 'Dica: a semana da escola começa na segunda-feira, a seguir ao domingo.',
              'pt-BR': 'Dica: a semana de aula começa na segunda-feira, depois do domingo.',
            },
          },
        ],
      },
    },
    {
      id: 'globo',
      nome: { 'pt-PT': 'Globo', 'pt-BR': 'Globo' },
      emoji: '🌍',
      zona: { x: 92.2, y: 75.6, largura: 13.8, altura: 27 },
      sucesso: {
        'pt-PT': 'O globo rodou e parou no número {n}!',
        'pt-BR': 'O globo girou e parou no número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍',
              pergunta: {
                'pt-PT': 'No globo há animais do mundo inteiro. Qual destes animais voa?',
                'pt-BR': 'No globo tem animais do mundo inteiro. Qual destes animais voa?',
              },
              opcoes: [
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '🐘', nome: { 'pt-PT': 'Elefante', 'pt-BR': 'Elefante' } },
                { emoji: '🦅', nome: { 'pt-PT': 'Águia', 'pt-BR': 'Águia' } },
                { emoji: '🐊', nome: { 'pt-PT': 'Crocodilo', 'pt-BR': 'Crocodilo' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: para voar é preciso ter asas. Qual destes animais tem asas?',
              'pt-BR': 'Dica: para voar é preciso ter asas. Qual destes animais tem asas?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐘 🦒 🐧 🐨 🐪 🐼',
              pergunta: {
                'pt-PT': 'Quantos animais há desenhados no globo? Escreve o número.',
                'pt-BR': 'Quantos animais tem desenhados no globo? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os animais um a um, com o dedo.',
              'pt-BR': 'Dica: conte os animais um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os animais saltaram do globo! Encontra os pares iguais.',
                'pt-BR': 'Os animais pularam do globo! Encontre os pares iguais.',
              },
              emojis: ['🐘', '🦒', '🐧', '🐨'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destes animais tem o corpo coberto de escamas?',
                'pt-BR': 'Qual destes animais tem o corpo coberto de escamas?',
              },
              opcoes: [
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
                { emoji: '🐈', nome: { 'pt-PT': 'Gato', 'pt-BR': 'Gato' } },
                { emoji: '🐑', nome: { 'pt-PT': 'Ovelha', 'pt-BR': 'Ovelha' } },
                { emoji: '🐒', nome: { 'pt-PT': 'Macaco', 'pt-BR': 'Macaco' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: três destes animais têm pelo ou lã. Qual vive dentro de água?',
              'pt-BR': 'Dica: três destes animais têm pelo ou lã. Qual vive dentro da água?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐧 🐘 🦅 🐟 🦜 🐒',
              pergunta: {
                'pt-PT': 'Quantas aves há no globo? Não contes os outros animais.',
                'pt-BR': 'Quantas aves tem no globo? Não conte os outros animais.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: as aves têm bico e penas. Conta só essas.',
              'pt-BR': 'Dica: as aves têm bico e penas. Conte só essas.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destes animais é um inseto?',
                'pt-BR': 'Qual destes animais é um inseto?',
              },
              opcoes: [
                { emoji: '🐦', nome: { 'pt-PT': 'Pássaro', 'pt-BR': 'Passarinho' } },
                { emoji: '🐸', nome: { 'pt-PT': 'Rã', 'pt-BR': 'Sapo' } },
                { emoji: '🐝', nome: { 'pt-PT': 'Abelha', 'pt-BR': 'Abelha' } },
                { emoji: '🐁', nome: { 'pt-PT': 'Rato', 'pt-BR': 'Rato' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os insetos são pequeninos e têm seis patas.',
              'pt-BR': 'Dica: os insetos são pequenininhos e têm seis patas.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Os mamíferos bebem o leite da mãe. Qual destes é um mamífero que voa?',
                'pt-BR': 'Os mamíferos mamam o leite da mãe. Qual destes é um mamífero que voa?',
              },
              opcoes: [
                { emoji: '🦅', nome: { 'pt-PT': 'Águia', 'pt-BR': 'Águia' } },
                { emoji: '🦋', nome: { 'pt-PT': 'Borboleta', 'pt-BR': 'Borboleta' } },
                { emoji: '🐝', nome: { 'pt-PT': 'Abelha', 'pt-BR': 'Abelha' } },
                { emoji: '🦇', nome: { 'pt-PT': 'Morcego', 'pt-BR': 'Morcego' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a águia é uma ave, e a borboleta e a abelha são insetos. Qual sobra?',
              'pt-BR': 'Dica: a águia é uma ave, e a borboleta e a abelha são insetos. Qual sobra?',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Os répteis têm escamas e põem ovos, como os dinossauros. Qual destes é um réptil?',
                'pt-BR': 'Os répteis têm escamas e botam ovos, como os dinossauros. Qual destes é um réptil?',
              },
              opcoes: [
                { emoji: '🐸', nome: { 'pt-PT': 'Rã', 'pt-BR': 'Sapo' } },
                { emoji: '🐢', nome: { 'pt-PT': 'Tartaruga', 'pt-BR': 'Tartaruga' } },
                { emoji: '🐟', nome: { 'pt-PT': 'Peixe', 'pt-BR': 'Peixe' } },
                { emoji: '🐧', nome: { 'pt-PT': 'Pinguim', 'pt-BR': 'Pinguim' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o peixe vive só na água e o pinguim tem penas. A pele da rã é lisa e molhada.',
              'pt-BR': 'Dica: o peixe vive só na água e o pinguim tem penas. A pele do sapo é lisa e molhada.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐘 🦅 🐟 🐄 🐢 🐍 🦋 🐒',
              pergunta: {
                'pt-PT': 'Quantos animais do globo não são mamíferos?',
                'pt-BR': 'Quantos animais do globo não são mamíferos?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: o elefante, a vaca e o macaco são mamíferos. Não os contes e conta os outros.',
              'pt-BR': 'Dica: o elefante, a vaca e o macaco são mamíferos. Não conte esses e conte os outros.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'escavacao',
      nome: { 'pt-PT': 'Escavação', 'pt-BR': 'Escavação' },
      emoji: '⛏️',
      zona: { x: 72.5, y: 81, largura: 25, altura: 19.6 },
      recompensa: {
        id: 'chave',
        emoji: '🗝️',
        nome: { 'pt-PT': 'Chave do caixote', 'pt-BR': 'Chave do caixote' },
      },
      sucesso: {
        'pt-PT': 'Debaixo da areia estava a chave do caixote! 🗝️',
        'pt-BR': 'Embaixo da areia estava a chave do caixote! 🗝️',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Na areia da escavação há coisas escondidas. Encontra os pares iguais!',
                'pt-BR': 'Na areia da escavação tem coisas escondidas. Encontre os pares iguais!',
              },
              emojis: ['🦴', '🦕', '⛏️', '🪨'],
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴 🦴 🦴 🦴 🦴',
              pergunta: {
                'pt-PT': 'Quantos ossos há na areia? Escreve o número.',
                'pt-BR': 'Quantos ossos tem na areia? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Conta os ossos um a um.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Conte os ossos um por um.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Para achar a chave tens de escavar. O que serve para escavar?',
                'pt-BR': 'Para achar a chave você precisa escavar. O que serve para escavar?',
              },
              opcoes: [
                { emoji: '🍰', nome: { 'pt-PT': 'Bolo', 'pt-BR': 'Bolo' } },
                { emoji: '⛏️', nome: { 'pt-PT': 'Picareta', 'pt-BR': 'Picareta' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Procura uma ferramenta dura e pontiaguda.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Procure uma ferramenta dura e pontuda.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Na areia da escavação há coisas escondidas. Encontra os cinco pares iguais!',
                'pt-BR': 'Na areia da escavação tem coisas escondidas. Encontre os cinco pares iguais!',
              },
              emojis: ['🦴', '🦕', '⛏️', '🪨', '🦷'],
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴 🦴 ➕ 🦴 🦴 🦴',
              pergunta: {
                'pt-PT': 'A cientista achou 2 ossos ontem e 3 ossos hoje. Quantos ossos achou?',
                'pt-BR': 'A cientista achou 2 ossos ontem e 3 ossos hoje. Quantos ossos ela achou?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Começa no 2 e conta mais três.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Comece no 2 e conte mais três.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada animal a uma parte do seu corpo, como o T-rex e o osso!',
                'pt-BR': 'Junte cada animal com uma parte do corpo dele, como o T-rex e o osso!',
              },
              emojis: [
                ['🦖', '🦴'],
                ['🐢', '🐚'],
                ['🐘', '🦷'],
                ['🐦', '🪶'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. As duas cartas do par não são iguais: o pássaro vai com a pena.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. As duas cartas do par não são iguais: o passarinho vai com a pena.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta cada animal a uma coisa que é dele, como o T-rex e o osso!',
                'pt-BR': 'Junte cada animal com uma coisa que é dele, como o T-rex e o osso!',
              },
              emojis: [
                ['🦖', '🦴'],
                ['🐢', '🐚'],
                ['🐘', '🦷'],
                ['🐦', '🪶'],
                ['🦕', '🥚'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. As duas cartas do par não são iguais: a tartaruga vai com a carapaça.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. As duas cartas do par não são iguais: a tartaruga vai com o casco.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴🦴 🦴🦴 🦴🦴',
              pergunta: {
                'pt-PT': 'A cientista achou 2 ossos por dia durante 3 dias, mas perdeu 1. Quantos ossos tem?',
                'pt-BR': 'A cientista achou 2 ossos por dia durante 3 dias, mas perdeu 1. Quantos ossos ela tem?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Primeiro conta os ossos dos 3 dias. Depois tira o que perdeu.',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Primeiro conte os ossos dos 3 dias. Depois tire o que ela perdeu.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴 ▬▬▬▬  🪏 ▬▬',
              pergunta: {
                'pt-PT': 'O osso mede 4 palmos e a pá mede 2. Quantas pás seguidas medem o mesmo que o osso?',
                'pt-BR': 'O osso mede 4 palmos e a pá mede 2. Quantas pás em fila medem o mesmo que o osso?',
              },
              resposta: '2',
            },
            dica: {
              'pt-PT': 'Dica: a chave do caixote está na escavação. Põe uma pá ao lado do osso: 2 palmos. Quantas faltam até 4?',
              'pt-BR': 'Dica: a chave do caixote está na escavação. Coloque uma pá do lado do osso: 2 palmos. Quantas faltam até 4?',
            },
          },
        ],
      },
    },
    {
      id: 'caixote',
      nome: { 'pt-PT': 'Caixote trancado', 'pt-BR': 'Caixote trancado' },
      emoji: '📦',
      zona: { x: 10, y: 78.3, largura: 18.8, altura: 20 },
      requer: 'chave',
      bloqueado: {
        'pt-PT': 'O caixote está trancado. Procura uma chave!',
        'pt-BR': 'O caixote está trancado. Procure uma chave!',
      },
      recompensa: {
        id: 'lanterna',
        emoji: '🔦',
        nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' },
      },
      sucesso: {
        'pt-PT': 'Dentro do caixote havia uma lanterna! Agora já podes ver a vitrine. 🔦',
        'pt-BR': 'Dentro do caixote havia uma lanterna! Agora você já pode ver a vitrine. 🔦',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'No caixote há quatro ossos. Põe-nos por ordem, do mais curto ao mais comprido.',
                'pt-BR': 'No caixote tem quatro ossos. Coloque em ordem, do mais curto ao mais comprido.',
              },
              itens: ['▬', '▬▬', '▬▬▬', '▬▬▬▬'],
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Começa pelo osso mais pequenino.',
              'pt-BR': 'Dica: a lanterna está no caixote. Comece pelo osso menorzinho.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴 🪨 🐚 🦴 🪨 🐚',
              pergunta: {
                'pt-PT': 'Quantas coisas há no caixote? Escreve o número.',
                'pt-BR': 'Quantas coisas tem no caixote? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Conta as coisas uma a uma, com o dedo.',
              'pt-BR': 'Dica: a lanterna está no caixote. Conte as coisas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O museu está escuro. Qual destas coisas do caixote dá luz?',
                'pt-BR': 'O museu está escuro. Qual destas coisas do caixote dá luz?',
              },
              opcoes: [
                { emoji: '🪨', nome: { 'pt-PT': 'Pedra', 'pt-BR': 'Pedra' } },
                { emoji: '🦴', nome: { 'pt-PT': 'Osso', 'pt-BR': 'Osso' } },
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '🔦', nome: { 'pt-PT': 'Lanterna', 'pt-BR': 'Lanterna' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Qual destas coisas se liga com um botão?',
              'pt-BR': 'Dica: a lanterna está no caixote. Qual destas coisas a gente liga com um botão?',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'No caixote há cinco ossos. Põe-nos por ordem, do mais curto ao mais comprido.',
                'pt-BR': 'No caixote tem cinco ossos. Coloque em ordem, do mais curto ao mais comprido.',
              },
              itens: ['▬', '▬▬', '▬▬▬', '▬▬▬▬', '▬▬▬▬▬'],
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Começa pelo osso mais pequenino e procura sempre o seguinte.',
              'pt-BR': 'Dica: a lanterna está no caixote. Comece pelo osso menorzinho e procure sempre o próximo.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🦴 🦴 🦴 🦴 🦴 🦴 🦴 🦴',
              pergunta: {
                'pt-PT': 'O caixote tem 8 ossos e tiraste 3. Quantos ossos ficaram no caixote?',
                'pt-BR': 'O caixote tem 8 ossos e você tirou 3. Quantos ossos ficaram no caixote?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Tapa 3 ossos com o dedo e conta os que sobram.',
              'pt-BR': 'Dica: a lanterna está no caixote. Cubra 3 ossos com o dedo e conte os que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦴 ▬▬▬',
              pergunta: {
                'pt-PT': 'Qual destas fitas mede o mesmo que o osso?',
                'pt-BR': 'Qual destas fitas mede o mesmo que o osso?',
              },
              opcoes: [
                { emoji: '📏 ▬▬', nome: { 'pt-PT': 'Fita vermelha', 'pt-BR': 'Fita vermelha' } },
                { emoji: '📏 ▬▬▬', nome: { 'pt-PT': 'Fita azul', 'pt-BR': 'Fita azul' } },
                { emoji: '📏 ▬▬▬▬', nome: { 'pt-PT': 'Fita verde', 'pt-BR': 'Fita verde' } },
                { emoji: '📏 ▬', nome: { 'pt-PT': 'Fita amarela', 'pt-BR': 'Fita amarela' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Conta os bocadinhos do risco do osso e procura uma fita igual.',
              'pt-BR': 'Dica: a lanterna está no caixote. Conte os pedacinhos do risco do osso e procure uma fita igual.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Cada osso tem o comprimento escrito em palmos. Põe-nos por ordem, do mais curto ao mais comprido.',
                'pt-BR': 'Cada osso tem o comprimento escrito em palmos. Coloque em ordem, do mais curto ao mais comprido.',
              },
              itens: ['🦴 1', '🦴 2', '🦴 4', '🦴 5', '🦴 7', '🦴 9'],
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Olha só para os números: começa no mais pequeno.',
              'pt-BR': 'Dica: a lanterna está no caixote. Olhe só os números: comece pelo menor.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🦴 2 ➕ 🦴 2',
              pergunta: {
                'pt-PT': 'Cada osso pequeno mede 2 palmos. Qual osso mede o mesmo que 2 ossos pequenos juntos?',
                'pt-BR': 'Cada osso pequeno mede 2 palmos. Qual osso mede o mesmo que 2 ossos pequenos juntos?',
              },
              opcoes: [
                { emoji: '🦴', nome: { 'pt-PT': '3 palmos', 'pt-BR': '3 palmos' } },
                { emoji: '🦴', nome: { 'pt-PT': '4 palmos', 'pt-BR': '4 palmos' } },
                { emoji: '🦴', nome: { 'pt-PT': '5 palmos', 'pt-BR': '5 palmos' } },
                { emoji: '🦴', nome: { 'pt-PT': '6 palmos', 'pt-BR': '6 palmos' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Junta os dois ossos pequenos: 2 palmos e mais 2.',
              'pt-BR': 'Dica: a lanterna está no caixote. Junte os dois ossos pequenos: 2 palmos e mais 2.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🐚🐚🐚 🐚🐚🐚 🐚🐚▫️',
              pergunta: {
                'pt-PT': 'No caixote há 3 filas de 3 fósseis, mas falta 1. Quantos fósseis há?',
                'pt-BR': 'No caixote tem 3 filas de 3 fósseis, mas falta 1. Quantos fósseis tem?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: a lanterna está no caixote. Primeiro conta as 3 filas cheias: 3, mais 3, mais 3. Depois tira o que falta.',
              'pt-BR': 'Dica: a lanterna está no caixote. Primeiro conte as 3 filas cheias: 3, mais 3, mais 3. Depois tire o que falta.',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Porta do museu', 'pt-BR': 'Porta do museu' },
    emoji: '🚪',
    zona: { x: 50, y: 35.6, largura: 15, altura: 33.8 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa do museu que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa do museu que esconde um número. Digite os números na ordem dos desenhos.',
    },
    dicaVer: {
      'pt-PT': 'Dica: toca na porta grande para ver o cadeado. Os desenhos mostram onde estão os números.',
      'pt-BR': 'Dica: toque na porta grande para ver o cadeado. Os desenhos mostram onde estão os números.',
    },
    dica: {
      'pt-PT': 'Dica: já tens todos os números! Escreve-os no cadeado pela ordem dos desenhos.',
      'pt-BR': 'Dica: você já tem todos os números! Digite no cadeado na ordem dos desenhos.',
    },
  },
  vitoria: {
    'pt-PT':
      'Clique! O cadeado abriu e a porta grande rangeu. Lá fora, a professora e os colegas estavam à tua procura. Que noite no museu!',
    'pt-BR':
      'Clique! O cadeado abriu e a porta grande rangeu. Lá fora, a professora e os colegas estavam procurando você. Que noite no museu!',
  },
};
