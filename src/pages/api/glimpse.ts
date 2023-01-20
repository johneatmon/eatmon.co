import glimpse from "@beskar-labs/glimpse/server"
import type { APIRoute } from "astro"

const headers = {
	"content-type": "application/json",
}

export const post: APIRoute = async ({ request }): Promise<Response> => {
	const { url } = (await request.json()) as { url?: string }

	if (!url) {
		return new Response(JSON.stringify({}), { status: 400, headers })
	}

	try {
		const data = await glimpse(url)
		return new Response(JSON.stringify(data), { status: 200, headers })
	} catch {
		return new Response(JSON.stringify({}), { status: 500, headers })
	}
}
