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
import { usePathname, useRouter } from "next/navigation";
import { i18n } from "@/lib/i18n-config";

export function LanguageSwitcher() {
  const { language } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLang: string) => {
    if (i18n.locales.includes(newLang as any)) {
      const newPath = pathname.replace(`/${language}`, `/${newLang}`);
      router.replace(newPath);
    }
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto h-9 border-none focus:ring-0 gap-2 bg-transparent">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((langCode) => (
            <SelectItem key={langCode} value={langCode}>{langCode.toUpperCase()}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
