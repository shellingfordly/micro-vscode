const ICON_PREFIX_MAP = {
  cargo: "cargo",
  "pnpm-lock": "pnpm",
  "pnpm-workspace": "pnpm",
  npmrc: "npm",
  package: "npm",
  license: "license",
  vercel: "vercel",
  tsconfig: "tsconfig",
  uno: "unocss",
  unocss: "unocss",
  nuxt: "nuxt",
  nuxtrc: "nuxt",
  vite: "vite",
  windi: "windi",
  tailwind: "tailwind",
  eslint: "eslint",
  gitignore: "git",
  favicon: "favicon",
  tauri: "tauri",
  renovate: "renovate",
};

const ICON_SUFFIX_MAP = {
  js: "js",
  ts: "typescript",
  d: "typescriptdef",
  vue: "vue",
  html: "html",
  css: "postcss",
  less: "less",
  sass: "sass",
  json: "json",
  md: "markdown",
  rs: "rust",
  yml: "light-yaml",
  svg: "svg",
  png: "image",
  jpg: "image",
  gif: "image",
  webp: "image",
  default: "default-file",
};

const FOLDER_MAP = {
  vscode: "vscode",
  util: "tools",
  utils: "tools",
  default: "default-folder",
  template: "template",
  templates: "template",
  layout: "view",
  layouts: "view",
  page: "view",
  pages: "view",
  view: "view",
  src: "src",
  hook: "hook",
  component: "component",
  components: "component",
  style: "style",
  styles: "style",
  asset: "asset",
  assets: "asset",
  "src-tauri": "tauri",
  public: "public",
  node_modules: "node",
  dist: "dist",
  data: "db",
  model: "model",
  models: "model",
  module: "module",
  modules: "module",
  server: "server",
  type: "typings",
  types: "typings",
  github: "github",
  nuxt: "nuxt",
  app: "app",
  apps: "app",
  bin: "binary",
  ts: "typescript",
  typescript: "typescript",
};

export function handleFileIcon(type: string, fileName?: string) {
  const _h = (name: string) => () =>
    h("iconify-icon", { icon: "vscode-icons:" + name });

  // 文件
  if (type === "file") {
    const list = (fileName?.split(".") || [])
      .filter((v) => v)
      .map((v) => v.toLocaleLowerCase());

    // 前缀
    const prefix = list.shift() || "";
    let iconName = (ICON_PREFIX_MAP as any)[prefix];

    if (iconName) return _h("file-type-" + iconName);

    // 后缀
    const suffix = list.pop() || "";
    if (suffix == "ts" && list.pop() == "d") {
      return _h("file-type-" + ICON_SUFFIX_MAP.d);
    }

    iconName = (ICON_SUFFIX_MAP as any)[suffix];

    if (iconName) return _h("file-type-" + iconName);
    else return _h(ICON_SUFFIX_MAP.default);
  }
  // 文件夹
  else if (type === "dir") {
    const name = (fileName?.split(".") || []).filter((v) => v).shift() || "";

    const iconName = (FOLDER_MAP as any)[name];
    if (iconName) return _h("folder-type-" + iconName);
    else return _h(FOLDER_MAP.default);
  }
}
