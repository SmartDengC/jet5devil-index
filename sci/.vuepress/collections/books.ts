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
        "宏观/读《软技能-代码之外的生存技能》",
        "宏观/读《制造业大模型的构建与实践》",
      ],
    },
    {
      text: "投资",
      icon: "tabler:mood-tongue-wink",
      items: [
        "投资/读《聪明的投资者》",
        "投资/读《投资中最简单的事》",
        "投资/读《投资稳赚》",
        "投资/读《日本蜡烛图技术》",
        "投资/读《小狗钱钱》",
      ],
    },
    {
      text: "心智",
      icon: "tabler:mood-tongue-wink",
      items: ["心智/读《保重》", "心智/读《王阳明心学的智慧》"],
    },
    {
      text: "宏观政策",
      icon: "tabler:mood-tongue-wink",
      items: [
        "宏观/读《底层逻辑-理解商业世界的本质2》",
        "宏观/读《中共中央关于十五五规划建议》",
      ],
    },
  ],
});
