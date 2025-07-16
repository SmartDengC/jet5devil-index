import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/", icon: "material-symbols:home" },
  { text: "博客", link: "/blog/", icon: "fluent-mdl2:reading-mode-solid" },
  { text: "标签", link: "/blog/tags/", icon: "solar:tag-bold" },
  {
    text: "后端面试题",
    link: "/interview/",
    activeMatch: "^/interview/",
    icon: "codicon:comment-unresolved",
  },
  {
    text: "笔记",
    icon: "mdi:about",
    items: [
      {
        text: "摸鱼学Java",
        link: "/java/7jwo1djx/",
        icon: "devicon:java",
      },
      {
        text: "摸鱼学Vue",
        link: "/vue/o7pmqwo4/",
        icon: "logos:vue",
      },
      {
        text: "摸鱼学Nginx",
        link: "/nginx/lkksx340/",
        icon: "logos:nginx",
      },
      {
        text: "摸鱼学Linux",
        link: "/linux/9lbk5fti/",
        icon: "logos:linux-tux",
      },
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
    icon: "mingcute:more-3-fill",
    items: [
      {
        text: "关于我",
        link: "/self/hup3y0ye/",
        icon: "cib:player-me",
      },
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
