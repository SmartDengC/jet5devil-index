import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Java",
  link: "/java/",
  sidebar: [
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      items: [
        "Java创建列表并初始化",
        "Java列表交集、并集、补集操作",
        "Java流Stream操作",
      ],
    },
    {
      text: "数据结构",
      icon: "solar:tag-bold",
      items: ["PriorityQueue(优先级队列)", "Deque(双端队列)"],
    },
  ],
});
