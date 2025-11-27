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
import { categories } from '@/lib/data';
import { useSiteSettings } from '@/context/site-settings-context';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from '@/context/translations-context';

export default function Header({ lang }: { lang: string }) {
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const navItems = categories.filter(c => c.id !== 'all');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center md:hidden">
            <Sheet>
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
                <Link href={`/${lang}`} className="flex items-center space-x-2">
                <SvgIcon svg={settings.logo} className="h-6 w-6" />
                <span className="font-bold font-headline text-lg">{settings.name}</span>
                </Link>
                <div className="mt-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                    <Link
                    key={item.id}
                    href={`/${lang}/emojis/${item.id}`}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    >
                    {t(`category_${item.id}`)}
                    </Link>
                ))}
                </div>
            </SheetContent>
            </Sheet>
        </div>

        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <SvgIcon svg={settings.logo} className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              {settings.name}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/${lang}/emojis/${item.id}`}
                className="transition-colors hover:text-primary"
              >
                {t(`category_${item.id}`)}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex-1 flex justify-center md:hidden">
            <Link href={`/${lang}`} className="flex items-center space-x-2">
              <SvgIcon svg={settings.logo} className="h-6 w-6" />
              <span className="font-bold sm:inline-block font-headline text-lg">
                {settings.name}
              </span>
            </Link>
        </div>


        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
