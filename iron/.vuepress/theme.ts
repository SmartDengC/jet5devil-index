import plumeTheme from "vuepress-theme-plume";
import navbar from "./navbar.js";
import notes from "./notes/index.js";

export default plumeTheme({
  contributors: true, // 显示贡献者

  notes, // 文章左边侧边栏
  navbar, // 上方导航栏navbar

  plugins: {
    git: true,
    // md增强
    markdownPower: {
      imageSize: true,
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
