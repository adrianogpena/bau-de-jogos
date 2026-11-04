import { useState } from 'react';
import { type Idioma, type TextoPorIdioma, preencher, t } from '../../compartilhado/idioma';
import { TextoNarrado } from '../../compartilhado/TextoNarrado';
import { somAcerto, somTentarDeNovo } from '../../compartilhado/som';
import { PUZZLE } from './historia';

const TEXTOS = {
  pistas: { 'pt-PT': '📜 Pistas do Chefe', 'pt-BR': '📜 Pistas do Chefe' },
  decifrar: { 'pt-PT': '🗺️ Decifrar o mapa', 'pt-BR': '🗺️ Decifrar o mapa' },
  tentativas: { 'pt-PT': 'Tentativas: {n}', 'pt-BR': 'Tentativas: {n}' },
  errou: {
    'pt-PT': 'Alguma resposta não combina com as pistas. Lê outra vez com calma!',
    'pt-BR': 'Alguma resposta não combina com as pistas. Leia de novo com calma!',
  },
  acertou: {
    'pt-PT': 'Conseguiste! O mapa revelou atalhos secretos. 🗺️✨',
    'pt-BR': 'Você conseguiu! O mapa revelou atalhos secretos. 🗺️✨',
  },
  semTentativas: {
    'pt-PT': 'O mapa continua a ser um mistério... mas a aventura segue!',
    'pt-BR': 'O mapa continua sendo um mistério... mas a aventura segue!',
  },
  continuar: { 'pt-PT': 'Continuar ➜', 'pt-BR': 'Continuar ➜' },
  seguirSem: { 'pt-PT': 'Seguir sem decifrar', 'pt-BR': 'Seguir sem decifrar' },
} satisfies Record<string, TextoPorIdioma>;

/** Lista de pistas do Chefe, com leitura em voz alta. */
export function ListaPistas({ idioma }: { idioma: Idioma }) {
  const texto = PUZZLE.pistas.map((p, i) => `${i + 1}. ${t(p, idioma)}`).join('\n');
  return (
    <div className="pistas">
      <strong>{t(TEXTOS.pistas, idioma)}</strong>
      <TextoNarrado className="texto-pistas" idioma={idioma} texto={texto} />
    </div>
  );
}

/**
 * O herói precisa acertar os três enigmas ao mesmo tempo, usando as pistas.
 * Há poucas tentativas, então não dá para ganhar só testando botões.
 */
export function Puzzle({ idioma, aoConcluir }: { idioma: Idioma; aoConcluir: (decifrou: boolean) => void }) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [restantes, setRestantes] = useState(PUZZLE.tentativas);
  const [resultado, setResultado] = useState<'jogando' | 'certo' | 'falhou'>('jogando');
  const [aviso, setAviso] = useState('');

  const completo = PUZZLE.perguntas.every((p) => respostas[p.id]);

  function decifrar() {
    const certo = PUZZLE.perguntas.every((p) => respostas[p.id] === p.certa);
    if (certo) {
      somAcerto();
      setResultado('certo');
      setAviso(t(TEXTOS.acertou, idioma));
      return;
    }
    somTentarDeNovo();
    const sobram = restantes - 1;
    setRestantes(sobram);
    if (sobram <= 0) {
      setResultado('falhou');
      setAviso(t(TEXTOS.semTentativas, idioma));
    } else {
      setAviso(t(TEXTOS.errou, idioma));
    }
  }

  const terminou = resultado !== 'jogando';

  return (
    <div className="puzzle">
      <ListaPistas idioma={idioma} />

      {PUZZLE.perguntas.map((pergunta) => (
        <div key={pergunta.id} className="pergunta-puzzle">
          <strong>{t(pergunta.titulo, idioma)}</strong>
          <div className="acoes" role="group">
            {pergunta.opcoes.map((opcao) => (
              <button
                key={opcao.id}
                className={respostas[pergunta.id] === opcao.id ? 'botao botao-ativo' : 'botao botao-secundario'}
                aria-pressed={respostas[pergunta.id] === opcao.id}
                disabled={terminou}
                onClick={() => setRespostas({ ...respostas, [pergunta.id]: opcao.id })}
              >
                {opcao.emoji} {t(opcao.nome, idioma)}
              </button>
            ))}
          </div>
        </div>
      ))}

      {aviso && (
        <TextoNarrado
          className={`mensagem ${resultado === 'certo' ? 'mensagem-acerto' : ''}`}
          idioma={idioma}
          texto={aviso}
        />
      )}
      {!terminou && (
        <p className="progresso">{preencher(t(TEXTOS.tentativas, idioma), { n: '🔑'.repeat(restantes) })}</p>
      )}

      <div className="acoes">
        {!terminou && (
          <>
            <button className="botao" onClick={decifrar} disabled={!completo}>
              {t(TEXTOS.decifrar, idioma)}
            </button>
            <button className="botao botao-secundario" onClick={() => aoConcluir(false)}>
              {t(TEXTOS.seguirSem, idioma)}
            </button>
          </>
        )}
        {terminou && (
          <button className="botao" onClick={() => aoConcluir(resultado === 'certo')}>
            {t(TEXTOS.continuar, idioma)}
          </button>
        )}
      </div>
    </div>
  );
}
