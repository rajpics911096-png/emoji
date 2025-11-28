
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';

export default function AdminRootPage({ params }: { params: { lang: string } }) {
  const langCode = i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale;
  redirect(`/${langCode}/admin/dashboard`);
}
