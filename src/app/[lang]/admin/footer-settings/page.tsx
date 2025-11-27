'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { footerContent as initialFooterContent } from '@/lib/data';
import { useState } from 'react';
import type { FooterContent, LinkItem, SocialLink } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';

export default function FooterSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [footerContent, setFooterContent] =
    useState<FooterContent>(initialFooterContent);

  const handleSave = () => {
    // In a real app, you would send this data to your backend to save it.
    console.log('Saving footer settings:', { footerContent });
    toast({
      title: t('settings_toast_saved_title'),
      description: t('settings_toast_saved_desc'),
    });
  };

  const handleFooterChange = <T extends LinkItem | SocialLink>(
    section: keyof FooterContent,
    index: number,
    field: keyof T,
    value: string
  ) => {
    const newContent = { ...footerContent };
    (newContent[section][index] as any)[field] = value;
    setFooterContent(newContent);
  };

  const handleAddLink = (section: 'navigation' | 'legal') => {
    const newContent = { ...footerContent };
    newContent[section].push({ label: 'New Link', href: '#' });
    setFooterContent(newContent);
  };

  const handleRemoveLink = (
    section: 'navigation' | 'legal' | 'social',
    index: number
  ) => {
    const newContent = { ...footerContent };
    newContent[section].splice(index, 1);
    setFooterContent(newContent);
  };

  const handleAddSocial = () => {
    const newContent = { ...footerContent };
    newContent.social.push({ icon: 'twitter', href: '#', 'aria-label': 'Twitter' });
    setFooterContent(newContent);
  };

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('footer_settings_title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('footer_settings_title')}</CardTitle>
          <CardDescription>
            {t('footer_settings_links_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('footer_settings_nav_links')}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddLink('navigation')}
              >
                {t('footer_settings_add_link_button')}
              </Button>
            </div>
            {footerContent.navigation.map((link, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="space-y-1">
                    <Label htmlFor={`nav-label-${index}`} className="text-xs">
                      {t('footer_settings_label_label')}
                    </Label>
                    <Input
                      id={`nav-label-${index}`}
                      value={link.label}
                      onChange={(e) =>
                        handleFooterChange(
                          'navigation',
                          index,
                          'label',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`nav-href-${index}`} className="text-xs">
                      {t('footer_settings_url_label')}
                    </Label>
                    <Input
                      id={`nav-href-${index}`}
                      value={link.href}
                      onChange={(e) =>
                        handleFooterChange(
                          'navigation',
                          index,
                          'href',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleRemoveLink('navigation', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('footer_settings_legal_links')}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddLink('legal')}
              >
                {t('footer_settings_add_link_button')}
              </Button>
            </div>
            {footerContent.legal.map((link, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="space-y-1">
                    <Label htmlFor={`legal-label-${index}`} className="text-xs">
                      {t('footer_settings_label_label')}
                    </Label>
                    <Input
                      id={`legal-label-${index}`}
                      value={link.label}
                      onChange={(e) =>
                        handleFooterChange(
                          'legal',
                          index,
                          'label',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`legal-href-${index}`} className="text-xs">
                      {t('footer_settings_url_label')}
                    </Label>
                    <Input
                      id={`legal-href-${index}`}
                      value={link.href}
                      onChange={(e) =>
                        handleFooterChange('legal', index, 'href', e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleRemoveLink('legal', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('footer_settings_social_links')}</h3>
              <Button variant="outline" size="sm" onClick={handleAddSocial}>
                {t('footer_settings_add_social_button')}
              </Button>
            </div>
            {footerContent.social.map((link, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`social-icon-${index}`}
                      className="text-xs"
                    >
                      {t('footer_settings_icon_name_label')}
                    </Label>
                    <Input
                      id={`social-icon-${index}`}
                      value={link.icon}
                      onChange={(e) =>
                        handleFooterChange(
                          'social',
                          index,
                          'icon',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`social-label-${index}`}
                      className="text-xs"
                    >
                      {t('footer_settings_aria_label')}
                    </Label>
                    <Input
                      id={`social-label-${index}`}
                      value={link['aria-label']}
                      onChange={(e) =>
                        handleFooterChange(
                          'social',
                          index,
                          'aria-label',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`social-href-${index}`} className="text-xs">
                      {t('footer_settings_url_label')}
                    </Label>
                    <Input
                      id={`social-href-${index}`}
                      value={link.href}
                      onChange={(e) =>
                        handleFooterChange(
                          'social',
                          index,
                          'href',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleRemoveLink('social', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>
    </div>
  );
}
