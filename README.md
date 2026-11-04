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

Por enquanto o repositório tem só a base: menu inicial, seletor de variante e uma tela provisória para cada jogo.

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
