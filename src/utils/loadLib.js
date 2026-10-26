let jsQRModule = null
export async function ensureJsQR() {
  if (jsQRModule) return jsQRModule
  try {
    const mod = await import('jsqr')
    jsQRModule = mod.default || mod
    return jsQRModule
  } catch {
    return null
  }
}

let h2cModule = null
export async function ensureH2C() {
  if (h2cModule) return h2cModule
  try {
    const mod = await import('html2canvas')
    h2cModule = mod.default || mod
    return h2cModule
  } catch {
    return null
  }
}

export const QR_LIB_ERR = 'Pembaca QR gagal dimuat dari internet. Pastikan Anda online, matikan pemblokir iklan atau VPN yang menahan situs cdn.jsdelivr.net, lalu muat ulang halaman.'
