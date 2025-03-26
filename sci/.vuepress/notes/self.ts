import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "myself",
  link: "/myself/",
  sidebar: [
    {
      text: "路由",
      icon: "gridicons:site",
      items: ["websites"],
    },
  ],
});
