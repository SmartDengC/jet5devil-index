import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Algo",
  link: "/algo/",
  sidebar: [
    {
      text: "力扣竞赛",
      // icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "练习题",
          collapsed: false,
          items: [
            "练习题/新计划编程入门",
            "练习题/力扣每日一题【2024】",
            "练习题/力扣每日一题【2025】",
            "练习题/这次面试，我们轻装上阵",
          ],
        },
        {
          text: "周赛",
          collapsed: false,
          items: ["周赛/力扣2024周赛题题解", "周赛/力扣2025周赛题题解"],
        },
        {
          text: "双周赛",
          collapsed: false,
          items: ["双周赛/第153场双周赛", "双周赛/第132场双周赛"],
        },
        {
          text: "算法知识点",
          // icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "知识点/一、滑动窗口与双指针",
            "知识点/二、二分算法",
            "知识点/三、单调栈",
            "知识点/四、网格图",
            "知识点/五、位运算",
            "知识点/六、图论算法",
            "知识点/七、动态规划",
            "知识点/八、常见数据结构",
            "知识点/九、数据算法",
            "知识点/十、贪心与思维",
            "知识点/十一、链表、二叉树与回溯",
            "知识点/十二、字符串",
            "知识点/十三、模运算",
          ],
        },
      ],
    },
  ],
});
