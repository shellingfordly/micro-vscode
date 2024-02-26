<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

const res = ref("");
const url = ref("");
const name = ref("");

async function greet() {
  res.value = await invoke("gitClone", { url: url.value });
  console.log(res.value);
}

async function pull() {
  res.value = await invoke("gitPull", { url: url.value, name: name.value });
  console.log(res.value);
}
</script>

<template>
  <form class="row" @submit.prevent="greet">
    <input id="greet-input" v-model="url" placeholder="Enter a name..." />
    <button type="submit">clone</button>
  </form>
  <p>{{ res }}</p>

  <div class="row">
    <input v-model="name" placeholder="Enter a name..." />
    <button @click="pull">pull</button>
  </div>
</template>
