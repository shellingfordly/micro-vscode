<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import { GitStatus } from "~/constants/enums";
import { useProjectStore } from "~/stores/project";
import type { ChangedFile } from "~/types";

const projectStore = useProjectStore();
const message = useMessage();
const gitStore = useGitStore();
const dialog = useDialog();

function onOpenFile(file: ChangedFile) {
  if (file.status == GitStatus.Deleted) {
    message.warning(`The file [${file.name}] deleted!`);
    return;
  }

  projectStore.getFileContent(file.rootPath);
  projectStore.addFileTab(file.rootPath);
}

async function onDiscardChanges(path: string) {
  dialog.warning({
    title: "Discard Changes",
    content: "Are you sure you want to discard changes in " + path,
    maskClosable: false,
    positiveText: "Discard Changes",
    negativeText: "Cancel",
    async onPositiveClick() {
      const success = await gitStore.discardChanges(path);
      if (success) {
        gitStore.updateChangedFiles();
      }
    },
  });
}
</script>
<template>
  <ul class="changes">
    <li
      v-for="[key, file] in gitStore.changedFiles"
      :class="['change-file', 'change-file_' + file.status.toLocaleLowerCase()]"
      :key="key"
    >
      <div class="info">
        <Icon icon="vscode-icons:file-type-vue" />
        <span class="name">{{ file.name }}</span>
        <span class="path">{{ file.path }}</span>
      </div>
      <div class="tools">
        <Icon
          class="icon"
          icon="material-symbols-light:file-open-outline"
          title="open file"
          @click="onOpenFile(file)"
        />
        <Icon
          class="icon"
          icon="codicon:discard"
          title="Discard changes"
          @click="onDiscardChanges(file.path)"
        />
        <Icon class="icon" icon="carbon:add" title="Stage Changes" />
        <span :title="file.status">
          {{ file.status.charAt(0) }}
        </span>
      </div>
    </li>
  </ul>
</template>
<style scoped lang="less">
.changes {
  .change-file {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    width: 100%;

    &_modified {
      .tools > span {
        color: rgb(32, 82, 107);
      }
    }

    &.deleted {
      .info > span {
        text-decoration: line-through;
      }
      .tools > span {
        color: rgb(123, 63, 63);
      }
    }

    &.untracked {
      .tools > span {
        color: rgb(210, 185, 23);
      }
    }

    .info {
      width: calc(100% - 70px);
      cursor: pointer;
      opacity: 0.8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:hover {
        opacity: 1;
      }

      span {
        margin-left: 5px;
      }

      .path {
        margin-left: 10px;
        font-size: 10px;
        opacity: 0.8;
      }
    }

    .tools {
      span {
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
}
</style>
