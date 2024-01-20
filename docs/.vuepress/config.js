import googleAnalyticsPlugin from "@vuepress/plugin-google-analytics";
import { defaultTheme } from "vuepress";
import themeSidebar from "vuepress-theme-sidebar";
import { searchPlugin } from "@vuepress/plugin-search";
// import vuepressPluginAnchorRight from "vuepress-plugin-anchor-right";

// const autoSidebar = require("vuepress-plugin-auto-sidebar");
// 侧边栏的插件使用不了 https://github.com/shanyuhai123/vuepress-plugin-auto-sidebar

export default {
    // base: "/docs/",  
  title: "阿聪的小破站",
  head: [
    ["link", { rel: "icon", href: "/assets/img/F.png" }],
    ["meta", { name: "author", content: "SmartDengC" }],
    ["meta", { name: "referrer", content: "no-referrer" }],  // 处理md文件中不展示gitee图片
  ],
  // theme: defaultTheme({
  theme: themeSidebar({
    // sidebarType: "right",
    logo: "/assets/img/hero.png",
    sidebar: false,
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
      { text: "首页", link: "/" },
      { text: "About", link: "/about" },
      { text: "Guide", link: "/guide" },
      { text: "Vuepress2.0", link: "/vuepress2.0" },
    ],
  }),
  plugins: [
    // ["vuepress-plugin-right-anchor"],
    searchPlugin({}), // 搜索栏
    googleAnalyticsPlugin({
      id: "G-XXXXXXXXXX",
    }),
    // vuepressPluginAnchorRight({}), // 文章右侧的锚点导航
  ],
};
