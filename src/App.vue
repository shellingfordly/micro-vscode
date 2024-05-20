<script setup lang="ts">
import MainPage from "./pages/Main.vue";
</script>
<template>
  <MainPage oncontextmenu="self.event.returnValue = false" onselectstart="return false" />
</template>
