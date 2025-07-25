import { defineNotesConfig } from "vuepress-theme-plume";
import mood from "./mood.js";
import English from "./English.js";
import economic from "./economic.js";
import floorMarket from "./floorMarket.js";
import books from "./books.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [mood, English, economic, floorMarket, books],
});
