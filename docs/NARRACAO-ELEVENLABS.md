# Narração com ElevenLabs

O script `scripts/gerar-audio.mjs` lê todas as histórias do projeto e gera um áudio por parágrafo (e por título), uma vez para cada variante (pt-PT e pt-BR). Os arquivos ficam em `public/audio/` e o app passa a tocá-los em vez da voz do aparelho (essa ligação no app é o passo seguinte).

## 1. Chave de acesso

Crie uma chave em ElevenLabs (Developers / API keys) e guarde **só no seu computador**, em `.env.local` (já ignorado pelo git):

```
ELEVENLABS_API_KEY=sua_chave_aqui
```

Nunca coloque a chave no código nem no app.

## 2. Escolher as vozes

```bash
npm run audio -- --listar-vozes pt-PT    # vozes da sua conta + biblioteca em português de Portugal
npm run audio -- --listar-vozes pt-BR
```

Para usar uma voz da biblioteca, adicione-a antes à sua conta (botão de adicionar no site). Depois copie o `id` para `scripts/vozes.json`:

```json
"vozes": {
  "pt-PT": { "id": "ID_DA_VOZ", "nome": "Nome para lembrar" },
  "pt-BR": { "id": "ID_DA_VOZ", "nome": "Nome para lembrar" }
}
```

Também dá para ajustar ali o modelo, a velocidade (`speed`, 0.7 a 1.2; começa em 0.9, mais calma para crianças) e a estabilidade.

## 3. Gerar

```bash
npm run audio -- --simular                                  # mostra o que seria gerado e quantos caracteres gastaria
npm run audio -- --variante pt-BR --historia leao-rato      # teste com uma história só
npm run audio                                               # gera tudo o que falta
npm run audio -- --forcar                                   # refaz tudo
```

- Só é gerado o que mudou: cada arquivo guarda uma impressão digital do texto, da voz e dos ajustes. Trocar de voz refaz tudo; corrigir uma frase refaz só ela.
- Hoje são cerca de **31 mil caracteres** para as duas variantes (veja o número atualizado com `--simular`). Confira o limite do seu plano.
- Teste primeiro com uma história e ouça antes de gerar o resto.

## O que é gerado

```
public/audio/<variante>/<historia>/titulo.mp3 + titulo.json
public/audio/<variante>/<historia>/p01.mp3    + p01.json   (um por parágrafo)
```

O `.json` tem o texto e o tempo de início e fim de cada palavra, usado para destacar a palavra lida junto com o áudio.

## Cuidados

- Confira os **termos de uso/licença** da voz escolhida e do seu plano: o plano gratuito normalmente não permite uso comercial.
- Os áudios entram no pacote offline do app (PWA), então o tamanho cresce. Se ficar pesado, baixe a qualidade em `formato` (por exemplo `mp3_44100_32`).
- A pronúncia vem do texto de cada variante, então a grafia pt-PT/pt-BR dos arquivos de história já dita o sotaque correto.
