import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Vue",
  link: "/vue/",
  sidebar: [
    {
      text: "Html",
      // icon: "solar:tag-bold",
      collapsed: true,
      items: [],
    },
    {
      text: "Css",
      // icon: "solar:tag-bold",
      collapsed: true,
      items: ["241013-CSS选择器"],
    },
    {
      text: "JavaScript",
      // icon: "solar:tag-bold",
      collapsed: true,
      items: [],
    },
    {
      text: "Vue",
      icon: "",
      collapsed: true,
      items: [
        "Vue：快速掌握Vue核心语法（一）",
        "Vue：快速学会Vue脚手架与组件开发（二）",
        "Vue：快速入手VueRouter、Vuex（三）",
        "Vue：综合案例快速巩固复习Vue（四）",
      ],
    },
  ],
});
