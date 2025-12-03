
'use client';

import { notFound, useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { EmojiView } from '@/app/[lang]/emoji/[id]/components/emoji-view';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiDownloads } from '@/app/[lang]/emoji/[id]/components/emoji-downloads';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTranslations } from '@/context/translations-context';
import { useSiteSettings } from '@/context/site-settings-context';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';
import type { Thing, WithContext } from 'schema-dts';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { FeaturedFiles } from '@/components/featured-files';
import { EmojiCard } from '@/components/emoji-card';
import type { Emoji } from '@/lib/types';
import { Loader } from 'lucide-react';


const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export default function FilePostPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  
  const { emojis, getEmojiById, getRelatedEmojis } = useEmojiStore();
  const { categories } = useCategoryStore();
  const emoji = getEmojiById(id);

  const effectRan = useRef(false);
  const { t } = useTranslations();
  const { settings } = useSiteSettings();
  
  const [visiblePosts, setVisiblePosts] = useState<Emoji[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();
  
  const itemsPerPage = 8;
  
  const shuffledFilePosts = useMemo(() => {
    if (!emojis || !emoji) return [];
    const filePosts = emojis.filter(p => !p.emoji && p.id !== emoji.id);
    return shuffleArray(filePosts);
  }, [emojis, emoji]);
  
  useEffect(() => {
    setVisiblePosts(shuffledFilePosts.slice(0, itemsPerPage));
    setPage(1);
    setHasMore(shuffledFilePosts.length > itemsPerPage);
  }, [shuffledFilePosts]);
  
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
        const nextPage = page + 1;
        const newPosts = shuffledFilePosts.slice(0, nextPage * itemsPerPage);
        
        setPage(nextPage);
        setVisiblePosts(newPosts);
        setHasMore(newPosts.length < shuffledFilePosts.length);
        setIsLoading(false);
    }, 500);
  }, [page, isLoading, hasMore, shuffledFilePosts, itemsPerPage]);

  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            loadMorePosts();
        }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);



  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && effectRan.current) return;
    if (emoji) {
      const views = JSON.parse(localStorage.getItem('emojiViews') || '{}');
      views[emoji.id] = (views[emoji.id] || emoji.views || 0) + 1;
      localStorage.setItem('emojiViews', JSON.stringify(views));
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        effectRan.current = true;
      }
    };
  }, [emoji]);
  
  if (!emoji || emoji.emoji) { // Only show file posts
    notFound();
  }

  const emojiTitle = t(emoji.title);
  const rawDescription = t(emoji.description);
  const emojiDescription = rawDescription.includes('<p>') ? rawDescription : `<p>${rawDescription}</p>`;


  const jsonLdData: WithContext<Thing> = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const emojiImage = Object.values(emoji.formats).flat()[0];

    return {
        '@context': 'https://schema.org',
        '@type': 'Thing',
        name: emoji.metaTitle || emojiTitle,
        description: emoji.metaDescription || emojiDescription.replace(/<[^>]+>/g, ''),
        image: emojiImage ? `${baseUrl}${emojiImage.url}` : undefined,
        url: `${baseUrl}/${lang}/file/${emoji.id}`,
    };
  }, [emoji, lang, emojiTitle, emojiDescription]);


  const category = categories.find(c => c.id === emoji.category);
  const related = getRelatedEmojis(emoji.id);

  const metaTitle = emoji.metaTitle || emojiTitle;
  const metaDescription = emoji.metaDescription || emojiDescription.replace(/<[^>]+>/g, '').substring(0, 160);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
      </Head>
      <JsonLd data={jsonLdData} />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <EmojiView emoji={emoji} />
                <div className="my-6">
                  <AdSlot location="below_emoji" />
                </div>
                <EmojiDownloads emoji={emoji} lang={lang} />
            </div>
            <aside className="space-y-6">
              <AdSlot location="sidebar" />
              <div className="space-y-4">
                <h3 className="font-headline text-2xl font-semibold text-primary">
                  {t('descriptionTitle')}
                </h3>
                <div className="prose dark:prose-invert max-w-none text-foreground/80 break-words overflow-hidden" dangerouslySetInnerHTML={{ __html: emojiDescription }} />
              </div>

              {category && category.id !== 'uncategorized' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('categoryTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/${lang}/emojis/${category.id}`} className="group flex items-center gap-4">
                        <SvgIcon svg={category.icon} className="w-10 h-10 text-primary" />
                        <div>
                            <p className="font-semibold text-lg group-hover:text-primary transition-colors">{t(`category_${category.id.replace(/-/g, '_')}`)}</p>
                            <p className="text-sm text-muted-foreground">{t('viewAllInCategory')}</p>
                        </div>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
          
          <div className="my-6">
            <AdSlot location="below_download" />
          </div>

          {related.length > 0 && (
            <section className="mt-12 md:mt-16">
              <h2 className="text-3xl font-headline font-bold text-center mb-8">
                {t('relatedEmojisTitle')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {related.map((relatedEmoji) => (
                  <EmojiCard key={relatedEmoji.id} emoji={relatedEmoji} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {visiblePosts.length > 0 && (
            <section id="featured-files" className="mt-12 md:mt-16">
                <div className="container mx-auto px-4">
                <h2 className="text-3xl font-headline font-bold text-center mb-8">
                    Featured Files
                </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {visiblePosts.map((post, index) => {
                       const isLastElement = index === visiblePosts.length - 1;
                       return (
                          <div key={post.id} ref={isLastElement ? lastPostElementRef : null}>
                            <FeaturedFiles posts={[post]} lang={lang} />
                          </div>
                       );
                   })}
                </div>
                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <Loader className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-2 text-muted-foreground">Loading more...</p>
                    </div>
                )}
                </div>
            </section>
            )}
             <section className="mt-12 md:mt-16">
                <h2 className="text-3xl font-headline font-bold text-center mb-8">
                    {t('exploreCategories')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {categories.filter(c => c.id !== 'all' && c.id !== 'uncategorized').map((category) => (
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
            </section>
        </div>
      </main>
    </>
  );
}

    

    