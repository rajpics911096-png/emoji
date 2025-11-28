
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/context/site-settings-context";
import { useTranslations } from "@/context/translations-context";
import type { HSLColor } from "@/lib/types";

type ColorName = 'background' | 'foreground' | 'card' | 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive';

// Helper to convert HEX to HSL
const hexToHsl = (hex: string): HSLColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return { h: 0, s: 0, l: 0 };
    }
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

// Helper to convert HSL to HEX
const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};


export default function ColorsSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings } = useSiteSettings();
  const { colors = {} } = settings;

  const handleColorChange = (colorName: ColorName, hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    const newColors = {
        ...settings.colors,
        [colorName]: hslValue
    };
    setSettings({ ...settings, colors: newColors });
  };
  
  const handleSave = () => {
    setSettings(settings);
    toast({
      title: t('settings_toast_saved_title'),
      description: "Your color settings have been saved.",
    });
  };

  const ColorEditor = ({ name, title, description }: { name: ColorName, title: string, description?: string }) => {
    const color = colors[name] || { h: 0, s: 0, l: 0 };
    const hexColor = hslToHex(color.h, color.s, color.l);

    return (
      <div className="space-y-2">
        <Label htmlFor={`color-${name}`} className="font-medium capitalize">{title}</Label>
        <div className="flex items-center gap-4">
            <Input
              id={`color-${name}`}
              type="color"
              value={hexColor}
              onChange={(e) => handleColorChange(name, e.target.value)}
              className="p-1 h-10 w-14"
            />
            <Input
                type="text"
                value={hexColor}
                onChange={(e) => handleColorChange(name, e.target.value)}
                className="font-mono"
            />
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  };


  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Theme Colors</h1>
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color Customization</CardTitle>
          <CardDescription>
            Choose your website's main colors. Changes will apply across the entire site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Base Colors</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorEditor name="background" title="Background" description="Main page background." />
                <ColorEditor name="foreground" title="Foreground" description="Main text color." />
                <ColorEditor name="card" title="Card Background" description="Background for cards and popovers." />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Primary & Secondary Colors</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorEditor name="primary" title="Primary" description="Main brand color for buttons, links." />
                <ColorEditor name="secondary" title="Secondary" description="For less prominent elements." />
            </div>
          </div>
           <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Other Colors</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorEditor name="accent" title="Accent" description="Highlights for specific elements." />
                <ColorEditor name="muted" title="Muted" description="For subtle text and borders." />
                <ColorEditor name="destructive" title="Destructive" description="For error messages and delete actions." />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
