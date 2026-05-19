import { defineCollections } from "vuepress-theme-plume";
import mood from "./mood.js";
import English from "./English.js";
import economic from "./economic.js";
import floorMarket from "./floorMarket.js";
import books from "./books.js";

export default defineCollections([
  { type: "post", title: "博客", dir: "blog", linkPrefix: "/article/" },
  mood,
  English,
  economic,
  floorMarket,
  books,
]);
