
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import type { EmojiFormatFile } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';

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
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const initialFiles = allFiles.slice(0, itemsPerPage);
    setVisibleFiles(initialFiles);
    setPage(1);
    setHasMore(allFiles.length > itemsPerPage);
  }, [allFiles, itemsPerPage]);

  const loadMoreFiles = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
        const nextPage = page + 1;
        const newFiles = allFiles.slice(0, nextPage * itemsPerPage);
        
        setPage(nextPage);
        setVisibleFiles(newFiles);
        setHasMore(newFiles.length < allFiles.length);
        setIsLoading(false);
    }, 500); // Simulate network delay
  }, [page, isLoading, hasMore, allFiles, itemsPerPage]);
  
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

  return (
    <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {visibleFiles.map((file, index) => (
            <div key={`${file.url}-${index}`} ref={visibleFiles.length === index + 1 ? lastFileElementRef : null}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg h-full">
                    <CardContent className="p-3 flex flex-col h-full">
                        <Link
                        href={`/${lang}/emoji/${file.emojiId}/${file.format}/${encodeURIComponent(file.name)}`}
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
                        <Link href={`/${lang}/emoji/${file.emojiId}/${file.format}/${encodeURIComponent(file.name)}`}>
                            <Download className="mr-2 h-4 w-4" />
                            {t('downloadButton')}
                        </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        ))}
        </div>
        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading more...</p>
            </div>
        )}
    </div>
  );
}

