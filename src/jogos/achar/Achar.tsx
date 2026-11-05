import { type CSSProperties, useMemo, useState } from 'react';
import type { PropsJogo } from '../tipos';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import { CENAS } from './cenas';
import type { Cena, ItemCena } from './tipos';

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
    'pt-PT': 'Isso não está na lista, mas bem visto! Continua a procurar.',
    'pt-BR': 'Isso não está na lista, mas boa! Continue procurando.',
  },
  nada: { 'pt-PT': 'Aqui não há nada. Tenta noutro sítio!', 'pt-BR': 'Aqui não tem nada. Tente em outro lugar!' },
  achou: { 'pt-PT': 'Encontraste: {palavra}! 🎉', 'pt-BR': 'Você achou: {palavra}! 🎉' },
  fim: { 'pt-PT': 'Encontraste tudo! 🎉', 'pt-BR': 'Você achou tudo! 🎉' },
  outraVez: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  outraCena: { 'pt-PT': 'Escolher outra cena', 'pt-BR': 'Escolher outra cena' },
  dicasUsadas: { 'pt-PT': 'Dicas usadas: {n}', 'pt-BR': 'Dicas usadas: {n}' },
} satisfies Record<string, TextoPorIdioma>;

const caminho = (arquivo: string) => `${import.meta.env.BASE_URL}${arquivo}`;

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
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
      <h1>🔍 {t(TEXTOS.titulo, idioma)}</h1>
      <p>{t(TEXTOS.instrucao, idioma)}</p>
      <div className="grade-jogos">
        {CENAS.map((c) => (
          <button key={c.id} className="cartao-jogo cartao-historia" onClick={() => setCena(c)}>
            <span className="emoji-grande" aria-hidden="true">
              {c.emoji}
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

  // Itens procurados nesta rodada (sorteados de novo a cada "jogar de novo").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const alvos = useMemo(() => embaralhar(cena.itens).slice(0, cena.alvos), [cena, rodada]);
  const idsAlvo = alvos.map((a) => a.id);
  const terminou = alvos.every((a) => achados.includes(a.id));

  function tocarItem(item: ItemCena) {
    if (achados.includes(item.id)) return;
    if (idsAlvo.includes(item.id)) {
      setAchados((a) => [...a, item.id]);
      if (dica === item.id) setDica(null);
      setAviso(preencher(t(TEXTOS.achou, idioma), { palavra: t(item.palavra, idioma) }));
      somAcerto();
    } else {
      setAviso(t(TEXTOS.naoEsta, idioma));
      somTentarDeNovo();
    }
  }

  function tocarFundo() {
    setAviso(t(TEXTOS.nada, idioma));
    somTentarDeNovo();
  }

  function pedirDica() {
    const faltam = alvos.filter((a) => !achados.includes(a.id));
    if (faltam.length === 0) return;
    setDica(faltam[Math.floor(Math.random() * faltam.length)].id);
    setDicas((d) => d + 1);
  }

  function jogarDeNovo() {
    setAchados([]);
    setDica(null);
    setDicas(0);
    setAviso(null);
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
        <button className="botao botao-secundario" onClick={pedirDica} disabled={terminou}>
          {t(TEXTOS.dica, idioma)}
        </button>
      </header>

      <section className="lista-achar" aria-label={t(TEXTOS.procura, idioma)}>
        <b>{t(TEXTOS.procura, idioma)}</b>
        {alvos.map((a) => (
          <span key={a.id} className={`palavra-achar${achados.includes(a.id) ? ' palavra-achada' : ''}`}>
            {achados.includes(a.id) ? '✅ ' : ''}
            {t(a.palavra, idioma)}
          </span>
        ))}
      </section>

      <div className="cena cena-achar" style={estiloCena} onClick={tocarFundo} data-sem-leitura>
        {[...cena.itens]
          .sort((a, b) => (a.camada ?? 0) - (b.camada ?? 0))
          .map((item) => {
            const achado = achados.includes(item.id);
            const estilo = {
              left: `${item.x}%`,
              top: `${item.y}%`,
              '--largura': `${item.largura}%`,
              zIndex: item.camada ?? 0,
              transform: `translate(-50%, -50%) rotate(${item.giro ?? 0}deg)`,
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
        {aviso ?? ' '}
      </p>

      {terminou && (
        <div className="fundo-modal">
          <div className="modal-enigma">
            <h2>{t(TEXTOS.fim, idioma)}</h2>
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
