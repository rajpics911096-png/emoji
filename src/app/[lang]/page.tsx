
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmojiCard } from '@/components/emoji-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import IntelligentSearchBar from '@/components/intelligent-search-bar';
import { Card, CardContent } from '@/components/ui/card';
import { SvgIcon } from '@/components/svg-icon';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { FeaturedFiles } from '@/components/featured-files';
import { useMemo } from 'react';

export default function Home() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const { emojis } = useEmojiStore();
  const { categories } = useCategoryStore();
  
  const featuredEmojis = useMemo(() => {
    return [...emojis].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [emojis]);
  
  const allFiles = useMemo(() => {
    return emojis.flatMap(emoji => 
        Object.entries(emoji.formats).flatMap(([format, files]) => 
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
            }))
        )
    );
  }, [emojis]);
  
  const featuredFiles = useMemo(() => {
      return [...allFiles].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [allFiles]);

  const sortedCategories = useMemo(() => {
    const allCategory = categories.find(c => c.id === 'all');
    const otherCategories = categories.filter(c => c.id !== 'all').sort((a, b) => t(a.name).localeCompare(t(b.name)));
    return allCategory ? [allCategory, ...otherCategories] : otherCategories;
  }, [categories, t]);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="md:hidden p-4 border-b">
          <IntelligentSearchBar lang={lang} />
        </div>
        <section className="relative py-20 md:py-32 bg-primary/10">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tighter">
              {t('welcomeMessage', { siteName: settings.name })}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
              {t('siteDescription')}
            </p>
            <div className="mt-8 max-w-2xl mx-auto hidden md:block">
              <IntelligentSearchBar lang={lang} />
            </div>
            <div className="mt-6">
              <Button asChild size="lg" className="font-bold group">
                <Link href={`/${lang}/emojis/all`}>
                  {t('browseEmojis')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="categories" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">
              {t('exploreCategories')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 text-center">
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/${lang}/emojis/${category.id}`}>
                  <Card className="group transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-xl">
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <SvgIcon svg={category.icon} className="w-12 h-12 mb-4 text-primary transition-colors group-hover:text-accent-foreground" />
                      <h3 className="text-lg font-headline font-semibold">
                        {t(category.name)}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="featured" className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">
              {t('featuredEmojis')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {featuredEmojis.map((emoji) => (
                <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
              ))}
            </div>
          </div>
        </section>

        {featuredFiles.length > 0 && (
          <section id="featured-files" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                Featured Files
              </h2>
              <FeaturedFiles files={featuredFiles} lang={lang} />
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
