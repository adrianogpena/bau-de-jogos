import type { Cena } from '../tipos';
import { quarto } from './quarto';
import { quintal } from './quintal';

/** Todas as cenas do jogo. Para criar uma cena nova, crie o arquivo e liste-a aqui. */
export const CENAS: Cena[] = [quintal, quarto];
