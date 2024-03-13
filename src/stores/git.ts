import { defineStore } from "pinia";
import { useProjectStore } from "./project";
import { ChangedFile, GitLogInfo, GitStageType } from "~/types";
import { createInvoke } from "~/utils/api";

export const useGitStore = defineStore("useGitStore", () => {
  const projectStore = useProjectStore();
  const changedFiles = ref<ChangedFile[]>([]);
  const commitMessage = ref("");
  const loading = ref(false);
  const logList = ref<GitLogInfo[]>([]);

  watch(() => projectStore.selectProjectName, updateChangedFiles, {
    immediate: true,
  });

  function getChangeFilesByStageType(stage: GitStageType) {
    return changedFiles.value.filter((f) => stage === f.stage);
  }

  async function updateChangedFiles() {
    const name = projectStore.selectProjectName;
    if (!name) return;

    const result = await createInvoke<ChangedFile[]>("git_status", { name });
    if (result.status == "ok") {
      changedFiles.value = result.data.map((item) => ({
        ...item,
        fullPath: name + "/" + item.path,
      }));
    }
  }

  async function gitAdd(files: ChangedFile[]) {
    const { status } = await createInvoke("git_add", {
      name: projectStore.selectProjectName,
      files: files.map((f) => f.path),
    });
    return status === "ok";
  }

  async function gitCommit() {
    if (!projectStore.selectProjectName || !commitMessage.value) return false;

    loading.value = true;
    const { status } = await createInvoke("git_commit", {
      name: projectStore.selectProjectName,
      message: commitMessage.value,
    });
    loading.value = false;

    return status === "ok";
  }

  async function gitLog() {
    if (!projectStore.selectProjectName) return;
    const { status, data } = await createInvoke<GitLogInfo[]>("git_log", {
      name: projectStore.selectProjectName,
    });
    if (status === "ok") {
      logList.value = data;
    }
  }

  async function getResetHead(file = "") {
    const name = projectStore.selectProjectName;
    if (!name) return false;

    const { status } = await createInvoke("git_reset_head", {
      name,
      file,
    });
    return status === "ok";
  }

  async function discardChanges(path: string) {
    const name = projectStore.selectProjectName;
    if (!name) return false;

    const { status } = await createInvoke("git_discard_changes", {
      name,
      path,
    });
    return status === "ok";
  }

  return {
    changedFiles,
    commitMessage,
    loading,
    logList,
    gitAdd,
    gitLog,
    gitCommit,
    getResetHead,
    discardChanges,
    updateChangedFiles,
    getChangeFilesByStageType,
  };
});
