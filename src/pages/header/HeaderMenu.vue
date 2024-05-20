<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { createInvoke } from "~/lib/utils/api";

const emit = defineEmits(["change"]);
const showModal = reactive({
  clone: false,
  commit: false,
});
const url = ref("");
const loading = ref(false);
const message = useMessage();
const projectStore = useProjectStore();

async function onUpdateValue(key: string) {
  if (key === "git_clone") {
    showModal.clone = true;
  } else {
    emit("change", key);
  }
}

async function onClone() {
  loading.value = true;
  const { status } = await createInvoke("git_clone", { url: url.value });
  if (status === "ok") {
    showModal.clone = false;
    message.success(`git clone successful!`);
  }
  loading.value = false;
}
</script>
<template>
  <n-menu mode="horizontal" :options="projectStore.projectMenuOptions" @update:value="onUpdateValue" />
  <n-modal v-model:show="showModal.clone" class="w-150" preset="card" title="Git Clone" size="huge" :bordered="false">
    <n-input v-model:value="url" mb3 placeholder="Enter the git clone url" />
    <n-button :loading="loading" @click="onClone">clone</n-button>
  </n-modal>
</template>
