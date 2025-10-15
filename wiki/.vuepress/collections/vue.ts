import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "Vue",
  linkPrefix: "/vue/",
  sidebar: [
    {
      text: "一、HTML",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["HTML：文件引入Vue.js"],
    },
    {
      text: "二、CSS",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["CSS：CSS选择器"],
    },
    {
      text: "三、JavaScript",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["JS：JavaScript Drum Kit", "JS：JavaScript写算法"],
    },
    {
      text: "四、TypeScript",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["TS：TypeScript快速入门"],
    },
    {
      text: "五、Vue",
      icon: "solar:tag-bold",
      collapsed: true,
      items: [
        "Vue：快速掌握Vue核心语法（一）",
        "Vue：快速学会Vue脚手架与组件开发（二）",
        "Vue：快速入手VueRouter、Vuex（三）",
        "Vue：综合案例快速巩固复习Vue（四）",
        {
          text: "知识点",
          icon: "solar:tag-bold",
          collapsed: true,
          items: ["Vue：moment学习记录.md", "Vue：Vue问题集"],
        },
      ],
    },
  ],
});
