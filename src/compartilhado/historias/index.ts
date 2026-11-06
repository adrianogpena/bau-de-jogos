import type { TextoPorIdioma } from '../idioma';
import type { Fabula } from './modelo';
import { aladino } from './aladino';
import { aliBaba } from './ali-baba';
import { brancaDeNeve } from './branca-de-neve';
import { capuchinhoVermelho } from './capuchinho-vermelho';
import { cigarraFormiga } from './cigarra-formiga';
import { corvoRaposa } from './corvo-raposa';
import { hanselGretel } from './hansel-gretel';
import { leaoRato } from './leao-rato';
import { lebreTartaruga } from './lebre-tartaruga';
import { musicosDeBremen } from './musicos-de-bremen';
import { principeSapo } from './principe-sapo';
import { simbad } from './simbad';
import { tresPorquinhos } from './tres-porquinhos';

export type { Fabula, Paragrafo, Rodada, Segmento } from './modelo';
export { paragrafoCompleto, segmentosDoParagrafo } from './modelo';

/**
 * Histórias usadas nos jogos de escrita e de leitura, uma por arquivo nesta pasta.
 * Para criar uma nova: copie um arquivo, troque os dados e liste-a aqui numa coleção.
 * Cada texto é escrito à parte para pt-PT e pt-BR: revise as duas variantes ao mudar.
 * Evite que uma palavra da imagem apareça noutro ponto do mesmo parágrafo (daria a resposta).
 */

/** Um grupo de histórias na tela de escolha. */
export interface Colecao {
  id: string;
  titulo: TextoPorIdioma;
  historias: Fabula[];
}

/** Fábulas (Esopo e La Fontaine). */
export const FABULAS: Fabula[] = [lebreTartaruga, leaoRato, cigarraFormiga, corvoRaposa, tresPorquinhos];

/** Contos dos Irmãos Grimm (versões para crianças, perto das originais). */
export const CONTOS_GRIMM: Fabula[] = [capuchinhoVermelho, hanselGretel, brancaDeNeve, musicosDeBremen, principeSapo];

/** Contos das Mil e Uma Noites (versões para crianças). */
export const CONTOS_MIL_E_UMA_NOITES: Fabula[] = [aliBaba, aladino, simbad];

export const COLECOES: Colecao[] = [
  { id: 'fabulas', titulo: { 'pt-PT': '[[menu/categoria-fabulas]] Fábulas', 'pt-BR': '[[menu/categoria-fabulas]] Fábulas' }, historias: FABULAS },
  { id: 'grimm', titulo: { 'pt-PT': '[[menu/categoria-grimm]] Irmãos Grimm', 'pt-BR': '[[menu/categoria-grimm]] Irmãos Grimm' }, historias: CONTOS_GRIMM },
  {
    id: 'mil-e-uma-noites',
    titulo: { 'pt-PT': '[[menu/categoria-mil-e-uma-noites]] As Mil e Uma Noites', 'pt-BR': '[[menu/categoria-mil-e-uma-noites]] As Mil e Uma Noites' },
    historias: CONTOS_MIL_E_UMA_NOITES,
  },
];
