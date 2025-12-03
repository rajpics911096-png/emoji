
import { AuthGuard } from "@/components/auth-guard";
import type { ReactNode } from 'react';
import { ClientProviders } from "@/components/client-providers-admin";
import '@/app/globals.css';
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";


export default function AdminRootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
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
            <ClientProviders lang={params.lang}>
                <AuthGuard>
                    {children}
                </AuthGuard>
            </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
