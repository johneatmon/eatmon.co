import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const title = searchParams.get('title');
	const font = fetch(
		new URL(
			'../../node_modules/@johneatmon/gestura-text/files/woff/Gestura-Text-Light.woff',
			import.meta.url
		)
	).then((res) => res.arrayBuffer());
	const fontData = await font;

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					backgroundImage: 'url(/open-graph-background.png)',
					// backgroundImage: 'linear-gradient(to right, #000, #111)',
				}}
			>
				<div
					style={{
						marginBlockStart: 100,
						marginInline: 100,
						display: 'flex',
						fontSize: 64,
						fontFamily: 'Gestura Text',
						fontWeight: 350,
						letterSpacing: '-0.05em',
						fontStyle: 'normal',
						color: 'white',
						lineHeight: '1.2em',
						whiteSpace: 'pre-wrap',
					}}
				>
					{title}
				</div>
			</div>
		),
		{
			width: 1200,
			height: 627,
			fonts: [
				{
					name: 'Gestura Text',
					data: fontData,
					style: 'normal',
				},
			],
		}
	);
}
