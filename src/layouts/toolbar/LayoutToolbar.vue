<script setup lang="ts">
import FileMenuTool from "./FileMenuTool.vue";
import SearchTool from "./SearchTool.vue";
import GitTool from "./GitTool.vue";

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
      style="width: 100%; height: 100%"
    >
      <n-tab-pane name="file">
        <template #tab>
          <Icon :size="18" icon="material-symbols:file-copy-outline-rounded" />
        </template>
        <FileMenuTool />
      </n-tab-pane>
      <n-tab-pane name="search">
        <template #tab>
          <Icon :size="18" icon="material-symbols:search" />
        </template>
        <SearchTool />
      </n-tab-pane>
      <n-tab-pane name="git" style="width: calc(100% - 51px)">
        <template #tab>
          <Icon :size="18" icon="ion:ios-git-branch" />
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
