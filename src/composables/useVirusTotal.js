const API_KEY  = import.meta.env.VITE_VT_API_KEY || '787e4b2c19cd6a93bee6bf7629ad7f9eca472ae21419d74bf69cd52ac1e12bd1'
const API_BASE = import.meta.env.VITE_API_BASE || 'https://www.virustotal.com/api/v3'

export class FriendlyError extends Error {}

const sleep = ms => new Promise(r => setTimeout(r, ms))

export async function vt(path, opts = {}) {
  if (!API_KEY || API_KEY.startsWith('MASUKKAN_')) throw new FriendlyError('Layanan belum dikonfigurasi. Hubungi pengelola situs ini.')
  let res
  try {
    res = await fetch(API_BASE + path, { ...opts, headers: { 'x-apikey': API_KEY, accept: 'application/json', ...(opts.headers || {}) } })
  } catch {
    throw new FriendlyError('Tidak bisa terhubung ke layanan pemeriksa. Cek koneksi internet Anda. Jika tetap gagal, coba buka halaman ini lewat alamat localhost atau nonaktifkan pemblokir iklan.')
  }
  if (res.status === 404) return null
  if (res.ok) return res.json()
  if (res.status === 401 || res.status === 403) throw new FriendlyError('Layanan pemeriksa sedang tidak bisa diakses. Silakan hubungi pengelola situs ini.')
  if (res.status === 429) throw Object.assign(new FriendlyError('Sedang banyak yang memeriksa. Tunggu sekitar 1 menit lalu coba lagi. Jika masih gagal, kuota harian layanan mungkin sudah habis, coba lagi besok.'), { status: 429 })
  if (res.status === 400) throw new FriendlyError('Link atau file ini tidak bisa dibaca. Pastikan formatnya benar, contoh: https://contoh.com')
  throw new FriendlyError('Layanan sedang bermasalah (kode ' + res.status + '). Coba lagi beberapa saat lagi.')
}

export async function waitAnalysis(id) {
  for (let i = 0; i < 20; i++) {
    let r
    try { r = await vt('/analyses/' + id) }
    catch (e) { if (e.status === 429 && i < 19) { await sleep(15000); continue } throw e }
    const a = r && r.data.attributes
    if (a && a.status === 'completed') return { stats: a.stats, meta: r.meta }
    await sleep(i < 2 ? 5000 : 10000)
  }
  throw new FriendlyError('Pemeriksaan memakan waktu lebih lama dari biasanya. Coba lagi sebentar lagi.')
}

export async function sha256(file) {
  const buf = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}
