import { defineNotesConfig } from "vuepress-theme-plume";
import self from "./self.js";
import java from "./java.js";
import vue from "./vue.js";
import algo from "./algo.js";

export default defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [self, java, vue, algo],
});
