import { invoke } from "@tauri-apps/api/core";
import type { MenuOption } from "naive-ui";

const selectedProjectName = ref("");

export function useProjectFile() {
  async function getProjectFiles(projectName: string) {
    const data: string[] = await invoke("get_project_files", {
      name: projectName,
    });
    return data;
  }

  return { getProjectFiles, handleProjectFileToOptions, selectedProjectName };
}

function handleProjectFileToOptions(filePaths: string[], rootFileName: string) {
  const root: MenuOption = {
    label: rootFileName,
    key: rootFileName,
    icon: handleIcon("dir"),
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
          icon: handleIcon(type, fileName),
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
  return sortFile([root]);
}

export function sortFile(data: MenuOption[]): MenuOption[] {
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
