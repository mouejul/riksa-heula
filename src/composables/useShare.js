import { ref } from 'vue'
import { ensureH2C } from '../utils/loadLib.js'

export function useShare() {
  const actMsg = ref('')

  function buildWaLink(level, score, target, mode) {
    const isUrl = mode === 'url'
    const head  = { safe: '✅ *Hasil Keamanan Riksa Heula*', warn: '⚠️ *Peringatan Keamanan Riksa Heula*', danger: '⛔ *Bahaya! Laporan Keamanan Riksa Heula*' }[level]
    const label = { safe: 'Aman', warn: 'Peringatan', danger: 'Bahaya' }[level]
    let shown = target, note = ''
    if (isUrl && level !== 'safe') {
      shown = target.replace(/^http/i, 'hxxp').replace(/\./g, '[.]')
      note = '\n_(Link sengaja ditulis tidak bisa diklik demi keamanan. Jangan dibuka.)_'
    }
    const text = `${head}\n\n${isUrl ? 'Link' : 'File'}: ${shown}${note}\nHasil: ${label}\nSkor: ${score}/100\n\n_Cek keamanan link atau file kamu di Riksa Heula._`
    return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text)
  }

  async function shareImage(shareCardEl) {
    actMsg.value = ''
    try {
      const html2canvas = await ensureH2C()
      if (!html2canvas) throw new Error('lib')
      const canvas = await html2canvas(shareCardEl, { scale: 2, backgroundColor: null })
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
      const file = new File([blob], 'riksa-heula-hasil.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], text: 'Hasil pemeriksaan Riksa Heula' })
      else {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'riksa-heula-hasil.png'; a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 4000)
        actMsg.value = 'Gambar tersimpan di perangkat Anda. Silakan kirim lewat WhatsApp.'
      }
    } catch (e) {
      if (!e || e.name !== 'AbortError') actMsg.value = 'Gambar belum bisa dibuat. Pastikan internet aktif lalu coba lagi.'
    }
  }

  function printPdf() {
    window.print()
  }

  return { actMsg, buildWaLink, shareImage, printPdf }
}
