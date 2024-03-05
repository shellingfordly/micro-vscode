<script setup lang="ts">
import { useProjectStore } from "~/stores/project";

const projectStore = useProjectStore();

function onSaveFileAll() {
  if (projectStore.modifiedFiles.size) {
    projectStore.saveAllFile();
  }
}

function onSaveFile() {
  const filepath =
    !!projectStore.selectFileTab &&
    projectStore.modifiedFiles.has(projectStore.selectFileTab);

  if (filepath) {
    projectStore.saveCurrentFile();
  }
}
</script>

<template>
  <div class="tools">
    <Icon hover title="New File" icon="icon-park-outline:file-addition-one" />
    <Icon hover title="New Folder" icon="codicon:new-folder" />
    <Icon
      hover
      title="Save All"
      icon="codicon:save-all"
      @click="onSaveFileAll"
    />
    <Icon hover title="Save All" icon="codicon:save" @click="onSaveFile" />
  </div>
</template>

<style scoped lang="less">
.tools {
  display: flex;
  justify-content: flex-end;
  padding: 10px;

  > iconify-icon {
    margin-right: 10px;
  }
}
</style>
