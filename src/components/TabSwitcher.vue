<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { key: 'url', label: '🔗 Cek Link' },
  { key: 'file', label: '📄 Cek File' },
  { key: 'qr', label: '📷 Scan QR' },
  { key: 'quiz', label: '🎮 Kuis' }
]

const activeIndex = computed(() => tabs.findIndex(t => t.key === props.modelValue))
</script>

<template>
  <div class="relative grid grid-cols-4 p-1.5 rounded-2xl neo-in mb-5" role="tablist">
    <button
      v-for="t in tabs"
      :key="t.key"
      role="tab"
      :aria-selected="modelValue === t.key"
      :class="[
        'tab relative z-10 py-3 font-bold text-xs sm:text-sm transition-colors',
        modelValue === t.key ? 'text-indigo-700' : 'text-slate-500'
      ]"
      @click="emit('update:modelValue', t.key)"
    >{{ t.label }}</button>
    <span class="tab-ind" :style="{ transform: 'translateX(' + activeIndex * 100 + '%)' }" aria-hidden="true"></span>
  </div>
</template>
