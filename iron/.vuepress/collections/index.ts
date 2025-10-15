import { defineCollections } from "vuepress-theme-plume";
import jmcc from "./jmcc.js";
import book from "./book.js";

export default defineCollections([
  { type: "post", title: "博客", dir: "blog", linkPrefix: "/article/" },
  jmcc,
  book,
]);
