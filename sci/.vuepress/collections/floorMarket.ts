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
      text: "看房日记",
      icon: "",
      items: ["买房日记-新房篇", "买房日记-二手房篇"],
    },
  ],
});
