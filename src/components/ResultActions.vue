<script setup>
import { ref, inject, computed } from 'vue'
import { useSpeech } from '../composables/useSpeech.js'
import { useShare } from '../composables/useShare.js'

const props = defineProps({
  resultData: {
    type: Object,
    required: true
  },
  shareCardEl: {
    type: Object,
    default: null
  }
})

const checkFlow = inject('checkFlow')
const { isSpeaking, speakLabel, speak, stop: stopSpeech } = useSpeech()
const { actMsg, buildWaLink, shareImage, printPdf } = useShare()
const isGeneratingImg = ref(false)

const waLink = computed(() => {
  return buildWaLink(
    props.resultData.level,
    props.resultData.score,
    props.resultData.waTarget,
    props.resultData.mode
  )
})

function onSpeak() {
  actMsg.value = ''
  const rd = props.resultData
  const parts = []
  if (rd.brand) {
    parts.push(`Awas, alamat ini terindikasi meniru ${rd.brand.name}. ${rd.brand.reason} Alamat resmi ${rd.brand.name} antara lain ${rd.brand.official[0]}. Jangan masukkan password, PIN, atau kode OTP di sini.`)
  }
  parts.push(
    rd.L.t,
    `Skor keamanan ${rd.score} dari 100.`,
    rd.L.d,
    rd.advice.meaning,
    'Saran untuk Anda. ' + rd.advice.tips.join(' ')
  )
  const err = speak(parts)
  if (err) actMsg.value = err
}

async function onShareImage() {
  if (isGeneratingImg.value) return
  isGeneratingImg.value = true
  actMsg.value = ''
  try {
    const el = props.shareCardEl || document.getElementById('shareCard')
    await shareImage(el)
  } finally {
    isGeneratingImg.value = false
  }
}

function onPrint() {
  printPdf()
}

function onAgain() {
  stopSpeech()
  checkFlow.resetAll()
}
</script>

<template>
  <div>
    <div class="no-print mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        id="speak"
        type="button"
        class="btn-soft rounded-2xl font-bold px-4 py-3"
        @click="onSpeak"
      >
        {{ speakLabel }}
      </button>

      <a
        id="shareWa"
        :href="waLink"
        target="_blank"
        rel="noopener"
        class="rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-3 shadow-md inline-block text-center"
      >
        💬 Bagikan ke WhatsApp
      </a>

      <button
        id="shareImg"
        type="button"
        class="btn-soft rounded-2xl font-bold px-4 py-3"
        :disabled="isGeneratingImg"
        @click="onShareImage"
      >
        {{ isGeneratingImg ? '⏳ Membuat gambar…' : '🖼️ Bagikan Gambar Kartu' }}
      </button>

      <button
        id="pdfBtn"
        type="button"
        class="btn-soft rounded-2xl font-bold px-4 py-3"
        @click="onPrint"
      >
        📄 Simpan Laporan PDF
      </button>

      <button
        id="again"
        type="button"
        class="btn-soft rounded-2xl font-bold px-4 py-3 sm:col-span-2"
        @click="onAgain"
      >
        Periksa yang lain
      </button>
    </div>

    <p
      v-if="actMsg"
      id="actMsg"
      class="no-print text-xs text-slate-500 mt-2"
      aria-live="polite"
    >
      {{ actMsg }}
    </p>
  </div>
</template>
