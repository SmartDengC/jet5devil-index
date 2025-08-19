import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "economic",
  link: "/economic/",
  sidebar: [
    {
      text: "我在大A里面喝西北风",
      icon: "",
      items: [
        "复盘/我在A股里面喝西北风了",
        "复盘/2024年09月复盘",
        "复盘/2024年10月复盘",
        "复盘/2025年04月复盘",
        "复盘/2025年07月复盘",
        "复盘/2025年08月复盘",
      ],
    },
    {
      text: "信息差",
      icon: "",
      items: ["信息差/利弗莫尔交易", "信息差/金融常见概念", "信息差/量化交易"],
    },
  ],
});
