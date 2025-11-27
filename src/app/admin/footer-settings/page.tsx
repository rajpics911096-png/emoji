"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { footerContent as initialFooterContent } from "@/lib/data";
import { socialIconNames } from "@/lib/icon-map";
import { useState } from "react";
import type { FooterContent, LinkItem, SocialLink } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default function FooterSettingsPage() {
  const { toast } = useToast();
  const [footerContent, setFooterContent] = useState<FooterContent>(initialFooterContent);

  const handleSave = () => {
    // In a real app, you would send this data to your backend to save it.
    console.log("Saving footer settings:", { footerContent });
    toast({
      title: "Settings Saved",
      description: "Your footer settings have been successfully saved.",
    });
  };

  const handleFooterChange = <T extends LinkItem | SocialLink>(section: keyof FooterContent, index: number, field: keyof T, value: string) => {
    const newContent = { ...footerContent };
    (newContent[section][index] as any)[field] = value;
    setFooterContent(newContent);
  };
  
  const handleAddLink = (section: 'navigation' | 'legal') => {
    const newContent = { ...footerContent };
    newContent[section].push({ label: 'New Link', href: '#' });
    setFooterContent(newContent);
  };
  
  const handleRemoveLink = (section: 'navigation' | 'legal' | 'social', index: number) => {
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
        <h1 className="text-3xl font-headline font-bold">Footer Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Footer Links & Content</CardTitle>
                <CardDescription>Manage the links and content in your site's footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Navigation Links</h3>
                        <Button variant="outline" size="sm" onClick={() => handleAddLink('navigation')}>Add Link</Button>
                    </div>
                    {footerContent.navigation.map((link, index) => (
                        <div key={index} className="flex items-end gap-2">
                           <div className="grid grid-cols-2 gap-2 flex-1">
                             <div className="space-y-1">
                                <Label htmlFor={`nav-label-${index}`} className="text-xs">Label</Label>
                                <Input id={`nav-label-${index}`} value={link.label} onChange={(e) => handleFooterChange('navigation', index, 'label', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`nav-href-${index}`} className="text-xs">URL</Label>
                                <Input id={`nav-href-${index}`} value={link.href} onChange={(e) => handleFooterChange('navigation', index, 'href', e.target.value)} />
                            </div>
                           </div>
                           <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleRemoveLink('navigation', index)}>
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Legal Links</h3>
                        <Button variant="outline" size="sm" onClick={() => handleAddLink('legal')}>Add Link</Button>
                    </div>
                     {footerContent.legal.map((link, index) => (
                        <div key={index} className="flex items-end gap-2">
                           <div className="grid grid-cols-2 gap-2 flex-1">
                             <div className="space-y-1">
                                <Label htmlFor={`legal-label-${index}`} className="text-xs">Label</Label>
                                <Input id={`legal-label-${index}`} value={link.label} onChange={(e) => handleFooterChange('legal', index, 'label', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`legal-href-${index}`} className="text-xs">URL</Label>
                                <Input id={`legal-href-${index}`} value={link.href} onChange={(e) => handleFooterChange('legal', index, 'href', e.target.value)} />
                            </div>
                           </div>
                           <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleRemoveLink('legal', index)}>
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Social Links</h3>
                        <Button variant="outline" size="sm" onClick={handleAddSocial}>Add Social</Button>
                    </div>
                     {footerContent.social.map((link, index) => (
                        <div key={index} className="flex items-end gap-2">
                           <div className="grid grid-cols-2 gap-2 flex-1">
                             <div className="space-y-1">
                                <Label htmlFor={`social-icon-${index}`} className="text-xs">Icon</Label>
                                <Select value={link.icon} onValueChange={(value) => handleFooterChange('social', index, 'icon', value)}>
                                    <SelectTrigger id={`social-icon-${index}`}>
                                        <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {socialIconNames.map(iconName => (
                                            <SelectItem key={iconName} value={iconName} className="capitalize">
                                                {iconName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`social-href-${index}`} className="text-xs">URL</Label>
                                <Input id={`social-href-${index}`} value={link.href} onChange={(e) => handleFooterChange('social', index, 'href', e.target.value)} />
                            </div>
                           </div>
                           <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleRemoveLink('social', index)}>
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
         <div className="flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
        </div>
    </div>
  );
}
