import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./wiki/.vuepress/theme";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);
const resolve = (...dirs: string[]) => path.resolve(__dirname, ...dirs);

const isProd = process.env.NODE_ENV === "production";

export default defineUserConfig({
  // public: resolve("public"),
  // temp: resolve(".vuepress/.temp"),
  // cache: resolve(".vuepress/.cache"),

  bundler: viteBundler(),
  title: "阿聪的小破站",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-32x32.png",
      },
    ],
    ["meta", { name: "author", content: "SmartDengC" }],
    ["meta", { name: "referrer", content: "no-referrer" }], // 处理md文件中不展示gitee图片
    ["meta", { name: "keywords", content: "邓聪,后端,hahadeng,back-end" }],
    ["meta", { "http-equiv": "X-UA-Compatible", content: "IE=edg" }],
    ["meta", { name: "msapplication-TileColor", content: "#da532c" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
  ],
  theme,
});
