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

	const background = () => {
		if (process.env.NODE_ENV === 'production') {
			return `url(${process.env.NEXT_PUBLIC_VERCEL_URL}/open-graph-background.png)`;
		} else {
			return 'linear-gradient(to right, #000, #111)';
		}
	};

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					color: 'white',
					height: '100%',
					width: '100%',
					padding: 100,
					backgroundImage: background(),
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
