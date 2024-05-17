<script setup lang="ts">
import { useProjectStore } from '../stores/project'

const projectStore = useProjectStore()
const showModal = ref(false)
const fileName = computed(() => projectStore.fileInfo.path.split('/').pop())
const modifiedFiles = computed(() => projectStore.modifiedFiles)

onMounted(projectStore.getProjectList)

function onCloseFileTab(value: string) {
  if (projectStore.modifiedFiles.has(value)) {
    showModal.value = true
    return
  }

  projectStore.closeFileTab(value)
}

function onClickFileTab(path: string) {
  projectStore.getFileContent(path)
}

async function onClickSaveFile() {
  await projectStore.saveCurrentFile()
  projectStore.closeFileTab(projectStore.fileInfo.path)
  showModal.value = false
}

function onClickNotSaveFile() {
  projectStore.notSaveCurrentFile()
  projectStore.closeFileTab(projectStore.fileInfo.path)
  showModal.value = false
}
</script>
<template>
  <n-tabs v-model:value="projectStore.selectFileTab" type="card" closable size="small" @update-value="onClickFileTab" @close="onCloseFileTab">
    <n-tab-pane v-for="tab in projectStore.fileTabs" :key="tab.value" :name="tab.value">
      <template #tab>
        <div style="display: flex; align-items: center">
          <span style="margin-right: 5px">{{ tab.label }}</span>
          <template v-if="modifiedFiles.has(tab.value)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7" />
            </svg>
          </template>
        </div>
      </template>
    </n-tab-pane>
  </n-tabs>

  <n-modal v-model:show="showModal" preset="dialog" type="warning" title="Dialog" :close-on-esc="false">
    <template #header>
      <div>Do you want to save the changes you made to {{ fileName }}?</div>
    </template>
    <div>Your changes will be lost if you don't save them.</div>
    <template #action>
      <n-space>
        <n-button @click="onClickSaveFile">Save</n-button>
        <n-button @click="onClickNotSaveFile">Don't Save</n-button>
        <n-button @click="showModal = false">Cancel</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped lang="less">
.n-tabs .n-tab-pane {
  padding: 0 !important;
}
</style>
