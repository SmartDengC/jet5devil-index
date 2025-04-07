import { defineThemeConfig } from "vuepress-theme-plume";
import notes from "./notes/index.js";
import navbar from "./navbar.js";

export default defineThemeConfig({
  // 1 默认主题配置
  logo: "F.png",
  logoDark: "F_white.png",

  // 左侧导航栏
  notes,
  // 上方导航栏
  navbar,

  profile: {
    // 头像
    avatar: "/images/min_header.jpg",
    name: "邓聪的小破站",
    description: "黑发不知勤学早，白首方悔读书迟。——颜真卿《劝学诗》",
    circle: true,
  },
  social: [
    {
      icon: "github",
      link: "https://github.com/Smartdengc",
    },
    {
      icon: "slack",
      link: "https://leetcode.cn/u/smartdengc/",
    },
  ],

  editLinkText: "在 GitHub 上编辑此页",
  footer: { copyright: "Copyright © 2021-present dengcong" },
  externalLinkIcon: false,
});
