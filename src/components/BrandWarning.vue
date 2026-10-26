<script setup>
defineProps({
  brand: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div
    v-if="brand"
    id="brandWarn"
    class="st-danger border-2 rounded-2xl p-4 text-sm"
    role="alert"
  >
    🚨 Awas, alamat ini terindikasi meniru {{ brand.name }}. {{ brand.reason }} Alamat resmi {{ brand.name }} antara lain {{ brand.official[0] }}. Jangan masukkan password, PIN, atau kode OTP di sini.
  </div>
</template>
