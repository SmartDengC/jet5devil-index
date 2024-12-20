import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  { text: "标签", link: "/blog/tags/", icon: "solar:tag-bold" },
  {
    text: "归档",
    link: "/blog/categories/",
    icon: "mingcute:triumphal-arch-fill",
  },
  {
    text: "备忘录",
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
        text: "重生之摸鱼学算法",
        link: "/algo/nhdaez5c/",
        icon: "devicon:algolia-wordmark",
      },
    ],
  },
  {
    text: "导航",
    icon: "mdi:about",
    items: [
      {
        text: "关于自己",
        link: "/self/hup3y0ye/",
        icon: "cib:player-me",
      },
      {
        text: "友情链接",
        link: "/friends/",
        icon: "fa-solid:user-friends",
      },
    ],
  },
]);
