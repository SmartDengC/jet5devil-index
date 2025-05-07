import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "源码解读",
      // icon: "solar:tag-bold",
      collapsed: true,
      items: [
        {
          text: "",
          // icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "源码/实现类/JAVA源码解析：Integer类",
            "源码/实现类/JAVA源码解析：String类",
            "源码/接口/JAVA源码解析：List接口",
            "源码/接口/JAVA源码解析：Set接口",
            "源码/接口/JAVA源码解析：Queue接口",
            "源码/接口/JAVA源码解析：Deque接口",
            "源码/实现类/JAVA源码解析：ArrayList类",
            "源码/实现类/JAVA源码解析：LinkedList类",
            "源码/实现类/JAVA源码解析：PriorityQueue类",
            "源码/工具类/JAVA源码解析：Arrays工具类",
            "源码/工具类/JAVA源码解析：Collections工具类",
          ],
        },
      ],
    },
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "",
          collapsed: false,
          items: ["JAVA知识点：学习使用Stream流"],
        },
      ],
    },
    {
      text: "数据结构",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [],
    },
  ],
});
