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

export interface GitLogInfo {
  id: string;
  name: string;
  email: string;
  message: string;
  time: string;
}

export interface Response<T = any> {
  status: "ok" | "err";
  data: T;
  err: string;
}
