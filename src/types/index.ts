import type { MenuOption } from "naive-ui";

export type MenuItem = MenuOption & {
  type: MenuType;
  open: boolean;
  children?: MenuItem[];
};

export type MenuType = "file" | "dir";
