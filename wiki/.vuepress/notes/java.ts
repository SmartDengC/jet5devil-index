import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "源码解读",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "",
          collapsed: false,
          items: [
            {
              text: "java.lang",
              collapsed: true,
              items: [
                "源码/java.lang/Integer",
                "源码/java.lang/String",
                "源码/java.lang/Runnable",
                "源码/java.lang/Thread",
              ],
            },
            {
              text: "java.util",
              collapsed: true,
              items: [
                "源码/java.util/Optional",
                "源码/java.util/Arrays",
                "源码/java.util/Collections",
                "源码/java.util/List",
                "源码/java.util/Set",
                "源码/java.util/Map",
                "源码/java.util/HashSet",
                "源码/java.util/TreeSet",
                "源码/java.util/Stack",
                "源码/java.util/Queue",
                "源码/java.util/Deque",
                "源码/java.util/ArrayList",
                "源码/java.util/LinkedList",
                "源码/java.util/PriorityQueue",
                {
                  text: "concurrent",
                  collapsed: true,
                  items: ["源码/java.util/concurrent/ThreadPoolExecutor"],
                },
              ],
            },
            {
              text: "java.time",
              collapsed: true,
              items: [
                {
                  text: "format",
                  collapsed: true,
                  items: ["源码/java.time/format/DateTimeFormatter"],
                },
                "源码/java.time/LocalDateTime",
              ],
            },
            {
              text: "com.alibaba.fastjson",
              collapsed: true,
              items: ["源码/com.alibaba.fastjson/JSONObject"],
            },
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
      text: "手搓代码",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "",
          collapsed: false,
          items: ["手搓代码/70行手搓一个定时任务"],
        },
      ],
    },
  ],
});
