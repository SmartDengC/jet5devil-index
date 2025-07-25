import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "Head", link: "/", icon: "material-symbols:home" },
  { text: "Blog", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  { text: "Tags", link: "/blog/tags/", icon: "solar:tag-bold" },
  // {
  //   text: "Archives",
  //   link: "/blog/categories/",
  //   icon: "mingcute:triumphal-arch-fill",
  // },
  {
    text: "books",
    link: "/reading/",
    activeMatch: "^/reading/",
    icon: "codicon:comment-unresolved",
  },
  {
    text: "Backup",
    icon: "mdi:about",
    items: [
      { text: "鸿鹄之志哉！", link: "/mood/7zt578oz/", icon: "cib:player-me" },
      {
        text: "你在干什么？我在楼市站岗！！",
        link: "/floorMarket/5i5wigeb/",
        icon: "f7:house-fill",
      },
      {
        text: "财经热点信息",
        link: "/economic/wly8r8pr/",
        icon: "cib:bitcoin",
      },
      {
        text: "不学英语可以吗？",
        link: "/English/lp980u9b/",
        icon: "icon-park-outline:english",
      },
    ],
  },
  // {
  //   text: "About",
  //   icon: "mdi:about",
  //   items: [
  //     { text: "Self", link: "/myself/01adbcbs/", icon: "cib:player-me" },
  //     { text: "Friends", link: "/friends/", icon: "fa-solid:user-friends" },
  //   ],
  // },
]);
