import { ref, computed } from 'vue'

export function useTheme() {
  const theme = ref(document.documentElement.dataset.theme || 'light')

  const icon = computed(() => theme.value === 'dark' ? '☀️' : '🌙')
  const ariaLabel = computed(() => theme.value === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap')

  function toggle() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    theme.value = next
    try { localStorage.setItem('cek_theme', next) } catch {}
  }

  return { theme, icon, ariaLabel, toggle }
}
