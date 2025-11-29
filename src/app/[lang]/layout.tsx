
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { ClientProviders } from '@/components/client-providers';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <ClientProviders lang={params.lang}>
      {children}
      <Toaster />
    </ClientProviders>
  );
}
