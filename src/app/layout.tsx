import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { TranslationsProvider } from '@/context/translations-context';

export const metadata: Metadata = {
  title: 'EmojiVerse',
  description: 'Your universe of emojis, with PNGs, GIFs, and more!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <SiteSettingsProvider>
          <TranslationsProvider>
            {children}
            <Toaster />
          </TranslationsProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
