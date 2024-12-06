import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Vue",
  link: "/vue/",
  sidebar: [
    {
      text: "Html",
      icon: "solar:tag-bold",
      items: [],
    },
    {
      text: "Css",
      icon: "solar:tag-bold",
      items: ["241013-CSS选择器"],
    },
    {
      text: "JavaScript",
      icon: "solar:tag-bold",
      items: [],
    },
  ],
});
