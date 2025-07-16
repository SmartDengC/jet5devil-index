import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Interview",
  link: "/interview/",
  sidebar: [
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        "0.介绍",

        {
          text: "二哥的Java进阶之路", // 第一层如果为空，自动折叠需要设置为false
          icon: "solar:tag-bold",
          collapsed: false,
          items: ["二哥的Java进阶之路/面渣逆袭-Java SE"],
        },
      ],
    },
  ],
});
