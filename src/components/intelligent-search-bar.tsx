
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchEmojisAction } from "@/lib/actions";
import type { Emoji } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/context/translations-context";

export default function IntelligentSearchBar({ lang }: { lang: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslations();

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    startTransition(async () => {
      const { results } = await searchEmojisAction(searchQuery);
      setResults(results);
    });
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  const handleSelect = (id: string) => {
    setIsOpen(false);
    router.push(`/${lang}/emoji/${id}`);
  };

  return (
    <div className="relative">
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (query) {
             router.push(`/${lang}/emojis/all?search=${query}`)
          }
        }}
      >
        <div className="relative flex items-center w-full bg-background border border-input rounded-full shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all">
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="pl-4 pr-12 h-14 text-lg bg-transparent border-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query && setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            <Search className="absolute right-5 h-6 w-6 text-muted-foreground pointer-events-none" />
        </div>
      </form>
       <div className={cn("absolute top-full mt-2 w-full z-10", isOpen ? "block" : "hidden")}>
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {isPending && <CommandLoading>{t('searchLoading')}</CommandLoading>}
              {!isPending && !results.length && query && <CommandEmpty>{t('searchNoResults')}</CommandEmpty>}
              {results.length > 0 && (
                 <CommandGroup heading={t('searchResults')}>
                    {results.map((emoji) => (
                      <CommandItem
                        key={emoji.id}
                        value={emoji.title}
                        onSelect={() => handleSelect(emoji.id)}
                        className="cursor-pointer"
                      >
                        <span className="mr-4 text-xl">{emoji.emoji}</span>
                        <span>{emoji.title}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
       </div>
    </div>
  );
}
