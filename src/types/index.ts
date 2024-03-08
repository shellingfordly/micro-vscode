import type { MenuOption } from "naive-ui";
import { GitStatus } from "~/constants/enums";

export type MenuItem = MenuOption & {
  type: MenuType;
  open: boolean;
  children?: MenuItem[];
};

export type MenuType = "file" | "dir";

export interface ChangedFile {
  status: GitStatus;
  path: string;
  rootPath: string;
  name: string;
}
