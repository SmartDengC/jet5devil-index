import { defineClientConfig } from "vuepress/client";
import NpmBadge from "vuepress-theme-plume/features/NpmBadge.vue";
import NpmBadgeGroup from "vuepress-theme-plume/features/NpmBadgeGroup.vue";
import RepoCard from "vuepress-theme-plume/features/RepoCard.vue";
import Landing from "./wiki/.vuepress/theme/components/Landing.vue";
import { useStatistics } from "./wiki/.vuepress/theme/composables/statistics";

import "./wiki/.vuepress/theme/styles/index.css";
import ColourPicker from "./_source/components/ColourPicker.vue";
import { h } from "vue";
import { Layout } from "vuepress-theme-plume/client";

export default defineClientConfig({
  enhance({ app }) {
    app.component("RepoCard", RepoCard);
    app.component("NpmBadge", NpmBadge);
    app.component("NpmBadgeGroup", NpmBadgeGroup);
    app.component("Landing", Landing);
    app.component("ColourPicker", ColourPicker);
  },
  setup() {
    useStatistics();
  },

  // inject custom layout components
  layouts: {
    Layout: () =>
      h(Layout, null, {
        "nav-bar-content-after": () => h(ColourPicker),
      }),
  },
});
