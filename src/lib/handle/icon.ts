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
  default: "default-file",
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
  cs: "file-type-csharp",
  sln: "file-type-sln",
  csproj: "file-type-csproj",
  xml: "file-type-xml",
  editorconfig: "file-type-editorconfig",
  txt: "file-type-text",
  xlsx: "file-type-excel",
  ps1: "file-type-powershell",
  bat: "file-type-bat",
  sql: "file-type-sql",
  exe: "file-type-binary",
  dll: "file-type-binary",
  zip: "file-type-zip",
  ttf: "file-type-font",
  otf: "file-type-font",
  woff: "file-type-font",
  ttc: "file-type-font",
  log: "file-type-log",
};

const FOLDER_ICON: Record<string, string> = {
  // default folder
  default: "default-folder",
  // .
  ".vs": "folder-type-vs",
  ".idea": "folder-type-idea",
  ".git": "folder-type-git",
  ".vscode": "folder-type-vscode",
  // folder types
  app: "folder-type-app",
  apps: "folder-type-app",
  asset: "folder-type-asset",
  assets: "folder-type-asset",
  bin: "folder-type-binary",
  build: "folder-type-dist",
  builds: "folder-type-dist",
  common: "folder-type-common",
  config: "older-type-config",
  client: "folder-type-client",
  configs: "older-type-config",
  controller: "folder-type-controller",
  controllers: "folder-type-controller",
  component: "folder-type-component",
  components: "folder-type-component",
  dist: "folder-type-dist",
  data: "folder-type-db",
  github: "folder-type-github",
  hook: "folder-type-hook",
  log: "folder-type-log",
  logs: "folder-type-log",
  locale: "folder-type-locale",
  locales: "folder-type-locale",
  layout: "folder-type-view",
  layouts: "folder-type-view",
  library: "folder-type-library",
  model: "folder-type-model",
  models: "folder-type-model",
  module: "folder-type-module",
  modules: "folder-type-module",
  nuxt: "folder-type-nuxt",
  node_modules: "folder-type-node",
  page: "folder-type-view",
  pages: "folder-type-view",
  plugin: "folder-type-plugin",
  plugins: "folder-type-plugin",
  public: "folder-type-public",
  release: "folder-type-dist",
  releases: "folder-type-dist",
  src: "folder-type-src",
  style: "folder-type-style",
  styles: "folder-type-style",
  server: "folder-type-server",
  "src-tauri": "folder-type-tauri",
  ts: "folder-type-typescript",
  typescript: "folder-type-typescript",
  type: "folder-type-typings",
  types: "folder-type-typings",
  temp: "folder-type-temp",
  template: "folder-type-template",
  templates: "folder-type-template",
  utils: "folder-type-tools",
  util: "folder-type-tools",
  view: "folder-type-view",
  vscode: "folder-type-vscode",
};

export function CreateIconVNode(name: string) {
  return () => h("iconify-icon", { icon: "vscode-icons:" + name });
}

export function handleIcon(type: MenuType, fileName: string) {
  // 文件
  if (type === "file") {
    const iconName = getFileIconName(fileName);
    console.log("iconName", iconName);
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
  const name = fileName.trim().toLowerCase();
  // (fileName?.split(".") || [])
  //   .filter((v) => v)
  //   .map((v) => v.toLowerCase())
  //   .shift() || "";

  const iconName = FOLDER_ICON[name];
  if (iconName) {
    return iconName;
  } else {
    return FOLDER_ICON.default;
  }
}
