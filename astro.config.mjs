import { defineConfig } from "astro/config"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import compress from "astro-compress"
import robots from "astro-robots-txt"

import { remarkReadingTime } from "./remark-plugins/remark-reading-time.mjs"
import { remarkWidont } from "./remark-plugins/remark-widont.mjs"

// https://astro.build/config
export default defineConfig({
	integrations: [
		compress({
			html: false,
			img: false,
			svg: false,
		}),
		image({
			serviceEntryPoint: "@astrojs/image/sharp",
		}),
		mdx(),
		react(),
		robots({
			policy: [
				{
					userAgent: "*",
					allow: "/",
					disallow: ["/api", "/api/glimpse"],
				},
			],
			sitemap: false,
		}),
		tailwind({
			config: { applyBaseStyles: false },
		}),
	],
	markdown: {
		remarkPlugins: [remarkWidont, remarkReadingTime],
		drafts: true,
	},
	site: "https://eatmon.co/",
	vite: {
		ssr: {
			noExternal: [/^@radix-ui\/*/, "smartypants"],
		},
	},
	output: "server",
	adapter: vercel(),
})
