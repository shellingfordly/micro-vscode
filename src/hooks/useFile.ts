import { invoke } from "@tauri-apps/api/core";
import type { MenuOption } from "naive-ui";

export function useProjectFile() {
  async function getProjectFiles(projectName: string) {
    const data: string[] = await invoke("get_files", {
      name: projectName,
    });
    return data;
  }

  return { getProjectFiles, handleProjectFileToOptions };
}

function handleProjectFileToOptions(filePaths: string[], rootFileName: string) {
  const root: MenuOption = {
    label: rootFileName,
    key: rootFileName,
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
        const newChild = {
          label: fileName,
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
  return [root];
}
