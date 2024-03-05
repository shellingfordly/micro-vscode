import type { MenuOption } from "naive-ui";

export function handleFileIcon(type: string, fileName?: string) {
  const hh = (icon: string) => () => h("iconify-icon", { icon });

  if (type === "file") {
    const list = (fileName?.split(".") || [])
      .filter((v) => v)
      .map((v) => v.toLocaleLowerCase());
    // 前缀
    const prefix = list.shift();

    switch (prefix) {
      case "cargo":
        return hh("vscode-icons:file-type-cargo");
      case "pnpm-lock":
        return hh("vscode-icons:file-type-pnpm");
      case "license":
        return hh("vscode-icons:file-type-license");
      case "vercel":
        return hh("vscode-icons:file-type-vercel");
      case "tsconfig":
        return hh("vscode-icons:file-type-tsconfig");
      case "unocss":
        return hh("vscode-icons:file-type-unocss");
      case "package":
        return hh("vscode-icons:file-type-npm");
    }

    const suffix = list.pop();
    switch (suffix) {
      case "js":
        return hh("vscode-icons:file-type-js");
      case "ts":
        return hh("vscode-icons:file-type-typescript");
      case "vue":
        return hh("vscode-icons:file-type-vue");
      case "css":
        return hh("vscode-icons:file-type-postcss");
      case "less":
        return hh("vscode-icons:file-type-less");
      case "sass":
        return hh("vscode-icons:file-type-sass");
      case "json":
        return hh("vscode-icons:file-type-json");
      case "md":
        return hh("vscode-icons:file-type-markdown");
      case "rs":
        return hh("vscode-icons:file-type-rust");
      default:
        return hh("vscode-icons:file-type-codekit");
    }
  } else if (type === "dir") {
    return hh("vscode-icons:default-folder");
  }
}

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
