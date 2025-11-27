
'use client';

import { notFound } from 'next/navigation';
import { categories, getEmojisByCategory } from '@/lib/data';
import { EmojiCard } from '@/components/emoji-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import IntelligentSearchBar from '@/components/intelligent-search-bar';
import { useTranslations } from '@/context/translations-context';

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { t } = useTranslations();
  // Note: generateStaticParams is server-side, so we can't use the hook there.
  // We find the category client-side to get the translated name if needed,
  // though category.name is used directly from data which is not translated yet.
  // For full dynamic translation of categories, they would also need to be in the translation file.
  const category = categories.find((c) => c.id === params.category);
  if (!category) {
    notFound();
  }

  let emojiList = getEmojisByCategory(params.category);
  const searchTerm = searchParams?.search as string;

  if (searchTerm) {
    emojiList = emojiList.filter(emoji => 
        emoji.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">
                {category.name}
            </h1>
            <p className="mt-3 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
                {t('categoryDescription', { categoryName: category.name })}
            </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-12">
            <IntelligentSearchBar />
        </div>
        
        {emojiList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {emojiList.map((emoji) => (
              <EmojiCard key={emoji.id} emoji={emoji} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm })}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
