import { viteBundler } from "@vuepress/bundler-vite";
import { plumeTheme } from "vuepress-theme-plume";
import { defineUserConfig } from "vuepress";
import navbar from "./navbar.js";

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  title: "阿聪的小破站",
  head: [
    ["link", { rel: "icon", href: "/assets/img/F.png" }],
    ["meta", { name: "author", content: "SmartDengC" }],
    ["meta", { name: "referrer", content: "no-referrer" }], // 处理md文件中不展示gitee图片
  ],
  theme: plumeTheme({
    // 在Github上编辑此页
    editLinkText: "在 GitHub 上编辑此页",
    editLinkPattern: ":repo/blob/:branch/:path",
    docsRepo: "https://github.com/SmartDengC/jet5devil-index",
    docsBranch: "master",
    docsDir: "docs",
    // 该目录下的所有文件都会被排除在博客文件之外， 可以将没有完成的文章先暂存到这里
    notes: { link: "/", dir: "notes", notes: [] },
    // 上方导航栏
    navbar,

    profile: {
      // 头像
      avatar: "/assets/img/min_header.jpg",
      name: "邓聪的小破站",
      description: "黑发不知勤学早，白首方悔读书迟。——颜真卿《劝学诗》",
      circle: true,
      location: "四川，成都",
    },
    social: [
      {
        icon: "github",
        link: "https://github.com/Smartdengc",
      },
      {
        icon: "slack",
        link: "https://leetcode.cn/u/smartdengc/",
      },
      {
        icon: "facebook",
        link: "http://8.137.124.148:8090/",
      },
    ],
    logo: "/assets/img/F.png",
    logoDark: "/assets/img/F_white.png",

    navbarSocialInclude: ["github"],
    encrypt: {
      rules: {
        "/article/ixu7719i/": "123456",
      },
    },
    footer: { copyright: "Copyright © 2024-present dengcong" },
    // 文章自带插件，评论由 @vuepress/plugin-comment 提供支持。
    plugins: {
      comment: {
        provider: "Giscus",
        repo: "SmartDengC/jet5devil-index",
        repoId: "R_kgDOLHhZSQ",
        category: "Q&A",
        categoryId: "DIC_kwDOLHhZSc4CckXc",
        lazyLoading: true,
        mapping: "title",
      },
    },
  }),
});
