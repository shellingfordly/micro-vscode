import { invoke } from "@tauri-apps/api/core";
import { defineStore } from "pinia";
import type { MenuOption } from "naive-ui";
import { handleProjectMenu, handleFileIcon } from "../utils/projectHandle";

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

  watch(selectProjectName, async (name) => {
    const data = await getProjectFiles(name);

    fileMenuOptions.value = handleProjectFiles(data, name) as any[];
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

  async function getFileContent(path: string) {
    const data: string = await invoke("read_file", {
      path,
    });
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

  return {
    selectProjectName,
    projectNameList,
    fileMenuOptions,
    projectMenuOptions,
    fileInfo,
    getProjectFiles,
    getProjectList,
    getFileContent,
    saveFileContent,
  };
});

function handleProjectFiles(
  filePaths: string[],
  rootFileName: string
): MenuOption[] {
  const root: MenuOption = {
    label: rootFileName,
    key: rootFileName,
    icon: handleFileIcon("dir"),
    type: "dir",
    children: [],
  };

  const paths = filePaths.map((v) => {
    const index = v.match(rootFileName)?.index || 0;
    return v.slice(index + rootFileName.length + 1);
  });

  paths.forEach((path) => {
    const parts = path.split("/");
    let currentNode = root;
    parts.forEach((fileName) => {
      const existingChild = currentNode.children?.find(
        (child) => child.label === fileName
      );
      if (!existingChild) {
        const type = path.endsWith(fileName) ? "file" : "dir";
        const newChild = {
          label: fileName,
          icon: handleFileIcon(type, fileName),
          type,
          key: rootFileName + "/" + path,
        };
        if (currentNode.children) {
          currentNode.children?.push(newChild);
        } else {
          currentNode.children = [newChild];
        }
        currentNode = newChild;
      } else {
        currentNode = existingChild;
      }
    });
  });

  function sortFile(data: MenuOption[]): MenuOption[] {
    const sort = (d: any[]) =>
      d.sort((a, b) => {
        if (a.type === "dir" && b.type === "file") {
          return -1;
        } else if (a.type === "file" && b.type === "dir") {
          return 1;
        }
        return a.label.localeCompare(b.label);
      });

    const sort_recursion = (d: any[]) => {
      sort(d);

      d.forEach((item) => {
        if (item.children?.length) {
          sort_recursion(item.children);
        }
      });
    };

    sort_recursion(data);

    return data;
  }

  return sortFile([root]);
}
