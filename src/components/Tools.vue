<script setup lang="ts">
import { useProjectStore } from "../stores/project";

const projectStore = useProjectStore();

function onSaveFileAll() {
  if (projectStore.modifiedFiles.values.length)
    projectStore.saveAllFileContent();
}

function onSaveFile() {
  const filepath =
    !!projectStore.selectFileTab &&
    projectStore.modifiedFiles.has(projectStore.selectFileTab);

  if (filepath) {
    projectStore.saveFileContent();
  }
}
</script>

<template>
  <div class="tools">
    <div title="New File">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="m9.5 1.1l3.4 3.5l.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7zM9 2v3h2.9zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div title="New Folder">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M1.5 2.5V4h5.697l-1-1.5zM0 2v10.75C0 13.44.56 14 1.25 14h6a.75.75 0 0 0 0-1.5H1.5v-7h13v1.75a.75.75 0 0 0 1.5 0v-2C16 4.56 15.44 4 14.75 4H8.998a1.054 1.054 0 0 0-.034-.055l-1.667-2.5A1 1 0 0 0 6.465 1H1a1 1 0 0 0-1 1m13 13a.75.75 0 0 1-.75-.75v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5A.75.75 0 0 1 13 15"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div title="Save All" @click="onSaveFileAll">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          d="m14.85 2.65l-1.5-1.5L13 1H4.48l-.5.5V4H1.5l-.5.5v10l.5.5h10l.5-.5V12h2.5l.5-.5V3zM11 14H2V5h1v3.07h6V5h.79L11 6.21zM6 7V5h2v2zm8 4h-2V6l-.15-.35l-1.5-1.5L10 4H5V2h7.81l1.21 1.21z"
        />
      </svg>
    </div>
    <div title="Save" @click="onSaveFile">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="m13.353 1.146l1.5 1.5L15 3v11.5l-.5.5h-13l-.5-.5v-13l.5-.5H13zM2 2v12h12V3.208L12.793 2H11v4H4V2zm6 0v3h2V2z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="less">
.tools {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;

  > div {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
