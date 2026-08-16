import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import type { Person } from 'schema-dts';
import { SiteFooter } from '~/components/site-footer';
import { ThemeProvider } from '~/components/theme-provider';
import { serverMono, soehneSans } from '~/lib/fonts';
import { cn, siteUrl, toJsonLd } from '~/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'John Eatmon — Software Engineer & Synthesist',
    template: '%s — John Eatmon',
  },
  description: 'Seattle-based software engineer and synthesist.',
  openGraph: {
    title: 'John Eatmon — Software Engineer & Synthesist',
    description: 'Seattle-based software engineer and synthesist.',
    url: siteUrl(),
    siteName: 'John Eatmon',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'John Eatmon — Software Engineer & Synthesist',
    card: 'summary_large_image',
    images: ['/og'],
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: true,
  },
};

const profileJsonLd = toJsonLd<Person>({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Eatmon',
  jobTitle: 'Software Engineer',
  url: siteUrl(),
  sameAs: [
    'https://github.com/johneatmon',
    'https://www.linkedin.com/in/johneatmon/',
    'https://read.cv/johneatmon',
    'https://twitter.com/johneatmon_',
  ],
  image: siteUrl('/images/me.jpg'),
  alumniOf: 'University of Central Florida',
  worksFor: {
    '@type': 'Organization',
    name: 'duskworks',
    url: 'https://www.duskworks.dev/',
  },
  knowsLanguage: ['English', 'French'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('min-h-full antialiased', soehneSans.variable, serverMono.variable)}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-dvh flex-col bg-(--background) text-(--foreground)">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-dvh flex-col">
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: profileJsonLd }} />
      </body>
    </html>
  );
}
