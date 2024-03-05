<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

const isDark = useDark();

const themeIcon = computed(() =>
  isDark.value
    ? "material-symbols:light-mode-outline"
    : "material-symbols:nightlight-outline"
);

function onChangeTheme() {
  isDark.value = !isDark.value;
}

const showModal = ref(false);
const form = ref({
  username: "",
  email: "",
  token: "",
});

onMounted(async () => {
  const data: string = await invoke("git_get_user");
  if (data) {
    form.value = JSON.parse(data);
  }
});

async function onSetGitUser() {
  const data = await invoke("git_set_user", {
    data: JSON.stringify(form.value),
  });
  if (data) {
    showModal.value = false;
  }
}
</script>
<template>
  <div class="header-tool">
    <Icon
      class="icon"
      hover
      :size="20"
      icon="ic:outline-person"
      @click="showModal = true"
    />
    <Icon
      class="icon"
      hover
      :size="20"
      :icon="themeIcon"
      @click="onChangeTheme"
    />

    <n-modal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      style="width: 500px"
      title="Git User"
      size="huge"
      :bordered="false"
    >
      <n-form :model="form" :label-width="100" label-placement="left">
        <n-form-item label="Username" path="username">
          <n-input
            v-model:value="form.username"
            placeholder="Enter in username"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="form.email" placeholder="Enter in email" />
        </n-form-item>
        <n-form-item label="Github Token" path="token">
          <n-input
            v-model:value="form.token"
            type="password"
            placeholder="Enter in github token"
          />
        </n-form-item>
        <n-form-item style="display: flex; justify-content: flex-end">
          <n-button attr-type="button" @click="onSetGitUser"> Set </n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<style scoped lang="less">
.header-tool {
  display: flex;
  align-items: center;
  margin-right: 20px;

  .icon {
    margin-right: 10px;
  }
}
</style>
