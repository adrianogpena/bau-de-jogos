import type { PropsJogo } from '../tipos';
import { EmBreve } from '../EmBreve';

// TODO: história com cenas e escolhas, ficha de personagem e dados para as lutas.
// Os tipos já estão em ./tipos.ts. Os textos da história devem existir em pt-PT e pt-BR.
export function Rpg(props: PropsJogo) {
  return (
    <EmBreve
      {...props}
      emoji="🐉"
      titulo={{ 'pt-PT': 'Aventura RPG', 'pt-BR': 'Aventura RPG' }}
    />
  );
}
