import type { LadosDado } from '../../../compartilhado/dados';
import type { Genero, TextoPorIdioma } from '../../../compartilhado/idioma';

/** Tipo de mago que a criança escolhe. */
export type EscolaId = 'fogo' | 'gelo' | 'natureza' | 'estrelas';

export type NomeHabilidade = 'poder' | 'energia' | 'sabedoria';
export type Habilidades = Record<NomeHabilidade, number>;

/**
 * Como o feitiço funciona na luta:
 * - ataque: d20 + Poder contra a CA; se acertar, causa dano
 * - certeiro: nunca erra
 * - atordoar: nunca erra e o inimigo perde a próxima vez
 * - protecao: sobe a CA no próximo ataque do inimigo
 * - cura: recupera vida
 */
export type TipoFeitico = 'ataque' | 'certeiro' | 'atordoar' | 'protecao' | 'cura';

export interface Feitico {
  id: string;
  /** `comum` é o feitiço que todo mago sabe. */
  escola: EscolaId | 'comum';
  emoji: string;
  nome: TextoPorIdioma;
  descricao: TextoPorIdioma;
  /** Energia mágica gasta ao lançar. */
  custo: number;
  tipo: TipoFeitico;
  /** Dado de dano ou de cura. */
  dado?: LadosDado;
  /** Somado ao d20 do ataque. */
  bonusAcerto?: number;
  /** Somado ao dano. */
  bonusDano?: number;
  /** Cura: somado ao dado. Proteção: quanto sobe a CA. */
  bonusExtra?: number;
  /** Pode ser aprendido por magos de outras escolas. */
  ensinavel?: boolean;
}

export interface Escola {
  id: EscolaId;
  emoji: string;
  nome: TextoPorIdioma;
  /** Só o tipo (ex.: "Fogo"), para usar em frases como "aprendiz de Fogo". */
  curto: TextoPorIdioma;
  resumo: TextoPorIdioma;
  feiticos: string[];
}

/** Ficha do mago controlado pela criança. */
export interface FichaMago {
  genero: Genero;
  avatar: string;
  escola: EscolaId;
  habilidades: Habilidades;
  pontosDeVida: number;
  pontosDeVidaMaximos: number;
  /** Energia mágica atual e máxima. */
  energia: number;
  energiaMaxima: number;
  /** Ids dos feitiços conhecidos (os da escola, os aprendidos e o comum). */
  feiticos: string[];
}

export interface InimigoMago {
  id: string;
  emoji: string;
  nome: TextoPorIdioma;
  pontosDeVida: number;
  defesa: number;
  bonusAtaque: number;
  dadoDeDano: LadosDado;
}

export interface EscolhaMago {
  texto: TextoPorIdioma;
  proximaCena: string;
  /** Só aparece para magos desta escola. Sem isso, aparece para todos. */
  escola?: EscolaId;
}

export interface CenaMago {
  id: string;
  emoji: string;
  texto: TextoPorIdioma;
  pergunta?: TextoPorIdioma;
  escolhas?: EscolhaMago[];
  luta?: { inimigo: string; aoVencer: string };
  /** Teste com d20 + habilidade; sempre leva a algum lugar. */
  teste?: { habilidade: NomeHabilidade; dificuldade: number; sucesso: string; falha: string };
  /** Descanso: recupera vida e energia mágica. */
  descanso?: boolean;
  /** O mago aprende um feitiço de outra escola; depois segue para `proxima`. */
  aprender?: { proxima: string };
  fim?: boolean;
}
