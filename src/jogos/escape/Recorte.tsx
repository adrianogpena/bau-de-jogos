import type { CSSProperties } from 'react';
import { comIcones } from '../../compartilhado/icones';
import type { Zona } from './tipos';

const caminho = (arquivo: string) => `${import.meta.env.BASE_URL}${arquivo}`;

/**
 * O desenho de um objeto da sala, recortado do próprio fundo (a zona do objeto). Sem imagem de fundo, mostra o
 * emoji. Usado no cadeado da saída e no painel, para a criança reconhecer o objeto na cena.
 */
export function Recorte({ fundo, zona, emoji, altura = 56 }: { fundo?: string; zona: Zona; emoji: string; altura?: number }) {
  if (!fundo) {
    return (
      <span className="recorte recorte-emoji" style={{ fontSize: altura * 0.7 }} aria-hidden="true">
        {comIcones(emoji)}
      </span>
    );
  }
  const { x, y, largura, altura: alturaZona } = zona;
  const esquerda = x - largura / 2;
  const topo = y - alturaZona / 2;
  const estilo: CSSProperties = {
    height: altura,
    // a cena é 4:3: a zona tem proporção (largura·4) : (altura·3)
    aspectRatio: `${largura * 4} / ${alturaZona * 3}`,
    backgroundImage: `url(${caminho(fundo)})`,
    backgroundSize: `${(100 / largura) * 100}% ${(100 / alturaZona) * 100}%`,
    backgroundPosition: `${largura >= 100 ? 0 : (esquerda / (100 - largura)) * 100}% ${alturaZona >= 100 ? 0 : (topo / (100 - alturaZona)) * 100}%`,
  };
  return <span className="recorte" style={estilo} aria-hidden="true" />;
}
