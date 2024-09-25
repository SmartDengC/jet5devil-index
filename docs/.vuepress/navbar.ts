import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  { text: "关于自己", link: "/article/hup3y0ye/", icon: "cib:player-me" },
  { text: "博客标签", link: "/blog/tags/", icon: "solar:tag-bold" },
  {
    text: "博客归档",
    link: "/blog/categories/",
    icon: "mingcute:triumphal-arch-fill",
  },
  {
    text: "导航",
    icon: "mdi:about",
    items: [
      {
        text: "站点导航",
        link: "/article/ixu7719i/",
        icon: "cib:player-me",
      },
      {
        text: "书籍导航",
        link: "/article/w9boeev6/",
        icon: "solar:tag-bold",
      },
      {
        text: "友情链接",
        link: "/friends/",
        icon: "fa-solid:user-friends",
      },
    ],
  },
]);
