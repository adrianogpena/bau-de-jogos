// Ferramenta só do servidor de testes (`npm run dev:tablet`): esconde a barra de rolagem
// e põe um botão para girar a janela entre paisagem e retrato.
const LADO_CURTO = 720;
const LADO_LONGO = 1100;

export function instalarFerramentaTablet(): void {
  const estilo = document.createElement('style');
  estilo.textContent = '*::-webkit-scrollbar{display:none}*{scrollbar-width:none}';
  document.head.appendChild(estilo);

  const botao = document.createElement('button');
  botao.textContent = '⟳';
  botao.title = 'Girar tablet';
  botao.style.cssText =
    'position:fixed;bottom:8px;left:8px;z-index:99999;width:44px;height:44px;border-radius:50%;' +
    'border:0;background:rgba(0,0,0,.45);color:#fff;font-size:24px;line-height:1;cursor:pointer;opacity:.6';
  botao.onclick = () => {
    const paisagem = window.innerWidth >= window.innerHeight;
    const [largura, altura] = paisagem ? [LADO_CURTO, LADO_LONGO] : [LADO_LONGO, LADO_CURTO];
    const bordaX = window.outerWidth - window.innerWidth;
    const bordaY = window.outerHeight - window.innerHeight;
    window.resizeTo(largura + bordaX, altura + bordaY);
  };
  document.body.appendChild(botao);
}
