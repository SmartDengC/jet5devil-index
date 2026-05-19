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
      items: ["Cet-4 Words Every Day", "English Daily Journal"],
    },
  ],
});
