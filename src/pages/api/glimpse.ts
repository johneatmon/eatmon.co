import type { PreviewResponse } from "@beskar-labs/glimpse/server"
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

	const data: PreviewResponse = await glimpse(url)

	if (!data) {
		return new Response(JSON.stringify({}), { status: 500, headers })
	} else {
		return new Response(JSON.stringify(data), { status: 200, headers })
	}
}
