import { useState } from 'react';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { type Genero, type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { MOEDAS_INICIAIS, estatisticas, totalPocoes } from './itens';
import { EscolherGenero } from './EscolherGenero';
import { Moedas } from './Moedas';
import { avatarPersonagem, tituloPersonagem } from './personagem';
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
    'pt-PT': 'Escolhe rapaz ou rapariga para começar!',
    'pt-BR': 'Escolha menino ou menina para começar!',
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
  const [genero, setGenero] = useState<Genero | null>(null);
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
    if (!genero) return;
    const vida = vidaMaxima(atributos.coragem);
    aoComecar({
      genero,
      atributos,
      pontosDeVida: vida,
      pontosDeVidaMaximos: vida,
      prata: MOEDAS_INICIAIS,
      arma: null,
      armadura: null,
      escudo: false,
      pocoes: {},
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
        <EscolherGenero idioma={idioma} genero={genero} aoEscolher={setGenero} />

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
                texto={`${t(atr.nome, idioma)}. ${t(atr.ajuda, idioma)}`}
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

      <p className="mensagem">{!genero ? t(TEXTOS.falta, idioma) : sobram > 0 ? t(TEXTOS.gasta, idioma) : ''}</p>
      <button className="botao" onClick={comecar} disabled={sobram > 0 || !genero}>
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
        {comIcones(avatarPersonagem('heroi', ficha.genero))}
      </span>
      <strong>{tituloPersonagem('heroi', ficha.genero)}</strong>
      <span>
        <Icone id="interface/coracao" /> {ficha.pontosDeVida}/{ficha.pontosDeVidaMaximos}
      </span>
      <span><Icone id="interface/escudo" /> CA {estatisticas(ficha).ca}</span>
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
