<script setup>
import { provide } from 'vue'
import { useCheckFlow } from './composables/useCheckFlow.js'
import AppHeader from './components/AppHeader.vue'
import TabSwitcher from './components/TabSwitcher.vue'
import UrlPane from './components/UrlPane.vue'
import FilePane from './components/FilePane.vue'
import QrPane from './components/QrPane.vue'
import QuizPane from './components/QuizPane.vue'
import LoadingCard from './components/LoadingCard.vue'
import ErrorCard from './components/ErrorCard.vue'
import QrisCard from './components/QrisCard.vue'
import ResultCard from './components/ResultCard.vue'
import ShareCard from './components/ShareCard.vue'
import AppFooter from './components/AppFooter.vue'

const checkFlow = useCheckFlow()
provide('checkFlow', checkFlow)
</script>

<template>
  <main class="max-w-2xl mx-auto">
    <!-- Header -->
    <AppHeader />

    <!-- Tabs + Input -->
    <section class="card p-5 sm:p-6">
      <TabSwitcher
        :model-value="checkFlow.mode.value"
        @update:model-value="checkFlow.setMode"
      />

      <UrlPane v-show="checkFlow.mode.value === 'url'" />
      <FilePane v-show="checkFlow.mode.value === 'file'" />
      <QrPane v-show="checkFlow.mode.value === 'qr'" />
      <QuizPane v-show="checkFlow.mode.value === 'quiz'" />
    </section>

    <!-- Loading -->
    <LoadingCard
      v-if="checkFlow.state.value === 'loading'"
      :text="checkFlow.loadingText.value"
      :dest="checkFlow.loadingDest.value"
    />

    <!-- Error -->
    <ErrorCard
      v-if="checkFlow.state.value === 'error'"
      :text="checkFlow.errorText.value"
    />

    <!-- QRIS Card -->
    <QrisCard
      v-if="checkFlow.state.value === 'qris' && checkFlow.qrisData.value"
      :data="checkFlow.qrisData.value"
    />

    <!-- Result Card -->
    <ResultCard
      v-if="checkFlow.state.value === 'result' && checkFlow.resultData.value"
      :result-data="checkFlow.resultData.value"
    />

    <!-- Footer -->
    <AppFooter />
  </main>

  <!-- Share Card (Off-screen) -->
  <ShareCard :result-data="checkFlow.resultData.value" />
</template>
