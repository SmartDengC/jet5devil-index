import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "Linux",
  link: "/linux/",
  sidebar: [
    {
      text: "", // 第一层如果为空，自动折叠需要设置为false
      icon: "solar:tag-bold",
      collapsed: false,
      items: [
        {
          text: "个人总结", // 第二层text不能为空
          icon: "solar:tag-bold",
          collapsed: false,
          items: [
            "Linux命令：find等",
            "Linux命令：grep、awk、sed等",
            "Linux命令：iptables、firewalld等",
            "Linux命令：wc、head、sort等.md",
            "Linux命令：wget、curl等",
            "Linux命令：zip、tar等",
          ],
        },
      ],
    },
  ],
});
