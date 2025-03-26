import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  link: "/jmcc/",
  dir: "健牧训练营",
  sidebar: [
    {
      text: "训练课表",
      icon: "mdi:language-typescript",
      items: ["241223-【健牧训练营】夏训课表", "241223-【健牧训练营】冬训课表"],
    },
    {
      text: "LSD",
      icon: "mdi:language-typescript",
      items: [
        "健牧跑步俱乐部W3-周天LSD【成都站】",
        "健牧跑步俱乐部W4-周四混养跑【成都站】",
        "健牧跑步俱乐部W7-周天LSD【成都站】",
        "健牧跑步俱乐部W13-混氧跑【成都站】",
      ],
    },
    {
      text: "马拉松训练",
      icon: "mdi:language-typescript",
      items: [
        "马拉松训练课-法特莱克跑",
        "马拉松训练课-亚索800",
        "马拉松训练课-跑姿优化",
      ],
    },
    {
      text: "马拉松日志",
      icon: "mdi:language-typescript",
      items: ["马拉松日志（2024年）", "马拉松日志（2025年）"],
    },
  ],
});
