<script setup lang="ts">
import { useGitStore } from "~/stores/git";

const gitStore = useGitStore();
</script>
<template>
  <n-layout-sider
    width="100%"
    style="height: 100%; padding: 15px"
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
                />
                <Icon class="icon" icon="carbon:reset" />
                <Icon class="icon" icon="carbon:add" />
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
        font-size: 12px;
      }
    }

    .tools {
      width: 70px;

      .icon {
        cursor: pointer;
        border-radius: 2px;
        margin-left: 5px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}
</style>
