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
  { text: "关于自己", link: "/self/hup3y0ye/", icon: "cib:player-me" },
  {
    text: "导航",
    icon: "mdi:about",
    items: [
      {
        text: "备忘录",
        link: "/article/tsxasfvv/",
        icon: "svg-spinners:tadpole",
      },
      {
        text: "算法基地",
        link: "/algo/nhdaez5c/",
        icon: "svg-spinners:tadpole",
      },
      {
        text: "友情链接",
        link: "/friends/",
        icon: "fa-solid:user-friends",
      },
    ],
  },
]);
