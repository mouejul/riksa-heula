import { BRANDS } from '../data/brands.js'

export function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1))
  return d[a.length][b.length]
}

export function brandCheck(host) {
  if (!host) return null
  host = host.toLowerCase().replace(/^www\./, '')
  const leet = host.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/@/g, 'a')
  const tokens = [...new Set(leet.split(/[.\-_]/).filter(Boolean))]
  for (const b of BRANDS) {
    if (b.official.some(d => host === d || host.endsWith('.' + d))) continue
    for (const k of b.keys) {
      if (tokens.includes(k)) return { ...b, reason: 'Nama "' + k + '" dipakai pada alamat yang bukan milik resmi mereka.' }
      if (k.length >= 5 && tokens.some(t => t.includes(k))) return { ...b, reason: 'Nama merek disisipkan pada alamat yang bukan milik resmi mereka.' }
      if (k.length >= 5 && tokens.some(t => t.length >= 5 && lev(t, k) === 1)) return { ...b, reason: 'Ejaannya dibuat mirip nama merek asli.' }
    }
  }
  return null
}
