import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["Java列表交集、并集、补集操作", "Java流Stream操作"],
    },
    {
      text: "数据结构",
      icon: "solar:tag-bold",
      collapsed: true,
      items: [
        "240614-数据结构｜深入理解Java队列Queue",
        "241206-数据结构｜深入理解Java集合List",
        "241205-数据结构｜深入理解Java集合Set",
      ],
    },
  ],
});
