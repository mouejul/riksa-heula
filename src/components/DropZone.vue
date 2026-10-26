<script setup>
import { ref } from 'vue'

const props = defineProps({
  emoji: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  note: { type: String, default: '' },
  accept: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Pilih file' }
})

const emit = defineEmits(['file-selected'])

const active = ref(false)
const fileInputRef = ref(null)

function onKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    fileInputRef.value.click()
  }
}

function onDrop(e) {
  active.value = false
  const file = e.dataTransfer.files[0]
  if (file) emit('file-selected', file)
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) emit('file-selected', file)
  e.target.value = ''
}
</script>

<template>
  <div
    class="drop text-center px-4 cursor-pointer"
    :class="[active ? 'active' : '', note ? 'py-10' : 'py-8']"
    tabindex="0"
    role="button"
    :aria-label="ariaLabel"
    @click="fileInputRef.click()"
    @keydown="onKeydown"
    @dragenter.prevent="active = true"
    @dragover.prevent="active = true"
    @dragleave.prevent="active = false"
    @drop.prevent="onDrop"
  >
    <svg class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"><rect class="dash" x="1.5" y="1.5" rx="23" style="width:calc(100% - 3px);height:calc(100% - 3px)"/></svg>
    <div :class="note ? 'text-6xl mb-3' : 'text-5xl mb-2'" aria-hidden="true"><span class="bounce">{{ emoji }}</span></div>
    <p class="font-extrabold" :class="note ? 'text-lg' : ''">{{ title }}</p>
    <p class="text-slate-600 text-sm">{{ subtitle }}</p>
    <p v-if="note" class="text-slate-500 text-xs mt-3">{{ note }}</p>
    <input ref="fileInputRef" type="file" :accept="accept" class="hidden" @change="onFileChange">
  </div>
</template>
