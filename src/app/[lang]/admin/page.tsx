import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { use } from 'react';

export default function AdminRootPage({ params }: { params: { lang: string } }) {
  const { lang: paramLang } = use(Promise.resolve(params));
  const lang = i18n.locales.includes(paramLang) ? paramLang : i18n.defaultLocale;
  redirect(`/${lang}/admin/dashboard`);
}
