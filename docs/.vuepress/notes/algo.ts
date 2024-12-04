import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Algo",
  link: "/algo/",
  sidebar: [
    {
      text: "每日一题",
      icon: "solar:tag-bold",
      items: [
        "240215-力扣每日一题题解",
        "240611-Krahets笔面试精选 88 题",
        "241203-新计划-编程入门",
      ],
    },

    {
      text: "周赛",
      icon: "solar:tag-bold",
      items: ["240603-力扣周赛题题解", "240603-力扣双周赛题题解"],
    },
    {
      text: "知识点",
      icon: "solar:tag-bold",
      items: [
        "240111-知识点｜贪心算法详解",
        "240212-知识点｜动态规划详解",
        "240221-知识点｜二分查找算法详解",
        "240221-知识点｜前缀树算法详解",
        "240222-知识点｜回溯算法详解",
        "240222-知识点｜前缀和算法详解",
        "240319-知识点｜单调栈算法详解",
        "240328-知识点｜图论",
        "240331-知识点｜滑动窗口算法框架",
        "240404-知识点｜并查集详解",
        "240407-知识点｜KMP算法详解",
      ],
    },
  ],
});
