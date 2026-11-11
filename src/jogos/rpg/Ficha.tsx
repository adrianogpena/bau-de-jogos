import { useState } from 'react';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { estatisticas, totalPocoes } from './itens';
import type { Nivel } from '../../compartilhado/niveis';
import { AJUSTES_NIVEL } from './niveis';
import { EscolherPersonagem } from './EscolherPersonagem';
import { FiguraPersonagem } from './FiguraPersonagem';
import { Moedas } from './Moedas';
import { personagemPorId } from './personagem';
import type { Atributos, FichaPersonagem, NomeAtributo } from './tipos';
import {
  ATRIBUTOS,
  ATRIBUTO_MAXIMO,
  ATRIBUTO_MINIMO,
  PONTOS_PARA_DISTRIBUIR,
  vidaMaxima,
} from './historia';
import { Icone, comIcones } from '../../compartilhado/icones';

const TEXTOS = {
  defesa: { 'pt-PT': 'Defesa', 'pt-BR': 'Defesa' },
  titulo: { 'pt-PT': 'Cria o teu herói', 'pt-BR': 'Crie seu herói' },
  pontos: {
    'pt-PT': 'Pontos para distribuir: {n}',
    'pt-BR': 'Pontos para distribuir: {n}',
  },
  gasta: {
    'pt-PT': 'Gasta todos os pontos para começar!',
    'pt-BR': 'Use todos os pontos para começar!',
  },
  falta: {
    'pt-PT': 'Escolhe o teu herói para começar!',
    'pt-BR': 'Escolha seu herói para começar!',
  },
  vida: { 'pt-PT': 'Vida', 'pt-BR': 'Vida' },
  comecar: { 'pt-PT': 'Começar a aventura!', 'pt-BR': 'Começar a aventura!' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  menos: { 'pt-PT': 'Menos', 'pt-BR': 'Menos' },
  mais: { 'pt-PT': 'Mais', 'pt-BR': 'Mais' },
} satisfies Record<string, TextoPorIdioma>;

interface Props {
  idioma: Idioma;
  nivel: Nivel;
  aoVoltar: () => void;
  aoComecar: (ficha: FichaPersonagem) => void;
}

/** Tela de criação da ficha de personagem. */
export function CriarFicha({ idioma, nivel, aoVoltar, aoComecar }: Props) {
  const [personagem, setPersonagem] = useState<string | null>(null);
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
    if (!personagem) return;
    const vida = vidaMaxima(atributos.coragem);
    aoComecar({
      personagem,
      atributos,
      pontosDeVida: vida,
      pontosDeVidaMaximos: vida,
      prata: AJUSTES_NIVEL[nivel].moedas,
      arma: null,
      armadura: null,
      escudo: false,
      pocoes: { ...AJUSTES_NIVEL[nivel].pocoesIniciais },
    });
  }

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
      </header>

      <h1><Icone id="interface/pergaminho" /> {t(TEXTOS.titulo, idioma)}</h1>

      <div className="ficha-papel">
        <EscolherPersonagem idioma={idioma} tipo="heroi" escolhido={personagem} aoEscolher={setPersonagem} />

        <TextoNarrado
          className="texto-grande"
          idioma={idioma}
          texto={preencher(t(TEXTOS.pontos, idioma), { n: sobram })}
        />

        {ATRIBUTOS.map((atr) => (
          <div key={atr.id} className="linha-atributo">
            <span className="atributo-nome">
              <span aria-hidden="true">{comIcones(atr.emoji)}</span>
              <TextoNarrado
                compacto
                idioma={idioma}
                texto={`${t(atr.nome, idioma)}\n${t(atr.ajuda, idioma)}`}
              />
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
          <Icone id="interface/coracao" /> {t(TEXTOS.vida, idioma)}: {vidaMaxima(atributos.coragem)}
        </p>
      </div>

      <p className="mensagem">{!personagem ? t(TEXTOS.falta, idioma) : sobram > 0 ? t(TEXTOS.gasta, idioma) : ''}</p>
      <button className="botao" onClick={comecar} disabled={sobram > 0 || !personagem}>
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
        <FiguraPersonagem personagem={personagemPorId('heroi', ficha.personagem)} classe="resumo-imagem" />
      </span>
      <strong>{personagemPorId('heroi', ficha.personagem).nome}</strong>
      <span>
        <Icone id="interface/coracao" /> {ficha.pontosDeVida}/{ficha.pontosDeVidaMaximos}
      </span>
      <span><Icone id="interface/escudo" /> {t(TEXTOS.defesa, idioma)} {estatisticas(ficha).ca}</span>
      <span><Icone id="interface/pocao" /> {totalPocoes(ficha)}</span>
      <Moedas pratas={ficha.prata} />
      {ATRIBUTOS.map((atr) => (
        <span key={atr.id} title={t(atr.nome, idioma)}>
          {comIcones(atr.emoji)} {ficha.atributos[atr.id]}
        </span>
      ))}
    </div>
  );
}
