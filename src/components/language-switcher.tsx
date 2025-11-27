"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  // In a real app, you'd likely use a library like next-intl or react-i18next
  // and get the current locale from there.
  const currentLanguage = "en";

  const onSelectLanguage = (lang: string) => {
    // Logic to change language would go here
    console.log("Language changed to:", lang);
  };

  return (
    <Select defaultValue={currentLanguage} onValueChange={onSelectLanguage}>
      <SelectTrigger className="w-auto h-9 border-none focus:ring-0 gap-2 bg-transparent">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        <SelectItem value="pt">Português</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="zh">中文</SelectItem>
      </SelectContent>
    </Select>
  );
}
