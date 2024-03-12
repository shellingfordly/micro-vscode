<script setup lang="ts">
import { useGitStore } from "~/stores/git";
import dayjs from "dayjs";

const gitStore = useGitStore();
const timeFormat = (time: string) =>
  dayjs(Number(time) * 1000).format("DD/MM/YY");

onMounted(() => {
  gitStore.gitLog();
});
</script>
<template>
  <ul class="logs">
    <li class="log" v-for="log in gitStore.logList">
      <Icon icon="openmoji:person-bald" />
      <span class="msg"> {{ log.message }} </span>
      <span class="name"> {{ log.name }} </span>
      <span> {{ timeFormat(log.time) }} </span>
    </li>
  </ul>
</template>
<style scoped lang="less">
.logs {
  .log {
    cursor: pointer;
    opacity: 0.8;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:hover {
      opacity: 1;
    }

    > span {
      margin-left: 12px;
    }

    > span:not(:first-of-type) {
      font-size: 12px;
      opacity: 0.8;
    }
  }
}
</style>
