
'use client';

import { Toaster } from '@/components/ui/toaster';
import { ClientProviders } from '@/components/client-providers';
import type { ReactNode } from 'react';
import { i18n } from '@/lib/i18n-config';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useParams, usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paramsFromHook = useParams<{ lang: string }>();
  const pathname = usePathname();
  const lang = i18n.locales.includes(paramsFromHook.lang as any) ? paramsFromHook.lang : i18n.defaultLocale;
  
  const isAdminPage = pathname.includes('/rajurajadmin');

  return (
    <ClientProviders lang={lang}>
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Header lang={lang} />}
            <div className="flex-1">{children}</div>
            {!isAdminPage && <Footer lang={lang} />}
        </div>
        <Toaster />
    </ClientProviders>
  );
}
