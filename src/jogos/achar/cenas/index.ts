import type { Cena } from '../tipos';
import { banheiro } from './banheiro';
import { cozinha } from './cozinha';
import { escritorio } from './escritorio';
import { garagem } from './garagem';
import { lavanderia } from './lavanderia';
import { quarto } from './quarto';
import { quintal } from './quintal';
import { sala } from './sala';

/** Todas as cenas do jogo. Para criar uma cena nova, crie o arquivo e liste-a aqui. */
export const CENAS: Cena[] = [quarto, sala, cozinha, banheiro, escritorio, lavanderia, garagem, quintal];
