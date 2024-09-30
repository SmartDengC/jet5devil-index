import { defineNotesConfig } from "vuepress-theme-plume";
import self from "./self.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [self],
});
