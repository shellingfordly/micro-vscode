<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import dayjs from "dayjs";
import { createInvoke } from "~/lib/utils/api";
import { useProjectStore } from "~/stores/project";
import { GitLogInfo } from "~/types";

const gitStore = useGitStore();
const projectStore = useProjectStore();
const timeFormat = (time: string) =>
  dayjs(Number(time) * 1000).format("DD/MM/YY");

onMounted(() => {
  gitStore.updateLogList();
});

async function onClickLog(log: GitLogInfo) {
  const { data } = await createInvoke("git_diff_commit", {
    name: projectStore.selectProjectName,
    commitId: log.id,
  });
  const name = "Changes in " + log.id.slice(0, 7);

  projectStore.fileInfo.content = data;
  projectStore.fileInfo.path = name;
  projectStore.addFileTab(name);
}
</script>
<template>
  <ul>
    <li class="log" v-for="log in gitStore.logList" @click="onClickLog(log)">
      <span i="openmoji-person-bald"></span>
      <span ml3> {{ log.message }} </span>
      <span ml3 op60> {{ log.name }} </span>
      <span ml3 op60> {{ timeFormat(log.time) }} </span>
    </li>
  </ul>
</template>
<style scoped lang="less">
.log {
  cursor: pointer;
  opacity: 0.6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    opacity: 1;
  }
}
</style>
