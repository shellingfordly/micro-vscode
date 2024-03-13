<script setup lang="ts">
import FileMenuTool from "./FileMenuTool.vue";
import SearchTool from "./SearchTool.vue";
import GitTool from "./git-tool/GitTool.vue";

const selectedTab = ref("file");
</script>

<template>
  <n-layout has-sider style="display: flex; height: 100%">
    <n-tabs
      v-model:value="selectedTab"
      key="card-left"
      type="line"
      animated
      placement="left"
      class="w-full h-full"
    >
      <n-tab-pane name="file">
        <template #tab>
          <span i="material-symbols-file-copy-outline-rounded" />
        </template>
        <FileMenuTool />
      </n-tab-pane>
      <n-tab-pane name="search">
        <template #tab>
          <span i="material-symbols-search" />
        </template>
        <SearchTool />
      </n-tab-pane>
      <n-tab-pane name="git" style="width: calc(100% - 51px)">
        <template #tab>
          <span i="ion-ios-git-branch" />
        </template>
        <GitTool />
      </n-tab-pane>
    </n-tabs>
  </n-layout>
</template>

<style scoped>
:deep(.n-tab-pane) {
  padding-left: 0 !important;
}
</style>
