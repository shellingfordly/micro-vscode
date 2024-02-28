<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";

const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
const { menuOptions, fileOptions, updateFiles } = useMenu();

async function onUpdateValue(name: string) {
  updateFiles(name);
}

function onClickFile(name: string) {
  console.log("file_name", name);
}
</script>

<template>
  <n-config-provider :theme="theme" style="height: 100%">
    <n-layout style="height: 100%">
      <n-layout-header>
        <n-menu
          mode="horizontal"
          :options="menuOptions"
          @update:value="onUpdateValue"
        />
      </n-layout-header>
      <n-layout has-sider style="height: calc(100% - 74px)">
        <n-layout-sider
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="fileOptions"
            @update:value="onClickFile"
          />
        </n-layout-sider>
        <n-layout> </n-layout>
      </n-layout>
      <n-layout-footer style="padding: 5px 10px; text-align: right">
        CC BY-NC-SA 4.0 2024-PRESENT ©
        <a href="https://github.com/shellingfordly">shellingfordly</a>
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>
