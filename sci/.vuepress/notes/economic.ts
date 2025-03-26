import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "economic",
  link: "/economic/",
  sidebar: [
    {
      text: "复盘",
      icon: "",
      items: [
        "2024年09月27号复盘A股",
        "2024年09月30号复盘A股",
        "2024年10月10号复盘A股",
        "2024年10月15号复盘A股",
        "2024年10月21号复盘A股",
      ],
    },
    {
      text: "咨询",
      icon: "",
      items: ["财经热点信息"],
    },
  ],
});
