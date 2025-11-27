import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';

export default function AdminRootPage({ params }: { params: { lang: string } }) {
  const lang = i18n.locales.includes(params.lang) ? params.lang : i18n.defaultLocale;
  redirect(`/${lang}/admin/dashboard`);
}
