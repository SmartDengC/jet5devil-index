import plumeTheme from "vuepress-theme-plume";

export default plumeTheme({
  contributors: true, // 显示贡献者
  changelog: true,
  locales: {},
  editLinkText: "在 GitHub 上编辑此页", // 在Github上编辑此页
  editLinkPattern: ":repo/blob/:branch/:path",
  docsRepo: "https://github.com/SmartDengC/jet5devil-index",
  docsBranch: "master",
  docsDir: "docs",
  // blog: {
  //   postCover: {
  //     layout: "left",
  //     ratio: "4:3",
  //     width: 300,
  //   },
  //   pagination: {
  //     perPage: 10,
  //   },
  // },

  // 文章自带插件，评论由 @vuepress/plugin-comment 提供支持。
  plugins: {
    // 先使用默认的搜索
    docsearch: {
      appId: "901EF08F0T",
      apiKey: "0fe61a1a8eb53b01eb64d0c3c75a1d57",
      // indexName: "dengcong",
    },
    git: true,
    markdownPower: {
      demo: true, // 启用前端预览
      bilibili: true,
      pdf: true,
    },
    // 代码配置
    shiki: {
      collapsedLines: true,
      lineNumbers: 10,
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
