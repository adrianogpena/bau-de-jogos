import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { Icone } from '../../compartilhado/icones';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { PRATAS_POR_OURO } from './itens';

/** Mostra um valor guardado em pratas como moedas de ouro e de prata (1 ouro = 10 pratas). */
export function Moedas({ pratas }: { pratas: number }) {
  const ouro = Math.floor(pratas / PRATAS_POR_OURO);
  const prata = pratas % PRATAS_POR_OURO;
  return (
    <span className="moedas">
      {ouro > 0 && (
        <span className="moedas-valor">
          {ouro} <Icone id="moeda-ouro" />
        </span>
      )}
      {(prata > 0 || ouro === 0) && (
        <span className="moedas-valor">
          {prata} <Icone id="moeda-prata" />
        </span>
      )}
    </span>
  );
}

/**
 * Frases das moedas, por singular/plural de cada metal (0, 1 ou mais). Cada combinação é um texto inteiro para ter
 * áudio: a frase é gravada inteira, com os números por extenso ("Tens quinze moedas de ouro e cinco moedas de prata.";
 * 1 → "uma moeda"). Ouro acima de 20 cai nos pedaços (ver fraseInteira em numeros.ts).
 */
const FRASES: Record<string, TextoPorIdioma> = {
  'n-n': {
    'pt-PT': 'Tens {ouro} moedas de ouro [[moeda-ouro]] e {prata} moedas de prata [[moeda-prata]].',
    'pt-BR': 'Você tem {ouro} moedas de ouro [[moeda-ouro]] e {prata} moedas de prata [[moeda-prata]].',
  },
  'n-1': {
    'pt-PT': 'Tens {ouro} moedas de ouro [[moeda-ouro]] e 1 moeda de prata [[moeda-prata]].',
    'pt-BR': 'Você tem {ouro} moedas de ouro [[moeda-ouro]] e 1 moeda de prata [[moeda-prata]].',
  },
  'n-0': {
    'pt-PT': 'Tens {ouro} moedas de ouro [[moeda-ouro]].',
    'pt-BR': 'Você tem {ouro} moedas de ouro [[moeda-ouro]].',
  },
  '1-n': {
    'pt-PT': 'Tens 1 moeda de ouro [[moeda-ouro]] e {prata} moedas de prata [[moeda-prata]].',
    'pt-BR': 'Você tem 1 moeda de ouro [[moeda-ouro]] e {prata} moedas de prata [[moeda-prata]].',
  },
  '1-1': {
    'pt-PT': 'Tens 1 moeda de ouro [[moeda-ouro]] e 1 moeda de prata [[moeda-prata]].',
    'pt-BR': 'Você tem 1 moeda de ouro [[moeda-ouro]] e 1 moeda de prata [[moeda-prata]].',
  },
  '1-0': {
    'pt-PT': 'Tens 1 moeda de ouro [[moeda-ouro]].',
    'pt-BR': 'Você tem 1 moeda de ouro [[moeda-ouro]].',
  },
  '0-n': {
    'pt-PT': 'Tens {prata} moedas de prata [[moeda-prata]].',
    'pt-BR': 'Você tem {prata} moedas de prata [[moeda-prata]].',
  },
  '0-1': {
    'pt-PT': 'Tens 1 moeda de prata [[moeda-prata]].',
    'pt-BR': 'Você tem 1 moeda de prata [[moeda-prata]].',
  },
  '0-0': {
    'pt-PT': 'Não tens moedas.',
    'pt-BR': 'Você não tem moedas.',
  },
};

const quantas = (n: number) => (n === 0 ? '0' : n === 1 ? '1' : 'n');

/** "Tens 15 moedas de ouro ● e 5 moedas de prata ●", narrado, com o desenho da moeda depois de cada metal. */
export function FraseMoedas({ pratas, idioma, className }: { pratas: number; idioma: Idioma; className?: string }) {
  const ouro = Math.floor(pratas / PRATAS_POR_OURO);
  const prata = pratas % PRATAS_POR_OURO;
  const texto = preencher(t(FRASES[`${quantas(ouro)}-${quantas(prata)}`], idioma), { ouro, prata });
  return <TextoNarrado className={className} idioma={idioma} texto={texto} />;
}
