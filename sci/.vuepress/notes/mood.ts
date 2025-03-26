import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "about",
  link: "/mood/",
  sidebar: [
    {
      text: "随笔",
      icon: "tabler:mood-tongue-wink",
      items: ["给一年后自己的一封信", "给四年后自己的一封信"],
    },
  ],
});
