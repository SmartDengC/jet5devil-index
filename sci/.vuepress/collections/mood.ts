import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "about",
  linkPrefix: "/mood/",
  sidebar: [
    {
      text: "随笔",
      icon: "tabler:mood-tongue-wink",
      items: [
        "给一年后自己的一封信",
        "给四年后自己的一封信",
        "给现在迷茫的自己",
      ],
    },
  ],
});
