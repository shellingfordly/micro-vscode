<script setup lang="ts">
import FileIcon from "~/components/icons/file.vue";
import GitIcon from "~/components/icons/git.vue";
</script>

<template>
  <n-tabs
    key="card-left"
    type="line"
    animated
    placement="left"
    style="height: 100%"
  >
    <n-tab name="file">
      <FileIcon width="16px" height="16px" />
    </n-tab>
    <n-tab name="tab">
      <GitIcon width="16px" height="16px" />
    </n-tab>
  </n-tabs>
</template>
<style scoped></style>
