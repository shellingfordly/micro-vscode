<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { CreateIconVNode, getFolderIconName } from "~/utils/iconHandle";

const projectStore = useProjectStore();
const expandedKeys = ref<string[]>([]);

watch(
  () => projectStore.selectProjectName,
  () => {
    expandedKeys.value = [];
  }
);

onMounted(projectStore.getProjectList);

async function onOpenFile(path: string) {
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}

let lastExpandedKeys = new Set<string>();
function onOpenFolder(keys: string[]) {
  expandedKeys.value = [...keys];

  const key = [...keys].pop();
  if (key) lastExpandedKeys.add(key);

  const root = projectStore.fileMenuOptions[0];
  for (const key of lastExpandedKeys) {
    let item: any = root;
    if (!item) continue;

    const l = key.split("/");
    l.shift();
    l.forEach((s) => {
      item = item?.children?.find((item: any) => item.label === s);
    });
    if (!item) continue;

    let iconName = getFolderIconName(item.label);
    if (keys.includes(key) && !item.open) {
      iconName += "-opened";
      item.open = false;
    }
    item.icon = CreateIconVNode(iconName);
  }
}

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
  <n-layout-sider width="100%" style="height: 100%" :native-scrollbar="false">
    <n-layout-header bordered class="tools">
      <Icon hover title="New File" icon="icon-park-outline:file-addition-one" />
      <Icon hover title="New Folder" icon="codicon:new-folder" />
      <Icon
        hover
        title="Save All"
        icon="codicon:save-all"
        @click="onSaveFileAll"
      />
      <Icon hover title="Save All" icon="codicon:save" @click="onSaveFile" />
    </n-layout-header>
    <n-menu
      :collapsed-width="0"
      :collapsed-icon-size="22"
      :options="projectStore.fileMenuOptions"
      style="height: calc(100% - 50px)"
      :expanded-keys="expandedKeys"
      @update:expanded-keys="onOpenFolder"
      @update:value="onOpenFile"
    />
  </n-layout-sider>
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
