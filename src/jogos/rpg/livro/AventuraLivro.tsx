import { type ReactNode, useEffect, useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import type { Nivel } from '../../../compartilhado/niveis';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { Dado, usarDado } from '../../../compartilhado/usarDado';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import { Icone, comIcones } from '../../../compartilhado/icones';
import { AJUSTES_NIVEL } from '../niveis';
import { Desafio } from './Desafio';
import { finaisDescobertos, registrarFinal } from './finais';
import { aplicarMarcas, permite } from './regras';
import type { ItemHistoria, Livro, Ponto } from './tipos';

const TEXTOS = {
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  lutar: { 'pt-PT': '⚔️ Lutar!', 'pt-BR': '⚔️ Lutar!' },
  lancar: { 'pt-PT': '🎲 Lançar o dado', 'pt-BR': '🎲 Jogar o dado' },
  resultado: {
    'pt-PT': 'Tiraste {dado} + {valor} = {total}.',
    'pt-BR': 'Você tirou {dado} + {valor} = {total}.',
  },
  passou: { 'pt-PT': 'Conseguiste! 🎉', 'pt-BR': 'Você conseguiu! 🎉' },
  naoPassou: { 'pt-PT': 'Não deu... mas a aventura continua!', 'pt-BR': 'Não deu... mas a aventura continua!' },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  mochila: { 'pt-PT': 'Mochila', 'pt-BR': 'Mochila' },
  fim: { 'pt-PT': 'Fim da aventura! 🏆', 'pt-BR': 'Fim da aventura! 🏆' },
  finais: { 'pt-PT': 'Finais descobertos: {n} de {total}', 'pt-BR': 'Finais descobertos: {n} de {total}' },
  outrosFinais: {
    'pt-PT': 'Joga outra vez e faz escolhas diferentes para descobrir os outros finais!',
    'pt-BR': 'Jogue de novo e faça escolhas diferentes para descobrir os outros finais!',
  },
  todosFinais: { 'pt-PT': 'Descobriste todos os finais! 🎉', 'pt-BR': 'Você descobriu todos os finais! 🎉' },
  jogarDeNovo: { 'pt-PT': 'Jogar outra vez', 'pt-BR': 'Jogar de novo' },
} satisfies Record<string, TextoPorIdioma>;

interface Props<Atributo extends string> {
  idioma: Idioma;
  nivel: Nivel;
  livro: Livro<Atributo>;
  /** Marcas com que a criança começa (ex.: a escola do mago). */
  marcasIniciais?: string[];
  /** Nome e gênero do personagem (e outras chaves dos textos da história). */
  valoresTexto: Record<string, string>;
  /** Valor do atributo na ficha e a frase que explica o teste ("Lança o d20 e soma..."). */
  teste: (atributo: Atributo, dificuldade: number) => { valor: number; instrucao: string };
  /** Tentativas a mais nos puzzles (herói inteligente, mago sábio). */
  tentativasExtras: number;
  /** Resumo da ficha, mostrado no topo. */
  resumo: ReactNode;
  /** Botões a mais na barra e o painel que eles abrem (ex.: feitiços do mago). */
  barra?: ReactNode;
  painel?: ReactNode;
  /** A história aplica na ficha o que o ponto dá (poções, descanso). Não é chamado no ponto inicial. */
  aoEntrar: (ponto: Ponto<Atributo>) => void;
  /** A luta do ponto; a história atualiza a ficha e chama `vencer`. */
  luta: (ponto: Ponto<Atributo>, vencer: () => void) => ReactNode;
  /** Parte própria da história num ponto (ex.: aprender um feitiço), com `irPara` para seguir. */
  extra?: (ponto: Ponto<Atributo>, irPara: (id: string) => void) => ReactNode;
  aoVoltar: () => void;
  aoRecomecar: () => void;
}

function ImagemItem({ item }: { item: ItemHistoria }) {
  if (item.icone) return <Icone id={item.icone} />;
  if (item.arquivo) {
    return <img className="icone-texto" src={`${import.meta.env.BASE_URL}imagens/itens/${item.arquivo}.png`} alt="" draggable={false} />;
  }
  return null;
}

/** Motor do livro-jogo: mostra o ponto atual, as escolhas que as marcas permitem, puzzles, testes de dado, lutas e o final. */
export function AventuraLivro<Atributo extends string>({
  idioma,
  nivel,
  livro,
  marcasIniciais = [],
  valoresTexto,
  teste,
  tentativasExtras,
  resumo,
  barra,
  painel,
  aoEntrar,
  luta,
  extra,
  aoVoltar,
  aoRecomecar,
}: Props<Atributo>) {
  const [pontoId, setPontoId] = useState(livro.inicial);
  const [marcas, setMarcas] = useState(() => aplicarMarcas(marcasIniciais, livro.pontos[livro.inicial]));
  /** Muda a cada passo: um ponto visitado de novo recomeça o seu puzzle. */
  const [passo, setPasso] = useState(0);
  const [fase, setFase] = useState<'cena' | 'luta' | 'teste'>('cena');
  const [passou, setPassou] = useState<boolean | null>(null);
  const [resumoTeste, setResumoTeste] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [descobertos, setDescobertos] = useState(() => finaisDescobertos(livro.id));
  const dado = usarDado();

  const ponto = livro.pontos[pontoId];
  const ajustes = AJUSTES_NIVEL[nivel];
  const dadosTeste = ponto.teste ? teste(ponto.teste.atributo, ponto.teste.dificuldade + ajustes.dificuldadeTeste) : null;
  const dificuldade = ponto.teste ? ponto.teste.dificuldade + ajustes.dificuldadeTeste : 0;

  useEffect(() => {
    if (ponto.fim) setDescobertos(registrarFinal(livro.id, ponto.fim));
  }, [livro.id, ponto.fim]);

  function irPara(id: string) {
    const proximo = livro.pontos[id];
    setMarcas((atuais) => aplicarMarcas(atuais, proximo));
    aoEntrar(proximo);
    setPontoId(id);
    setPasso((n) => n + 1);
    setFase('cena');
    setPassou(null);
    setResumoTeste('');
  }

  async function fazerTeste() {
    if (!dadosTeste || ocupado) return;
    setOcupado(true);
    setFase('teste');
    const d20 = await dado.rolar(20);
    const total = d20 + dadosTeste.valor;
    const ok = total >= dificuldade;
    ok ? somAcerto() : somTentarDeNovo();
    setPassou(ok);
    setResumoTeste(preencher(t(TEXTOS.resultado, idioma), { dado: d20, valor: dadosTeste.valor, total }));
    setOcupado(false);
  }

  const itens = marcas.filter((m) => livro.itens[m]);
  const idsFinais = Object.keys(livro.finais);

  return (
    <main className="tela tela-centro">
      <header className="barra-jogo">
        <button className="botao botao-secundario" onClick={aoVoltar}>
          ← {t(TEXTOS.voltar, idioma)}
        </button>
        {barra}
      </header>

      {painel}
      {resumo}

      {itens.length > 0 && (
        <div className="mochila">
          <strong>{t(TEXTOS.mochila, idioma)}:</strong>
          {itens.map((m) => (
            <span key={m} className="item-mochila">
              <ImagemItem item={livro.itens[m]} /> {t(livro.itens[m].nome, idioma)}
            </span>
          ))}
        </div>
      )}

      <div className="emoji-grande" aria-hidden="true">
        {comIcones(ponto.emoji)}
      </div>
      <TextoNarrado className="texto-historia" idioma={idioma} texto={preencher(t(ponto.texto, idioma), valoresTexto)} />

      {fase === 'luta' && ponto.luta ? (
        luta(ponto, () => irPara(ponto.luta!.aoVencer))
      ) : (
        <>
          {dadosTeste && (
            <div className="teste">
              <TextoNarrado idioma={idioma} texto={dadosTeste.instrucao} />
              {fase === 'teste' && <Dado valor={dado.valor} lados={dado.lados} rolando={dado.rolando} />}
              {passou !== null && (
                <TextoNarrado
                  className="mensagem mensagem-acerto"
                  idioma={idioma}
                  texto={`${resumoTeste} ${t(passou ? TEXTOS.passou : TEXTOS.naoPassou, idioma)}`}
                />
              )}
            </div>
          )}

          {ponto.desafio && (
            <Desafio
              key={passo}
              idioma={idioma}
              nivel={nivel}
              desafio={ponto.desafio}
              tentativas={ajustes.tentativasDesafio + tentativasExtras}
              valoresTexto={valoresTexto}
              aoConcluir={(acertou) => irPara(acertou ? ponto.desafio!.sucesso : ponto.desafio!.falha)}
            />
          )}

          {extra?.(ponto, irPara)}

          {ponto.pergunta && (
            <TextoNarrado className="texto-grande" idioma={idioma} texto={preencher(t(ponto.pergunta, idioma), valoresTexto)} />
          )}

          <div className="acoes">
            {ponto.luta && (
              <button className="botao" onClick={() => setFase('luta')}>
                {comIcones(t(TEXTOS.lutar, idioma))}
              </button>
            )}
            {ponto.teste && passou === null && (
              <button className="botao" onClick={fazerTeste} disabled={ocupado}>
                {comIcones(t(TEXTOS.lancar, idioma))}
              </button>
            )}
            {ponto.teste && passou !== null && (
              <button className="botao" onClick={() => irPara(passou ? ponto.teste!.sucesso : ponto.teste!.falha)}>
                {comIcones(t(TEXTOS.continuar, idioma))}
              </button>
            )}
            {ponto.escolhas?.map(
              (escolha, i) =>
                permite(escolha.se, marcas) && (
                  <button key={i} className="botao" onClick={() => irPara(escolha.destino)}>
                    {comIcones(preencher(t(escolha.texto, idioma), valoresTexto))}
                  </button>
                ),
            )}
          </div>

          {ponto.fim && (
            <>
              <h2>{comIcones(t(TEXTOS.fim, idioma))}</h2>
              <TextoNarrado className="texto-grande" idioma={idioma} texto={t(livro.finais[ponto.fim].titulo, idioma)} />
              <div className="finais">
                <TextoNarrado
                  idioma={idioma}
                  texto={preencher(t(TEXTOS.finais, idioma), { n: descobertos.length, total: idsFinais.length })}
                />
                <ul>
                  {idsFinais.map((id) => (
                    <li key={id} className={descobertos.includes(id) ? '' : 'final-escondido'}>
                      {descobertos.includes(id) ? (
                        <>
                          {comIcones(livro.finais[id].emoji)} {t(livro.finais[id].titulo, idioma)}
                        </>
                      ) : (
                        <>{comIcones('❔')} ? ? ?</>
                      )}
                    </li>
                  ))}
                </ul>
                <TextoNarrado
                  idioma={idioma}
                  texto={t(descobertos.length < idsFinais.length ? TEXTOS.outrosFinais : TEXTOS.todosFinais, idioma)}
                />
              </div>
              <div className="acoes">
                <button className="botao" onClick={aoRecomecar}>
                  {t(TEXTOS.jogarDeNovo, idioma)}
                </button>
                <button className="botao botao-secundario" onClick={aoVoltar}>
                  {t(TEXTOS.voltar, idioma)}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
