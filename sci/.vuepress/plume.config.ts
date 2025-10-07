import { defineThemeConfig } from "vuepress-theme-plume";
import notes from "./notes/index.js";
import navbar from "./navbar.js";

export default defineThemeConfig({
  // 1 默认主题配置
  logo: "F.png",
  logoDark: "F_white.png",

  navbar,
  notes,

  profile: {
    avatar: "/images/min_header.jpg", // 头像
    name: "DENGCONG",
    description: "Boosting oneself is the greatest confidence.",
    circle: true,
    location: "四川，成都",
  },
  social: [
    {
      icon: "github",
      link: "https://github.com/Smartdengc",
    },
    {
      icon: "twitter",
      link: "/sites-collect/",
    },
  ],

  editLinkText: "在 GitHub 上编辑此页",
  footer: { copyright: "Copyright © 2021-present dengcong" },
  externalLinkIcon: false,
});
