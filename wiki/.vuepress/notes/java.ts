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
        {
          text: "基础类解读",
          collapsed: false,
          items: [
            "源码/实现类/JAVA源码解析：Integer类",
            "源码/实现类/JAVA源码解析：String类",
          ],
        },
        {
          text: "接口类解读",
          collapsed: false,
          items: [
            "源码/接口/JAVA源码解析：List接口",
            "源码/接口/JAVA源码解析：Queue接口",
            "源码/接口/JAVA源码解析：Deque接口",
          ],
        },
        {
          text: "实现类解读",
          collapsed: false,
          items: [
            "源码/实现类/JAVA源码解析：ArrayList类",
            "源码/实现类/JAVA源码解析：LinkedList类",
            "源码/实现类/JAVA源码解析：PriorityQueue类",
          ],
        },
      ],
    },
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: false,
      items: ["Java流Stream操作"],
    },
    {
      text: "数据结构",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        "数据结构：深入理解Java集合List",
        "数据结构：深入理解Java集合Set",
      ],
    },
  ],
});
