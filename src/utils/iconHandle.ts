export const ICON_PREFIX_MAP = {
  cargo: "file-type-cargo",
  "pnpm-lock": "file-type-pnpm",
  license: "file-type-license",
  vercel: "file-type-vercel",
  tsconfig: "file-type-tsconfig",
  uno: "file-type-unocss",
  unocss: "file-type-unocss",
  nuxt: "file-type-nuxt",
  vite: "file-type-vite",
  windi: "file-type-windi",
  tailwind: "file-type-tailwind",
  eslint: "file-type-eslint",
  package: "file-type-npm",
  gitignore: "file-type-git",
  favicon: "file-type-favicon",
};

export const ICON_SUFFIX_MAP = {
  js: "file-type-js",
  ts: "file-type-typescript",
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
  default: "default-file",
};

const FOLDER_MAP = {
  default: "default-folder",
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

    if (iconName) return _h(iconName);

    // 后缀
    const suffix = list.pop() || "default";
    iconName = (ICON_SUFFIX_MAP as any)[suffix];

    if (iconName) return _h(iconName);
  }
  // 文件夹
  else if (type === "dir") {
    return _h(FOLDER_MAP.default);
  }
}
