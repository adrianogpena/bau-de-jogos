import type { PropsJogo } from '../tipos';
import { EmBreve } from '../EmBreve';

// TODO: jogos para ler palavras. As palavras e frases devem existir
// separadas por variante (pt-PT ou pt-BR).
export function Leitura(props: PropsJogo) {
  return (
    <EmBreve
      {...props}
      emoji="📖"
      titulo={{ 'pt-PT': 'Ler palavras', 'pt-BR': 'Ler palavras' }}
    />
  );
}
