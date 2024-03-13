<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { createInvoke } from "~/utils/api";

const emit = defineEmits(["change", "clone", "commit"]);
const showModal = reactive({
  clone: false,
  commit: false,
});
const url = ref("");
const loading = ref(false);
const message = useMessage();
const commitMsg = ref("");
const projectStore = useProjectStore();

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
  if (projectStore.selectProjectName) {
    const { status } = await createInvoke("git_pull", {
      name: projectStore.selectProjectName,
    });
    if (status === "ok") {
      message.success(`git pull successful!`);
    }
  }
}

async function onPush() {
  if (projectStore.selectProjectName) {
    const { status } = await createInvoke("git_push", {
      name: projectStore.selectProjectName,
    });
    if (status === "ok") {
      message.success(`git push successful!`);
    }
  }
}

async function onClone() {
  loading.value = true;
  const { status } = await createInvoke("git_clone", { url: url.value });
  if (status === "ok") {
    showModal.clone = false;
    message.success(`git clone successful!`);
  }

  emit("clone", status === "ok");
  loading.value = false;
}

async function onCommit() {
  if (!projectStore.selectProjectName || !commitMsg.value) return;

  loading.value = true;
  const { status } = await createInvoke("git_commit", {
    name: projectStore.selectProjectName,
    message: commitMsg.value,
  });

  if (status === "ok") {
    showModal.commit = false;
    message.success(`git commit successful!`);
  }

  emit("commit", status === "ok");

  loading.value = false;
}
</script>
<template>
  <n-menu
    mode="horizontal"
    :options="projectStore.projectMenuOptions"
    @update:value="onUpdateValue"
  />
  <n-modal
    v-model:show="showModal.clone"
    class="w-150"
    preset="card"
    title="git clone"
    size="huge"
    :bordered="false"
  >
    <n-input v-model:value="url" mb3 />
    <n-button :loading="loading" @click="onClone">clone</n-button>
  </n-modal>
  <n-modal
    v-model:show="showModal.commit"
    w-150
    preset="card"
    title="git commit"
    size="huge"
    :bordered="false"
  >
    <n-input v-model:value="commitMsg" mb3 />
    <n-button :loading="loading" @click="onCommit">Commit</n-button>
  </n-modal>
</template>
