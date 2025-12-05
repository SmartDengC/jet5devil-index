import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "economic",
  linkPrefix: "/economic/",
  sidebar: [
    {
      text: "复盘",
      icon: "",
      items: ["复盘/2024年", "复盘/2025年"],
    },
    {
      text: "信息差",
      icon: "",
      items: [
        "信息差/利弗莫尔交易",
        "信息差/金融常见概念",
        "信息差/量化交易",
        "信息差/小学生也能看懂的技术指标",
      ],
    },
    {
      text: "技术分析",
      icon: "",
      items: [
        "技术分析/股票技术分析入门到精通20讲",
        "技术分析/技术分析指标详解，均线、布林线、MACD等",
        "技术分析/如何看板块估值，高估还是低估？",
      ],
    },
  ],
});
