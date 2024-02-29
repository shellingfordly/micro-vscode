<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
// import { useNotification } from "naive-ui";

const emit = defineEmits(["change", "clone"]);
const { menuOptions } = useMenu();
const showModal = ref(false);
const url = ref("");
const loading = ref(false);
// const message = useNotification();

async function onUpdateValue(key: string) {
  if (key === "clone") {
    showModal.value = true;
    return;
  }

  emit("change", key);
}

async function onClone() {
  loading.value = true;
  const data = await invoke("git_clone", { url: url.value });
  if (data === "ok") {
    showModal.value = false;
  }

  emit("clone", data === "ok");
  loading.value = false;
}
</script>
<template>
  <n-menu
    mode="horizontal"
    :options="menuOptions"
    @update:value="onUpdateValue"
  />
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    style="width: 500px"
    title="git clone"
    size="huge"
    :bordered="false"
  >
    <n-input v-model:value="url" style="margin-bottom: 10px" />
    <n-button :loading="loading" @click="onClone">clone</n-button>
  </n-modal>
</template>
