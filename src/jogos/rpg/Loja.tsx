import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import type { FichaPersonagem } from './tipos';
import { CATEGORIAS, ITENS, type Item, estatisticas, totalPocoes } from './itens';
import { Moedas } from './Moedas';
import { Icone, comIcones } from '../../compartilhado/icones';

const TEXTOS = {
  pergunta: {
    'pt-PT': 'Antes de partires, queres ir à loja?',
    'pt-BR': 'Antes de partir, você quer ir à loja?',
  },
  moedas: { 'pt-PT': 'Tens', 'pt-BR': 'Você tem' },
  irLoja: { 'pt-PT': '🛒 Ir à loja', 'pt-BR': '🛒 Ir à loja' },
  semLoja: { 'pt-PT': 'Começar a aventura!', 'pt-BR': 'Começar a aventura!' },
  titulo: { 'pt-PT': 'Loja', 'pt-BR': 'Loja' },
  comprar: { 'pt-PT': 'Comprar', 'pt-BR': 'Comprar' },
  jaTem: { 'pt-PT': 'Já tens algo igual ou melhor', 'pt-BR': 'Você já tem algo igual ou melhor' },
  jaTemEscudo: { 'pt-PT': 'Já tens o escudo', 'pt-BR': 'Você já tem o escudo' },
  semMoedas: { 'pt-PT': 'Não chegam as moedas', 'pt-BR': 'Moedas não bastam' },
  compra: { 'pt-PT': 'Compra feita: {item}! 🎉', 'pt-BR': 'Compra feita: {item}! 🎉' },
  quantidade: { 'pt-PT': 'Tens: {n}', 'pt-BR': 'Você tem: {n}' },
  terminar: { 'pt-PT': 'Começar a aventura!', 'pt-BR': 'Começar a aventura!' },
  resumo: {
    'pt-PT': 'Defesa {ca} · Para acertar: d20+{ataque} · Dano: d6+{dano}',
    'pt-BR': 'Defesa {ca} · Para acertar: d20+{ataque} · Dano: d6+{dano}',
  },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
} satisfies Record<string, TextoPorIdioma>;

interface Props {
  idioma: Idioma;
  ficha: FichaPersonagem;
  aoVoltar: () => void;
  aoAtualizar: (ficha: FichaPersonagem) => void;
  aoComecar: () => void;
}

function pontuacao(item: Item | undefined): number {
  return item ? (item.bonusDano ?? 0) + (item.bonusAtaque ?? 0) + (item.bonusCA ?? 0) : 0;
}

/** Pergunta se o herói quer passar na loja antes da aventura. */
export function PerguntaLoja({
  idioma,
  ficha,
  aoVoltar,
  aoIrLoja,
  aoComecar,
}: Pick<Props, 'idioma' | 'ficha' | 'aoVoltar' | 'aoComecar'> & { aoIrLoja: () => void }) {
  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>
      <div className="emoji-grande" aria-hidden="true">
        <Icone id="interface/carrinho-loja" />
      </div>
      <TextoNarrado className="texto-historia" idioma={idioma} texto={t(TEXTOS.pergunta, idioma)} />
      <p className="texto-grande">
        {t(TEXTOS.moedas, idioma)} <Moedas pratas={ficha.prata} />
      </p>
      <div className="acoes">
        <button className="botao" onClick={aoIrLoja}>
          {comIcones(t(TEXTOS.irLoja, idioma))}
        </button>
        <button className="botao botao-secundario" onClick={aoComecar}>
          {t(TEXTOS.semLoja, idioma)}
        </button>
      </div>
    </main>
  );
}

/** Loja: o herói compra tudo o que consegue pagar. */
export function Loja({ idioma, ficha, aoAtualizar, aoComecar }: Props) {
  const [categoria, setCategoria] = useState(CATEGORIAS[0].id);
  const [aviso, setAviso] = useState('');
  const est = estatisticas(ficha);

  function situacao(item: Item): 'ok' | 'tem' | 'sem-moedas' {
    if (item.tipo === 'escudo' && ficha.escudo) return 'tem';
    if (item.tipo === 'arma' && pontuacao(item) <= pontuacao(ficha.arma ? ITENS[ficha.arma] : undefined)) return 'tem';
    if (
      item.tipo === 'armadura' &&
      pontuacao(item) <= pontuacao(ficha.armadura ? ITENS[ficha.armadura] : undefined)
    )
      return 'tem';
    return ficha.prata < item.preco ? 'sem-moedas' : 'ok';
  }

  function comprar(item: Item) {
    if (situacao(item) !== 'ok') {
      somTentarDeNovo();
      return;
    }
    const nova: FichaPersonagem = { ...ficha, prata: ficha.prata - item.preco };
    if (item.tipo === 'arma') nova.arma = item.id;
    if (item.tipo === 'armadura') nova.armadura = item.id;
    if (item.tipo === 'escudo') nova.escudo = true;
    if (item.tipo === 'pocao') nova.pocoes = { ...ficha.pocoes, [item.id]: (ficha.pocoes[item.id] ?? 0) + 1 };
    aoAtualizar(nova);
    somAcerto();
    setAviso(preencher(t(TEXTOS.compra, idioma), { item: item.nome[idioma] }));
  }

  const atual = CATEGORIAS.find((c) => c.id === categoria) ?? CATEGORIAS[0];
  const itens = Object.values(ITENS).filter((i) => atual.tipos.includes(i.tipo));

  return (
    <main className="tela tela-centro">
      <h1><Icone id="interface/carrinho-loja" /> {t(TEXTOS.titulo, idioma)}</h1>
      <p className="texto-grande">
        {t(TEXTOS.moedas, idioma)} <Moedas pratas={ficha.prata} />
      </p>
      <p>
        {preencher(t(TEXTOS.resumo, idioma), { ca: est.ca, ataque: est.bonusAtaque, dano: est.bonusDano })}
        {ficha.escudo ? <> · <Icone id="interface/escudo" /></> : ''} · <Icone id="interface/pocao" /> {totalPocoes(ficha)}
      </p>

      <div className="acoes" role="group">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            className={c.id === categoria ? 'botao botao-ativo' : 'botao botao-secundario'}
            onClick={() => setCategoria(c.id)}
            aria-pressed={c.id === categoria}
          >
            {comIcones(c.emoji)} {t(c.nome, idioma)}
          </button>
        ))}
      </div>

      <div className="lista-itens">
        {itens.map((item) => {
          const estado = situacao(item);
          return (
            <div key={item.id} className="item-loja">
              <span className="item-emoji" aria-hidden="true">
                {comIcones(item.emoji)}
              </span>
              <div className="item-texto">
                <strong>{item.nome[idioma]}</strong>
                <TextoNarrado compacto idioma={idioma} texto={item.descricao[idioma]} />
                {item.tipo === 'pocao' && (
                  <small>{preencher(t(TEXTOS.quantidade, idioma), { n: ficha.pocoes[item.id] ?? 0 })}</small>
                )}
              </div>
              <button className="botao" onClick={() => comprar(item)} disabled={estado !== 'ok'}>
                {estado === 'tem'
                  ? item.tipo === 'escudo'
                    ? t(TEXTOS.jaTemEscudo, idioma)
                    : t(TEXTOS.jaTem, idioma)
                  : estado === 'sem-moedas'
                    ? t(TEXTOS.semMoedas, idioma)
                    : (
                      <>
                        {t(TEXTOS.comprar, idioma)} · <Moedas pratas={item.preco} />
                      </>
                    )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mensagem mensagem-acerto">{comIcones(aviso)}</p>
      <button className="botao" onClick={aoComecar}>
        {t(TEXTOS.terminar, idioma)}
      </button>
    </main>
  );
}
