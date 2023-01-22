import type { APIRoute } from "astro"
import { parse } from "node-html-parser"

const headers = {
	"content-type": "application/json",
}

type PreviewResponse = {
	url: string
	title: string | null
	description: string | null
	image: string | null
}

const glimpse = async (url: string): Promise<PreviewResponse> => {
	const response = await fetch(url)
	const data = await response.text()
	const dom = parse(data)

	const title = dom.querySelector("title")?.text ?? dom.querySelector("og:title")?.text ?? null
	const description =
		dom.querySelector('meta[name="description"]')?.attributes.content ??
		dom.querySelector('meta[name="og:description"]')?.attributes.content ??
		null
	const image = dom.querySelector('meta[property="og:image"]')?.attributes.content ?? null

	return {
		url,
		title,
		description,
		image,
	}
}

export const post: APIRoute = async ({ request }): Promise<Response> => {
	const { url } = (await request.json()) as { url?: string }

	if (!url) {
		return new Response(JSON.stringify({}), { status: 400, headers })
	}

	try {
		const data = await glimpse(url)

		return new Response(JSON.stringify(data), { status: 200, headers })
	} catch (err) {
		return new Response(JSON.stringify(err), { status: 500, headers })
	}
}
