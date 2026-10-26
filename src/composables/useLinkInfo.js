import { vt, waitAnalysis, sha256 } from './useVirusTotal.js'

export const SHORTENERS = ['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','is.gd','v.gd','buff.ly','rebrand.ly','cutt.ly','shorturl.at','s.id','rb.gy','tiny.cc','t.ly','bl.ink','adf.ly','shorte.st','bit.do','shp.ee','tkp.me']

export const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }

export const urlId = u => btoa(String.fromCharCode(...new TextEncoder().encode(u))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const worse = (a, b) => ((b.malicious || 0) * 10 + (b.suspicious || 0)) > ((a.malicious || 0) * 10 + (a.suspicious || 0)) ? b : a

async function getJson(u) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 5000)
  try { const r = await fetch(u, { signal: c.signal }); return r.ok ? await r.json() : null } finally { clearTimeout(t) }
}

export async function lookupCountry(host) {
  try {
    let ip = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ? host : null
    if (!ip) { const d = await getJson('https://dns.google/resolve?name=' + encodeURIComponent(host) + '&type=A'); ip = d && d.Answer && (d.Answer.find(x => x.type === 1) || {}).data }
    if (!ip) return null
    const g = await getJson('https://ipwho.is/' + ip)
    if (!g || g.success === false || !g.country_code) return null
    const code = g.country_code.toUpperCase()
    let name = g.country; try { name = new Intl.DisplayNames(['id'], { type: 'region' }).of(code) || name } catch {}
    return { name, flag: String.fromCodePoint(...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) }
  } catch { return null }
}

export async function checkUrl(url, onProgress) {
  const host = hostOf(url)
  const info = { host, isShort: SHORTENERS.includes(host), finalUrl: null, redirected: false, destUnchecked: false, country: null }
  onProgress(info.isShort ? 'Link pendek terdeteksi. Melacak tujuan aslinya…' : 'Mengirim link untuk diperiksa…')
  const r = await vt('/urls', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ url }) })
  onProgress('Menganalisis link…')
  const first = await waitAnalysis(r.data.id)
  let stats = first.stats

  if (info.isShort) {
    const obj = await vt('/urls/' + ((first.meta && first.meta.url_info && first.meta.url_info.id) || urlId(url)))
    const fin = obj && obj.data.attributes.last_final_url
    if (fin && hostOf(fin) && hostOf(fin) !== host) {
      info.finalUrl = fin; info.redirected = true
      onProgress('Memeriksa tujuan asli…', fin)
      try {
        const r2 = await vt('/urls', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ url: fin }) })
        stats = worse(stats, (await waitAnalysis(r2.data.id)).stats)
      } catch (e) { if (e.constructor.name === 'FriendlyError') info.destUnchecked = true; else throw e }
    }
  }
  onProgress('Mengecek lokasi server…', info.finalUrl)
  info.country = await lookupCountry(hostOf(info.finalUrl || url))
  return { stats, info }
}

export async function checkFile(file, onProgress) {
  onProgress('Menyiapkan file…')
  const hash = await sha256(file)
  const known = await vt('/files/' + hash)
  if (known && known.data.attributes.last_analysis_stats) {
    const s = known.data.attributes.last_analysis_stats
    if (s.malicious + s.suspicious + s.harmless + s.undetected > 0) return { stats: s, info: null }
  }
  onProgress('Mengunggah file…')
  const fd = new FormData(); fd.append('file', file)
  const up = await vt('/files', { method: 'POST', body: fd })
  onProgress('Menganalisis file…')
  return { stats: (await waitAnalysis(up.data.id)).stats, info: null }
}
