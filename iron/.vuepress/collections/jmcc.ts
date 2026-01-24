import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "健牧训练营",
  linkPrefix: "/jmcc/",
  dir: "/健牧训练营/",
  sidebar: [
    {
      text: "马拉松",
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
                "训练营/2024年冬训/健牧跑步俱乐部W3-周天LSD【成都站】",
                "训练营/2024年冬训/健牧跑步俱乐部W4-周四混养跑【成都站】",
                "训练营/2024年冬训/健牧跑步俱乐部W7-周天LSD【成都站】",
                "训练营/2024年冬训/健牧跑步俱乐部W13-混氧跑【成都站】",
              ],
            },

            {
              text: "2025夏训",
              collapsed: true,
              items: [
                "训练营/2025年夏训/健牧-W1-周六LSD【成都站】",
                "训练营/2025年夏训/健牧-W3-周天10测试赛",
                "训练营/2025年夏训/健牧-W16-周天LSD【成都站】",
              ],
            },
            {
              text: "2025索康尼训练营",
              collapsed: true,
              items: ["训练营/2025索康尼训练营/索康尼成马训练营"],
            },
            {
              text: "2026冬训",
              collapsed: true,
              items: ["训练营/2026年冬训/W4-周天LSD"],
            },
          ],
        },
        {
          text: "马拉松科普",
          collapsed: false,
          items: [
            "科普/了解训练方式，法特莱克、亚索800",
            "科普/马拉松破速训练，5k-10k-21k训练",
            "科普/了解训练方式，丹尼尔斯训练法",
          ],
        },
        {
          text: "马拉松咨询",
          collapsed: false,
          items: [
            "碎碎念/马拉松没中签，疯狂找赞助商的日子",
            "碎碎念/马拉松日常信息咨询",
            "碎碎念/马拉松破三，对自己来说难吗？",
          ],
        },
      ],
    },
  ],
});
