import { type CSSProperties, useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { EnigmaView } from './enigmas/EnigmaView';
import { estrelasPorDicas, salvarEstrelas } from './progresso';
import type { Enigma, Sala } from './tipos';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  dica: { 'pt-PT': '💡 Dica', 'pt-BR': '💡 Dica' },
  inventario: { 'pt-PT': 'Pistas:', 'pt-BR': 'Pistas:' },
  nenhuma: { 'pt-PT': 'Ainda não tens pistas.', 'pt-BR': 'Você ainda não tem pistas.' },
  comecar: { 'pt-PT': 'Começar!', 'pt-BR': 'Começar!' },
  fechar: { 'pt-PT': 'Fechar', 'pt-BR': 'Fechar' },
  faltaAlgo: {
    'pt-PT': 'Ainda falta alguma coisa para abrir isto.',
    'pt-BR': 'Ainda falta alguma coisa para abrir isto.',
  },
  resolvido: { 'pt-PT': '✅ Já resolveste este.', 'pt-BR': '✅ Você já resolveu este.' },
  escapou: { 'pt-PT': 'Escapaste! 🎉', 'pt-BR': 'Você escapou! 🎉' },
  outraSala: { 'pt-PT': 'Escolher outra sala', 'pt-BR': 'Escolher outra sala' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
  dicasUsadas: { 'pt-PT': 'Dicas usadas: {n}', 'pt-BR': 'Dicas usadas: {n}' },
  objetos: { 'pt-PT': 'Resolvidos: {n} de {total}', 'pt-BR': 'Resolvidos: {n} de {total}' },
} satisfies Record<string, TextoPorIdioma>;

type Aberto = { tipo: 'objeto'; id: string } | { tipo: 'saida' } | null;

/** Uma sala de escape room jogável. Funciona com qualquer `Sala` descrita em `salas/`. */
export function MotorSala({
  sala,
  idioma,
  aoSair,
}: {
  sala: Sala;
  idioma: Idioma;
  aoSair: () => void;
}) {
  const [comecou, setComecou] = useState(false);
  const [resolvidos, setResolvidos] = useState<string[]>([]);
  const [aberto, setAberto] = useState<Aberto>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [dicas, setDicas] = useState(0);
  const [escapou, setEscapou] = useState(false);
  const [rodada, setRodada] = useState(0);

  const inventario = sala.objetos.filter((o) => resolvidos.includes(o.id)).map((o) => o.recompensa);
  const temPista = (id: string) => inventario.some((p) => p.id === id);

  function reiniciar() {
    setResolvidos([]);
    setAberto(null);
    setAviso(null);
    setDicas(0);
    setEscapou(false);
    setRodada((r) => r + 1);
  }

  function tocarObjeto(id: string) {
    const objeto = sala.objetos.find((o) => o.id === id);
    if (!objeto) return;
    if (resolvidos.includes(id)) {
      setAviso(t(TEXTOS.resolvido, idioma));
    } else if (objeto.requer && !temPista(objeto.requer)) {
      setAviso(t(objeto.bloqueado ?? TEXTOS.faltaAlgo, idioma));
    } else {
      setAviso(null);
      setAberto({ tipo: 'objeto', id });
    }
  }

  function acertouObjeto(id: string) {
    const objeto = sala.objetos.find((o) => o.id === id);
    setResolvidos((r) => (r.includes(id) ? r : [...r, id]));
    setAberto(null);
    if (objeto) setAviso(t(objeto.sucesso, idioma));
  }

  function acertouSaida() {
    salvarEstrelas(sala.id, estrelasPorDicas(dicas));
    setAberto(null);
    setEscapou(true);
  }

  function pedirDica() {
    setDicas((n) => n + 1);
    const proximo = sala.objetos.find(
      (o) => !resolvidos.includes(o.id) && (!o.requer || temPista(o.requer)),
    );
    setAviso(t(proximo ? proximo.dica : sala.saida.dica, idioma));
  }

  const cabecalho = (
    <header className="barra-jogo">
      <button className="botao botao-secundario" onClick={aoSair}>
        ← {t(TEXTOS.voltar, idioma)}
      </button>
    </header>
  );

  if (!comecou) {
    return (
      <main className="tela tela-centro">
        {cabecalho}
        <p className="emoji-grande" aria-hidden="true">
          {sala.emoji}
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
        <h1>{t(TEXTOS.escapou, idioma)}</h1>
        <p className="estrelas" aria-label={`${estrelas}/3`}>
          {'⭐'.repeat(estrelas)}
          {'☆'.repeat(3 - estrelas)}
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

  let enigmaAberto: { enigma: Enigma; aoAcertar: () => void } | null = null;
  if (aberto?.tipo === 'objeto') {
    const objeto = sala.objetos.find((o) => o.id === aberto.id);
    if (objeto) enigmaAberto = { enigma: objeto.enigma, aoAcertar: () => acertouObjeto(objeto.id) };
  } else if (aberto?.tipo === 'saida') {
    enigmaAberto = { enigma: sala.saida.enigma, aoAcertar: acertouSaida };
  }

  return (
    <main className="tela tela-sala" key={rodada}>
      <header className="barra-jogo barra-sala">
        <button className="botao botao-secundario" onClick={aoSair}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        <span className="progresso">
          {preencher(t(TEXTOS.objetos, idioma), { n: resolvidos.length, total: sala.objetos.length })}
        </span>
        <button className="botao botao-secundario" onClick={pedirDica}>
          {t(TEXTOS.dica, idioma)}
        </button>
      </header>

      <div className="cena" style={{ background: sala.fundo }}>
        {sala.objetos.map((objeto) => {
          const feito = resolvidos.includes(objeto.id);
          return (
            <button
              key={objeto.id}
              className={`objeto-sala ${feito ? 'objeto-feito' : ''}`}
              style={{ left: `${objeto.x}%`, top: `${objeto.y}%` } as CSSProperties}
              onClick={() => tocarObjeto(objeto.id)}
              aria-label={t(objeto.nome, idioma)}
            >
              <span className="objeto-emoji" aria-hidden="true">
                {objeto.emoji}
              </span>
              <span className="objeto-nome">{feito ? '✅' : t(objeto.nome, idioma)}</span>
            </button>
          );
        })}
        <button
          className="objeto-sala objeto-saida"
          style={{ left: '50%', top: '86%' } as CSSProperties}
          onClick={() => {
            setAviso(null);
            setAberto({ tipo: 'saida' });
          }}
          aria-label={t(sala.saida.nome, idioma)}
        >
          <span className="objeto-emoji" aria-hidden="true">
            {sala.saida.emoji}
          </span>
          <span className="objeto-nome">{t(sala.saida.nome, idioma)}</span>
        </button>
      </div>

      <p className="mensagem mensagem-sala" aria-live="polite">
        {aviso}
      </p>

      <footer className="inventario">
        <strong>{t(TEXTOS.inventario, idioma)}</strong>
        {inventario.length === 0 && <span className="progresso">{t(TEXTOS.nenhuma, idioma)}</span>}
        {inventario.map((pista) => (
          <span key={pista.id} className="pista" title={t(pista.nome, idioma)}>
            <span aria-hidden="true">{pista.emoji}</span>
            {pista.valor && <b>{pista.valor}</b>}
            <small>{t(pista.nome, idioma)}</small>
          </span>
        ))}
      </footer>

      {enigmaAberto && (
        <div className="fundo-modal" role="dialog" aria-modal="true">
          <div className="modal-enigma">
            <button className="botao botao-secundario fechar-modal" onClick={() => setAberto(null)}>
              ✕ {t(TEXTOS.fechar, idioma)}
            </button>
            <EnigmaView enigma={enigmaAberto.enigma} idioma={idioma} aoAcertar={enigmaAberto.aoAcertar} />
          </div>
        </div>
      )}
    </main>
  );
}
