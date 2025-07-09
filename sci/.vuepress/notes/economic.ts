import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "economic",
  link: "/economic/",
  sidebar: [
    {
      text: "复盘",
      icon: "",
      items: [
        "复盘/2024年09月复盘",
        "复盘/2024年10月复盘",
        "复盘/2025年04月复盘",
        "复盘/2025年07月复盘",
      ],
    },
    {
      text: "咨询",
      icon: "",
      items: ["财经热点信息"],
    },
  ],
});
