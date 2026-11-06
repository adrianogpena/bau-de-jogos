import { type CSSProperties, useMemo, useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import { CENAS } from './cenas';
import type { AreaLivre, Cena, ItemCena, Posicao } from './tipos';
import { Icone, comIcones } from '../../compartilhado/icones';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  titulo: { 'pt-PT': 'Escolhe uma cena!', 'pt-BR': 'Escolha uma cena!' },
  instrucao: {
    'pt-PT': 'Lê as palavras e toca nas coisas escondidas na imagem.',
    'pt-BR': 'Leia as palavras e toque nas coisas escondidas na imagem.',
  },
  procura: { 'pt-PT': 'Procura:', 'pt-BR': 'Procure:' },
  dica: { 'pt-PT': '💡 Dica', 'pt-BR': '💡 Dica' },
  progresso: { 'pt-PT': 'Encontraste {n} de {total}', 'pt-BR': 'Você achou {n} de {total}' },
  naoEsta: {
    'pt-PT': 'Esse não é! Perdeste um coração. Continua a procurar.',
    'pt-BR': 'Esse não é! Você perdeu um coração. Continue procurando.',
  },
  vidas: { 'pt-PT': 'Corações', 'pt-BR': 'Corações' },
  perdeu: { 'pt-PT': 'Acabaram os corações! 💔', 'pt-BR': 'Acabaram os corações! 💔' },
  perdeuTexto: {
    'pt-PT': 'Não faz mal. Vamos começar do zero!',
    'pt-BR': 'Não tem problema. Vamos começar do zero!',
  },
  recomecar: { 'pt-PT': 'Começar de novo', 'pt-BR': 'Começar de novo' },
  nada: { 'pt-PT': 'Aqui não há nada. Tenta noutro sítio!', 'pt-BR': 'Aqui não tem nada. Tente em outro lugar!' },
  achou: { 'pt-PT': 'Encontraste: {palavra}! 🎉', 'pt-BR': 'Você achou: {palavra}! 🎉' },
  fim: { 'pt-PT': 'Encontraste tudo! 🎉', 'pt-BR': 'Você achou tudo! 🎉' },
  outraVez: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  outraCena: { 'pt-PT': 'Escolher outra cena', 'pt-BR': 'Escolher outra cena' },
  dicasUsadas: { 'pt-PT': 'Dicas usadas: {n}', 'pt-BR': 'Dicas usadas: {n}' },
} satisfies Record<string, TextoPorIdioma>;

/** Quantas palavras aparecem na lista ao mesmo tempo; ao achar uma, entra outra. */
const PALAVRAS_VISIVEIS = 3;

/** Quantos corações a criança tem; errar um objeto tira um. */
const VIDAS = 5;

const caminho = (arquivo: string) => `${import.meta.env.BASE_URL}${arquivo}`;

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Item com o lugar sorteado para esta rodada. */
interface ItemPosto {
  item: ItemCena;
  pos: Required<Pick<Posicao, 'x' | 'y' | 'camada' | 'giro'>>;
}

/** Sorteia a posição de cada item entre as permitidas, sem nunca sobrepor outro item. */
function sortearPosicoes(itens: ItemCena[], alvos: ItemCena[], area?: AreaLivre): ItemPosto[] {
  const postos: ItemPosto[] = [];
  const sobrepoe = (x: number, y: number, largura: number) =>
    postos.some((o) => {
      const meio = (largura + o.item.largura) / 2;
      return Math.abs(x - o.pos.x) < meio && Math.abs(y - o.pos.y) < meio * 1.33;
    });
  const pos = (p: Posicao) => ({ x: p.x, y: p.y, camada: p.camada ?? 0, giro: p.giro ?? Math.round(Math.random() * 20 - 10) });

  // Alvos primeiro (precisam ficar tocáveis); dentro de cada grupo, quem tem menos opções escolhe antes.
  const grupo = (lista: ItemCena[]) => embaralhar(lista).sort((a, b) => a.posicoes.length - b.posicoes.length);
  const enfeites = itens.filter((i) => !alvos.includes(i));
  for (const item of [...grupo(alvos), ...grupo(enfeites)]) {
    const eAlvo = alvos.includes(item);
    const livres = item.posicoes.filter((p) => !sobrepoe(p.x, p.y, item.largura));
    if (livres.length > 0) {
      postos.push({ item, pos: pos(livres[Math.floor(Math.random() * livres.length)]) });
      continue;
    }
    // Sem lugar livre entre os permitidos: tenta um ponto livre qualquer da área.
    let achou: Posicao | null = null;
    if (area) {
      for (let t = 0; t < 300 && !achou; t++) {
        const x = area.x1 + Math.random() * (area.x2 - area.x1);
        const y = area.y1 + Math.random() * (area.y2 - area.y1);
        if (!sobrepoe(x, y, item.largura)) achou = { x: Math.round(x), y: Math.round(y) };
      }
    }
    if (achou) postos.push({ item, pos: pos(achou) });
    // Sem lugar nenhum: o enfeite some desta rodada; o alvo vai para um lugar permitido (nunca falta).
    else if (eAlvo) postos.push({ item, pos: pos(item.posicoes[Math.floor(Math.random() * item.posicoes.length)]) });
  }
  return postos;
}

/** Jogo de achar itens escondidos em cenas. As cenas ficam em `cenas/`. */
export function Achar({ idioma, aoVoltar }: PropsJogo) {
  const [cena, setCena] = useState<Cena | null>(null);

  if (cena) return <CenaJogavel key={cena.id} cena={cena} idioma={idioma} aoSair={() => setCena(null)} />;

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>
      <h1><Icone id="menu/jogo-achar" /> {t(TEXTOS.titulo, idioma)}</h1>
      <p>{t(TEXTOS.instrucao, idioma)}</p>
      <div className="grade-jogos">
        {CENAS.map((c) => (
          <button key={c.id} className="cartao-jogo cartao-historia" onClick={() => setCena(c)}>
            <span className="emoji-grande" aria-hidden="true">
              {comIcones(c.emoji)}
            </span>
            <strong>{t(c.titulo, idioma)}</strong>
            <small>{t(c.resumo, idioma)}</small>
          </button>
        ))}
      </div>
    </main>
  );
}

function CenaJogavel({ cena, idioma, aoSair }: { cena: Cena; idioma: Idioma; aoSair: () => void }) {
  const [rodada, setRodada] = useState(0);
  const [achados, setAchados] = useState<string[]>([]);
  const [dica, setDica] = useState<string | null>(null);
  const [dicas, setDicas] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const [vidas, setVidas] = useState(VIDAS);
  /** Posição do coração que acabou de quebrar (animação), ou null. */
  const [quebrando, setQuebrando] = useState<number | null>(null);

  // Itens procurados nesta rodada (sorteados de novo a cada "jogar de novo").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sorteio = useMemo(() => {
    const ordem = embaralhar(cena.itens);
    const alvos = ordem.slice(0, cena.alvos);
    const total = cena.itensPorRodada ?? cena.itens.length;
    const naCena = ordem.slice(0, Math.max(total, cena.alvos));
    return { alvos, postos: sortearPosicoes(naCena, alvos, cena.areaLivre) };
  }, [cena, rodada]);
  const { alvos, postos } = sorteio;
  // Só as próximas palavras ainda não achadas aparecem na lista.
  const visiveis = alvos.filter((a) => !achados.includes(a.id)).slice(0, PALAVRAS_VISIVEIS);
  const idsAlvo = visiveis.map((a) => a.id);
  const terminou = alvos.every((a) => achados.includes(a.id));
  const perdeu = vidas <= 0 && !terminou;

  function tocarItem(item: ItemCena) {
    if (achados.includes(item.id)) return;
    if (idsAlvo.includes(item.id)) {
      setAchados((a) => [...a, item.id]);
      if (dica === item.id) setDica(null);
      setAviso(preencher(t(TEXTOS.achou, idioma), { palavra: t(item.palavra, idioma) }));
      somAcerto();
    } else {
      setQuebrando(vidas - 1);
      setVidas((v) => Math.max(0, v - 1));
      setAviso(t(TEXTOS.naoEsta, idioma));
      somTentarDeNovo();
    }
  }

  function tocarFundo() {
    setAviso(t(TEXTOS.nada, idioma));
    somTentarDeNovo();
  }

  function pedirDica() {
    if (visiveis.length === 0) return;
    setDica(visiveis[Math.floor(Math.random() * visiveis.length)].id);
    setDicas((d) => d + 1);
  }

  function jogarDeNovo() {
    setAchados([]);
    setDica(null);
    setDicas(0);
    setAviso(null);
    setVidas(VIDAS);
    setQuebrando(null);
    setRodada((r) => r + 1);
  }

  const estiloCena: CSSProperties = {
    background: cena.fundo ? `center / cover url(${caminho(cena.fundo)}), ${cena.fundoCss}` : cena.fundoCss,
  };

  return (
    <main className="tela tela-achar">
      <header className="barra-sala">
        <button className="botao botao-secundario" onClick={aoSair}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso-achar">
          {preencher(t(TEXTOS.progresso, idioma), { n: achados.length, total: alvos.length })}
        </span>
        <span className="vidas-achar" role="img" aria-label={`${t(TEXTOS.vidas, idioma)}: ${vidas}`}>
          {Array.from({ length: VIDAS }, (_, i) => (
            <span key={i} className="coracao">
              {i < vidas ? <Icone id="interface/coracao" /> : <span className="coracao-vazio"><Icone id="interface/coracao-vazio" /></span>}
              {quebrando === i && i >= vidas && (
                <>
                  <span className="metade metade-esq" aria-hidden="true">
                    <Icone id="interface/coracao" />
                  </span>
                  <span
                    className="metade metade-dir"
                    aria-hidden="true"
                    onAnimationEnd={() => setQuebrando(null)}
                  >
                    <Icone id="interface/coracao" />
                  </span>
                </>
              )}
            </span>
          ))}
        </span>
        <button className="botao botao-secundario" onClick={pedirDica} disabled={terminou || perdeu}>
          {comIcones(t(TEXTOS.dica, idioma))}
        </button>
      </header>

      <section className="lista-achar" aria-label={t(TEXTOS.procura, idioma)}>
        <b>{t(TEXTOS.procura, idioma)}</b>
        {visiveis.map((a) => (
          <span key={a.id} className="palavra-achar">
            {t(a.palavra, idioma)}
          </span>
        ))}
      </section>

      <div className="cena cena-achar" style={estiloCena} onClick={tocarFundo} data-sem-leitura>
        {[...postos]
          .sort((a, b) => a.pos.camada - b.pos.camada || a.pos.y - b.pos.y)
          .map(({ item, pos }) => {
            const achado = achados.includes(item.id);
            const estilo = {
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              '--largura': `${item.largura}%`,
              zIndex: pos.camada,
              transform: `translate(-50%, -50%) rotate(${pos.giro}deg)`,
            } as CSSProperties;
            return (
              <button
                key={item.id}
                className={`item-achar${achado ? ' item-achado' : ''}${dica === item.id ? ' item-dica' : ''}`}
                style={estilo}
                onClick={(e) => {
                  e.stopPropagation();
                  tocarItem(item);
                }}
                aria-label={t(item.palavra, idioma)}
              >
                <img src={caminho(item.imagem)} alt="" draggable={false} />
              </button>
            );
          })}
      </div>

      <p className="mensagem-sala" role="status">
        {aviso ? comIcones(aviso) : ' '}
      </p>

      {perdeu && (
        <div className="fundo-modal">
          <div className="modal-enigma">
            <h2>{comIcones(t(TEXTOS.perdeu, idioma))}</h2>
            <p>{t(TEXTOS.perdeuTexto, idioma)}</p>
            <button className="botao" onClick={jogarDeNovo}>
              {t(TEXTOS.recomecar, idioma)}
            </button>
            <button className="botao botao-secundario" onClick={aoSair}>
              {t(TEXTOS.outraCena, idioma)}
            </button>
          </div>
        </div>
      )}

      {terminou && (
        <div className="fundo-modal">
          <div className="modal-enigma">
            <h2>{comIcones(t(TEXTOS.fim, idioma))}</h2>
            {dicas > 0 && <p>{preencher(t(TEXTOS.dicasUsadas, idioma), { n: dicas })}</p>}
            <button className="botao" onClick={jogarDeNovo}>
              {t(TEXTOS.outraVez, idioma)}
            </button>
            <button className="botao botao-secundario" onClick={aoSair}>
              {t(TEXTOS.outraCena, idioma)}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
