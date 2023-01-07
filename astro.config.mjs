import { defineConfig } from "astro/config"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
	integrations: [
		mdx(),
		react(),
		tailwind(),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
	],
	site: "https://eatmon.co",
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
})
