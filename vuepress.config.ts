import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { plumeTheme } from "vuepress-theme-plume";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          // 明确指定vue-router的解析路径
          "vue-router": path.resolve(
            __dirname,
            "node_modules/vue-router/dist/vue-router.esm-bundler.js"
          ),
        },
      },
    },
  }),
  theme: plumeTheme({}),
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
});
