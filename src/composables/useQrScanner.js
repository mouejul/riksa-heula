import { ensureJsQR, QR_LIB_ERR } from '../utils/loadLib.js'

let camStream = null
let camRaf = 0

export function stopCam() {
  cancelAnimationFrame(camRaf)
  if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null }
}


function readQrFromImage(img, jsQR) {
  const sc = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas')
  c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc)
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height)
  const d = x.getImageData(0, 0, c.width, c.height)
  return jsQR(d.data, d.width, d.height, { inversionAttempts: 'attemptBoth' })
}

export async function pickQr(file, onResult, onError) {
  if (!file) return
  const jsQR = await ensureJsQR()
  if (!jsQR) return onError(QR_LIB_ERR)
  const img = new Image(), url = URL.createObjectURL(file)
  img.onload = () => {
    const r = readQrFromImage(img, jsQR)
    URL.revokeObjectURL(url)
    r ? onResult(r.data) : onError('QR tidak terbaca. Pastikan QR terlihat jelas, tidak buram, dan memenuhi sebagian besar gambar.')
  }
  img.onerror = () => onError('File ini bukan gambar yang bisa dibaca.')
  img.src = url
}

export async function startCam(videoEl, onResult, onError) {
  if (camStream) { stopCam(); return false }
  const jsQR = await ensureJsQR()
  if (!jsQR) { onError(QR_LIB_ERR); return false }
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  } catch { onError('Kamera tidak bisa dibuka. Izinkan akses kamera, dan buka halaman lewat https atau localhost. Atau unggah foto QR saja.'); return false }
  videoEl.srcObject = camStream; await videoEl.play()
  const c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true })
  const tick = () => {
    if (!camStream) return
    if (videoEl.videoWidth) {
      c.width = videoEl.videoWidth; c.height = videoEl.videoHeight; x.drawImage(videoEl, 0, 0)
      const d = x.getImageData(0, 0, c.width, c.height), r = jsQR(d.data, d.width, d.height)
      if (r && r.data) { stopCam(); onResult(r.data); return }
    }
    camRaf = requestAnimationFrame(tick)
  }
  tick()
  return true
}
