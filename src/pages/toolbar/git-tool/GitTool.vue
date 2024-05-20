<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import GitChangeFiles from "./components/GitChangeFiles.vue";
import GitCommitLogs from "./components/GitCommitLogs.vue";
import { ChangedFile } from "~/types";
import { useProjectStore } from "~/stores/project";

const gitStore = useGitStore();
const projectStore = useProjectStore();
const message = useMessage();
const dialog = useDialog();
const options = [
  {
    label: "pull",
    key: "pull",
  },
  {
    label: "push",
    key: "push",
  },
];

async function onDiscardAllChanges(event: Event) {
  event.stopPropagation();

  dialog.warning({
    title: "Discard Changes",
    content: "This is IRREVERSIBLE, your current working set will be FOREVER LOST.",
    positiveText: "Discard All Files",
    negativeText: "Cancel",
    maskClosable: false,
    onPositiveClick: async () => {
      const success = await gitStore.onDiscardChanges({} as any);
      if (success) {
        gitStore.updateChangedFiles();
      }
    },
  });
}

async function onStageAllChanges(event: Event) {
  event.stopPropagation();

  const files: ChangedFile[] = gitStore.getChangeFilesByStageType("unstage");

  if (files.length) {
    await gitStore.onGitAdd(files);
    gitStore.updateChangedFiles();
  }
}

async function onUnstageAllChanges(event: Event) {
  event.stopPropagation();

  await gitStore.onGitResetHead();
  gitStore.updateChangedFiles();
}

async function onClickGit() {
  const success = await gitStore.onGitCommit();

  if (success) {
    message.success(`Git commit successful!`);
    gitStore.commitMessage = "";
    gitStore.updateChangedFiles();
    gitStore.updateLogList();
  }
}

async function onSelect(key: string) {
  if (key === "pull") {
    const success = await gitStore.onGitPull();
    if (success) message.success(`Git pull successful!`);
  } else if (key === "push") {
    const success = await gitStore.onGitPush();
    if (success) message.success(`Git push successful!`);
  }
}
</script>
<template>
  <n-layout-sider width="100%" style="height: 100%" :native-scrollbar="false">
    <div class="p4">
      <n-collapse :default-expanded-names="[1, 2, 3, 4]">
        <n-collapse-item :name="1">
          <template #header>
            <div class="flex-between-center w-full">
              <div>
                {{ projectStore.selectProjectName || "Source Control" }}
              </div>
              <n-dropdown v-if="projectStore.selectProjectName" trigger="hover" :options="options" @select="onSelect">
                <span class="op-hover i-ic-sharp-more-horiz" title="More Actions" />
              </n-dropdown>
            </div>
          </template>

          <n-space vertical>
            <n-input v-model:value="gitStore.commitMessage" placeholder="Message" />
            <n-button secondary block :loading="gitStore.loading" @click="onClickGit">
              <n-space flex-center>
                <span i="charm-tick" />
                <span>Commit</span>
              </n-space>
            </n-button>
          </n-space>
        </n-collapse-item>
        <n-collapse-item :name="2">
          <template #header>
            <div class="flex-between-center w-full">
              <div>Staged Changes</div>
              <span class="op-hover i-ic-baseline-minus" title="Unstage All changes" @click="onUnstageAllChanges" />
            </div>
          </template>
          <GitChangeFiles stage="staged" />
        </n-collapse-item>
        <n-collapse-item :name="3">
          <template #header>
            <div class="flex-between-center w-full">
              <div>Changes</div>
              <div class="space-x-1">
                <span class="op-hover i-codicon-discard" title="Discard All changes" @click="onDiscardAllChanges" />
                <span class="op-hover i-carbon-add" title="Stage All changes" @click="onStageAllChanges" />
              </div>
            </div>
          </template>
          <GitChangeFiles stage="unstage" />
        </n-collapse-item>
        <n-collapse-item :name="4" title="Commits">
          <GitCommitLogs />
        </n-collapse-item>
      </n-collapse>
    </div>
  </n-layout-sider>
</template>
