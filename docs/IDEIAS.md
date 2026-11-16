# Ideias de jogos e fases

Caderno de brainstorming. Nada aqui está decidido: nenhuma ideia é ruim, e qualquer uma pode ser riscada, misturada com outra ou virar outra coisa. Quando uma ideia virar trabalho de verdade, tire-a daqui.

Como ler cada ideia:

- **Ideia**: o que a criança faz.
- **Lógica**: como o jogo funciona por dentro (regras, sorteio, níveis, o que conta como acerto).
- **Reaproveita**: o que já existe no projeto e serve de base.
- **Custo**: 🟢 pouco (só dados/texto novos), 🟡 médio (tela nova com peças que já temos), 🔴 alto (motor novo ou muitas imagens/áudios).

Lembretes que valem para tudo: texto por variante (`pt-PT` / `pt-BR`), texto fixo novo pede áudio (`npm run audio:narrador`), imagem nova pede prompt em `docs/PROMPTS-IMAGENS.md`, alvos de toque de 64 px.

---

## Parte 1: fases e modos novos para os jogos que já temos

### Aventura RPG

As ideias 1 a 7 (classe nova, escolhas, enigmas, companheiro, diário, dois jogadores, arena de treino) foram movidas para `docs/RPG-HISTORIAS-NOVAS.md`, com a lógica das histórias novas e todos os puzzles. As ideias 6 (dois jogadores) e 7 (arena de treino) ficam lá só como pendência, sem história.

### Escrever palavras / Ler palavras

**8. Fábulas novas e coleções temáticas** 🟢
- Ideia: mais fábulas, agrupadas por tema: bichos da fazenda, mar, espaço, lendas (folclore brasileiro e contos tradicionais portugueses, cada um na sua variante).
- Lógica: só dados novos em `historias/`. Atenção a lendas: o Saci e a Cuca fazem sentido em pt-BR; para pt-PT, escolher contos de lá em vez de traduzir.

**9. Níveis de ajuda na escrita** 🟡
- Ideia: a mesma fábula em três jeitos de escrever.
- Lógica: **fácil**: letras da palavra embaralhadas, é só pôr na ordem; **médio**: letras embaralhadas com 2 ou 3 intrusas; **difícil**: teclado inteiro, como hoje. Dica opcional: mostrar a primeira letra ou ouvir a palavra de novo.

**10. Sílabas** 🟡
- Ideia: montar a palavra juntando sílabas em vez de letras (`BO` + `NE` + `CA`).
- Lógica: cada palavra do dicionário ganha a divisão silábica por variante (não dá para gerar no automático com confiança: conferir à mão). Blocos de sílaba grandes para arrastar ou tocar em ordem.

**11. Ditado do narrador** 🟡
- Ideia: sem imagem: o narrador diz a palavra e a criança escreve.
- Lógica: usa os áudios de palavra isolada que já existem. Botão grande de "ouvir de novo". Bom nível "difícil" para quem já domina a fábula.

**12. Letra que falta** 🟢
- Ideia: a palavra aparece com um buraco (`GA_O`) e três letras para escolher.
- Lógica: sorteia a posição do buraco; as opções erradas são letras parecidas no som ou na forma (`T/D`, `P/B`, `M/N`). Porta de entrada para os menores.

**13. Leitura ao contrário: imagem → palavra** 🟢
- Ideia: hoje a criança lê a palavra e escolhe a imagem. No modo inverso, vê a imagem e escolhe entre 3 palavras escritas.
- Lógica: opções erradas escolhidas de propósito parecidas (`pato`, `gato`, `rato`) para obrigar a ler tudo e não só a primeira letra.

**14. Ordenar a história** 🟡
- Ideia: depois de ler a fábula, pôr 3 ou 4 cenas na ordem certa.
- Lógica: cartas com um trecho curto (e a imagem da palavra do parágrafo). Reaproveita o enigma `Ordem` do escape. Treina compreensão, não só decodificação.

**15. Perguntas sobre a fábula** 🟡
- Ideia: no fim, 2 ou 3 perguntas simples: "Quem ganhou a corrida?", com imagens como resposta.
- Lógica: cada fábula ganha `perguntas: [{ texto, certa, erradas }]` por variante, respondidas tocando na imagem. Cada pergunta é texto fixo novo: pede áudio.

**16. A criança grava a própria leitura** 🔴
- Ideia: ler a fábula em voz alta, gravar e ouvir depois (ou mostrar para a família).
- Lógica: microfone do aparelho, áudio guardado só no tablet, nunca enviado (regra de não coletar dados). Sem correção automática: o prêmio é ouvir a própria voz.

### Saída Secreta

**17. Salas novas por tema** 🔴 (por sala)
- Ideia: navio pirata, laboratório do cientista maluco, casa na árvore, estação espacial, cozinha da avó, biblioteca do castelo, submarino.
- Lógica: cada sala segue `docs/SAIDA-SECRETA.md` (fundo, 9 fontes, extras, saída). O custo é a imagem e as variantes de enigma.

**18. Tipos novos de enigma** 🟡 (cada um)
- **Balança**: descobrir quanto pesa um objeto comparando pratos (lógica e soma).
- **Sequência**: "2, 4, 6, ?" ou padrões de cores e formas; a resposta é o número do cadeado.
- **Espelho/simetria**: completar a metade que falta de um desenho numa grade.
- **Relógio**: ler a hora no relógio da sala; o número é a hora.
- **Labirinto**: levar a chave até a porta com o dedo; o caminho passa por cima de um número.
- **Contar**: "quantos livros vermelhos há na estante?" (bom para o nível fácil).
- **Luzes**: tocar num interruptor muda ele e os vizinhos; acender todos.
- **Engrenagens/canos**: girar peças até ligar a entrada à saída.
- **Som**: repetir uma sequência de notas (memória auditiva, sem leitura).
- Lógica comum: cada tipo entra em `EnigmaView.tsx` com variantes por nível, como os quatro atuais.

**19. Salas encadeadas (o castelo inteiro)** 🟡
- Ideia: sair de uma sala leva à próxima; três ou quatro salas formam uma fuga completa com um fim de história.
- Lógica: uma "campanha" é uma lista de salas; um item achado numa sala pode ser usado na seguinte (inventário que atravessa). Progresso salvo entre salas.

**20. Fuga em dupla** 🟡
- Ideia: duas crianças no mesmo tablet: uma vê as pistas, a outra mexe no cadeado, e precisam conversar.
- Lógica: tela dividida ou turnos de "passa o tablet". Pede pistas que só fazem sentido combinadas.

**21. Modo relâmpago** 🟢
- Ideia: uma única fonte, um único número, para partidas de dois minutos.
- Lógica: `rodada.ts` sorteando 1 fonte em vez de 3 ou 4. Sem relógio à mostra (para não assustar); só a contagem de estrelas.

### Achar itens

**22. Cenas novas** 🔴 (por cena)
- Ideia: feira, praia, fundo do mar, quarto bagunçado, fazenda, circo, festa de aniversário, mercado, floresta à noite, cozinha.
- Lógica: uma `Cena` por arquivo; o custo é o fundo e os itens recortados.

**23. Achar pela pista, não pelo nome** 🟡
- Ideia: em vez de "bola", a lista diz "uma coisa redonda que quica" ou "começa com a letra B" ou "rima com cola".
- Lógica: cada item ganha pistas por variante e por nível. As de letra e de rima dependem da variante (a palavra certa muda): conferir uma a uma.

**24. Achar ouvindo** 🟢
- Ideia: sem lista escrita: o narrador diz o item e a criança procura. Para quem ainda não lê.
- Lógica: usa os áudios de palavra que já existem; botão para repetir.

**25. Achar pela sombra** 🟡
- Ideia: a lista mostra só a silhueta preta de cada item.
- Lógica: silhueta gerada da própria imagem do item (filtro CSS `brightness(0)`), sem imagem nova.

**26. O que mudou?** 🟡
- Ideia: a cena aparece, some, e volta com 3 coisas diferentes (um item sumiu, outro mudou de lugar, outro apareceu).
- Lógica: como os itens são camadas soltas em %, dá para sortear as mudanças sem desenhar nada. Jogo de memória visual com as cenas que já temos.

**27. Contar na cena** 🟡
- Ideia: "Quantas maçãs há?" A criança toca em cada uma e depois escolhe o número.
- Lógica: itens repetidos espalhados por sorteio em posições válidas da cena; a quantidade muda a cada rodada.

**28. Cena que se esconde sozinha** 🟡
- Ideia: os itens mudam de lugar a cada partida, para a cena não ser decorada.
- Lógica: cada item tem várias posições possíveis (`lugares: [...]`) e o jogo sorteia uma. Aumenta muito a vida útil de cada cena.

### Mapa-múndi

**29. Bandeiras** 🔴
- Ideia: ligar a bandeira ao país, ou encaixar a bandeira no lugar do país no mapa.
- Lógica: mesmas peças e zonas; a bandeja mostra bandeiras em vez de formas. Pede as imagens das bandeiras (domínio público, mas é muita imagem).

**30. Capitais** 🔴
- Ideia: o narrador diz a capital e a criança toca no país.
- Lógica: `paises.ts` ganha `capital` por variante (várias mudam: `Moscovo`/`Moscou`, `Amesterdão`/`Amsterdã`). Cada capital é áudio novo.

**31. Onde fica?** 🟢
- Ideia: o mapa já montado; o narrador diz um país e a criança toca nele.
- Lógica: usa só o que existe (formas e áudios). Três tentativas, depois o país pisca. Bom modo "revisão".

**32. Mapas de dentro dos países** 🔴
- Ideia: os estados do Brasil; os distritos e regiões autónomas de Portugal.
- Lógica: novas fontes de fronteiras no `gerar-mapas.mjs` (o Natural Earth tem divisões de nível 1). Os dois mapas interessam às duas variantes: cada criança aprende o seu país e o do outro.

**33. Bichos, comidas e monumentos do mundo** 🔴
- Ideia: arrastar o canguru para a Austrália, o panda para a China, a Torre de Belém para Portugal, o Cristo Redentor para o Brasil.
- Lógica: peças-figurinha com um país de destino; encaixar narra uma frase curta. Muitas imagens novas.

**34. Oceanos, rios e montanhas** 🟡
- Ideia: encaixar os nomes dos oceanos e continentes; depois, grandes rios e cordilheiras.
- Lógica: etiquetas arrastáveis para zonas do mapa-múndi; poucas peças, grandes.

**35. Viagem pelo mundo** 🟡
- Ideia: um aviãozinho precisa ir de um país a outro passando só por países vizinhos.
- Lógica: grafo de vizinhança calculado das fronteiras em `mapas:gerar`. A criança toca no próximo país; o jogo aceita qualquer vizinho que aproxime do destino.

---

## Parte 2: jogos novos

### Letras e palavras

**36. Sopa de letras / caça-palavras** 🟡
- Ideia: achar palavras escondidas numa grade, arrastando o dedo por cima.
- Lógica: gerador que coloca as palavras do dicionário na grade (horizontal e vertical no fácil; diagonal no difícil; nunca de trás para a frente para os menores) e preenche o resto com letras ao acaso, **conferindo que não se formou palavra feia por acidente**. Lista de palavras com imagem ao lado. O nome do jogo muda por variante (`sopa de letras` / `caça-palavras`).

**37. Palavras cruzadas com imagens** 🟡
- Ideia: cruzadinha pequena em que cada pista é uma imagem.
- Lógica: gerador que cruza 4 a 6 palavras do dicionário por letras em comum. Grade por variante, porque a grafia muda.

**38. Fábrica de rimas** 🟡
- Ideia: ligar as palavras que rimam (`gato`/`pato`, `mão`/`pão`).
- Lógica: grupos de rima marcados à mão por variante (a pronúncia difere e muda o que rima). Formato de pares, reaproveitando `Pares`.

**39. Primeira letra / som inicial** 🟢
- Ideia: aparece uma letra e várias imagens; tocar em todas as que começam com ela.
- Lógica: sai direto do dicionário de `palavras.ts`. Para os que estão a começar o alfabeto.

**40. Trem das sílabas** 🟡
- Ideia: cada vagão leva uma sílaba; a criança engata os vagões na ordem para formar a palavra da imagem.
- Lógica: mesma base da ideia 10, com outra roupa. (`comboio` em pt-PT, `trem` em pt-BR.)

**41. Fábrica de frases** 🟡
- Ideia: palavras soltas em cartões; pôr em ordem para formar a frase que o narrador disse.
- Lógica: frases curtas por variante (a ordem muda: `diz-me` / `me diz`). Maiúscula e ponto final dão pista de começo e fim.

**42. Singular e plural, masculino e feminino** 🟡
- Ideia: um menino e uma menina, um cesto de "um" e outro de "muitos"; arrastar a palavra para o cesto certo.
- Lógica: dicionário com gênero e plural por palavra. Treina concordância (`o gato`, `as gatas`).

**43. Antónimos e contrários** 🟢
- Ideia: ligar `grande`/`pequeno`, `quente`/`frio`, `dia`/`noite`.
- Lógica: lista de pares com imagem. Jogo de pares simples.

**44. Trava-línguas e adivinhas** 🟡
- Ideia: o narrador diz uma adivinha ("o que é, o que é?") e a criança escolhe a imagem da resposta. Trava-línguas para ler junto e rir.
- Lógica: conteúdo tradicional de cada país, um conjunto por variante (não traduzir de um para o outro).

**45. Caligrafia: desenhar as letras** 🔴
- Ideia: seguir com o dedo o traçado de cada letra, na ordem certa dos traços.
- Lógica: cada letra é um conjunto de traços (caminhos SVG) com pontos de passagem; o jogo confere se o dedo passou por eles na ordem, com folga generosa. Letra de imprensa primeiro; cursiva depois (e a cursiva ensinada difere entre os dois países).

### Números e contas

**46. Loja de brinquedos (dinheiro)** 🟡
- Ideia: a criança compra coisas e paga com moedas e notas; ou é a vendedora e dá o troco.
- Lógica: **moeda por variante**: euros e cêntimos em pt-PT, reais e centavos em pt-BR, com as moedas e notas certas de cada um. Níveis: pagar o valor exato → escolher as moedas de mais de um jeito → dar troco.

**47. Dados e contas** 🟢
- Ideia: rolar dois ou três dados e tocar no resultado da soma.
- Lógica: usa `dados.ts`. Níveis: contar pintas → somar dois dados → somar três → subtrair. Pode ser o "treino" que prepara para o RPG.

**48. Balança dos números** 🟡
- Ideia: equilibrar a balança pondo pesos: de um lado `7`, do outro a criança põe `3 + 4`.
- Lógica: sorteia o alvo e os pesos disponíveis garantindo que existe solução. Introduz igualdade sem falar em "equação".

**49. Linha dos números / sapo saltador** 🟡
- Ideia: um sapo salta nas vitórias-régias numeradas: "salta 3 para a frente", "onde ele cai?".
- Lógica: reta de 0 a 20 (depois 0 a 100 de 10 em 10). Soma e subtração como movimento.

**50. Pizzaria das frações** 🟡
- Ideia: clientes pedem "metade de queijo e metade de cogumelos", "um quarto com azeitonas".
- Lógica: pizza dividida em 2, 4 ou 8 fatias; a criança pinta as fatias com o ingrediente. Confere a contagem de fatias por ingrediente.

**51. Relógio** 🟡
- Ideia: acertar os ponteiros na hora pedida, ou ler a hora e escolher.
- Lógica: ponteiros arrastáveis que encaixam de 5 em 5 minutos. Níveis: hora cheia → meia hora → quartos → minutos. Liga com a rotina ("hora do `pequeno-almoço`" / "hora do `café da manhã`").

**52. Tabuada das naves / do castelo** 🟡
- Ideia: cada tabuada é uma fase; acertar contas faz a nave avançar ou o castelo ganhar uma torre.
- Lógica: repetição espaçada simples: as contas erradas voltam mais vezes. Sem relógio no começo.

**53. Padrões e sequências** 🟢
- Ideia: `🔴🔵🔴🔵?`: qual vem a seguir? Depois com números.
- Lógica: gerador de padrões (AB, AAB, ABC, crescente de 2 em 2). Sem leitura nenhuma.

**54. Maior, menor, igual** 🟢
- Ideia: o jacaré come o número maior.
- Lógica: dois números (ou dois grupos de objetos) e a criança vira a boca do jacaré. Clássico de sala de aula.

**55. Formas e tangram** 🔴
- Ideia: montar figuras (casa, barco, gato) com triângulos e quadrados.
- Lógica: peças arrastáveis com rotação por toque (girar de 45° em 45°) e encaixe por proximidade. O arrastar do Mapa-múndi serve de base; a rotação é nova.

**56. Medir e comparar** 🟡
- Ideia: qual é o mais comprido, o mais pesado, o que leva mais água?
- Lógica: comparação visual, depois com régua e balança. Unidades iguais nas duas variantes, mas atenção à grafia (`quilómetro` / `quilômetro`).

### Lógica e memória

**57. Jogo da memória** 🟢
- Ideia: virar cartas e achar os pares.
- Lógica: pares imagem-imagem, depois **imagem-palavra** (lê para achar o par) e **palavra-som**. Usa as imagens do dicionário. Tamanhos 2×3, 3×4, 4×4.

**58. Quebra-cabeça de imagens** 🟡
- Ideia: montar em peças as ilustrações que já temos (cenas, fundos das salas, fábulas).
- Lógica: corta qualquer imagem em grade (2×2 até 5×4) com peças retangulares; arrastar e encaixar como no mapa. Zero imagem nova.

**59. Sudoku de figuras** 🟡
- Ideia: grade 4×4 com frutas ou bichos em vez de números: nenhum repetido em linha, coluna ou bloco.
- Lógica: gerador de grade válida com solução única; 4×4 no fácil, 6×6 no difícil.

**60. Robô programável** 🔴
- Ideia: montar uma fila de setas (frente, virar, pegar) e ver o robô executá-las até chegar ao tesouro.
- Lógica: grade com obstáculos; a criança arrasta comandos para uma fila e aperta "vai". Níveis: só andar → virar → repetir (laço) → "se tiver pedra, salta". Pensamento de programação sem ler código.

**61. Labirintos** 🟡
- Ideia: levar o ratinho ao queijo com o dedo.
- Lógica: gerador de labirinto (grade maior = mais difícil) com corredores largos para o dedo. Variantes: apanhar chaves no caminho, labirinto no escuro com lanterna.

**62. Liga os pontos** 🟡
- Ideia: tocar nos pontos em ordem (1, 2, 3...) e ver o desenho aparecer.
- Lógica: ordem por números, depois pelo alfabeto, depois de 2 em 2. Os desenhos são listas de pontos.

**63. Classificar e arrumar** 🟢
- Ideia: arrumar o quarto: brinquedos na caixa, roupa no armário, livros na estante. Ou separar o lixo para reciclar.
- Lógica: itens com categoria; arrastar para o cesto certo. Na reciclagem, as cores dos ecopontos de Portugal e das lixeiras do Brasil são diferentes: fazer por variante.

**64. Blocos deslizantes / estacionamento** 🔴
- Ideia: tirar o carrinho vermelho de um estacionamento cheio, deslizando os outros.
- Lógica: grade 6×6, peças que só andam no seu eixo; fases feitas à mão ou geradas e conferidas por um resolvedor.

**65. Detetive por eliminação** 🟡
- Ideia: "Quem comeu o bolo?" Pistas como "tinha chapéu", "não usava óculos" eliminam suspeitos até sobrar um.
- Lógica: personagens com atributos; o jogo sorteia o culpado e gera pistas que levam a ele sem ambiguidade. Leitura com propósito.

### Mundo, ciência e natureza

**66. Corpo humano** 🔴
- Ideia: encaixar os ossos no esqueleto, os órgãos no corpo; ou ligar os cinco sentidos ao que percebem.
- Lógica: quebra-cabeça de encaixe (motor do mapa) com narração de cada parte.

**67. Sistema solar** 🔴
- Ideia: pôr os planetas na ordem, do Sol para fora; depois ordenar por tamanho.
- Lógica: encaixe e ordenação. Cada planeta com uma curiosidade narrada.

**68. Bichos e as suas casas** 🟡
- Ideia: levar cada animal ao seu lugar (mar, floresta, deserto, gelo, fazenda), ou à sua comida, ou ao seu filhote, ou ao som que faz.
- Lógica: pares e classificação. Vários nomes de bichos e sons mudam entre variantes.

**69. Horta e estações** 🟡
- Ideia: plantar, regar, esperar e colher; saber o que nasce em cada estação.
- Lógica: ciclo curto em passos (semente → broto → planta → fruto) ordenados pela criança. As estações caem em meses opostos em Portugal e no Brasil: texto por variante.

**70. Cozinha: seguir a receita** 🟡
- Ideia: ler a receita e pôr os ingredientes na tigela, na quantidade e ordem certas.
- Lógica: receita como lista de passos (`3 ovos`, `2 colheres de açúcar`); junta leitura, contagem e sequência. Receitas e nomes de ingredientes por variante.

**71. Linha do tempo** 🔴
- Ideia: ordenar coisas do mais antigo ao mais novo: dinossauros, castelos, caravelas, comboios/trens, foguetões/foguetes.
- Lógica: ordenação com poucas cartas. Abre espaço para história de cada país em coleções separadas.

**72. Trânsito e segurança** 🟡
- Ideia: ajudar o boneco a atravessar a rua: olhar para os dois lados, esperar o sinal verde, usar a passadeira/faixa.
- Lógica: escolhas simples com consequência suave. Vocabulário muito diferente (`passadeira`/`faixa de pedestres`, `semáforo`/`sinal`).

**73. Emoções** 🟡
- Ideia: ver uma carinha ou uma situação curta e dizer como a pessoa se sente; depois, o que ajudaria.
- Lógica: escolha entre rostos. Não tem resposta "errada" dura: várias podem ser aceitas.

### Arte, música e criação

**74. Colorir** 🟡
- Ideia: pintar desenhos tocando nas áreas; modo "pintar por número" (cada número, uma cor; resultado de contas simples indica a cor).
- Lógica: desenhos em SVG com regiões; o toque preenche. O modo por número junta arte e matemática.

**75. Piano e repetir a melodia** 🟡
- Ideia: teclado colorido para tocar livre; e um jogo de repetir sequências que crescem.
- Lógica: sons gerados pela Web Audio (sem arquivo de áudio). Sequência cresce uma nota por rodada.

**76. Criador de histórias** 🔴
- Ideia: a criança escolhe personagem, lugar e problema em cartas, e o jogo monta uma historinha para ler e ouvir.
- Lógica: moldes de texto com chaves (como `preencher()` do RPG) por variante. O difícil é o áudio: ou frases gravadas em blocos que se combinam, ou a voz do aparelho só nesse jogo.

**77. Criador de monstros / de personagens** 🔴
- Ideia: juntar cabeça, corpo e pernas para inventar um bicho, e dar-lhe um nome escrevendo.
- Lógica: camadas de imagem combináveis. O bicho inventado poderia aparecer como inimigo (ou companheiro) no RPG.

**78. Desenho livre com carimbos** 🟡
- Ideia: tela em branco, pincéis grossos, carimbos das imagens do dicionário.
- Lógica: canvas com poucas ferramentas grandes. Guardar o desenho só no aparelho.

### Para jogar em família

**79. Jogo de tabuleiro com dado** 🟡
- Ideia: trilha de casas, 2 a 4 jogadores no mesmo tablet, cada um rola o dado na sua vez.
- Lógica: casas especiais pedem um minijogo (uma conta, uma palavra, um par). Junta os outros jogos num só. Usa `dados.ts`.

**80. Mímica e desenho** 🟢
- Ideia: o tablet mostra uma palavra (e imagem) só para quem vai fazer a mímica; os outros adivinham.
- Lógica: sorteio do dicionário, botões "acertaram" / "passar". Jogo de sala, sem tela para a maioria.

**81. Quiz em equipe** 🟡
- Ideia: perguntas com imagens, dois lados do tablet, cada equipe com o seu botão.
- Lógica: banco de perguntas por tema e por variante; quem tocar primeiro responde.

---

## Parte 3: ideias para o app inteiro

**82. Álbum de figurinhas / cromos** 🟡
- Cada jogo terminado dá uma figurinha (bichos, países, monstros). O álbum mostra o que falta e convida a jogar o que ainda não foi jogado. (`cromos` em pt-PT, `figurinhas` em pt-BR.)

**83. Desafio do dia** 🟡
- Três tarefas curtas sorteadas pela data (uma de ler, uma de contas, uma de lógica). Mesmo sorteio para todos naquele dia, sem servidor (semente = data).

**84. Perfis de criança** 🟡
- Vários perfis no mesmo tablet (irmãos), cada um com nome, bichinho e progresso. Tudo local, sem conta nem login.

**85. Mascote do baú** 🔴
- Um personagem que mora no menu, comemora os acertos e sugere o próximo jogo. Ganha enfeites com o progresso.

**86. Dificuldade que se ajusta sozinha** 🟡
- Três acertos seguidos sobem o nível; dois erros descem, sem avisar. A criança fica sempre no ponto em que consegue, mas com esforço.

**87. Cantinho dos pais** 🟡
- Atrás de uma "trava" (segurar o botão 3 segundos ou resolver uma conta de adulto): o que a criança jogou, onde tem mais dificuldade, escolha de variante e de nível. Só no aparelho.

**88. Trilha de aprendizagem** 🔴
- Um mapa de ilha com casas em sequência que misturam os jogos por idade ou ano escolar, em vez do menu solto.

**89. Acessibilidade** 🟡
- Fonte para dislexia, modo de alto contraste, ajuste de velocidade do narrador, modo sem som com legendas, cores seguras para daltónicos nos jogos que dependem de cor.

**90. Temas por época** 🟡
- Enfeites e fases especiais: Natal, Carnaval, festas juninas (Brasil), santos populares (Portugal), volta às aulas (em meses diferentes em cada país).

**91. Imprimir** 🟡
- Gerar uma folha para imprimir a partir do jogo: caça-palavras, liga os pontos, desenho para colorir, labirinto. Leva a brincadeira para fora da tela.

---

## Por onde começar (palpite, não decisão)

Ideias com muito retorno e pouca coisa nova para produzir, porque usam imagens e áudios que já existem:

- **57. Jogo da memória** e **58. Quebra-cabeça de imagens**: jogos inteiros sem imagem nova.
- **31. Onde fica?** e **24. Achar ouvindo**: modos novos só com o que já está gravado.
- **25. Achar pela sombra**, **26. O que mudou?** e **28. Cena que se esconde sozinha**: multiplicam a vida das cenas atuais.
- **9. Níveis de ajuda na escrita** e **12. Letra que falta**: abrem os jogos de palavras para crianças mais novas.
- **47. Dados e contas**: primeiro jogo de matemática, com `dados.ts` pronto.
