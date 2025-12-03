
'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';
import { EmojiCard } from '@/components/emoji-card';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { useMemo, useEffect, useState } from 'react';
import type { EmojiFormatFile } from '@/lib/types';
import Head from 'next/head';
import { InfiniteFileScroller } from '@/components/infinite-file-scroller';


type FileItem = EmojiFormatFile & {
    emojiId: string;
    format: string;
    displayName: string;
};

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export default function CategoryPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ category: string, lang: string }>();
  const { category: categorySlug, lang } = params;

  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const { emojis, getEmojisByCategory } = useEmojiStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const category = useMemo(() => {
      return categories.find((cat) => cat.id === categorySlug);
  }, [categories, categorySlug]);


  if (!category && categorySlug !== 'all') {
    notFound();
  }

  const isSearchPage = categorySlug === 'all' && searchTerm;

  const emojiList = useMemo(() => {
    const allEmojis = getEmojisByCategory('all').filter(e => e.emoji); // Only emoji posts
    if (!isSearchPage) {
        if (categorySlug === 'all') return allEmojis;
        return allEmojis.filter(emoji => emoji.category === categorySlug);
    }
    
    if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        return allEmojis.filter(emoji => 
            t(emoji.title).toLowerCase().includes(lowercasedQuery) ||
            t(emoji.description).toLowerCase().includes(lowercasedQuery)
        );
    }
    
    return allEmojis;
  }, [getEmojisByCategory, categorySlug, searchTerm, t, isSearchPage]);


  const allFoundFiles: FileItem[] = useMemo(() => {
    if (!searchTerm) return [];
    
    const lowercasedQuery = searchTerm.toLowerCase();
    
    const matchingEmojis = emojis.filter(emoji => 
        t(emoji.title).toLowerCase().includes(lowercasedQuery) ||
        t(emoji.description).toLowerCase().includes(lowercasedQuery)
    );

    const filesFromMatchingEmojis = matchingEmojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
                displayName: t(emoji.title),
            }))
        )
    );
    
    const filesWithNameMatch = emojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files
                .filter(file => file.name.toLowerCase().includes(lowercasedQuery))
                .map(file => ({
                    ...file,
                    emojiId: emoji.id,
                    format: format,
                    displayName: t(emoji.title),
                }))
        )
    );

    const combined = [...filesFromMatchingEmojis, ...filesWithNameMatch];
    const uniqueFiles = Array.from(new Map(combined.map(file => [file.url, file])).values());

    return shuffleArray(uniqueFiles);

  }, [emojis, searchTerm, t]);
  
  const totalResults = emojiList.length + allFoundFiles.length;
  
  const pageTitle = useMemo(() => {
    if (!isSearchPage) {
        return t(category?.name || 'category_all');
    }
    const foundFormats = new Set<string>();
    allFoundFiles.forEach(file => {
        if (file.format === 'png') foundFormats.add('PNG');
        if (file.format === 'gif') foundFormats.add('GIF');
        if (file.format === 'image' && !file.type?.includes('png') && !file.type?.includes('gif')) foundFormats.add('Images');
        if (file.format === 'video') foundFormats.add('Video');
    });
    
    const formatsString = Array.from(foundFormats).join(', ');
    
    let title = `${totalResults} "${searchTerm}" ${formatsString}`;
    if (!foundFormats.has('Images') && allFoundFiles.some(f => f.format === 'image')) {
        title += ' Images';
    }
    
    return title.trim();

  }, [isSearchPage, t, category, totalResults, searchTerm, allFoundFiles]);

  const pageDescription = useMemo(() => {
    if (!isSearchPage) {
      return t('categoryDescription', { categoryName: t(category?.name || 'category_all') });
    }
    const fileTypes = new Set<string>();
    allFoundFiles.forEach(f => fileTypes.add(f.format));
    const formatTypes = Array.from(fileTypes).join(', ').toUpperCase();
    const emojiNames = emojiList.slice(0, 3).map(e => t(e.title)).join(', ');
    
    let description = `Discover and download ${totalResults}+ free "${searchTerm}" emoji files. Find high-quality ${formatTypes} for your creative projects.`;
    if (emojiNames) {
        description += ` Explore emojis like ${emojiNames}.`;
    }
    return description.slice(0, 160); // Cap at 160 characters for meta descriptions
  }, [isSearchPage, t, category, totalResults, searchTerm, allFoundFiles, emojiList]);


  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
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
            <section id="emoji-results" className="mb-12">
                <h2 className="text-2xl font-headline font-bold text-center mb-6">Emoji Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {emojiList.map((emoji) => (
                    <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
                    ))}
                </div>
            </section>
        )}
        
        {allFoundFiles.length > 0 && (
             <section id="file-results" className="mt-12 md:mt-16">
                <h2 className="text-2xl font-headline font-bold text-center mb-6">
                    File Results
                </h2>
                <InfiniteFileScroller allFiles={allFoundFiles} lang={lang} />
            </section>
        )}


        {emojiList.length === 0 && allFoundFiles.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm || '' })}</p>
          </div>
        )}
      </main>
    </>
  );
}
