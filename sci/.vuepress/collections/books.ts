import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "Reading",
  linkPrefix: "/reading/",
  sidebar: [
    {
      text: "",
      icon: "tabler:mood-tongue-wink",
      items: ["阅读进度条"],
    },
    {
      text: "专业",
      icon: "tabler:mood-tongue-wink",
      items: [
        "读《软技能-代码之外的生存技能》",
        "读《制造业大模型的构建与实践》",
      ],
    },
    {
      text: "投资",
      icon: "tabler:mood-tongue-wink",
      items: ["读《聪明的投资者》", "读《投资中最简单的事》"],
    },
    {
      text: "心情",
      icon: "tabler:mood-tongue-wink",
      items: ["读《保重》", "读《底层逻辑-理解商业世界的本质2》"],
    },
  ],
});
