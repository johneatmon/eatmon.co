import glimpse from "@beskar-labs/glimpse/server"
import type { APIRoute } from "astro"

const headers = {
	"content-type": "application/json",
}

export const post: APIRoute = async ({ request }): Promise<Response> => {
	if (request.headers.get("Content-Type") === "application/json") {
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
	return new Response(null, { status: 400 })
}
