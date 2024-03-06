import type { MenuOption } from "naive-ui";
import { handleFileIcon } from "./iconHandle";

export function handleProjectMenu(projects: string[]) {
  return [
    {
      label: "Git",
      key: "git",
      children: [
        {
          label: "clone",
          key: "clone",
        },
        {
          label: "pull",
          key: "pull",
        },
        {
          label: "commit",
          key: "commit",
        },
        {
          label: "push",
          key: "push",
        },
      ],
    },
    {
      label: "Project",
      key: "project",
      children: projects.map((label) => ({
        label,
        key: label,
      })),
    },
  ];
}

export function handleFileMenuOptions(
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
