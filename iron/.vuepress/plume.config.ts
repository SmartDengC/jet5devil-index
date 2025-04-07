import { defineThemeConfig } from "vuepress-theme-plume";
import notes from "./notes/index.js";
import navbar from "./navbar.js";

export default defineThemeConfig({
  // 1 默认主题配置
  logo: "F.png",
  logoDark: "F_white.png",

  notes, // 文章左边侧边栏
  navbar, // 上方导航栏navbar

  profile: {
    avatar: "images/min_header.jpg", // 头像
    name: "IronDeng",
    description: "黑发不知勤学早，白首方悔读书迟。——颜真卿《劝学诗》",
    circle: true,
    location: "四川，成都",
  },
  social: [
    // 社交图标 配置教程地址： https://plume.pengzhanbo.cn/config/basic/#social
    {
      icon: "github",
      link: "https://github.com/Smartdengc",
    },
    {
      icon: "x",
      link: "http://triathlon.basts.com.cn/#home",
    },
  ],

  editLinkText: "在 GitHub 上编辑此页",
  footer: { copyright: "Copyright © 2021-present dengcong" },
  externalLinkIcon: false,
});
