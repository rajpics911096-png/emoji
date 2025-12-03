
'use client';

import { notFound, useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { EmojiCard } from '@/components/emoji-card';
import { useTranslations } from '@/context/translations-context';
import { useCategoryStore, useEmojiStore } from '@/lib/store';
import { useMemo, useEffect, useState } from 'react';
import { FeaturedFiles } from '@/components/featured-files';
import type { EmojiFormatFile, Emoji } from '@/lib/types';
import Head from 'next/head';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


type FeaturedFile = EmojiFormatFile & {
    emojiId: string;
    format: string;
    emojiTitle: string;
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
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ category: string, lang: string }>();
  const { category: categorySlug, lang } = params;

  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const { emojis, getEmojisByCategory } = useEmojiStore();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedFormat = searchParams.get('format') || 'all';

  
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
  const isFileSearch = searchTerm === 'files';

  const emojiList = useMemo(() => {
    if (isFileSearch) return [];
    if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        const categoryEmojis = categorySlug === 'all' ? emojis : getEmojisByCategory(categorySlug);
        return categoryEmojis.filter(emoji => 
            emoji.emoji && // Ensure it's an emoji post
            (t(emoji.title).toLowerCase().includes(lowercasedQuery) ||
            t(emoji.description).toLowerCase().includes(lowercasedQuery))
        );
    }
    return getEmojisByCategory(categorySlug).filter(e => e.emoji);
  }, [getEmojisByCategory, emojis, categorySlug, searchTerm, t, isFileSearch]);


  const allFoundFiles: (EmojiFormatFile & { emojiId: string; format: string; emojiTitle: string })[] = useMemo(() => {
    if (!searchTerm) return [];
    
    const lowercasedQuery = searchTerm.toLowerCase();
    
    const emojisToSearch = isFileSearch ? emojis.filter(e => !e.emoji) : emojis;

    const matchingEmojis = emojisToSearch.filter(emoji => 
        t(emoji.title).toLowerCase().includes(lowercasedQuery) ||
        t(emoji.description).toLowerCase().includes(lowercasedQuery)
    );

    const filesFromMatchingEmojis = matchingEmojis.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files.map(file => ({
                ...file,
                emojiId: emoji.id,
                format: format,
                emojiTitle: t(emoji.title),
            }))
        )
    );
    
    const filesWithNameMatch = emojisToSearch.flatMap(emoji =>
        Object.entries(emoji.formats).flatMap(([format, files]) =>
            files
                .filter(file => file.name.toLowerCase().includes(lowercasedQuery))
                .map(file => ({
                    ...file,
                    emojiId: emoji.id,
                    format: format,
                    emojiTitle: t(emoji.title),
                }))
        )
    );

    const combined = isFileSearch ? filesFromMatchingEmojis.concat(filesWithNameMatch) : [...filesFromMatchingEmojis, ...filesWithNameMatch];
    const uniqueFiles = Array.from(new Map(combined.map(file => [file.url, file])).values());

    return shuffleArray(uniqueFiles);

  }, [emojis, searchTerm, t, isFileSearch]);
  
  const allFoundPosts: Emoji[] = useMemo(() => {
     if (!searchTerm) return [];

     if (isFileSearch) {
       return emojis.filter(e => !e.emoji);
     }

     const fileIds = new Set(allFoundFiles.map(f => f.emojiId));
     return emojis.filter(emoji => fileIds.has(emoji.id) && !emoji.emoji); // Only file posts in file results
  },[allFoundFiles, emojis, isFileSearch, searchTerm]);


  const fileTypes = useMemo(() => {
    const types = new Set<string>(['all']);
    allFoundFiles.forEach(file => {
        if (file.format === 'png') types.add('png');
        else if (file.format === 'gif') types.add('gif');
        else if (file.format === 'image') types.add('images');
        else if (file.format === 'video') types.add('videos');
    });
    return Array.from(types);
  }, [allFoundFiles]);
  

  const featuredPosts = useMemo(() => {
    let filtered = allFoundPosts;
    if (selectedFormat !== 'all') {
        const emojiIdsWithFormat = new Set(allFoundFiles.filter(file => {
             switch (selectedFormat) {
                case 'png': return file.format === 'png';
                case 'gif': return file.format === 'gif';
                case 'images': return file.format === 'image' && !file.type?.includes('png') && !file.type?.includes('gif');
                case 'videos': return file.format === 'video';
                default: return true;
            }
        }).map(f => f.emojiId));
        filtered = allFoundPosts.filter(post => emojiIdsWithFormat.has(post.id));
    }
    return filtered;
  }, [allFoundFiles, allFoundPosts, selectedFormat]);
  
  const totalResults = emojiList.length + allFoundFiles.length;
  
  const pageTitle = useMemo(() => {
    if (isFileSearch) {
        return "All File Posts"
    }
    if (!isSearchPage) {
        return t(category?.name || 'category_all');
    }
    const foundFormats = new Set<string>();
    allFoundFiles.forEach(file => {
        if (file.format === 'png') foundFormats.add('PNG');
        if (file.format === 'gif') foundFormats.add('GIF');
        if (file.format === 'image') foundFormats.add('Images');
        if (file.format === 'video') foundFormats.add('Video');
    });
    
    let formatsString = Array.from(foundFormats).join(', ');
    if (selectedFormat !== 'all') {
        formatsString = selectedFormat.toUpperCase();
    }
    
    return `${totalResults} "${searchTerm}" ${formatsString}`;
  }, [isSearchPage, t, category, totalResults, searchTerm, allFoundFiles, selectedFormat, isFileSearch]);

  const pageDescription = useMemo(() => {
    if (isFileSearch) {
        return "Browse all available file posts and downloadable content.";
    }
    if (!isSearchPage) {
      return t('categoryDescription', { categoryName: t(category?.name || 'category_all') });
    }
    const formatTypes = fileTypes.filter(f => f !== 'all').join(', ').toUpperCase();
    const emojiNames = emojiList.slice(0, 3).map(e => t(e.title)).join(', ');
    
    let description = `Discover and download ${totalResults}+ free "${searchTerm}" emoji files. Find high-quality ${formatTypes} for your creative projects.`;
    if (emojiNames) {
        description += ` Explore emojis like ${emojiNames}.`;
    }
    return description.slice(0, 160); // Cap at 160 characters for meta descriptions
  }, [isSearchPage, t, category, totalResults, searchTerm, fileTypes, emojiList, isFileSearch]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === 'all') {
      params.delete('format');
    } else {
      params.set('format', value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };


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
                <h2 className="text-2xl font-headline font-bold mb-6">Emoji Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {emojiList.map((emoji) => (
                    <EmojiCard key={emoji.id} emoji={emoji} lang={lang} />
                    ))}
                </div>
            </section>
        )}
        
        {featuredPosts.length > 0 && (
             <section id="file-results" className="mt-12 md:mt-16">
                <h2 className="text-2xl font-headline font-bold text-center md:text-left mb-6">
                    File Results
                </h2>
                <FeaturedFiles posts={featuredPosts} lang={lang} />
            </section>
        )}


        {emojiList.length === 0 && featuredPosts.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('categoryNoResults', { searchTerm: searchTerm || '' })}</p>
          </div>
        )}
      </main>
    </>
  );
}
