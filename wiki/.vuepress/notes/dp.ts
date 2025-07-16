import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "DesignPattern",
  link: "/design-pattern/",
  sidebar: [
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      collapsed: false,
      items: ["0.介绍", "策略模式（StrategyPattern）"],
    },
  ],
});
