
import { AuthGuard } from "@/components/auth-guard";
import type { ReactNode } from 'react';
import { ClientProviders } from "@/components/client-providers-admin";


export default function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <ClientProviders lang={params.lang}>
        <AuthGuard>
            {children}
        </AuthGuard>
    </ClientProviders>
  );
}
