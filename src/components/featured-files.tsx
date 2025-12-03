
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Emoji } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';
import { cn } from '@/lib/utils';

interface FeaturedFilesProps {
  posts: Emoji[];
  lang: string;
}

export function FeaturedFiles({ posts, lang }: FeaturedFilesProps) {
  const { t } = useTranslations();
  const linkPrefix = "/file";

  if (!posts || posts.length === 0) {
    return null;
  }

  const PostCard = ({ post, className }: { post: Emoji, className?: string }) => {
    const allFiles = (Object.entries(post.formats) as [keyof Emoji['formats'], any[]][])
      .flatMap(([format, files]) => files.map(file => ({ ...file, format })));

    const firstFile = allFiles[0];
    const totalFiles = allFiles.length;

    const availableFormats = [...new Set(allFiles.map(f => {
        if (!f.format) return null;
        if (f.format === 'image' && f.type?.includes('png')) return 'PNG';
        if (f.format === 'image' && f.type?.includes('gif')) return 'GIF';
        if (f.format === 'image') return 'IMAGE';
        return f.format.toUpperCase();
    }).filter(Boolean))];

    const formatsString = availableFormats.join(', ');


    return (
      <Link
        href={`/${lang}${linkPrefix}/${post.id}`}
        className={cn("group block relative overflow-hidden rounded-xl", className)}
      >
        <Card className="w-full h-full transition-shadow duration-300 group-hover:shadow-2xl">
          {firstFile?.url && (
            <Image 
              src={firstFile.url} 
              alt={t(post.title)} 
              layout="fill" 
              objectFit="cover" 
              className="transition-transform duration-300 group-hover:scale-110"
              unoptimized={firstFile.format === 'gif'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </Card>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-headline font-bold text-lg leading-tight truncate">{t(post.title)}</h3>
          <p className="text-sm text-white/80">{`${totalFiles} Files (${formatsString})`}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[600px]">
        {posts[0] && (
            <div className="md:col-span-2 md:row-span-2">
                <PostCard post={posts[0]} className="h-full" />
            </div>
        )}
        {posts[1] && (
            <div className="md:col-span-2">
                 <PostCard post={posts[1]} className="h-full" />
            </div>
        )}
        {posts[2] && (
            <div className="md:col-span-1">
                 <PostCard post={posts[2]} className="h-full" />
            </div>
        )}
        {posts[3] && (
            <div className="md:col-span-1">
                 <PostCard post={posts[3]} className="h-full" />
            </div>
        )}
    </div>
  );
}
