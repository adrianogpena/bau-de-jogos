import { type Personagem, imagemPersonagem } from './personagem';

/** Desenho do personagem escolhido (herói ou mago). */
export function FiguraPersonagem({ personagem, classe = 'figura-personagem' }: { personagem: Personagem; classe?: string }) {
  return (
    <img
      className={classe}
      src={`${import.meta.env.BASE_URL}${imagemPersonagem(personagem)}`}
      alt=""
      draggable={false}
    />
  );
}
