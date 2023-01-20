import { defineConfig } from "astro/config"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"

import { remarkWidont } from "./remark-widont.mjs"

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), react(), tailwind(), image()],
	markdown: {
		remarkPlugins: [remarkWidont],
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
