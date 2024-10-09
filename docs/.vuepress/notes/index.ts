import { defineNotesConfig } from "vuepress-theme-plume";
import self from "./self.js";
import java from "./java.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [self, java],
});
