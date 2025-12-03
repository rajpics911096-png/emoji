
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/context/translations-context';
import type { AdSetting } from '@/lib/types';
import { useSiteSettings } from '@/context/site-settings-context';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdsSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings } = useSiteSettings();
  const [adSettings, setAdSettings] = useState<AdSetting[]>(settings.adSettings || []);

  const handleSave = () => {
    setSettings({ ...settings, adSettings });
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

  const handleAlignChange = (index: number, align: 'left' | 'center' | 'right') => {
      const newSettings = [...adSettings];
      newSettings[index].align = align;
      setAdSettings(newSettings);
  }
  
  const handleEnabledChange = (index: number, enabled: boolean) => {
    const newSettings = [...adSettings];
    newSettings[index].enabled = enabled;
    setAdSettings(newSettings);
  }
  
  const handleShowAfterChange = (index: number, value: string) => {
      const newSettings = [...adSettings];
      newSettings[index].showAfter = parseInt(value, 10) || 0;
      setAdSettings(newSettings);
  }

  const handleAddSlot = () => {
    setAdSettings([...(adSettings || []), { location: 'custom', code: '', enabled: true, align: 'center' }]);
  }
  
  const handleRemoveSlot = (index: number) => {
      setAdSettings((adSettings || []).filter((_, i) => i !== index));
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
          {(adSettings || []).map((setting, index) => (
            <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id={`ad-enabled-${index}`}
                            checked={setting.enabled}
                            onCheckedChange={(checked) => handleEnabledChange(index, checked)}
                        />
                         <Label htmlFor={`ad-enabled-${index}`}>{setting.enabled ? "Enabled" : "Disabled"}</Label>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => handleRemoveSlot(index)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                </div>
              <div className="grid md:grid-cols-2 gap-4">
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
                      <SelectItem value="in_download_grid">In Download Grid</SelectItem>
                      <SelectItem value="below_download">Below Download</SelectItem>
                       <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ad-align-${index}`}>Alignment</Label>
                  <Select value={setting.align || 'center'} onValueChange={(value: 'left' | 'center' | 'right') => handleAlignChange(index, value)}>
                    <SelectTrigger id={`ad-align-${index}`}>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {setting.location === 'in_download_grid' && (
                    <div className="space-y-2">
                        <Label htmlFor={`show-after-${index}`}>Show After (files)</Label>
                        <Input
                            id={`show-after-${index}`}
                            type="number"
                            value={setting.showAfter || 4}
                            onChange={(e) => handleShowAfterChange(index, e.target.value)}
                            placeholder="e.g. 4"
                        />
                    </div>
                )}
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
