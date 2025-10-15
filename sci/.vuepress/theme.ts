import plumeTheme from "vuepress-theme-plume";

export default plumeTheme({
  contributors: true, // 显示贡献者

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
