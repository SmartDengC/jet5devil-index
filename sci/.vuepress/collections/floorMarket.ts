import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "FloorMarket",
  linkPrefix: "/floorMarket/",
  sidebar: [
    {
      text: "知识点",
      icon: "",
      items: ["买房的连环疑问"],
    },
    {
      text: "楼盘",
      icon: "",
      items: [
        "新房/锦江生态带-恒大天府半岛",
        "新房/天府新区万安-海伦堡玖悦府",
        "新房/高新远大-长冶南阳御龙府",
      ],
    },
    {
      text: "二手房",
      icon: "",
      items: [
        "二手房/华府-中海右岸",
        "二手房/锦江生态带-中海锦江云熙",
        "二手房/南湖公园-万科翡翠公园",
      ],
    },
  ],
});
