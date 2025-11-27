
'use client';

import { notFound } from 'next/navigation';
import { categories, getEmojisByCategory } from '@/lib/data';
import { EmojiCard } from '@/components/emoji-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import IntelligentSearchBar from '@/components/intelligent-search-bar';
import { useTranslations } from '@/context/translations-context';
import { use } from 'react';

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string, lang: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { category: categorySlug, lang } = use(Promise.resolve(params));
  const { t } = useTranslations();
  const category = categories.find((c) => c.id === categorySlug);
  if (!category) {
    notFound();
  }

  const categoryName = t(`category_${category.id}`);

  let emojiList = getEmojisByCategory(categorySlug);
  const searchTerm = searchParams?.search as string;

  if (searchTerm) {
    emojiList = emojiList.filter(emoji => 
        emoji.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
                {categoryName}
            </h1>
            <p className="mt-3 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
                {t('categoryDescription', { categoryName: categoryName })}
            </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-12">
            <IntelligentSearchBar lang={lang} />
        </div>
        
        {emojiList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {emojiList.map((emoji) => (
              <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm })}</p>
          </div>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
