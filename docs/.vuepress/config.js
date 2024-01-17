import { defaultTheme } from "vuepress";

export default {
  title: "阿聪的小破站",
  head: [
    ["link", { rel: "icon", href: "/assets/img/logo.png" }],
    ["meta", { name: "author", content: "SmartDengC" }],
  ],
  theme: defaultTheme({
    logo: "/assets/img/hero.png",
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          collapsible: true,
          children: [
            "/guide/README.md",
            "/guide/2024-01-16-GIT经历0.md",
            "/guide/StompJS监听RabbitMq.md",
          ],
        },
      ],
    },
    navbar: [
      { text: "首页", link: "/" },
      { text: "ABOUT", link: "/about" },
      { text: "GUIDE", link: "/guide" },
    ],
  }),
};
