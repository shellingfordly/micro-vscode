<script setup lang="ts">
import FileMenu from "./FileMenu.vue";

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
      style="height: 100%"
    >
      <n-tab-pane name="file">
        <template #tab>
          <Icon :size="18" icon="material-symbols:file-copy-outline-rounded" />
        </template>
        <FileMenu />
      </n-tab-pane>
      <n-tab-pane name="search">
        <template #tab>
          <Icon :size="18" icon="material-symbols:search" />
        </template>
        <n-layout-sider
          width="100%"
          style="height: 100%"
          :native-scrollbar="false"
        >
          search content
        </n-layout-sider>
      </n-tab-pane>
      <n-tab-pane name="git">
        <template #tab>
          <Icon :size="18" icon="ion:ios-git-branch" />
        </template>
        <n-layout-sider
          width="100%"
          style="height: 100%"
          :native-scrollbar="false"
        >
          git content
        </n-layout-sider>
      </n-tab-pane>
    </n-tabs>
  </n-layout>
</template>

<style scoped>
:deep(.n-tab-pane) {
  padding-left: 0 !important;
}
</style>
