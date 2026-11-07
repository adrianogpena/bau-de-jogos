import { type CSSProperties, type ReactNode, useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { comIcones } from '../../compartilhado/icones';
import { EnigmaView } from './enigmas/EnigmaView';
import { estrelasPorDicas, salvarEstrelas } from './progresso';
import { Recorte } from './Recorte';
import { extraQueDa, sortearRodada } from './rodada';
import type { Enigma, Sala, Zona } from './tipos';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  dica: { 'pt-PT': '💡 Dica', 'pt-BR': '💡 Dica' },
  comecar: { 'pt-PT': 'Começar!', 'pt-BR': 'Começar!' },
  fechar: { 'pt-PT': 'Fechar', 'pt-BR': 'Fechar' },
  cadeado: { 'pt-PT': 'Cadeado da saída:', 'pt-BR': 'Cadeado da saída:' },
  verCadeado: {
    'pt-PT': 'Ainda não viste o cadeado da saída. Toca na saída para o ver!',
    'pt-BR': 'Você ainda não viu o cadeado da saída. Toque na saída para ver!',
  },
  pistas: { 'pt-PT': 'Na mochila:', 'pt-BR': 'Na mochila:' },
  faltaAlgo: {
    'pt-PT': 'Ainda falta alguma coisa para abrir isto.',
    'pt-BR': 'Ainda falta alguma coisa para abrir isto.',
  },
  resolvido: { 'pt-PT': '✅ Já resolveste este.', 'pt-BR': '✅ Você já resolveu este.' },
  escapou: { 'pt-PT': 'Escapaste! 🎉', 'pt-BR': 'Você escapou! 🎉' },
  outraSala: { 'pt-PT': 'Escolher outra sala', 'pt-BR': 'Escolher outra sala' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  dicasUsadas: { 'pt-PT': 'Dicas usadas: {n}', 'pt-BR': 'Dicas usadas: {n}' },
} satisfies Record<string, TextoPorIdioma>;

type Aberto = { tipo: 'objeto'; id: string } | { tipo: 'saida' } | null;

const caminho = (arquivo: string) => `${import.meta.env.BASE_URL}${arquivo}`;

/** Com `?zonas` no endereço, as zonas aparecem marcadas sobre o fundo (para acertar as posições na imagem). */
const calibrar = typeof location !== 'undefined' && new URLSearchParams(location.search).has('zonas');

const estiloZona = (z: Zona): CSSProperties => ({
  left: `${z.x}%`,
  top: `${z.y}%`,
  width: `${z.largura}%`,
  height: `${z.altura}%`,
});

/** Uma sala da Saída Secreta jogável. Funciona com qualquer `Sala` descrita em `salas/`. */
export function MotorSala({ sala, idioma, aoSair }: { sala: Sala; idioma: Idioma; aoSair: () => void }) {
  const [comecou, setComecou] = useState(false);
  const [rodada, setRodada] = useState(() => sortearRodada(sala));
  const [resolvidos, setResolvidos] = useState<string[]>([]);
  const [aberto, setAberto] = useState<Aberto>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [destaque, setDestaque] = useState<string | null>(null);
  const [viuCadeado, setViuCadeado] = useState(false);
  const [dicas, setDicas] = useState(0);
  const [escapou, setEscapou] = useState(false);

  const objetos = [...sala.fontes, ...sala.extras];
  const noCodigo = (id: string) => rodada.codigo.find((f) => f.fonte.id === id);
  const pistas = sala.extras.filter((e) => resolvidos.includes(e.id)).map((e) => e.recompensa);
  const temPista = (id: string) => pistas.some((p) => p.id === id);

  function reiniciar() {
    setRodada(sortearRodada(sala));
    setResolvidos([]);
    setAberto(null);
    setAviso(null);
    setDestaque(null);
    setViuCadeado(false);
    setDicas(0);
    setEscapou(false);
  }

  function tocarObjeto(id: string) {
    const objeto = objetos.find((o) => o.id === id);
    if (!objeto) return;
    if (destaque === id) setDestaque(null);
    if (resolvidos.includes(id)) {
      setAviso(t(TEXTOS.resolvido, idioma));
    } else if (objeto.requer && !temPista(objeto.requer)) {
      setAviso(t(objeto.bloqueado ?? TEXTOS.faltaAlgo, idioma));
    } else if (sala.fontes.some((f) => f.id === id) && !noCodigo(id)) {
      setAviso(t(sala.semNumero, idioma));
    } else {
      setAviso(null);
      setAberto({ tipo: 'objeto', id });
    }
  }

  function tocarSaida() {
    if (destaque === 'saida') setDestaque(null);
    setViuCadeado(true);
    setAviso(null);
    setAberto({ tipo: 'saida' });
  }

  function acertou(id: string) {
    setResolvidos((r) => (r.includes(id) ? r : [...r, id]));
    setAberto(null);
    const sorteada = noCodigo(id);
    const extra = sala.extras.find((e) => e.id === id);
    if (sorteada) setAviso(preencher(t(sorteada.fonte.sucesso, idioma), { n: sorteada.numero }));
    else if (extra) setAviso(t(extra.sucesso, idioma));
  }

  function acertouSaida() {
    salvarEstrelas(sala.id, estrelasPorDicas(dicas));
    setAberto(null);
    setEscapou(true);
  }

  /** Dica gradual: ver o cadeado, depois o próximo objeto do código (ou o extra de que ele precisa), depois a saída. */
  function pedirDica() {
    setDicas((n) => n + 1);
    if (!viuCadeado) {
      setAviso(t(sala.saida.dicaVer, idioma));
      setDestaque('saida');
      return;
    }
    const proxima = rodada.codigo.find((f) => !resolvidos.includes(f.fonte.id));
    if (!proxima) {
      setAviso(t(sala.saida.dica, idioma));
      setDestaque('saida');
      return;
    }
    const extra = proxima.fonte.requer && !temPista(proxima.fonte.requer) ? extraQueDa(sala, proxima.fonte.requer) : undefined;
    if (extra) {
      setAviso(t(rodada.extras[extra.id].dica, idioma));
      setDestaque(extra.id);
    } else {
      setAviso(t(proxima.variante.dica, idioma));
      setDestaque(proxima.fonte.id);
    }
  }

  const recorte = (zona: Zona, emoji: string, altura?: number) => (
    <Recorte fundo={sala.fundo} zona={zona} emoji={emoji} altura={altura} />
  );

  if (!comecou) {
    return (
      <main className="tela tela-centro">
        <header className="barra-jogo">
          <button className="botao botao-secundario" onClick={aoSair}>
            ← {t(TEXTOS.voltar, idioma)}
          </button>
        </header>
        <p className="emoji-grande" aria-hidden="true">
          {comIcones(sala.emoji)}
        </p>
        <h1>{t(sala.titulo, idioma)}</h1>
        <TextoNarrado className="folha" idioma={idioma} texto={t(sala.intro, idioma)} />
        <button className="botao" onClick={() => setComecou(true)}>
          {t(TEXTOS.comecar, idioma)} ▶
        </button>
      </main>
    );
  }

  if (escapou) {
    const estrelas = estrelasPorDicas(dicas);
    return (
      <main className="tela tela-centro">
        <h1>{comIcones(t(TEXTOS.escapou, idioma))}</h1>
        <p className="estrelas" aria-label={`${estrelas}/3`}>
          {comIcones('⭐'.repeat(estrelas) + '☆'.repeat(3 - estrelas))}
        </p>
        <TextoNarrado className="folha" idioma={idioma} texto={t(sala.vitoria, idioma)} lerAoAbrir />
        <p className="progresso">{preencher(t(TEXTOS.dicasUsadas, idioma), { n: dicas })}</p>
        <div className="acoes">
          <button className="botao" onClick={reiniciar}>
            {t(TEXTOS.jogarDeNovo, idioma)}
          </button>
          <button className="botao botao-secundario" onClick={aoSair}>
            {t(TEXTOS.outraSala, idioma)}
          </button>
        </div>
      </main>
    );
  }

  let enigmaAberto: { enigma: Enigma; aoAcertar: () => void; rotulos?: ReactNode[] } | null = null;
  if (aberto?.tipo === 'objeto') {
    const id = aberto.id;
    const variante = noCodigo(id)?.variante ?? rodada.extras[id];
    if (variante) enigmaAberto = { enigma: variante.enigma, aoAcertar: () => acertou(id) };
  } else if (aberto?.tipo === 'saida') {
    enigmaAberto = {
      enigma: { tipo: 'codigo', pergunta: sala.saida.pergunta, resposta: rodada.codigo.map((f) => f.numero).join('') },
      aoAcertar: acertouSaida,
      rotulos: rodada.codigo.map((f) => <span key={f.fonte.id}>{recorte(f.fonte.zona, f.fonte.emoji, 48)}</span>),
    };
  }

  const classeZona = (id: string, extra = '') =>
    ['zona-sala', extra, sala.fundo ? '' : 'zona-provisoria', destaque === id ? 'zona-dica' : '', calibrar ? 'zona-calibrar' : '']
      .filter(Boolean)
      .join(' ');

  return (
    <main className="tela tela-sala">
      <header className="barra-jogo barra-sala">
        <button className="botao botao-secundario" onClick={aoSair}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <button className="botao botao-secundario" onClick={pedirDica}>
          {comIcones(t(TEXTOS.dica, idioma))}
        </button>
      </header>

      <div
        className="cena"
        style={{ background: sala.fundo ? `center / 100% 100% no-repeat url(${caminho(sala.fundo)}), ${sala.fundoCss}` : sala.fundoCss }}
      >
        {objetos.map((objeto) => {
          const feito = resolvidos.includes(objeto.id);
          const sorteada = noCodigo(objeto.id);
          return (
            <button
              key={objeto.id}
              className={classeZona(objeto.id)}
              style={estiloZona(objeto.zona)}
              onClick={() => tocarObjeto(objeto.id)}
              aria-label={t(objeto.nome, idioma)}
              data-id={objeto.id}
            >
              {!sala.fundo && (
                <span className="objeto-emoji" aria-hidden="true">
                  {comIcones(objeto.emoji)}
                </span>
              )}
              {feito && <span className="selo-zona">{sorteada ? sorteada.numero : comIcones('✅')}</span>}
            </button>
          );
        })}
        <button
          className={classeZona('saida', 'zona-saida')}
          style={estiloZona(sala.saida.zona)}
          onClick={tocarSaida}
          aria-label={t(sala.saida.nome, idioma)}
          data-id="saida"
        >
          {!sala.fundo && (
            <span className="objeto-emoji" aria-hidden="true">
              {comIcones(sala.saida.emoji)}
            </span>
          )}
        </button>
      </div>

      <p className="mensagem mensagem-sala" aria-live="polite">
        {aviso ? comIcones(aviso) : null}
      </p>

      <section className="painel-sala">
        <strong>{t(TEXTOS.cadeado, idioma)}</strong>
        {viuCadeado ? (
          <div className="cadeado-sala">
            {rodada.codigo.map((f) => {
              const achado = resolvidos.includes(f.fonte.id);
              return (
                <span key={f.fonte.id} className={`casa-cadeado ${achado ? 'casa-cadeado-achada' : ''}`}>
                  {recorte(f.fonte.zona, f.fonte.emoji)}
                  <b>{achado ? f.numero : '?'}</b>
                </span>
              );
            })}
          </div>
        ) : (
          <span className="progresso">{t(TEXTOS.verCadeado, idioma)}</span>
        )}
        {pistas.length > 0 && (
          <div className="inventario">
            <strong>{t(TEXTOS.pistas, idioma)}</strong>
            {pistas.map((pista) => (
              <span key={pista.id} className="pista">
                <span aria-hidden="true">{comIcones(pista.emoji)}</span>
                <small>{t(pista.nome, idioma)}</small>
              </span>
            ))}
          </div>
        )}
      </section>

      {enigmaAberto && (
        <div className="fundo-modal" role="dialog" aria-modal="true">
          <div className="modal-enigma">
            <button className="botao botao-secundario fechar-modal" onClick={() => setAberto(null)}>
              {comIcones('✕')} {t(TEXTOS.fechar, idioma)}
            </button>
            <EnigmaView
              key={aberto?.tipo === 'objeto' ? aberto.id : 'saida'}
              enigma={enigmaAberto.enigma}
              idioma={idioma}
              aoAcertar={enigmaAberto.aoAcertar}
              rotulos={enigmaAberto.rotulos}
            />
          </div>
        </div>
      )}
    </main>
  );
}
