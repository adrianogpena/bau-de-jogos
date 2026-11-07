"""Rodada 2 da validação de fonemas pt-BR (voz Faber): testa os padrões achados na rodada 1 (docs/VALIDACAO-FONEMAS.md).
Cada item tem 2 a 4 versões de áudio (A, B, C, D) e a pessoa escolhe a melhor.

  $PIPER_PYTHON scripts/fonemas/gerar_rodada2.py
  python scripts/fonemas/servir_validacao.py validacao-rodada2      # abre em http://localhost:5198/

Saída (fora do git): referencias-fonemas/validacao-rodada2/index.html, dados.json e audio/*.mp3.
As frases dos grupos 2 a 4 são novas, só para o teste (não entram no site)."""
import hashlib
import html
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PASTA = RAIZ / "referencias-fonemas"
SAIDA = PASTA / "validacao-rodada2"

fonte = (RAIZ / "scripts" / "piper_falar.py").read_text(encoding="utf-8").split("modelo = sys.argv[1]")[0]
ns = {"__name__": "piper_falar"}
exec(compile(fonte, "piper_falar.py", "exec"), ns)
import numpy as np  # noqa: E402
from piper import PiperVoice, SynthesisConfig  # noqa: E402

NFD = lambda s: unicodedata.normalize("NFD", s)  # noqa: E731
NFC = lambda s: unicodedata.normalize("NFC", s)  # noqa: E731
TOKEN = r"[\wÀ-ÿ'-]+"
VOGAL = "aeiouɛɔɐɪʊ"
NASAL = "̃"
TROCAS = ns["TROCAS_PALAVRA_PT_BR"]


# Mudanças nos fonemas da palavra testada (recebem os fonemas que o app usa hoje, já com as trocas).
def rr_coda(f):  # "r" em fim de sílaba: porta, corda
    return re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[^" + VOGAL + NASAL + r"ˈˌʲɾ\s])", "ɾɾ", f)


def rr_grupo(f):  # "r" em grupo de consoantes: dentro, pedra
    return re.sub(r"(?<=[pbtdkɡfv])ɾ(?!ɾ)", "ɾɾ", f)


def r_longo_grupo(f):
    return re.sub(r"(?<=[pbtdkɡfv])ɾ(?![ɾː])", "ɾː", f)


def rr_todos(f):
    return rr_grupo(rr_coda(f))


def rr_final(f):  # "r" final de verbo: brincar
    return re.sub(r"ɾ$", "ɾɾ", f)


def x_final(f):
    return re.sub(r"ɾ$", "x", f)


ATUAL = {"rot": "Atual", "desc": "como o app fala hoje"}

# Grupo 1. Palavra sozinha: o problema é o fonema ou o ritmo? (pausa antes e ritmo lento são o tratamento dos números)
SOZINHAS = ["porta", "corda", "forno", "barco", "corvo", "força", "porquinho", "tartaruga", "árvore", "pedra", "bruxa",
            "cachorro", "gorro", "porco", "lobo", "fogo", "ovo", "loja", "bola", "janela", "grande", "lâmpada",
            "floresta", "panela", "bicicleta", "formiga", "borboleta", "ponte"]
V_SOZINHA = [
    ATUAL,
    {"rot": "Pausa", "desc": "pausa curta antes, mesmo ritmo", "pausa": True},
    {"rot": "Lento + pausa", "desc": "ritmo 1.5 e pausa antes (como os números)", "pausa": True, "comprimento": 1.5},
    {"rot": "Lento + pausa + ɾɾ", "desc": "o mesmo, com «r» reforçado", "pausa": True, "comprimento": 1.5, "muda": rr_todos},
]

# Grupo 2. "r" em grupo de consoantes (tr, dr, gr...) no meio da frase. Frases novas.
GRUPO_R = [
    ("dentro", "O gato ficou dentro da caixa."), ("vidro", "O copo de vidro caiu no chão."),
    ("tremendo", "O coelho estava tremendo de frio."), ("tronco", "O esquilo subiu no tronco da árvore."),
    ("engrenagens", "As engrenagens giram sem parar."), ("trinta", "Ele contou trinta estrelas."),
    ("pedra", "A pedra rolou morro abaixo."), ("bruxa", "A bruxa mexeu o caldeirão."),
    ("grande", "O elefante é grande e forte."), ("livro", "Ela leu o livro todo."),
    ("prato", "O prato está vazio."), ("fruta", "A fruta caiu da árvore."),
    ("quatro", "Os quatro amigos riram."), ("outro", "Pegue outro balão."),
    ("encontrou", "Ele encontrou a chave."), ("primeiro", "O primeiro lugar é dela."),
]
V_GRUPO = [
    ATUAL,
    {"rot": "ɾɾ", "desc": "«r» do grupo dobrado", "muda": rr_grupo},
    {"rot": "ɾː", "desc": "«r» do grupo mais longo", "muda": r_longo_grupo},
]

# Grupo 3. "r" final de verbo, antes de consoante, antes de vogal e no fim da frase. Frases novas.
R_FINAL = [
    ("brincar", "Vamos brincar no parque."), ("brincar", "Quero brincar agora."), ("brincar", "Hoje eu vou brincar."),
    ("entrar", "Posso entrar na casa?"), ("entrar", "Ele quer entrar."),
    ("dançar", "Vamos dançar juntos."), ("dançar", "Ela gosta de dançar."),
    ("encontrar", "Ele quer encontrar o tesouro."), ("dormir", "Hora de dormir."), ("dormir", "Vou dormir cedo."),
    ("comer", "Vamos comer bolo."), ("comer", "O gato quer comer."), ("engordar", "O porco quer engordar."),
]
V_FINAL = [
    ATUAL,
    {"rot": "ɾɾ final", "desc": "«r» final dobrado", "muda": rr_final},
    {"rot": "x final", "desc": "«r» final arranhado (como em «carro»)", "muda": x_final},
]

# Grupo 4. A mesma palavra em 5 posições. Frases novas.
POSICOES = {
    "porta": ["Porta", "Porta aberta, todos entram.", "A porta abriu sozinha.", "A porta verde rangeu.", "Feche a porta."],
    "corda": ["Corda", "Corda bamba é difícil.", "A corda arrebentou.", "A corda grossa balançou.", "Puxe a corda."],
    "morcego": ["Morcego", "Morcego dorme de dia.", "O morcego acordou.", "O morcego voou longe.", "Olhe o morcego."],
    "forno": ["Forno", "Forno quente assa pão.", "O forno esquentou.", "O forno grande assou o bolo.", "Coloque o bolo no forno."],
    "dentro": ["Dentro", "Dentro da caixa tem um gato.", "Ficou dentro e dormiu.", "O gato ficou dentro da caixa.", "O gato ficou lá dentro."],
    "quatro": ["Quatro", "Quatro gatos dormem.", "Os quatro amigos riram.", "Os quatro gatos dormem.", "Eu tenho quatro."],
}
NOMES_POSICAO = ["sozinha", "começo", "meio, antes de vogal", "meio, antes de consoante", "fim da frase"]
V_POSICAO = [ATUAL, {"rot": "ɾɾ", "desc": "«r» reforçado", "muda": rr_todos}]

# Grupo 5. Palavras que pareceram juntar com a seguinte no trecho curto da rodada 1: é o trecho ou a frase?
JUNTAS = ["pula", "toca", "entra", "como", "parte", "pedia", "símbolo", "encontre"]


def fonemas_por_palavra(voz, texto):
    fon = []
    for s in voz.phonemize(texto):
        fon += "".join(s).split(" ")
    toks = re.findall(TOKEN, texto)
    if len(toks) != len(fon):
        return None
    return [NFD(f.strip(",.!?:;")) for f in fon]


def posicao(texto, palavra):
    toks = [t.lower() for t in re.findall(TOKEN, texto)]
    return toks.index(palavra) if palavra in toks else None


def sintetizar(voz, texto, comprimento=None, pausa=False):
    """Como `sintetizar` de piper_falar.py, mas com ritmo e pausa escolhidos (sem AJUSTES_PT_BR)."""
    if comprimento is None and not pausa:
        return ns["sintetizar"](voz, texto, True)
    config = SynthesisConfig(length_scale=comprimento or ns["CONFIG"].length_scale, noise_scale=0.4, noise_w_scale=0.5)
    silencio = np.zeros(int(voz.config.sample_rate * ns["PAUSA_ENTRE_FRASES"]), dtype=np.int16)
    pedacos = []
    for i, fonemas in enumerate(voz.phonemize(texto)):
        fonemas = ns["corrigir_fonemas"](fonemas, True)
        if pausa and i == 0:
            fonemas = [",", " "] + fonemas
        audio = voz.phoneme_ids_to_audio(voz.phonemes_to_ids(fonemas), syn_config=config)
        if audio.dtype != np.int16:
            audio = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        if pedacos:
            pedacos.append(silencio)
        pedacos.append(audio)
    return np.concatenate(pedacos)


def gravar(voz, pcm, caminho):
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "f.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(voz.config.sample_rate)
            w.writeframes(pcm.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "64k", str(caminho)], check=True)


def item(voz, palavra, texto, variantes, extra=""):
    """Gera os áudios de um item. Devolve None se o texto não alinha com os fonemas."""
    fon = fonemas_por_palavra(voz, texto)
    pos = posicao(texto, palavra)
    if fon is None or pos is None:
        print(f"  pulado (não alinha): {palavra} | {texto}")
        return None
    cru = fon[pos]
    base = NFD(TROCAS.get(cru, cru))
    iid = hashlib.md5((palavra + "|" + texto + "|" + extra).encode()).hexdigest()[:10]
    saida = []
    for v in variantes:
        txt = v.get("texto", texto)
        novo = v["muda"](base) if "muda" in v else base
        if "muda" in v and novo == base:
            continue  # a mudança não se aplica a esta palavra
        letra = "ABCD"[len(saida)]
        caminho = SAIDA / "audio" / f"{iid}-{letra}.mp3"
        if not caminho.exists():
            antes = TROCAS.get(cru)
            if "muda" in v:
                TROCAS[cru] = novo
            try:
                pcm = sintetizar(voz, txt, v.get("comprimento"), v.get("pausa", False))
            finally:
                if antes is None:
                    TROCAS.pop(cru, None)
                else:
                    TROCAS[cru] = antes
            gravar(voz, pcm, caminho)
        saida.append({"letra": letra, "rot": v["rot"], "desc": v["desc"], "fon": NFC(novo), "texto": txt,
                      "audio": f"audio/{caminho.name}"})
    return {"id": iid, "palavra": palavra, "texto": texto, "cru": NFC(cru), "variantes": saida}


def main():
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)
    rodada1 = json.loads((PASTA / "validacao-ajustes" / "respostas.json").read_text(encoding="utf-8"))["respostas"]
    grupos = [
        {"id": "sozinha", "titulo": "1. Palavra sozinha",
         "pergunta": "Na rodada 1, 54% das palavras sozinhas não ficaram boas em nenhuma versão (o «r» some, soa fanho, come o começo). "
                     "O problema é o ritmo? Compare: atual, só pausa antes, lento + pausa (como os números) e lento + pausa + «r» reforçado.",
         "itens": [item(voz, p, p[0].upper() + p[1:], V_SOZINHA, "sozinha") for p in SOZINHAS]},
        {"id": "grupo_r", "titulo": "2. «r» em grupo de consoantes (tr, dr, gr, br, pr, fr)",
         "pergunta": "O «r» de dentro, vidro, tremendo... some mesmo no meio da frase. Frases novas, com a palavra no meio.",
         "itens": [item(voz, p, t, V_GRUPO, "grupo_r") for p, t in GRUPO_R]},
        {"id": "r_final", "titulo": "3. «r» final de verbo",
         "pergunta": "O «r» final de brincar, entrar, dançar... some. Antes de consoante, antes de vogal e no fim da frase.",
         "itens": [item(voz, p, t, V_FINAL, "r_final") for p, t in R_FINAL]},
        {"id": "posicao", "titulo": "4. A mesma palavra em 5 posições",
         "pergunta": "Mesma palavra sozinha, no começo, no meio (antes de vogal e de consoante) e no fim. "
                     "Mostra se a posição muda o «r»; anote quando o «r» some.",
         "itens": [dict(item(voz, p, t, V_POSICAO, "posicao") or {}, posicao=NOMES_POSICAO[i])
                   for p, ts in POSICOES.items() for i, t in enumerate(ts)]},
    ]
    juntas = []
    for p in JUNTAS:
        r = next((x for x in rodada1 if x["palavra"] == p), None)
        if not r:
            continue
        variantes = [
            {"rot": "Trecho", "desc": "só 3 palavras (como na rodada 1)", "texto": r["trecho"]},
            {"rot": "Frase inteira", "desc": "a frase do site, como o app fala"},
            {"rot": "Frase lenta", "desc": "a frase do site, ritmo 1.3", "comprimento": 1.3},
        ]
        juntas.append(item(voz, p, r["frase"], variantes, "juntas"))
    grupos.append({"id": "juntas", "titulo": "5. Palavras que se juntam com a seguinte",
                   "pergunta": "Na rodada 1, «pula por», «toca no», «como Teo»... soaram como uma palavra só. "
                               "Isso acontece também na frase inteira, ou era só o trecho curto?",
                   "itens": juntas})
    for g in grupos:
        g["itens"] = [i for i in g["itens"] if i and i.get("id")]
        print(f"{g['id']}: {len(g['itens'])} itens")
    usados = {Path(v["audio"]).name for g in grupos for i in g["itens"] for v in i["variantes"]}
    for velho in (SAIDA / "audio").glob("*.mp3"):
        if velho.name not in usados:
            velho.unlink()
    (SAIDA / "dados.json").write_text(json.dumps(grupos, ensure_ascii=False), encoding="utf-8")
    escrever_html(grupos)
    print(f"\n{sum(len(g['itens']) for g in grupos)} itens em {SAIDA / 'index.html'}")


def destacar(texto, palavra):
    m = next((m for m in re.finditer(TOKEN, texto) if m.group().lower() == palavra), None)
    if not m:
        return html.escape(texto)
    return html.escape(texto[: m.start()]) + "<mark>" + html.escape(m.group()) + "</mark>" + html.escape(texto[m.end():])


def escrever_html(grupos):
    partes = []
    for g in grupos:
        linhas = []
        for i in g["itens"]:
            audios = "".join(
                f'<div class="var"><b>{v["letra"]}. {html.escape(v["rot"])}</b> <small>{html.escape(v["desc"])}</small>'
                f'<code>{html.escape(v["fon"])}</code>'
                + (f'<small class="tx">«{html.escape(v["texto"])}»</small>' if v["texto"] != i["texto"] else "")
                + f'<audio controls preload="none" src="{v["audio"]}"></audio></div>'
                for v in i["variantes"]
            )
            if len(i["variantes"]) == 1:  # a troca de hoje já é a versão testada
                opcoes = [("A", "Soa bem"), ("nenhum", "Soa mal")]
            else:
                opcoes = [(v["letra"], f'{v["letra"]} é melhor') for v in i["variantes"]] + [("igual", "Sem diferença"), ("nenhum", "Nenhum serve")]
            votos = "".join(f'<label><input type="radio" name="v{i["id"]}" value="{val}"> {rot}</label>' for val, rot in opcoes)
            pos = f'<br><small class="pos">{html.escape(i["posicao"])}</small>' if i.get("posicao") else ""
            linhas.append(
                f'<tr data-id="{i["id"]}"><td class="pal"><b>{html.escape(i["palavra"])}</b>{pos}</td>'
                f'<td class="frase">{destacar(i["texto"], i["palavra"])}</td><td><div class="vars">{audios}</div></td>'
                f'<td class="voto">{votos}<textarea placeholder="Observação (opcional): o que soa errado?"></textarea></td></tr>'
            )
        partes.append(
            f'<section><h2>{html.escape(g["titulo"])} <small>{len(g["itens"])} itens</small></h2>'
            f'<p class="motivo">{html.escape(g["pergunta"])}</p>'
            f'<table><thead><tr><th>Palavra</th><th>Texto</th><th>Versões</th><th>Decisão</th></tr></thead>'
            f'<tbody>{"".join(linhas)}</tbody></table></section>'
        )
    itens = [{**{k: v for k, v in i.items()}, "grupo": g["id"]} for g in grupos for i in g["itens"]]
    dados = json.dumps(itens, ensure_ascii=False).replace("</", "<\\/")
    (SAIDA / "index.html").write_text(PAGINA.replace("%%SECOES%%", "\n".join(partes)).replace("%%DADOS%%", dados), encoding="utf-8")


PAGINA = """<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Validação de fonemas, rodada 2</title>
<style>
:root{--fg:#1d2330;--bg:#f6f7fb;--card:#fff;--bd:#d9dde8;--a:#b3261e;--n:#146c2e;--ac:#2f5bd8;--av:#8a5a00}
@media(prefers-color-scheme:dark){:root{--fg:#e7e9f0;--bg:#14171f;--card:#1d212c;--bd:#323848;--a:#ff8a80;--n:#7ddf94;--ac:#8fa8ff;--av:#ffcc66}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif;padding:16px}
h1{margin:0 0 4px}h2{margin:28px 0 4px}small{opacity:.7;font-weight:400}
.motivo{margin:0 0 8px;opacity:.85;max-width:900px}
section{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:8px 6px;border-top:1px solid var(--bd);vertical-align:top}
th{border-top:0;font-size:12px;text-transform:uppercase;opacity:.7}
.frase{font-size:18px;max-width:280px}mark{background:color-mix(in srgb,var(--ac) 25%,transparent);color:inherit;border-radius:3px;padding:0 2px}
.pos{color:var(--ac);opacity:1}
.vars{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;min-width:260px}
.var{display:flex;flex-direction:column;gap:2px;font-size:13px}.var code{font:13px ui-monospace,Consolas,monospace;color:var(--n)}
.var .tx{font-style:italic}
audio{height:34px;width:100%}.voto label{display:block;white-space:nowrap;cursor:pointer}
.voto textarea{width:200px;min-height:44px;margin-top:4px;font:inherit}
tr.respondido{background:color-mix(in srgb,var(--n) 9%,transparent)}tr.nenhum{background:color-mix(in srgb,var(--av) 14%,transparent)}
.barra{position:sticky;top:0;background:var(--bg);padding:8px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;z-index:2;border-bottom:1px solid var(--bd)}
button{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--ac);background:transparent;color:var(--ac);cursor:pointer}
#aviso{font-weight:700}
#bloqueio{background:color-mix(in srgb,var(--a) 18%,transparent);border:2px solid var(--a);border-radius:10px;padding:12px 14px;margin:8px 0;font-size:17px}
</style></head><body>
<h1>Validação de fonemas, rodada 2</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py validacao-rodada2</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui.</div>
<p>Cada item tem de 2 a 4 versões (A, B, C, D). O nome e os fonemas da palavra testada aparecem em cada versão. Marque a melhor, «Sem diferença» ou «Nenhum serve», e use a observação para dizer o que soa errado (o «r» some, fanho, rápido demais, junta palavras...).</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-rodada2/respostas.json</code>. Confira o aviso verde na barra.</p>
<div class="barra"><span id="aviso">Carregando respostas…</span><span id="cont"></span><button id="baixar">Baixar cópia</button></div>
%%SECOES%%
<script>
const DADOS=%%DADOS%%;
const linhas=[...document.querySelectorAll('tbody tr[data-id]')];
const aviso=document.getElementById('aviso');
let est={},pronto=false,sujo=false,timer=null;
function status(t,c){aviso.textContent=t;aviso.style.color=c}
function trava(s){document.querySelectorAll('tr[data-id] input,tr[data-id] textarea').forEach(e=>e.disabled=s)}
function pinta(tr){const r=est[tr.dataset.id]||{};tr.className=r.v==='nenhum'?'nenhum':r.v?'respondido':''}
function mostra(tr){const r=est[tr.dataset.id]||{};pinta(tr);
 tr.querySelectorAll('input').forEach(i=>i.checked=i.value===r.v);tr.querySelector('textarea').value=r.nota||''}
function exporta(){return {pagina:'validacao-rodada2',salvo:new Date().toISOString(),
 respostas:DADOS.map(i=>({...i,voto:(est[i.id]||{}).v||null,nota:(est[i.id]||{}).nota||''}))}}
async function envia(){if(!pronto)return;try{
  const r=await fetch('respostas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(exporta())});
  if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();sujo=false;status('✓ Gravado no disco às '+j.salvo,'var(--n)')
 }catch(e){status('✗ NÃO GRAVADO ('+e.message+'). Não feche a página: rode o servidor de novo e mude qualquer resposta.','var(--a)')}}
function grava(){sujo=true;cont();status('Gravando…','var(--av)');clearTimeout(timer);timer=setTimeout(envia,400)}
linhas.forEach(tr=>{const id=tr.dataset.id;
 tr.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{est[id]={...(est[id]||{}),v:i.value};pinta(tr);grava();
  if(i.value==='nenhum')tr.querySelector('textarea').focus()}));
 tr.querySelector('textarea').addEventListener('input',e=>{est[id]={...(est[id]||{}),nota:e.target.value};grava()})});
function cont(){const n=Object.values(est).filter(r=>r.v).length;document.getElementById('cont').textContent=n+' de '+linhas.length+' respondidos'}
trava(true);cont();
if(!location.protocol.startsWith('http')){document.getElementById('bloqueio').hidden=false;status('Respostas não são gravadas (página aberta como arquivo).','var(--a)')}
else fetch('respostas',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(j=>{
 (j.respostas||[]).forEach(r=>{if(r.voto||r.nota)est[r.id]={v:r.voto||undefined,nota:r.nota||''}});
 linhas.forEach(mostra);cont();pronto=true;trava(false);
 status(j.salvo?'✓ Respostas carregadas do disco (gravadas em '+new Date(j.salvo).toLocaleString()+')':'✓ Pronto. Nenhuma resposta gravada ainda.','var(--n)')
}).catch(e=>status('✗ Não consegui ler as respostas do servidor ('+e.message+'). Opções travadas para não apagar o arquivo.','var(--a)'));
function agora(){const d=new Date(),p=x=>String(x).padStart(2,'0');return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())}
document.getElementById('baixar').onclick=()=>{const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(exporta(),null,1)],{type:'application/json'}));
 a.download='respostas-rodada2-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
else:
    main()
