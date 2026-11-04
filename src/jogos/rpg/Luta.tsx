import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { Dado, usarDado } from '../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import type { FichaPersonagem, Inimigo } from './tipos';

const TEXTOS = {
  atacar: { 'pt-PT': '⚔️ Atacar!', 'pt-BR': '⚔️ Atacar!' },
  pocao: { 'pt-PT': '🧪 Beber poção', 'pt-BR': '🧪 Beber poção' },
  vezInimigo: { 'pt-PT': 'Vez de {inimigo}', 'pt-BR': 'Vez de {inimigo}' },
  seuTurno: { 'pt-PT': 'É a tua vez! Lança o dado.', 'pt-BR': 'É a sua vez! Jogue o dado.' },
  acertou: {
    'pt-PT': 'Tiraste {total} e acertaste! Causaste {dano} de dano.',
    'pt-BR': 'Você tirou {total} e acertou! Causou {dano} de dano.',
  },
  critico: {
    'pt-PT': '⭐ Golpe crítico! Tiraste 20 e o dano é a dobrar: {dano}!',
    'pt-BR': '⭐ Golpe crítico! Você tirou 20 e o dano é em dobro: {dano}!',
  },
  errou: {
    'pt-PT': 'Tiraste {total} e falhaste o golpe.',
    'pt-BR': 'Você tirou {total} e errou o golpe.',
  },
  inimigoAcertou: {
    'pt-PT': '{inimigo} tirou {total} e acertou-te! Perdeste {dano} de vida.',
    'pt-BR': '{inimigo} tirou {total} e acertou você! Você perdeu {dano} de vida.',
  },
  inimigoErrou: {
    'pt-PT': '{inimigo} tirou {total} e falhou o golpe! 🍀',
    'pt-BR': '{inimigo} tirou {total} e errou o golpe! 🍀',
  },
  curou: {
    'pt-PT': 'Bebeste a poção e recuperaste {cura} de vida! 💖',
    'pt-BR': 'Você bebeu a poção e recuperou {cura} de vida! 💖',
  },
  venceu: { 'pt-PT': 'Venceste a luta! 🎉', 'pt-BR': 'Você venceu a luta! 🎉' },
  perdeu: {
    'pt-PT': 'Ficaste sem forças! Descansa um pouco e tenta outra vez.',
    'pt-BR': 'Você ficou sem forças! Descanse um pouco e tente de novo.',
  },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  tentarOutraVez: { 'pt-PT': 'Tentar outra vez', 'pt-BR': 'Tentar de novo' },
  defesa: { 'pt-PT': 'Defesa', 'pt-BR': 'Defesa' },
} satisfies Record<string, TextoPorIdioma>;

type Estado = 'jogador' | 'inimigo' | 'vitoria' | 'derrota';

interface Props {
  idioma: Idioma;
  ficha: FichaPersonagem;
  inimigo: Inimigo;
  /** Chamado ao vencer, com a vida e as poções que sobraram. */
  aoVencer: (vida: number, pocoes: number) => void;
}

function Barra({ vida, maxima }: { vida: number; maxima: number }) {
  return (
    <div className="barra-vida" aria-label={`${vida}/${maxima}`}>
      <div className="barra-vida-cheia" style={{ width: `${(vida / maxima) * 100}%` }} />
      <span>
        ❤️ {vida}/{maxima}
      </span>
    </div>
  );
}

/** Luta por turnos: cada ataque é um d20 (+ atributo) contra a defesa do outro. */
export function Luta({ idioma, ficha, inimigo, aoVencer }: Props) {
  const dado = usarDado();
  const [vidaHeroi, setVidaHeroi] = useState(ficha.pontosDeVida);
  const [vidaInimigo, setVidaInimigo] = useState(inimigo.pontosDeVida);
  const [pocoes, setPocoes] = useState(ficha.pocoes);
  const [estado, setEstado] = useState<Estado>('jogador');
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState(t(TEXTOS.seuTurno, idioma));

  const nomeInimigo = t(inimigo.nome, idioma);
  const defesaHeroi = 10 + ficha.atributos.agilidade;

  async function atacar() {
    if (ocupado || estado !== 'jogador') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + ficha.atributos.forca;
    const critico = d20 === 20;
    if (d20 !== 1 && (critico || total >= inimigo.defesa)) {
      const d6 = await dado.rolar(6);
      const dano = (d6 + Math.floor(ficha.atributos.forca / 2)) * (critico ? 2 : 1);
      const nova = Math.max(0, vidaInimigo - dano);
      setVidaInimigo(nova);
      somAcerto();
      setMensagem(preencher(t(critico ? TEXTOS.critico : TEXTOS.acertou, idioma), { total, dano }));
      setEstado(nova === 0 ? 'vitoria' : 'inimigo');
    } else {
      somTentarDeNovo();
      setMensagem(preencher(t(TEXTOS.errou, idioma), { total }));
      setEstado('inimigo');
    }
    setOcupado(false);
  }

  async function beberPocao() {
    if (ocupado || estado !== 'jogador' || pocoes <= 0) return;
    setOcupado(true);
    const d6 = await dado.rolar(6);
    const cura = Math.min(d6 + 3, ficha.pontosDeVidaMaximos - vidaHeroi);
    setVidaHeroi(vidaHeroi + cura);
    setPocoes(pocoes - 1);
    somAcerto();
    setMensagem(preencher(t(TEXTOS.curou, idioma), { cura }));
    setEstado('inimigo');
    setOcupado(false);
  }

  async function turnoInimigo() {
    if (ocupado || estado !== 'inimigo') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + inimigo.bonusAtaque;
    const valores = { inimigo: nomeInimigo, total };
    if (d20 !== 1 && (d20 === 20 || total >= defesaHeroi)) {
      const dano = await dado.rolar(inimigo.dadoDeDano);
      const nova = Math.max(0, vidaHeroi - dano);
      setVidaHeroi(nova);
      somTentarDeNovo();
      setMensagem(preencher(t(TEXTOS.inimigoAcertou, idioma), { ...valores, dano }));
      setEstado(nova === 0 ? 'derrota' : 'jogador');
    } else {
      somAcerto();
      setMensagem(preencher(t(TEXTOS.inimigoErrou, idioma), valores));
      setEstado('jogador');
    }
    setOcupado(false);
  }

  /** Sem punição dura: o herói descansa e a luta recomeça. */
  function recomecar() {
    setVidaHeroi(ficha.pontosDeVidaMaximos);
    setVidaInimigo(inimigo.pontosDeVida);
    setPocoes(ficha.pocoes);
    setEstado('jogador');
    setMensagem(t(TEXTOS.seuTurno, idioma));
  }

  return (
    <div className="luta">
      <div className="combatentes">
        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            {ficha.avatar}
          </span>
          <strong>{ficha.nome}</strong>
          <Barra vida={vidaHeroi} maxima={ficha.pontosDeVidaMaximos} />
          <small>
            🛡️ {t(TEXTOS.defesa, idioma)} {defesaHeroi}
          </small>
        </div>

        <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />

        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            {inimigo.emoji}
          </span>
          <strong>{nomeInimigo}</strong>
          <Barra vida={vidaInimigo} maxima={inimigo.pontosDeVida} />
          <small>
            🛡️ {t(TEXTOS.defesa, idioma)} {inimigo.defesa}
          </small>
        </div>
      </div>

      <p className="mensagem mensagem-luta">{mensagem}</p>

      <div className="acoes">
        {estado === 'jogador' && (
          <>
            <button className="botao" onClick={atacar} disabled={ocupado}>
              {t(TEXTOS.atacar, idioma)}
            </button>
            <button
              className="botao botao-secundario"
              onClick={beberPocao}
              disabled={ocupado || pocoes <= 0 || vidaHeroi >= ficha.pontosDeVidaMaximos}
            >
              {t(TEXTOS.pocao, idioma)} ({pocoes})
            </button>
          </>
        )}
        {estado === 'inimigo' && (
          <button className="botao" onClick={turnoInimigo} disabled={ocupado}>
            {preencher(t(TEXTOS.vezInimigo, idioma), { inimigo: nomeInimigo })} 🎲
          </button>
        )}
        {estado === 'vitoria' && (
          <button className="botao" onClick={() => aoVencer(vidaHeroi, pocoes)}>
            {t(TEXTOS.venceu, idioma)} {t(TEXTOS.continuar, idioma)}
          </button>
        )}
        {estado === 'derrota' && (
          <button className="botao" onClick={recomecar}>
            {t(TEXTOS.perdeu, idioma)} {t(TEXTOS.tentarOutraVez, idioma)}
          </button>
        )}
      </div>
    </div>
  );
}
