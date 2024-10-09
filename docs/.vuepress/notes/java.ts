import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      items: ["Java中初始化List", "Java中List的交并补操作"],
    },
  ],
});
