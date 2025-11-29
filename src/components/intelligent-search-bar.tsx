
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "@/context/translations-context";
import { searchEmojisAction } from "@/lib/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { Emoji } from "@/lib/types";

export default function IntelligentSearchBar({ lang }: { lang: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslations();
  const debouncedQuery = useDebounce(query, 300);
  const searchParams = useSearchParams();

  useEffect(() => {
    const newQuery = searchParams.get('search');
    if (newQuery) {
        setQuery(newQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      startTransition(async () => {
        const { results: searchResults } = await searchEmojisAction(debouncedQuery, lang);
        setResults(searchResults);
        if (!isOpen) setIsOpen(true);
      });
    } else {
      setResults([]);
       if (isOpen) setIsOpen(false);
    }
  }, [debouncedQuery, lang, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
         router.push(`/${lang}/emojis/all?search=${query}`);
         setIsOpen(false);
      }
  };

  const handleSelectResult = (emojiId: string) => {
    router.push(`/${lang}/emoji/${emojiId}`);
    setIsOpen(false);
  }
  
  const handleBlur = () => {
    // Delay closing to allow for click events on results
    setTimeout(() => {
        if(isOpen) setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative">
      <Command shouldFilter={false} onBlur={handleBlur} className="overflow-visible bg-transparent">
        <form
          className="w-full"
          onSubmit={handleFormSubmit}
        >
          <div className="relative flex items-center w-full bg-background border border-input rounded-full shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all">
              <CommandInput
                type="search"
                value={query}
                onValueChange={setQuery}
                onFocus={() => { if(results.length > 0) setIsOpen(true); }}
                placeholder={t('searchPlaceholder')}
                className="pl-4 pr-12 h-12 text-base bg-transparent border-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              />
              <button type="submit" aria-label="Search" className="absolute right-4 h-6 w-6 text-muted-foreground z-10">
                {isPending ? <Loader2 className="animate-spin" /> : <Search />}
              </button>
          </div>
        </form>

        {isOpen && (
            <CommandList className="absolute top-full mt-2 w-full z-50 rounded-lg border bg-popover text-popover-foreground shadow-lg">
                {results.length > 0 ? (
                    <CommandGroup>
                        {results.slice(0, 10).map((emoji) => (
                           <CommandItem key={emoji.id} onSelect={() => handleSelectResult(emoji.id)} value={emoji.title}>
                               <span className="text-2xl mr-4">{emoji.emoji}</span>
                               <span className="font-medium">{t(emoji.title)}</span>
                           </CommandItem>
                        ))}
                    </CommandGroup>
                ) : !isPending && debouncedQuery.length > 1 ? (
                    <CommandEmpty>{t('searchNoResults')}</CommandEmpty>
                ) : null}
            </CommandList>
        )}
      </Command>
    </div>
  );
}
