
import './globals.css';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { ClientProviders } from '@/components/client-providers';

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang || "en"} dir="ltr" suppressHydrationWarning>
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <ClientProviders lang={params.lang}>
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
