
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { use } from 'react';

export default function AdminRootPage({ params }: { params: { lang: string } }) {
  const { lang } = use(Promise.resolve(params));
  const langCode = i18n.locales.includes(lang as any) ? lang : i18n.defaultLocale;
  redirect(`/${langCode}/admin/dashboard`);
}
