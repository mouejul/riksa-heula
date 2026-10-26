export function interpret(s) {
  const bad = s.malicious || 0, sus = s.suspicious || 0
  if (bad >= 3) return { level: 'danger', score: Math.max(3, 35 - bad * 2) }
  if (bad > 0 || sus > 0) return { level: 'warn', score: Math.max(45, 75 - bad * 10 - sus * 5) }
  return { level: 'safe', score: 100 }
}

export const LOOK = {
  safe:   { box: 'st-safe', icon: '✅', t: 'Aman! Tidak ditemukan ancaman.', d: 'Tidak ada tanda bahaya yang ditemukan.' },
  warn:   { box: 'st-warn',     icon: '⚠️', t: 'Peringatan! Terdeteksi mencurigakan.', d: 'Belum tentu berbahaya, tapi sebaiknya jangan dibuka dulu.' },
  danger: { box: 'st-danger',       icon: '⛔', t: 'Bahaya! Terdeteksi memuat virus/malware.', d: 'Jangan dibuka. Ini sangat berisiko bagi Anda.' }
}
