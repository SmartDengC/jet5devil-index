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
          items: [
            "赛年/马拉松日志【2024年】",
            "赛年/马拉松日志【2025年】",
            "赛年/马拉松日志【2026年】",
          ],
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
            {
              text: "2024冬训",
              collapsed: true,
              items: [
                "碎碎念/2024年冬训/健牧跑步俱乐部W3-周天LSD【成都站】",
                "碎碎念/2024年冬训/健牧跑步俱乐部W4-周四混养跑【成都站】",
                "碎碎念/2024年冬训/健牧跑步俱乐部W7-周天LSD【成都站】",
                "碎碎念/2024年冬训/健牧跑步俱乐部W13-混氧跑【成都站】",
              ],
            },

            {
              text: "2025夏训",
              collapsed: true,
              items: [
                "碎碎念/2025年夏训/健牧-W1-周六LSD【成都站】",
                "碎碎念/2025年夏训/健牧-W3-周天10测试赛",
                "碎碎念/2025年夏训/健牧-W16-周天LSD【成都站】",
              ],
            },
            {
              text: "2025索康尼训练营(成都站)",
              collapsed: true,
              items: ["碎碎念/2025索康尼训练营/索康尼开营仪式"],
            },
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
        {
          text: "马拉松咨询",
          collapsed: false,
          items: ["马拉松没中签，疯狂找赞助商的日子", "马拉松日常信息咨询"],
        },
      ],
    },
  ],
});
