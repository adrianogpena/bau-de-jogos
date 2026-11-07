# Baú de Jogos

Coleção de jogos educativos e divertidos para crianças, feitos para rodar bem em **tablet** (toque, tela grande, instalável como app).

## ⚠️ Idioma: tudo em português (atenção a PT-PT vs PT-BR)

Todo o projeto é em **português**: textos da interface, histórias, nomes de variáveis de domínio, comentários, commits, documentação e mensagens de erro.

**Cuidado: o público terá crianças de Portugal e do Brasil.** As duas variantes têm diferenças de vocabulário, ortografia e gramática que importam muito em jogos de leitura e escrita.

- Nunca misture as variantes no mesmo texto. Cada texto pertence a **uma** variante (`pt-PT` ou `pt-BR`).
- Todo conteúdo de jogo (histórias, palavras, frases, instruções) deve ser escrito **por variante**, em arquivos/chaves separados, e nunca em um único texto "neutro" que acabe errado para uma das variantes.
- O código usa o tipo `Idioma = 'pt-PT' | 'pt-BR'` (em `src/compartilhado/idioma.ts`). Qualquer texto exibido deve passar por esse sistema.
- Em jogos de **escrita e leitura**, a palavra "certa" depende da variante. Ex.: a lista de palavras e a correção da resposta têm de usar a variante escolhida.
- Em dúvida sobre uma palavra ou grafia, **pergunte ao usuário** em vez de adivinhar.

### Diferenças comuns para vigiar

| Tema | pt-PT | pt-BR |
|---|---|---|
| Tratamento | tu (`tens`, `queres`) | você (`você tem`, `você quer`) |
| Gerúndio | `a correr`, `a brincar` | `correndo`, `brincando` |
| Pronome com verbo | `diz-me`, `viu-o` (ênclise) | `me diz`, `o viu` (próclise) |
| Ortografia | `facto`, `equipa`, `espetáculo`, `contacto` | `fato`, `equipe`, `espetáculo` (mesma grafia em alguns casos), `contato` |
| Acentuação | `António`, `bebé`, `ténis` | `Antônio`, `bebê`, `tênis` |
| Vocabulário | `autocarro`, `comboio`, `telemóvel`, `ecrã`, `rato`, `casa de banho`, `pequeno-almoço`, `miúdo`, `gelado`, `sumo` | `ônibus`, `trem`, `celular`, `tela`, `mouse`, `banheiro`, `café da manhã`, `criança`, `sorvete`, `suco` |

Esta tabela é um ponto de partida, não uma lista completa. Revise sempre o texto novo com as duas variantes em mente.

## Imagens novas

Sempre que o trabalho precisar de uma **imagem nova** (cenário, personagem, item, ícone...), **não invente nem use placeholder definitivo**: avise o usuário de que ele deve gerar a imagem e entregue o **prompt**.

- O prompt vai em `docs/PROMPTS-IMAGENS.md` (fila de imagens ainda não geradas). Depois que a imagem for adicionada ao projeto, **apague o prompt** desse arquivo.
- Escreva o prompt **em inglês**, bem detalhado, encaixando no tema da história/app. Comece com o prompt de estilo único de `docs/GERAR-IMAGENS.md`.
- Indique o **formato**: `1:1`, `9:16`, `3:4`, `4:3` ou `16:9`, e o caminho onde salvar (`public/imagens/...`).
- Personagens e itens soltos: fundo branco puro (#FFFFFF), para recorte.

## Stack

- **TypeScript** (modo estrito) + **React** + **Vite**
- **PWA** (`vite-plugin-pwa`): instalável na tela inicial do tablet, funciona offline
- Sem backend por enquanto. Progresso salvo localmente (`localStorage`)

Por que não HTML puro: componentes reutilizáveis entre jogos, tipagem para fichas/dados/estado dos jogos e um único app instalável com todos os jogos.

## Estrutura

```
src/
  main.tsx               ponto de entrada
  App.tsx                menu inicial e navegação entre jogos
  estilos.css            estilos globais (botões grandes, toque)
  compartilhado/         código usado por vários jogos
    idioma.ts            tipo Idioma + seletor de variante
    dados.ts             rolagem de dados (d4, d6, d20...)
    palavras.ts          dicionário de palavras com pictograma (por variante)
    historias/           histórias dos jogos 1 e 2, um arquivo por história (index.ts lista as coleções)
      modelo.ts          tipos e fabula(): confere os dados ao carregar; cada parágrafo tem uma ou mais
                         palavras (`palavras: [imagem, ...]`) e o texto por variante com `{1}`, `{2}`...
    TextoNarrado.tsx     texto lido em voz alta com destaque da palavra lida
  jogos/
    registro.ts          lista de todos os jogos (adicione novos aqui)
    rpg/                 RPG: escolha de história (Rpg.tsx), com ficha, loja e dados de luta
      PedraDaLua.tsx     história 1: guerreiro, loja, mapa com enigmas
      mago/              história 2 (A Torre Encantada): tipos de mago, feitiços e energia mágica
    escrita/             jogo 1: completar a fábula escrevendo a palavra da imagem
    leitura/             jogo 2: ler a fábula e escolher a imagem da palavra em destaque
    escape/              jogo 3: escape room (lógica). Motor reutilizável + salas
      tipos.ts           modelo de dados: Sala, ObjetoSala, Enigma, Pista
      MotorSala.tsx      a sala jogável: objetos tocáveis, inventário, dicas, estrelas
      enigmas/           tipos de enigma: Codigo, Ordem, Escolha, Pares (novos entram em EnigmaView.tsx)
      salas/             uma sala por arquivo (texto por variante); liste em salas/index.ts
    achar/               jogo 4: achar itens escondidos em cenas (fundo + itens soltos em camadas)
      tipos.ts           modelo de dados: Cena, ItemCena (posição em % da cena)
      cenas/             uma cena por arquivo (palavras por variante); liste em cenas/index.ts
public/                  ícones do app
```

Para criar uma sala nova de escape room: crie `src/jogos/escape/salas/<nome>.ts` com uma `Sala` e adicione em `salas/index.ts`.

Para criar uma cena nova de achar itens: crie `src/jogos/achar/cenas/<nome>.ts` com uma `Cena` e adicione em `cenas/index.ts`. Como gerar as imagens: `docs/GERAR-IMAGENS.md`.

Para criar um jogo novo: crie a pasta em `src/jogos/<nome>/`, exporte um componente React e registre em `src/jogos/registro.ts`.

## Regras de design (tablet e crianças)

- **Toque primeiro**: alvos de toque com no mínimo **64 px**, botões grandes, espaçamento generoso. Nada que dependa de hover, clique direito ou teclado físico.
- Orientação paisagem e retrato devem funcionar.
  - **Cenas** (escape e achar itens) são sempre **4:3 inteiras, nunca cortadas** (os itens ficam em % do desenho). **Retrato**: cena na largura toda, palavras/mensagens/inventário embaixo. **Paisagem**: cena grande à esquerda (limitada pela altura livre) e painel de 280 px à direita. As mesmas imagens servem às duas orientações; não gere fundos em versão retrato.
  - Imagens de palavra (escrita e leitura): quadrado com `object-fit: contain`, tamanho limitado por `min(30vh, 80vw, 260px)`.
  - Teste com `npm run dev:tablet` (botão ⟳ gira a janela).
- Evitar texto pequeno e telas lotadas. Letra grande e legível (fonte clara, bom contraste).
- Feedback visual e sonoro simples para acertos e erros, sem punição dura.
- Sem anúncios, sem login, sem coleta de dados pessoais das crianças.
- Impedir zoom acidental e seleção de texto nos elementos de jogo.

## Comandos

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (acessível na rede local para testar no tablet)
npm run servidor   # servidor local de testes, sempre na porta 5199 (http://localhost:5199/bau-de-jogos/)
npm run build      # build de produção
npm run typecheck  # checagem de tipos
npm test          # confere que toda frase das histórias tem áudio (roda sozinho no push)
npm run audio      # gera a narração das histórias com ElevenLabs (vozes em scripts/vozes.json; veja docs/NARRACAO-ELEVENLABS.md)
```

Narrador: voz Piper (Tugão em pt-PT, Faber em pt-BR) com a voz do aparelho como reserva. Áudios das histórias: `npm run audio:piper`; veja `docs/NARRACAO-PIPER.md`.

## Fluxo de trabalho (git)

- Faça **todos os ajustes direto na `main`** e dê **push na `main`**. Não crie branches nem pull requests, a menos que o usuário peça.
- Antes de começar, atualize a `main` (`git pull origin main`). Rode `npm run typecheck`, `npm run build` e `npm test` antes de enviar.
- **Texto de história novo ou alterado exige áudio novo:** rode `npm run audio:piper` e inclua `public/audio/` no commit antes do push. O `npm test` (e o hook de pre-push) falha se faltar áudio.

## Convenções

- Commits em português, no imperativo curto (ex.: `Adiciona ficha de personagem`).
- Nomes de arquivos e pastas em português sem acentos (`escrita`, `dados.ts`).
- Componentes React em `PascalCase`, funções e variáveis em `camelCase`.
- Nada de `any` sem justificativa.
