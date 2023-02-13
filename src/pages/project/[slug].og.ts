import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { readFileSync } from "fs"
import satori from "satori"
import { html } from "satori-html"
import sharp from "sharp"

// https://rumaan.dev/blog/open-graph-images-using-satori

export const get: APIRoute = async ({ params }) => {
	const { slug } = params

	const projects = await getCollection("project")
	const postTitle =
		(await projects.filter((x) => x.slug === slug).map((post) => post.data.title)[0]) ??
		"John Eatmon Projects"

	const fontFilePath = `${process.cwd()}/public/fonts/soehne/otf/soehne-400.otf`
	const fontFile = readFileSync(fontFilePath)

	const markup = html(
		`<div
			style="height: 100%; width: 100%; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #050505;"
		>
			<div style="font-size: 32px; display: flex; color: #a1a1aa;">
				John Eatmon · Projects
			</div>
			<p style="font-size: 64px; display: flex; color: #fafafa;">
				${postTitle}
			</p>
		</div>`,
	)
	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Söhne",
				data: fontFile,
				style: "normal",
				weight: 400,
			},
		],
	})

	const png = sharp(Buffer.from(svg)).png()
	const response = await png.toBuffer()

	return new Response(response, {
		status: 200,
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "s-maxage=1, stale-while-revalidate=59",
		},
	})
}
