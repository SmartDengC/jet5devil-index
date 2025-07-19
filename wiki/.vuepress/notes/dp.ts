import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "DesignPattern",
  link: "/design-pattern/",
  sidebar: [
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "面向对象",
          icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "面向对象编程/面向对象编程OOP",
            "面向对象编程/面向对象编程SOLID原则",
          ],
        },
        {
          text: "设计模式",
          icon: "solar:tag-bold",
          collapsed: false,
          items: ["设计模式/0.介绍", "设计模式/策略模式（StrategyPattern）"],
        },
      ],
    },
  ],
});
