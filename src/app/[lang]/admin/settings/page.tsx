"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/context/site-settings-context";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/context/translations-context";

export default function SettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings, resetSettings } = useSiteSettings();

  const handleSave = () => {
    setSettings(settings);
    toast({
      title: t('settings_toast_saved_title'),
      description: t('settings_toast_saved_desc'),
    });
  };
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: t('settings_toast_reset_title'),
      description: t('settings_toast_reset_desc'),
    });
  }

  const handleSitemap = () => {
    toast({
      title: t('settings_toast_sitemap_title'),
      description: t('settings_toast_sitemap_desc'),
    });
  };

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('settings_title')}</h1>

       <Card>
        <CardHeader>
          <CardTitle>{t('settings_branding_title')}</CardTitle>
          <CardDescription>
            {t('settings_branding_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="site-name">{t('settings_site_name_label')}</Label>
            <Input
              id="site-name"
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_site_name_desc')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-logo">{t('settings_logo_label')}</Label>
            <Textarea
              id="site-logo"
              value={settings.logo}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_logo_desc')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings_content_title')}</CardTitle>
          <CardDescription>
            {t('settings_content_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="download-timer">{t('settings_download_timer_label')}</Label>
            <Input
              id="download-timer"
              type="number"
              value={settings.downloadTimer}
              onChange={(e) => setSettings({ ...settings, downloadTimer: parseInt(e.target.value, 10) })}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_download_timer_desc')}
            </p>
          </div>
          <div className="space-y-2">
            <Label>{t('settings_sitemap_label')}</Label>
            <Button onClick={handleSitemap} variant="outline" className="w-full">
              {t('settings_sitemap_button')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('settings_sitemap_desc')}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button onClick={handleReset} variant="outline">{t('settings_reset_button')}</Button>
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>
    </div>
  );
}
