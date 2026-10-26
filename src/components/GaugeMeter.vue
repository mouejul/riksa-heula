<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true
  }
})

const displayedScore = ref(0)
const needleAngle = ref(-90)
let timer = null

function animate() {
  if (timer) clearInterval(timer)
  displayedScore.value = 0
  needleAngle.value = -90

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      needleAngle.value = -90 + props.score * 1.8
    })
  })

  let n = 0
  const step = Math.max(1, Math.round(props.score / 30))
  timer = setInterval(() => {
    n = Math.min(props.score, n + step)
    displayedScore.value = n
    if (n >= props.score) {
      clearInterval(timer)
      timer = null
    }
  }, 30)
}

onMounted(() => {
  animate()
})

watch(() => props.score, () => {
  animate()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div>
    <svg viewBox="0 0 200 120" class="w-64 mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#f43f5e"/>
          <stop offset=".5" stop-color="#fbbf24"/>
          <stop offset="1" stop-color="#34d399"/>
        </linearGradient>
      </defs>
      <path class="track" d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#e8ebf7" stroke-width="18" stroke-linecap="round"/>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#g)" stroke-width="18" stroke-linecap="round"/>
      <g id="needle" class="needle" :style="{ transform: `rotate(${needleAngle}deg)` }">
        <g class="wobble">
          <line x1="100" y1="100" x2="100" y2="38" class="needle-line" stroke-width="5" stroke-linecap="round"/>
        </g>
      </g>
      <circle class="hub" cx="100" cy="100" r="9"/>
    </svg>
    <p class="text-slate-500 font-semibold -mt-1">Skor Keamanan</p>
    <p
      id="score"
      :data-final="score"
      class="text-6xl font-extrabold tracking-tight"
      :class="'sc-' + level"
    >
      {{ displayedScore }}/100
    </p>
  </div>
</template>
