<script setup>
import { ref, inject, watch } from 'vue'
import DropZone from './DropZone.vue'

const MAX_SIZE = 32 * 1024 * 1024

const checkFlow = inject('checkFlow')
const chosenFile = ref(null)

function clearFile() {
  chosenFile.value = null
  checkFlow.hideAll()
}

function onPickFile(f) {
  checkFlow.hideAll()
  if (!f) return
  if (f.size > MAX_SIZE) {
    clearFile()
    checkFlow.showError('File ini lebih dari 32 MB, terlalu besar untuk diperiksa di sini. Coba file yang lebih kecil.')
    return
  }
  chosenFile.value = f
}

function onSubmit() {
  if (chosenFile.value) {
    checkFlow.submitFile(chosenFile.value)
  }
}

watch(() => checkFlow.fileResetTrigger.value, () => {
  chosenFile.value = null
})
</script>

<template>
  <div id="paneFile">
    <DropZone
      id="drop"
      emoji="📂"
      title="Tarik file ke sini"
      subtitle="atau klik untuk memilih dari perangkat Anda"
      note="Maksimal 32 MB. Hindari dokumen rahasia karena file diperiksa oleh VirusTotal."
      aria-label="Pilih file"
      @file-selected="onPickFile"
    />

    <div v-if="chosenFile" id="fileRow" class="mt-3">
      <div class="neo flex items-center justify-center gap-2 px-3 py-2">
        <span aria-hidden="true">📎</span>
        <span id="fileName" class="font-semibold text-indigo-700 truncate min-w-0">{{ chosenFile.name }}</span>
        <button
          id="clearFile"
          type="button"
          aria-label="Batal atau ganti file"
          class="btn-clear shrink-0 rounded-full font-bold text-sm px-3 py-1"
          @click.stop="clearFile"
        >
          ✖ Ganti file
        </button>
      </div>
    </div>

    <button
      id="goFile"
      class="btn-main mt-4 w-full rounded-2xl text-white text-lg font-extrabold py-4"
      :disabled="!chosenFile"
      @click="onSubmit"
    >
      Periksa Sekarang
    </button>
  </div>
</template>
