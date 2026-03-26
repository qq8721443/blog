// @ts-check

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Pretendard",
      cssVariable: "--font-pretendard",
      options: {
        variants: [
          {
            weight: "100 900",
            src: ["./src/assets/fonts/PretendardVariable.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.googleicons(),
      name: "Material Icons",
      cssVariable: "--font-material-icons",
    },
  ],
});
