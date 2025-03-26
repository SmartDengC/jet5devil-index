import { defineNotesConfig } from "vuepress-theme-plume";
// 通过定义左侧侧边栏，导入使用
import jmcc from "./jmcc.js";
import book from "./book.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [jmcc, book],
});
