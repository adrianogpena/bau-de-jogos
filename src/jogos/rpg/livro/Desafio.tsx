import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../../compartilhado/idioma';
import type { Nivel } from '../../../compartilhado/niveis';
import { caminhoImagem, normalizar } from '../../../compartilhado/palavras';
import { TextoNarrado } from '../../../compartilhado/TextoNarrado';
import { somAcerto, somTentarDeNovo } from '../../../compartilhado/som';
import { comIcones } from '../../../compartilhado/icones';
import { type Rodada, novaRodada } from './desafios';
import { PuzzleVisual } from './PuzzlesVisuais';
import type { DesafioPonto } from './tipos';

const TEXTOS = {
  placeholder: { 'pt-PT': 'Escreve aqui', 'pt-BR': 'Escreva aqui' },
  verificar: { 'pt-PT': 'Verificar', 'pt-BR': 'Verificar' },
  apagar: { 'pt-PT': 'Apagar', 'pt-BR': 'Apagar' },
  tocarLetras: { 'pt-PT': 'Toca nas letras pela ordem certa.', 'pt-BR': 'Toque nas letras na ordem certa.' },
  acertou: { 'pt-PT': 'Muito bem! 🎉', 'pt-BR': 'Muito bem! 🎉' },
  quase: { 'pt-PT': 'Quase! Tenta outra vez.', 'pt-BR': 'Quase! Tente de novo.' },
  falhou: { 'pt-PT': 'Não foi desta vez! A resposta certa era:', 'pt-BR': 'Não foi desta vez! A resposta certa era:' },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
} satisfies Record<string, TextoPorIdioma>;

interface Props {
  idioma: Idioma;
  nivel: Nivel;
  desafio: DesafioPonto;
  tentativas: number;
  /** Nome e gênero do personagem, para o enunciado. */
  valoresTexto: Record<string, string>;
  aoConcluir: (acertou: boolean) => void;
}

/** Teclado de números grande, para tocar. */
function TecladoNumerico({ idioma, digitos, mudar, confirmar }: { idioma: Idioma; digitos: string; mudar: (d: string) => void; confirmar: () => void }) {
  return (
    <div className="teclado">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} className="botao botao-secundario" onClick={() => mudar((digitos + d).slice(0, 3))}>
          {d}
        </button>
      ))}
      <button className="botao botao-secundario" onClick={() => mudar(digitos.slice(0, -1))} aria-label={t(TEXTOS.apagar, idioma)}>
        ⌫
      </button>
      <button className="botao botao-secundario" onClick={() => mudar((digitos + '0').slice(0, 3))}>
        0
      </button>
      <button className="botao" onClick={confirmar} disabled={digitos === ''} aria-label={t(TEXTOS.verificar, idioma)}>
        {comIcones('✔️')}
      </button>
    </div>
  );
}

const PUZZLES_VISUAIS: Rodada['tipo'][] = ['ordem', 'codigo', 'pares', 'luzes', 'som', 'padrao', 'contar'];

/** A resposta certa em texto (mostrada ao acabar as tentativas, para aprender). */
function textoRespostaCerta(rodada: Rodada, idioma: Idioma): string {
  switch (rodada.tipo) {
    case 'escrever':
      return rodada.certa;
    case 'enigma':
      return t(rodada.enigma.opcoes[rodada.enigma.certa], idioma);
    case 'ordem':
      return rodada.figuras.map((f) => f.emoji).join(' ');
    case 'codigo':
      return rodada.resposta;
    case 'pares':
      return rodada.a.map((f, i) => `${f.emoji} = ${rodada.b[i].emoji}`).join('   ');
    case 'luzes':
      return '';
    case 'som':
      return rodada.notas.map((n) => n + 1).join(' ');
    case 'padrao':
      return rodada.opcoes[rodada.certa].emoji;
    default:
      return String(rodada.resposta);
  }
}

/**
 * Um puzzle da base (escrever, conta, sequência ou adivinha) com o tema da história.
 * Há poucas tentativas; quando acabam, a resposta certa aparece (para aprender) e a história segue por outro caminho.
 */
export function Desafio({ idioma, nivel, desafio, tentativas, valoresTexto, aoConcluir }: Props) {
  const [rodada] = useState<Rodada>(() => novaRodada(desafio, nivel, idioma));
  const [restantes, setRestantes] = useState(tentativas);
  const [estado, setEstado] = useState<'jogando' | 'errou' | 'certo' | 'falhou'>('jogando');
  const [digitos, setDigitos] = useState('');
  const [escrito, setEscrito] = useState('');
  /** Posições das letras já tocadas, na ordem. */
  const [tocadas, setTocadas] = useState<number[]>([]);

  const terminou = estado === 'certo' || estado === 'falhou';

  function responder(certo: boolean) {
    if (terminou) return;
    if (certo) {
      somAcerto();
      setEstado('certo');
      return;
    }
    somTentarDeNovo();
    setRestantes(restantes - 1);
    setEstado(restantes - 1 <= 0 ? 'falhou' : 'errou');
    setDigitos('');
    setTocadas([]);
  }

  const mudarDigitos = (d: string) => {
    setDigitos(d);
    if (estado === 'errou') setEstado('jogando');
  };

  const valores =
    rodada.tipo === 'conta' ? { ...valoresTexto, a: rodada.a, b: rodada.b } : valoresTexto;
  const respostaCerta = textoRespostaCerta(rodada, idioma);
  const letras = rodada.tipo === 'escrever' ? [...rodada.certa] : [];

  return (
    <div className="desafio">
      <TextoNarrado className="texto-grande" idioma={idioma} texto={preencher(t(desafio.enunciado, idioma), valores)} />

      {PUZZLES_VISUAIS.includes(rodada.tipo) && (
        <PuzzleVisual
          rodada={rodada as Parameters<typeof PuzzleVisual>[0]['rodada']}
          idioma={idioma}
          terminou={terminou}
          tentativa={tentativas - restantes}
          responder={responder}
        />
      )}

      {rodada.tipo === 'escrever' && (
        <>
          <img className={`imagem-jogo ${estado === 'certo' ? 'imagem-acerto' : ''}`} src={caminhoImagem(rodada.imagem)} alt="" draggable={false} />
          {!terminou && rodada.pecas && (
            <>
              <div className="letras-palavra" lang={idioma}>
                {letras.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="letra-palavra letra-tocavel"
                    disabled={tocadas[i] === undefined}
                    onClick={() => setTocadas(tocadas.filter((_, j) => j !== i))}
                  >
                    {tocadas[i] === undefined ? '' : rodada.pecas![tocadas[i]]}
                  </button>
                ))}
              </div>
              <p>{t(TEXTOS.tocarLetras, idioma)}</p>
              <div className="pecas-letras" lang={idioma}>
                {rodada.pecas.map((letra, i) => (
                  <button
                    key={i}
                    type="button"
                    className="botao botao-secundario peca-letra"
                    disabled={tocadas.includes(i) || tocadas.length >= letras.length}
                    onClick={() => {
                      setTocadas([...tocadas, i]);
                      if (estado === 'errou') setEstado('jogando');
                    }}
                  >
                    {letra}
                  </button>
                ))}
              </div>
              <button
                className="botao"
                disabled={tocadas.length < letras.length}
                onClick={() => responder(tocadas.map((i) => rodada.pecas![i]).join('') === rodada.certa)}
              >
                {t(TEXTOS.verificar, idioma)}
              </button>
            </>
          )}
          {!terminou && !rodada.pecas && (
            <form
              className="formulario-resposta"
              onSubmit={(e) => {
                e.preventDefault();
                // aceita sem acentos, como no jogo de escrita
                if (escrito.trim()) responder(normalizar(escrito) === normalizar(rodada.certa));
              }}
            >
              <div className="letras-palavra" lang={idioma} aria-hidden="true">
                {letras.map((_, i) => (
                  <span key={i} className="letra-palavra" />
                ))}
              </div>
              <input
                className="campo-resposta"
                value={escrito}
                onChange={(e) => {
                  setEscrito(e.target.value);
                  if (estado === 'errou') setEstado('jogando');
                }}
                placeholder={t(TEXTOS.placeholder, idioma)}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                lang={idioma}
              />
              <button type="submit" className="botao">
                {t(TEXTOS.verificar, idioma)}
              </button>
            </form>
          )}
        </>
      )}

      {rodada.tipo === 'conta' && !terminou && (
        <div className="conta">
          <p className="conta-enunciado">
            {rodada.mostrarConta && `${rodada.a} ${rodada.sinal} ${rodada.b} = `}
            <span className="conta-resposta">{digitos || '?'}</span>
          </p>
          <TecladoNumerico idioma={idioma} digitos={digitos} mudar={mudarDigitos} confirmar={() => responder(Number(digitos) === rodada.resposta)} />
        </div>
      )}

      {rodada.tipo === 'sequencia' && !terminou && (
        <div className="conta">
          <div className="sequencia">
            {rodada.numeros.map((n, i) => (
              <span key={i} className={i === rodada.falta ? 'sequencia-numero sequencia-falta' : 'sequencia-numero'}>
                {i === rodada.falta ? digitos || '?' : n}
              </span>
            ))}
          </div>
          <TecladoNumerico idioma={idioma} digitos={digitos} mudar={mudarDigitos} confirmar={() => responder(Number(digitos) === rodada.resposta)} />
        </div>
      )}

      {rodada.tipo === 'enigma' && (
        <>
          <TextoNarrado className="texto-historia" idioma={idioma} texto={t(rodada.enigma.pergunta, idioma)} />
          {!terminou && (
            <div className="acoes">
              {rodada.ordem.map((i) => (
                <button key={i} className="botao botao-secundario" onClick={() => responder(i === rodada.enigma.certa)}>
                  {t(rodada.enigma.opcoes[i], idioma)}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {estado === 'errou' && <TextoNarrado className="mensagem" idioma={idioma} texto={t(TEXTOS.quase, idioma)} />}
      {estado === 'certo' && (
        <>
          <TextoNarrado className="mensagem mensagem-acerto" idioma={idioma} texto={t(TEXTOS.acertou, idioma)} />
          {respostaCerta && <p className="resposta-certa" lang={idioma}>{comIcones(respostaCerta)}</p>}
        </>
      )}
      {estado === 'falhou' && (
        <>
          <TextoNarrado className="mensagem" idioma={idioma} texto={t(TEXTOS.falhou, idioma)} />
          {respostaCerta && <p className="resposta-certa" lang={idioma}>{comIcones(respostaCerta)}</p>}
        </>
      )}

      {!terminou && <p className="progresso">{comIcones('🔑'.repeat(restantes))}</p>}
      {terminou && (
        <button className="botao" onClick={() => aoConcluir(estado === 'certo')}>
          {comIcones(t(TEXTOS.continuar, idioma))}
        </button>
      )}
    </div>
  );
}
