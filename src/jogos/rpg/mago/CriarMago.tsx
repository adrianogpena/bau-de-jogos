import { useState } from 'react';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { type Genero, type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { EscolherGenero } from '../EscolherGenero';
import type { EscolaId, FichaMago, Habilidades, NomeHabilidade } from './tipos';
import {
  AVATARES_MAGO,
  AVATAR_MAGA,
  ESCOLAS,
  FEITICOS,
  HABILIDADES,
  HABILIDADES_INICIAIS,
  HABILIDADE_MAXIMA,
  HABILIDADE_MINIMA,
  PONTOS_MAGO,
  VIDA_MAGO,
  energiaMaxima,
  escolaPorId,
} from './feiticos';
import { Icone, comIcones } from '../../../compartilhado/icones';

const TEXTOS = {
  titulo: { 'pt-PT': 'Cria o teu mago', 'pt-BR': 'Crie seu mago' },
  falta: {
    'pt-PT': 'Escolhe rapaz ou rapariga para começar!',
    'pt-BR': 'Escolha menino ou menina para começar!',
  },
  avatar: { 'pt-PT': 'Escolhe o teu amigo', 'pt-BR': 'Escolha seu amigo' },
  tipo: {
    'pt-PT': 'Que tipo de mago queres ser?',
    'pt-BR': 'Que tipo de mago você quer ser?',
  },
  feiticos: { 'pt-PT': 'Feitiços de {escola}:', 'pt-BR': 'Feitiços de {escola}:' },
  custo: { 'pt-PT': 'Custa {n} 🔮', 'pt-BR': 'Custa {n} 🔮' },
  pontos: { 'pt-PT': 'Pontos para distribuir: {n}', 'pt-BR': 'Pontos para distribuir: {n}' },
  gasta: { 'pt-PT': 'Gasta todos os pontos para começar!', 'pt-BR': 'Use todos os pontos para começar!' },
  vida: { 'pt-PT': 'Vida', 'pt-BR': 'Vida' },
  energia: { 'pt-PT': 'Energia mágica', 'pt-BR': 'Energia mágica' },
  comecar: { 'pt-PT': 'Subir a torre!', 'pt-BR': 'Subir a torre!' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  menos: { 'pt-PT': 'Menos', 'pt-BR': 'Menos' },
  mais: { 'pt-PT': 'Mais', 'pt-BR': 'Mais' },
} satisfies Record<string, TextoPorIdioma>;

interface Props {
  idioma: Idioma;
  aoVoltar: () => void;
  aoComecar: (ficha: FichaMago) => void;
}

/** Criação do mago: rapaz ou rapariga, amigo, tipo de mago (escola de magia) e habilidades. */
export function CriarMago({ idioma, aoVoltar, aoComecar }: Props) {
  const [genero, setGenero] = useState<Genero | null>(null);
  const [indiceAvatar, setIndiceAvatar] = useState(0);
  // o primeiro avatar é o mago ou a maga, conforme o gênero
  const avatares = AVATARES_MAGO.map((a, i) => (i === 0 && genero === 'f' ? AVATAR_MAGA : a));
  const avatar = avatares[indiceAvatar];
  const [escolaId, setEscolaId] = useState<EscolaId>('fogo');
  const [habilidades, setHabilidades] = useState<Habilidades>(HABILIDADES_INICIAIS);

  const escola = escolaPorId(escolaId);
  const gastos = Object.values(habilidades).reduce((soma, v) => soma + v - HABILIDADE_MINIMA, 0);
  const sobram = PONTOS_MAGO - gastos;

  function mudar(id: NomeHabilidade, delta: number) {
    const novo = habilidades[id] + delta;
    if (novo < HABILIDADE_MINIMA || novo > HABILIDADE_MAXIMA) return;
    if (delta > 0 && sobram <= 0) return;
    setHabilidades({ ...habilidades, [id]: novo });
  }

  function comecar() {
    if (!genero) return;
    const energia = energiaMaxima(habilidades.energia);
    aoComecar({
      genero,
      avatar,
      escola: escolaId,
      habilidades,
      pontosDeVida: VIDA_MAGO,
      pontosDeVidaMaximos: VIDA_MAGO,
      energia,
      energiaMaxima: energia,
      feiticos: ['faisca', ...escola.feiticos],
    });
  }

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1><Icone id="interface/chapeu-de-mago" /> {t(TEXTOS.titulo, idioma)}</h1>

      <div className="ficha-papel">
        <EscolherGenero idioma={idioma} genero={genero} aoEscolher={setGenero} />

        <div className="ficha-rotulo">{t(TEXTOS.avatar, idioma)}</div>
        <div className="avatares" role="group">
          {avatares.map((a, i) => (
            <button
              key={i}
              className={`avatar ${a === avatar ? 'avatar-escolhido' : ''}`}
              onClick={() => setIndiceAvatar(i)}
              aria-pressed={a === avatar}
            >
              {comIcones(a)}
            </button>
          ))}
        </div>

        <div className="ficha-rotulo">{t(TEXTOS.tipo, idioma)}</div>
        <div className="escolas" role="group">
          {ESCOLAS.map((e) => (
            <button
              key={e.id}
              className={`escola ${e.id === escolaId ? 'escola-escolhida' : ''}`}
              onClick={() => setEscolaId(e.id)}
              aria-pressed={e.id === escolaId}
            >
              <span className="escola-emoji" aria-hidden="true">
                {comIcones(e.emoji)}
              </span>
              <strong>{t(e.nome, idioma)}</strong>
              <small>{t(e.resumo, idioma)}</small>
            </button>
          ))}
        </div>

        <div className="ficha-rotulo">
          {preencher(t(TEXTOS.feiticos, idioma), { escola: t(escola.curto, idioma) })}
        </div>
        <ul className="lista-feiticos">
          {escola.feiticos.map((id) => {
            const f = FEITICOS[id];
            return (
              <li key={id} className="feitico-linha">
                <span className="feitico-emoji" aria-hidden="true">
                  {comIcones(f.emoji)}
                </span>
                <span className="feitico-texto">
                  <strong>
                    {t(f.nome, idioma)} · <small>{comIcones(preencher(t(TEXTOS.custo, idioma), { n: f.custo }))}</small>
                  </strong>
                  <TextoNarrado compacto idioma={idioma} texto={t(f.descricao, idioma)} />
                </span>
              </li>
            );
          })}
        </ul>

        <TextoNarrado
          className="texto-grande"
          idioma={idioma}
          texto={preencher(t(TEXTOS.pontos, idioma), { n: sobram })}
        />

        {HABILIDADES.map((hab) => (
          <div key={hab.id} className="linha-atributo">
            <span className="atributo-nome">
              <span aria-hidden="true">{comIcones(hab.emoji)}</span>
              <TextoNarrado
                compacto
                idioma={idioma}
                texto={`${t(hab.nome, idioma)}. ${t(hab.ajuda, idioma)}`}
              />
            </span>
            <span className="controle-atributo">
              <button
                className="botao botao-secundario botao-redondo"
                onClick={() => mudar(hab.id, -1)}
                disabled={habilidades[hab.id] <= HABILIDADE_MINIMA}
                aria-label={t(TEXTOS.menos, idioma)}
              >
                −
              </button>
              <strong className="atributo-valor">{habilidades[hab.id]}</strong>
              <button
                className="botao botao-redondo"
                onClick={() => mudar(hab.id, 1)}
                disabled={sobram <= 0 || habilidades[hab.id] >= HABILIDADE_MAXIMA}
                aria-label={t(TEXTOS.mais, idioma)}
              >
                +
              </button>
            </span>
          </div>
        ))}

        <p className="texto-grande">
          <Icone id="interface/coracao" /> {t(TEXTOS.vida, idioma)}: {VIDA_MAGO} · <Icone id="interface/bola-de-cristal" /> {t(TEXTOS.energia, idioma)}:{' '}
          {energiaMaxima(habilidades.energia)}
        </p>
      </div>

      <p className="mensagem">{!genero ? t(TEXTOS.falta, idioma) : sobram > 0 ? t(TEXTOS.gasta, idioma) : ''}</p>
      <button className="botao" onClick={comecar} disabled={sobram > 0 || !genero}>
        {t(TEXTOS.comecar, idioma)}
      </button>
    </main>
  );
}
