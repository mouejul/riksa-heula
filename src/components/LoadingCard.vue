<script setup>
defineProps({
  text: { type: String, default: 'Sedang memeriksa…' },
  dest: { type: String, default: '' }
})
</script>

<template>
  <section class="card p-8 mt-4 text-center" aria-live="polite">
    <div class="text-5xl spin inline-block">🔍</div>
    <p class="font-bold mt-3">{{ text }}</p>
    <p v-if="dest" class="mt-2 text-sm font-semibold break-all">➡️ Tujuan asli: {{ dest }}</p>
    <p class="text-sm text-slate-500">Biasanya selesai dalam setengah menit.</p>
  </section>
</template>
