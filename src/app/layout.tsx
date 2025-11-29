
import './globals.css';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { ClientProviders } from '@/components/client-providers';
import { i18n } from '@/lib/i18n-config';

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: string };
}>) {
  const lang = i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale;

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <ClientProviders lang={lang}>
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
