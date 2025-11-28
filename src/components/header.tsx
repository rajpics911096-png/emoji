
"use client";

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Menu,
} from 'lucide-react';
import { SvgIcon } from './svg-icon';
import { useSiteSettings } from '@/context/site-settings-context';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from '@/context/translations-context';
import { useState } from 'react';
import { AdSlot } from '@/components/ad-slot';
import { useCategoryStore } from '@/lib/store';
import IntelligentSearchBar from './intelligent-search-bar';

export default function Header({ lang }: { lang: string }) {
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navCategories = categories.filter(c => c.id !== 'all').slice(0, 5);

  return (
    <>
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center">
        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                >
                <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <Link href={`/${lang}`} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <SvgIcon svg={settings.logo} className="h-6 w-6" />
                <span className="font-bold font-headline text-lg">{settings.name}</span>
                </Link>
                <div className="mt-6 flex flex-col space-y-4">
                  {navCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${lang}/emojis/${category.id}`}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(category.name)}
                    </Link>
                  ))}
                </div>
            </SheetContent>
            </Sheet>
        </div>

        <div className="mr-4 hidden md:flex items-center">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <SvgIcon svg={settings.logo} className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              {settings.name}
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center md:justify-start">
            <div className="w-full max-w-lg">
              <IntelligentSearchBar lang={lang} />
            </div>
        </div>


        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
    <AdSlot location="header" />
    </>
  );
}
