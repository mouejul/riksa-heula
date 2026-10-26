<script setup>
import { useTheme } from '../composables/useTheme.js'
const { icon, ariaLabel, toggle } = useTheme()
</script>

<template>
  <button type="button" class="theme-btn" :aria-label="ariaLabel" @click="toggle">{{ icon }}</button>
</template>
