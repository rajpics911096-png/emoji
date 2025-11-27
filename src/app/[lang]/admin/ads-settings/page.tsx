'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/context/translations-context';

export default function AdsSettingsPage() {
  const { t } = useTranslations();

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('admin_ads_settings')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin_ads_settings')}</CardTitle>
          <CardDescription>
            {t('ads_settings_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('ads_settings_placeholder')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
