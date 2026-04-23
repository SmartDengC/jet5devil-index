import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "about",
  linkPrefix: "/mood/",
  sidebar: [
    {
      text: "信件",
      icon: "tabler:mood-tongue-wink",
      items: [
        "信件/给一年后自己的一封信",
        "信件/给四年后自己的一封信",
        "信件/给现在迷茫的自己",
      ],
    },
    {
      text: "复盘",
      icon: "tabler:mood-tongue-wink",
      items: [
        "复盘/2026年",
        {
          text: "",
          icon: "tabler:mood-tongue-wink",
          items: ["复盘/日期/Apr 21, 2026"],
        },
      ],
    },
    {
      text: "回顾",
      icon: "tabler:mood-tongue-wink",
      items: ["回顾/回顾我的2025"],
    },
  ],
});
