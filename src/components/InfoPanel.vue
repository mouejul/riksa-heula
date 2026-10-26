<script setup>
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    default: null
  }
})

const pills = computed(() => {
  if (!props.info) return []
  const list = []
  list.push(
    props.info.isShort
      ? ['amber', '🕵️ Link disamarkan (pemendek: ' + props.info.host + ')']
      : ['green', '✅ Alamat asli, tidak disamarkan']
  )
  list.push(
    props.info.country
      ? ['blue', props.info.country.flag + ' Server di ' + props.info.country.name]
      : ['gray', '📍 Lokasi server tidak diketahui']
  )
  if (props.info.destUnchecked) {
    list.push(['amber', '⏳ Tujuan asli belum sempat diperiksa penuh'])
  }
  return list
})

const infoNote = computed(() => {
  if (!props.info) return ''
  return (
    (props.info.isShort
      ? 'Link pendek menyembunyikan alamat tujuan sebenarnya, jadi pastikan Anda mengenali tujuannya. '
      : '') +
    'Lokasi server hanya informasi tambahan dan tidak menentukan aman atau tidaknya situs.'
  )
})
</script>

<template>
  <div v-if="info" id="infoPanel" class="neo p-4">
    <p class="font-extrabold">🌐 Info Link</p>
    <p v-if="info.redirected" id="destLine" class="text-sm mt-2">
      Tujuan asli: <b id="destUrl" class="break-all">{{ info.finalUrl }}</b>
    </p>
    <div id="pills" class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="([color, text], idx) in pills"
        :key="idx"
        :class="'pill pill-' + color"
      >{{ text }}</span>
    </div>
    <p id="infoNote" class="text-xs text-slate-500 mt-3 leading-relaxed">
      {{ infoNote }}
    </p>
  </div>
</template>
