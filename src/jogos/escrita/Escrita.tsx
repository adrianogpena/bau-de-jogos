import type { PropsJogo } from '../tipos';
import { EmBreve } from '../EmBreve';

// TODO: jogos para escrever palavras. As listas de palavras e a correção
// devem usar a variante escolhida (pt-PT ou pt-BR).
export function Escrita(props: PropsJogo) {
  return (
    <EmBreve
      {...props}
      emoji="✏️"
      titulo={{ 'pt-PT': 'Escrever palavras', 'pt-BR': 'Escrever palavras' }}
    />
  );
}
