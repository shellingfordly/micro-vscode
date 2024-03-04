<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
import { useProjectStore } from "./stores/project";

const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
const projectStore = useProjectStore();
const isShowEditor = computed(
  () => projectStore.fileInfo.content && projectStore.fileInfo.path
);

onMounted(projectStore.getProjectList);

async function onChangeProject(projectName: string) {
  projectStore.selectProjectName = projectName;
}

async function onClickFile(path: string) {
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}

async function onSaveFile() {
  projectStore.saveCurrentFile();
}
</script>

<template>
  <n-config-provider :theme="theme" style="height: 100%">
    <n-message-provider>
      <n-layout style="height: 100%">
        <n-layout-header
          bordered
          style="display: flex; justify-content: space-between"
        >
          <Menu @change="onChangeProject" />
          <Action />
        </n-layout-header>
        <n-layout has-sider style="height: calc(100% - 76px)">
          <n-split
            direction="horizontal"
            style="height: 100%"
            :default-size="0.25"
            :resize-trigger-size="2"
            :max="0.75"
            :min="0.25"
          >
            <template #1>
              <n-layout-sider
                collapse-mode="width"
                :collapsed-width="64"
                width="100%"
                style="height: 100%"
                :native-scrollbar="false"
              >
                <n-layout-header bordered>
                  <Tools />
                </n-layout-header>
                <n-menu
                  :collapsed-width="0"
                  :collapsed-icon-size="22"
                  :options="projectStore.fileMenuOptions"
                  style="height: calc(100% - 50px)"
                  @update:value="onClickFile"
                />
              </n-layout-sider>
            </template>
            <template #2>
              <FileTabs />
              <n-layout style="height: 100%">
                <Editor
                  v-show="isShowEditor"
                  v-model="projectStore.fileInfo.content"
                  :filepath="projectStore.fileInfo.path"
                  @save="onSaveFile"
                />
              </n-layout>
            </template>
          </n-split>
        </n-layout>
        <n-layout-footer bordered style="padding: 5px 10px; text-align: right">
          CC BY-NC-SA 4.0 2024-PRESENT ©
          <a href="https://github.com/shellingfordly">shellingfordly</a>
        </n-layout-footer>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
