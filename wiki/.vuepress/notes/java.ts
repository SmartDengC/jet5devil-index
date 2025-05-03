import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "源码解读",
      // icon: "solar:tag-bold",
      collapsed: false,
      items: [
        "源码/实现类/JAVA源码解析：Integer类",
        "源码/实现类/JAVA源码解析：String类",
        "源码/接口/JAVA源码解析：Queue接口",
        "源码/接口/JAVA源码解析：Deque接口",
        {
          text: "队列实现",
          collapsed: false,
          items: [
            "源码/实现类/JAVA源码解析：PriorityQueue类",
            "源码/实现类/JAVA源码解析：LinkedList类",
          ],
        },
      ],
    },
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: false,
      items: ["Java列表交集、并集、补集操作", "Java流Stream操作"],
    },
    {
      text: "数据结构",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        "数据结构：深入理解Java队列Queue",
        "数据结构：深入理解Java集合List",
        "数据结构：深入理解Java集合Set",
      ],
    },
  ],
});
