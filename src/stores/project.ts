import { invoke } from "@tauri-apps/api/core";
import { defineStore } from "pinia";
import type { MenuOption } from "naive-ui";
import {
  handleProjectMenu,
  handleFileMenuOptions,
} from "../utils/projectHandle";

const FileContentMap = new Map<string, string>();

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

  watch(selectProjectName, async (name) => {
    const data = await getProjectFiles(name);

    fileMenuOptions.value = handleFileMenuOptions(data, name) as any[];

    // 清除旧文件
    fileTabs.value = [];
    clearFileContent();
  });

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

    if (!FileContentMap.has(path)) {
      data = await invoke("read_file", {
        path,
      });

      FileContentMap.set(path, data);
    } else {
      data = FileContentMap.get(path) || "";
    }

    fileInfo.content = data;
    fileInfo.path = path;
  }

  async function saveFileContent() {
    const data = await invoke("write_file", {
      path: fileInfo.path,
      content: fileInfo.content,
    });
    return data;
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
    getProjectFiles,
    getProjectList,
    getFileContent,
    saveFileContent,
    addFileTab,
    closeFileTab,
  };
});
