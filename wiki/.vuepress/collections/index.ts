import { defineCollections } from "vuepress-theme-plume";
import self from "./self.js";
import java from "./java.js";
import vue from "./vue.js";
import algo from "./algo.js";
import nginx from "./nginx.js";
import dp from "./dp.js";
import interview from "./interview.js";
import docker from "./docker.js";

export default defineCollections([
  { type: "post", title: "博客", dir: "blog", linkPrefix: "/article/" },
  self,
  java,
  vue,
  algo,
  nginx,
  dp,
  interview,
  docker,
]);
