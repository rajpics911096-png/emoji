
'use client';
import { redirect, useParams } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { useEffect } from 'react';

export default function AdminRootPage() {
  const params = useParams<{ lang: string }>();
  
  useEffect(() => {
    const langCode = i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale;
    redirect(`/${langCode}/admin/dashboard`);
  }, [params.lang]);

  return null;
}
