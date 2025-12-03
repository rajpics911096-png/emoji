
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import type { EmojiFormatFile } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


type FileItem = EmojiFormatFile & {
    emojiId: string;
    format: string;
    displayName: string;
};

interface InfiniteFileScrollerProps {
  allFiles: FileItem[];
  lang: string;
  itemsPerPage?: number;
}

export function InfiniteFileScroller({ allFiles, lang, itemsPerPage = 12 }: InfiniteFileScrollerProps) {
  const { t } = useTranslations();
  const [visibleFiles, setVisibleFiles] = useState<FileItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const observer = useRef<IntersectionObserver | null>(null);

  const filteredFiles = useMemo(() => {
    if (filter === 'all') {
      return allFiles;
    }
    return allFiles.filter(file => {
        if (filter === 'images') return file.format === 'image' && !file.type?.includes('png') && !file.type?.includes('gif');
        if (filter === 'videos') return file.format === 'video';
        return file.format === filter;
    });
  }, [allFiles, filter]);

  useEffect(() => {
    const initialFiles = filteredFiles.slice(0, itemsPerPage);
    setVisibleFiles(initialFiles);
    setPage(1);
    setHasMore(filteredFiles.length > itemsPerPage);
  }, [filteredFiles, itemsPerPage]);

  const loadMoreFiles = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
        const nextPage = page + 1;
        const newFiles = filteredFiles.slice(0, nextPage * itemsPerPage);
        
        setPage(nextPage);
        setVisibleFiles(newFiles);
        setHasMore(newFiles.length < filteredFiles.length);
        setIsLoading(false);
    }, 500); // Simulate network delay
  }, [page, isLoading, hasMore, filteredFiles, itemsPerPage]);
  
  const lastFileElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            loadMoreFiles();
        }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreFiles]);
  
  const fileTypes = useMemo(() => {
    const types = new Set(['all']);
    allFiles.forEach(file => {
        if (file.format === 'png') types.add('png');
        if (file.format === 'gif') types.add('gif');
        const otherImages = file.format === 'image' && !['image/png', 'image/gif'].includes(file.type || '');
        if (otherImages) types.add('images');
        if (file.format === 'video') types.add('videos');
    });
    return Array.from(types);
  }, [allFiles]);

  return (
    <div>
        <div className="flex justify-center mb-8">
            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="bg-background border rounded-full p-1 h-auto flex-wrap justify-center">
                    {fileTypes.map(format => (
                    <TabsTrigger 
                        key={format} 
                        value={format}
                        className="capitalize rounded-full text-sm font-semibold h-auto px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                    >
                        {t(`downloadsTab${format.charAt(0).toUpperCase() + format.slice(1)}`)}
                    </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {visibleFiles.map((file, index) => {
            const downloadUrl = `/${lang}/${file.format}/${encodeURIComponent(file.name)}`;
            return (
            <div key={`${file.url}-${index}`} ref={visibleFiles.length === index + 1 ? lastFileElementRef : null}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg h-full">
                    <CardContent className="p-3 flex flex-col h-full">
                        <Link
                        href={downloadUrl}
                        className="flex-grow"
                        >
                        <div className="aspect-square bg-muted flex items-center justify-center relative rounded-md overflow-hidden mb-3">
                            {file.type?.startsWith('video/') ? (
                            <video src={file.url} autoPlay muted loop playsInline className="w-full h-full object-contain" />
                            ) : (
                            <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-2" unoptimized={file.format === 'gif'} />
                            )}
                        </div>
                        <p className="text-sm font-medium truncate" title={file.displayName}>
                            {file.displayName}
                        </p>
                        </Link>
                        <Button asChild size="sm" className="w-full mt-2">
                        <Link href={downloadUrl}>
                            <Download className="mr-2 h-4 w-4" />
                            {t('downloadButton')}
                        </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )})}
        </div>
        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading more...</p>
            </div>
        )}
        {!isLoading && !hasMore && visibleFiles.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end!</p>
            </div>
        )}
         {visibleFiles.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
                <p>No files found for this filter.</p>
            </div>
        )}
    </div>
  );
}
