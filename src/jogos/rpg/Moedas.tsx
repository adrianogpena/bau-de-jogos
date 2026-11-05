import { PRATAS_POR_OURO } from './itens';

/** Uma moeda desenhada (círculo dourado ou prateado), no lugar de emojis de medalha. */
function Moeda({ metal }: { metal: 'ouro' | 'prata' }) {
  return <span className={`moeda moeda-${metal}`} aria-hidden="true" />;
}

/** Mostra um valor guardado em pratas como moedas de ouro e de prata (1 ouro = 10 pratas). */
export function Moedas({ pratas }: { pratas: number }) {
  const ouro = Math.floor(pratas / PRATAS_POR_OURO);
  const prata = pratas % PRATAS_POR_OURO;
  return (
    <span className="moedas">
      {ouro > 0 && (
        <span className="moedas-valor">
          {ouro} <Moeda metal="ouro" />
        </span>
      )}
      {(prata > 0 || ouro === 0) && (
        <span className="moedas-valor">
          {prata} <Moeda metal="prata" />
        </span>
      )}
    </span>
  );
}
