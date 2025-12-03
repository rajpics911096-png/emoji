
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "@/context/translations-context";
import { Input } from "@/components/ui/input";

export default function IntelligentSearchBar({ lang }: { lang: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useTranslations();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newQuery = searchParams.get('search');
    if (newQuery) {
        setQuery(newQuery);
    } else {
        setQuery("");
    }
  }, [searchParams]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
         router.push(`/${lang}/emojis/all?search=${encodeURIComponent(query)}`);
      } else {
         router.push(`/${lang}/emojis/all`);
      }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="pl-4 pr-12 h-11 text-base bg-background border border-input rounded-full shadow-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:ring-offset-background transition-all w-full"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-primary" aria-label="Search">
            <Search />
          </button>
        </div>
      </form>
    </div>
  );
}
