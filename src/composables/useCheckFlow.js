import { ref } from 'vue'
import { FriendlyError } from './useVirusTotal.js'
import { checkUrl, checkFile, hostOf } from './useLinkInfo.js'
import { brandCheck } from './useBrandCheck.js'
import { interpret, LOOK } from '../utils/interpret.js'
import { adviceFor } from '../data/advice.js'
import { parseQris } from './useQris.js'
import { stopCam } from './useQrScanner.js'

export function useCheckFlow() {
  const state = ref('idle')
  const mode = ref('url')
  const loadingText = ref('')
  const loadingDest = ref('')
  const errorText = ref('')
  const resultData = ref(null)
  const qrisData = ref(null)
  const busy = ref(false)
  const urlInput = ref('')
  const fileResetTrigger = ref(0)

  function hideAll() {
    state.value = 'idle'
    try { speechSynthesis.cancel() } catch {}
  }

  function showError(msg) {
    hideAll()
    state.value = 'error'
    errorText.value = msg
  }

  function showLoading(t, dest) {
    hideAll()
    state.value = 'loading'
    loadingText.value = t
    loadingDest.value = dest || ''
  }

  function setMode(m) {
    mode.value = m
    stopCam()
    hideAll()
  }

  async function run(task, target) {
    if (busy.value) return
    busy.value = true
    try {
      const res = await task()
      showResult(res.stats, target, res.info)
    } catch (e) {
      showError(e instanceof FriendlyError ? e.message : 'Terjadi kesalahan tak terduga. Coba lagi ya.')
    } finally {
      busy.value = false
    }
  }

  function showResult(stats, target, info) {
    let { level, score } = interpret(stats)
    const brand = (mode.value === 'url') ? brandCheck(hostOf((info && info.finalUrl) || target)) : null
    if (brand && level === 'safe') { level = 'warn'; score = Math.min(score, 55) }
    const L = LOOK[level]
    const advice = adviceFor(level, mode.value, stats)
    const C = { safe: ['#059669', '#ecfdf5'], warn: ['#d97706', '#fffbeb'], danger: ['#e11d48', '#fff1f2'] }[level]

    resultData.value = {
      level, score, target, info, brand, advice, L, C,
      stats,
      waTarget: (info && info.redirected) ? info.finalUrl : target,
      mode: mode.value
    }
    state.value = 'result'
  }

  function showQrisBox(data) {
    hideAll()
    state.value = 'qris'
    qrisData.value = data
  }

  function handleQr(text) {
    hideAll()
    const t = text.trim()
    if (t.startsWith('000201')) {
      showQrisBox(parseQris(t))
      return
    }
    const m = t.match(/https?:\/\/[^\s]+/i) || (/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(t) ? [t] : null)
    if (m) {
      const u = /^https?:\/\//i.test(m[0]) ? m[0] : 'https://' + m[0]
      setMode('url')
      urlInput.value = u
      return run(() => checkUrl(u, (text, dest) => showLoading(text, dest)), u)
    }
    showQrisBox({
      title: 'QR berisi teks biasa',
      pills: [['gray', 'ℹ️ Bukan link dan bukan QRIS']],
      rows: [['Isi QR', t.slice(0, 300)]],
      warns: [],
      note: 'Isi QR ini bukan link, jadi tidak diperiksa ke VirusTotal. Jangan menuruti perintah di dalamnya jika berasal dari sumber yang tidak dikenal.'
    })
  }

  function submitUrl() {
    let u = urlInput.value.trim()
    if (!u) return showError('Tempel dulu alamat link yang ingin diperiksa.')
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    try { new URL(u) } catch { return showError('Format link belum benar. Contoh: https://contoh.com') }
    run(() => checkUrl(u, (t, d) => showLoading(t, d)), u)
  }

  function submitFile(file) {
    if (file) run(() => checkFile(file, (t, d) => showLoading(t, d)), file.name)
  }

  function resetAll() {
    urlInput.value = ''
    fileResetTrigger.value++
    hideAll()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    state, mode, loadingText, loadingDest, errorText, resultData, qrisData, busy,
    urlInput, fileResetTrigger,
    hideAll, showError, showLoading, setMode, run, showResult, showQrisBox, handleQr,
    submitUrl, submitFile, resetAll
  }
}
