"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully saved.",
    });
  };

  const handleSitemap = () => {
    toast({
      title: "Sitemap Generated",
      description: "Sitemap has been generated/updated.",
    });
  };


  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-start gap-4 md:gap-8 lg:max-w-5xl">
      <div className="grid auto-rows-start gap-4 md:gap-8">
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Visual Customization</CardTitle>
            <CardDescription>
              Change website elements like the color theme, font styles, and layout settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="relative">
                <Input id="primary-color" defaultValue="#9400D3" className="pl-12"/>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-6 rounded-sm border" style={{ backgroundColor: '#9400D3' }}/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="relative">
                <Input id="accent-color" defaultValue="#7DF9FF" className="pl-12"/>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-6 rounded-sm border" style={{ backgroundColor: '#7DF9FF' }}/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline-font">Headline Font</Label>
              <Select defaultValue="belleza">
                <SelectTrigger id="headline-font">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belleza">Belleza</SelectItem>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-font">Body Font</Label>
              <Select defaultValue="alegreya">
                <SelectTrigger id="body-font">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alegreya">Alegreya</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logo-upload">Website Logo</Label>
                <Input id="logo-upload" type="file" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>Manage general content settings for your website.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="download-timer">Download Timer (seconds)</Label>
                    <Input id="download-timer" type="number" defaultValue="15" />
                    <p className="text-sm text-muted-foreground">Set the delay before a user can download a file.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Sitemap</CardTitle>
            <CardDescription>
              Manage SEO settings and sitemap generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Default Meta Title</Label>
              <Input id="meta-title" defaultValue="EmojiVerse - Your Universe of Emojis" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">Default Meta Description</Label>
              <Textarea id="meta-description" defaultValue="Discover, copy, and download thousands of emojis in various formats including PNG, GIF, and more." />
            </div>
            <div>
                <Button onClick={handleSitemap}>Generate/Update Sitemap</Button>
                <p className="text-sm text-muted-foreground mt-2">Click to update the sitemap for search engines.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button size="lg" onClick={handleSave}>Save All Settings</Button>
        </div>
      </div>
    </div>
  );
}
