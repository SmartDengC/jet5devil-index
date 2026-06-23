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
      items: ["复盘/2026年", "复盘/2025年", "复盘/2024年"],
    },
    {
      text: "信息差",
      icon: "",
      items: [
        "信息差/Better New 高见",
        "信息差/市场交易规则",
        "信息差/金融常见概念",
        "信息差/量化交易",
      ],
    },
    {
      text: "技术分析",
      icon: "",
      items: [
        "技术分析/Trading View 指标学习",
        "技术分析/行为交易学，踏上交易之路",
        "技术分析/股票技术分析入门到精通20讲",
        "技术分析/如何看板块估值，高估还是低估？",
      ],
    },
  ],
});
