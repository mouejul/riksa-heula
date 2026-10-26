<script setup>
import { ref, inject, onUnmounted, nextTick } from 'vue'
import DropZone from './DropZone.vue'
import { pickQr, startCam, stopCam } from '../composables/useQrScanner.js'

const checkFlow = inject('checkFlow')
const camActive = ref(false)
const videoRef = ref(null)

function onFileSelected(file) {
  checkFlow.hideAll()
  pickQr(
    file,
    (data) => checkFlow.handleQr(data),
    (err) => checkFlow.showError(err)
  )
}

async function toggleCam() {
  if (camActive.value) {
    stopCam()
    camActive.value = false
    return
  }
  checkFlow.hideAll()
  camActive.value = true
  await nextTick()
  if (!videoRef.value) return

  const ok = await startCam(
    videoRef.value,
    (data) => {
      camActive.value = false
      checkFlow.handleQr(data)
    },
    (err) => {
      stopCam()
      camActive.value = false
      checkFlow.showError(err)
    }
  )
  if (!ok) {
    camActive.value = false
  }
}

onUnmounted(() => {
  stopCam()
})
</script>

<template>
  <div id="paneQr">
    <p class="font-bold mb-2">Pindai QR Code atau QRIS</p>
    <DropZone
      id="qrDrop"
      emoji="🖼️"
      title="Unggah foto atau tangkapan layar QR"
      subtitle="Gambar hanya dibaca di perangkat Anda, tidak diunggah."
      accept="image/*"
      aria-label="Pilih gambar QR"
      @file-selected="onFileSelected"
    />

    <button
      id="camBtn"
      type="button"
      class="btn-main mt-4 w-full rounded-2xl text-white text-lg font-extrabold py-4"
      @click="toggleCam"
    >
      {{ camActive ? '⏹️ Tutup Kamera' : '📷 Buka Kamera' }}
    </button>

    <div v-show="camActive" id="camWrap" class="mt-4">
      <video id="cam" ref="videoRef" playsinline muted></video>
      <p class="text-center text-sm text-slate-600 mt-2">Arahkan kamera ke QR. Hasil muncul otomatis.</p>
    </div>
  </div>
</template>
