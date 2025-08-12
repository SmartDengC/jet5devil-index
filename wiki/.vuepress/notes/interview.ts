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
        "主页",
        {
          text: "二哥的Java进阶之路", // 第一层如果为空，自动折叠需要设置为false
          icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "二哥的Java进阶之路/面渣逆袭-MySQL",
            "二哥的Java进阶之路/面渣逆袭-Redis",
            "二哥的Java进阶之路/面渣逆袭-Java SE",
            "二哥的Java进阶之路/面渣逆袭-Java集合框架",
            "二哥的Java进阶之路/面渣逆袭-Java并发编程",
            "二哥的Java进阶之路/面渣逆袭-JVM",
            "二哥的Java进阶之路/面渣逆袭-MyBatis",
            "二哥的Java进阶之路/面渣逆袭-分布式",
          ],
        },
        {
          text: "技术评测", // 第一层如果为空，自动折叠需要设置为false
          icon: "solar:tag-bold",
          collapsed: false,
          items: ["公司/知识大纲", "公司/2025年度技术测试知识点"],
        },
        {
          text: "面经", // 第一层如果为空，自动折叠需要设置为false
          icon: "solar:tag-bold",
          collapsed: false,
          items: ["面经/面试题"],
        },
      ],
    },
  ],
});
