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
  jogos/
    registro.ts          lista de todos os jogos (adicione novos aqui)
    rpg/                 RPG com história, ficha de personagem e dados de luta
    escrita/             jogos de escrever palavras
    leitura/             jogos de ler palavras
public/                  ícones do app
```

Para criar um jogo novo: crie a pasta em `src/jogos/<nome>/`, exporte um componente React e registre em `src/jogos/registro.ts`.

## Regras de design (tablet e crianças)

- **Toque primeiro**: alvos de toque com no mínimo **64 px**, botões grandes, espaçamento generoso. Nada que dependa de hover, clique direito ou teclado físico.
- Orientação paisagem e retrato devem funcionar.
- Evitar texto pequeno e telas lotadas. Letra grande e legível (fonte clara, bom contraste).
- Feedback visual e sonoro simples para acertos e erros, sem punição dura.
- Sem anúncios, sem login, sem coleta de dados pessoais das crianças.
- Impedir zoom acidental e seleção de texto nos elementos de jogo.

## Comandos

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (acessível na rede local para testar no tablet)
npm run build      # build de produção
npm run typecheck  # checagem de tipos
```

## Convenções

- Commits em português, no imperativo curto (ex.: `Adiciona ficha de personagem`).
- Nomes de arquivos e pastas em português sem acentos (`escrita`, `dados.ts`).
- Componentes React em `PascalCase`, funções e variáveis em `camelCase`.
- Nada de `any` sem justificativa.
