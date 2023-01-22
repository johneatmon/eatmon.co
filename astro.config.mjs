import { defineConfig } from "astro/config"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"

import { remarkReadingTime } from "./remark-reading-time.mjs"
import { remarkWidont } from "./remark-widont.mjs"

// https://astro.build/config
export default defineConfig({
	integrations: [image(), mdx(), react(), tailwind()],
	markdown: {
		remarkPlugins: [remarkWidont, remarkReadingTime],
		extendDefaultPlugins: true,
	},
	site: "https://eatmon.co",
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
	output: "server",
	adapter: vercel(),
})
