import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "flat-color-icons:home" },
  { text: "博客", link: "/blog/", icon: "flat-color-icons:view-details" },
  {
    text: "标签",
    link: "/blog/tags/",
    icon: "fluent-emoji-flat:keycap-hashtag",
  },
  {
    text: "笔记",
    icon: "flat-color-icons:folder",
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
    icon: "icon-park:more-two",
    items: [
      {
        text: "站点导航",
        link: "/article/ixu7719i/",
        icon: "cib:player-me",
      },
    ],
  },
]);
