import localFont from 'next/font/local';

const CommitMono = localFont({
	preload: true,
	weight: '200 700',
	display: 'swap',
	variable: '--font-commit-mono',
	src: [
		{ path: '../public/Commit-Mono-Variable.woff2', style: 'normal' },
		{ path: '../public/Commit-Mono-Variable.woff2', style: 'italic' },
	],
});

const UncutSans = localFont({
	preload: true,
	weight: '300 700',
	display: 'swap',
	variable: '--font-uncut-sans',
	src: [
		{ path: '../public/Uncut-Sans-Variable.woff2', style: 'normal' },
		{ path: '../public/Uncut-Sans-Variable.woff2', style: 'italic' },
	],
});

export { CommitMono, UncutSans };
