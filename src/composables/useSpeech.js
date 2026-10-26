import { ref, computed } from 'vue'

export function useSpeech() {
  const isSpeaking = ref(false)
  const speakLabel = computed(() => isSpeaking.value ? '⏹️ Hentikan' : '🔊 Dengarkan Hasil')

  function stop() {
    try { speechSynthesis.cancel() } catch {}
    isSpeaking.value = false
  }

  function speak(textParts) {
    if (!('speechSynthesis' in window)) return 'Peramban ini belum mendukung fitur suara.'
    if (speechSynthesis.speaking) { stop(); return null }
    const clean = x => x.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\uFE0F]/gu, '').replace(/\s+/g, ' ').trim()
    const parts = textParts.map(clean)
    const u = new SpeechSynthesisUtterance(parts.join(' '))
    u.lang = 'id-ID'; u.rate = 0.95
    const v = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('id'))
    if (v) u.voice = v
    u.onend = u.onerror = () => { isSpeaking.value = false }
    speechSynthesis.speak(u)
    isSpeaking.value = true
    return null
  }

  return { isSpeaking, speakLabel, speak, stop }
}
