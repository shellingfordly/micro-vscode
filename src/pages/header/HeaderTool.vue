<script setup lang="ts">
import { createInvoke } from '~/lib/utils/api'
import JSON5 from 'json5'

const isDark = useDark()

function onChangeTheme() {
  isDark.value = !isDark.value
}

const showModal = ref(false)
const form = ref({
  username: '',
  email: '',
  token: '',
})

onMounted(async () => {
  const { status, data } = await createInvoke('git_get_user')
  if (status === 'ok') {
    form.value = JSON5.parse(data)
  }
})

async function onSetGitUser() {
  const { status } = await createInvoke('git_set_user', {
    data: JSON5.stringify(form.value),
  })
  if (status === 'ok') {
    showModal.value = false
  }
}
</script>
<template>
  <div flex-center mr5 space-x-2>
    <span class="op-hover i-ic-outline-person" @click="showModal = true" />
    <span class="op-hover hover:op100" i="material-symbols-nightlight-outline dark:material-symbols-light-mode-outline" @click="onChangeTheme" />
    <n-modal v-model:show="showModal" class="w-150" preset="card" title="Git User" size="huge" :bordered="false">
      <n-form :model="form" :label-width="100" label-placement="left">
        <n-form-item label="Username" path="username">
          <n-input v-model:value="form.username" placeholder="Enter in username" />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="form.email" placeholder="Enter in email" />
        </n-form-item>
        <n-form-item label="Github Token" path="token">
          <n-input v-model:value="form.token" type="password" placeholder="Enter in github token" />
        </n-form-item>
        <n-form-item style="display: flex; justify-content: flex-end">
          <n-button attr-type="button" @click="onSetGitUser"> Set </n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>
