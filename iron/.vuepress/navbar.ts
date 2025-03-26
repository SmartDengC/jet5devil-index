import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  // { text: "关于自己", link: "/about/", icon: "cib:player-me" },
  { text: "标签", link: "/blog/tags/", icon: "solar:tag-bold" },
  // {
  //   text: "归档",
  //   link: "/blog/categories/",
  //   icon: "mingcute:triumphal-arch-fill",
  // },
  {
    text: "笔记",
    icon: "mdi:about",
    items: [
      {
        text: "马拉松训练营",
        link: "/jmcc/3lle4c8d/",
        icon: "",
      },
      {
        text: "让阅读成为自己的习惯",
        link: "/book/tq71qoon/",
        icon: "",
      },
    ],
  },

  {
    text: "更多",
    icon: "mdi:about",
    items: [
      {
        text: "站点导航",
        link: "/article/ixu7719i/",
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
