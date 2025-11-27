
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
      // This is a workaround for a prototype environment.
      // In a real app, this would be a server action that writes to a secure location.
      // We are creating a "server action" on the client to write the file.
      const response = await fetch('/api/update-ads-txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: settings.adsTxtContent || '' }),
      });

      if (!response.ok) {
        throw new Error('Failed to save ads.txt');
      }

      setSettings(settings); // This updates localStorage
      toast({
        title: t('settings_toast_saved_title'),
        description: 'Your ads.txt file has been updated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save ads.txt file.',
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
