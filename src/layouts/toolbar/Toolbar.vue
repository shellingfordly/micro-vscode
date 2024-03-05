<script setup lang="ts">
const tabs = reactive([
  {
    icon: "material-symbols:file-copy-outline-rounded",
    name: "file",
  },
  {
    icon: "ion:ios-git-branch",
    name: "git",
  },
]);
</script>

<template>
  <n-tabs
    key="card-left"
    type="line"
    animated
    placement="left"
    style="height: 100%"
  >
    <n-tab v-for="tab in tabs" :name="tab.name">
      <div style="padding: 2px">
        <Icon :size="18" :icon="tab.icon" />
      </div>
    </n-tab>
  </n-tabs>
</template>
<style scoped></style>
