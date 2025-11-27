
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { Label } from '@/components/ui/label';

export default function AdsTxtSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings } = useSiteSettings();

  const handleSave = () => {
    setSettings(settings);
    toast({
      title: t('settings_toast_saved_title'),
      description: 'Your ads.txt file has been updated.',
    });
  };

  const handleAdsTxtChange = (content: string) => {
    setSettings({ ...settings, adsTxtContent: content });
  };

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Ads.txt</h1>
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ads.txt Manager</CardTitle>
          <CardDescription>
            Edit the content of your ads.txt file here. This file is used by
            advertisers to verify your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ads-txt-content">ads.txt Content</Label>
            <Textarea
              id="ads-txt-content"
              placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
              value={settings.adsTxtContent || ''}
              onChange={(e) => handleAdsTxtChange(e.target.value)}
              rows={15}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
