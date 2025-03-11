import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "About",
  link: "/self/",
  sidebar: [
    {
      text: "个人总结",
      icon: "solar:tag-bold",
      collapsed: true,
      items: ["站点导航", "书籍导航", "建站导航"],
    },
    {
      text: "项目总结",
      icon: "solar:tag-bold",
      collapsed: true,
      items: [
        "项目：PH（摄影小站）建站记录",
        "项目：阿聪的小破站建站记录",
        {
          text: "功能扩展",
          icon: "solar:tag-bold",
          collapsed: true,
          items: [
            "功能扩展：创建服务、备案域名实现Bing每日壁纸",
            "功能扩展：为什么使用Giscus作为博客的评论系统",
            "功能扩展：小破站接入Algolia Docsearch实现搜索增强",
          ],
        },
      ],
    },
  ],
});
