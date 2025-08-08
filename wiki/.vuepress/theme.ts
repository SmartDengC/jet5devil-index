import plumeTheme from "vuepress-theme-plume";
import navbar from "./navbar.js";
import notes from "./notes/index.js";

export default plumeTheme({
  contributors: true, // 显示贡献者
  changelog: true,
  locales: {},
  editLinkText: "在 GitHub 上编辑此页", // 在Github上编辑此页
  editLinkPattern: ":repo/blob/:branch/:path",
  docsRepo: "https://github.com/SmartDengC/jet5devil-index",
  docsBranch: "master",
  docsDir: "docs",

  // 文章自带插件，评论由 @vuepress/plugin-comment 提供支持。
  plugins: {
    // 先使用默认的搜索
    docsearch: {
      appId: "OLVPQ4G0YH",
      apiKey: "f21c616b8d5b875eb1b72a0b48080829",
      indexName: "dengcong",
    },
    git: true,
    markdownEnhance: {
      demo: true, // 启用前端预览
    },
    markdownPower: {
      bilibili: true,
      pdf: true,
    },
    // 代码配置
    shiki: {
      collapsedLines: true,
      lineNumbers: 10,
      languages: [
        "sh",
        "css",
        "html",
        "jsx",
        "javascript",
        "js",
        "ts",
        "stylus",
        "json",
        "yaml",
        "tsx",
        "dockerfile",
        "bash",
        "groovy",
        "yml",
        "md",
        "nginx",
        "toml",
        "rust",
        "vue",
        "java",
        "python",
      ],
    },

    // 把评论功能先关闭，增加界面加载速度
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
