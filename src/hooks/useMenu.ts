import { invoke } from "@tauri-apps/api/core";
import type { MenuOption } from "naive-ui";

export function useMenu() {
  const projects = ref<string[]>([]);
  const menuOptions = computed<MenuOption[]>(() => [
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
      children: projects.value.map((name) => ({
        label: name,
        key: name,
      })),
    },
  ]);

  onMounted(async () => {
    const data = await invoke("get_projects");
    projects.value = data as string[];
  });

  return { menuOptions };
}
