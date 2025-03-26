import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  link: "/book/",
  dir: "人类进步的阶梯",
  sidebar: [
    {
      text: "书籍",
      icon: "mdi:language-typescript",
      items: [
        "《马拉松训练宝典(2023年新版)》",
        "《丹尼尔斯经典跑步训练法》",
        "《刷新PB：跑步提速指南》",
      ],
    },
  ],
});
