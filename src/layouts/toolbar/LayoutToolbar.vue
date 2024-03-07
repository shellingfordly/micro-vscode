<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import FileTool from "./FileTool.vue";
import Toolbar from "./Toolbar.vue";
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

async function onClickFile(path: string) {
  console.log(path);
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}

let lastExpandedKeys = new Set<string>();
function onClickFolder(keys: string[]) {
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
        :expanded-keys="expandedKeys"
        @update:expanded-keys="onClickFolder"
        @update:value="onClickFile"
      />
    </n-layout-sider>
  </n-layout>
</template>
