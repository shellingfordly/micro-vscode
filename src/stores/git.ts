import { defineStore } from "pinia";
import { useProjectStore } from "./project";
import { ChangedFile, GitLogInfo } from "~/types";
import { createInvoke } from "~/utils/api";

export const useGitStore = defineStore("useGitStore", () => {
  const projectStore = useProjectStore();
  const changedFileMap = reactive<Map<string, ChangedFile>>(new Map());
  const addChangeFileMap = reactive<Map<string, ChangedFile>>(new Map());
  const commitMessage = ref("");
  const loading = ref(false);
  const logList = ref<GitLogInfo[]>([]);

  watch(() => projectStore.selectProjectName, updateChangedFiles, {
    immediate: true,
  });

  async function updateChangedFiles() {
    const name = projectStore.selectProjectName;
    if (!name) return;

    const result = await createInvoke("git_status", { name });
    if (result.status == "ok") {
      setChangeFileMap(changedFileMap, result.data, name);
    }
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

  function gitAdd(files: ChangedFile[]) {
    files.forEach((file) => {
      addChangeFileMap.set(file.path, file);
      changedFileMap.delete(file.path);
    });
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
    const { status, data } = await createInvoke<GitLogInfo[]>("git_log", {
      name: projectStore.selectProjectName,
    });
    if (status === "ok") {
      logList.value = data;
    }
  }

  return {
    changedFiles: changedFileMap,
    addChangeFileMap,
    commitMessage,
    loading,
    logList,
    gitAdd,
    gitLog,
    gitCommit,
    discardChanges,
    updateChangedFiles,
  };
});

export function setChangeFileMap(
  map: Map<string, ChangedFile>,
  data: string[],
  rootName: string
) {
  data.forEach((str) => {
    const [status, path] = str.split("###");
    const name = path.split("/").pop();
    const file = {
      status,
      path,
      rootPath: rootName + "/" + path,
      name,
    } as ChangedFile;
    map.set(path, file);
  });
}
