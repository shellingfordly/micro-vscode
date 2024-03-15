<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import dayjs from "dayjs";

const gitStore = useGitStore();
const timeFormat = (time: string) =>
  dayjs(Number(time) * 1000).format("DD/MM/YY");

onMounted(() => {
  gitStore.updateLogList();
});
</script>
<template>
  <ul>
    <li class="log" v-for="log in gitStore.logList">
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
