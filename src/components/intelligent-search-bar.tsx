
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/context/translations-context";

export default function IntelligentSearchBar({ lang }: { lang: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useTranslations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query) {
         router.push(`/${lang}/emojis/all?search=${query}`)
      }
  };

  return (
    <div className="relative">
      <form
        className="w-full"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex items-center w-full bg-background border border-input rounded-full shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all">
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="pl-4 pr-12 h-14 text-lg bg-transparent border-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              value={query}
              onChange={handleInputChange}
            />
            <button type="submit" aria-label="Search" className="absolute right-5 h-6 w-6 text-muted-foreground">
              <Search />
            </button>
        </div>
      </form>
    </div>
  );
}
