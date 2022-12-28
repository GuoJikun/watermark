<script setup lang="ts">
import { Watermark } from "./components/watermark";
</script>

<template>
  <div></div>
  <Watermark
    :content="['Vite', 'Vue']"
    :font="{ color: 'rgba(100,108,255,0.15)', fontSize: 12 }"
    style="height: 60vh; width: 1000px"
  />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
