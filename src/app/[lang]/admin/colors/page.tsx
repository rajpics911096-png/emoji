
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
import { Slider } from "@/components/ui/slider";

type ColorName = 'background' | 'foreground' | 'primary' | 'accent' | 'card' | 'secondary' | 'muted';

export default function ColorsSettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings } = useSiteSettings();
  const { colors = {} } = settings;

  const handleColorChange = (colorName: ColorName, property: 'h' | 's' | 'l', value: number) => {
    const newColors = {
        ...settings.colors,
        [colorName]: {
            ...settings.colors?.[colorName],
            [property]: value
        }
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

  const ColorEditor = ({ name, title }: { name: ColorName, title: string }) => {
    const color = colors[name] || { h: 0, s: 0, l: 0 };
    return (
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium capitalize">{title}</h3>
        <div className="space-y-2">
            <Label className="text-sm">Hue</Label>
            <div className="flex items-center gap-2">
                <Slider value={[color.h]} onValueChange={([v]) => handleColorChange(name, 'h', v)} max={360} step={1} />
                <span className="text-sm text-muted-foreground w-12 text-right">{color.h}</span>
            </div>
        </div>
         <div className="space-y-2">
            <Label className="text-sm">Saturation</Label>
            <div className="flex items-center gap-2">
                <Slider value={[color.s]} onValueChange={([v]) => handleColorChange(name, 's', v)} max={100} step={1} />
                 <span className="text-sm text-muted-foreground w-12 text-right">{color.s}%</span>
            </div>
        </div>
         <div className="space-y-2">
            <Label className="text-sm">Lightness</Label>
            <div className="flex items-center gap-2">
                <Slider value={[color.l]} onValueChange={([v]) => handleColorChange(name, 'l', v)} max={100} step={1} />
                 <span className="text-sm text-muted-foreground w-12 text-right">{color.l}%</span>
            </div>
        </div>
        <div 
            className="h-10 w-full rounded-md border" 
            style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`}}
        />
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
            Adjust the HSL (Hue, Saturation, Lightness) values for your site's theme.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorEditor name="background" title="Background" />
            <ColorEditor name="foreground" title="Foreground" />
            <ColorEditor name="primary" title="Primary" />
            <ColorEditor name="accent" title="Accent" />
            <ColorEditor name="card" title="Card" />
            <ColorEditor name="secondary" title="Secondary" />
            <ColorEditor name="muted" title="Muted" />
        </CardContent>
      </Card>
    </div>
  );
}
