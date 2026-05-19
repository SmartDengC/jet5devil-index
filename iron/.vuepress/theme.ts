import plumeTheme from "vuepress-theme-plume";

export default plumeTheme({
  contributors: true, // 显示贡献者
  // docsDir: "iron",

  plugins: {
    git: true,
    markdownPower: {
      imageSize: true,
      artPlayer: true,
    },
    // 评论插件
    comment: {
      provider: "Giscus",
      repo: "SmartDengC/ironman-index",
      repoId: "R_kgDOI8UoLA",
      category: "Q&A",
      categoryId: "DIC_kwDOI8UoLM4Cc7nG",
      lazyLoading: true,
      mapping: "title",
    },
  },
});
