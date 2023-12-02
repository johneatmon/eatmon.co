import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import Footer from '~/components/footer';
import { ThemeProvider } from '~/lib/providers/theme-provider';
import { cn } from '~/lib/utils';
import '~/styles/globals.css';

export const metadata: Metadata = {
	metadataBase: new URL('https://eatmon.co'),
	title: {
		default: 'John Eatmon, Software Engineer · Seattle WA',
		template: '%s · John Eatmon',
	},
	description: "It's a-me! John Eatmon!",
	openGraph: {
		title: 'John Eatmon, Software Engineer · Seattle WA',
		description: "It's a-me! John Eatmon!",
		url: 'https://eatmon.co',
		siteName: 'John Eatmon',
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		title: 'John Eatmon, Software Engineer · Seattle WA',
		card: 'summary_large_image',
	},
	other: {
		'color-scheme': 'dark light',
	},
	robots: {
		index: Boolean(process.env.NODE_ENV === 'production'),
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: [
		{
			rel: 'icon',
			type: 'image/png',
			url: '/favicon.png',
		},
		{
			rel: 'apple-touch-icon',
			type: 'image/png',
			url: '/apple-touch-icon.png',
		},
	],
};

const RootLayout: FC<{ readonly children: ReactNode }> = ({ children }) => (
	<html
		lang='en'
		className={cn(
			GeistSans.variable,
			GeistMono.variable,
			'touch-manipulation font-serif antialiased'
		)}
	>
		<body className='min-h-screen bg-gray-50 text-gray-950 dark:bg-black dark:text-gray-400'>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				{children}
				<Footer />
			</ThemeProvider>
			<Analytics />
			<div
				aria-hidden='true'
				className='pointer-events-none fixed inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-b from-transparent to-black'
			/>
		</body>
	</html>
);

export default RootLayout;
