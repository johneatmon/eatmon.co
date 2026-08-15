import localFont from 'next/font/local';

export const serverMono = localFont({
  preload: true,
  display: 'swap',
  variable: '--font-server-mono',
  src: [
    { path: '../../public/fonts/server_mono.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/server_mono_oblique.woff2', weight: '400', style: 'oblique' },
  ],
});

export const uncutSans = localFont({
  preload: true,
  weight: '300 700',
  display: 'swap',
  variable: '--font-uncut-sans',
  src: [{ path: '../../public/fonts/uncut_sans.woff2', style: 'normal' }],
});
