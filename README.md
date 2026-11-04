# Baú de Jogos

Jogos educativos e divertidos para crianças, em português (**Portugal** e **Brasil**), pensados para tablet.

## Jogos planejados

- 🐉 **Aventura RPG**: história com escolhas, ficha de personagem e dados para as lutas
- ✏️ **Escrever palavras**: jogos para praticar a escrita
- 📖 **Ler palavras**: jogos para praticar a leitura

Por enquanto o repositório tem só a base: menu inicial, seletor de variante (pt-PT / pt-BR) e uma tela provisória para cada jogo.

## Tecnologias

TypeScript, React, Vite e PWA (instalável na tela inicial do tablet, funciona offline).

## Como rodar

```bash
npm install
npm run dev
```

O comando `dev` mostra um endereço de rede local (ex.: `http://192.168.0.10:5173`). Abra esse endereço no navegador do tablet, na mesma rede Wi-Fi.

Para gerar a versão final:

```bash
npm run build
npm run preview
```

## Instalar no tablet

Com o app publicado em um endereço HTTPS, abra-o no navegador do tablet e escolha **Adicionar à tela inicial** (Safari/iPad) ou **Instalar app** (Chrome/Android). Ele abre em tela cheia, como um app.

## Para quem for contribuir

Leia o [CLAUDE.md](CLAUDE.md): ele explica a estrutura, as regras de design para tablet e os cuidados com as diferenças entre português de Portugal e do Brasil.
