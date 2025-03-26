import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Nginx",
  link: "/nginx/",
  sidebar: [
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["Nginx HTTPS配置二级域名"],
    },
  ],
});
