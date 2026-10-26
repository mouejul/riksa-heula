<script setup>
import { computed } from 'vue'

const props = defineProps({
  resultData: {
    type: Object,
    default: null
  }
})

const icon = computed(() => props.resultData?.L?.icon || '')
const title = computed(() => props.resultData?.L?.t || '')
const primaryColor = computed(() => props.resultData?.C?.[0] || '')
const bgColor = computed(() => props.resultData?.C?.[1] || '#fff')
const scoreText = computed(() => props.resultData ? `${props.resultData.score}/100` : '')
const targetText = computed(() => {
  if (!props.resultData) return ''
  const prefix = props.resultData.mode === 'url' ? 'Link: ' : 'File: '
  return prefix + props.resultData.target.slice(0, 90)
})
const dateText = computed(() => {
  return new Date().toLocaleString('id-ID') + ' | Diperiksa dengan Riksa Heula'
})
</script>

<template>
  <div
    id="shareCard"
    aria-hidden="true"
    style="position:fixed;left:-10000px;top:0;width:540px;padding:36px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:linear-gradient(160deg,#e3e7f4,#dcf4ea);color:#1f2a4d"
  >
    <div style="font-weight:800;font-size:22px">🛡️ Riksa Heula</div>
    <div id="scBox" :style="{ marginTop: '20px', borderRadius: '28px', padding: '32px', textAlign: 'center', background: bgColor }">
      <div id="scE" style="font-size:64px">{{ icon }}</div>
      <div id="scT" :style="{ fontSize: '26px', fontWeight: '800', marginTop: '8px', lineHeight: '1.25', color: primaryColor }">{{ title }}</div>
      <div style="margin-top:18px;font-size:15px;color:#667">Skor Keamanan</div>
      <div id="scS" :style="{ fontSize: '72px', fontWeight: '800', lineHeight: '1.1', color: primaryColor }">{{ scoreText }}</div>
      <div id="scU" style="margin-top:16px;font-size:14px;color:#556;word-break:break-all">{{ targetText }}</div>
    </div>
    <div id="scD" style="margin-top:16px;text-align:center;font-size:13px;color:#667">{{ dateText }}</div>
  </div>
</template>
