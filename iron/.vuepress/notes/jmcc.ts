import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  link: "/jmcc/",
  dir: "健牧训练营",
  sidebar: [
    {
      text: "马拉松",
      // icon: "mdi:language-typescript",
      collapsed: false,
      items: [
        {
          text: "赛年",
          collapsed: false,
          items: ["赛年/马拉松日志【2024年】", "赛年/马拉松日志【2025年】"],
        },
        {
          text: "训练课表",
          collapsed: false,
          items: [
            "课表/【健牧训练营】2024夏训课表",
            "课表/【健牧训练营】2025冬训课表",
            "课表/【健牧训练营】2025夏训课表",
          ],
        },
        {
          text: "碎碎念",
          collapsed: false,
          items: [
            "碎碎念/健牧跑步俱乐部W3-周天LSD【成都站】",
            "碎碎念/健牧跑步俱乐部W4-周四混养跑【成都站】",
            "碎碎念/健牧跑步俱乐部W7-周天LSD【成都站】",
            "碎碎念/健牧跑步俱乐部W13-混氧跑【成都站】",
            "碎碎念/2025夏训：健牧-W1-周六LSD【成都站】",
          ],
        },
        {
          text: "马拉松科普",
          collapsed: false,
          items: [
            "科普/马拉松训练课-法特莱克跑",
            "科普/马拉松训练课-亚索800",
            "科普/马拉松训练课-跑姿优化",
            "科普/马拉松训练课-5公里破20分钟",
            "科普/马拉松训练课-10公里破40分钟",
          ],
        },
      ],
    },
  ],
});
