import plumeTheme from "vuepress-theme-plume";
import navbar from "./navbar.js";
import notes from "./notes/index.js";
import path from "node:path";

export default plumeTheme({
  contributors: true, // 显示贡献者
  //   changelog: true,
  locales: {},
  editLinkText: "在 GitHub 上编辑此页", // 在Github上编辑此页
  editLinkPattern: ":repo/blob/:branch/:path",
  docsRepo: "https://github.com/SmartDengC/jet5devil-index",
  docsBranch: "master",
  docsDir: "docs",
  navbar, // 上方导航栏
  notes, // 左侧导航

  // sidebarMenuLabel: "Menu1",
  // returnToTopLabel: "到顶",
  bulletin: {
    // 网站公告
    layout: "top-right",
    title: "求求了，别浪费会员！！",
    contentFile: path.join(__dirname, "_bulletin.md"),
  },

  profile: {
    avatar: "/assets/img/min_header.jpg", // 头像
    name: "邓聪的小破站",
    description: "黑发不知勤学早，白首方悔读书迟。——颜真卿《劝学诗》",
    circle: true,
    location: "四川，成都",
  },
  social: [
    // 头像下发的链接图标
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
      "/self/v70gbzdk/": "dengcongorg", // 建站导航
    },
  },
  footer: { copyright: "Copyright © 2024-present dengcong" },
  // 文章自带插件，评论由 @vuepress/plugin-comment 提供支持。
  plugins: {
    git: true,
    markdownEnhance: {
      demo: true, // 启用前端预览
    },
    markdownPower: {
      bilibili: true,
      // repl: {
      //   // 启用golang
      //   go: true,
      // },
    },
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
});
