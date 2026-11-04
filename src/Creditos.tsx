import { type Idioma, type TextoPorIdioma, t } from './compartilhado/idioma';

const TEXTOS = {
  titulo: { 'pt-PT': 'Créditos', 'pt-BR': 'Créditos' },
  voltar: { 'pt-PT': 'Voltar', 'pt-BR': 'Voltar' },
  imagens: {
    'pt-PT': 'Os pictogramas são de ARASAAC (http://arasaac.org), propriedade do Governo de Aragão (Espanha), criados por Sergio Palao.',
    'pt-BR': 'Os pictogramas são do ARASAAC (http://arasaac.org), de propriedade do Governo de Aragão (Espanha), criados por Sergio Palao.',
  },
  licenca: {
    'pt-PT': 'Licença: CC BY-NC-SA. Uso não comercial.',
    'pt-BR': 'Licença: CC BY-NC-SA. Uso não comercial.',
  },
  gratis: {
    'pt-PT': 'Este app é gratuito e sem anúncios.',
    'pt-BR': 'Este app é gratuito e não tem anúncios.',
  },
} satisfies Record<string, TextoPorIdioma>;

export function Creditos({ idioma, aoVoltar }: { idioma: Idioma; aoVoltar: () => void }) {
  return (
    <main className="tela tela-centro">
      <h1>{t(TEXTOS.titulo, idioma)}</h1>
      <p className="texto-credito">{t(TEXTOS.imagens, idioma)}</p>
      <p className="texto-credito">{t(TEXTOS.licenca, idioma)}</p>
      <p className="texto-credito">{t(TEXTOS.gratis, idioma)}</p>
      <button className="botao" onClick={aoVoltar}>
        {t(TEXTOS.voltar, idioma)}
      </button>
    </main>
  );
}
