<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { type MenuOption, darkTheme, lightTheme } from "naive-ui";

const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
const { getProjectFiles, handleProjectFileToOptions, selectedProjectName } =
  useProjectFile();
const fileOptions = ref<MenuOption[]>([]);
const content = ref("");
const filePath = ref("");

async function onChangeProject(projectName: string) {
  selectedProjectName.value = projectName;

  const data = await getProjectFiles(projectName);
  fileOptions.value = handleProjectFileToOptions(data, projectName) as any[];
}

async function onClickFile(path: string) {
  const data: string = await invoke("read_file", {
    path,
  });

  filePath.value = path;
  content.value = data;
}

async function onSaveFile() {
  const data = await invoke("write_file", {
    path: filePath.value,
    content: content.value,
  });
  console.log("onSaveFile: ", data);
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
                <n-menu
                  :collapsed-width="0"
                  :collapsed-icon-size="22"
                  :options="fileOptions"
                  style="height: 100%"
                  @update:value="onClickFile"
                />
              </n-layout-sider>
            </template>
            <template #2>
              <n-layout style="height: 100%">
                <Editor
                  v-if="content && filePath"
                  v-model="content"
                  :filepath="filePath"
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
