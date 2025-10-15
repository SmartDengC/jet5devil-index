import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "Reading",
  linkPrefix: "/reading/",
  sidebar: [
    {
      text: "阅读",
      icon: "tabler:mood-tongue-wink",
      items: [
        "阅读进度条",
        "读《软技能-代码之外的生存技能》",
        "读《制造业大模型的构建与实践》",
      ],
    },
  ],
});
