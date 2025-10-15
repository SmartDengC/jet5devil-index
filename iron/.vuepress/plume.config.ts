import { defineThemeConfig } from "vuepress-theme-plume";
import navbar from "./navbar.js";
import collections from "./collections/index.js";

export default defineThemeConfig({
  logo: "F.png",
  logoDark: "F_white.png",

  profile: {
    avatar: "images/min_header.jpg", // 头像
    name: "IronDeng",
    description: "黑发不知勤学早，白首方悔读书迟。——颜真卿《劝学诗》",
    circle: true,
    location: "四川，成都",
  },
  social: [
    {
      icon: "github",
      link: "https://github.com/Smartdengc",
    },
    {
      icon: "x",
      link: "http://triathlon.basts.com.cn/#home",
    },
  ],

  locales: {
    "/": {
      navbar: navbar,
      collections: collections,
    },
  },

  editLinkText: "在 GitHub 上编辑此页",
  footer: { copyright: "Copyright © 2021-present dengcong" },
  externalLinkIcon: false,
});
