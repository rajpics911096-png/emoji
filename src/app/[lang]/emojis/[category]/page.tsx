
'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';
import { EmojiCard } from '@/components/emoji-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { useMemo } from 'react';
import { FeaturedFiles } from '@/components/featured-files';
import type { EmojiFormatFile } from '@/lib/types';

type FeaturedFile = EmojiFormatFile & {
    emojiId: string;
    format: string;
    emojiTitle: string;
};


export default function CategoryPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ category: string, lang: string }>();
  const { category: categorySlug, lang } = params;

  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const { emojis, getEmojisByCategory } = useEmojiStore();
  
  const category = categories.find((c) => c.id === categorySlug);
  if (!category) {
    notFound();
  }

  const categoryName = t(category.name);

  const searchTerm = searchParams.get('search');
  
  const emojiList = useMemo(() => {
    let categoryEmojis = getEmojisByCategory(categorySlug);
    if (searchTerm) {
        return categoryEmojis.filter(emoji => 
            emoji.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return categoryEmojis;
  }, [getEmojisByCategory, categorySlug, searchTerm]);

  const featuredFiles = useMemo(() => {
    if (!searchTerm) {
      return [];
    }

    const allFiles: FeaturedFile[] = emojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
                emojiTitle: emoji.title,
            }))
        )
    );

    const lowercasedQuery = searchTerm.toLowerCase();
    return allFiles.filter(file => 
        file.name.toLowerCase().includes(lowercasedQuery) ||
        file.emojiTitle.toLowerCase().includes(lowercasedQuery)
    ).slice(0, 8); // Limit to 8 results for display

  }, [emojis, searchTerm]);


  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 container mx-auto py-8 px-4">
        
        <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
                {categoryName}
            </h1>
            <p className="mt-3 text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                {t('categoryDescription', { categoryName: categoryName })}
            </p>
        </div>
        
        {emojiList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {emojiList.map((emoji) => (
              <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm || '' })}</p>
          </div>
        )}

        {featuredFiles.length > 0 && (
            <section id="featured-files" className="mt-16 md:mt-24">
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
