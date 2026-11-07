import { type Genero, type Idioma, ROTULO_GENERO, type TextoPorIdioma, t } from '../../compartilhado/idioma';

const TEXTOS = {
  pergunta: { 'pt-PT': 'Escolhe: rapaz ou rapariga?', 'pt-BR': 'Escolha: menino ou menina?' },
} satisfies Record<string, TextoPorIdioma>;

/** Escolha entre masculino e feminino; os textos da história concordam com ela. */
export function EscolherGenero({
  idioma,
  genero,
  aoEscolher,
}: {
  idioma: Idioma;
  genero: Genero | null;
  aoEscolher: (genero: Genero) => void;
}) {
  return (
    <>
      <div className="ficha-rotulo">{t(TEXTOS.pergunta, idioma)}</div>
      <div className="avatares" role="group">
        {(['m', 'f'] as const).map((g) => (
          <button
            key={g}
            className={`avatar avatar-texto ${g === genero ? 'avatar-escolhido' : ''}`}
            onClick={() => aoEscolher(g)}
            aria-pressed={g === genero}
          >
            {ROTULO_GENERO[idioma][g]}
          </button>
        ))}
      </div>
    </>
  );
}
