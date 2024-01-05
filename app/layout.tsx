import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { Person } from 'schema-dts';
import ContactFormDialog from '~/components/contact-form-dialog';
import Footer from '~/components/footer';
import { CommitMono, UncutSans } from '~/lib/fonts';
import { ThemeProvider } from '~/lib/providers/theme-provider';
import { cn, toJsonLd } from '~/lib/utils';
import '~/styles/globals.css';

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL ?? '/'),
	title: {
		default: 'John Eatmon, Software Engineer · Seattle WA',
		template: '%s · John Eatmon',
	},
	description: 'Seattle-based software engineer, mountain climber, and typography enthusiast.',
	openGraph: {
		title: 'John Eatmon, Software Engineer · Seattle WA',
		description: 'Seattle-based software engineer, mountain climber, and typography enthusiast.',
		url: new URL(process.env.NEXT_PUBLIC_VERCEL_URL ?? '/'),
		siteName: 'John Eatmon',
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		title: 'John Eatmon, Software Engineer · Seattle WA',
		card: 'summary',
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

const profileJsonLd = toJsonLd<Person>({
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'John Eatmon',
	jobTitle: 'Software Engineer',
	url: metadata.metadataBase?.href,
	sameAs: [
		'https://github.com/johneatmon',
		'https://www.linkedin.com/in/johneatmon/',
		'https://read.cv/johneatmon',
		'https://twitter.com/johneatmon_',
	],
	image:
		'https://eatmon.co/cdn-cgi/imagedelivery/le40TwFDWUdIvXckEp8FBw/ebab5e6e-2096-4954-3a37-b83bbea1b300/square',
	birthPlace: {
		'@type': 'Place',
		name: 'Orlando, Florida',
	},
	alumniOf: 'University of Central Florida',
	worksFor: {
		'@type': 'Organization',
		name: 'UnitedHealthcare',
		url: 'https://www.uhc.com/',
	},
	knowsLanguage: ['English', 'French'],
});

const RootLayout: FC<{ readonly children: ReactNode }> = ({ children }) => (
	<html
		lang='en'
		suppressHydrationWarning
		className={cn(
			'min-h-screen touch-manipulation antialiased',
			UncutSans.variable,
			CommitMono.variable
		)}
	>
		<body className='min-h-screen bg-[#eee] font-sans font-sans text-gray-700 dark:bg-black dark:text-gray-400'>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				{children}
				<Footer />
			</ThemeProvider>
			<div
				aria-hidden='true'
				className='pointer-events-none fixed inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-b from-transparent to-[#eee] dark:bg-gradient-to-b dark:from-transparent dark:to-black'
			/>
			<Analytics />
			<SpeedInsights />
			<ContactFormDialog />
			<span dangerouslySetInnerHTML={{ __html: profileJsonLd }} />
		</body>
	</html>
);

export default RootLayout;
