import { MenuType } from "~/types";

const FILE_ICON_PREFIX: Record<string, string> = {
  cargo: "file-type-cargo",
  "pnpm-lock": "file-type-pnpm",
  "pnpm-workspace": "file-type-pnpm",
  npmrc: "file-type-npm",
  package: "file-type-npm",
  license: "file-type-license",
  vercel: "file-type-vercel",
  tsconfig: "file-type-tsconfig",
  uno: "file-type-unocss",
  unocss: "file-type-unocss",
  nuxt: "file-type-nuxt",
  nuxtrc: "file-type-nuxt",
  vite: "file-type-vite",
  windi: "file-type-windi",
  tailwind: "file-type-tailwind",
  eslint: "file-type-eslint",
  gitignore: "file-type-git",
  favicon: "file-type-favicon",
  tauri: "file-type-tauri",
  renovate: "file-type-renovate",
};

const FILE_ICON_SUFFIX: Record<string, string> = {
  // default file
  default: "file-type-default-file",
  // file types
  js: "file-type-js",
  ts: "file-type-typescript",
  d: "file-type-typescriptdef",
  vue: "file-type-vue",
  html: "file-type-html",
  css: "file-type-postcss",
  less: "file-type-less",
  sass: "file-type-sass",
  json: "file-type-json",
  md: "file-type-markdown",
  rs: "file-type-rust",
  yml: "file-type-light-yaml",
  svg: "file-type-svg",
  png: "file-type-image",
  jpg: "file-type-image",
  gif: "file-type-image",
  webp: "file-type-image",
};

const FOLDER_ICON: Record<string, string> = {
  // default folder
  default: "default-folder",
  // folder types
  vscode: "folder-type-vscode",
  util: "folder-type-tools",
  utils: "folder-type-tools",
  template: "folder-type-template",
  templates: "folder-type-template",
  layout: "folder-type-view",
  layouts: "folder-type-view",
  page: "folder-type-view",
  pages: "folder-type-view",
  view: "folder-type-view",
  src: "folder-type-src",
  hook: "folder-type-hook",
  component: "folder-type-component",
  components: "folder-type-component",
  style: "folder-type-style",
  styles: "folder-type-style",
  asset: "folder-type-asset",
  assets: "folder-type-asset",
  "src-tauri": "folder-type-tauri",
  public: "folder-type-public",
  node_modules: "folder-type-node",
  dist: "folder-type-dist",
  data: "folder-type-db",
  model: "folder-type-model",
  models: "folder-type-model",
  module: "folder-type-module",
  modules: "folder-type-module",
  server: "folder-type-server",
  type: "folder-type-typings",
  types: "folder-type-typings",
  github: "folder-type-github",
  nuxt: "folder-type-nuxt",
  app: "folder-type-app",
  apps: "folder-type-app",
  bin: "folder-type-binary",
  ts: "folder-type-typescript",
  typescript: "folder-type-typescript",
  build: "folder-type-dist",
  builds: "folder-type-dist",
  release: "folder-type-dist",
  releases: "folder-type-dist",
  locales: "folder-type-locale",
  locale: "folder-type-locale",
};

export function CreateIconVNode(name: string) {
  return () => h("iconify-icon", { icon: "vscode-icons:" + name });
}

export function handleIcon(type: MenuType, fileName: string) {
  // 文件
  if (type === "file") {
    const iconName = getFileIconName(fileName);
    return CreateIconVNode(iconName);
  }
  // 文件夹
  else if (type === "dir") {
    const iconName = getFolderIconName(fileName);
    return CreateIconVNode(iconName);
  }
}

export function getFileIconName(fileName: string) {
  const list = (fileName?.split(".") || [])
    .filter((v) => v)
    .map((v) => v.toLocaleLowerCase());

  // 前缀
  const prefix = list.shift() || "";
  let iconName = FILE_ICON_PREFIX[prefix];

  if (iconName) return iconName;

  // 后缀
  const suffix = list.pop() || "";
  if (suffix == "ts" && list.pop() == "d") {
    return FILE_ICON_SUFFIX.d;
  }

  iconName = FILE_ICON_SUFFIX[suffix];

  if (iconName) {
    return iconName;
  } else {
    return FILE_ICON_SUFFIX.default;
  }
}

export function getFolderIconName(fileName: string) {
  const name = (fileName?.split(".") || []).filter((v) => v).shift() || "";

  const iconName = FOLDER_ICON[name];
  if (iconName) {
    return iconName;
  } else {
    return FOLDER_ICON.default;
  }
}
