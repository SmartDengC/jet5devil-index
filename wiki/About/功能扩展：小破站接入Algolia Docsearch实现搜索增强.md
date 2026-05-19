---
title: 网站集成Algolia Docsearch增强文章搜索
createTime: 2025/02/08 14:51:53
permalink: /self/tu71l3ld/
tags:
  - algolia
---

本文聚焦于 Algolia 的 Docsearch 功能，深入分析其背后的核心算法和实现细节。通过系统性地探讨该模块的功能设计与优化策略，本文旨在为读者提供清晰的技术见解，帮助理解文档搜索系统的高效性和实用性。

<!-- more -->

[Algolia Docsearch](https://docsearch.algolia.com/)

[Algolia Crawler](https://crawler.algolia.com/)



为什么会用Algolia Docsearch？是因为我发现我的网站里面有很多文档，里面有写完了的，有没写完的，都混在一起了。

在根据思路找某一篇文档时，老是无法精准的找到，所以用上搜索工具。

## 一、如何集成Algolia Docsearch？

### 1.1、获取搜索索引

你需要 [提交你的网站 URL](https://docsearch.algolia.com/apply/) 来加入 DocSearch 项目。 当你的索引成功创建后， DocSearch 团队会将 `apiKey` 和 `indexName` 发送到你的邮箱。接下来，你就可以配置该插件，在 VuePress 中启用 DocSearch 

原理就是algolia团队的服务器会定时按照你配置的内容爬取你网站的内容，在搜索的时候返回对应的搜索结果。



### 1.2、配置爬虫信息

[Crawler: InitialIndexSettings](https://www.algolia.com/doc/tools/crawler/apis/configuration/initial-index-settings/#examples)

```
new Crawler({
  rateLimit: 8,
  startUrls: ["https://wiki.dengcong.org/"],
  renderJavaScript: false,
  sitemaps: ["https://wiki.dengcong.org/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://wiki.dengcong.org/**"],
  schedule: "at 02:00 every 1 day",
  actions: [
    {
      indexName: "dengcong",
      pathsToMatch: ["https://wiki.dengcong.org/**"],
      recordExtractor: ({ helpers }) => {
        return helpers.docsearch({
          recordProps: {
            lvl1: ".plume-content h1",
            content: ".plume-content p, .plume-content li",
            lvl0: {
              selectors: [
                ".sidebar-item.is-active p",
                ".content-container .page-title",
              ],
              defaultValue: "Documentation",
            },
            lvl2: ".plume-content h2",
            lvl3: ".plume-content h3",
            lvl4: ".plume-content h4",
            lvl5: ".plume-content h5",
            lang: "",
            tags: {
              defaultValue: ["v2"],
            },
          },
          aggregateContent: true,
          recordVersion: "v3",
        });
      },
    },
  ],
  initialIndexSettings: {
    dengcong: {
      attributesForFaceting: ["type", "lang", "language", "version"],
      attributesToRetrieve: [
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "hierarchy_camel", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "hierarchy_radio", "content"],
      searchableAttributes: [
        "unordered(hierarchy_radio_camel.lvl0)",
        "unordered(hierarchy_radio.lvl0)",
        "unordered(hierarchy_radio_camel.lvl1)",
        "unordered(hierarchy_radio.lvl1)",
        "unordered(hierarchy_radio_camel.lvl2)",
        "unordered(hierarchy_radio.lvl2)",
        "unordered(hierarchy_radio_camel.lvl3)",
        "unordered(hierarchy_radio.lvl3)",
        "unordered(hierarchy_radio_camel.lvl4)",
        "unordered(hierarchy_radio.lvl4)",
        "unordered(hierarchy_radio_camel.lvl5)",
        "unordered(hierarchy_radio.lvl5)",
        "unordered(hierarchy_radio_camel.lvl6)",
        "unordered(hierarchy_radio.lvl6)",
        "unordered(hierarchy_camel.lvl0)",
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy_camel.lvl1)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy_camel.lvl2)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy_camel.lvl3)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy_camel.lvl4)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy_camel.lvl5)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy_camel.lvl6)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
    },
  },
  appId: "OLVPQxxxx",
  apiKey: "42e418a35c27xxxx669910b7f2bee30",
});
```



### 1.2、在vuepress项目中配置doc search

[vuepress生态系统](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html)

```typescript
import plumeTheme from "vuepress-theme-plume";

export default plumeTheme({
	// ...

  plugins: {
    // 先使用默认的搜索
    docsearch: {
      appId: "OLVPQ4G0YH",
      apiKey: "f21c616b8d5b875eb1b72a0b48080829",
      indexName: "dengcong",
    },
  },
  
	// ...
});
```

