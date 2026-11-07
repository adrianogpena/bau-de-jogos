import type { ReactNode } from 'react';
import { type Idioma, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import type { Enigma } from '../tipos';
import { Codigo } from './Codigo';
import { Escolha } from './Escolha';
import { Ordem } from './Ordem';
import { Pares } from './Pares';
import { comIcones } from '../../../compartilhado/icones';

/** Mostra o visual, a pergunta e o tipo de enigma certo. Novos tipos entram aqui. */
export function EnigmaView({
  enigma,
  idioma,
  aoAcertar,
  rotulos,
}: {
  enigma: Enigma;
  idioma: Idioma;
  aoAcertar: () => void;
  /** Desenhos por cima dos números de um cadeado. */
  rotulos?: ReactNode[];
}) {
  return (
    <>
      {enigma.visual && (
        <p className="visual-enigma" aria-hidden="true">
          {comIcones(enigma.visual)}
        </p>
      )}
      <TextoNarrado className="pergunta-enigma" idioma={idioma} texto={t(enigma.pergunta, idioma)} compacto />
      {enigma.tipo === 'codigo' && <Codigo enigma={enigma} idioma={idioma} aoAcertar={aoAcertar} rotulos={rotulos} />}
      {enigma.tipo === 'ordem' && <Ordem enigma={enigma} idioma={idioma} aoAcertar={aoAcertar} />}
      {enigma.tipo === 'escolha' && <Escolha enigma={enigma} idioma={idioma} aoAcertar={aoAcertar} />}
      {enigma.tipo === 'pares' && <Pares enigma={enigma} idioma={idioma} aoAcertar={aoAcertar} />}
    </>
  );
}
