import localFont from 'next/font/local';

const Gestura = localFont({
	preload: true,
	display: 'swap',
	variable: '--font-gestura-text',
	src: [
		{
			path: '../node_modules/@johneatmon/gestura-text/files/woff2/Gestura-Text-Roman-VF.woff2',
			style: 'normal',
		},
		{
			path: '../node_modules/@johneatmon/gestura-text/files/woff2/Gestura-Text-Italic-VF.woff2',
			style: 'italic',
		},
	],
});

export default Gestura;
