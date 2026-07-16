import { defineCollection } from "vuepress-theme-plume";

export default defineCollection({
  type: "doc",
  title: "",
  dir: "economic",
  linkPrefix: "/economic/",
  sidebar: [
    {
      text: "Daily Review",
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
      text: "Information Gap",
      icon: "",
      items: ["Gap/Better New 高见", "Gap/市场交易规则", "Gap/金融常见概念"],
    },
    {
      text: "Technical Analysis",
      icon: "",
      items: [
        "TA/Binance",
        "TA/TV 指标",
        "TA/技术分析入门",
        "TA/板块估值",
        {
          text: "Price Action",
          icon: "",
          collapsed: true,
          items: [
            "TA/PriceAction/踏上交易之路",
            "TA/PriceAction/早盘交易策略",
            "TA/PriceAction/信号 k",
            "TA/PriceAction/止损&止盈",
            "TA/PriceAction/突破",
            "TA/PriceAction/边做边讲",
            "TA/PriceAction/反转形态",
            "TA/PriceAction/观众答疑记录",
          ],
        },
        {
          text: "ICT",
          icon: "",
          collapsed: true,
          items: ["TA/ICT/FVG", "TA/ICT/MMXM", "TA/ICT/SMT", "TA/ICT/OB"],
        },
        {
          text: "Quant",
          icon: "",
          collapsed: true,
          items: ["TA/Quant/Basic", "TA/Quant/Whale Quant"],
        },
      ],
    },
  ],
});
