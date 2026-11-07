import { type Idioma, type TextoPorIdioma, t } from '../../compartilhado/idioma';
import { FiguraPersonagem } from './FiguraPersonagem';
import { PERSONAGENS, type TipoPersonagem } from './personagem';

const TEXTOS = {
  heroi: { 'pt-PT': 'Escolhe o teu herói:', 'pt-BR': 'Escolha seu herói:' },
  mago: { 'pt-PT': 'Escolhe o teu mago:', 'pt-BR': 'Escolha seu mago:' },
} satisfies Record<TipoPersonagem, TextoPorIdioma>;

/** Escolha entre os 4 personagens (2 masculinos e 2 femininos), cada um com o nome embaixo da imagem. */
export function EscolherPersonagem({
  idioma,
  tipo,
  escolhido,
  aoEscolher,
}: {
  idioma: Idioma;
  tipo: TipoPersonagem;
  escolhido: string | null;
  aoEscolher: (id: string) => void;
}) {
  return (
    <>
      <div className="ficha-rotulo">{t(TEXTOS[tipo], idioma)}</div>
      <div className="personagens" role="group">
        {PERSONAGENS[tipo].map((p) => (
          <button
            key={p.id}
            className={`personagem-opcao ${p.id === escolhido ? 'personagem-escolhido' : ''}`}
            onClick={() => aoEscolher(p.id)}
            aria-pressed={p.id === escolhido}
          >
            <FiguraPersonagem personagem={p} classe="personagem-imagem" />
            <strong>{p.nome}</strong>
          </button>
        ))}
      </div>
    </>
  );
}
