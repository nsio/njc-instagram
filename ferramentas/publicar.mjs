// Publica no Instagram da NjC os posts cujo horário já chegou e que ainda não têm publicado.json.
// Roda no GitHub Actions (.github/workflows/publicar.yml). Sem dependências.
//
// Variáveis: INSTAGRAM_TOKEN (segredo), IG_USER_ID, PAGES_BASE (onde o GitHub Pages serve as imagens),
// SO_VERIFICAR=1 para só testar o token, sem publicar.
import fs from 'node:fs'
import path from 'node:path'

const API = 'https://graph.facebook.com/v23.0'
const { INSTAGRAM_TOKEN: TOKEN, IG_USER_ID: IG, PAGES_BASE, SO_VERIFICAR } = process.env
if (!TOKEN) throw new Error('Segredo INSTAGRAM_TOKEN não configurado no repositório.')
if (!IG || !PAGES_BASE) throw new Error('IG_USER_ID e PAGES_BASE são obrigatórios.')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function graph(method, endpoint, params = {}) {
  const url = new URL(`${API}/${endpoint}`)
  const body = new URLSearchParams({ ...params, access_token: TOKEN })
  let res
  if (method === 'GET') {
    for (const [k, v] of body) url.searchParams.set(k, v)
    res = await fetch(url)
  } else {
    res = await fetch(url, { method, body })
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) {
    const e = json.error ?? {}
    throw new Error(`Graph ${method} ${endpoint}: ${e.message ?? res.status} (code ${e.code ?? '-'}, subcode ${e.error_subcode ?? '-'})`)
  }
  return json
}

async function esperarContainer(id) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await graph('GET', id, { fields: 'status_code' })
    if (status_code === 'FINISHED') return
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Container ${id} com status ${status_code}`)
    await sleep(4000)
  }
  throw new Error(`Container ${id} não ficou pronto a tempo`)
}

// ── Conta ────────────────────────────────────────────────────────────────────
const conta = await graph('GET', IG, { fields: 'username,media_count' })
console.log(`Conta: @${conta.username} (${conta.media_count} posts)`)
if (SO_VERIFICAR === '1') process.exit(0)

// ── Posts pendentes ──────────────────────────────────────────────────────────
const ROOT = 'posts'
const agora = Date.now()
const pendentes = []
for (const dia of fs.readdirSync(ROOT).sort()) {
  const pDia = path.join(ROOT, dia)
  if (!fs.statSync(pDia).isDirectory()) continue
  for (const slug of fs.readdirSync(pDia).sort()) {
    const dir = path.join(pDia, slug)
    const meta = path.join(dir, 'post.json')
    if (!fs.existsSync(meta) || fs.existsSync(path.join(dir, 'publicado.json'))) continue
    const info = JSON.parse(fs.readFileSync(meta, 'utf-8'))
    if (Date.parse(info.publicar_em) <= agora) pendentes.push({ dir, info })
  }
}
if (!pendentes.length) {
  console.log('Nenhum post pendente.')
  process.exit(0)
}

// Um post por execução: se vários atrasarem, eles saem espaçados, não em rajada.
const { dir, info } = pendentes[0]
const legenda = fs.readFileSync(path.join(dir, 'legenda.txt'), 'utf-8').trim()
const imagens = fs.readdirSync(dir).filter((f) => /^\d+\.jpg$/.test(f)).sort()
if (!imagens.length || imagens.length > 10) throw new Error(`${dir}: precisa de 1 a 10 imagens, tem ${imagens.length}`)
const urls = imagens.map((f) => `${PAGES_BASE}/${dir.split(path.sep).join('/')}/${f}`)
console.log(`Post: ${dir} (${imagens.length} imagens, agendado para ${info.publicar_em})`)

// O GitHub Pages leva alguns minutos para publicar depois do merge. Se ainda não está no ar, tenta na próxima execução.
for (const u of urls) {
  const r = await fetch(u, { method: 'HEAD' })
  if (!r.ok || !(r.headers.get('content-type') ?? '').startsWith('image/jpeg')) {
    console.log(`Imagem ainda não disponível no Pages (${r.status}): ${u}. Tento de novo na próxima execução.`)
    process.exit(0)
  }
}

// Proteção contra post duplicado: se a mesma legenda já está entre os posts recentes, só registra.
const recentes = await graph('GET', `${IG}/media`, { fields: 'id,caption,permalink,timestamp', limit: '15' })
const igual = (recentes.data ?? []).find((m) => (m.caption ?? '').trim() === legenda)
let publicado
if (igual) {
  console.log(`Já publicado antes (${igual.permalink}). Só registrando.`)
  publicado = { media_id: igual.id, permalink: igual.permalink, publicado_em: igual.timestamp }
} else {
  let creationId
  if (urls.length === 1) {
    creationId = (await graph('POST', `${IG}/media`, { image_url: urls[0], caption: legenda })).id
  } else {
    const filhos = []
    for (const u of urls) {
      const { id } = await graph('POST', `${IG}/media`, { image_url: u, is_carousel_item: 'true' })
      filhos.push(id)
    }
    for (const id of filhos) await esperarContainer(id)
    creationId = (await graph('POST', `${IG}/media`, { media_type: 'CAROUSEL', children: filhos.join(','), caption: legenda })).id
  }
  await esperarContainer(creationId)
  const { id } = await graph('POST', `${IG}/media_publish`, { creation_id: creationId })
  const { permalink, timestamp } = await graph('GET', id, { fields: 'permalink,timestamp' })
  publicado = { media_id: id, permalink, publicado_em: timestamp }
  console.log(`Publicado: ${permalink}`)
}
fs.writeFileSync(path.join(dir, 'publicado.json'), JSON.stringify(publicado, null, 2) + '\n')
