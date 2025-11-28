
import type { Metadata, ResolvingMetadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { TranslationsProvider } from '@/context/translations-context';
import { i18n } from '@/lib/i18n-config';
import { FirebaseProvider } from '@/firebase/provider';
import { defaultSiteSettings } from '@/lib/site-settings';
import translations from '@/lib/translations';

type Props = {
  params: { lang: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = (i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale) as keyof typeof translations;
  const t = (key: string) => translations[lang]?.[key] || translations['en'][key] || key;
  
  // This is a workaround to get the settings from local storage on the server.
  // In a real app, this would be fetched from a database.
  const siteSettings = defaultSiteSettings;

  return {
    title: {
      default: siteSettings.name,
      template: `%s | ${siteSettings.name}`,
    },
    description: t('siteDescription'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: '/',
      languages: i18n.locales.reduce((acc, locale) => {
        acc[locale] = `/${locale}`;
        return acc;
      }, {} as Record<string, string>),
    },
     openGraph: {
      title: siteSettings.name,
      description: t('siteDescription'),
      url: '/',
      siteName: siteSettings.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: lang,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: siteSettings.name,
      description: t('siteDescription'),
      images: ['/og-image.png'],
    },
    icons: {
        icon: `data:image/svg+xml,${encodeURIComponent(siteSettings.favicon)}`
    }
  }
}

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
                {children}
                <Toaster />
            </TranslationsProvider>
            </SiteSettingsProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
