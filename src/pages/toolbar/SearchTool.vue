<script setup lang="ts">
function onReplace() {}
</script>
<template>
  <n-layout-sider width="100%" class="h-full p4" :native-scrollbar="false">
    <n-space vertical>
      <n-input placeholder="search" />
      <div class="flex-start-center">
        <n-input placeholder="replace" />
        <span class="ml3 i-codicon-replace-all" @click="onReplace" />
      </div>
      <div>include</div>
      <n-input placeholder="*.ts, src/**/include" />
      <div>exclude</div>
      <n-input placeholder="*.ts, src/**/include" />
    </n-space>
  </n-layout-sider>
</template>
