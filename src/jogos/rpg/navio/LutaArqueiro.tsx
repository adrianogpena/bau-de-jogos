import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import { Icone, comIcones } from '../../../compartilhado/icones';
import { FiguraPersonagem } from '../FiguraPersonagem';
import { Barra } from '../Luta';
import { personagemPorId } from '../personagem';
import { defesaArqueiro } from './historia';
import type { FichaArqueiro, InimigoNavio } from './tipos';

const BONUS_LONGE = 2;
const PENALIDADE_PERTO = 2;
const CD_RECUAR = 10;

const TEXTOS = {
  defesa: { 'pt-PT': 'Defesa', 'pt-BR': 'Defesa' },
  longe: { 'pt-PT': '🏹 Longe: +2 para acertar', 'pt-BR': '🏹 Longe: +2 para acertar' },
  perto: { 'pt-PT': '⚠️ Perto: −2 para acertar', 'pt-BR': '⚠️ Perto: −2 para acertar' },
  apareceu: { 'pt-PT': '{inimigo} apareceu!', 'pt-BR': '{inimigo} apareceu!' },
  proximaAcao: { 'pt-PT': 'O que vais fazer agora?', 'pt-BR': 'O que você vai fazer agora?' },
  atirar: { 'pt-PT': '🏹 Atirar uma flecha', 'pt-BR': '🏹 Atirar uma flecha' },
  fogo: { 'pt-PT': '🔥 Flecha de fogo', 'pt-BR': '🔥 Flecha de fogo' },
  faca: { 'pt-PT': '🔪 Atacar com a faca', 'pt-BR': '🔪 Atacar com a faca' },
  recuar: { 'pt-PT': '🏃 Recuar', 'pt-BR': '🏃 Recuar' },
  aproximar: { 'pt-PT': '👣 Aproximar-se', 'pt-BR': '👣 Aproximar-se' },
  semFlechas: {
    'pt-PT': 'Não tens flechas! Aproxima-te e usa a faca.',
    'pt-BR': 'Você não tem flechas! Aproxime-se e use a faca.',
  },
  vezInimigo: { 'pt-PT': 'Vez de {inimigo}', 'pt-BR': 'Vez de {inimigo}' },
  acertou: {
    'pt-PT': 'Tiraste {total} contra a defesa {ca} e acertaste! Causaste {dano} de dano.',
    'pt-BR': 'Você tirou {total} contra a defesa {ca} e acertou! Causou {dano} de dano.',
  },
  critico: {
    'pt-PT': '⭐ Golpe crítico! Tiraste 20 e o dano é a dobrar: {dano}!',
    'pt-BR': '⭐ Golpe crítico! Você tirou 20 e o dano é em dobro: {dano}!',
  },
  errou: {
    'pt-PT': 'Tiraste {total} contra a defesa {ca} e falhaste o golpe.',
    'pt-BR': 'Você tirou {total} contra a defesa {ca} e errou o golpe.',
  },
  recuou: {
    'pt-PT': 'Tiraste {total} e saltaste para trás! Agora estás longe, sem apanhar.',
    'pt-BR': 'Você tirou {total} e pulou para trás! Agora está longe, sem apanhar.',
  },
  naoRecuou: {
    'pt-PT': 'Tiraste {total} e não conseguiste recuar. O inimigo ainda está perto!',
    'pt-BR': 'Você tirou {total} e não conseguiu recuar. O inimigo ainda está perto!',
  },
  aproximou: {
    'pt-PT': 'Avanças devagar, até ficares perto.',
    'pt-BR': 'Você avança devagar, até ficar perto.',
  },
  inimigoAcertou: {
    'pt-PT': '{inimigo} tirou {total} contra a tua defesa {ca} e acertou-te! Perdeste {dano} de vida.',
    'pt-BR': '{inimigo} tirou {total} contra sua defesa {ca} e acertou você! Você perdeu {dano} de vida.',
  },
  inimigoCritico: {
    'pt-PT': '💥 {inimigo} tirou 20: golpe crítico! Acertou-te sempre e perdeste {dano} de vida.',
    'pt-BR': '💥 {inimigo} tirou 20: golpe crítico! Acertou você sempre e você perdeu {dano} de vida.',
  },
  inimigoErrou: {
    'pt-PT': '{inimigo} tirou {total} contra a tua defesa {ca} e falhou o golpe! 🍀',
    'pt-BR': '{inimigo} tirou {total} contra sua defesa {ca} e errou o golpe! 🍀',
  },
  voou: {
    'pt-PT': 'Mas a gaivota bate as asas e foge para longe!',
    'pt-BR': 'Mas a gaivota bate as asas e foge para longe!',
  },
  venceu: { 'pt-PT': 'Venceste a luta! 🎉 Continuar ➜', 'pt-BR': 'Você venceu a luta! 🎉 Continuar ➜' },
  perdeu: {
    'pt-PT': 'Ficaste sem forças! Descansa um pouco e tenta outra vez. Tentar outra vez',
    'pt-BR': 'Você ficou sem forças! Descanse um pouco e tente de novo. Tentar de novo',
  },
  flechas: { 'pt-PT': 'Flechas', 'pt-BR': 'Flechas' },
} satisfies Record<string, TextoPorIdioma>;

type Estado = 'jogador' | 'inimigo' | 'vitoria' | 'derrota';
type Posicao = 'longe' | 'perto';

interface Props {
  idioma: Idioma;
  ficha: FichaArqueiro;
  inimigo: InimigoNavio;
  posicaoInicial: Posicao;
  /** Somado ao acerto (por exemplo, −2 no escuro). */
  bonusAcerto: number;
  /** Mudança no d20 de Agilidade para recuar (o nível ajusta a dificuldade). */
  dificuldadeRecuar: number;
  /** Tem a flecha de fogo (uma só: d8, gasta ao usar). */
  temFogo: boolean;
  /** Chamado ao vencer, com a vida, as flechas que sobraram e as marcas gastas. */
  aoVencer: (vida: number, flechas: number, gastas: string[]) => void;
}

/**
 * Luta do arqueiro: a distância (longe ou perto) muda o acerto; cada flecha atirada gasta uma da aljava.
 * Atirar: d20 + Pontaria (longe +2, perto −2), dano d6. Faca (só perto): d20 + Agilidade, dano d4.
 * Recuar: d20 + Agilidade contra 10; se passa, volta a ficar longe sem apanhar.
 */
export function LutaArqueiro({ idioma, ficha, inimigo, posicaoInicial, bonusAcerto, dificuldadeRecuar, temFogo, aoVencer }: Props) {
  const dado = usarDado();
  const nomeInimigo = t(inimigo.nome, idioma);
  const personagem = personagemPorId('arqueiro', ficha.personagem);
  const ca = defesaArqueiro(ficha.atributos.agilidade);

  const [vidaHeroi, setVidaHeroi] = useState(ficha.pontosDeVida);
  const [vidaInimigo, setVidaInimigo] = useState(inimigo.pontosDeVida);
  const [flechas, setFlechas] = useState(ficha.flechas);
  const [fogoUsado, setFogoUsado] = useState(false);
  const [posicao, setPosicao] = useState<Posicao>(posicaoInicial);
  const [estado, setEstado] = useState<Estado>('jogador');
  const [ocupado, setOcupado] = useState(false);
  const mensagemInicial = preencher(t(TEXTOS.apareceu, idioma), { inimigo: nomeInimigo });
  const [mensagem, setMensagem] = useState(mensagemInicial);

  const acertoDistancia = posicao === 'longe' ? BONUS_LONGE : -PENALIDADE_PERTO;
  const fogoDisponivel = temFogo && !fogoUsado;
  const semArmaAlcance = flechas === 0 && !fogoDisponivel;

  async function ataque(tipo: 'flecha' | 'fogo' | 'faca') {
    if (ocupado || estado !== 'jogador') return;
    setOcupado(true);
    const bonus =
      tipo === 'faca' ? ficha.atributos.agilidade + bonusAcerto : ficha.atributos.pontaria + acertoDistancia + bonusAcerto;
    if (tipo === 'flecha') setFl(flechas - 1);
    if (tipo === 'fogo') setFogoUsado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + bonus;
    const critico = d20 === 20;
    if (d20 !== 1 && (critico || total >= inimigo.defesa)) {
      const lados = tipo === 'faca' ? 4 : tipo === 'fogo' ? 8 : 6;
      const dano = (await dado.rolar(lados)) * (critico ? 2 : 1);
      const nova = Math.max(0, vidaInimigo - dano);
      setVidaInimigo(nova);
      somAcerto();
      setMensagem(preencher(t(critico ? TEXTOS.critico : TEXTOS.acertou, idioma), { total, ca: inimigo.defesa, dano }));
      setEstado(nova === 0 ? 'vitoria' : 'inimigo');
    } else {
      somTentarDeNovo();
      setMensagem(preencher(t(TEXTOS.errou, idioma), { total, ca: inimigo.defesa }));
      setEstado('inimigo');
    }
    setOcupado(false);
  }

  function setFl(n: number) {
    setFlechas(Math.max(0, n));
  }

  async function recuar() {
    if (ocupado || estado !== 'jogador' || posicao !== 'perto') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + ficha.atributos.agilidade;
    if (total >= CD_RECUAR + dificuldadeRecuar) {
      somAcerto();
      setPosicao('longe');
      setMensagem(preencher(t(TEXTOS.recuou, idioma), { total }));
      // saltou para trás sem apanhar: o inimigo perde a vez
    } else {
      somTentarDeNovo();
      setMensagem(preencher(t(TEXTOS.naoRecuou, idioma), { total }));
      setEstado('inimigo');
    }
    setOcupado(false);
  }

  function aproximar() {
    if (ocupado || estado !== 'jogador' || posicao !== 'longe') return;
    setPosicao('perto');
    setMensagem(t(TEXTOS.aproximou, idioma));
    setEstado('inimigo');
  }

  async function turnoInimigo() {
    if (ocupado || estado !== 'inimigo') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = Math.max(1, d20 + inimigo.bonusAtaque);
    const valores = { inimigo: nomeInimigo, total, ca };
    const critico = d20 === 20;
    let texto: string;
    if (d20 !== 1 && (critico || total >= ca)) {
      const dano = await dado.rolar(inimigo.dadoDeDano);
      const nova = Math.max(0, vidaHeroi - dano);
      setVidaHeroi(nova);
      somTentarDeNovo();
      texto = preencher(t(critico ? TEXTOS.inimigoCritico : TEXTOS.inimigoAcertou, idioma), { ...valores, dano });
      setEstado(nova === 0 ? 'derrota' : 'jogador');
    } else {
      somAcerto();
      texto = preencher(t(TEXTOS.inimigoErrou, idioma), valores);
      setEstado('jogador');
    }
    // a gaivota voa: ao ficar perto, foge e a luta volta a ser de longe
    if (inimigo.voa && posicao === 'perto') {
      setPosicao('longe');
      texto = `${texto} ${t(TEXTOS.voou, idioma)}`;
    }
    setMensagem(texto);
    setOcupado(false);
  }

  /** Sem punição dura: o arqueiro descansa e a luta recomeça. */
  function recomecar() {
    setVidaHeroi(ficha.pontosDeVidaMaximos);
    setVidaInimigo(inimigo.pontosDeVida);
    setFlechas(ficha.flechas);
    setFogoUsado(false);
    setPosicao(posicaoInicial);
    setEstado('jogador');
    setMensagem(mensagemInicial);
  }

  return (
    <div className="luta">
      <div className="combatentes">
        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            <FiguraPersonagem personagem={personagem} classe="combatente-imagem" />
          </span>
          <strong>{personagem.nome}</strong>
          <Barra vida={vidaHeroi} maxima={ficha.pontosDeVidaMaximos} />
          <small>
            <Icone id="interface/escudo" /> {t(TEXTOS.defesa, idioma)} {ca}
          </small>
          <small>
            🏹 {t(TEXTOS.flechas, idioma)}: {flechas}
            {fogoDisponivel ? ' + 🔥' : ''}
          </small>
        </div>

        <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />

        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            {comIcones(inimigo.emoji)}
          </span>
          <strong>{nomeInimigo}</strong>
          <Barra vida={vidaInimigo} maxima={inimigo.pontosDeVida} />
          <small>
            <Icone id="interface/escudo" /> {t(TEXTOS.defesa, idioma)} {inimigo.defesa}
          </small>
        </div>
      </div>

      <p className={`distancia distancia-${posicao}`}>{comIcones(t(posicao === 'longe' ? TEXTOS.longe : TEXTOS.perto, idioma))}</p>

      <TextoNarrado className="mensagem mensagem-luta" idioma={idioma} texto={mensagem} lerAoAbrir={mensagem !== mensagemInicial} />

      {estado === 'jogador' && (
        <>
          <TextoNarrado className="texto-grande" idioma={idioma} texto={t(semArmaAlcance && posicao === 'longe' ? TEXTOS.semFlechas : TEXTOS.proximaAcao, idioma)} />
          <div className="acoes">
            <button className="botao" onClick={() => ataque('flecha')} disabled={ocupado || flechas === 0}>
              {comIcones(t(TEXTOS.atirar, idioma))}
            </button>
            {fogoDisponivel && (
              <button className="botao" onClick={() => ataque('fogo')} disabled={ocupado}>
                {comIcones(t(TEXTOS.fogo, idioma))}
              </button>
            )}
            {posicao === 'perto' && (
              <>
                <button className="botao botao-secundario" onClick={() => ataque('faca')} disabled={ocupado}>
                  {comIcones(t(TEXTOS.faca, idioma))}
                </button>
                <button className="botao botao-secundario" onClick={recuar} disabled={ocupado}>
                  {comIcones(t(TEXTOS.recuar, idioma))}
                </button>
              </>
            )}
            {posicao === 'longe' && semArmaAlcance && (
              <button className="botao botao-secundario" onClick={aproximar} disabled={ocupado}>
                {comIcones(t(TEXTOS.aproximar, idioma))}
              </button>
            )}
          </div>
        </>
      )}

      <div className="acoes">
        {estado === 'inimigo' && (
          <button className="botao" onClick={turnoInimigo} disabled={ocupado}>
            {preencher(t(TEXTOS.vezInimigo, idioma), { inimigo: nomeInimigo })} <Icone id="interface/dado" />
          </button>
        )}
        {estado === 'vitoria' && (
          <button className="botao" onClick={() => aoVencer(vidaHeroi, flechas, fogoUsado ? ['flecha-fogo'] : [])}>
            {comIcones(t(TEXTOS.venceu, idioma))}
          </button>
        )}
        {estado === 'derrota' && (
          <button className="botao" onClick={recomecar}>
            {comIcones(t(TEXTOS.perdeu, idioma))}
          </button>
        )}
      </div>
    </div>
  );
}
