import { tituloPersonagem } from '../personagem';
import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import { Barra } from '../Luta';
import type { FichaMago, Feitico, InimigoMago } from './tipos';
import { ENERGIA_CONTA_CERTA, ENERGIA_CONTA_ERRADA, FEITICOS } from './feiticos';
import { Icone, comIcones } from '../../../compartilhado/icones';

/** CA do mago: roupas leves de mago não protegem muito. */
export const CA_MAGO = 11;

const TEXTOS = {
  apareceu: { 'pt-PT': '{inimigo} apareceu!', 'pt-BR': '{inimigo} apareceu!' },
  proximaAcao: { 'pt-PT': 'O que vais fazer agora?', 'pt-BR': 'O que você vai fazer agora?' },
  lancar: { 'pt-PT': '🔮 Lançar um feitiço', 'pt-BR': '🔮 Lançar um feitiço' },
  concentrar: {
    'pt-PT': '🧘 Concentrar (conta de matemática)',
    'pt-BR': '🧘 Se concentrar (conta de matemática)',
  },
  contaTitulo: {
    'pt-PT': 'Resolve a conta para recuperar energia!',
    'pt-BR': 'Resolva a conta para recuperar energia!',
  },
  contaAjuda: {
    'pt-PT': 'Certo: +2 de energia. Errado: +1.',
    'pt-BR': 'Acertou: +2 de energia. Errou: +1.',
  },
  apagar: { 'pt-PT': 'Apagar', 'pt-BR': 'Apagar' },
  confirmar: { 'pt-PT': 'Confirmar ✔️', 'pt-BR': 'Confirmar ✔️' },
  escolheFeitico: { 'pt-PT': 'Qual feitiço queres lançar?', 'pt-BR': 'Qual feitiço você quer lançar?' },
  voltarMenu: { 'pt-PT': '← Voltar', 'pt-BR': '← Voltar' },
  gratis: { 'pt-PT': 'grátis', 'pt-BR': 'grátis' },
  vezInimigo: { 'pt-PT': 'Vez de {inimigo}', 'pt-BR': 'Vez de {inimigo}' },
  acertou: {
    'pt-PT': '{feitico}! Tiraste {total} contra CA {ca} e acertaste! Causaste {dano} de dano.',
    'pt-BR': '{feitico}! Você tirou {total} contra CA {ca} e acertou! Causou {dano} de dano.',
  },
  critico: {
    'pt-PT': '⭐ {feitico}! Tiraste 20: golpe crítico! O dano é a dobrar: {dano}!',
    'pt-BR': '⭐ {feitico}! Você tirou 20: golpe crítico! O dano é em dobro: {dano}!',
  },
  errou: {
    'pt-PT': '{feitico}! Tiraste {total} contra CA {ca} e a magia falhou o alvo.',
    'pt-BR': '{feitico}! Você tirou {total} contra CA {ca} e a magia errou o alvo.',
  },
  certeiro: {
    'pt-PT': '{feitico}! A magia nunca falha e causa {dano} de dano.',
    'pt-BR': '{feitico}! A magia nunca erra e causa {dano} de dano.',
  },
  preso: {
    'pt-PT': '{feitico}! Causa {dano} de dano e {inimigo} não consegue mexer-se: perde a vez!',
    'pt-BR': '{feitico}! Causa {dano} de dano e {inimigo} não consegue se mexer: perde a vez!',
  },
  protegido: {
    'pt-PT': '{feitico}! A tua CA sobe +{valor} no próximo ataque.',
    'pt-BR': '{feitico}! Sua CA sobe +{valor} no próximo ataque.',
  },
  curou: {
    'pt-PT': '{feitico}! Recuperaste {cura} de vida! 💖',
    'pt-BR': '{feitico}! Você recuperou {cura} de vida! 💖',
  },
  concentrouCerto: {
    'pt-PT': '{conta} = {resposta}. Certo! Recuperaste {n} de energia mágica. 🔮',
    'pt-BR': '{conta} = {resposta}. Certo! Você recuperou {n} de energia mágica. 🔮',
  },
  concentrouErrado: {
    'pt-PT': '{conta} = {resposta}. Quase! Recuperaste {n} de energia mágica. 🔮',
    'pt-BR': '{conta} = {resposta}. Quase! Você recuperou {n} de energia mágica. 🔮',
  },
  inimigoPresoPerde: {
    'pt-PT': '{inimigo} continua preso pela magia e perde a vez!',
    'pt-BR': '{inimigo} continua preso pela magia e perde a vez!',
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
  venceu: { 'pt-PT': 'Venceste a luta! 🎉', 'pt-BR': 'Você venceu a luta! 🎉' },
  perdeu: {
    'pt-PT': 'Ficaste sem forças! Descansa um pouco e tenta outra vez.',
    'pt-BR': 'Você ficou sem forças! Descanse um pouco e tente de novo.',
  },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  tentarOutraVez: { 'pt-PT': 'Tentar outra vez', 'pt-BR': 'Tentar de novo' },
} satisfies Record<string, TextoPorIdioma>;

/** Conta de somar para se concentrar: cada número vai de 10 a 50. */
function novaConta() {
  const numero = () => 10 + Math.floor(Math.random() * 41);
  return { a: numero(), b: numero() };
}

type Estado = 'jogador' | 'inimigo' | 'vitoria' | 'derrota';

interface Props {
  idioma: Idioma;
  ficha: FichaMago;
  inimigo: InimigoMago;
  /** Chamado ao vencer, com a vida e a energia que sobraram. */
  aoVencer: (vida: number, energia: number) => void;
}

/** Luta por turnos em que o mago lança feitiços (gastando energia mágica). */
export function LutaMagica({ idioma, ficha, inimigo, aoVencer }: Props) {
  const dado = usarDado();
  const nomeInimigo = t(inimigo.nome, idioma);
  const poder = ficha.habilidades.poder;
  const bonusDanoPoder = Math.floor(poder / 2);

  const [vidaHeroi, setVidaHeroi] = useState(ficha.pontosDeVida);
  const [energia, setEnergia] = useState(ficha.energia);
  const [vidaInimigo, setVidaInimigo] = useState(inimigo.pontosDeVida);
  const [estado, setEstado] = useState<Estado>('jogador');
  const [menuFeiticos, setMenuFeiticos] = useState(false);
  const [conta, setConta] = useState<{ a: number; b: number } | null>(null);
  const [digitos, setDigitos] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [bonusCA, setBonusCA] = useState(0);
  const [inimigoPreso, setInimigoPreso] = useState(false);
  const [mensagem, setMensagem] = useState(preencher(t(TEXTOS.apareceu, idioma), { inimigo: nomeInimigo }));

  const caHeroi = CA_MAGO + bonusCA;
  const feiticos = ficha.feiticos.map((id) => FEITICOS[id]);

  function fimDoTurnoDoHeroi(novaVidaInimigo = vidaInimigo) {
    setMenuFeiticos(false);
    setEstado(novaVidaInimigo === 0 ? 'vitoria' : 'inimigo');
  }

  function causarDano(dano: number): number {
    const nova = Math.max(0, vidaInimigo - dano);
    setVidaInimigo(nova);
    return nova;
  }

  async function lancar(f: Feitico) {
    if (ocupado || estado !== 'jogador' || energia < f.custo) return;
    setOcupado(true);
    setEnergia(energia - f.custo);
    const feitico = `${f.emoji} ${t(f.nome, idioma)}`;

    if (f.tipo === 'ataque') {
      const d20 = await dado.rolar(20);
      const total = d20 + poder + (f.bonusAcerto ?? 0);
      const critico = d20 === 20;
      if (d20 !== 1 && (critico || total >= inimigo.defesa)) {
        const rolado = await dado.rolar(f.dado ?? 6);
        const dano = (rolado + bonusDanoPoder + (f.bonusDano ?? 0)) * (critico ? 2 : 1);
        const nova = causarDano(dano);
        somAcerto();
        setMensagem(
          preencher(t(critico ? TEXTOS.critico : TEXTOS.acertou, idioma), {
            feitico,
            total,
            ca: inimigo.defesa,
            dano,
          }),
        );
        fimDoTurnoDoHeroi(nova);
      } else {
        somTentarDeNovo();
        setMensagem(preencher(t(TEXTOS.errou, idioma), { feitico, total, ca: inimigo.defesa }));
        fimDoTurnoDoHeroi();
      }
    } else if (f.tipo === 'certeiro' || f.tipo === 'atordoar') {
      const rolado = await dado.rolar(f.dado ?? 6);
      const dano = rolado + (f.tipo === 'certeiro' ? bonusDanoPoder + (f.bonusDano ?? 0) : 0);
      const nova = causarDano(dano);
      somAcerto();
      if (f.tipo === 'atordoar' && nova > 0) {
        setInimigoPreso(true);
        setMensagem(preencher(t(TEXTOS.preso, idioma), { feitico, dano, inimigo: nomeInimigo }));
      } else {
        setMensagem(preencher(t(TEXTOS.certeiro, idioma), { feitico, dano }));
      }
      fimDoTurnoDoHeroi(nova);
    } else if (f.tipo === 'protecao') {
      const valor = f.bonusExtra ?? 0;
      setBonusCA(valor);
      somAcerto();
      setMensagem(preencher(t(TEXTOS.protegido, idioma), { feitico, valor }));
      fimDoTurnoDoHeroi();
    } else {
      const rolado = await dado.rolar(f.dado ?? 6);
      const cura = Math.min(rolado + (f.bonusExtra ?? 0), ficha.pontosDeVidaMaximos - vidaHeroi);
      setVidaHeroi(vidaHeroi + cura);
      somAcerto();
      setMensagem(preencher(t(TEXTOS.curou, idioma), { feitico, cura }));
      fimDoTurnoDoHeroi();
    }
    setOcupado(false);
  }

  function abrirConta() {
    if (ocupado || estado !== 'jogador') return;
    setConta(novaConta());
    setDigitos('');
  }

  /** Acertou a conta: +2 de energia. Errou: +1. */
  function concentrar() {
    if (!conta || digitos === '' || ocupado || estado !== 'jogador') return;
    const certo = Number(digitos) === conta.a + conta.b;
    const alvo = certo ? ENERGIA_CONTA_CERTA : ENERGIA_CONTA_ERRADA;
    const ganho = Math.min(alvo, ficha.energiaMaxima - energia);
    setEnergia(energia + ganho);
    (certo ? somAcerto : somTentarDeNovo)();
    setMensagem(
      preencher(t(certo ? TEXTOS.concentrouCerto : TEXTOS.concentrouErrado, idioma), {
        conta: `${conta.a} + ${conta.b}`,
        resposta: conta.a + conta.b,
        n: ganho,
      }),
    );
    setConta(null);
    fimDoTurnoDoHeroi();
  }

  async function turnoInimigo() {
    if (ocupado || estado !== 'inimigo') return;
    if (inimigoPreso) {
      setInimigoPreso(false);
      setMensagem(preencher(t(TEXTOS.inimigoPresoPerde, idioma), { inimigo: nomeInimigo }));
      setEstado('jogador');
      return;
    }
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
    // a proteção vale só para este ataque
    setBonusCA(0);
    setOcupado(false);
  }

  /** Sem punição dura: o mago descansa e a luta recomeça. */
  function recomecar() {
    setVidaHeroi(ficha.pontosDeVidaMaximos);
    setEnergia(ficha.energiaMaxima);
    setVidaInimigo(inimigo.pontosDeVida);
    setEstado('jogador');
    setMenuFeiticos(false);
    setConta(null);
    setBonusCA(0);
    setInimigoPreso(false);
    setMensagem(preencher(t(TEXTOS.apareceu, idioma), { inimigo: nomeInimigo }));
  }

  return (
    <div className="luta">
      <div className="combatentes">
        <div className="combatente">
          <span className="combatente-emoji" aria-hidden="true">
            {comIcones(ficha.avatar)}
          </span>
          <strong>{tituloPersonagem('mago', ficha.genero)}</strong>
          <Barra vida={vidaHeroi} maxima={ficha.pontosDeVidaMaximos} />
          <Barra vida={energia} maxima={ficha.energiaMaxima} emoji="🔮" classe="barra-energia" />
          <small>
            <Icone id="interface/escudo" /> CA {caHeroi}
            {bonusCA > 0 ? ` (+${bonusCA})` : ''}
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
            <Icone id="interface/escudo" /> CA {inimigo.defesa}
            {inimigoPreso ? <> <Icone id="feiticos/estilhaco-de-gelo" /></> : ''}
          </small>
        </div>
      </div>

      <TextoNarrado className="mensagem mensagem-luta" idioma={idioma} texto={mensagem} />

      {estado === 'jogador' && !menuFeiticos && !conta && (
        <>
          <TextoNarrado className="texto-grande" idioma={idioma} texto={t(TEXTOS.proximaAcao, idioma)} />
          <div className="acoes">
            <button className="botao" onClick={() => setMenuFeiticos(true)} disabled={ocupado}>
              {comIcones(t(TEXTOS.lancar, idioma))}
            </button>
            <button
              className="botao botao-secundario"
              onClick={abrirConta}
              disabled={ocupado || energia >= ficha.energiaMaxima}
            >
              {comIcones(t(TEXTOS.concentrar, idioma))}
            </button>
          </div>
        </>
      )}

      {estado === 'jogador' && conta && (
        <div className="conta">
          <TextoNarrado className="texto-grande" idioma={idioma} texto={t(TEXTOS.contaTitulo, idioma)} />
          <p>{t(TEXTOS.contaAjuda, idioma)}</p>
          <p className="conta-enunciado">
            {conta.a} + {conta.b} = <span className="conta-resposta">{digitos || '?'}</span>
          </p>
          <div className="teclado">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} className="botao botao-secundario" onClick={() => setDigitos((x) => (x + d).slice(0, 3))}>
                {d}
              </button>
            ))}
            <button className="botao botao-secundario" onClick={() => setDigitos((x) => x.slice(0, -1))} aria-label={t(TEXTOS.apagar, idioma)}>
              ⌫
            </button>
            <button className="botao botao-secundario" onClick={() => setDigitos((x) => (x + '0').slice(0, 3))}>
              0
            </button>
            <button className="botao" onClick={concentrar} disabled={digitos === ''}>
              {comIcones(t(TEXTOS.confirmar, idioma))}
            </button>
          </div>
          <button className="botao botao-secundario" onClick={() => setConta(null)}>
            {comIcones(t(TEXTOS.voltarMenu, idioma))}
          </button>
        </div>
      )}

      {estado === 'jogador' && menuFeiticos && (
        <>
          <p className="texto-grande">{t(TEXTOS.escolheFeitico, idioma)}</p>
          <div className="lista-feiticos-luta">
            {feiticos.map((f) => (
              <button
                key={f.id}
                className="botao botao-feitico"
                onClick={() => lancar(f)}
                disabled={ocupado || energia < f.custo}
              >
                <span>
                  {comIcones(f.emoji)} {t(f.nome, idioma)} ·{' '}
                  <span className="sem-quebra">{comIcones(f.custo === 0 ? t(TEXTOS.gratis, idioma) : `${f.custo} 🔮`)}</span>
                </span>
                <small>{t(f.descricao, idioma)}</small>
              </button>
            ))}
          </div>
          <button className="botao botao-secundario" onClick={() => setMenuFeiticos(false)}>
            {comIcones(t(TEXTOS.voltarMenu, idioma))}
          </button>
        </>
      )}

      <div className="acoes">
        {estado === 'inimigo' && (
          <button className="botao" onClick={turnoInimigo} disabled={ocupado}>
            {preencher(t(TEXTOS.vezInimigo, idioma), { inimigo: nomeInimigo })} <Icone id="interface/dado" />
          </button>
        )}
        {estado === 'vitoria' && (
          <button className="botao" onClick={() => aoVencer(vidaHeroi, energia)}>
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
