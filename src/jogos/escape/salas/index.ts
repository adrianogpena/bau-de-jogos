import type { Sala } from '../tipos';
import { laboratorio } from './laboratorio';
import { museu } from './museu';
import { nave } from './nave';
import { navio } from './navio';
import { piramide } from './piramide';
import { sotao } from './sotao';

/** Todas as salas da Saída Secreta. Para criar uma sala nova, crie o arquivo e liste-a aqui. */
export const SALAS: Sala[] = [sotao, navio, nave, laboratorio, museu, piramide];
