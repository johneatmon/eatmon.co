import { defineConfig } from "astro/config"

import mdx from "@astrojs/mdx"
import netlify from "@astrojs/netlify/edge-functions"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), react(), tailwind()],
	adapter: netlify(),
	output: "server",
	site: "https://eatmon.co",
})
