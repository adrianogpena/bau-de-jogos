import type { PropsJogo } from './tipos';
import { type TextoPorIdioma, t } from '../compartilhado/idioma';
import { comIcones } from '../compartilhado/icones';

const EM_CONSTRUCAO: TextoPorIdioma = {
  'pt-PT': 'Este jogo ainda está a ser construído!',
  'pt-BR': 'Este jogo ainda está sendo construído!',
};

const VOLTAR: TextoPorIdioma = {
  'pt-PT': 'Voltar',
  'pt-BR': 'Voltar',
};

interface Props extends PropsJogo {
  emoji: string;
  titulo: TextoPorIdioma;
}

/** Tela provisória usada pelos jogos que ainda serão criados. */
export function EmBreve({ idioma, aoVoltar, emoji, titulo }: Props) {
  return (
    <main className="tela tela-centro">
      <div className="emoji-grande" aria-hidden="true">
        {comIcones(emoji)}
      </div>
      <h1>{t(titulo, idioma)}</h1>
      <p>{t(EM_CONSTRUCAO, idioma)}</p>
      <button className="botao" onClick={aoVoltar}>
        {t(VOLTAR, idioma)}
      </button>
    </main>
  );
}
