<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Watermark } from "./components/watermark";
const content = ref("vue");
const font = reactive({
  color: "rgba(0,0,0,0.15)",
  fontSize: 14,
});
onMounted(() => {
  setTimeout(() => {
    content.value = "hello vue";
    font.color = "rgba(100,108,255,0.15)";
    font.fontSize = 18;
    console.log(content.value);
  }, 1000 * 5);
});
</script>

<template>
  <div></div>
  <Watermark
    :content="content"
    :font="font"
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
