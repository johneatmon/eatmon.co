import localFont from 'next/font/local';

export const soehneSans = localFont({
  preload: true,
  display: 'swap',
  variable: '--font-soehne',
  src: [
    // Buch (book) → Regular
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-buch.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-buch-kursiv.woff2',
      weight: '400',
      style: 'italic',
    },
    // Kräftig → Medium
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-kraftig.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-kraftig-kursiv.woff2',
      weight: '500',
      style: 'italic',
    },
    // Halbfett → Semibold
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-halbfett.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-halbfett-kursiv.woff2',
      weight: '600',
      style: 'italic',
    },
    // Dreiviertelfett → Bold
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-dreiviertelfett.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../node_modules/@johneatmon/soehne/files/woff2/soehne-dreiviertelfett-kursiv.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});

export const serverMono = localFont({
  preload: true,
  display: 'swap',
  variable: '--font-server-mono',
  src: [
    { path: '../../public/fonts/server_mono.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/server_mono_oblique.woff2', weight: '400', style: 'oblique' },
  ],
});
