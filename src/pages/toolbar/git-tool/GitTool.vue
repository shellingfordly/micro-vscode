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

async function onStageAllChanges(event: Event) {
  event.stopPropagation();

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
    <n-space class="p4" vertical>
      <n-input v-model:value="gitStore.commitMessage" placeholder="search" />
      <n-button secondary block :loading="gitStore.loading" @click="onClickGit">
        <n-space flex-center>
          <span i="charm-tick" />
          <span>提交</span>
        </n-space>
      </n-button>
      <n-collapse>
        <n-collapse-item name="1">
          <template #header>
            <div class="flex-between-center w-full">
              <div>Changes</div>
              <div class="space-x-1">
                <span
                  class="op-hover i-codicon-discard"
                  title="Discard All changes"
                  @click="onDiscardAllChanges"
                />
                <span
                  class="op-hover i-carbon-add"
                  title="Stage All changes"
                  @click="onStageAllChanges"
                />
              </div>
            </div>
          </template>
          <GitChangeFiles />
        </n-collapse-item>
        <n-collapse-item name="2" title="Commits">
          <GitCommitLogs />
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </n-layout-sider>
</template>
