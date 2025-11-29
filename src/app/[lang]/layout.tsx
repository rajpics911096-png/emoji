
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { ClientProviders } from '@/components/client-providers';
import type { ReactNode } from 'react';
import { i18n } from '@/lib/i18n-config';

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
      {children}
      <Toaster />
    </ClientProviders>
  );
}
