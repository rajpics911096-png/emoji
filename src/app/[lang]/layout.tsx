
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { TranslationsProvider } from '@/context/translations-context';
import { i18n } from '@/lib/i18n-config';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'EmojiVerse',
  description: 'Your universe of emojis, with PNGs, GIFs, and more!',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = use(Promise.resolve(params));
  return (
    <html lang={lang} dir={lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr'} suppressHydrationWarning>
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
          <TranslationsProvider language={lang}>
            {children}
            <Toaster />
          </TranslationsProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
