import type { MenuOption } from "naive-ui";

export type MenuItem = MenuOption & {
  type: MenuType;
  open: boolean;
  children?: MenuItem[];
};

export type MenuType = "file" | "dir";

export interface ChangedFile {
  status: string;
  path: string;
  name: string;
}
