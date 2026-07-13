import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "economic",
  linkPrefix: "/economic/",
  sidebar: [
    {
      text: "Review",
      collapsed: false,
      items: [
        {
          text: "2026年复盘",
          collapsed: true,
          items: [
            "Review/2026 年/第一季度",
            "Review/2026 年/第二季度",
            "Review/2026 年/第三季度",
          ],
        },
        "Review/2025 年/2025年",
        "Review/2024 年/2024年",
      ],
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
        "技术分析/Binance 交易",
        "技术分析/Trading View 指标学习",
        "技术分析/股票技术分析入门到精通20讲",
        "技术分析/如何看板块估值，高估还是低估？",
        {
          text: "Price Action",
          icon: "",
          collapsed: true,
          items: [
            "技术分析/PriceAction/踏上交易之路",
            "技术分析/PriceAction/早盘交易策略",
            "技术分析/PriceAction/信号 k",
            "技术分析/PriceAction/止盈",
            "技术分析/PriceAction/突破",
            "技术分析/PriceAction/边做边讲",
            "技术分析/PriceAction/反转形态",
            "技术分析/PriceAction/观众答疑记录",
          ],
        },
        {
          text: "ICT",
          icon: "",
          collapsed: true,
          items: [
            "技术分析/ICT/FVG",
            "技术分析/ICT/MMXM",
            "技术分析/ICT/SMT",
            "技术分析/ICT/OB",
          ],
        },
      ],
    },
  ],
});
