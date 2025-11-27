
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
import Link from 'next/link';

export default function AdsTxtSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings } = useSiteSettings();

  const handleSave = async () => {
    try {
      // For this prototype, we'll save to localStorage via the context.
      // A build step would be needed to create a static ads.txt from this setting.
      setSettings(settings);
      toast({
        title: t('settings_toast_saved_title'),
        description: 'Your ads.txt content has been updated in settings.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save ads.txt content.',
      });
    }
  };

  const handleAdsTxtChange = (content: string) => {
    setSettings({ ...settings, adsTxtContent: content });
  };

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Ads.txt</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/ads.txt" target="_blank">
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave}>{t('settings_save_button')}</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ads.txt Manager</CardTitle>
          <CardDescription>
            Edit the content of your ads.txt file here. This file is used by
            advertisers to verify your site. Changes are saved to settings and would
            typically be used to generate a static file during a build process.
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
