import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "About",
  link: "/self/",
  sidebar: [
    {
      text: "个人总结",
      // icon: "solar:tag-bold",
      collapsed: true,
      items: ["站点导航", "书籍导航", "建站导航"],
    },
    {
      text: "项目总结",
      icon: "",
      collapsed: true,
      items: ["项目：PH（摄影小站）建站记录", "项目：阿聪的小破站建站记录"],
    },
  ],
});
