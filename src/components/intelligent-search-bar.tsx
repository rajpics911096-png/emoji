"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchEmojisAction } from "@/lib/actions";
import type { Emoji } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export default function IntelligentSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    router.push(`/emoji/${id}`);
  };

  return (
    <div className="relative">
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (query) {
             router.push(`/emojis/all?search=${query}`)
          }
        }}
      >
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for an emoji by name or keyword..."
              className="pl-10 h-12 text-base"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query && setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
        </div>
        <Button type="submit" size="lg" className="h-12">Search</Button>
      </form>
       <div className={cn("absolute top-full mt-2 w-full z-10", isOpen ? "block" : "hidden")}>
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {isPending && <CommandLoading>Searching...</CommandLoading>}
              {!isPending && !results.length && query && <CommandEmpty>No results found.</CommandEmpty>}
              {results.length > 0 && (
                 <CommandGroup heading="Results">
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
