import { handleIcon } from "./iconHandle";
import { MenuItem, MenuType } from "~/types";

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

export function createMenuItem({
  name,
  path,
  key,
}: {
  name: string;
  path: string;
  key: string;
}): MenuItem {
  const type: MenuType = path.endsWith(name) ? "file" : "dir";
  return {
    label: name,
    key,
    type,
    open: false,
    icon: handleIcon(type, name),
  };
}

export function handleFileMenu(_paths: string[], rootName: string): MenuItem[] {
  const rootNode: MenuItem = createMenuItem({
    path: rootName + "/",
    name: rootName,
    key: rootName,
  });

  const paths = _paths.map((v) => {
    const index = v.match(rootName)?.index || 0;
    return v.slice(index + rootName.length + 1);
  });

  paths.forEach((path) => {
    const parts = path.split("/");
    let currentNode = rootNode;

    let key = rootName;
    parts.forEach((name) => {
      const existingChild = currentNode.children?.find(
        (child) => child.label === name
      ) as MenuItem;

      // key：拼接当前路径
      key += "/" + name;
      if (!existingChild) {
        const newChild = createMenuItem({ path, name, key });
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

  function sortMenu(data: MenuItem[]): MenuItem[] {
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

  return sortMenu([rootNode]);
}
