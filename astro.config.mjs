import { defineConfig } from "astro/config"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import netlify from "@astrojs/netlify/edge-functions"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
	integrations: [
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
		mdx(),
		react(),
		tailwind(),
	],
	adapter: netlify(),
	output: "sever",
	site: "https://eatmon.co",
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
})
