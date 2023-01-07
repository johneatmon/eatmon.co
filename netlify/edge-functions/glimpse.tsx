// import glimpse from '@haydenbleasel/glimpse/server';
import glimpse from "https://unpkg.com/@haydenbleasel/glimpse@2.0.2/dist/server.js"
import { Context } from "netlify:edge"
// import parseError from '../../utils/parseError';

const headers = {
	"content-type": "application/json",
}

// export const config = {
// 	runtime: "experimental-edge",
// }

const handler = async (request: Request, context: Context): Promise<Response> => {
	console.log(context)

	const { url } = (await context.json()) as { url?: string }

	if (!url) {
		return new Response(JSON.stringify({}), { status: 400, headers })
	}

	try {
		const data = await glimpse(url)
		console.log(data)

		return new Response(JSON.stringify(data), { status: 200, headers })
	} catch {
		return new Response(JSON.stringify({}), { status: 500, headers })
	}
}

export default handler
