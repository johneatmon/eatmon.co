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
		drafts: !import.meta.env.PROD,
		remarkPlugins: [remarkWidont, remarkReadingTime],
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
		includeFiles: ["./public/fonts/soehne/otf/soehne-400.otf"],
	}),
})
