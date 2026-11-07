"""Procura outras palavras do site que se beneficiam dos mesmos ajustes de fonema já feitos em `piper_falar.py`
(pt-BR, voz Faber) e gera uma página HTML com áudio "atual" x "ajustado" para ouvir e decidir.
Guia: docs/VALIDACAO-FONEMAS.md

  node scripts/fonemas/extrair-palavras.mjs        # gera frases-todas-pt-BR.json
  $PIPER_PYTHON scripts/fonemas/gerar_validacao_ajustes.py [--max-por-regra 40]

Saída (fora do git): referencias-fonemas/validacao-ajustes/index.html e audio/*.mp3
O áudio é um trecho da frase real: palavra anterior + candidata + próxima. Cada regra troca só a candidata; o resto
fica como está hoje (inclusive as trocas já existentes). As respostas saem pelo botão «Salvar respostas» (arquivo .json)."""
import csv
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
SAIDA = PASTA / "validacao-ajustes"
MAX = int(sys.argv[sys.argv.index("--max-por-regra") + 1]) if "--max-por-regra" in sys.argv else 40

# Carrega as funções de piper_falar.py sem rodar a parte de linha de comando (que começa em "modelo = sys.argv[1]").
fonte = (RAIZ / "scripts" / "piper_falar.py").read_text(encoding="utf-8").split("modelo = sys.argv[1]")[0]
ns = {"__name__": "piper_falar"}
exec(compile(fonte, "piper_falar.py", "exec"), ns)
import numpy as np  # noqa: E402
from piper import PiperVoice  # noqa: E402

NASAL = "̃"
VOGAL = "aeiouɛɔɐɪʊ"
NFD = lambda s: unicodedata.normalize("NFD", s)  # noqa: E731
NFC = lambda s: unicodedata.normalize("NFC", s)  # noqa: E731


def bipa():
    banco = {}
    with open(PASTA / "bipa.tsv", encoding="utf-8", newline="") as f:
        for linha in csv.DictReader(f, delimiter="\t"):
            if linha["dialeto"] in {"Brazil", "Rio de Janeiro", "São Paulo", "Southern Brazil"}:
                banco.setdefault(linha["palavra"].lower(), set()).add(NFD(re.sub(r"[ˈˌ.()]", "", linha["pronuncia"])))
    return banco


BANCO = bipa()


def ref(palavra):
    return BANCO.get(palavra, set())


# Cada regra: (id, título, o que o ajuste já feito mostrou, função(palavra, fonemas NFD) -> novos fonemas ou None).
def r_hiato_a(p, f):  # lua
    n = re.sub(r"(ˈ[aeiouɛɔ]ʲ?)ɐ$", r"\1a", f)
    return n if n != f else None


def r_a_final(p, f):  # meta, aventura
    n = re.sub(r"(ˈ[ɛɔu][^" + VOGAL + r"ˈˌ̃]+)ɐ$", r"\1a", f)
    return n if n != f else None


def r_o_final(p, f):  # topo
    n = re.sub(r"(ˈ[oɔ][^" + VOGAL + r"ˈˌ̃]+)ʊ$", r"\1o", f)
    return n if n != f else None


def r_rw(p, f):  # dentro
    n = re.sub(r"ɾw$", "ɾu", f)
    return n if n != f else None


def r_im_final(p, f):  # mim
    n = re.sub("ĩm$", "ĩ", NFC(f))
    return NFD(n) if n != NFC(f) else None


def r_ng(p, f):  # brincar
    n = re.sub(r"(" + NASAL + r")ŋ(?=[kɡ])", r"\1n", f)
    return n if n != f else None


def r_nasal_n(p, f):  # escondidas, jeans
    if not ref(p) or any(re.search(NASAL + "[nm]", r) for r in ref(p)):
        return None
    n = re.sub("(" + NASAL + r")[nmŋ](?=[^" + VOGAL + NASAL + r"ˈˌ])", r"\1", f)
    return n if n != f else None


def r_e_lh(p, f):  # velhinho
    if not any("ɛʎ" in r for r in ref(p)):
        return None
    n = re.sub(r"e(?=ʎ)", "ɛ", f)
    return n if n != f else None


def r_rr(p, f):  # ordens
    n = re.sub(r"(?<=[" + VOGAL + r"])ɾ(?=[^" + VOGAL + NASAL + r"ˈˌʲ\s])", "ɾɾ", f)
    return n if n != f else None


REGRAS = [
    ("hiato_a", "Final «ɐ» depois de vogal tônica → «a»", "lua: o «ɐ» final, mesmo igual ao BIPA, soava estranho.", r_hiato_a),
    ("a_final", "Final «ɐ» depois de «ɛ/ɔ/u» tônico + consoante → «a»", "meta e aventura: o «a» final reduzido soava mal; com «a» pleno ficou certo.", r_a_final),
    ("o_final", "Final «ʊ» depois de «o/ɔ» tônico + consoante → «o»", "topo: o «ʊ» final soava como «r».", r_o_final),
    ("rw", "Final «ɾw» → «ɾu»", "dentro: o final «ɾw» soava errado.", r_rw),
    ("im_final", "«ĩm» final → «ĩ»", "mim: sem o «m» final, como no BIPA, ficou melhor.", r_im_final),
    ("ng", "«ŋ» antes de k/g → «n»", "brincar: «n» no lugar de «ŋ».", r_ng),
    ("nasal_n", "Vogal nasal + «n/m» → só a vogal nasal (quando o BIPA também não tem o «n»)", "escondidas e jeans melhoraram; dentro, aventura e brincar não (por isso vale ouvir um a um).", r_nasal_n),
    ("e_lh", "«e» antes de «lh» → «ɛ» (quando o BIPA tem «ɛ»)", "velhinho/velhinha: com «e» aberto ficou melhor.", r_e_lh),
    ("rr", "«ɾ» no fim de sílaba (antes de consoante) → «ɾɾ»", "ordens: com um só «ɾ» o modelo engolia o «r». Regra ampla: o mais arriscado, ouvir com atenção.", r_rr),
]
JA_TROCADAS = set(ns["TROCAS_PALAVRA_PT_BR"]) | set(ns["TROCAS_PALAVRA_NO_MEIO_PT_BR"])


TOKEN = r"[\wÀ-ÿ'-]+"


def fonemas_por_palavra(voz, texto):
    """Fonemas crus (NFD, sem pontuação) de cada palavra do texto, ou None se palavras e fonemas não alinham."""
    fon = []
    for s in voz.phonemize(texto):
        fon += "".join(s).split(" ")
    toks = re.findall(TOKEN, texto)
    if len(toks) != len(fon):
        return None
    return [NFD(f.strip(",.!?:;")) for f in fon]


def coletar(voz, frases):
    """(palavra, fonemas crus NFD) -> {n, frase mais curta, posição da palavra na frase}."""
    dados = {}
    for frase in frases:
        fon = fonemas_por_palavra(voz, frase)
        if fon is None:
            continue
        for i, (t, f) in enumerate(zip(re.findall(TOKEN, frase), fon)):
            d = dados.setdefault((t.lower(), f), {"n": 0, "frase": frase, "i": i})
            d["n"] += 1
            if len(frase) < len(d["frase"]):
                d["frase"], d["i"] = frase, i
    return dados


def trecho(frase, i):
    """Palavra anterior + palavra i + próxima, com a pontuação do meio. Se o trecho chega ao fim da frase,
    leva a pontuação final (a entonação de fim de frase muda a pronúncia)."""
    toks = list(re.finditer(TOKEN, frase))
    ini = toks[max(i - 1, 0)].start()
    ult = min(i + 1, len(toks) - 1)
    fim = toks[ult].end()
    final = re.match(r"\s*[.!?…]+", frase[fim:]) if ult == len(toks) - 1 else None
    if final:
        fim += final.end()
    return frase[ini:fim].strip(), i - max(i - 1, 0)


def falar(voz, frase, troca, caminho):
    if caminho.exists():
        return
    trocas = ns["TROCAS_PALAVRA_PT_BR"]
    if troca:
        trocas[troca[0]] = troca[1]
    try:
        pcm = ns["sintetizar"](voz, frase, True)
    finally:
        if troca:
            del trocas[troca[0]]
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "f.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(voz.config.sample_rate)
            w.writeframes(pcm.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "64k", str(caminho)], check=True)


def main():
    frases = json.loads((PASTA / "frases-todas-pt-BR.json").read_text(encoding="utf-8"))
    voz = PiperVoice.load(str(RAIZ / "modelos-piper" / "pt_BR-faber-medium.onnx"))
    dados = coletar(voz, frases)
    (SAIDA / "audio").mkdir(parents=True, exist_ok=True)

    secoes, total, usados = [], 0, set()
    for rid, titulo, motivo, regra in REGRAS:
        itens = []
        for (palavra, fon), d in dados.items():
            if len(palavra) < 3 or fon in JA_TROCADAS:
                continue
            novo = regra(palavra, fon)
            if novo:
                itens.append((palavra, fon, novo, d))
        itens.sort(key=lambda i: (-i[3]["n"], i[0]))
        achados = len(itens)
        itens = itens[:MAX]
        print(f"{rid}: {achados} candidatas, {len(itens)} na página")
        linhas = []
        for palavra, fon, novo, d in itens:
            # Só a palavra com a anterior e a próxima. O espeak pode dar outros fonemas à palavra no trecho;
            # nesse caso a regra é aplicada aos fonemas do trecho (ou, se não casar, usa-se o ajuste da frase).
            texto, pos = trecho(d["frase"], d["i"])
            fon_t = fonemas_por_palavra(voz, texto)
            if fon_t is None:  # palavras e fonemas não alinham no trecho: usa a frase inteira
                texto, fon_trecho, novo_trecho = d["frase"], fon, novo
            else:
                fon_trecho = fon_t[pos]
                novo_trecho = novo if fon_trecho == fon else (regra(palavra, fon_trecho) or novo)
            chave = hashlib.md5((fon + "|" + novo + "|" + texto).encode()).hexdigest()[:10]
            atual, ajustado = SAIDA / "audio" / f"{chave}-atual.mp3", SAIDA / "audio" / f"{chave}-ajustado.mp3"
            falar(voz, texto, None, atual)
            falar(voz, texto, (fon_trecho, novo_trecho), ajustado)
            usados.update({atual.name, ajustado.name})
            linhas.append(
                {"id": chave, "regra": rid, "palavra": palavra, "atual": NFC(fon), "novo": NFC(novo), "frase": d["frase"],
                 "trecho": texto, "atual_trecho": NFC(fon_trecho), "novo_trecho": NFC(novo_trecho), "vezes": d["n"],
                 "ref": sorted(NFC(r) for r in ref(palavra))[:3]}
            )
        total += len(linhas)
        secoes.append({"id": rid, "titulo": titulo, "motivo": motivo, "achadas": achados, "itens": linhas})
    (SAIDA / "dados.json").write_text(json.dumps(secoes, ensure_ascii=False), encoding="utf-8")
    escrever_html(secoes)
    for velho in (SAIDA / "audio").glob("*.mp3"):  # áudios de páginas anteriores
        if velho.name not in usados:
            velho.unlink()
    print(f"\n{total} palavras em {SAIDA / 'index.html'}")


VOTOS = [
    ("ajustar", "Ajustar", "o ajustado é melhor"),
    ("manter", "Manter", "o atual é melhor"),
    ("igual", "Manter, sem diferença", "não ouvi diferença"),
    ("nenhum", "Nenhum dos dois", "os dois soam errados"),
]


def destacar(texto, palavra):
    """Trecho com a palavra testada em negrito (a primeira ocorrência)."""
    m = next((m for m in re.finditer(TOKEN, texto) if m.group().lower() == palavra), None)
    if not m:
        return html.escape(texto)
    return html.escape(texto[: m.start()]) + "<mark>" + html.escape(m.group()) + "</mark>" + html.escape(texto[m.end() :])


def escrever_html(secoes):
    partes = []
    for s in secoes:
        linhas = []
        for i in s["itens"]:
            ref_txt = " · ".join(i["ref"]) if i["ref"] else "—"
            no_trecho = ""
            if (i["atual_trecho"], i["novo_trecho"]) != (i["atual"], i["novo"]):
                no_trecho = (f'<br><small>no trecho: <span class="a">{html.escape(i["atual_trecho"])}</span> → '
                             f'<span class="n">{html.escape(i["novo_trecho"])}</span></small>')
            votos = "".join(
                f'<label title="{dica}"><input type="radio" name="v{i["id"]}" value="{v}"> {rotulo}</label>' for v, rotulo, dica in VOTOS
            )
            linhas.append(
                f'<tr data-id="{i["id"]}"><td class="pal"><b>{html.escape(i["palavra"])}</b><br><small>{i["vezes"]}×</small></td>'
                f'<td class="fon"><span class="a">{html.escape(i["atual"])}</span><br><span class="n">{html.escape(i["novo"])}</span>'
                f'{no_trecho}<br><small>BIPA: {html.escape(ref_txt)}</small></td>'
                f'<td class="frase"><span class="trecho">{destacar(i["trecho"], i["palavra"])}</span>'
                f'<br><small>{html.escape(i["frase"])}</small></td>'
                f'<td><div class="par"><label>Atual<audio controls preload="none" src="audio/{i["id"]}-atual.mp3"></audio></label>'
                f'<label>Ajustado<audio controls preload="none" src="audio/{i["id"]}-ajustado.mp3"></audio></label></div></td>'
                f'<td class="voto">{votos}<textarea placeholder="O que incomoda na fala? (ex.: come o começo, o r some, vogal errada...)"></textarea></td></tr>'
            )
        extra = f" (mostrando {len(s['itens'])} das {s['achadas']}, as mais frequentes)" if s["achadas"] > len(s["itens"]) else ""
        partes.append(
            f'<section><h2>{html.escape(s["titulo"])} <small>{s["achadas"]} candidatas{extra}</small></h2>'
            f'<p class="motivo">Ajuste anterior: {html.escape(s["motivo"])}</p>'
            f'<table><thead><tr><th>Palavra</th><th>Fonemas: atual → ajustado</th><th>Trecho (frase inteira embaixo)</th><th>Áudio</th><th>Decisão</th></tr></thead>'
            f'<tbody>{"".join(linhas) or "<tr><td colspan=5>Nenhuma candidata.</td></tr>"}</tbody></table></section>'
        )
    itens = [i for s in secoes for i in s["itens"]]
    dados = json.dumps(itens, ensure_ascii=False).replace("</", "<\\/")
    pagina = PAGINA.replace("%%SECOES%%", "\n".join(partes)).replace("%%DADOS%%", dados)
    (SAIDA / "index.html").write_text(pagina, encoding="utf-8")


PAGINA = """<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Validação de fonemas pt-BR</title>
<style>
:root{--fg:#1d2330;--bg:#f6f7fb;--card:#fff;--bd:#d9dde8;--a:#b3261e;--n:#146c2e;--ac:#2f5bd8;--av:#8a5a00}
@media(prefers-color-scheme:dark){:root{--fg:#e7e9f0;--bg:#14171f;--card:#1d212c;--bd:#323848;--a:#ff8a80;--n:#7ddf94;--ac:#8fa8ff;--av:#ffcc66}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif;padding:16px}
h1{margin:0 0 4px}h2{margin:28px 0 4px}small{opacity:.7;font-weight:400}
.motivo{margin:0 0 8px;opacity:.85}
section{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:8px 6px;border-top:1px solid var(--bd);vertical-align:top}
th{border-top:0;font-size:12px;text-transform:uppercase;opacity:.7}
.fon{font:14px ui-monospace,Consolas,monospace;white-space:nowrap}.a{color:var(--a)}.n{color:var(--n)}
.trecho{font-size:18px}mark{background:color-mix(in srgb,var(--ac) 25%,transparent);color:inherit;border-radius:3px;padding:0 2px}
.frase small{display:inline-block;max-width:320px}
.par{display:flex;gap:10px;flex-wrap:wrap}.par label{display:flex;flex-direction:column;font-size:12px;opacity:.9}
audio{height:34px;width:230px}.voto label{display:block;white-space:nowrap;cursor:pointer}
.voto textarea{display:none;width:220px;min-height:56px;margin-top:4px;font:inherit}
tr.nenhum .voto textarea{display:block}
tr.ajustar{background:color-mix(in srgb,var(--n) 12%,transparent)}tr.manter{background:color-mix(in srgb,var(--a) 10%,transparent)}
tr.igual{background:color-mix(in srgb,var(--fg) 6%,transparent)}tr.nenhum{background:color-mix(in srgb,var(--av) 14%,transparent)}
.barra{position:sticky;top:0;background:var(--bg);padding:8px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;z-index:2;border-bottom:1px solid var(--bd)}
button,.botao{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--ac);background:var(--ac);color:#fff;cursor:pointer}
.botao.sec,button.sec{background:transparent;color:var(--ac)}
#aviso{font-weight:700}
#bloqueio{background:color-mix(in srgb,var(--a) 18%,transparent);border:2px solid var(--a);border-radius:10px;padding:12px 14px;margin:8px 0;font-size:17px}
pre{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px;white-space:pre-wrap;display:none;max-height:40vh;overflow:auto}
</style></head><body>
<h1>Validação de fonemas pt-BR</h1>
<div id="bloqueio" hidden><b>Aberta como arquivo, esta página não grava as respostas.</b> Rode <code>python scripts/fonemas/servir_validacao.py</code> e abra <a href="http://localhost:5198/">http://localhost:5198/</a> num navegador. As opções ficam travadas aqui para não perder trabalho.</div>
<p>Palavras do site parecidas com as que já foram ajustadas em <code>scripts/piper_falar.py</code>. Cada áudio fala só a palavra com a anterior e a próxima (a frase inteira aparece embaixo, em cinza). Ouça o <b>atual</b> e o <b>ajustado</b> e marque uma opção. Em <i>Nenhum dos dois</i>, escreva o que incomoda. Vermelho = fonemas de hoje, verde = ajustado.</p>
<p>Cada resposta é gravada na hora em <code>referencias-fonemas/validacao-ajustes/respostas.json</code> (a versão anterior fica em <code>respostas.anterior.json</code>). Confira o aviso verde na barra.</p>
<div class="barra"><span id="aviso">Carregando respostas…</span><span id="cont"></span>
<button id="baixar" class="sec">Baixar cópia</button><button id="copiar" class="sec">Gerar trocas das «Ajustar»</button></div>
<pre id="saida"></pre>
%%SECOES%%
<script>
const DADOS=%%DADOS%%;
const linhas=[...document.querySelectorAll('tbody tr[data-id]')];
const aviso=document.getElementById('aviso');
let est={},pronto=false,sujo=false,timer=null;
function status(texto,cor){aviso.textContent=texto;aviso.style.color=cor}
function trava(s){document.querySelectorAll('tr[data-id] input,tr[data-id] textarea').forEach(e=>e.disabled=s)}
function mostra(tr){const r=est[tr.dataset.id]||{};tr.className=r.v||'';
 tr.querySelectorAll('input').forEach(i=>i.checked=i.value===r.v);tr.querySelector('textarea').value=r.nota||''}
function exporta(){return {pagina:'validacao-ajustes-ptbr',salvo:new Date().toISOString(),
 respostas:DADOS.map(i=>({...i,voto:(est[i.id]||{}).v||null,nota:(est[i.id]||{}).nota||''}))}}
async function envia(){if(!pronto)return;try{
  const r=await fetch('respostas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(exporta())});
  if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();sujo=false;status('✓ Gravado no disco às '+j.salvo,'var(--n)')
 }catch(e){status('✗ NÃO GRAVADO ('+e.message+'). Não feche a página: rode o servidor de novo e mude qualquer resposta.','var(--a)')}}
function grava(){sujo=true;cont();status('Gravando…','var(--av)');clearTimeout(timer);timer=setTimeout(envia,400)}
linhas.forEach(tr=>{const id=tr.dataset.id;
 tr.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{est[id]={...(est[id]||{}),v:i.value};tr.className=i.value;grava();
  if(i.value==='nenhum')tr.querySelector('textarea').focus()}));
 tr.querySelector('textarea').addEventListener('input',e=>{est[id]={...(est[id]||{}),nota:e.target.value};grava()})});
function cont(){const v=Object.values(est).map(r=>r.v);const n=x=>v.filter(y=>y===x).length;
 document.getElementById('cont').textContent=n('ajustar')+' ajustar · '+n('manter')+' manter · '+n('igual')+' sem diferença · '+n('nenhum')+' nenhum · '+(linhas.length-v.filter(Boolean).length)+' sem resposta'}
trava(true);cont();
if(!location.protocol.startsWith('http')){document.getElementById('bloqueio').hidden=false;status('Respostas não são gravadas (página aberta como arquivo).','var(--a)')}
else fetch('respostas',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(j=>{
 (j.respostas||[]).forEach(r=>{if(r.voto||r.nota)est[r.id]={v:r.voto||undefined,nota:r.nota||''}});
 linhas.forEach(mostra);cont();pronto=true;trava(false);
 status(j.salvo?'✓ Respostas carregadas do disco (gravadas em '+new Date(j.salvo).toLocaleString()+')':'✓ Pronto. Nenhuma resposta gravada ainda.','var(--n)')
}).catch(e=>status('✗ Não consegui ler as respostas do servidor ('+e.message+'). Opções travadas para não apagar o arquivo.','var(--a)'));
function agora(){const d=new Date(),p=x=>String(x).padStart(2,'0');return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())}
document.getElementById('baixar').onclick=()=>{const texto=JSON.stringify(exporta(),null,1);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([texto],{type:'application/json'}));
 a.download='respostas-validacao-'+agora()+'.json';document.body.appendChild(a);a.click();a.remove()};
document.getElementById('copiar').onclick=()=>{const o=document.getElementById('saida');
 o.textContent=DADOS.filter(i=>(est[i.id]||{}).v==='ajustar').map(i=>'    "'+i.atual+'": "'+i.novo+'",  # '+i.palavra).join('\\n')||'(nenhuma marcada)';o.style.display='block'};
addEventListener('beforeunload',e=>{if(sujo){e.preventDefault();e.returnValue=''}});
</script></body></html>
"""

if "--so-html" in sys.argv:  # refaz só a página a partir de dados.json (sem Piper nem áudio)
    escrever_html(json.loads((SAIDA / "dados.json").read_text(encoding="utf-8")))
else:
    main()
