<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
import { useProjectStore } from "../stores/project";
import LayoutHeader from "./header/LayoutHeader.vue";
import LayoutFooter from "./LayoutFooter.vue";
import LayoutToolbar from "./toolbar/LayoutToolbar.vue";
import LayoutContent from "./content/LayoutContent.vue";

const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
const projectStore = useProjectStore();

onMounted(projectStore.getProjectList);
</script>

<template>
  <n-config-provider :theme="theme" style="height: 100%">
    <n-message-provider>
      <n-modal-provider>
        <n-layout style="height: 100%">
          <LayoutHeader />
          <n-layout has-sider style="height: calc(100% - 76px)">
            <n-split
              direction="horizontal"
              style="height: 100%"
              :default-size="0.28"
              :resize-trigger-size="2"
              :max="0.75"
              :min="0.28"
            >
              <template #1>
                <LayoutToolbar />
              </template>
              <template #2>
                <LayoutContent />
              </template>
            </n-split>
          </n-layout>
          <LayoutFooter />
        </n-layout>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>
