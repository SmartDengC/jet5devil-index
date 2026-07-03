import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "Algo",
  linkPrefix: "/algo/",
  sidebar: [
    {
      text: "Knowledge",
      // icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "LeetBook",
          collapsed: false,
          items: ["LeetBook/数组和字符串", "LeetBook/整理常见的几种排序算法"],
        },
        {
          text: "Knowledge Points",
          // icon: "solar:tag-bold",
          collapsed: true,
          items: [
            "知识点/一、滑动窗口与双指针",
            "知识点/二、二分算法",
            "知识点/三、单调栈",
            "知识点/四、网格图",
            {
              text: "位运算",
              collapsed: true,
              items: ["知识点/位运算/位运算基础", "知识点/位运算/位运算题单"],
            },
            "知识点/六、图论算法",
            "知识点/七、动态规划",
            "知识点/八、常见数据结构",
            {
              text: "数学算法",
              collapsed: true,
              items: [
                "知识点/数学算法/数学算法基础",
                "知识点/数学算法/数学算法题单",
              ],
            },
            "知识点/十、贪心与思维",
            "知识点/十一、链表、二叉树与回溯",
            "知识点/十二、字符串",
            "知识点/十三、模运算",
          ],
        },
      ],
    },
    {
      text: "Contest",
      // icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "Exercises",
          collapsed: false,
          items: ["练习题/这次面试，我们轻装上阵", "练习题/力扣刷题笔记"],
        },
        {
          text: "Daily Question",
          collapsed: false,
          items: [
            "Daily Question/力扣每日一题【2024】",
            "Daily Question/力扣每日一题【2025】",
            "Daily Question/力扣每日一题【2026】",
          ],
        },
        {
          text: "Leetcode Contest",
          collapsed: false,
          items: [
            "Leetcode Contest/力扣 2026 年竞赛题",
            "Leetcode Contest/力扣 2025 年竞赛题",
            "Leetcode Contest/力扣 2024 年竞赛题",
          ],
        },
      ],
    },
  ],
});
