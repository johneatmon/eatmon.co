import { defineConfig } from "astro/config"
import { FontaineTransform } from "fontaine"

import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import autoImport from "astro-auto-import"
import compress from "astro-compress"
import robots from "astro-robots-txt"

import { remarkReadingTime } from "./remark-plugins/remark-reading-time.mjs"
import { remarkWidont } from "./remark-plugins/remark-widont.mjs"

// https://astro.build/config
export default defineConfig({
	integrations: [
		autoImport({
			imports: [
				{
					"./src/lib/smartypants.ts": ["smarty"],
				},
			],
		}),
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
		drafts: true,
		remarkPlugins: [remarkWidont, remarkReadingTime],
		shikiConfig: {
			theme: "poimandres",
		},
	},
	site: "https://eatmon.co/",
	vite: {
		plugins: [
			FontaineTransform.vite({
				fallbacks: ["Arial"],
				resolvePath: (id) => new URL(`./public${id}`, import.meta.url),
			}),
		],
		ssr: {
			noExternal: [/^@radix-ui\/*/, "react-wrap-balancer", "smartypants"],
		},
	},
	output: "server",
	adapter: vercel({
		includeFiles: ["./public/fonts/soehne/otf/soehne-400.otf"],
	}),
})
