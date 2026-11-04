import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import type { Atributos, FichaPersonagem, NomeAtributo } from './tipos';
import {
  ATRIBUTOS,
  ATRIBUTO_MAXIMO,
  ATRIBUTO_MINIMO,
  AVATARES,
  PONTOS_PARA_DISTRIBUIR,
  vidaMaxima,
} from './historia';

const TEXTOS = {
  titulo: { 'pt-PT': 'Cria o teu herói', 'pt-BR': 'Crie seu herói' },
  nome: { 'pt-PT': 'Como se chama o herói?', 'pt-BR': 'Qual é o nome do herói?' },
  nomePadrao: { 'pt-PT': 'Herói', 'pt-BR': 'Herói' },
  escreveNome: { 'pt-PT': 'Escreve o nome', 'pt-BR': 'Escreva o nome' },
  amigo: { 'pt-PT': 'Escolhe o teu amigo', 'pt-BR': 'Escolha seu amigo' },
  pontos: {
    'pt-PT': 'Pontos para distribuir: {n}',
    'pt-BR': 'Pontos para distribuir: {n}',
  },
  gasta: {
    'pt-PT': 'Gasta todos os pontos para começar!',
    'pt-BR': 'Use todos os pontos para começar!',
  },
  vida: { 'pt-PT': 'Vida', 'pt-BR': 'Vida' },
  comecar: { 'pt-PT': 'Começar a aventura!', 'pt-BR': 'Começar a aventura!' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  menos: { 'pt-PT': 'Menos', 'pt-BR': 'Menos' },
  mais: { 'pt-PT': 'Mais', 'pt-BR': 'Mais' },
} satisfies Record<string, TextoPorIdioma>;

interface Props {
  idioma: Idioma;
  aoVoltar: () => void;
  aoComecar: (ficha: FichaPersonagem) => void;
}

/** Tela de criação da ficha de personagem. */
export function CriarFicha({ idioma, aoVoltar, aoComecar }: Props) {
  const [nome, setNome] = useState('');
  const [avatar, setAvatar] = useState(AVATARES[0]);
  const [atributos, setAtributos] = useState<Atributos>({
    forca: ATRIBUTO_MINIMO,
    agilidade: ATRIBUTO_MINIMO,
    inteligencia: ATRIBUTO_MINIMO,
    coragem: ATRIBUTO_MINIMO,
  });

  const gastos = Object.values(atributos).reduce((soma, v) => soma + v - ATRIBUTO_MINIMO, 0);
  const sobram = PONTOS_PARA_DISTRIBUIR - gastos;

  function mudar(id: NomeAtributo, delta: number) {
    const novo = atributos[id] + delta;
    if (novo < ATRIBUTO_MINIMO || novo > ATRIBUTO_MAXIMO) return;
    if (delta > 0 && sobram <= 0) return;
    setAtributos({ ...atributos, [id]: novo });
  }

  function comecar() {
    const vida = vidaMaxima(atributos.coragem);
    aoComecar({
      nome: nome.trim() || t(TEXTOS.nomePadrao, idioma),
      avatar,
      atributos,
      pontosDeVida: vida,
      pontosDeVidaMaximos: vida,
      pocoes: 0,
    });
  }

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1>📜 {t(TEXTOS.titulo, idioma)}</h1>

      <div className="ficha-papel">
        <label className="ficha-rotulo">
          {t(TEXTOS.nome, idioma)}
          <input
            className="campo-resposta"
            value={nome}
            maxLength={14}
            placeholder={t(TEXTOS.escreveNome, idioma)}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="off"
          />
        </label>

        <div className="ficha-rotulo">{t(TEXTOS.amigo, idioma)}</div>
        <div className="avatares" role="group">
          {AVATARES.map((a) => (
            <button
              key={a}
              className={`avatar ${a === avatar ? 'avatar-escolhido' : ''}`}
              onClick={() => setAvatar(a)}
              aria-pressed={a === avatar}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="texto-grande">{preencher(t(TEXTOS.pontos, idioma), { n: sobram })}</p>

        {ATRIBUTOS.map((atr) => (
          <div key={atr.id} className="linha-atributo">
            <span className="atributo-nome">
              <span aria-hidden="true">{atr.emoji}</span> {t(atr.nome, idioma)}
              <small>{t(atr.ajuda, idioma)}</small>
            </span>
            <span className="controle-atributo">
              <button
                className="botao botao-secundario botao-redondo"
                onClick={() => mudar(atr.id, -1)}
                disabled={atributos[atr.id] <= ATRIBUTO_MINIMO}
                aria-label={t(TEXTOS.menos, idioma)}
              >
                −
              </button>
              <strong className="atributo-valor">{atributos[atr.id]}</strong>
              <button
                className="botao botao-redondo"
                onClick={() => mudar(atr.id, 1)}
                disabled={sobram <= 0 || atributos[atr.id] >= ATRIBUTO_MAXIMO}
                aria-label={t(TEXTOS.mais, idioma)}
              >
                +
              </button>
            </span>
          </div>
        ))}

        <p className="texto-grande">
          ❤️ {t(TEXTOS.vida, idioma)}: {vidaMaxima(atributos.coragem)}
        </p>
      </div>

      <p className="mensagem">{sobram > 0 ? t(TEXTOS.gasta, idioma) : ''}</p>
      <button className="botao" onClick={comecar} disabled={sobram > 0}>
        {t(TEXTOS.comecar, idioma)}
      </button>
    </main>
  );
}

/** Resumo da ficha, mostrado durante a aventura. */
export function ResumoFicha({ ficha, idioma }: { ficha: FichaPersonagem; idioma: Idioma }) {
  return (
    <div className="resumo-ficha">
      <span className="resumo-avatar" aria-hidden="true">
        {ficha.avatar}
      </span>
      <strong>{ficha.nome}</strong>
      <span>
        ❤️ {ficha.pontosDeVida}/{ficha.pontosDeVidaMaximos}
      </span>
      <span>🧪 {ficha.pocoes}</span>
      {ATRIBUTOS.map((atr) => (
        <span key={atr.id} title={t(atr.nome, idioma)}>
          {atr.emoji} {ficha.atributos[atr.id]}
        </span>
      ))}
    </div>
  );
}
