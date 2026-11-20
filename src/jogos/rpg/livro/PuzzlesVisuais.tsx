import { useEffect, useRef, useState } from 'react';
import { type Idioma, type TextoPorIdioma, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { comIcones } from '../../../compartilhado/icones';
import { tocarNota } from '../../../compartilhado/som';
import { NOTAS_SOM, type Rodada } from './desafios';
import type { Figura } from './tipos';

const TEXTOS = {
  verificar: { 'pt-PT': 'Verificar', 'pt-BR': 'Verificar' },
  apagar: { 'pt-PT': 'Apagar', 'pt-BR': 'Apagar' },
  ordem: { 'pt-PT': 'Toca nas cartas pela ordem certa.', 'pt-BR': 'Toque nas cartas na ordem certa.' },
  codigo: {
    'pt-PT': 'Olha para o diário e escreve o número de cada figura do cadeado.',
    'pt-BR': 'Olhe o diário e digite o número de cada figura do cadeado.',
  },
  pares: {
    'pt-PT': 'Toca numa figura e depois na que combina com ela.',
    'pt-BR': 'Toque em uma figura e depois na que combina com ela.',
  },
  luzes: {
    'pt-PT': 'Acende todas as luzes. Cada toque muda a luz e as vizinhas.',
    'pt-BR': 'Acenda todas as luzes. Cada toque muda a luz e as vizinhas.',
  },
  som: {
    'pt-PT': 'Ouve a melodia e toca-a pela mesma ordem.',
    'pt-BR': 'Ouça a melodia e toque na mesma ordem.',
  },
  ouvir: { 'pt-PT': '🔊 Ouvir a melodia', 'pt-BR': '🔊 Ouvir a melodia' },
  padrao: { 'pt-PT': 'Qual peça continua o padrão?', 'pt-BR': 'Qual peça continua o padrão?' },
  contar: { 'pt-PT': 'Conta quantas há e escreve o número.', 'pt-BR': 'Conte quantas há e digite o número.' },
} satisfies Record<string, TextoPorIdioma>;

const CORES_NOTAS = ['#e05a5a', '#e0a93b', '#4caf6d', '#4a8fe0'];

function FiguraVista({ figura, idioma }: { figura: Figura; idioma: Idioma }) {
  return (
    <span className="figura-puzzle">
      <span className="figura-emoji">{comIcones(figura.emoji)}</span>
      {figura.nome && <small>{t(figura.nome, idioma)}</small>}
    </span>
  );
}

/** Teclado de números para tocar, com até `maximo` dígitos. */
function Teclado({
  idioma,
  digitos,
  maximo,
  mudar,
  confirmar,
}: {
  idioma: Idioma;
  digitos: string;
  maximo: number;
  mudar: (d: string) => void;
  confirmar: () => void;
}) {
  return (
    <div className="teclado">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} className="botao botao-secundario" onClick={() => mudar((digitos + d).slice(0, maximo))}>
          {d}
        </button>
      ))}
      <button className="botao botao-secundario" onClick={() => mudar(digitos.slice(0, -1))} aria-label={t(TEXTOS.apagar, idioma)}>
        ⌫
      </button>
      <button className="botao botao-secundario" onClick={() => mudar((digitos + '0').slice(0, maximo))}>
        0
      </button>
      <button className="botao" onClick={confirmar} disabled={digitos === ''} aria-label={t(TEXTOS.verificar, idioma)}>
        {comIcones('✔️')}
      </button>
    </div>
  );
}

type Rod<T extends Rodada['tipo']> = Extract<Rodada, { tipo: T }>;
interface Sub<T extends Rodada['tipo']> {
  rodada: Rod<T>;
  idioma: Idioma;
  responder: (certo: boolean) => void;
}

interface Props {
  rodada: Rod<'ordem' | 'codigo' | 'pares' | 'luzes' | 'som' | 'padrao' | 'contar'>;
  idioma: Idioma;
  terminou: boolean;
  /** Muda a cada erro: o puzzle recomeça do zero. */
  tentativa: number;
  responder: (certo: boolean) => void;
}

/** Puzzles de toque da base: ordem, código, pares, luzes, melodia, padrão e contar. */
export function PuzzleVisual({ rodada, idioma, terminou, tentativa, responder }: Props) {
  if (terminou) return null;
  switch (rodada.tipo) {
    case 'ordem':
      return <Ordem key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
    case 'codigo':
      return <Codigo key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
    case 'pares':
      return <Pares key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
    case 'luzes':
      return <Luzes key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
    case 'som':
      return <Melodia key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
    case 'padrao':
      return <Padrao rodada={rodada} idioma={idioma} responder={responder} />;
    case 'contar':
      return <Contar key={tentativa} rodada={rodada} idioma={idioma} responder={responder} />;
  }
}

function Ordem({ rodada, idioma, responder }: Sub<'ordem'>) {
  const [escolhidas, setEscolhidas] = useState<number[]>([]);
  const n = rodada.figuras.length;
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.ordem, idioma)} />
      <div className="cartas-puzzle-linha">
        {Array.from({ length: n }, (_, i) => (
          <button
            key={i}
            className="carta-puzzle carta-vaga"
            disabled={escolhidas[i] === undefined}
            onClick={() => setEscolhidas(escolhidas.filter((_, j) => j !== i))}
          >
            {escolhidas[i] !== undefined ? <FiguraVista figura={rodada.figuras[escolhidas[i]]} idioma={idioma} /> : i + 1}
          </button>
        ))}
      </div>
      <div className="cartas-puzzle-linha">
        {rodada.mostradas.map((i) => (
          <button key={i} className="carta-puzzle" disabled={escolhidas.includes(i)} onClick={() => setEscolhidas([...escolhidas, i])}>
            <FiguraVista figura={rodada.figuras[i]} idioma={idioma} />
          </button>
        ))}
      </div>
      <button className="botao" disabled={escolhidas.length < n} onClick={() => responder(escolhidas.every((v, i) => v === i))}>
        {t(TEXTOS.verificar, idioma)}
      </button>
    </>
  );
}

function Codigo({ rodada, idioma, responder }: Sub<'codigo'>) {
  const [digitos, setDigitos] = useState('');
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.codigo, idioma)} />
      <div className="cartas-puzzle-linha">
        {rodada.diario.map((d, i) => (
          <span key={i} className="carta-puzzle carta-diario">
            <FiguraVista figura={d.figura} idioma={idioma} />
            <b>{d.digito}</b>
          </span>
        ))}
      </div>
      <div className="cartas-puzzle-linha">
        {rodada.cadeado.map((idx, i) => (
          <span key={i} className="carta-puzzle carta-vaga">
            <FiguraVista figura={rodada.diario[idx].figura} idioma={idioma} />
            <b>{digitos[i] ?? '?'}</b>
          </span>
        ))}
      </div>
      <Teclado
        idioma={idioma}
        digitos={digitos}
        maximo={rodada.cadeado.length}
        mudar={setDigitos}
        confirmar={() => responder(digitos === rodada.resposta)}
      />
    </>
  );
}

function Pares({ rodada, idioma, responder }: Sub<'pares'>) {
  const [aberto, setAberto] = useState<number | null>(null);
  const [ligacoes, setLigacoes] = useState<Record<number, number>>({});
  const n = rodada.a.length;
  const ligadasB = Object.values(ligacoes);
  const feito = Object.keys(ligacoes).length === n;
  const numeroDe = (j: number) => Number(Object.keys(ligacoes).find((k) => ligacoes[Number(k)] === j)) + 1;
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.pares, idioma)} />
      <div className="colunas-pares">
        <div className="cartas-puzzle-linha">
          {rodada.a.map((fig, i) => (
            <button
              key={i}
              className={`carta-puzzle ${aberto === i ? 'carta-escolhida' : ''} ${ligacoes[i] !== undefined ? 'carta-ligada' : ''}`}
              onClick={() => {
                if (ligacoes[i] !== undefined) {
                  const resto = { ...ligacoes };
                  delete resto[i];
                  setLigacoes(resto);
                }
                setAberto(i);
              }}
            >
              <FiguraVista figura={fig} idioma={idioma} />
              {ligacoes[i] !== undefined && <b>{i + 1}</b>}
            </button>
          ))}
        </div>
        <div className="cartas-puzzle-linha">
          {rodada.ordemB.map((j) => (
            <button
              key={j}
              className={`carta-puzzle ${ligadasB.includes(j) ? 'carta-ligada' : ''}`}
              disabled={aberto === null || ligadasB.includes(j)}
              onClick={() => {
                if (aberto === null) return;
                setLigacoes({ ...ligacoes, [aberto]: j });
                setAberto(null);
              }}
            >
              <FiguraVista figura={rodada.b[j]} idioma={idioma} />
              {ligadasB.includes(j) && <b>{numeroDe(j)}</b>}
            </button>
          ))}
        </div>
      </div>
      <button className="botao" disabled={!feito} onClick={() => responder(Object.entries(ligacoes).every(([a, b]) => Number(a) === b))}>
        {t(TEXTOS.verificar, idioma)}
      </button>
    </>
  );
}

function Luzes({ rodada, idioma, responder }: Sub<'luzes'>) {
  const [estado, setEstado] = useState(rodada.inicial);
  const [toques, setToques] = useState(0);
  const limite = rodada.inicial.length * 2 + 2;
  function tocar(i: number) {
    const novo = estado.map((acesa, j) => (Math.abs(j - i) <= 1 ? !acesa : acesa));
    setEstado(novo);
    if (novo.every(Boolean)) {
      responder(true);
      return;
    }
    if (toques + 1 >= limite) {
      responder(false);
      return;
    }
    setToques(toques + 1);
  }
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.luzes, idioma)} />
      <div className="cartas-puzzle-linha">
        {estado.map((acesa, i) => (
          <button key={i} className={`carta-puzzle luz-puzzle ${acesa ? 'luz-acesa' : ''}`} onClick={() => tocar(i)} aria-pressed={acesa}>
            <span className="figura-emoji">{comIcones(rodada.luz)}</span>
          </button>
        ))}
      </div>
      <p className="progresso">{'●'.repeat(limite - toques) + '○'.repeat(toques)}</p>
    </>
  );
}

function Melodia({ rodada, idioma, responder }: Sub<'som'>) {
  const [tocadas, setTocadas] = useState<number[]>([]);
  const [brilho, setBrilho] = useState<number | null>(null);
  const temporizadores = useRef<number[]>([]);

  function ouvir() {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = rodada.notas.flatMap((nota, i) => [
      window.setTimeout(() => {
        tocarNota(NOTAS_SOM[nota]);
        setBrilho(nota);
      }, i * 600),
      window.setTimeout(() => setBrilho(null), i * 600 + 400),
    ]);
  }
  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);

  function tocar(nota: number) {
    tocarNota(NOTAS_SOM[nota]);
    const novas = [...tocadas, nota];
    setTocadas(novas);
    if (novas.length === rodada.notas.length) responder(novas.every((v, i) => v === rodada.notas[i]));
  }
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.som, idioma)} />
      <button className="botao" onClick={ouvir}>
        {comIcones(t(TEXTOS.ouvir, idioma))}
      </button>
      <div className="cartas-puzzle-linha">
        {NOTAS_SOM.map((_, nota) => (
          <button
            key={nota}
            className="carta-puzzle botao-nota"
            style={{ background: CORES_NOTAS[nota], opacity: brilho === null || brilho === nota ? 1 : 0.45 }}
            onClick={() => tocar(nota)}
            aria-label={String(nota + 1)}
          >
            {nota + 1}
          </button>
        ))}
      </div>
      <p className="progresso">{'●'.repeat(tocadas.length) + '○'.repeat(rodada.notas.length - tocadas.length)}</p>
    </>
  );
}

function Padrao({ rodada, idioma, responder }: Sub<'padrao'>) {
  return (
    <>
      <div className="cartas-puzzle-linha">
        {rodada.sequencia.map((fig, i) => (
          <span key={i} className="carta-puzzle carta-diario">
            <FiguraVista figura={fig} idioma={idioma} />
          </span>
        ))}
        <span className="carta-puzzle carta-vaga">
          <b>?</b>
        </span>
      </div>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.padrao, idioma)} />
      <div className="cartas-puzzle-linha">
        {rodada.opcoes.map((fig, i) => (
          <button key={i} className="carta-puzzle" onClick={() => responder(i === rodada.certa)}>
            <FiguraVista figura={fig} idioma={idioma} />
          </button>
        ))}
      </div>
    </>
  );
}

function Contar({ rodada, idioma, responder }: Sub<'contar'>) {
  const [digitos, setDigitos] = useState('');
  return (
    <>
      <TextoNarrado idioma={idioma} texto={t(TEXTOS.contar, idioma)} />
      <div className="campo-contar">
        {rodada.itens.map((item, i) => (
          <span key={i} className="item-contar" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
            {comIcones(item.figura.emoji)}
          </span>
        ))}
      </div>
      <p className="conta-enunciado">
        <span className="conta-resposta">{digitos || '?'}</span>
      </p>
      <Teclado idioma={idioma} digitos={digitos} maximo={2} mudar={setDigitos} confirmar={() => responder(Number(digitos) === rodada.resposta)} />
    </>
  );
}
