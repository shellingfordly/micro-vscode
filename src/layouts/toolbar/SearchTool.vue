<script setup lang="ts">
function onReplace() {}
</script>
<template>
  <n-layout-sider
    width="100%"
    style="height: 100%; padding: 10px"
    :native-scrollbar="false"
  >
    <n-space vertical>
      <n-input placeholder="search" />
      <div class="replace">
        <n-input placeholder="replace" />
        <Icon
          class="icon"
          hover
          icon="codicon:replace-all"
          @click="onReplace"
        />
      </div>
      <div>include</div>
      <n-input placeholder="*.ts, src/**/include" />
      <div>exclude</div>
      <n-input placeholder="*.ts, src/**/include" />
    </n-space>
  </n-layout-sider>
</template>
<style scoped lang="less">
.replace {
  display: flex;
  align-items: center;

  .icon {
    margin-left: 10px;
  }
}
</style>
