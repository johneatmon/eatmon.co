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
		drafts: true,
	},
	site: "https://eatmon.co/",
	vite: {
		ssr: {
			noExternal: [
				"@radix-ui/react-compose-refs",
				"@radix-ui/react-portal",
				"@radix-ui/react-primitive",
				"@radix-ui/react-slot",
				"@radix-ui/react-toast",
				"smartypants",
			],
		},
	},
	output: "server",
	adapter: vercel(),
})
