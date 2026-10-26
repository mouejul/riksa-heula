<script setup>
defineProps({
  advice: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="space-y-3">
    <div class="neo p-4">
      <p class="font-extrabold">🔎 Apa artinya?</p>
      <p id="vMeaning" class="text-sm text-slate-700 mt-1 leading-relaxed">{{ advice.meaning }}</p>
      <p id="vCount" class="text-xs text-slate-500 mt-2">{{ advice.count }}</p>
    </div>
    <div class="neo p-4">
      <p class="font-extrabold">👉 Yang sebaiknya Anda lakukan</p>
      <ul id="vTips" class="mt-2 space-y-2 text-sm text-slate-700 leading-relaxed">
        <li
          v-for="(tip, idx) in advice.tips"
          :key="idx"
          class="flex gap-2"
        >
          <span aria-hidden="true">{{ advice.icon }}</span>
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
