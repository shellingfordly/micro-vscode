<script setup lang="ts">
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();
const isShowEditor = computed(() => projectStore.fileInfo.path);

onMounted(projectStore.getProjectList);

async function onSaveFile() {
  projectStore.saveCurrentFile();
}
</script>

<template>
  <n-layout h-full>
    <FileTabs />
    <n-layout style="height: calc(100% - 47px)">
      <Editor v-show="isShowEditor" v-model="projectStore.fileInfo.content" :filepath="projectStore.fileInfo.path" @save="onSaveFile" />
    </n-layout>
  </n-layout>
</template>
