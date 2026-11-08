import type { Sala } from '../tipos';

/**
 * A Nave Espacial. A saída é sempre a escotilha; o código (3 ou 4 números) sai de objetos sorteados entre os 9
 * abaixo, cada um com várias versões do enigma. O armário e o bichinho são extras: o armário dá o cartão de
 * acesso do robô e o bichinho dá a chave-estrela das caixas de carga.
 * Cada objeto tem enigmas por nível: fácil (4 a 5 anos: contar e reconhecer), médio (6 a 7 anos: uma conta ou
 * uma regra simples) e difícil (8 anos ou mais: dois passos). Foco desta sala: sequências numéricas (de 2 em 2,
 * contagem para trás), regras de padrões e lógica de pistas.
 * As zonas cobrem os objetos do fundo (imagens/saida-secreta/nave.jpg); para conferir, abra a sala com ?zonas.
 */
export const nave: Sala = {
  id: 'nave',
  emoji: '🚀',
  cor: '#a9b8ff',
  titulo: { 'pt-PT': 'A Nave Espacial', 'pt-BR': 'A Nave Espacial' },
  resumo: {
    'pt-PT': 'A escotilha fechou-se e ficaste preso na nave. Descobre o código!',
    'pt-BR': 'A escotilha se fechou e você ficou preso na nave. Descubra o código!',
  },
  intro: {
    'pt-PT':
      'Foste visitar a nave da Capitã Estrela. De repente, um meteorito passou muito perto e a escotilha fechou-se sozinha! Na escotilha há um cadeado com desenhos de coisas da nave. Cada uma dessas coisas esconde um número. Descobre os números e abre a escotilha!',
    'pt-BR':
      'Você foi visitar a nave da Capitã Estrela. De repente, um meteorito passou muito perto e a escotilha se fechou sozinha! Na escotilha tem um cadeado com desenhos de coisas da nave. Cada uma dessas coisas esconde um número. Descubra os números e abra a escotilha!',
  },
  fundo: 'imagens/saida-secreta/nave.jpg',
  fundoCss: 'linear-gradient(180deg, #1b1f4a 0%, #2c3170 60%, #c9d4f0 100%)',
  digitos: { facil: [3], medio: [3, 4], dificil: [4] },
  semNumero: {
    'pt-PT': 'Procuraste bem, mas aqui não há nenhum número desta vez. Olha para o cadeado da escotilha!',
    'pt-BR': 'Você procurou bem, mas aqui não tem nenhum número desta vez. Olhe o cadeado da escotilha!',
  },
  fontes: [
    {
      id: 'janela',
      nome: { 'pt-PT': 'Janela dos planetas', 'pt-BR': 'Janela dos planetas' },
      emoji: '🪐',
      zona: { x: 23, y: 21.9, largura: 21.4, altura: 28.6 },
      sucesso: {
        'pt-PT': 'Um planeta brilhou na janela e mostrou o número {n}!',
        'pt-BR': 'Um planeta brilhou na janela e mostrou o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🪐 🌍 🌕 🪐 🌍',
              pergunta: {
                'pt-PT': 'Quantos planetas se veem pela janela? Escreve o número.',
                'pt-BR': 'Quantos planetas dá para ver pela janela? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta os planetas um a um, com o dedo.',
              'pt-BR': 'Dica: conte os planetas um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Pela janela vês um planeta com anéis à volta. Qual é?',
                'pt-BR': 'Pela janela você vê um planeta com anéis em volta. Qual é?',
              },
              opcoes: [
                { emoji: '🌍', nome: { 'pt-PT': 'Terra', 'pt-BR': 'Terra' } },
                { emoji: '🌕', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '🪐', nome: { 'pt-PT': 'Saturno', 'pt-BR': 'Saturno' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: os anéis são como um arco à volta da bola.',
              'pt-BR': 'Dica: os anéis são como um arco em volta da bola.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os planetas fugiram pela janela! Encontra os pares iguais.',
                'pt-BR': 'Os planetas fugiram pela janela! Encontre os pares iguais.',
              },
              emojis: ['🪐', '🌍', '🌕', '☀️'],
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
              visual: '5️⃣ 4️⃣ ❔ 2️⃣ 1️⃣',
              pergunta: {
                'pt-PT': 'A nave conta para trás antes de partir: 5, 4, ?, 2, 1. Que número falta? Escreve o número.',
                'pt-BR': 'A nave conta para trás antes de partir: 5, 4, ?, 2, 1. Que número falta? Digite o número.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: conta para trás devagar, a começar no cinco: cinco, quatro...',
              'pt-BR': 'Dica: conte para trás devagar, começando no cinco: cinco, quatro...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍 🪐 🌍 🪐 ❔',
              pergunta: {
                'pt-PT': 'Os planetas da janela seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'Os planetas da janela seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🌍', nome: { 'pt-PT': 'Terra', 'pt-BR': 'Terra' } },
                { emoji: '🪐', nome: { 'pt-PT': 'Saturno', 'pt-BR': 'Saturno' } },
                { emoji: '🌕', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: os planetas vão trocando: Terra, Saturno, Terra, Saturno...',
              'pt-BR': 'Dica: os planetas vão trocando: Terra, Saturno, Terra, Saturno...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🚀',
              pergunta: {
                'pt-PT': 'A nave vai partir! Põe os números pela ordem da contagem para trás, do 5 até ao 1.',
                'pt-BR': 'A nave vai partir! Coloque os números na ordem da contagem regressiva, do 5 até o 1.',
              },
              itens: ['5', '4', '3', '2', '1'],
            },
            dica: {
              'pt-PT': 'Dica: começa no número maior. Depois vem sempre o número de antes.',
              'pt-BR': 'Dica: comece no número maior. Depois vem sempre o número anterior.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '9️⃣ 8️⃣ 7️⃣ ❔ 5️⃣',
              pergunta: {
                'pt-PT': 'A nave conta para trás: 9, 8, 7, ?, 5. Que número falta? Escreve o número.',
                'pt-BR': 'A nave conta para trás: 9, 8, 7, ?, 5. Que número falta? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: diz os números para trás a partir do nove: nove, oito, sete...',
              'pt-BR': 'Dica: fale os números para trás a partir do nove: nove, oito, sete...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔟 8️⃣ 6️⃣ ❔',
              pergunta: {
                'pt-PT': 'Agora a contagem salta de 2 em 2 para trás: 10, 8, 6... Que número vem a seguir?',
                'pt-BR': 'Agora a contagem pula de 2 em 2 para trás: 10, 8, 6... Que número vem depois?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: vê quanto se tira do 10 para o 8. Faz o mesmo ao 6.',
              'pt-BR': 'Dica: veja quanto se tira do 10 para o 8. Faça o mesmo com o 6.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌍 🪐 🌕 🌍 🪐 ❔',
              pergunta: {
                'pt-PT': 'Os planetas da janela seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'Os planetas da janela seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🌍', nome: { 'pt-PT': 'Terra', 'pt-BR': 'Terra' } },
                { emoji: '🪐', nome: { 'pt-PT': 'Saturno', 'pt-BR': 'Saturno' } },
                { emoji: '🌕', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: procura o grupo que se repete. Os planetas repetem-se de três em três.',
              'pt-BR': 'Dica: procure o grupo que se repete. Os planetas se repetem de três em três.',
            },
          },
        ],
      },
    },
    {
      id: 'painel',
      nome: { 'pt-PT': 'Painel de botões', 'pt-BR': 'Painel de botões' },
      emoji: '🔴',
      zona: { x: 22.6, y: 43.4, largura: 20.3, altura: 12.3 },
      sucesso: {
        'pt-PT': 'Os botões acenderam-se e formaram o número {n}!',
        'pt-BR': 'Os botões se acenderam e formaram o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔵🌙',
              pergunta: {
                'pt-PT': 'Qual botão é igual ao modelo, na cor e no desenho?',
                'pt-BR': 'Qual botão é igual ao modelo, na cor e no desenho?',
              },
              opcoes: [
                { emoji: '🔴🌙', nome: { 'pt-PT': 'Vermelho com lua', 'pt-BR': 'Vermelho com lua' } },
                { emoji: '🔵⭐', nome: { 'pt-PT': 'Azul com estrela', 'pt-BR': 'Azul com estrela' } },
                { emoji: '🔵🌙', nome: { 'pt-PT': 'Azul com lua', 'pt-BR': 'Azul com lua' } },
                { emoji: '🔴⭐', nome: { 'pt-PT': 'Vermelho com estrela', 'pt-BR': 'Vermelho com estrela' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: olha primeiro para a cor do modelo. Depois olha para o desenho.',
              'pt-BR': 'Dica: olhe primeiro a cor do modelo. Depois olhe o desenho.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🔴 🟡 🟢 🔵',
              pergunta: {
                'pt-PT': 'Carrega nos botões por ordem: 1, 2, 3, 4.',
                'pt-BR': 'Aperte os botões em ordem: 1, 2, 3, 4.',
              },
              itens: ['1', '2', '3', '4'],
            },
            dica: {
              'pt-PT': 'Dica: começa no 1, o número mais pequeno.',
              'pt-BR': 'Dica: comece no 1, o menor número.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔴 🟢 🔴 🔵 🔴 🟡',
              pergunta: {
                'pt-PT': 'Quantos botões vermelhos há no painel? Escreve o número.',
                'pt-BR': 'Quantos botões vermelhos tem no painel? Digite o número.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: conta só os botões vermelhos. Não contes os outros.',
              'pt-BR': 'Dica: conte só os botões vermelhos. Não conte os outros.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔴 🟢 🔴 🟢 ❔',
              pergunta: {
                'pt-PT': 'Os botões seguem uma regra. Que botão completa a fila?',
                'pt-BR': 'Os botões seguem uma regra. Que botão completa a fila?',
              },
              opcoes: [
                { emoji: '🟢', nome: { 'pt-PT': 'Botão verde', 'pt-BR': 'Botão verde' } },
                { emoji: '🔴', nome: { 'pt-PT': 'Botão vermelho', 'pt-BR': 'Botão vermelho' } },
                { emoji: '🔵', nome: { 'pt-PT': 'Botão azul', 'pt-BR': 'Botão azul' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: as cores vão trocando: vermelho, verde, vermelho, verde...',
              'pt-BR': 'Dica: as cores vão trocando: vermelho, verde, vermelho, verde...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💡💡  💡💡💡  💡💡💡💡  ❔',
              pergunta: {
                'pt-PT': 'As luzes do painel acendem-se: 2, depois 3, depois 4. Quantas se acendem a seguir?',
                'pt-BR': 'As luzes do painel se acendem: 2, depois 3, depois 4. Quantas se acendem depois?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: de cada vez acende-se mais uma luz.',
              'pt-BR': 'Dica: a cada vez se acende mais uma luz.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🔴 🟡 🟢 🔵',
              pergunta: {
                'pt-PT': 'Carrega nos botões do 5 até ao 1, a contar para trás.',
                'pt-BR': 'Aperte os botões do 5 até o 1, contando para trás.',
              },
              itens: ['5', '4', '3', '2', '1'],
            },
            dica: {
              'pt-PT': 'Dica: começa no 5, o número maior.',
              'pt-BR': 'Dica: comece no 5, o maior número.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'ordem',
              visual: '🔴 🟡 🟢 🔵',
              pergunta: {
                'pt-PT': 'Carrega nos botões de 2 em 2, do número mais pequeno ao maior.',
                'pt-BR': 'Aperte os botões de 2 em 2, do menor número ao maior.',
              },
              itens: ['2', '4', '6', '8', '10'],
            },
            dica: {
              'pt-PT': 'Dica: começa no 2 e salta sempre um número.',
              'pt-BR': 'Dica: comece no 2 e pule sempre um número.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔴 🟢 🟢 🔴 🟢 🟢 🔴 ❔',
              pergunta: {
                'pt-PT': 'Os botões seguem uma regra. Que botão completa a fila?',
                'pt-BR': 'Os botões seguem uma regra. Que botão completa a fila?',
              },
              opcoes: [
                { emoji: '🔴', nome: { 'pt-PT': 'Botão vermelho', 'pt-BR': 'Botão vermelho' } },
                { emoji: '🟢', nome: { 'pt-PT': 'Botão verde', 'pt-BR': 'Botão verde' } },
                { emoji: '🔵', nome: { 'pt-PT': 'Botão azul', 'pt-BR': 'Botão azul' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: procura o bocado que se repete: vermelho, verde, verde.',
              'pt-BR': 'Dica: procure o pedaço que se repete: vermelho, verde, verde.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔘',
              pergunta: {
                'pt-PT': 'O botão certo tem mais 2 do que o 5 e menos 1 do que o 8. Que número é? Escreve o número.',
                'pt-BR': 'O botão certo tem 2 a mais que o 5 e 1 a menos que o 8. Que número é? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: primeiro conta mais 2 a partir do 5. Depois confirma com o 8.',
              'pt-BR': 'Dica: primeiro conte mais 2 a partir do 5. Depois confira com o 8.',
            },
          },
        ],
      },
    },
    {
      id: 'radar',
      nome: { 'pt-PT': 'Radar', 'pt-BR': 'Radar' },
      emoji: '📡',
      zona: { x: 74.5, y: 19.8, largura: 16.6, altura: 22.9 },
      sucesso: {
        'pt-PT': 'No ecrã do radar apareceu o número {n}!',
        'pt-BR': 'Na tela do radar apareceu o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟢 🟢 🟢 🟢',
              pergunta: {
                'pt-PT': 'Quantos pontos verdes há no radar? Escreve o número.',
                'pt-BR': 'Quantos pontos verdes tem no radar? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: conta os pontos um a um, com o dedo.',
              'pt-BR': 'Dica: conte os pontos um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🛰️ 🚀 🛸',
              pergunta: {
                'pt-PT': 'Há três naves no radar. Qual está no meio?',
                'pt-BR': 'Tem três naves no radar. Qual está no meio?',
              },
              opcoes: [
                { emoji: '🛰️', nome: { 'pt-PT': 'Satélite', 'pt-BR': 'Satélite' } },
                { emoji: '🚀', nome: { 'pt-PT': 'Foguetão', 'pt-BR': 'Foguete' } },
                { emoji: '🛸', nome: { 'pt-PT': 'Disco voador', 'pt-BR': 'Disco voador' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o meio fica entre a nave da esquerda e a nave da direita.',
              'pt-BR': 'Dica: o meio fica entre a nave da esquerda e a nave da direita.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O radar encontrou naves! Encontra os pares de naves iguais.',
                'pt-BR': 'O radar achou naves! Encontre os pares de naves iguais.',
              },
              emojis: ['🚀', '🛸', '🛰️', '✈️'],
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
              visual: '🛸 ⚫ ⚫ ⚫ 🎯 ⚫ 🚀 ⚫ ⚫ 🛰️',
              pergunta: {
                'pt-PT': 'O alvo é o centro do radar. Qual nave está mais perto do centro?',
                'pt-BR': 'O alvo é o centro do radar. Qual nave está mais perto do centro?',
              },
              opcoes: [
                { emoji: '🛸', nome: { 'pt-PT': 'Disco voador', 'pt-BR': 'Disco voador' } },
                { emoji: '🚀', nome: { 'pt-PT': 'Foguetão', 'pt-BR': 'Foguete' } },
                { emoji: '🛰️', nome: { 'pt-PT': 'Satélite', 'pt-BR': 'Satélite' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: conta as bolinhas entre o alvo e cada nave.',
              'pt-BR': 'Dica: conte as bolinhas entre o alvo e cada nave.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟢🟢  🟢🟢🟢  🟢🟢🟢🟢  ❔',
              pergunta: {
                'pt-PT': 'Os pontos aparecem no radar: 2, depois 3, depois 4. Quantos aparecem a seguir?',
                'pt-BR': 'Os pontos aparecem no radar: 2, depois 3, depois 4. Quantos aparecem depois?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: de cada vez aparece mais um ponto.',
              'pt-BR': 'Dica: a cada vez aparece mais um ponto.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '💡 ⚫ 💡 ⚫ ❔',
              pergunta: {
                'pt-PT': 'A luz do radar pisca com uma regra. O que vem a seguir?',
                'pt-BR': 'A luz do radar pisca com uma regra. O que vem depois?',
              },
              opcoes: [
                { emoji: '💡', nome: { 'pt-PT': 'Luz acesa', 'pt-BR': 'Luz acesa' } },
                { emoji: '⚫', nome: { 'pt-PT': 'Luz apagada', 'pt-BR': 'Luz apagada' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: a luz vai trocando: acesa, apagada, acesa, apagada...',
              'pt-BR': 'Dica: a luz vai trocando: acesa, apagada, acesa, apagada...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '1️⃣ 3️⃣ 5️⃣ 7️⃣ ❔',
              pergunta: {
                'pt-PT': 'Os pontos aparecem no radar: 1, 3, 5, 7... Quantos aparecem a seguir?',
                'pt-BR': 'Os pontos aparecem no radar: 1, 3, 5, 7... Quantos aparecem depois?',
              },
              resposta: '9',
            },
            dica: {
              'pt-PT': 'Dica: vê quanto cresce de um número para o seguinte.',
              'pt-BR': 'Dica: veja quanto cresce de um número para o próximo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A nave amiga não está no centro, não é a maior e tem luz verde. Qual é?',
                'pt-BR': 'A nave amiga não está no centro, não é a maior e tem luz verde. Qual é?',
              },
              opcoes: [
                { emoji: '🛸🟢', nome: { 'pt-PT': 'Nave grande de luz verde', 'pt-BR': 'Nave grande de luz verde' } },
                {
                  emoji: '🚀🟢',
                  nome: { 'pt-PT': 'Nave pequena de luz verde, no centro', 'pt-BR': 'Nave pequena de luz verde, no centro' },
                },
                {
                  emoji: '🛰️🟢',
                  nome: { 'pt-PT': 'Nave pequena de luz verde, na ponta', 'pt-BR': 'Nave pequena de luz verde, na ponta' },
                },
                { emoji: '🚀🔴', nome: { 'pt-PT': 'Nave pequena de luz vermelha', 'pt-BR': 'Nave pequena de luz vermelha' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira a nave que está no centro.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire a nave que está no centro.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢',
              pergunta: {
                'pt-PT': 'Há 9 pontos no radar e em cada volta desaparecem 2. Quantos ficam ao fim de 3 voltas?',
                'pt-BR': 'Tem 9 pontos no radar e a cada volta somem 2. Quantos ficam depois de 3 voltas?',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: tira 2 de cada vez, três vezes: 9, 7...',
              'pt-BR': 'Dica: tire 2 de cada vez, três vezes: 9, 7...',
            },
          },
        ],
      },
    },
    {
      id: 'robo',
      nome: { 'pt-PT': 'Robô ajudante', 'pt-BR': 'Robô ajudante' },
      emoji: '🤖',
      zona: { x: 74.1, y: 46, largura: 15.6, altura: 27.9 },
      requer: 'cartao',
      bloqueado: {
        'pt-PT': 'O robô está desligado. Procura um cartão de acesso para o ligar!',
        'pt-BR': 'O robô está desligado. Procure um cartão de acesso para ligá-lo!',
      },
      sucesso: {
        'pt-PT': 'O robô ligou-se e mostrou no ecrã o número {n}!',
        'pt-BR': 'O robô se ligou e mostrou na tela o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🤖',
              pergunta: {
                'pt-PT': 'O robô tem cabeça, corpo e pernas, mas falta-lhe uma peça para apanhar as coisas. Qual é?',
                'pt-BR': 'O robô tem cabeça, corpo e pernas, mas falta uma peça para ele pegar as coisas. Qual é?',
              },
              opcoes: [
                { emoji: '🛞', nome: { 'pt-PT': 'Roda', 'pt-BR': 'Roda' } },
                { emoji: '🦾', nome: { 'pt-PT': 'Braço', 'pt-BR': 'Braço' } },
                { emoji: '📡', nome: { 'pt-PT': 'Antena', 'pt-BR': 'Antena' } },
                { emoji: '💡', nome: { 'pt-PT': 'Lâmpada', 'pt-BR': 'Lâmpada' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: pensa no que usas para apanhar uma bola.',
              'pt-BR': 'Dica: pense no que você usa para pegar uma bola.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🤖 💡💡💡💡💡💡',
              pergunta: {
                'pt-PT': 'Quantas luzes tem o robô? Escreve o número.',
                'pt-BR': 'Quantas luzes o robô tem? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta as luzes uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as luzes uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🤖',
              pergunta: {
                'pt-PT': 'Ajuda a montar o robô, de baixo para cima: as pernas, o corpo com a bateria, a cabeça e a antena.',
                'pt-BR': 'Ajude a montar o robô, de baixo para cima: as pernas, o corpo com a bateria, a cabeça e a antena.',
              },
              itens: ['🦿', '🔋', '🤖', '📡'],
            },
            dica: {
              'pt-PT': 'Dica: o robô fica de pé em cima das pernas. A antena vai no topo.',
              'pt-BR': 'Dica: o robô fica de pé em cima das pernas. A antena vai no topo.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '⚙️ 🔩 ⚙️ 🔩 ❔',
              pergunta: {
                'pt-PT': 'As peças do robô seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'As peças do robô seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🔩', nome: { 'pt-PT': 'Parafuso', 'pt-BR': 'Parafuso' } },
                { emoji: '⚙️', nome: { 'pt-PT': 'Roda dentada', 'pt-BR': 'Engrenagem' } },
                { emoji: '🔧', nome: { 'pt-PT': 'Chave inglesa', 'pt-BR': 'Chave inglesa' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: as peças vão trocando: roda dentada, parafuso, roda dentada, parafuso...',
              'pt-BR': 'Dica: as peças vão trocando: engrenagem, parafuso, engrenagem, parafuso...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 ▮▮▮▮▮▮▮▮',
              pergunta: {
                'pt-PT': 'A bateria do robô tem 8 riscas e gastou 3. Quantas riscas ficaram?',
                'pt-BR': 'A bateria do robô tem 8 listras e gastou 3. Quantas listras ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: tapa 3 riscas com o dedo e conta as que sobram.',
              'pt-BR': 'Dica: cubra 3 listras com o dedo e conte as que sobram.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🤖 🤖 🤖 🤖 🤖',
              pergunta: {
                'pt-PT': 'Cada robô mostra as suas antenas. Põe os robôs por ordem, de 1 antena até 5 antenas.',
                'pt-BR': 'Cada robô mostra as antenas que tem. Coloque os robôs em ordem, de 1 antena até 5 antenas.',
              },
              itens: ['📡', '📡📡', '📡📡📡', '📡📡📡📡', '📡📡📡📡📡'],
            },
            dica: {
              'pt-PT': 'Dica: começa no robô que tem menos antenas.',
              'pt-BR': 'Dica: comece pelo robô que tem menos antenas.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é o robô: não sou o robô azul, tenho duas antenas e não tenho rodas.',
                'pt-BR': 'Adivinhe qual é o robô: não sou o robô azul, tenho duas antenas e não tenho rodas.',
              },
              opcoes: [
                { emoji: '🤖🔵', nome: { 'pt-PT': 'Robô azul de duas antenas', 'pt-BR': 'Robô azul de duas antenas' } },
                {
                  emoji: '🤖🛞',
                  nome: { 'pt-PT': 'Robô verde de duas antenas, com rodas', 'pt-BR': 'Robô verde de duas antenas, com rodas' },
                },
                {
                  emoji: '🤖🦿',
                  nome: { 'pt-PT': 'Robô verde de duas antenas, com pernas', 'pt-BR': 'Robô verde de duas antenas, com pernas' },
                },
                {
                  emoji: '🤖📡',
                  nome: { 'pt-PT': 'Robô verde de uma antena, com pernas', 'pt-BR': 'Robô verde de uma antena, com pernas' },
                },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira o robô azul.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire o robô azul.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔋 ▮▮▮▮▮▮▮▮▮▮',
              pergunta: {
                'pt-PT': 'A bateria do robô tem 10 riscas e gasta 2 riscas por hora. Quantas ficam ao fim de 3 horas?',
                'pt-BR': 'A bateria do robô tem 10 listras e gasta 2 listras por hora. Quantas ficam depois de 3 horas?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: tira 2 riscas por cada hora: 10, 8...',
              'pt-BR': 'Dica: tire 2 listras a cada hora: 10, 8...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🤖 🤖 🤖 🤖 🤖',
              pergunta: {
                'pt-PT': 'Os robôs estão numerados de 3 em 3. Põe-nos por ordem, do número mais pequeno ao maior.',
                'pt-BR': 'Os robôs estão numerados de 3 em 3. Coloque os robôs em ordem, do menor número ao maior.',
              },
              itens: ['3', '6', '9', '12', '15'],
            },
            dica: {
              'pt-PT': 'Dica: começa no 3 e junta sempre mais 3.',
              'pt-BR': 'Dica: comece no 3 e some sempre mais 3.',
            },
          },
        ],
      },
    },
    {
      id: 'capacete',
      nome: { 'pt-PT': 'Capacete e comida espacial', 'pt-BR': 'Capacete e comida espacial' },
      emoji: '🧑‍🚀',
      zona: { x: 91.6, y: 37.5, largura: 15.6, altura: 47.5 },
      sucesso: {
        'pt-PT': 'Num pacote de comida estava escrito o número {n}!',
        'pt-BR': 'Em um pacote de comida estava escrito o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'ordem',
              visual: '🧑‍🚀',
              pergunta: {
                'pt-PT': 'Ajuda o astronauta a vestir-se! Põe por ordem: as meias, o fato, as luvas e o capacete.',
                'pt-BR': 'Ajude o astronauta a se vestir! Coloque em ordem: as meias, o traje, as luvas e o capacete.',
              },
              itens: ['🧦', '🥼', '🧤', '🪖'],
            },
            dica: {
              'pt-PT': 'Dica: as meias vão primeiro e o capacete fica para o fim.',
              'pt-BR': 'Dica: as meias vão primeiro e o capacete fica para o fim.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🟧 🟨 🟩 🟦 🟪 🟥',
              pergunta: {
                'pt-PT': 'Quantos pacotes de comida há na prateleira? Escreve o número.',
                'pt-BR': 'Quantos pacotes de comida tem na prateleira? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta os pacotes um a um, com o dedo.',
              'pt-BR': 'Dica: conte os pacotes um por um, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Na prateleira da comida há uma coisa fora do lugar. Qual destas coisas não se come?',
                'pt-BR': 'Na prateleira da comida tem uma coisa fora do lugar. Qual destas coisas não se come?',
              },
              opcoes: [
                { emoji: '🍎', nome: { 'pt-PT': 'Maçã', 'pt-BR': 'Maçã' } },
                { emoji: '🥕', nome: { 'pt-PT': 'Cenoura', 'pt-BR': 'Cenoura' } },
                { emoji: '👟', nome: { 'pt-PT': 'Sapatilha', 'pt-BR': 'Tênis' } },
                { emoji: '🍞', nome: { 'pt-PT': 'Pão', 'pt-BR': 'Pão' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: três destas coisas vão para a boca. A outra calça-se no pé.',
              'pt-BR': 'Dica: três destas coisas vão para a boca. A outra a gente calça no pé.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🍎 🥕 🍎 🥕 ❔',
              pergunta: {
                'pt-PT': 'Os pacotes de comida seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'Os pacotes de comida seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🥕', nome: { 'pt-PT': 'Cenoura', 'pt-BR': 'Cenoura' } },
                { emoji: '🍎', nome: { 'pt-PT': 'Maçã', 'pt-BR': 'Maçã' } },
                { emoji: '🍞', nome: { 'pt-PT': 'Pão', 'pt-BR': 'Pão' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: os pacotes vão trocando: maçã, cenoura, maçã, cenoura...',
              'pt-BR': 'Dica: os pacotes vão trocando: maçã, cenoura, maçã, cenoura...',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📦 📦 📦 📦 📦 📦 📦',
              pergunta: {
                'pt-PT': 'O astronauta tinha 7 pacotes de comida e comeu 2. Quantos pacotes ficaram?',
                'pt-BR': 'O astronauta tinha 7 pacotes de comida e comeu 2. Quantos pacotes ficaram?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta para trás duas vezes, a começar no 7.',
              'pt-BR': 'Dica: conte para trás duas vezes, começando no 7.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🍎   🍎🍎   🍎🍎🍎   ❔',
              pergunta: {
                'pt-PT': 'Os pacotes têm 1 maçã, 2 maçãs, 3 maçãs... Qual é o pacote seguinte?',
                'pt-BR': 'Os pacotes têm 1 maçã, 2 maçãs, 3 maçãs... Qual é o próximo pacote?',
              },
              opcoes: [
                { emoji: '🍎🍎', nome: { 'pt-PT': 'Duas maçãs', 'pt-BR': 'Duas maçãs' } },
                { emoji: '🍎🍎🍎🍎', nome: { 'pt-PT': 'Quatro maçãs', 'pt-BR': 'Quatro maçãs' } },
                { emoji: '🍎🍎🍎🍎🍎', nome: { 'pt-PT': 'Cinco maçãs', 'pt-BR': 'Cinco maçãs' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: cada pacote tem mais uma maçã do que o anterior.',
              'pt-BR': 'Dica: cada pacote tem uma maçã a mais que o anterior.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🥤   🥤🥤🥤   🥤🥤🥤🥤🥤   ❔',
              pergunta: {
                'pt-PT':
                  'No primeiro dia o astronauta bebeu 1 copo de água, no segundo dia 3 copos e no terceiro dia 5 copos. Quantos copos bebe no quarto dia?',
                'pt-BR':
                  'No primeiro dia o astronauta bebeu 1 copo de água, no segundo dia 3 copos e no terceiro dia 5 copos. Quantos copos ele bebe no quarto dia?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: vê quantos copos a mais bebe de um dia para o outro.',
              'pt-BR': 'Dica: veja quantos copos a mais ele bebe de um dia para o outro.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha o pacote preferido do astronauta: não é doce, não é verde e é redondo.',
                'pt-BR': 'Adivinhe o pacote preferido do astronauta: não é doce, não é verde e é redondo.',
              },
              opcoes: [
                { emoji: '🍪', nome: { 'pt-PT': 'Bolacha', 'pt-BR': 'Biscoito' } },
                { emoji: '🥒', nome: { 'pt-PT': 'Pepino', 'pt-BR': 'Pepino' } },
                { emoji: '🍅', nome: { 'pt-PT': 'Tomate', 'pt-BR': 'Tomate' } },
                { emoji: '🥖', nome: { 'pt-PT': 'Pão comprido', 'pt-BR': 'Pão comprido' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira o que é doce.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire o que é doce.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '🧑‍🚀',
              pergunta: {
                'pt-PT':
                  'Veste o astronauta. Primeiro as meias. O fato vem antes das botas. As luvas vêm depois das botas. O capacete fica para o fim.',
                'pt-BR':
                  'Vista o astronauta. Primeiro as meias. O traje vem antes das botas. As luvas vêm depois das botas. O capacete fica para o fim.',
              },
              itens: ['🧦', '🥼', '🥾', '🧤', '🪖'],
            },
            dica: {
              'pt-PT': 'Dica: começa pelas meias e veste o fato logo a seguir.',
              'pt-BR': 'Dica: comece pelas meias e vista o traje logo depois.',
            },
          },
        ],
      },
    },
    {
      id: 'estufa',
      nome: { 'pt-PT': 'Estufa', 'pt-BR': 'Estufa' },
      emoji: '🌱',
      zona: { x: 9.4, y: 78.4, largura: 16.7, altura: 24.4 },
      sucesso: {
        'pt-PT': 'Numa folha da planta estava desenhado o número {n}!',
        'pt-BR': 'Em uma folha da planta estava desenhado o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🍃 🍃 🍃 🍃 🍃',
              pergunta: {
                'pt-PT': 'Quantas folhas tem a planta da estufa? Escreve o número.',
                'pt-BR': 'Quantas folhas a planta da estufa tem? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: conta as folhas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as folhas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌱',
              pergunta: {
                'pt-PT': 'Do que precisa a planta para crescer?',
                'pt-BR': 'Do que a planta precisa para crescer?',
              },
              opcoes: [
                { emoji: '🧦', nome: { 'pt-PT': 'Meia', 'pt-BR': 'Meia' } },
                { emoji: '💧', nome: { 'pt-PT': 'Água', 'pt-BR': 'Água' } },
                { emoji: '🔑', nome: { 'pt-PT': 'Chave', 'pt-BR': 'Chave' } },
                { emoji: '🎈', nome: { 'pt-PT': 'Balão', 'pt-BR': 'Balão' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a planta bebe pelas raízes, que estão na terra.',
              'pt-BR': 'Dica: a planta bebe pelas raízes, que ficam na terra.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os vasos da estufa estão misturados. Encontra os pares iguais!',
                'pt-BR': 'Os vasos da estufa estão misturados. Encontre os pares iguais!',
              },
              emojis: ['🌷', '🌵', '🌻', '🌱'],
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
              visual: '🍃🍃   🍃🍃🍃   ❔',
              pergunta: {
                'pt-PT': 'No primeiro dia a planta tem 2 folhas e no segundo dia tem 3. Quantas folhas tem no terceiro dia?',
                'pt-BR': 'No primeiro dia a planta tem 2 folhas e no segundo dia tem 3. Quantas folhas ela tem no terceiro dia?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: vê quantas folhas nascem de um dia para o outro.',
              'pt-BR': 'Dica: veja quantas folhas nascem de um dia para o outro.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🌷 🌵 🌷 🌵 ❔',
              pergunta: {
                'pt-PT': 'Os vasos da estufa seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'Os vasos da estufa seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🌵', nome: { 'pt-PT': 'Cato', 'pt-BR': 'Cacto' } },
                { emoji: '🌷', nome: { 'pt-PT': 'Tulipa', 'pt-BR': 'Tulipa' } },
                { emoji: '🌻', nome: { 'pt-PT': 'Girassol', 'pt-BR': 'Girassol' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: os vasos vão trocando: tulipa, cato, tulipa, cato...',
              'pt-BR': 'Dica: os vasos vão trocando: tulipa, cacto, tulipa, cacto...',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              pergunta: {
                'pt-PT': 'Põe os vasos por ordem, do que tem 1 flor ao que tem 5 flores.',
                'pt-BR': 'Coloque os vasos em ordem, do que tem 1 flor ao que tem 5 flores.',
              },
              itens: ['🌷', '🌷🌷', '🌷🌷🌷', '🌷🌷🌷🌷', '🌷🌷🌷🌷🌷'],
            },
            dica: {
              'pt-PT': 'Dica: começa no vaso que tem menos flores.',
              'pt-BR': 'Dica: comece pelo vaso que tem menos flores.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌱 📏',
              pergunta: {
                'pt-PT': 'A planta tinha 1 centímetro e cresce 2 centímetros por dia. Quanto mede ao fim de 3 dias?',
                'pt-BR': 'A planta tinha 1 centímetro e cresce 2 centímetros por dia. Quanto ela mede depois de 3 dias?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: começa no 1 e junta 2 por cada dia: 1, 3...',
              'pt-BR': 'Dica: comece no 1 e some 2 a cada dia: 1, 3...',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é a planta da Capitã: não tem flores, não é um cato e tem folhas grandes.',
                'pt-BR': 'Adivinhe qual é a planta da Capitã: não tem flores, não é um cacto e tem folhas grandes.',
              },
              opcoes: [
                { emoji: '🌻', nome: { 'pt-PT': 'Girassol', 'pt-BR': 'Girassol' } },
                { emoji: '🌵', nome: { 'pt-PT': 'Cato', 'pt-BR': 'Cacto' } },
                { emoji: '🌱', nome: { 'pt-PT': 'Rebento pequenino', 'pt-BR': 'Brotinho' } },
                { emoji: '🪴', nome: { 'pt-PT': 'Planta de vaso', 'pt-BR': 'Planta de vaso' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira a planta que tem flores.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire a planta que tem flores.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🌸   🌸🌸   🌸🌸🌸🌸   ❔',
              pergunta: {
                'pt-PT': 'Cada dia nasce o dobro das flores do dia anterior: 1, 2, 4... Quantas flores nascem a seguir?',
                'pt-BR': 'Cada dia nasce o dobro das flores do dia anterior: 1, 2, 4... Quantas flores nascem depois?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: o dobro é juntar um número com ele mesmo. O dobro de 2 é 2 mais 2.',
              'pt-BR': 'Dica: o dobro é somar um número com ele mesmo. O dobro de 2 é 2 mais 2.',
            },
          },
        ],
      },
    },
    {
      id: 'telescopio',
      nome: { 'pt-PT': 'Telescópio', 'pt-BR': 'Telescópio' },
      emoji: '🔭',
      zona: { x: 27.1, y: 67.7, largura: 17.3, altura: 27.9 },
      sucesso: {
        'pt-PT': 'Pelo telescópio viste uma estrela com o número {n}!',
        'pt-BR': 'Pelo telescópio você viu uma estrela com o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐',
              pergunta: {
                'pt-PT': 'Quantas estrelas se veem pelo telescópio? Escreve o número.',
                'pt-BR': 'Quantas estrelas dá para ver pelo telescópio? Digite o número.',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: conta as estrelas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as estrelas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🔭',
              pergunta: {
                'pt-PT': 'O que se vê no céu de noite?',
                'pt-BR': 'O que a gente vê no céu à noite?',
              },
              opcoes: [
                { emoji: '🌈', nome: { 'pt-PT': 'Arco-íris', 'pt-BR': 'Arco-íris' } },
                { emoji: '🐄', nome: { 'pt-PT': 'Vaca', 'pt-BR': 'Vaca' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '🚗', nome: { 'pt-PT': 'Carro', 'pt-BR': 'Carro' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: de noite o céu fica escuro e cheio de pontinhos a brilhar.',
              'pt-BR': 'Dica: à noite o céu fica escuro e cheio de pontinhos brilhando.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O céu está cheio de estrelas. Encontra os pares de estrelas iguais!',
                'pt-BR': 'O céu está cheio de estrelas. Encontre os pares de estrelas iguais!',
              },
              emojis: ['⭐', '🌟', '💫', '✨'],
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
              visual: '☄️   ☄️☄️   ☄️☄️☄️   ❔',
              pergunta: {
                'pt-PT':
                  'Na primeira noite caiu 1 estrela cadente, na segunda noite caíram 2 e na terceira caíram 3. Quantas caem na quarta noite?',
                'pt-BR':
                  'Na primeira noite caiu 1 estrela cadente, na segunda noite caíram 2 e na terceira caíram 3. Quantas caem na quarta noite?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: vê quantas estrelas a mais caem em cada noite.',
              'pt-BR': 'Dica: veja quantas estrelas a mais caem a cada noite.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '✨ ✨ ✨ ✨ ✨',
              pergunta: {
                'pt-PT': 'Esta constelação tem estes pontos de luz. Qual desenho tem o mesmo número de estrelas?',
                'pt-BR': 'Esta constelação tem estes pontos de luz. Qual desenho tem o mesmo número de estrelas?',
              },
              opcoes: [
                { emoji: '⭐⭐⭐', nome: { 'pt-PT': 'Três estrelas', 'pt-BR': 'Três estrelas' } },
                { emoji: '⭐⭐⭐⭐', nome: { 'pt-PT': 'Quatro estrelas', 'pt-BR': 'Quatro estrelas' } },
                { emoji: '⭐⭐⭐⭐⭐', nome: { 'pt-PT': 'Cinco estrelas', 'pt-BR': 'Cinco estrelas' } },
                { emoji: '⭐⭐⭐⭐⭐⭐', nome: { 'pt-PT': 'Seis estrelas', 'pt-BR': 'Seis estrelas' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: primeiro conta os pontos de luz da constelação.',
              'pt-BR': 'Dica: primeiro conte os pontos de luz da constelação.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '⭐ ☄️ ⭐ ☄️ ❔',
              pergunta: {
                'pt-PT': 'No céu passam estrelas e cometas com uma regra. O que vem a seguir?',
                'pt-BR': 'No céu passam estrelas e cometas com uma regra. O que vem depois?',
              },
              opcoes: [
                { emoji: '☄️', nome: { 'pt-PT': 'Cometa', 'pt-BR': 'Cometa' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: vão trocando: estrela, cometa, estrela, cometa...',
              'pt-BR': 'Dica: vão trocando: estrela, cometa, estrela, cometa...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '☄️☄️   ☄️☄️☄️☄️   ☄️☄️☄️☄️☄️☄️   ❔',
              pergunta: {
                'pt-PT':
                  'Na primeira noite caíram 2 estrelas cadentes, na segunda 4 e na terceira 6. Quantas caem na quarta noite?',
                'pt-BR':
                  'Na primeira noite caíram 2 estrelas cadentes, na segunda 4 e na terceira 6. Quantas caem na quarta noite?',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: vê quantas estrelas a mais caem de uma noite para a outra.',
              'pt-BR': 'Dica: veja quantas estrelas a mais caem de uma noite para a outra.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '🔭 15 · 12 · 9 · ❔',
              pergunta: {
                'pt-PT': 'O telescópio aproxima a estrela e conta para trás de 3 em 3: 15, 12, 9... Que número vem a seguir?',
                'pt-BR': 'O telescópio aproxima a estrela e conta para trás de 3 em 3: 15, 12, 9... Que número vem depois?',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: de 15 para 12 tiraste 3. Faz o mesmo ao 9.',
              'pt-BR': 'Dica: de 15 para 12 você tirou 3. Faça o mesmo com o 9.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '☄️',
              pergunta: {
                'pt-PT': 'Um cometa passa de 3 em 3 noites. Passou na noite 1. Em que noite passa pela terceira vez?',
                'pt-BR': 'Um cometa passa de 3 em 3 noites. Ele passou na noite 1. Em que noite passa pela terceira vez?',
              },
              resposta: '7',
            },
            dica: {
              'pt-PT': 'Dica: a primeira vez foi na noite 1. Junta 3 para achares a segunda vez.',
              'pt-BR': 'Dica: a primeira vez foi na noite 1. Some 3 para achar a segunda vez.',
            },
          },
        ],
      },
    },
    {
      id: 'mapa',
      nome: { 'pt-PT': 'Mapa das estrelas', 'pt-BR': 'Mapa das estrelas' },
      emoji: '✨',
      zona: { x: 47.9, y: 75.4, largura: 29.7, altura: 19.2 },
      sucesso: {
        'pt-PT': 'No mapa das estrelas acendeu-se o número {n}!',
        'pt-BR': 'No mapa das estrelas se acendeu o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'O mapa mostra o céu. Encontra os pares iguais!',
                'pt-BR': 'O mapa mostra o céu. Encontre os pares iguais!',
              },
              emojis: ['⭐', '🌙', '☀️', '🪐'],
            },
            dica: {
              'pt-PT': 'Dica: vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐',
              pergunta: {
                'pt-PT': 'Quantas estrelas tem o mapa? Escreve o número.',
                'pt-BR': 'Quantas estrelas o mapa tem? Digite o número.',
              },
              resposta: '8',
            },
            dica: {
              'pt-PT': 'Dica: conta as estrelas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as estrelas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O que está no céu de dia?',
                'pt-BR': 'O que fica no céu de dia?',
              },
              opcoes: [
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🦉', nome: { 'pt-PT': 'Coruja', 'pt-BR': 'Coruja' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: de dia há muita luz e faz calor.',
              'pt-BR': 'Dica: de dia tem muita luz e faz calor.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Junta as coisas que andam juntas, como o foguetão e o fogo!',
                'pt-BR': 'Junte as coisas que combinam, como o foguete e o fogo!',
              },
              emojis: [
                ['🚀', '🔥'],
                ['👩‍🚀', '🪖'],
                ['🌍', '💧'],
                ['⭐', '✨'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. A astronauta vai com o capacete.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. A astronauta vai com o capacete.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Qual destes tem luz própria, como uma lâmpada acesa?',
                'pt-BR': 'Qual destes tem luz própria, como uma lâmpada acesa?',
              },
              opcoes: [
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: um deles brilha sozinho, como uma fogueira. O outro só brilha quando recebe luz.',
              'pt-BR': 'Dica: um deles brilha sozinho, como uma fogueira. O outro só brilha quando recebe luz.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '☀️ ☀️ 🌙 ☀️ ☀️ ❔',
              pergunta: {
                'pt-PT': 'O mapa mostra uma regra. O que vem a seguir?',
                'pt-BR': 'O mapa mostra uma regra. O que vem depois?',
              },
              opcoes: [
                { emoji: '☀️', nome: { 'pt-PT': 'Sol', 'pt-BR': 'Sol' } },
                { emoji: '🌙', nome: { 'pt-PT': 'Lua', 'pt-BR': 'Lua' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela', 'pt-BR': 'Estrela' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: procura o bocado que se repete: sol, sol, lua.',
              'pt-BR': 'Dica: procure o pedaço que se repete: sol, sol, lua.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Vira as cartas e junta as coisas que andam juntas, como o foguetão e o fogo. São cinco pares!',
                'pt-BR': 'Vire as cartas e junte as coisas que combinam, como o foguete e o fogo. São cinco pares!',
              },
              emojis: [
                ['🚀', '🔥'],
                ['👩‍🚀', '🪖'],
                ['🌍', '💧'],
                ['⭐', '✨'],
                ['☀️', '🌙'],
              ],
            },
            dica: {
              'pt-PT': 'Dica: as duas cartas do par não são iguais. O Sol vai com a Lua: um é do dia e a outra é da noite.',
              'pt-BR': 'Dica: as duas cartas do par não são iguais. O Sol vai com a Lua: um é do dia e a outra é da noite.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A estrela da Capitã é amarela, não é a maior e tem 5 pontas. Qual é?',
                'pt-BR': 'A estrela da Capitã é amarela, não é a maior e tem 5 pontas. Qual é?',
              },
              opcoes: [
                { emoji: '🌟', nome: { 'pt-PT': 'Estrela amarela grande', 'pt-BR': 'Estrela amarela grande' } },
                { emoji: '⭐', nome: { 'pt-PT': 'Estrela amarela pequena', 'pt-BR': 'Estrela amarela pequena' } },
                { emoji: '✴️', nome: { 'pt-PT': 'Estrela laranja de 8 pontas', 'pt-BR': 'Estrela laranja de 8 pontas' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira a estrela que não é amarela.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire a estrela que não é amarela.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '⭐3 · ⭐6 · ⭐9 · ❔',
              pergunta: {
                'pt-PT': 'As estrelas do mapa estão numeradas: 3, 6, 9... Que número tem a estrela seguinte?',
                'pt-BR': 'As estrelas do mapa estão numeradas: 3, 6, 9... Que número tem a próxima estrela?',
              },
              resposta: '12',
            },
            dica: {
              'pt-PT': 'Dica: vê quanto se junta de uma estrela para a outra.',
              'pt-BR': 'Dica: veja quanto se soma de uma estrela para a outra.',
            },
          },
        ],
      },
    },
    {
      id: 'caixas',
      nome: { 'pt-PT': 'Caixas de carga', 'pt-BR': 'Caixas de carga' },
      emoji: '📦',
      zona: { x: 70.5, y: 74.3, largura: 16.7, altura: 28.2 },
      requer: 'estrela',
      bloqueado: {
        'pt-PT': 'As caixas têm uma fechadura em forma de estrela. Procura a chave-estrela!',
        'pt-BR': 'As caixas têm uma fechadura em forma de estrela. Procure a chave-estrela!',
      },
      sucesso: {
        'pt-PT': 'Dentro de uma caixa estava o número {n}!',
        'pt-BR': 'Dentro de uma caixa estava o número {n}!',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'codigo',
              visual: '📦 📦 📦 📦 📦 📦',
              pergunta: {
                'pt-PT': 'Quantas caixas de carga há? Escreve o número.',
                'pt-BR': 'Quantas caixas de carga tem? Digite o número.',
              },
              resposta: '6',
            },
            dica: {
              'pt-PT': 'Dica: conta as caixas uma a uma, com o dedo.',
              'pt-BR': 'Dica: conte as caixas uma por uma, com o dedo.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'A Capitã quer a caixa que tem uma estrela. Qual é?',
                'pt-BR': 'A Capitã quer a caixa que tem uma estrela. Qual é?',
              },
              opcoes: [
                { emoji: '📦🌙', nome: { 'pt-PT': 'Caixa com lua', 'pt-BR': 'Caixa com lua' } },
                { emoji: '📦🪐', nome: { 'pt-PT': 'Caixa com planeta', 'pt-BR': 'Caixa com planeta' } },
                { emoji: '📦⭐', nome: { 'pt-PT': 'Caixa com estrela', 'pt-BR': 'Caixa com estrela' } },
                { emoji: '📦☀️', nome: { 'pt-PT': 'Caixa com sol', 'pt-BR': 'Caixa com sol' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a estrela tem cinco pontas e brilha de noite.',
              'pt-BR': 'Dica: a estrela tem cinco pontas e brilha à noite.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'As caixas estão misturadas. Encontra os pares de caixas iguais!',
                'pt-BR': 'As caixas estão misturadas. Encontre os pares de caixas iguais!',
              },
              emojis: ['🟥', '🟨', '🟦', '🟩'],
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
                'pt-PT': 'A caixa certa não é azul e tem uma estrela. Qual é?',
                'pt-BR': 'A caixa certa não é azul e tem uma estrela. Qual é?',
              },
              opcoes: [
                { emoji: '🟦⭐', nome: { 'pt-PT': 'Caixa azul com estrela', 'pt-BR': 'Caixa azul com estrela' } },
                { emoji: '🟨🌙', nome: { 'pt-PT': 'Caixa amarela com lua', 'pt-BR': 'Caixa amarela com lua' } },
                { emoji: '🟥⭐', nome: { 'pt-PT': 'Caixa vermelha com estrela', 'pt-BR': 'Caixa vermelha com estrela' } },
                { emoji: '🟦🌙', nome: { 'pt-PT': 'Caixa azul com lua', 'pt-BR': 'Caixa azul com lua' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: primeiro tira as caixas azuis. Depois procura a estrela.',
              'pt-BR': 'Dica: primeiro tire as caixas azuis. Depois procure a estrela.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📦1 · 📦2 · 📦3 · ❔',
              pergunta: {
                'pt-PT': 'As caixas têm os números 1, 2, 3... Que número tem a caixa seguinte?',
                'pt-BR': 'As caixas têm os números 1, 2, 3... Que número tem a próxima caixa?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: cada caixa tem mais um do que a anterior.',
              'pt-BR': 'Dica: cada caixa tem um a mais que a anterior.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '📦',
              pergunta: {
                'pt-PT': 'Empilha as caixas de baixo para cima, a contar para trás do 5 até ao 1.',
                'pt-BR': 'Empilhe as caixas de baixo para cima, contando para trás do 5 até o 1.',
              },
              itens: ['5', '4', '3', '2', '1'],
            },
            dica: {
              'pt-PT': 'Dica: a caixa de baixo é a do 5, o número maior.',
              'pt-BR': 'Dica: a caixa de baixo é a do 5, o maior número.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟨 🟥 🟦⭐ 🟩',
              pergunta: {
                'pt-PT':
                  'O desenho mostra uma pilha de caixas, de cima para baixo. Qual é a caixa certa? Está por cima da verde, não tem estrela e não é a do topo.',
                'pt-BR':
                  'O desenho mostra uma pilha de caixas, de cima para baixo. Qual é a caixa certa? Está em cima da verde, não tem estrela e não é a do topo.',
              },
              opcoes: [
                { emoji: '🟨', nome: { 'pt-PT': 'Caixa amarela', 'pt-BR': 'Caixa amarela' } },
                { emoji: '🟥', nome: { 'pt-PT': 'Caixa vermelha', 'pt-BR': 'Caixa vermelha' } },
                { emoji: '🟦⭐', nome: { 'pt-PT': 'Caixa azul com estrela', 'pt-BR': 'Caixa azul com estrela' } },
                { emoji: '🟩', nome: { 'pt-PT': 'Caixa verde', 'pt-BR': 'Caixa verde' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: vai riscando. Primeiro tira a caixa do topo, a primeira do desenho.',
              'pt-BR': 'Dica: vá riscando. Primeiro tire a caixa do topo, a primeira do desenho.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT':
                  'Há três caixas empilhadas. A vermelha está em cima da amarela e a azul está debaixo da amarela. Qual está no fundo da pilha?',
                'pt-BR':
                  'Tem três caixas empilhadas. A vermelha está em cima da amarela e a azul está embaixo da amarela. Qual está no fundo da pilha?',
              },
              opcoes: [
                { emoji: '🟥', nome: { 'pt-PT': 'Caixa vermelha', 'pt-BR': 'Caixa vermelha' } },
                { emoji: '🟨', nome: { 'pt-PT': 'Caixa amarela', 'pt-BR': 'Caixa amarela' } },
                { emoji: '🟦', nome: { 'pt-PT': 'Caixa azul', 'pt-BR': 'Caixa azul' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: começa pela vermelha, que está em cima. Que caixa fica logo por baixo dela?',
              'pt-BR': 'Dica: comece pela vermelha, que está em cima. Que caixa fica logo embaixo dela?',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '📦5 · 📦10 · 📦15 · ❔',
              pergunta: {
                'pt-PT': 'As caixas estão numeradas de 5 em 5: 5, 10, 15... Que número tem a caixa seguinte?',
                'pt-BR': 'As caixas estão numeradas de 5 em 5: 5, 10, 15... Que número tem a próxima caixa?',
              },
              resposta: '20',
            },
            dica: {
              'pt-PT': 'Dica: a partir do 15, conta mais 5 pelos dedos de uma mão.',
              'pt-BR': 'Dica: a partir do 15, conte mais 5 nos dedos de uma mão.',
            },
          },
        ],
      },
    },
  ],
  extras: [
    {
      id: 'armario',
      nome: { 'pt-PT': 'Armário', 'pt-BR': 'Armário' },
      emoji: '🗄️',
      zona: { x: 5.8, y: 36.3, largura: 11.6, altura: 61.7 },
      recompensa: {
        id: 'cartao',
        emoji: '💳',
        nome: { 'pt-PT': 'Cartão de acesso', 'pt-BR': 'Cartão de acesso' },
      },
      sucesso: {
        'pt-PT': 'No armário estava um cartão de acesso! 💳',
        'pt-BR': 'No armário estava um cartão de acesso! 💳',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟦⭐',
              pergunta: {
                'pt-PT': 'O armário só abre com o cartão igual ao modelo. Qual é?',
                'pt-BR': 'O armário só abre com o cartão igual ao modelo. Qual é?',
              },
              opcoes: [
                { emoji: '🟥⭐', nome: { 'pt-PT': 'Vermelho com estrela', 'pt-BR': 'Vermelho com estrela' } },
                { emoji: '🟦🌙', nome: { 'pt-PT': 'Azul com lua', 'pt-BR': 'Azul com lua' } },
                { emoji: '🟨⭐', nome: { 'pt-PT': 'Amarelo com estrela', 'pt-BR': 'Amarelo com estrela' } },
                { emoji: '🟦⭐', nome: { 'pt-PT': 'Azul com estrela', 'pt-BR': 'Azul com estrela' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Olha primeiro para a cor do modelo.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Olhe primeiro a cor do modelo.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os cartões do armário estão misturados. Encontra os pares iguais!',
                'pt-BR': 'Os cartões do armário estão misturados. Encontre os pares iguais!',
              },
              emojis: ['💳', '🪪', '🎫', '🏷️'],
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '💳 💳 💳 💳 💳',
              pergunta: {
                'pt-PT': 'O armário tem um cadeado. Quantos cartões há no armário?',
                'pt-BR': 'O armário tem um cadeado. Quantos cartões tem no armário?',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Conta os cartões um a um.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Conte os cartões um por um.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O cartão do robô é azul e tem uma estrela. Qual é?',
                'pt-BR': 'O cartão do robô é azul e tem uma estrela. Qual é?',
              },
              opcoes: [
                { emoji: '🟦⭐', nome: { 'pt-PT': 'Azul com estrela', 'pt-BR': 'Azul com estrela' } },
                { emoji: '🟨⭐', nome: { 'pt-PT': 'Amarelo com estrela', 'pt-BR': 'Amarelo com estrela' } },
                { emoji: '🟦🌙', nome: { 'pt-PT': 'Azul com lua', 'pt-BR': 'Azul com lua' } },
                { emoji: '🟨🌙', nome: { 'pt-PT': 'Amarelo com lua', 'pt-BR': 'Amarelo com lua' } },
              ],
              certa: 0,
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Primeiro procura os cartões azuis.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Primeiro procure os cartões azuis.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟦 🟨 🟦 🟨 ❔',
              pergunta: {
                'pt-PT': 'Os cartões estão arrumados com uma regra. Qual vem a seguir?',
                'pt-BR': 'Os cartões estão arrumados com uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🟨', nome: { 'pt-PT': 'Cartão amarelo', 'pt-BR': 'Cartão amarelo' } },
                { emoji: '🟦', nome: { 'pt-PT': 'Cartão azul', 'pt-BR': 'Cartão azul' } },
                { emoji: '🟥', nome: { 'pt-PT': 'Cartão vermelho', 'pt-BR': 'Cartão vermelho' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. As cores vão trocando: azul, amarelo...',
              'pt-BR': 'Dica: o cartão do robô está no armário. As cores vão trocando: azul, amarelo...',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os cartões do armário estão misturados. Encontra os cinco pares iguais!',
                'pt-BR': 'Os cartões do armário estão misturados. Encontre os cinco pares iguais!',
              },
              emojis: ['💳', '🪪', '🎫', '🏷️', '📇'],
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'Adivinha qual é o cartão do robô: não é azul, tem uma estrela e não tem riscas.',
                'pt-BR': 'Adivinhe qual é o cartão do robô: não é azul, tem uma estrela e não tem listras.',
              },
              opcoes: [
                { emoji: '🟦⭐', nome: { 'pt-PT': 'Azul com estrela', 'pt-BR': 'Azul com estrela' } },
                {
                  emoji: '🟨⭐〰️',
                  nome: { 'pt-PT': 'Amarelo com estrela e riscas', 'pt-BR': 'Amarelo com estrela e listras' },
                },
                { emoji: '🟨🌙', nome: { 'pt-PT': 'Amarelo com lua', 'pt-BR': 'Amarelo com lua' } },
                { emoji: '🟥⭐', nome: { 'pt-PT': 'Vermelho com estrela', 'pt-BR': 'Vermelho com estrela' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Vai riscando: primeiro tira o cartão azul.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Vá riscando: primeiro tire o cartão azul.',
            },
          },
          {
            enigma: {
              tipo: 'ordem',
              visual: '💳',
              pergunta: {
                'pt-PT': 'Os cartões estão numerados de 4 em 4. Põe-nos por ordem, do número mais pequeno ao maior.',
                'pt-BR': 'Os cartões estão numerados de 4 em 4. Coloque os cartões em ordem, do menor número ao maior.',
              },
              itens: ['4', '8', '12', '16', '20'],
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Começa no 4 e junta sempre mais 4.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Comece no 4 e some sempre mais 4.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '9️⃣ 7️⃣ 5️⃣ ❔',
              pergunta: {
                'pt-PT': 'O código do armário é o número que vem depois de 9, 7, 5. Qual é? Escreve o número.',
                'pt-BR': 'O código do armário é o número que vem depois de 9, 7, 5. Qual é? Digite o número.',
              },
              resposta: '3',
            },
            dica: {
              'pt-PT': 'Dica: o cartão do robô está no armário. Os números vão descendo: vê quanto desce de um para o outro.',
              'pt-BR': 'Dica: o cartão do robô está no armário. Os números vão descendo: veja quanto desce de um para o outro.',
            },
          },
        ],
      },
    },
    {
      id: 'bichinho',
      nome: { 'pt-PT': 'Bichinho extraterrestre', 'pt-BR': 'Bichinho extraterrestre' },
      emoji: '👽',
      zona: { x: 89.8, y: 79.9, largura: 19.3, altura: 18.5 },
      recompensa: {
        id: 'estrela',
        emoji: '🌟',
        nome: { 'pt-PT': 'Chave-estrela', 'pt-BR': 'Chave-estrela' },
      },
      sucesso: {
        'pt-PT': 'O bichinho acordou contente e deu-te uma chave em forma de estrela! 🌟',
        'pt-BR': 'O bichinho acordou contente e deu para você uma chave em forma de estrela! 🌟',
      },
      variantes: {
        facil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O bichinho só come coisas verdes. O que lhe dás?',
                'pt-BR': 'O bichinho só come coisas verdes. O que você dá para ele?',
              },
              opcoes: [
                { emoji: '🍓', nome: { 'pt-PT': 'Morango', 'pt-BR': 'Morango' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
                { emoji: '🍊', nome: { 'pt-PT': 'Laranja', 'pt-BR': 'Laranja' } },
                { emoji: '🥦', nome: { 'pt-PT': 'Brócolos', 'pt-BR': 'Brócolis' } },
              ],
              certa: 3,
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Procura a comida da cor da relva.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Procure a comida da cor da grama.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '👁️ 👁️ 👁️ 👁️ 👁️',
              pergunta: {
                'pt-PT': 'Quantos olhos tem o bichinho? Escreve o número.',
                'pt-BR': 'Quantos olhos o bichinho tem? Digite o número.',
              },
              resposta: '5',
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Conta os olhos um a um.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Conte os olhos um por um.',
            },
          },
          {
            enigma: {
              tipo: 'pares',
              pergunta: {
                'pt-PT': 'Os amigos do bichinho vieram brincar. Encontra os pares iguais!',
                'pt-BR': 'Os amigos do bichinho vieram brincar. Encontre os pares iguais!',
              },
              emojis: ['👽', '👾', '🐛', '🦠'],
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Vira duas cartas de cada vez e lembra-te de onde estão.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Vire duas cartas de cada vez e lembre onde elas estão.',
            },
          },
        ],
        medio: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O bichinho só come coisas verdes e redondas. O que lhe dás?',
                'pt-BR': 'O bichinho só come coisas verdes e redondas. O que você dá para ele?',
              },
              opcoes: [
                { emoji: '🥒', nome: { 'pt-PT': 'Pepino', 'pt-BR': 'Pepino' } },
                { emoji: '🍊', nome: { 'pt-PT': 'Laranja', 'pt-BR': 'Laranja' } },
                { emoji: '🍏', nome: { 'pt-PT': 'Maçã verde', 'pt-BR': 'Maçã verde' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Primeiro procura as coisas verdes.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Primeiro procure as coisas verdes.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '👁️ 👁️ 👁️',
              pergunta: {
                'pt-PT': 'O bichinho tem 3 olhos e nasce-lhe um olho novo por dia. Quantos olhos vai ter amanhã?',
                'pt-BR': 'O bichinho tem 3 olhos e ganha um olho novo por dia. Quantos olhos ele vai ter amanhã?',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Amanhã tem os olhos de hoje e mais um.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Amanhã ele tem os olhos de hoje e mais um.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟣 🟡 🟣 🟡 ❔',
              pergunta: {
                'pt-PT': 'As manchas do bichinho seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'As manchas do bichinho seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🟡', nome: { 'pt-PT': 'Mancha amarela', 'pt-BR': 'Mancha amarela' } },
                { emoji: '🟣', nome: { 'pt-PT': 'Mancha roxa', 'pt-BR': 'Mancha roxa' } },
                { emoji: '🟢', nome: { 'pt-PT': 'Mancha verde', 'pt-BR': 'Mancha verde' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. As cores vão trocando: roxo, amarelo...',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. As cores vão trocando: roxo, amarelo...',
            },
          },
        ],
        dificil: [
          {
            enigma: {
              tipo: 'escolha',
              pergunta: {
                'pt-PT': 'O bichinho não come nada vermelho nem comprido, e gosta de coisas redondas. O que lhe dás?',
                'pt-BR': 'O bichinho não come nada vermelho nem comprido, e gosta de coisas redondas. O que você dá para ele?',
              },
              opcoes: [
                { emoji: '🍓', nome: { 'pt-PT': 'Morango', 'pt-BR': 'Morango' } },
                { emoji: '🥕', nome: { 'pt-PT': 'Cenoura', 'pt-BR': 'Cenoura' } },
                { emoji: '🫐', nome: { 'pt-PT': 'Mirtilos', 'pt-BR': 'Mirtilos' } },
                { emoji: '🍌', nome: { 'pt-PT': 'Banana', 'pt-BR': 'Banana' } },
              ],
              certa: 2,
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Vai riscando: primeiro tira o que é vermelho.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Vá riscando: primeiro tire o que é vermelho.',
            },
          },
          {
            enigma: {
              tipo: 'codigo',
              visual: '👽 🟢❔',
              pergunta: {
                'pt-PT':
                  'O bichinho pensou em quantas bolinhas quer comer: é mais do que 3, menos do que 6 e não é 5. Quantas quer? Escreve o número.',
                'pt-BR':
                  'O bichinho pensou em quantas bolinhas quer comer: é mais que 3, menos que 6 e não é 5. Quantas ele quer? Digite o número.',
              },
              resposta: '4',
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Diz os números que há entre o 3 e o 6. Depois tira o 5.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Fale os números que existem entre o 3 e o 6. Depois tire o 5.',
            },
          },
          {
            enigma: {
              tipo: 'escolha',
              visual: '🟣 🟡 🟡 🟣 🟡 🟡 ❔',
              pergunta: {
                'pt-PT': 'As manchas do bichinho seguem uma regra. Qual vem a seguir?',
                'pt-BR': 'As manchas do bichinho seguem uma regra. Qual vem depois?',
              },
              opcoes: [
                { emoji: '🟡', nome: { 'pt-PT': 'Mancha amarela', 'pt-BR': 'Mancha amarela' } },
                { emoji: '🟣', nome: { 'pt-PT': 'Mancha roxa', 'pt-BR': 'Mancha roxa' } },
                { emoji: '🟢', nome: { 'pt-PT': 'Mancha verde', 'pt-BR': 'Mancha verde' } },
              ],
              certa: 1,
            },
            dica: {
              'pt-PT': 'Dica: a chave das caixas está com o bichinho. Procura o bocado que se repete: roxo, amarelo, amarelo.',
              'pt-BR': 'Dica: a chave das caixas está com o bichinho. Procure o pedaço que se repete: roxo, amarelo, amarelo.',
            },
          },
        ],
      },
    },
  ],
  saida: {
    nome: { 'pt-PT': 'Escotilha', 'pt-BR': 'Escotilha' },
    emoji: '🚪',
    zona: { x: 50, y: 32.1, largura: 30.6, altura: 42.5 },
    pergunta: {
      'pt-PT': 'Cada desenho é uma coisa da nave que esconde um número. Escreve os números pela ordem dos desenhos.',
      'pt-BR': 'Cada desenho é uma coisa da nave que esconde um número. Digite os números na ordem dos desenhos.',
    },
    dicaVer: {
      'pt-PT': 'Dica: toca na escotilha para ver o cadeado. Os desenhos mostram onde estão os números.',
      'pt-BR': 'Dica: toque na escotilha para ver o cadeado. Os desenhos mostram onde estão os números.',
    },
    dica: {
      'pt-PT': 'Dica: já tens todos os números! Escreve-os no cadeado pela ordem dos desenhos.',
      'pt-BR': 'Dica: você já tem todos os números! Digite no cadeado na ordem dos desenhos.',
    },
  },
  vitoria: {
    'pt-PT':
      'Clique! O cadeado abriu e a escotilha deslizou. A Capitã Estrela entrou a sorrir: «Conseguiste! Tens mesmo jeito para astronauta!» Que aventura!',
    'pt-BR':
      'Clique! O cadeado abriu e a escotilha deslizou. A Capitã Estrela entrou sorrindo: "Você conseguiu! Você leva jeito para astronauta!" Que aventura!',
  },
};
