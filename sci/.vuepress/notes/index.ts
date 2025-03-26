import { defineNotesConfig } from "vuepress-theme-plume";
import mood from "./mood.js";
import English from "./English.js";
import self from "./self.js";
import economic from "./economic.js";
import floorMarket from "./floorMarket.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [mood, English, self, economic, floorMarket],
});
