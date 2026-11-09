// Gera as imagens de um carrossel (1080x1350 JPEG) a partir do fonte.mjs da pasta do post.
// Uso: npm run gerar -- posts/2026-11-09/12h00-assunto
// Precisa do Edge ou do Chrome instalado (variável NAVEGADOR para indicar outro caminho).
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const NAVEGADOR = process.env.NAVEGADOR
  ?? ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p))
const W = 1080, H = 1350

const outDir = path.resolve(process.argv[2] ?? '')
const fonte = path.join(outDir, 'fonte.mjs')
if (!fs.existsSync(fonte)) throw new Error(`não achei ${fonte}`)
const assets = pathToFileURL(path.join(HERE, 'assets')).href
const mod = (await import(pathToFileURL(fonte).href)).default
const post = typeof mod === 'function' ? mod({ assets }) : mod
const work = path.join(HERE, 'work')
fs.mkdirSync(work, { recursive: true })
for (const f of fs.readdirSync(outDir)) if (/^\d+\.jpg$/.test(f)) fs.rmSync(path.join(outDir, f))

const logo = `${assets}/logo-simbolo.png`
const accent = post.accent ?? '#2ee6c5'

const css = `
:root{--bg:#070b14;--surface:#0e1524;--line:#1d2842;--text:#eef3fb;--muted:#97a6c0;--accent:${accent};--accent2:#38bdf8}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:${W}px;height:${H}px;padding:72px 88px;display:flex;flex-direction:column;
  background:radial-gradient(900px 600px at 100% 0%, color-mix(in srgb,var(--accent) 14%,transparent), transparent 70%),var(--bg)}
.top{display:flex;align-items:center;justify-content:space-between;font-size:26px;color:var(--muted);font-weight:500}
.brand{display:flex;align-items:center;gap:16px}
.brand img{width:52px;height:52px}
.brand b{color:var(--text);font-weight:700;letter-spacing:.01em}
.pg{font-variant-numeric:tabular-nums;letter-spacing:.06em}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:40px}
.eyebrow{font-size:26px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
h1{font-size:84px;line-height:1.04;font-weight:800;letter-spacing:-.025em;text-wrap:balance}
h2{font-size:68px;line-height:1.06;font-weight:800;letter-spacing:-.02em;text-wrap:balance}
.lead{font-size:38px;line-height:1.32;color:#c9d4e6;text-wrap:pretty}
.lead strong,.hl{color:var(--text);font-weight:700}
ul.items{list-style:none;display:flex;flex-direction:column;gap:22px}
ul.items li{font-size:34px;line-height:1.3;padding-left:44px;position:relative;color:#d6deeb}
ul.items li::before{content:'';position:absolute;left:4px;top:15px;width:16px;height:16px;border-radius:4px;background:var(--accent)}
ul.items li b{color:var(--text)}
.parts{display:flex;flex-direction:column;gap:18px}
.part{display:grid;grid-template-columns:260px 1fr;align-items:center;gap:28px;padding:26px 32px;border:1px solid var(--line);border-radius:22px;background:var(--surface)}
.part .k{font-size:38px;font-weight:800;color:var(--accent)}
.part .v{font-size:32px;line-height:1.28;color:#d6deeb}
ol.steps{list-style:none;counter-reset:s;display:flex;flex-direction:column;gap:18px}
ol.steps li{counter-increment:s;display:grid;grid-template-columns:64px 1fr;align-items:center;font-size:34px;line-height:1.25;color:#d6deeb}
ol.steps li::before{content:counter(s);width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:800;background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--accent)}
.cmp{display:flex;flex-direction:column;gap:16px}
.cmp div{padding:26px 32px;border-radius:20px;font-size:34px;line-height:1.3}
.cmp .bad{border:1px solid #5b2a33;background:#1a0f14;color:#f3b4bf}
.cmp .good{border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);background:color-mix(in srgb,var(--accent) 9%,var(--bg));color:var(--text)}
.cmp small{display:block;font-size:22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;opacity:.85}
.note{font-size:30px;line-height:1.35;color:var(--muted);border-left:4px solid var(--accent);padding-left:26px}
ul.check{list-style:none;display:flex;flex-direction:column;gap:20px}
ul.check li{font-size:32px;line-height:1.28;padding-left:58px;position:relative;color:#d6deeb}
ul.check li::before{content:'';position:absolute;left:0;top:2px;width:36px;height:36px;border-radius:9px;border:3px solid var(--accent)}
.cover-img{margin:28px -88px 0;height:560px;background-size:cover;background-position:center 40%;
  -webkit-mask-image:linear-gradient(to bottom,#000 55%,transparent);mask-image:linear-gradient(to bottom,#000 55%,transparent)}
.cover .main{justify-content:flex-start;gap:30px;margin-top:-40px}
.foot{display:flex;justify-content:space-between;align-items:center;font-size:26px;color:var(--muted);font-weight:500}
.foot .swipe{color:var(--text);font-weight:700}
.cta-box{padding:40px 44px;border-radius:28px;border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);background:color-mix(in srgb,var(--accent) 8%,var(--surface));display:flex;flex-direction:column;gap:18px}
.cta-box .t{font-size:40px;font-weight:800;line-height:1.15}
.cta-box .d{font-size:30px;line-height:1.35;color:#c9d4e6}
.url{font-size:44px;font-weight:800;background:linear-gradient(90deg,var(--accent2),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent}
`

function page(slide, i, n) {
  const last = i === n - 1
  const top = `<div class="top"><div class="brand"><img src="${logo}"><span><b>NjC-IA</b> · ${post.produto}</span></div><span class="pg">${i + 1}/${n}</span></div>`
  const foot = `<div class="foot"><span>njc-ia.com/blog</span>${last ? '' : '<span class="swipe">Arraste →</span>'}</div>`
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=block" rel="stylesheet">
<style>${css}</style></head><body><div class="slide ${slide.cls ?? ''}">${top}${slide.html}${foot}</div></body></html>`
}

const n = post.slides.length
post.slides.forEach((s, i) => {
  const html = path.join(work, `s${i + 1}.html`)
  const png = path.join(work, `s${i + 1}.png`)
  fs.writeFileSync(html, page(s, i, n))
  if (fs.existsSync(png)) fs.rmSync(png)
  execFileSync(NAVEGADOR, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--user-data-dir=${path.join(work, 'perfil-navegador')}`, `--window-size=${W},${H}`, '--virtual-time-budget=6000',
    '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(html).href], { stdio: 'ignore' })
})
for (let i = 0; i < n; i++) {
  const png = path.join(work, `s${i + 1}.png`)
  const out = path.join(outDir, `${String(i + 1).padStart(2, '0')}.jpg`)
  await sharp(png).resize(W, H, { fit: 'cover', position: 'top' }).flatten({ background: '#070b14' })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(out)
  const m = await sharp(out).metadata()
  console.log(path.basename(out), m.width + 'x' + m.height)
}
fs.writeFileSync(path.join(outDir, 'legenda.txt'), post.legenda.trim() + '\n')
