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

Por enquanto: menu inicial, seletor de variante, tela de créditos, uma **amostra do jogo 1** (19 palavras) e telas provisórias para os outros jogos.

## Gratuito para sempre

O Baú de Jogos é **gratuito, sem anúncios, sem login e sem coleta de dados**. Isso não é só uma escolha: as imagens dos jogos 1 e 2 usam licença **não comercial** (veja abaixo). Se algum dia o app tiver anúncios, assinatura ou venda, essas imagens precisam sair.

## Imagens e créditos

- **Jogos de escrita e leitura:** pictogramas do [ARASAAC](https://arasaac.org) (Governo de Aragão), autor Sergio Palao, licença [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/). Ficam em `public/imagens/arasaac/` (veja o `LICENCA.md` da pasta) e o app tem uma tela **Créditos**.
- **RPG (planejado):** ícones do [game-icons.net](https://game-icons.net/about.html), licença CC BY 3.0 (exige crédito aos autores; confira a licença de cada ícone).
- As imagens são guardadas no repositório (não vêm de API), para o app funcionar offline.
- Imagens do ARASAAC editadas (recoloridas, por exemplo) devem manter a mesma licença CC BY-NC-SA.
- Palavras por variante: a mesma imagem tem uma palavra para pt-PT e outra para pt-BR (ex.: *autocarro* / *ônibus*). Veja `src/compartilhado/palavras.ts`.

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
