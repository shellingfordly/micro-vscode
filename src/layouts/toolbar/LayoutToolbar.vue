<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import FileTool from "./FileTool.vue";
import Toolbar from "./Toolbar.vue";

const projectStore = useProjectStore();

onMounted(projectStore.getProjectList);

async function onClickFile(path: string) {
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}
</script>

<template>
  <n-layout has-sider style="display: flex; height: 100%">
    <Toolbar />
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="64"
      width="calc(100% - 51px)"
      style="height: 100%"
      :native-scrollbar="false"
    >
      <n-layout-header bordered>
        <FileTool />
      </n-layout-header>
      <n-menu
        :collapsed-width="0"
        :collapsed-icon-size="22"
        :options="projectStore.fileMenuOptions"
        style="height: calc(100% - 50px)"
        @update:value="onClickFile"
      />
    </n-layout-sider>
  </n-layout>
</template>
