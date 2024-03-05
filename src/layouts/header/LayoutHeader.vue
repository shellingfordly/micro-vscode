<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import HeaderTool from "./HeaderTool.vue";
import HeaderMenu from "./HeaderMenu.vue";

const projectStore = useProjectStore();

onMounted(projectStore.getProjectList);

async function onChangeProject(projectName: string) {
  projectStore.selectProjectName = projectName;
}
</script>
<template>
  <n-layout-header
    bordered
    style="display: flex; justify-content: space-between"
  >
    <HeaderMenu @change="onChangeProject" />
    <HeaderTool />
  </n-layout-header>
</template>
