
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';
import { cn } from '@/lib/utils';

interface FeaturedFilesProps {
  posts: Emoji[];
  lang: string;
}

export function FeaturedFiles({ posts, lang }: FeaturedFilesProps) {
  const { t } = useTranslations();
  const linkPrefix = "/file";
  const [fileDownloads, setFileDownloads] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
        const storedDownloads = localStorage.getItem('fileDownloads');
        if (storedDownloads) {
            setFileDownloads(JSON.parse(storedDownloads));
        }
    } catch (e) {
        console.error("Failed to parse fileDownloads from localStorage", e);
    }
  }, []);

  if (!posts || posts.length === 0) {
    return null;
  }

  const PostCard = ({ post, className }: { post: Emoji, className?: string }) => {
    const allFiles = useMemo(() => (Object.entries(post.formats) as [keyof Emoji['formats'], any[]][])
      .flatMap(([format, files]) => files.map(file => ({ ...file, format, downloadCount: fileDownloads[`${post.id}-${file.name}`] || 0 }))),
      [post, fileDownloads]
    );

    const featuredFile = useMemo(() => {
        if (allFiles.length === 0) return null;
        
        return allFiles.sort((a, b) => b.downloadCount - a.downloadCount)[0];
    }, [allFiles]);

    const totalFiles = allFiles.length;

    const availableFormats = [...new Set(allFiles.map(f => {
        if (!f.format) return null;
        if (f.format === 'image' && f.type?.includes('png')) return 'PNG';
        if (f.format === 'image' && f.type?.includes('gif')) return 'GIF';
        if (f.format === 'image') return 'IMAGE';
        return f.format.toUpperCase();
    }).filter(Boolean))];

    const formatsString = availableFormats.join(', ');
    const isVideo = featuredFile?.type?.startsWith('video/') || featuredFile?.format === 'video';

    return (
      <Link
        href={`/${lang}${linkPrefix}/${post.id}`}
        className={cn("group block relative overflow-hidden rounded-xl", className)}
      >
        <Card className="w-full h-full transition-shadow duration-300 group-hover:shadow-2xl">
            <div className="aspect-[4/3] w-full h-full bg-muted">
            {featuredFile?.url && (
                isVideo ? (
                    <video 
                        src={featuredFile.url} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <Image 
                        src={featuredFile.url} 
                        alt={t(post.title)} 
                        layout="fill" 
                        objectFit="cover" 
                        className="transition-transform duration-300 group-hover:scale-105"
                        unoptimized={featuredFile.format === 'gif'}
                    />
                )
            )}
            </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </Card>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-headline font-bold text-lg leading-tight truncate">{t(post.title)}</h3>
          <p className="text-sm text-white/80">{`${totalFiles} Files (${formatsString})`}</p>
        </div>
      </Link>
    );
  };

  const firstPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {firstPost && <PostCard post={firstPost} className="md:col-span-1" />}
        {remainingPosts.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
                {remainingPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        )}
    </div>
  );
}
