
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/context/translations-context';

type AdSetting = {
  location: string;
  code: string;
  enabled: boolean;
};

export default function AdsSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [adSettings, setAdSettings] = useState<AdSetting[]>([
    { location: 'header', code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
<!-- Homepage Leaderboard -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`, enabled: true },
    { location: 'footer', code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9876543210987654"
     crossorigin="anonymous"></script>
<!-- Footer Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9876543210987654"
     data-ad-slot="0987654321"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`, enabled: false },
    { location: 'sidebar', code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1122334455667788"
     crossorigin="anonymous"></script>
<!-- Sidebar Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1122334455667788"
     data-ad-slot="1122334455"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`, enabled: true },
 { location: 'below_emoji', code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4455667788990011"
     crossorigin="anonymous"></script>
<!-- Below Emoji Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-4455667788990011"
     data-ad-slot="4455667788"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`, enabled: false },
  ]);

  const handleSave = () => {
    // In a real app, you would save this to a database.
    // For now, we'll just log it and show a toast.
    console.log('Saving ad settings:', adSettings);
    toast({
      title: t('settings_toast_saved_title'),
      description: t('ads_settings_saved_desc'),
    });
  };

  const handleCodeChange = (index: number, code: string) => {
    const newSettings = [...adSettings];
    newSettings[index].code = code;
    setAdSettings(newSettings);
  };
  
  const handleLocationChange = (index: number, location: string) => {
      const newSettings = [...adSettings];
      newSettings[index].location = location;
      setAdSettings(newSettings);
  }

  const handleAddSlot = () => {
    setAdSettings([...adSettings, { location: 'custom', code: '', enabled: true }]);
  }
  
  const handleRemoveSlot = (index: number) => {
      setAdSettings(adSettings.filter((_, i) => i !== index));
  }

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">{t('admin_ads_settings')}</h1>
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin_ads_settings')}</CardTitle>
          <CardDescription>{t('ads_settings_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {adSettings.map((setting, index) => (
            <Card key={index} className="p-4">
                <div className="flex justify-end mb-2">
                     <Button variant="ghost" size="sm" onClick={() => handleRemoveSlot(index)}>{t('dialog_delete_button')}</Button>
                </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`ad-location-${index}`}>{t('ads_settings_location_label')}</Label>
                  <Select value={setting.location} onValueChange={(value) => handleLocationChange(index, value)}>
                    <SelectTrigger id={`ad-location-${index}`}>
                      <SelectValue placeholder={t('ads_settings_location_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">{t('ads_settings_location_header')}</SelectItem>
                      <SelectItem value="footer">{t('ads_settings_location_footer')}</SelectItem>
                      <SelectItem value="below_emoji">{t('ads_settings_location_below_emoji')}</SelectItem>
                      <SelectItem value="sidebar">{t('ads_settings_location_sidebar')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`ad-code-${index}`}>{t('ads_settings_code_label')}</Label>
                  <Textarea
                    id={`ad-code-${index}`}
                    placeholder={t('ads_settings_code_placeholder')}
                    value={setting.code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </Card>
          ))}
           <Button variant="outline" onClick={handleAddSlot}>{t('ads_settings_add_slot_button')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
