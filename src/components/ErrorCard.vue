<script setup>
defineProps({
  text: { type: String, required: true }
})
</script>

<template>
  <section class="err mt-4 rounded-3xl border-2 p-5" role="alert">
    <p class="font-extrabold">😕 Ada kendala</p>
    <p class="mt-1">{{ text }}</p>
  </section>
</template>
