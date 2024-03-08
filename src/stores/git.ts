import { defineStore } from "pinia";
import { useProjectStore } from "./project";
import { invoke } from "@tauri-apps/api/core";
import { ChangedFile } from "~/types";

export const useGitStore = defineStore("useGitStore", () => {
  const projectStore = useProjectStore();
  const changedFiles = ref<ChangedFile[]>([]);

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

  return { changedFiles, updateChangedFiles, discardChanges };
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
