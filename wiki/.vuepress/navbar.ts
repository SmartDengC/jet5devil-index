import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "flat-color-icons:home" },
  { text: "博客", link: "/blog/", icon: "flat-color-icons:view-details" },
  {
    text: "系列文章",
    icon: "flat-color-icons:folder",
    items: [
      { text: "摸鱼学Java", link: "/java/7jwo1djx/", icon: "devicon:java" },
      { text: "摸鱼学Vue", link: "/vue/o7pmqwo4/", icon: "logos:vue" },
      { text: "摸鱼学Nginx", link: "/nginx/lkksx340/", icon: "logos:nginx" },
      {
        text: "数据结构与算法",
        link: "/algorithm/",
        activeMatch: "^/algorithm/",
        icon: "hugeicons:algorithm",
      },
      {
        text: "设计模式",
        link: "/design-pattern/",
        activeMatch: "^/design-pattern/",
        icon: "emojione:bookmark-tabs",
      },
    ],
  },

  {
    text: "更多",
    icon: "icon-park:more-two",
    items: [
      {
        text: "SCIENCE",
        link: "https://sci.hahadeng.cn/",
        icon: "streamline-color:ai-science-spark",
      },
      {
        text: "IRONMAN",
        link: "https://iron.hahadeng.cn/",
        icon: "noto:person-swimming",
      },
      {
        text: "关于我",
        link: "/self/hup3y0ye/",
        icon: "cib:player-me",
      },
      { text: "标签", link: "/blog/tags/", icon: "solar:tag-bold" },
      {
        text: "站点导航",
        link: "/sites-collect/",
        icon: "mdi:roadmap",
        activeMatch: "^/sites-collect",
      },
      {
        text: "AI 模型导航",
        link: "/ai/",
        icon: "eos-icons:ai",
        activeMatch: "^/ai/",
      },
    ],
  },
]);
