import { NIcon } from "naive-ui";
import FolderIcon from "../components/icons/folder.vue";
import JsIcon from "../components/icons/js.vue";
import TsIcon from "../components/icons/ts.vue";
import VueIcon from "../components/icons/vue.vue";
import CssIcon from "../components/icons/css.vue";
import LessIcon from "../components/icons/less.vue";
import SassIcon from "../components/icons/sass.vue";
import JsonIcon from "../components/icons/json.vue";
import CodeIcon from "../components/icons/code.vue";
import MdIcon from "../components/icons/md.vue";
import RsIcon from "../components/icons/rust.vue";

export function handleFileIcon(type: string, fileName?: string) {
  const hh = (Icon: any) => () => h(NIcon, null, { default: () => h(Icon) });

  if (type === "file") {
    const t = fileName?.split(".").pop();
    switch (t) {
      case "js":
        return hh(JsIcon);
      case "ts":
        return hh(TsIcon);
      case "vue":
        return hh(VueIcon);
      case "css":
        return hh(CssIcon);
      case "less":
        return hh(LessIcon);
      case "sass":
        return hh(SassIcon);
      case "json":
        return hh(JsonIcon);
      case "md":
        return hh(MdIcon);
      case "rs":
        return hh(RsIcon);
      default:
        return hh(CodeIcon);
    }
  } else if (type === "dir") {
    return hh(FolderIcon);
  }
}

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
