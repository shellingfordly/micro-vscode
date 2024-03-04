import { invoke } from "@tauri-apps/api/core";
import { defineStore } from "pinia";
import type { MenuOption } from "naive-ui";
import {
  handleProjectMenu,
  handleFileMenuOptions,
} from "../utils/projectHandle";

const FileContentMap = new Map<string, string>();
const FileContentChangeMap = new Map<string, string>();

export const useProjectStore = defineStore("useProjectStore", () => {
  const selectProjectName = ref("");
  const projectNameList = ref<string[]>([]);
  const fileMenuOptions = ref<MenuOption[]>([]);
  const projectMenuOptions = computed<MenuOption[]>(() =>
    handleProjectMenu(projectNameList.value)
  );
  const fileInfo = reactive({
    content: "",
    path: "",
  });
  const fileTabs = ref<{ label: string; value: string }[]>([]);
  const selectFileTab = ref("");
  const modifiedFiles = ref<Set<string>>(new Set());

  watch(selectProjectName, async (name) => {
    const data = await getProjectFiles(name);

    fileMenuOptions.value = handleFileMenuOptions(data, name) as any[];

    // 清除旧文件
    fileTabs.value = [];
    clearFileContent();
  });

  watch(
    () => fileInfo.content,
    (newValue) => {
      if (!fileInfo.path) return;
      if (FileContentMap.has(fileInfo.path)) {
        const oldValue = FileContentMap.get(fileInfo.path);

        if (oldValue !== newValue) {
          modifiedFiles.value.add(fileInfo.path);
        }
      }

      if (fileInfo.path) FileContentChangeMap.set(fileInfo.path, newValue);
    },
    { immediate: true, deep: true }
  );

  async function getProjectFiles(projectName: string) {
    const data: string[] = await invoke("get_project_files", {
      name: projectName,
    });
    return data;
  }

  async function getProjectList() {
    const data = await invoke("get_projects");
    projectNameList.value = data as string[];
  }

  function clearFileContent() {
    fileInfo.content = "";
    fileInfo.path = "";
  }

  async function getFileContent(path: string) {
    let data = "";
    if (!FileContentMap.has(path) && !FileContentChangeMap.has(path)) {
      data = await invoke("read_file", {
        path,
      });

      FileContentMap.set(path, data);
      FileContentChangeMap.set(path, data);
    } else {
      data = FileContentChangeMap.get(path) || FileContentMap.get(path) || "";
    }

    fileInfo.content = data;
    fileInfo.path = path;
  }

  async function saveCurrentFile() {
    if (modifiedFiles.value.has(fileInfo.path)) {
      await invoke("write_file", {
        path: fileInfo.path,
        content: fileInfo.content,
      });

      FileContentMap.set(fileInfo.path, fileInfo.content);
      modifiedFiles.value.delete(fileInfo.path);
    }
  }

  function notSaveCurrentFile() {
    modifiedFiles.value.delete(fileInfo.path);

    if (FileContentChangeMap.has(fileInfo.path)) {
      FileContentChangeMap.delete(fileInfo.path);
    }
  }

  function saveAllFile() {
    const list = [...modifiedFiles.value]
      .filter((path) => FileContentChangeMap.has(path))
      .map((path) => {
        return invoke("write_file", {
          path: path,
          content: FileContentChangeMap.get(path),
        });
      });

    Promise.all(list).then(() => {
      modifiedFiles.value.forEach((path) => {
        if (FileContentChangeMap.has(path))
          FileContentMap.set(path, FileContentChangeMap.get(path)!);
      });
      modifiedFiles.value.clear();
    });
  }

  function addFileTab(value: string) {
    if (
      value &&
      fileTabs.value.findIndex((item) => item.value === value) === -1
    ) {
      const label = value.split("/").pop() || value;
      fileTabs.value.push({ label, value: value });
    }
    selectFileTab.value = value;
  }

  function closeFileTab(value: string) {
    const index = fileTabs.value.findIndex((item) => item.value === value);
    if (index === -1) return;

    // 关闭tab
    fileTabs.value.splice(index, 1);

    // 当前显示的tab
    const i =
      fileTabs.value.length === 1 ? 0 : index > 0 ? index - 1 : index + 1;
    const tab = fileTabs.value[i];
    if (tab) {
      selectFileTab.value = tab.value;
      getFileContent(tab.value);
    } else {
      clearFileContent();
    }
  }

  return {
    selectProjectName,
    projectNameList,
    fileMenuOptions,
    projectMenuOptions,
    fileInfo,
    fileTabs,
    selectFileTab,
    modifiedFiles,
    getProjectFiles,
    getProjectList,
    getFileContent,
    saveCurrentFile,
    notSaveCurrentFile,
    saveAllFile,
    addFileTab,
    closeFileTab,
  };
});
