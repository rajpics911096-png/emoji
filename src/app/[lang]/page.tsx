
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmojiCard } from '@/components/emoji-card';
import { Card, CardContent } from '@/components/ui/card';
import { SvgIcon } from '@/components/svg-icon';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { FeaturedFiles } from '@/components/featured-files';
import { useMemo, useState, useEffect } from 'react';
import type { EmojiFormatFile } from '@/lib/types';
import { InfiniteFileScroller } from '@/components/infinite-file-scroller';

type FileItem = EmojiFormatFile & {
    emojiId: string;
    format: string;
    displayName: string;
};

export default function Home() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const { emojis } = useEmojiStore();
  const { categories } = useCategoryStore();
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  const featuredEmojis = useMemo(() => {
    // Show emojis that actually have an emoji character
    return [...emojis].filter(e => e.emoji).sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [emojis]);
  
  useEffect(() => {
    if (emojis.length === 0) return;
    
    // Feature files from posts that are primarily file-based (no emoji character)
    const filePosts = emojis.filter(emoji => !emoji.emoji);
    const randomFeaturedPosts = [...filePosts].sort(() => 0.5 - Math.random()).slice(0, 8);
    setFeaturedPosts(randomFeaturedPosts);

  }, [emojis]);


  const sortedCategories = useMemo(() => {
    const allCategory = categories.find(c => c.id === 'all');
    const otherCategories = categories.filter(c => c.id !== 'all').sort((a, b) => t(a.name).localeCompare(t(b.name)));
    return allCategory ? [allCategory, ...otherCategories] : otherCategories;
  }, [categories, t]);

  const allFiles: FileItem[] = useMemo(() => {
    const files = emojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
                displayName: t(emoji.title),
            }))
        )
    );
    return files.sort(() => 0.5 - Math.random());
  }, [emojis, t]);


  return (
      <main className="flex-1">
        
        <section className="relative py-12 md:py-16 bg-primary/10">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tighter">
              {t('welcomeMessage', { siteName: settings.name })}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
              {t('siteDescription')}
            </p>
            
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

        <section id="categories" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">
              {t('exploreCategories')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/${lang}/emojis/${category.id}`}>
                  <Card className="group transform hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-xl h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <SvgIcon svg={category.icon} className="w-14 h-14 mb-3 text-primary transition-colors group-hover:text-accent-foreground" />
                      <h3 className="text-base font-headline font-semibold leading-tight">
                        {t(category.name)}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredEmojis.length > 0 && (
          <section id="featured" className="py-12 md:py-16 bg-primary/5">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                {t('featuredEmojis')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {featuredEmojis.map((emoji) => (
                  <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
                ))}
              </div>
               <div className="text-center mt-8">
                <Button asChild variant="outline">
                    <Link href={`/${lang}/emojis/all`}>
                        Read More
                    </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {featuredPosts.length > 0 && (
          <section id="featured-files" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-headline font-bold text-center mb-10">
                Featured Files
              </h2>
              <FeaturedFiles posts={featuredPosts} lang={lang} />
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                    <Link href={`/${lang}/media`}>
                        Read More
                    </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section id="latest-media" className="py-12 md:py-16 bg-primary/5">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-headline font-bold text-center mb-10">
                    {t('media_title')}
                </h2>
                <InfiniteFileScroller allFiles={allFiles} lang={lang} />
            </div>
        </section>

      </main>
  );
}
