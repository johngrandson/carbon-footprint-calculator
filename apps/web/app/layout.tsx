import '@workspace/ui/globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';

const THEME_COLORS = {
  light: 'white',
  dark: 'black',
} as const;

const SCALE_VALUES = {
  initial: 1,
  minimum: 1,
  maximum: 1,
} as const;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: SCALE_VALUES.initial,
  minimumScale: SCALE_VALUES.minimum,
  maximumScale: SCALE_VALUES.maximum,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark }
  ]
};

export const metadata: Metadata = {
  title: 'SINAI | Carbon Footprint Calculator',
  description: 'Calculate your carbon footprint and make the difference in the world!',
  robots: {
    index: true,
    follow: true
  }
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="size-full min-h-screen"
      suppressHydrationWarning
    >
      <body className={`${inter.className} size-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
