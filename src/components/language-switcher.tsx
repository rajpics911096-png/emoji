"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "@/context/translations-context";

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useTranslations();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto h-9 border-none focus:ring-0 gap-2 bg-transparent">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([langCode, langName]) => (
            <SelectItem key={langCode} value={langCode}>{langName}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
