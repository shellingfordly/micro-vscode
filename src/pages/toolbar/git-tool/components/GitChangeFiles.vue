<script setup lang="ts">
import { useGitStore } from '~/stores/git'
import { GitStatus } from '~/constants/enums'
import { useProjectStore } from '~/stores/project'
import type { ChangedFile, GitStageType } from '~/types'

const props = defineProps<{
  stage: GitStageType
}>()

const projectStore = useProjectStore()
const message = useMessage()
const gitStore = useGitStore()
const dialog = useDialog()
const changedFiles = computed(() => gitStore.changedFiles.filter((f) => props.stage === f.stage))

function onOpenFile(file: ChangedFile) {
  if (file.status == GitStatus.Deleted) {
    message.warning(`The file [${file.name}] deleted!`)
    return
  }

  projectStore.getFileContent(file.fullPath)
  projectStore.addFileTab(file.fullPath)
}

async function onAddFile(file: ChangedFile) {
  await gitStore.onGitAdd([file])
  gitStore.updateChangedFiles()
}

async function onUnstageFile(file: ChangedFile) {
  await gitStore.onGitResetHead(file.path)
  gitStore.updateChangedFiles()
}

async function onDiscardChanges(file: ChangedFile) {
  dialog.warning({
    title: 'Discard Changes',
    content: 'Are you sure you want to discard changes in ' + file.path,
    maskClosable: false,
    positiveText: 'Discard Changes',
    negativeText: 'Cancel',
    async onPositiveClick() {
      const success = await gitStore.onDiscardChanges(file)
      if (success) {
        gitStore.updateChangedFiles()
      }
    },
  })
}
</script>
<template>
  <ul>
    <li v-for="file in changedFiles" :class="['file', 'file_' + file.status.toLocaleLowerCase()]">
      <div class="info">
        <span i="vscode-icons-file-type-vue" />
        <span class="ml2">{{ file.name }}</span>
        <span class="ml2 op80">{{ file.path }}</span>
      </div>
      <div class="flex-center space-x-1 w-auto">
        <span class="op-hover hover:op100" i="material-symbols-light-file-open-outline" title="open file" @click="onOpenFile(file)" />
        <span class="op-hover hover:op100 i-codicon-discard" title="Discard changes" @click="onDiscardChanges(file)" />
        <span v-if="file.stage === 'unstage'" class="op-hover hover:op100 i-carbon-add" title="Stage Changes" @click="onAddFile(file)" />
        <span v-else class="op-hover hover:op100 i-ic-baseline-minus" title="Stage Changes" @click="onUnstageFile(file)" />
        <span class="status" :title="file.status">
          {{ file.status.charAt(0) }}
        </span>
      </div>
    </li>
  </ul>
</template>
<style scoped lang="less">
.file {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  width: 100%;

  &_modified .status {
    color: rgb(49 134 176);
  }

  &_deleted {
    .info {
      text-decoration: line-through;
    }

    .status {
      color: rgb(123 63 63);
    }
  }

  &_untracked .status {
    color: rgb(210 185 23);
  }

  .info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.6;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
