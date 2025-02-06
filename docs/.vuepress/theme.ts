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
    title: "求求了，快滚去学习！！！",
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
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><path fill="#000" d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
        name: "leetcode",
      },
      link: "https://leetcode.cn/u/smartdengc/",
    },
    {
      icon: "facebook",
      link: "http://8.137.124.148:8090/",
    },
  ],
  logo: "/assets/img/F.png",
  logoDark: "/assets/img/F_white.png",

  navbarSocialInclude: ["github", "leetcode"],
  encrypt: {
    rules: {
      "/self/v70gbzdk/": "dengcongorg", // 建站导航
    },
  },
  footer: { copyright: "Copyright © 2024-present dengcong" },
  // 文章自带插件，评论由 @vuepress/plugin-comment 提供支持。
  plugins: {
    // docsearch: {
    //   appId: "OLVPQ4G0YH",
    //   apiKey: "f21c616b8d5b875eb1b72a0b48080829",
    //   indexName: "dengcong",
    // },
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
    // 把评论功能先关闭，增加界面加载速度
    // comment: {
    //   provider: "Giscus",
    //   repo: "SmartDengC/jet5devil-index",
    //   repoId: "R_kgDOLHhZSQ",
    //   category: "Q&A",
    //   categoryId: "DIC_kwDOLHhZSc4CckXc",
    //   lazyLoading: true,
    //   mapping: "title",
    // },
  },
});
