
'use client';

import { Toaster } from '@/components/ui/toaster';
import { SiteSettingsProvider, useSiteSettings } from '@/context/site-settings-context';
import { TranslationsProvider } from '@/context/translations-context';
import { FirebaseProvider } from '@/firebase/provider';
import { DynamicFavicon } from '@/components/dynamic-favicon';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { DynamicTheme } from '@/components/dynamic-theme';

function SiteHead() {
  const { settings } = useSiteSettings();

  return (
    <Head>
      <title>Admin - {settings.name}</title>
      <meta name="robots" content="noindex, nofollow" />
      {settings.headerScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.headerScripts }} />
      )}
    </Head>
  );
}

function BodyScripts() {
    const { settings } = useSiteSettings();
    if (!settings.bodyScripts) return null;
    return (
        <div dangerouslySetInnerHTML={{ __html: settings.bodyScripts }} />
    )
}

function FooterScripts() {
    const { settings } = useSiteSettings();
    if (!settings.footerScripts) return null;
    return (
        <div dangerouslySetInnerHTML={{ __html: settings.footerScripts }} />
    )
}


export function ClientProviders({ children, lang }: { children: ReactNode, lang: string }) {
    return (
        <FirebaseProvider>
            <SiteSettingsProvider>
                <TranslationsProvider language={lang}>
                    <SiteHead />
                    <DynamicFavicon />
                    <DynamicTheme />
                    <BodyScripts />
                    <div className="flex flex-col min-h-screen">
                        {children}
                    </div>
                    <Toaster />
                    <FooterScripts />
                </TranslationsProvider>
            </SiteSettingsProvider>
        </FirebaseProvider>
    );
}
