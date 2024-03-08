<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import { useProjectStore } from "~/stores/project";

const gitStore = useGitStore();
const projectStore = useProjectStore();

function onOpenFile(path: string) {
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}

function onDiscardChanges(path: string) {}
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
        <n-collapse-item title="更改" name="1">
          <ul>
            <li v-for="file in gitStore.changedFiles">
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
                  @click="onOpenFile(file.rootPath)"
                />
                <Icon
                  class="icon"
                  icon="codicon:discard"
                  title="Discard changes"
                  @click="onDiscardChanges(file.rootPath)"
                />
                <Icon class="icon" icon="carbon:add" title="Stage Changes" />
                <span :title="file.status">{{ file.status.charAt(0) }}</span>
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

    .info {
      width: calc(100% - 70px);
      cursor: pointer;
      opacity: 0.7;
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
        opacity: 0.6;
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
