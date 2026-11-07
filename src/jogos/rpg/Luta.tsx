import { FiguraPersonagem } from './FiguraPersonagem';
import { personagemPorId } from './personagem';
import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import type { FichaPersonagem, Inimigo } from './tipos';
import { BONUS_ESCUDO, ITENS, estatisticas } from './itens';
import { Icone, comIcones } from '../../compartilhado/icones';

const TEXTOS = {
  apareceu: { 'pt-PT': '{inimigo} apareceu!', 'pt-BR': '{inimigo} apareceu!' },
  proximaAcao: { 'pt-PT': 'O que vais fazer agora?', 'pt-BR': 'O que você vai fazer agora?' },
  golpear: { 'pt-PT': '⚔️ Golpear', 'pt-BR': '⚔️ Golpear' },
  pocao: { 'pt-PT': '🧪 Usar poção', 'pt-BR': '🧪 Usar poção' },
  escudo: { 'pt-PT': '🛡️ Levantar o escudo (ação bónus)', 'pt-BR': '🛡️ Levantar o escudo (ação bônus)' },
  escudoFeito: { 'pt-PT': 'Escudo levantado ✔️', 'pt-BR': 'Escudo levantado ✔️' },
  escolhePocao: { 'pt-PT': 'Qual poção queres usar?', 'pt-BR': 'Qual poção você quer usar?' },
  semPocoes: { 'pt-PT': 'Não tens poções.', 'pt-BR': 'Você não tem poções.' },
  voltarMenu: { 'pt-PT': '← Voltar', 'pt-BR': '← Voltar' },
  vezInimigo: { 'pt-PT': 'Vez de {inimigo}', 'pt-BR': 'Vez de {inimigo}' },
  acertou: {
    'pt-PT': 'Tiraste {total} contra CA {ca} e acertaste! Causaste {dano} de dano.',
    'pt-BR': 'Você tirou {total} contra CA {ca} e acertou! Causou {dano} de dano.',
  },
  critico: {
    'pt-PT': '⭐ Golpe crítico! Tiraste 20 e o dano é a dobrar: {dano}!',
    'pt-BR': '⭐ Golpe crítico! Você tirou 20 e o dano é em dobro: {dano}!',
  },
  errou: {
    'pt-PT': 'Tiraste {total} contra CA {ca} e falhaste o golpe.',
    'pt-BR': 'Você tirou {total} contra CA {ca} e errou o golpe.',
  },
  inimigoAcertou: {
    'pt-PT': '{inimigo} tirou {total} contra a tua CA {ca} e acertou-te! Perdeste {dano} de vida.',
    'pt-BR': '{inimigo} tirou {total} contra sua CA {ca} e acertou você! Você perdeu {dano} de vida.',
  },
  inimigoCritico: {
    'pt-PT': '💥 {inimigo} tirou 20: golpe crítico! Acertou-te sempre e perdeste {dano} de vida.',
    'pt-BR': '💥 {inimigo} tirou 20: golpe crítico! Acertou você sempre e você perdeu {dano} de vida.',
  },
  inimigoErrou: {
    'pt-PT': '{inimigo} tirou {total} contra a tua CA {ca} e falhou o golpe! 🍀',
    'pt-BR': '{inimigo} tirou {total} contra sua CA {ca} e errou o golpe! 🍀',
  },
  curou: {
    'pt-PT': 'Bebeste a poção e recuperaste {cura} de vida! 💖',
    'pt-BR': 'Você bebeu a poção e recuperou {cura} de vida! 💖',
  },
  pontaria: {
    'pt-PT': 'Bebeste a poção! Agora acertas mais: +{valor} para acertar até ao fim da luta. 🎯',
    'pt-BR': 'Você bebeu a poção! Agora acerta mais: +{valor} para acertar até o fim da luta. 🎯',
  },
  forca: {
    'pt-PT': 'Bebeste a poção! Agora bates mais forte: +{valor} de dano até ao fim da luta. 💥',
    'pt-BR': 'Você bebeu a poção! Agora bate mais forte: +{valor} de dano até o fim da luta. 💥',
  },
  escudoSubiu: {
    'pt-PT': 'Levantaste o escudo! A tua CA sobe +{valor} no próximo ataque. Ainda podes agir.',
    'pt-BR': 'Você levantou o escudo! Sua CA sobe +{valor} no próximo ataque. Você ainda pode agir.',
  },
  venceu: { 'pt-PT': 'Venceste a luta! 🎉', 'pt-BR': 'Você venceu a luta! 🎉' },
  perdeu: {
    'pt-PT': 'Ficaste sem forças! Descansa um pouco e tenta outra vez.',
    'pt-BR': 'Você ficou sem forças! Descanse um pouco e tente de novo.',
  },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  tentarOutraVez: { 'pt-PT': 'Tentar outra vez', 'pt-BR': 'Tentar de novo' },
  ataque: { 'pt-PT': 'Ataque', 'pt-BR': 'Ataque' },
  dano: { 'pt-PT': 'Dano', 'pt-BR': 'Dano' },
} satisfies Record<string, TextoPorIdioma>;

type Estado = 'jogador' | 'inimigo' | 'vitoria' | 'derrota';
type Menu = 'principal' | 'pocoes';

interface Props {
  idioma: Idioma;
  ficha: FichaPersonagem;
  inimigo: Inimigo;
  /** Chamado ao vencer, com a vida e as poções que sobraram. */
  aoVencer: (vida: number, pocoes: Record<string, number>) => void;
}

export function Barra({
  vida,
  maxima,
  emoji = '❤️',
  classe = '',
}: {
  vida: number;
  maxima: number;
  emoji?: string;
  classe?: string;
}) {
  return (
    <div className={`barra-vida ${classe}`} aria-label={`${vida}/${maxima}`}>
      <div className="barra-vida-cheia" style={{ width: `${(vida / maxima) * 100}%` }} />
      <span>
        {comIcones(emoji)} {vida}/{maxima}
      </span>
    </div>
  );
}

/** Dados que o combatente vai usar, ainda sem rolar. */
function DadosDoCombatente({ idioma, ataque, dano }: { idioma: Idioma; ataque: string; dano: string }) {
  return (
    <div className="dados-combatente">
      <span className="dado-mini">
        <Icone id="interface/dado" /> {t(TEXTOS.ataque, idioma)}: <b>{ataque}</b>
      </span>
      <span className="dado-mini">
        <Icone id="interface/dado" /> {t(TEXTOS.dano, idioma)}: <b>{dano}</b>
      </span>
    </div>
  );
}

/** Luta por turnos: cada ataque é um d20 (+ bônus) contra a CA (classe de armadura) do outro. */
export function Luta({ idioma, ficha, inimigo, aoVencer }: Props) {
  const dado = usarDado();
  const est = estatisticas(ficha);
  const nomeInimigo = t(inimigo.nome, idioma);

  const [vidaHeroi, setVidaHeroi] = useState(ficha.pontosDeVida);
  const [vidaInimigo, setVidaInimigo] = useState(inimigo.pontosDeVida);
  const [pocoes, setPocoes] = useState(ficha.pocoes);
  const [estado, setEstado] = useState<Estado>('jogador');
  const [menu, setMenu] = useState<Menu>('principal');
  const [ocupado, setOcupado] = useState(false);
  const [escudoAtivo, setEscudoAtivo] = useState(false);
  const [acaoBonusUsada, setAcaoBonusUsada] = useState(false);
  const [bonusAtaquePocao, setBonusAtaquePocao] = useState(0);
  const [bonusDanoPocao, setBonusDanoPocao] = useState(0);
  const [mensagem, setMensagem] = useState(preencher(t(TEXTOS.apareceu, idioma), { inimigo: nomeInimigo }));

  const caHeroi = est.ca + (escudoAtivo ? BONUS_ESCUDO : 0);
  const ataqueHeroi = est.bonusAtaque + bonusAtaquePocao;
  const danoHeroi = est.bonusDano + bonusDanoPocao;
  const pocoesDisponiveis = Object.values(ITENS).filter((i) => i.tipo === 'pocao' && (pocoes[i.id] ?? 0) > 0);

  function fimDoTurnoDoHeroi() {
    setMenu('principal');
    setEstado('inimigo');
  }

  async function golpear() {
    if (ocupado || estado !== 'jogador') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + ataqueHeroi;
    const critico = d20 === 20;
    if (d20 !== 1 && (critico || total >= inimigo.defesa)) {
      const d6 = await dado.rolar(6);
      const dano = (d6 + danoHeroi) * (critico ? 2 : 1);
      const nova = Math.max(0, vidaInimigo - dano);
      setVidaInimigo(nova);
      somAcerto();
      setMensagem(
        preencher(t(critico ? TEXTOS.critico : TEXTOS.acertou, idioma), { total, ca: inimigo.defesa, dano }),
      );
      if (nova === 0) setEstado('vitoria');
      else fimDoTurnoDoHeroi();
    } else {
      somTentarDeNovo();
      setMensagem(preencher(t(TEXTOS.errou, idioma), { total, ca: inimigo.defesa }));
      fimDoTurnoDoHeroi();
    }
    setOcupado(false);
  }

  /** Ação bônus: não gasta o turno. */
  function levantarEscudo() {
    if (ocupado || estado !== 'jogador' || !ficha.escudo || acaoBonusUsada) return;
    setEscudoAtivo(true);
    setAcaoBonusUsada(true);
    somAcerto();
    setMensagem(preencher(t(TEXTOS.escudoSubiu, idioma), { valor: BONUS_ESCUDO }));
  }

  async function usarPocao(id: string) {
    const item = ITENS[id];
    if (ocupado || estado !== 'jogador' || (pocoes[id] ?? 0) <= 0) return;
    setOcupado(true);
    const valor = item.valor ?? 0;
    if (item.efeito === 'cura') {
      const d6 = await dado.rolar(6);
      const cura = Math.min(d6 + valor, ficha.pontosDeVidaMaximos - vidaHeroi);
      setVidaHeroi(vidaHeroi + cura);
      setMensagem(preencher(t(TEXTOS.curou, idioma), { cura }));
    } else if (item.efeito === 'precisao') {
      setBonusAtaquePocao(valor);
      setMensagem(preencher(t(TEXTOS.pontaria, idioma), { valor }));
    } else if (item.efeito === 'forca') {
      setBonusDanoPocao(valor);
      setMensagem(preencher(t(TEXTOS.forca, idioma), { valor }));
    }
    setPocoes({ ...pocoes, [id]: pocoes[id] - 1 });
    somAcerto();
    fimDoTurnoDoHeroi();
    setOcupado(false);
  }

  function pocaoInutil(id: string): boolean {
    const item = ITENS[id];
    if (item.efeito === 'cura') return vidaHeroi >= ficha.pontosDeVidaMaximos;
    if (item.efeito === 'precisao') return bonusAtaquePocao > 0;
    return bonusDanoPocao > 0;
  }

  async function turnoInimigo() {
    if (ocupado || estado !== 'inimigo') return;
    setOcupado(true);
    const d20 = await dado.rolar(20);
    const total = d20 + inimigo.bonusAtaque;
    const valores = { inimigo: nomeInimigo, total, ca: caHeroi };
    const critico = d20 === 20;
    if (d20 !== 1 && (critico || total >= caHeroi)) {
      const dano = await dado.rolar(inimigo.dadoDeDano);
      const nova = Math.max(0, vidaHeroi - dano);
      setVidaHeroi(nova);
      somTentarDeNovo();
      setMensagem(
        preencher(t(critico ? TEXTOS.inimigoCritico : TEXTOS.inimigoAcertou, idioma), { ...valores, dano }),
      );
      setEstado(nova === 0 ? 'derrota' : 'jogador');
    } else {
      somAcerto();
      setMensagem(preencher(t(TEXTOS.inimigoErrou, idioma), valores));
      setEstado('jogador');
    }
    // o escudo vale só para este ataque e a ação bônus volta no próximo turno
    setEscudoAtivo(false);
    setAcaoBonusUsada(false);
    setOcupado(false);
  }

  /** Sem punição dura: o herói descansa e a luta recomeça. */
  function recomecar() {
    setVidaHeroi(ficha.pontosDeVidaMaximos);
    setVidaInimigo(inimigo.pontosDeVida);
    setPocoes(ficha.pocoes);
    setEstado('jogador');
    setMenu('principal');
    setEscudoAtivo(false);
    setAcaoBonusUsada(false);
    setBonusAtaquePocao(0);
    setBonusDanoPocao(0);
    setMensagem(preencher(t(TEXTOS.apareceu, idioma), { inimigo: nomeInimigo }));
  }

  return (
    <div className="luta">
      <div className="combatentes">
        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            <FiguraPersonagem personagem={personagemPorId('heroi', ficha.personagem)} classe="combatente-imagem" />
          </span>
          <strong>{personagemPorId('heroi', ficha.personagem).nome}</strong>
          <Barra vida={vidaHeroi} maxima={ficha.pontosDeVidaMaximos} />
          <small>
            <Icone id="interface/escudo" /> CA {caHeroi}
            {escudoAtivo ? ` (+${BONUS_ESCUDO})` : ''}
          </small>
          <DadosDoCombatente idioma={idioma} ataque={`d20+${ataqueHeroi}`} dano={`d6+${danoHeroi}`} />
        </div>

        <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />

        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            {comIcones(inimigo.emoji)}
          </span>
          <strong>{nomeInimigo}</strong>
          <Barra vida={vidaInimigo} maxima={inimigo.pontosDeVida} />
          <small><Icone id="interface/escudo" /> CA {inimigo.defesa}</small>
          <DadosDoCombatente
            idioma={idioma}
            ataque={`d20+${inimigo.bonusAtaque}`}
            dano={`d${inimigo.dadoDeDano}`}
          />
        </div>
      </div>

      <TextoNarrado className="mensagem mensagem-luta" idioma={idioma} texto={mensagem} />

      {estado === 'jogador' && menu === 'principal' && (
        <>
          <TextoNarrado className="texto-grande" idioma={idioma} texto={t(TEXTOS.proximaAcao, idioma)} />
          <div className="acoes">
            <button className="botao" onClick={golpear} disabled={ocupado}>
              {comIcones(t(TEXTOS.golpear, idioma))}
            </button>
            <button className="botao" onClick={() => setMenu('pocoes')} disabled={ocupado}>
              {comIcones(t(TEXTOS.pocao, idioma))}
            </button>
            {ficha.escudo && (
              <button
                className="botao botao-secundario"
                onClick={levantarEscudo}
                disabled={ocupado || acaoBonusUsada}
              >
                {comIcones(acaoBonusUsada ? t(TEXTOS.escudoFeito, idioma) : t(TEXTOS.escudo, idioma))}
              </button>
            )}
          </div>
        </>
      )}

      {estado === 'jogador' && menu === 'pocoes' && (
        <>
          <p className="texto-grande">
            {t(pocoesDisponiveis.length > 0 ? TEXTOS.escolhePocao : TEXTOS.semPocoes, idioma)}
          </p>
          <div className="acoes">
            {pocoesDisponiveis.map((item) => (
              <button
                key={item.id}
                className="botao"
                onClick={() => usarPocao(item.id)}
                disabled={ocupado || pocaoInutil(item.id)}
              >
                {comIcones(item.emoji)} {item.nome[idioma]} ({pocoes[item.id]})
              </button>
            ))}
            <button className="botao botao-secundario" onClick={() => setMenu('principal')}>
              {comIcones(t(TEXTOS.voltarMenu, idioma))}
            </button>
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
          <button className="botao" onClick={() => aoVencer(vidaHeroi, pocoes)}>
            {comIcones(t(TEXTOS.venceu, idioma))} {comIcones(t(TEXTOS.continuar, idioma))}
          </button>
        )}
        {estado === 'derrota' && (
          <button className="botao" onClick={recomecar}>
            {comIcones(t(TEXTOS.perdeu, idioma))} {t(TEXTOS.tentarOutraVez, idioma)}
          </button>
        )}
      </div>
    </div>
  );
}
