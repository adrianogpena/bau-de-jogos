import { type CSSProperties, type PointerEvent as EventoPonteiro, useEffect, useRef, useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import { falarTexto } from '../../compartilhado/TextoNarrado';
import { cancelarFala } from '../../compartilhado/narradorAudio';
import { comIcones } from '../../compartilhado/icones';
import indice from './dados/indice.json';
import { PAISES } from './paises';
import type { DadosMapa, MapaId, Peca } from './tipos';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  titulo: { 'pt-PT': 'Escolhe um mapa!', 'pt-BR': 'Escolha um mapa!' },
  instrucao: {
    'pt-PT': 'Arrasta cada país para o seu lugar no mapa. Toca no nome para o ouvir.',
    'pt-BR': 'Arraste cada país para o lugar dele no mapa. Toque no nome para ouvir.',
  },
  paises: { 'pt-PT': '{n} países', 'pt-BR': '{n} países' },
  progresso: { 'pt-PT': '{n} de {total}', 'pt-BR': '{n} de {total}' },
  abrindo: { 'pt-PT': 'A abrir o mapa...', 'pt-BR': 'Abrindo o mapa...' },
  pecas: { 'pt-PT': 'Peças', 'pt-BR': 'Peças' },
  errou: { 'pt-PT': 'Ainda não é aí. Tenta outra vez!', 'pt-BR': 'Ainda não é aí. Tente de novo!' },
  pisca: {
    'pt-PT': 'Pega na peça e olha para o mapa: o lugar certo está a piscar!',
    'pt-BR': 'Pegue a peça e olhe para o mapa: o lugar certo está piscando!',
  },
  fim: { 'pt-PT': 'Mapa completo! 🎉', 'pt-BR': 'Mapa completo! 🎉' },
  outraVez: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  outroMapa: { 'pt-PT': 'Escolher outro mapa', 'pt-BR': 'Escolher outro mapa' },
  recomecar: { 'pt-PT': 'Recomeçar', 'pt-BR': 'Recomeçar' },
  confirmar: {
    'pt-PT': 'Queres tirar todas as peças do mapa e começar de novo?',
    'pt-BR': 'Quer tirar todas as peças do mapa e começar de novo?',
  },
  sim: { 'pt-PT': 'Sim, recomeçar', 'pt-BR': 'Sim, recomeçar' },
  nao: { 'pt-PT': 'Não, continuar', 'pt-BR': 'Não, continuar' },
} satisfies Record<string, TextoPorIdioma>;

const NOMES_MAPAS: Record<MapaId, TextoPorIdioma> = {
  mundo: { 'pt-PT': 'Mundo inteiro', 'pt-BR': 'Mundo inteiro' },
  europa: { 'pt-PT': 'Europa', 'pt-BR': 'Europa' },
  africa: { 'pt-PT': 'África', 'pt-BR': 'África' },
  asia: { 'pt-PT': 'Ásia', 'pt-BR': 'Ásia' },
  'america-norte': { 'pt-PT': 'América do Norte e Central', 'pt-BR': 'América do Norte e Central' },
  'america-sul': { 'pt-PT': 'América do Sul', 'pt-BR': 'América do Sul' },
  oceania: { 'pt-PT': 'Oceânia', 'pt-BR': 'Oceania' },
};

/** Resumo de cada mapa (tamanho, número de peças e silhueta para o cartão), gerado por `npm run mapas:gerar`. */
interface ResumoMapa {
  id: MapaId;
  largura: number;
  altura: number;
  total: number;
  miniatura: string;
}
const MAPAS = indice as ResumoMapa[];

/** As peças de cada mapa só são carregadas quando a criança o escolhe. */
const CARREGAR: Record<MapaId, () => Promise<{ default: unknown }>> = {
  mundo: () => import('./dados/mundo.json'),
  europa: () => import('./dados/europa.json'),
  africa: () => import('./dados/africa.json'),
  asia: () => import('./dados/asia.json'),
  'america-norte': () => import('./dados/america-norte.json'),
  'america-sul': () => import('./dados/america-sul.json'),
  oceania: () => import('./dados/oceania.json'),
};

/** Quantas peças ficam à espera ao mesmo tempo, cada uma na sua zona fixa; ao encaixar uma, entra outra no lugar. */
const ZONAS = 6;
/** O dedo tem de andar isto (px) para o toque virar arrasto; menos que isso é um toque (diz o nome). */
const DISTANCIA_ARRASTO = 10;
/** No toque, a peça fica acima do dedo (px) para a criança ver onde a está a pôr. */
const ALTURA_DO_DEDO = 56;
/** Folga do encaixe: a peça encaixa se for solta a esta distância do lugar (px, ou parte do tamanho dela). */
const FOLGA_MINIMA = 30;
const FOLGA_DO_TAMANHO = 0.4;
/** Depois de tantos erros com a mesma peça, o lugar certo pisca enquanto ela é arrastada. */
const ERROS_ATE_DICA = 2;
/** Peças menores que isto no ecrã (px) ganham um anel à volta enquanto são arrastadas. */
const PECA_PEQUENA = 26;

/** Mapa mais largo que isto (o mundo inteiro) ocupa a largura toda, com as peças embaixo, mesmo em paisagem. */
const PROPORCAO_LARGA = 1.6;

const nomeDe = (id: string, idioma: Idioma) => t(PAISES[id].nome, idioma);
const corDe = (peca: Peca) => `var(--mapa-cor-${peca.cor})`;

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ---------- progresso guardado no aparelho ----------

const chave = (mapa: MapaId) => `bau-de-jogos:mapa:${mapa}`;

function lerColocadas(mapa: DadosMapa): string[] {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(chave(mapa.id)) ?? '[]');
    if (!Array.isArray(salvo)) return [];
    return salvo.filter((id): id is string => typeof id === 'string' && mapa.pecas.some((p) => p.id === id));
  } catch {
    return [];
  }
}

function salvarColocadas(mapa: MapaId, colocadas: string[]): void {
  try {
    localStorage.setItem(chave(mapa), JSON.stringify(colocadas));
  } catch {
    // sem armazenamento: o progresso vale só para esta sessão
  }
}

/** Jogo do mapa-múndi: quebra-cabeça de países, no mundo inteiro ou num continente. */
export function Mapa({ idioma, aoVoltar }: PropsJogo) {
  const [escolhido, setEscolhido] = useState<MapaId | null>(null);
  const [dados, setDados] = useState<DadosMapa | null>(null);

  useEffect(() => {
    if (!escolhido) return;
    let vale = true;
    void CARREGAR[escolhido]().then((modulo) => {
      if (vale) setDados(modulo.default as DadosMapa);
    });
    return () => {
      vale = false;
    };
  }, [escolhido]);

  function sair() {
    setEscolhido(null);
    setDados(null);
  }

  if (escolhido && dados?.id === escolhido) return <Quebra key={dados.id} mapa={dados} idioma={idioma} aoSair={sair} />;

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={escolhido ? sair : aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>
      {escolhido ? (
        <p role="status">{t(TEXTOS.abrindo, idioma)}</p>
      ) : (
        <>
          <h1>{comIcones(`🗺 ${t(TEXTOS.titulo, idioma)}`)}</h1>
          <p>{t(TEXTOS.instrucao, idioma)}</p>
          <div className="grade-jogos">
            {MAPAS.map((m) => (
              <button key={m.id} className="cartao-jogo cartao-historia" onClick={() => setEscolhido(m.id)}>
                <svg className="miniatura-mapa" viewBox={`0 0 ${m.largura} ${m.altura}`} aria-hidden="true">
                  <path d={m.miniatura} />
                </svg>
                <strong>{t(NOMES_MAPAS[m.id], idioma)}</strong>
                <small>{preencher(t(TEXTOS.paises, idioma), { n: m.total })}</small>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

/** Peça que o dedo está a segurar. Vira arrasto quando o dedo anda; se não andar, foi só um toque. */
interface Arrasto {
  peca: Peca;
  ponteiro: number;
  inicioX: number;
  inicioY: number;
  x: number;
  y: number;
  /** Quanto a peça fica acima do dedo (0 com rato/mouse). */
  altura: number;
  /** Pixels do ecrã por unidade do mapa, medido quando o arrasto começa. */
  escala: number;
  ativo: boolean;
}

function Quebra({ mapa, idioma, aoSair }: { mapa: DadosMapa; idioma: Idioma; aoSair: () => void }) {
  const [colocadas, setColocadas] = useState<string[]>(() => lerColocadas(mapa));
  /** Zonas fixas da bandeja (id da peça ou vazia) e as peças que ainda vão entrar. */
  const [bandeja, setBandeja] = useState(() => {
    const ordem = embaralhar(mapa.pecas.map((p) => p.id).filter((id) => !lerColocadas(mapa).includes(id)));
    return { zonas: Array.from({ length: ZONAS }, (_, i): string | null => ordem[i] ?? null), fila: ordem.slice(ZONAS) };
  });
  const [arrastando, setArrastando] = useState<{ peca: Peca; escala: number } | null>(null);
  const [erros, setErros] = useState<Record<string, number>>({});
  const [recente, setRecente] = useState<string | null>(null);
  const [voltando, setVoltando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  const svg = useRef<SVGSVGElement>(null);
  const flutuante = useRef<SVGGElement>(null);
  const arrasto = useRef<Arrasto | null>(null);
  const falaMarcada = useRef<number | undefined>(undefined);

  const pecaDe = (id: string) => mapa.pecas.find((p) => p.id === id)!;
  const terminou = colocadas.length === mapa.pecas.length;

  useEffect(() => () => window.clearTimeout(falaMarcada.current), []);

  /** Põe a peça flutuante no lugar do dedo (direto no SVG, sem redesenhar a tela a cada movimento). */
  function moverFlutuante() {
    const a = arrasto.current;
    if (a && flutuante.current) flutuante.current.setAttribute('transform', `translate(${a.x} ${a.y - a.altura})`);
  }
  useEffect(moverFlutuante, [arrastando]);

  function pegar(e: EventoPonteiro<HTMLDivElement>, peca: Peca) {
    if (arrasto.current || terminou) return;
    try {
      // os movimentos seguintes chegam a esta zona mesmo com o dedo já em cima do mapa
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // sem captura, o arrasto só segue o dedo enquanto ele estiver sobre a zona
    }
    arrasto.current = {
      peca,
      ponteiro: e.pointerId,
      inicioX: e.clientX,
      inicioY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      altura: e.pointerType === 'mouse' ? 0 : ALTURA_DO_DEDO,
      escala: 1,
      ativo: false,
    };
  }

  function mover(e: EventoPonteiro<HTMLDivElement>) {
    const a = arrasto.current;
    if (!a || a.ponteiro !== e.pointerId) return;
    a.x = e.clientX;
    a.y = e.clientY;
    if (!a.ativo) {
      if (Math.hypot(a.x - a.inicioX, a.y - a.inicioY) < DISTANCIA_ARRASTO) return;
      // começou a arrastar: nada de narração agora
      a.ativo = true;
      a.escala = (svg.current?.getBoundingClientRect().width ?? mapa.largura) / mapa.largura;
      window.clearTimeout(falaMarcada.current);
      cancelarFala();
      setAviso(null);
      setArrastando({ peca: a.peca, escala: a.escala });
    }
    moverFlutuante();
  }

  function largar(e: EventoPonteiro<HTMLDivElement>) {
    const a = arrasto.current;
    if (!a || a.ponteiro !== e.pointerId) return;
    arrasto.current = null;
    if (!a.ativo) {
      // só tocou: diz o nome do país
      const rotulo = e.currentTarget.querySelector<HTMLElement>('.nome-peca');
      falarTexto(nomeDe(a.peca.id, idioma), idioma, rotulo ?? undefined);
      return;
    }
    setArrastando(null);
    const quadro = svg.current?.getBoundingClientRect();
    if (!quadro) return;
    const x = e.clientX;
    const y = e.clientY - a.altura;
    const escala = quadro.width / mapa.largura;
    const distancia = Math.hypot(x - (quadro.left + a.peca.cx * escala), y - (quadro.top + a.peca.cy * escala));
    if (distancia <= Math.max(FOLGA_MINIMA, FOLGA_DO_TAMANHO * a.peca.t * escala)) {
      encaixar(a.peca);
    } else if (x >= quadro.left && x <= quadro.right && y >= quadro.top && y <= quadro.bottom) {
      // soltou no mapa, mas no lugar errado: a peça volta para a zona dela
      const total = (erros[a.peca.id] ?? 0) + 1;
      setErros((atual) => ({ ...atual, [a.peca.id]: total }));
      setAviso(t(total >= ERROS_ATE_DICA ? TEXTOS.pisca : TEXTOS.errou, idioma));
      setVoltando(a.peca.id);
      somTentarDeNovo();
    }
  }

  function encaixar(peca: Peca) {
    const novas = [...colocadas, peca.id];
    setColocadas(novas);
    salvarColocadas(mapa.id, novas);
    setBandeja(({ zonas, fila }) => ({
      zonas: zonas.map((id) => (id === peca.id ? (fila[0] ?? null) : id)),
      fila: fila.slice(1),
    }));
    setRecente(peca.id);
    setAviso(`${nomeDe(peca.id, idioma)} ✅`);
    somAcerto();
    // o narrador diz o país logo depois do som de acerto
    window.clearTimeout(falaMarcada.current);
    falaMarcada.current = window.setTimeout(() => falarTexto(nomeDe(peca.id, idioma), idioma), 450);
  }

  /** Tocar num país já encaixado diz o nome dele de novo. */
  function tocarColocada(peca: Peca) {
    setAviso(nomeDe(peca.id, idioma));
    falarTexto(nomeDe(peca.id, idioma), idioma);
  }

  function recomecar() {
    window.clearTimeout(falaMarcada.current);
    cancelarFala();
    salvarColocadas(mapa.id, []);
    const ordem = embaralhar(mapa.pecas.map((p) => p.id));
    setColocadas([]);
    setBandeja({ zonas: Array.from({ length: ZONAS }, (_, i) => ordem[i] ?? null), fila: ordem.slice(ZONAS) });
    setErros({});
    setRecente(null);
    setAviso(null);
    setConfirmando(false);
  }

  const dica = arrastando && (erros[arrastando.peca.id] ?? 0) >= ERROS_ATE_DICA ? arrastando.peca.id : null;
  const estiloTela = { '--proporcao': mapa.largura / mapa.altura } as CSSProperties;

  return (
    <main className={`tela tela-mapa${mapa.largura / mapa.altura > PROPORCAO_LARGA ? ' mapa-largo' : ''}`} style={estiloTela}>
      <header className="barra-sala">
        <button className="botao botao-secundario" onClick={aoSair}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso-achar">
          {preencher(t(TEXTOS.progresso, idioma), { n: colocadas.length, total: mapa.pecas.length })}
        </span>
        <button className="botao botao-secundario" onClick={() => setConfirmando(true)} disabled={colocadas.length === 0}>
          {t(TEXTOS.recomecar, idioma)}
        </button>
      </header>

      <svg
        ref={svg}
        className="quadro-mapa"
        viewBox={`0 0 ${mapa.largura} ${mapa.altura}`}
        role="img"
        aria-label={t(NOMES_MAPAS[mapa.id], idioma)}
        data-sem-leitura
      >
        <path className="terra-vizinha" d={mapa.contexto} />
        {mapa.pecas.map((p) => {
          const colocada = colocadas.includes(p.id);
          return (
            <path
              key={p.id}
              d={p.d}
              className={`lugar-peca${colocada ? ' peca-colocada' : ''}${recente === p.id ? ' peca-recente' : ''}${dica === p.id ? ' lugar-dica' : ''}`}
              style={colocada ? { fill: corDe(p) } : undefined}
              onClick={colocada ? () => tocarColocada(p) : undefined}
            />
          );
        })}
      </svg>

      <section className="bandeja-mapa" aria-label={t(TEXTOS.pecas, idioma)} data-sem-leitura>
        {bandeja.zonas.map((id, i) => {
          if (!id) return <div key={i} className="zona-peca zona-vazia" />;
          const p = pecaDe(id);
          const margem = Math.max(p.w, p.h) * 0.08 + 1;
          const naMao = arrastando?.peca.id === id;
          return (
            <div
              key={i}
              className={`zona-peca${naMao ? ' zona-na-mao' : ''}${voltando === id ? ' zona-voltando' : ''}`}
              onPointerDown={(e) => pegar(e, p)}
              onPointerMove={mover}
              onPointerUp={largar}
              onPointerCancel={() => {
                arrasto.current = null;
                setArrastando(null);
              }}
              onAnimationEnd={() => setVoltando(null)}
            >
              <svg
                className="desenho-peca"
                viewBox={`${p.x - margem} ${p.y - margem} ${p.w + 2 * margem} ${p.h + 2 * margem}`}
                aria-hidden="true"
              >
                <path d={p.d} style={{ fill: corDe(p) }} />
              </svg>
              <span className="nome-peca">{nomeDe(id, idioma)}</span>
            </div>
          );
        })}
      </section>

      <p className="mensagem-sala" role="status">
        {aviso ? comIcones(aviso) : ' '}
      </p>

      {arrastando && (
        <svg className="peca-flutuante" aria-hidden="true">
          <g ref={flutuante}>
            {arrastando.peca.t * arrastando.escala < PECA_PEQUENA && <circle className="anel-peca" r={PECA_PEQUENA} />}
            <path
              d={arrastando.peca.d}
              style={{ fill: corDe(arrastando.peca) }}
              transform={`scale(${arrastando.escala}) translate(${-arrastando.peca.cx} ${-arrastando.peca.cy})`}
            />
          </g>
        </svg>
      )}

      {confirmando && (
        <div className="fundo-modal">
          <div className="modal-enigma">
            <p>{t(TEXTOS.confirmar, idioma)}</p>
            <button className="botao" onClick={() => setConfirmando(false)}>
              {t(TEXTOS.nao, idioma)}
            </button>
            <button className="botao botao-secundario" onClick={recomecar}>
              {t(TEXTOS.sim, idioma)}
            </button>
          </div>
        </div>
      )}

      {terminou && !confirmando && (
        <div className="fundo-modal">
          <div className="modal-enigma">
            <h2>{comIcones(t(TEXTOS.fim, idioma))}</h2>
            <button className="botao" onClick={recomecar}>
              {t(TEXTOS.outraVez, idioma)}
            </button>
            <button className="botao botao-secundario" onClick={aoSair}>
              {t(TEXTOS.outroMapa, idioma)}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
