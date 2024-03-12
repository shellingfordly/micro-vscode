<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import GitChangeFiles from "./components/GitChangeFiles.vue";
import GitCommitLogs from "./components/GitCommitLogs.vue";

const gitStore = useGitStore();
const message = useMessage();
const dialog = useDialog();

async function onDiscardAllChanges(event: Event) {
  event.stopPropagation();

  dialog.warning({
    title: "Discard Changes",
    content:
      "This is IRREVERSIBLE, your current working set will be FOREVER LOST.",
    positiveText: "Discard All Files",
    negativeText: "Cancel",
    maskClosable: false,
    onPositiveClick: async () => {
      const success = await gitStore.discardChanges("");
      if (success) {
        gitStore.updateChangedFiles();
      }
    },
  });
}

async function onStageAllChanges() {
  console.log(gitStore.logList);
}

async function onClickGit() {
  const success = await gitStore.gitCommit();

  if (success) {
    message.success(`git commit successful!`);
  }
}
</script>
<template>
  <n-layout-sider width="100%" style="height: 100%" :native-scrollbar="false">
    <n-space vertical style="padding: 15px">
      <n-input v-model:value="gitStore.commitMessage" placeholder="search" />
      <n-button secondary block :loading="gitStore.loading" @click="onClickGit">
        <n-space>
          <Icon icon="charm:tick" />
          <span>提交</span>
        </n-space>
      </n-button>
      <n-collapse default-expanded-names="1">
        <n-collapse-item name="1">
          <template #header>
            <div
              style="width: 100%; display: flex; justify-content: space-between"
            >
              <div>Changes</div>
              <div class="tools">
                <Icon
                  class="icon"
                  icon="codicon:discard"
                  title="Discard All changes"
                  @click="onDiscardAllChanges"
                />
                <Icon
                  class="icon"
                  icon="carbon:add"
                  title="Stage All Changes"
                  @click="onStageAllChanges"
                />
              </div>
            </div>
          </template>
          <GitChangeFiles class="changes" />
        </n-collapse-item>
        <n-collapse-item name="2" title="Commits">
          <GitCommitLogs />
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </n-layout-sider>
</template>

<style scoped lang="less">
.tools,
.changes :deep(.tools) {
  display: flex;
  justify-content: flex-end;
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
}
</style>
