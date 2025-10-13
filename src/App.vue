<script setup>
import { useFiltrosStore } from './stores/filtros'

// App.vue ahora actúa como layout principal
const filtrosStore = useFiltrosStore()
</script>

<template>
  <div id="app">
    <router-view />
  </div>
  <div>{{ filtrosStore.periodo }}</div>
  <div>{{ filtrosStore.tipos }}</div>
  <div>{{ filtrosStore.grupos }}</div>
</template>

<style scoped></style>
