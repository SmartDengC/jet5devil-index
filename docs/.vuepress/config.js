import googleAnalyticsPlugin from "@vuepress/plugin-google-analytics";
import { defaultTheme } from "vuepress";
// import themeSidebar from "vuepress-theme-sidebar";
import { searchPlugin } from "@vuepress/plugin-search";
// import vuepressPluginAnchorRight from "vuepress-plugin-anchor-right";

import { plumeTheme } from "vuepress-theme-plume";
import { commentPlugin } from "vuepress-plugin-comment2"; // 评论插件
// import { NavItem } from "vuepress-theme-plume";
// import { notes } from "./notes.ts";

// const autoSidebar = require("vuepress-plugin-auto-sidebar");
// 侧边栏的插件使用不了 https://github.com/shanyuhai123/vuepress-plugin-auto-sidebar

export default {
  // base: "/docs/",
  title: "阿聪的小破站",
  head: [
    ["link", { rel: "icon", href: "/assets/img/F.png" }],
    ["meta", { name: "author", content: "SmartDengC" }],
    ["meta", { name: "referrer", content: "no-referrer" }], // 处理md文件中不展示gitee图片
  ],
  // theme: defaultTheme({
  theme: plumeTheme({
    // theme: themeSidebar({
    // sidebarType: "right",
    // 0 主题plume配置
    // banner: "/assets/img/hero.png", // 配置首页大图

    // 1 默认主题配置
    logo: "/assets/img/hero.png",
    sidebar: true,
    // sidebar: {
    //   "/guide/": [
    //     {
    //       text: "Guide",
    //       collapsible: true,
    //       children: [
    //         "/guide/README.md",
    //         "/guide/2024-01-16-GIT经历0.md",
    //         "/guide/StompJS监听RabbitMq.md",
    //       ],
    //     },
    //   ],
    // },
    navbar: [
      { text: "首页", link: "/", icon: "material-symbols:home" },
      { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
      {
        text: "关于",
        icon: "mdi:about",
        // link: "/about",
        items: [
          { text: "关于自己", link: "/about", icon: "cib:player-me" },
          { text: "博客标签", link: "/blog/tags/", icon: "solar:tag-bold" },
          {
            text: "博客归档",
            link: "/blog/archives/",
            icon: "mingcute:triumphal-arch-fill",
          },
          {
            text: "友情链接",
            link: "/friends/",
            icon: "fa-solid:user-friends",
          },
        ],
      },
      // { text: "标签", link: "/blog/tags" },
      // { text: "归档", link: "/blog/archives" },
      {
        text: "Vuepress2.0",
        link: "/vuepress2.0",
        icon: "devicon-plain:vuetify",
      },
    ],
    // notes: {
    //   dir: "Guide",
    //   link: "/note/",
    //   notes,
    // },
  }),
  plugins: [
    // ["vuepress-plugin-right-anchor"],
    // searchPlugin({}), // 这个是vuepress2默认的搜索栏插件，plume自带搜索框
    googleAnalyticsPlugin({
      id: "G-XXXXXXXXXX",
    }),
    // vuepressPluginAnchorRight({}), // 文章右侧的锚点导航
    commentPlugin({
      provider: "Giscus",
      repo: "SmartDengC/jet5devil-index",
      repoId: "R_kgDOLHhZSQ",
      category: "Q&A",
      categoryId: "DIC_kwDOLHhZSc4CckXc",
      lazyLoading: true,
      mapping: "title",
    }),
  ],
};
