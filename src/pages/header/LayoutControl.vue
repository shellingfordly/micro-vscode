<script setup lang="ts">
import { Window } from '@tauri-apps/api/window'

const appWindow = new Window('main')
</script>
<template>
  <div class="h-8" style="background-color: #363636" data-tauri-drag-region flex-end>
    <span class="mr2 op-hover i-material-symbols-light-minimize" @click="appWindow.minimize()" />
    <span class="mr2 op-hover i-material-symbols-light-home-max-outline" @click="appWindow.toggleMaximize()" />
    <span class="mr2 op-hover i-material-symbols-light-cancel-outline" @click="appWindow.close()" />
  </div>
</template>
