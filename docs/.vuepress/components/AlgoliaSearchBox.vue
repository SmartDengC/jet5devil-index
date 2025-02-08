<template>
  <div class="algolia-search-wrapper">
    <div id="docsearch"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import docsearch from "@docsearch/js";
import "@docsearch/css";

onMounted(() => {
  docsearch({
    appId: "OLVPQ4G0YH",
    apiKey: "f21c616b8d5b875eb1b72a0b48080829",
    indexName: "dengcong",
    container: "#docsearch",
    debug: false,
  });
});
</script>

<style>
.algolia-search-wrapper {
  display: inline-block;
}
</style>
