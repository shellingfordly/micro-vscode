// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    ["flex-center", "flex justify-center items-center"],
    ["flex-col-between", "flex flex-col justify-between"],
    ["op-hover", "cursor-pointer op60 hover:op100"],
    ["bg-hover", "cursor-pointer hover:bg-sky"],
    [/flex-(\w+)-(\w+)/, ([_, h, v]) => `flex justify-${h} items-${v}`],
  ],
  theme: {},
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        height: "1.2em",
        width: "1.2em",
        "vertical-align": "text-bottom",
      },
    }),
    presetTypography(),
    presetWebFonts(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
