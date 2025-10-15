import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "About",
  linkPrefix: "/self/",
  sidebar: [
    {
      text: "项目总结",
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        "项目：PH（摄影小站）建站记录",
        "项目：阿聪的小破站建站记录",
        { text: "网站导航", items: ["导航：个人部署的网站导航"] },
        {
          text: "功能扩展",
          collapsed: false,
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
