<script setup>
import { ref, watch, nextTick, inject } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const checkFlow = inject('checkFlow')
const cardRef = ref(null)

function onBack() {
  checkFlow.hideAll()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => props.data,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      cardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <section id="qrisBox" ref="cardRef" class="card p-6 mt-4 text-left" aria-live="polite">
    <p id="qbTitle" class="text-xl font-extrabold">{{ data.title }}</p>

    <div id="qbPills" class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="([color, text], idx) in data.pills"
        :key="idx"
        :class="'pill pill-' + color"
      >{{ text }}</span>
    </div>

    <div id="qbRows" class="mt-4 space-y-2">
      <div
        v-for="([k, v], idx) in data.rows"
        :key="idx"
        class="neo px-4 py-2 text-sm"
      >
        <span class="text-slate-500">{{ k }}: </span>
        <b class="break-words">{{ v }}</b>
      </div>
    </div>

    <div v-if="data.warns && data.warns.length" id="qbWarns" class="mt-4 space-y-2">
      <div
        v-for="(w, idx) in data.warns"
        :key="idx"
        class="st-warn border-2 rounded-2xl p-3 text-sm"
      >
        ⚠️ {{ w }}
      </div>
    </div>

    <p id="qbNote" class="text-sm text-slate-600 mt-4 leading-relaxed">{{ data.note }}</p>

    <button
      id="qbBack"
      type="button"
      class="btn-soft rounded-2xl font-bold px-6 py-3 mt-4"
      @click="onBack"
    >
      Pindai yang lain
    </button>
  </section>
</template>
