import JSON5 from "json5";
import { defineStore } from "pinia";
import { useProjectStore } from "./project";
import { invoke } from "@tauri-apps/api/core";
import { ChangedFile } from "~/types";

export const useGitStore = defineStore("useGitStore", () => {
  const projectStore = useProjectStore();
  const changedFiles = ref<ChangedFile[]>([]);
  const commitMessage = ref("");
  const loading = ref(false);
  const logList = ref<string[]>([]);

  watch(() => projectStore.selectProjectName, updateChangedFiles, {
    immediate: true,
  });

  async function updateChangedFiles() {
    const name = projectStore.selectProjectName;
    if (!name) return;

    const data: string[] = await invoke("git_status", { name });
    changedFiles.value = handleChangeFiles(data, name);
  }

  async function discardChanges(path: string) {
    const name = projectStore.selectProjectName;
    if (!name) return false;

    const data = await invoke("git_discard_changes", { name, path });
    return data === "OK";
  }

  async function gitCommit() {
    if (!projectStore.selectProjectName || !commitMessage.value) return false;

    loading.value = true;
    const data = await invoke("git_commit", {
      name: projectStore.selectProjectName,
      message: commitMessage.value,
    });
    loading.value = false;

    return data === "ok";
  }

  async function gitLog() {
    const data: string[] = await invoke("git_log", {
      name: projectStore.selectProjectName,
    });
    console.log(data);
    // "CommitItem { id: \"19cf0723ccb14fb77bea4de40d0690de…\", message: \"chore: init\\n\", time: \"1708665647\" }
    logList.value = data.map((str) => {
      return JSON5.parse(str.replace("CommitItem", "").trim());
    });
    console.log(logList.value);
  }

  return {
    changedFiles,
    commitMessage,
    loading,
    logList,
    gitLog,
    gitCommit,
    discardChanges,
    updateChangedFiles,
  };
});

export function handleChangeFiles(
  data: string[],
  rootName: string
): ChangedFile[] {
  return data.map((str) => {
    const [status, path] = str.split("###");
    const name = path.split("/").pop();
    return {
      status,
      path,
      rootPath: rootName + "/" + path,
      name,
    } as ChangedFile;
  });
}
