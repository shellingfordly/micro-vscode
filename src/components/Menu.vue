<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

const emit = defineEmits(["change", "clone", "commit"]);
const { menuOptions } = useMenu();
const showModal = reactive({
  clone: false,
  commit: false,
});
const url = ref("");
const loading = ref(false);
const message = useMessage();
const { selectedProjectName } = useProjectFile();
const commitMsg = ref("");

async function onUpdateValue(key: string) {
  if (key === "clone") {
    showModal.clone = true;
  } else if (key === "pull") {
    onPull();
  } else if (key === "commit") {
    showModal.commit = true;
  } else if (key === "push") {
    onPush();
  } else {
    emit("change", key);
  }
}

async function onPull() {
  if (selectedProjectName.value) {
    const data = await invoke("git_pull", { name: selectedProjectName.value });
    if (data === "ok") {
      message.success(`git pull successful!`);
    }
  }
}

async function onPush() {
  if (selectedProjectName.value) {
    const data = await invoke("git_push", { name: selectedProjectName.value });
    if (data === "ok") {
      message.success(`git push successful!`);
    }
  }
}

async function onClone() {
  loading.value = true;
  const data = await invoke("git_clone", { url: url.value });
  if (data === "ok") {
    showModal.clone = false;
    message.success(`git clone successful!`);
  }

  emit("clone", data === "ok");
  loading.value = false;
}

async function onCommit() {
  if (!selectedProjectName.value || !commitMsg.value) return;

  loading.value = true;
  const data = await invoke("git_commit", {
    name: selectedProjectName.value,
    message: commitMsg.value,
  });

  if (data === "ok") {
    showModal.commit = false;
    message.success(`git commit successful!`);
  }

  emit("commit", data === "ok");

  loading.value = false;
}
</script>
<template>
  <n-menu
    mode="horizontal"
    :options="menuOptions"
    @update:value="onUpdateValue"
  />
  <n-modal
    v-model:show="showModal.clone"
    class="custom-card"
    preset="card"
    style="width: 500px"
    title="git clone"
    size="huge"
    :bordered="false"
  >
    <n-input v-model:value="url" style="margin-bottom: 10px" />
    <n-button :loading="loading" @click="onClone">clone</n-button>
  </n-modal>
  <n-modal
    v-model:show="showModal.commit"
    class="custom-card"
    preset="card"
    style="width: 500px"
    title="git commit"
    size="huge"
    :bordered="false"
  >
    <n-input v-model:value="commitMsg" style="margin-bottom: 10px" />
    <n-button :loading="loading" @click="onCommit">Commit</n-button>
  </n-modal>
</template>
