
"use client";

import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import { SiteSettingsProvider, useSiteSettings } from '@/context/site-settings-context';
import { TranslationsProvider } from '@/context/translations-context';
import { FirebaseProvider } from '@/firebase/provider';
import { DynamicFavicon } from '@/components/dynamic-favicon';
import Head from 'next/head';
import { useEffect } from 'react';

function SiteHead() {
  const { settings } = useSiteSettings();

  return (
    <Head>
      <title>{settings.metaTitle || settings.name}</title>
      <meta name="description" content={settings.metaDescription} />
      <meta property="og:title" content={settings.metaTitle || settings.name} />
      <meta property="og:description" content={settings.metaDescription} />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={settings.metaTitle || settings.name} />
      <meta name="twitter:description" content={settings.metaDescription} />
      <meta name="twitter:image" content="/og-image.png" />
    </Head>
  );
}

function DynamicTheme() {
    const { settings } = useSiteSettings();

    useEffect(() => {
        const root = document.documentElement;
        if (settings.colors) {
            for (const [name, hsl] of Object.entries(settings.colors)) {
                if (hsl) {
                    root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
                }
            }
        }
    }, [settings.colors]);

    return null;
}


export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = params;
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
        <FirebaseProvider>
            <SiteSettingsProvider>
            <TranslationsProvider language={lang}>
                <SiteHead />
                <DynamicFavicon />
                <DynamicTheme />
                {children}
                <Toaster />
            </TranslationsProvider>
            </SiteSettingsProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
