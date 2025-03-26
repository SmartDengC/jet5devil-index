import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "FloorMarket",
  link: "/floorMarket/",
  sidebar: [
    {
      text: "楼盘",
      icon: "",
      items: [
        "锦江生态带-恒大天府半岛",
        "天府新区万安-海伦堡玖悦府",
        "高新远大-长冶南阳御龙府",
      ],
    },
    {
      text: "二手房",
      icon: "",
      items: ["华府-中海右岸"],
    },
  ],
});
