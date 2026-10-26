<script setup>
import { inject } from 'vue'

const checkFlow = inject('checkFlow')

function onKeydown(e) {
  if (e.key === 'Enter') {
    checkFlow.submitUrl()
  }
}
</script>

<template>
  <div id="paneUrl">
    <label for="urlInput" class="block font-bold mb-2">Tempel alamat website atau link</label>
    <input
      id="urlInput"
      v-model="checkFlow.urlInput.value"
      type="url"
      inputmode="url"
      placeholder="https://contoh.com/promo-hadiah"
      class="neo-in w-full rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-indigo-300"
      @keydown="onKeydown"
    >
    <button
      id="goUrl"
      class="btn-main mt-4 w-full rounded-2xl text-white text-lg font-extrabold py-4"
      @click="checkFlow.submitUrl"
    >
      Periksa Sekarang
    </button>
  </div>
</template>
