import { ISSUERS, CRITERIA } from '../data/issuers.js'

export function tlv(str) {
  const out = []; let i = 0
  while (i + 4 <= str.length) {
    const len = parseInt(str.substr(i + 2, 2), 10)
    if (isNaN(len) || i + 4 + len > str.length) return null
    out.push([str.substr(i, 2), str.substr(i + 4, len)]); i += 4 + len
  }
  return out
}

export function crc16(str) {
  let c = 0xFFFF
  for (let i = 0; i < str.length; i++) { c ^= str.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) : (c << 1); c &= 0xFFFF }
  return c.toString(16).toUpperCase().padStart(4, '0')
}

export function parseQris(t) {
  const f = tlv(t)
  if (!f) return { title: 'QRIS tidak utuh', pills: [['amber', '⚠️ Data rusak']], rows: [], warns: ['Data di dalam QR ini tidak utuh atau sudah diubah.'], note: 'Jangan lanjutkan pembayaran dengan QR ini. Minta QRIS dari penjual langsung.' }
  const get = k => (f.find(x => x[0] === k) || [])[1]
  const name = get('59'), city = get('60'), post = get('61'), country = get('58'), cur = get('53'), amount = get('54'), init = get('01')
  let issuer = null, nmid = null, crit = null
  for (const [tg, v] of f) {
    if (+tg < 26 || +tg > 51) continue
    const sub = tlv(v) || [], g = k => (sub.find(x => x[0] === k) || [])[1], dom = (g('00') || '').toLowerCase()
    if (dom.includes('qris')) { nmid = nmid || g('02'); crit = crit || g('03') }
    else if (!issuer && dom) { const key = Object.keys(ISSUERS).find(k => dom.includes(k)); issuer = key ? ISSUERS[key] : g('00') }
  }
  const warns = []
  if (t.slice(-8, -4) !== '6304' || crc16(t.slice(0, -4)) !== t.slice(-4).toUpperCase()) warns.push('Kode pengaman QR (CRC) tidak cocok. QR ini kemungkinan sudah diubah atau rusak.')
  if (!name) warns.push('Nama merchant tidak ditemukan di dalam QR.')
  if (country && country !== 'ID') warns.push('Kode negara bukan Indonesia (' + country + '). QRIS resmi memakai ID.')
  if (cur && cur !== '360') warns.push('Mata uang bukan Rupiah. QRIS resmi memakai Rupiah.')
  if (!nmid) warns.push('ID merchant nasional (NMID) tidak ditemukan. QRIS resmi biasanya memilikinya.')
  if (init === '11' && amount) warns.push('QR statis tetapi memuat nominal tetap. Ini tidak lazim, periksa nominalnya.')
  const rows = [
    ['Nama merchant', name || '-'],
    ['Lokasi', [city, post, country].filter(Boolean).join(', ') || '-'],
    ['Pencetak/penerbit QRIS', issuer || 'Tidak terbaca'],
    ['ID merchant nasional (NMID)', nmid || '-'],
    ['Skala usaha', CRITERIA[crit] || crit || '-'],
    ['Jenis QR', init === '12' ? 'Dinamis (nominal sekali pakai)' : init === '11' ? 'Statis (bisa dipakai berulang)' : '-']
  ]
  if (amount) rows.push(['Nominal', 'Rp ' + Number(amount).toLocaleString('id-ID')])
  return {
    title: 'Hasil baca QRIS',
    pills: [warns.length ? ['amber', '⚠️ Ada hal yang janggal'] : ['green', '✅ Format QRIS terbaca wajar (bukan jaminan asli)']],
    rows,
    warns,
    note: 'Cocokkan nama merchant di atas dengan nama toko yang sebenarnya. Jika berbeda, jangan bayar. Periksa juga apakah stiker QRIS ditempel menimpa QRIS asli. Riksa Heula hanya membaca isi QR dan tidak bisa memastikan sebuah QRIS asli atau tiruan.'
  }
}
