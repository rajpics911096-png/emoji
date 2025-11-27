
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { downloadTimer } from "@/lib/data";
import { useState } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [timer, setTimer] = useState(downloadTimer);

  const handleSave = () => {
    // Here you would typically save the settings to a backend.
    // For this example, we'll just show a toast.
    // In a real app, you might update the `downloadTimer` in `src/lib/data.ts`
    // via an API call.
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
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
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
                value={timer}
                onChange={(e) => setTimer(parseInt(e.target.value, 10))}
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
         <div className="flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
        </div>
    </div>
  );
}
