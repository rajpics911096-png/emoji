
import { Toaster } from '@/components/ui/toaster';
import { ClientProviders } from '@/components/client-providers';
import type { ReactNode } from 'react';
import { i18n } from '@/lib/i18n-config';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const lang = i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale;
  return (
    <ClientProviders lang={lang}>
        <div className="flex flex-col min-h-screen">
            <Header lang={lang} />
            <div className="flex-1">{children}</div>
            <Footer lang={lang} />
        </div>
        <Toaster />
    </ClientProviders>
  );
}
