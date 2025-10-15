import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "English",
  linkPrefix: "/English/",
  sidebar: [
    {
      text: "工作中学英语",
      icon: "",
      items: ["Words in Leetcode", "Words in Work"],
    },
    {
      text: "背单词",
      icon: "",
      items: ["QwertyLearner/Cet-4 Words Every Day"],
    },
    {
      text: "研发中学英语",
      icon: "",
      items: [
        "How to Build a Delightful Loading Screen in 5 mintues",
        "How to build an HTML calculator app from scratch using JavaScript",
      ],
    },
    {
      text: "书籍中学英语",
      icon: "",
      items: ["程序员的英语"],
    },
  ],
});
