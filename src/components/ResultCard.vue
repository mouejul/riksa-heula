<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import GaugeMeter from './GaugeMeter.vue'
import BrandWarning from './BrandWarning.vue'
import InfoPanel from './InfoPanel.vue'
import AdviceList from './AdviceList.vue'
import ResultActions from './ResultActions.vue'

const props = defineProps({
  resultData: {
    type: Object,
    required: true
  }
})

const resultRef = ref(null)
const printDate = ref('')
let prevTheme = null

function handleBeforePrint() {
  prevTheme = document.documentElement.dataset.theme
  document.documentElement.dataset.theme = 'light'
  printDate.value = 'Dibuat pada ' + new Date().toLocaleString('id-ID')
}

function handleAfterPrint() {
  if (prevTheme) {
    document.documentElement.dataset.theme = prevTheme
  }
}

onMounted(async () => {
  window.addEventListener('beforeprint', handleBeforePrint)
  window.addEventListener('afterprint', handleAfterPrint)
  await nextTick()
  resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

onUnmounted(() => {
  window.removeEventListener('beforeprint', handleBeforePrint)
  window.removeEventListener('afterprint', handleAfterPrint)
})
</script>

<template>
  <section id="result" ref="resultRef" class="card p-6 mt-4 text-center" aria-live="polite">
    <div class="print-only text-left mb-3">
      <p class="font-extrabold text-lg">Laporan Pemeriksaan Riksa Heula</p>
      <p id="printDate" class="text-xs">{{ printDate }}</p>
    </div>

    <!-- Gauge Meter -->
    <GaugeMeter :score="resultData.score" :level="resultData.level" />

    <!-- Verdict -->
    <div
      id="verdict"
      class="mt-4 rounded-2xl p-4 border-2"
      :class="resultData.L.box"
    >
      <p id="vTitle" class="text-xl font-extrabold">{{ resultData.L.icon }} {{ resultData.L.t }}</p>
      <p id="vText" class="mt-1 text-sm">{{ resultData.L.d }}</p>
    </div>

    <!-- Details -->
    <div class="mt-4 text-left space-y-3">
      <BrandWarning :brand="resultData.brand" />
      <InfoPanel :info="resultData.info" />
      <AdviceList :advice="resultData.advice" />
    </div>

    <p id="vTarget" class="mt-3 text-xs text-slate-500 break-all">{{ resultData.target }}</p>

    <!-- Actions -->
    <ResultActions :result-data="resultData" />
  </section>
</template>
