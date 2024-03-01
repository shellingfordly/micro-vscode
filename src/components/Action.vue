<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

const isDark = useDark();

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
  <div class="action">
    <div class="icon" @click="showModal = true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
        />
      </svg>
    </div>
    <div class="icon" @click="onChangeTheme">
      <template v-if="isDark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15m0 2q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525zM12 12"
          />
        </svg>
      </template>
      <template v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75"
          />
        </svg>
      </template>
    </div>

    <n-modal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      style="width: 500px"
      title="Git User"
      size="huge"
      :bordered="false"
    >
      <n-form :model="form" :label-width="60" label-placement="left">
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
.action {
  display: flex;
  align-items: center;
  margin-right: 20px;

  .icon {
    padding: 5px;
    cursor: pointer;
    margin-right: 10px;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
