# Baú de Jogos

Jogos educativos e divertidos para crianças, em português (**Portugal** e **Brasil**), pensados para tablet.

## Jogos planejados

Os jogos têm dificuldades diferentes, do mais simples ao mais elaborado:

| Nível | Jogo | Como funciona |
|---|---|---|
| ⭐ Fácil | 🖼️ **Qual é a palavra?** (escrita) | Aparece uma imagem e a criança escreve o que ela é |
| ⭐⭐ Médio | 🔎 **Qual é a imagem?** (leitura) | Aparece uma palavra com várias imagens e a criança escolhe a certa |
| ⭐⭐⭐ Difícil | 🐉 **Aventura RPG** | Ficha de personagem, magias, espadas, dados e lutas |

A palavra "certa" depende da variante escolhida (pt-PT ou pt-BR): por exemplo, *autocarro* / *ônibus* ou *gelado* / *sorvete*.

Por enquanto: menu inicial, seletor de variante, tela de créditos, os **jogos 1 e 2** com 56 palavras ilustradas por variante, e o **jogo 3 (Aventura RPG)** com criação de ficha, história com escolhas, testes e lutas por turnos com dados.

## Gratuito para sempre

O Baú de Jogos é **gratuito, sem anúncios, sem login e sem coleta de dados**.
## Imagens e créditos

- **Todas as imagens** (palavras, achar itens, RPG, saída secreta) são geradas para o app, no estilo do livro infantil, conforme `docs/GERAR-IMAGENS.md`. Não há imagens de terceiros.
- As imagens são guardadas no repositório (não vêm de API), para o app funcionar offline.
- Palavras por variante: a mesma imagem tem uma palavra para pt-PT e outra para pt-BR (ex.: *autocarro* / *ônibus*). Veja `src/compartilhado/palavras.ts`.

## Tecnologias

TypeScript, React, Vite e PWA (instalável na tela inicial do tablet, funciona offline).

## Como rodar

```bash
npm install
npm run dev
```

O comando `dev` mostra um endereço de rede local (ex.: `http://192.168.0.10:5173/bau-de-jogos/`). Abra esse endereço no navegador do tablet, na mesma rede Wi-Fi.

Para gerar a versão final:

```bash
npm run build
npm run preview
```

## Publicação (GitHub Pages)

A publicação é **manual**: em **Actions → Publicar no GitHub Pages → Run workflow**, o workflow `.github/workflows/publicar.yml` gera o build e publica em `https://adrianogpena.github.io/bau-de-jogos/`. A fonte do Pages (Settings → Pages) deve estar em **GitHub Actions**.

## Instalar no tablet

Com o app publicado em um endereço HTTPS, abra-o no navegador do tablet e escolha **Adicionar à tela inicial** (Safari/iPad) ou **Instalar app** (Chrome/Android). Ele abre em tela cheia, como um app.

## Para quem for contribuir

Leia o [CLAUDE.md](CLAUDE.md): ele explica a estrutura, as regras de design para tablet e os cuidados com as diferenças entre português de Portugal e do Brasil.
