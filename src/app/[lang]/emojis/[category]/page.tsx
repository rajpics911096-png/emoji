
'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';
import { EmojiCard } from '@/components/emoji-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { useMemo, useEffect, useState } from 'react';
import { FeaturedFiles } from '@/components/featured-files';
import type { EmojiFormatFile } from '@/lib/types';
import Head from 'next/head';

type FeaturedFile = EmojiFormatFile & {
    emojiId: string;
    format: string;
    emojiTitle: string;
    displayName: string;
};


export default function CategoryPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ category: string, lang: string }>();
  const { category: categorySlug, lang } = params;

  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const { emojis, getEmojisByCategory } = useEmojiStore();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const category = categories.find((c) => c.id === categorySlug);
  
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  if (!category && categorySlug !== 'all') {
    notFound();
  }

  const isSearchPage = categorySlug === 'all' && searchTerm;
  const pageTitle = isSearchPage 
    ? `Search results for "${searchTerm}"`
    : t(category?.name || 'category_all');
  const pageDescription = isSearchPage
    ? `Found results for your query: "${searchTerm}"`
    : t('categoryDescription', { categoryName: t(category?.name || 'category_all') });


  const emojiList = useMemo(() => {
    if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        const categoryEmojis = categorySlug === 'all' ? emojis : getEmojisByCategory(categorySlug);
        return categoryEmojis.filter(emoji => 
            t(emoji.title).toLowerCase().includes(lowercasedQuery) ||
            t(emoji.description).toLowerCase().includes(lowercasedQuery)
        );
    }
    return getEmojisByCategory(categorySlug);
  }, [getEmojisByCategory, emojis, categorySlug, searchTerm, t]);

  const featuredFiles = useMemo(() => {
    if (!searchTerm) {
      return [];
    }

    const allFiles: (EmojiFormatFile & { emojiId: string; format: string; emojiTitle: string })[] = emojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
                emojiTitle: t(emoji.title),
            }))
        )
    );

    const lowercasedQuery = searchTerm.toLowerCase();
    const filteredFiles = allFiles.filter(file => 
        file.name.toLowerCase().includes(lowercasedQuery) ||
        file.emojiTitle.toLowerCase().includes(lowercasedQuery)
    );
    
    return filteredFiles.map((file, index) => {
        let formatName = file.format.toUpperCase();
        if (file.format === 'image') {
            const extension = file.name.split('.').pop()?.toUpperCase();
            formatName = extension || formatName;
        } else if (file.format === 'video') {
            formatName = 'Video';
        }
        
        return {
            ...file,
            displayName: `${index + 1}. "${searchTerm}" ${formatName}`,
        };
    }).slice(0, 12);

  }, [emojis, searchTerm, t]);


  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <Header lang={lang} />
      <main className="flex-1 container mx-auto py-8 px-4">
        
        <div className="text-center mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
                {pageTitle}
            </h1>
            <p className="mt-3 text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                {pageDescription}
            </p>
        </div>
        
        {emojiList.length > 0 && (
            <section id="emoji-results">
                {isSearchPage && <h2 className="text-2xl font-headline font-bold mb-6">Emoji Results</h2>}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {emojiList.map((emoji) => (
                    <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
                    ))}
                </div>
            </section>
        )}

        {featuredFiles.length > 0 && (
            <section id="featured-files" className="mt-12 md:mt-16">
                <h2 className="text-2xl font-headline font-bold text-center md:text-left mb-6">
                    File Results
                </h2>
                <FeaturedFiles files={featuredFiles} lang={lang} />
            </section>
        )}

        {emojiList.length === 0 && featuredFiles.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm || '' })}</p>
          </div>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
