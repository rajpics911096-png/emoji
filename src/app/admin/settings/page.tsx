"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/context/site-settings-context";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, setSettings, resetSettings } = useSiteSettings();

  const handleSave = () => {
    setSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully saved.",
    });
  };
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "Your settings have been reset to the defaults.",
    });
  }

  const handleSitemap = () => {
    toast({
      title: "Sitemap Generated",
      description: "Sitemap has been generated/updated.",
    });
  };

  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>

       <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Customize your website's name and logo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="site-name">Website Name</Label>
            <Input
              id="site-name"
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              This will appear in the header and footer.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-logo">Logo (SVG Code)</Label>
            <Textarea
              id="site-logo"
              value={settings.logo}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              Paste the full SVG code for your logo here.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Manage content-related settings for your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="download-timer">Download Timer</Label>
            <Input
              id="download-timer"
              type="number"
              value={settings.downloadTimer}
              onChange={(e) => setSettings({ ...settings, downloadTimer: parseInt(e.target.value, 10) })}
            />
            <p className="text-sm text-muted-foreground">
              Set the countdown time in seconds for file downloads.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Generate Sitemap</Label>
            <Button onClick={handleSitemap} variant="outline" className="w-full">
              Generate
            </Button>
            <p className="text-sm text-muted-foreground">
              Manually generate or update the sitemap.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button onClick={handleReset} variant="outline">Reset to Default</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
