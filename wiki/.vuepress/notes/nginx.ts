import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Nginx",
  link: "/nginx/",
  sidebar: [
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "个人总结", // 第二层text不能为空
          icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "Nginx基本入门知识点",
            "Nginx HTTPS配置二级域名",
            "Nginx代理文件目录，并设置访问权限",
            "Nginx location路径匹配规则",
            "Nginx开启日志输出",
            "Nginx在MAC电脑上如何操作？",
            "Nginx在Linux电脑上如何操作？",
            "Nginx配置error_page",
          ],
        },
      ],
    },
  ],
});
