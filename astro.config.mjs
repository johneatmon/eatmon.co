import { defineConfig } from "astro/config"
import path from "path"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import compress from "astro-compress"
import robots from "astro-robots-txt"

import { remarkDeruntify } from "./remark-plugins/remark-deruntify.mjs"
import { remarkReadingTime } from "./remark-plugins/remark-reading-time.mjs"

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
			sitemap: ["https://eatmon.co/sitemap-index.xml", "https://eatmon.co/sitemap-0.xml"],
		}),
		sitemap({
			filter: (page) =>
				page !== "https://eatmon.co/api" && page !== "https://eatmon.co/api/glimpse",
		}),
		tailwind({
			config: { applyBaseStyles: false },
		}),
	],
	markdown: {
		drafts: true,
		remarkPlugins: [remarkDeruntify, remarkReadingTime],
		shikiConfig: {
			theme: "poimandres",
		},
	},
	site: "https://eatmon.co/",
	vite: {
		ssr: {
			noExternal: [/^@radix-ui\/*/, "react-wrap-balancer", "smartypants"],
		},
	},
	output: "server",
	adapter: vercel({
		includeFiles: [
			path.join(process.cwd(), "node_modules/@johneatmon/soehne/files/otf/Söhne-Buch.otf"),
			path.join(
				process.cwd(),
				"node_modules/@johneatmon/soehne/files/otf/Söhne-Dreiviertelfett.otf",
			),
		],
	}),
})
