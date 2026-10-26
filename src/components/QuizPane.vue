<script setup>
import { ref, computed } from 'vue'
import { QUIZ } from '../data/quiz.js'

const qi = ref(0)
const qs = ref(0)
const answered = ref(false)
const isCorrect = ref(false)

const isFinished = computed(() => qi.value >= QUIZ.length)
const currentQ = computed(() => QUIZ[qi.value])

const endMessage = computed(() => {
  if (qs.value === 5) return 'Luar biasa! Kamu jago mengenali penipuan.'
  if (qs.value >= 3) return 'Lumayan! Tetap waspada ya.'
  return 'Tidak apa-apa, ayo belajar lagi dan coba ulang.'
})

const waLink = computed(() => {
  const text = '🎮 Skor kuis "Bisakah Kamu Mengenali Penipuan?" aku: ' + qs.value + '/5!\n\nCoba juga dan periksa link atau file mencurigakan dengan Riksa Heula.'
  return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text)
})

function pickAnswer(choice) {
  if (answered.value) return
  const ok = choice === currentQ.value.a
  if (ok) qs.value++
  isCorrect.value = ok
  answered.value = true
}

function nextQuestion() {
  answered.value = false
  qi.value++
}

function restartQuiz() {
  qi.value = 0
  qs.value = 0
  answered.value = false
  isCorrect.value = false
}
</script>

<template>
  <div id="paneQuiz">
    <div id="quizBox" aria-live="polite">
      <!-- Hasil Akhir Kuis -->
      <div v-if="isFinished" class="text-center">
        <div class="text-6xl">🏆</div>
        <p class="text-sm text-slate-600 mt-2">Skor akhir kamu</p>
        <p class="text-6xl font-extrabold title-grad">{{ qs }}/5</p>
        <p class="font-bold mt-2">{{ endMessage }}</p>
        <div class="grid gap-3 mt-5">
          <a
            :href="waLink"
            target="_blank"
            rel="noopener"
            class="rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-3 shadow-md"
          >
            💬 Bagikan Skor ke WhatsApp
          </a>
          <button
            id="qRestart"
            type="button"
            class="btn-soft rounded-2xl font-bold px-4 py-3"
            @click="restartQuiz"
          >
            Ulangi kuis
          </button>
        </div>
      </div>

      <!-- Soal Kuis Aktif -->
      <div v-else>
        <p class="font-extrabold">🎮 Bisakah Kamu Mengenali Penipuan?</p>
        <p class="text-xs text-slate-500">Soal {{ qi + 1 }} dari {{ QUIZ.length }}</p>

        <div class="neo p-4 mt-3">
          <p class="text-xs text-slate-500">{{ currentQ.src }}</p>
          <p class="mt-1 leading-relaxed">{{ currentQ.m }}</p>
        </div>

        <div id="qOpts" class="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            data-a="safe"
            class="btn-soft rounded-2xl font-bold py-3 disabled:opacity-50"
            :disabled="answered"
            @click="pickAnswer('safe')"
          >
            ✅ Aman
          </button>
          <button
            type="button"
            data-a="scam"
            class="btn-soft rounded-2xl font-bold py-3 disabled:opacity-50"
            :disabled="answered"
            @click="pickAnswer('scam')"
          >
            🚨 Penipuan
          </button>
        </div>

        <div v-if="answered" id="qFb" class="mt-4">
          <div
            :class="[isCorrect ? 'st-safe' : 'st-danger', 'border-2 rounded-2xl p-4 text-sm leading-relaxed']"
          >
            <p class="font-extrabold">{{ isCorrect ? '🎉 Benar!' : '😅 Kurang tepat.' }}</p>
            <p class="mt-1">{{ currentQ.e }}</p>
          </div>
          <button
            id="qNext"
            type="button"
            class="btn-main mt-3 w-full rounded-2xl text-white font-extrabold py-3"
            @click="nextQuestion"
          >
            {{ qi + 1 < QUIZ.length ? 'Soal berikutnya' : 'Lihat skor' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
