import { defineClientConfig } from "vuepress/client";
import NpmBadge from "vuepress-theme-plume/features/NpmBadge.vue";
import NpmBadgeGroup from "vuepress-theme-plume/features/NpmBadgeGroup.vue";
import RepoCard from "vuepress-theme-plume/features/RepoCard.vue";

import ColourPicker from "./_source/components/ColourPicker.vue";
import { h } from "vue";
import { Layout } from "vuepress-theme-plume/client";
// phy_theme
// import "./_source/css/phy_theme/index.css";
// import "./_source/css/phy_theme/background-image.css";

// pzb_theme
import "./_source/css/pzb_theme/index.css";

export default defineClientConfig({
  enhance({ app }) {
    app.component("RepoCard", RepoCard);
    app.component("NpmBadge", NpmBadge);
    app.component("NpmBadgeGroup", NpmBadgeGroup);
    app.component("ColourPicker", ColourPicker);
  },

  // inject custom layout components
  layouts: {
    Layout: () =>
      h(Layout, null, {
        "nav-bar-content-after": () => h(ColourPicker),
      }),
  },
});
