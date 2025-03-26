import plumeTheme from "vuepress-theme-plume";
import navbar from "./navbar.js";
import notes from "./notes/index.js";

export default plumeTheme({
  // banner: "/assets/img/hero.png", // 配置首页大图
  contributors: true, // 显示贡献者

  // 左侧导航栏
  notes,
  // 上方导航栏
  navbar,

  navbarSocialInclude: ["github"],
  encrypt: {
    rules: {
      "/article/ixu7719i/": "123456",
      // "/floorMarket/5i5wigeb/": "dengcongorg",
    },
  },
  footer: { copyright: "Copyright © 2024-present dengcong" },
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
      repo: "SmartDengC/science-index",
      repoId: "R_kgDOLEm-IA",
      category: "Q&A",
      categoryId: "DIC_kwDOLEm-IM4Cc7m6",
      lazyLoading: true,
      mapping: "title",
    },
  },
});
