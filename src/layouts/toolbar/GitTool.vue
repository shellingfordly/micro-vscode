<script setup lang="ts">
import { useModal } from "naive-ui";
import { GitStatus } from "~/constants/enums";
import { useGitStore } from "~/stores/git";
import { useProjectStore } from "~/stores/project";
import { ChangedFile } from "~/types";

const gitStore = useGitStore();
const projectStore = useProjectStore();
const modal = useModal();
const message = useMessage();

function onOpenFile(file: ChangedFile) {
  if (file.status == GitStatus.Deleted) {
    message.warning("文件已删除！");
    return;
  }

  projectStore.getFileContent(file.rootPath);
  projectStore.addFileTab(file.rootPath);
}

async function onDiscardChanges(path: string) {
  modal.create({
    title: "Discard Changes",
    content: "Are you sure you want to discard changes in " + path,
    preset: "dialog",
    maskClosable: false,
    closable: false,
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
  <n-layout-sider
    width="100%"
    style="height: 100%; padding: 10px"
    :native-scrollbar="false"
  >
    <n-space vertical>
      <n-input placeholder="search" />
      <n-button secondary block>
        <n-space>
          <Icon icon="charm:tick" />
          <span>提交</span>
        </n-space>
      </n-button>
      <n-collapse default-expanded-names="1">
        <n-collapse-item title="Changes" name="1">
          <ul>
            <li
              v-for="file in gitStore.changedFiles"
              :class="[file.status.toLocaleLowerCase()]"
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
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </n-layout-sider>
</template>
<style scoped lang="less">
ul {
  margin: 0;
  padding: 0;
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    width: 100%;

    &.modified {
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
      display: flex;
      align-items: center;
      width: 90px;

      .icon {
        cursor: pointer;
        border-radius: 2px;
        margin-left: 5px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }

      span {
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
}
</style>
