import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  { text: "标签", link: "/blog/tags/", icon: "solar:tag-bold" },
  // {
  //   text: "归档",
  //   link: "/blog/categories/",
  //   icon: "mingcute:triumphal-arch-fill",
  // },
  {
    text: "小册子",
    icon: "mdi:about",
    items: [
      {
        text: "重生之摸鱼学Java",
        link: "/java/7jwo1djx/",
        icon: "devicon:java",
      },
      {
        text: "重生之摸鱼学Vue",
        link: "/vue/o7pmqwo4/",
        icon: "logos:vue",
      },
      {
        text: "重生之摸鱼学Nginx",
        link: "/nginx/lkksx340/",
        icon: "logos:nginx",
      },
      {
        text: "重生之摸鱼学算法",
        link: "/algo/nhdaez5c/",
        icon: "devicon:algolia-wordmark",
      },
    ],
  },
  {
    text: "关于我",
    link: "/self/hup3y0ye/",
    icon: "cib:player-me",
  },
  {
    text: "更多",
    icon: "mingcute:more-3-fill",
    items: [
      {
        text: "书籍推荐",
        link: "/ebooks/",
        icon: "material-symbols:recommend",
        activeMatch: "^/ebooks/",
      },
      {
        text: "站点导航",
        link: "/sites-collect/",
        icon: "mdi:roadmap",
        activeMatch: "^/sites-collect",
      },
      {
        text: "友链",
        link: "/friends/",
        icon: "fa-solid:user-friends",
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
