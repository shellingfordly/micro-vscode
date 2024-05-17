<script setup lang="ts">
import { Window } from '@tauri-apps/api/window'
const appWindow = new Window('main')
</script>
<template>
  <n-el tag="div" class="h-8" data-tauri-drag-region flex-end style="color: var(--primary-color); transition: 0.3s var(--cubic-bezier-ease-in-out)">
    <span class="mr4 op-hover" i="material-symbols-minimize-rounded" @click="appWindow.minimize()" />
    <span class="mr4 op-hover" i="material-symbols-chrome-maximize-outline" @click="appWindow.toggleMaximize()" />
    <span class="mr4 op-hover" i="material-symbols-close-rounded" @click="appWindow.close()" />
  </n-el>
</template>
