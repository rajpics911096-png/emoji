
'use client';

import Link from 'next/link';
import type { Emoji } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/context/translations-context';
import Image from 'next/image';
import { File } from 'lucide-react';

interface EmojiCardProps {
  emoji: Emoji;
  lang: string;
}

export function EmojiCard({ emoji, lang }: EmojiCardProps) {
  const { t } = useTranslations();
  const title = t(emoji.title);
  const isFilePost = !emoji.emoji;
  const linkUrl = isFilePost ? `/${lang}/file/${emoji.id}` : `/${lang}/emoji/${emoji.id}`;
  const featuredImage = Object.values(emoji.formats).flat()[0];

  return (
    <Link href={linkUrl} className="group">
      <Card className="h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
          <div className="text-6xl mb-3 aspect-square flex items-center justify-center">
            {isFilePost ? (
                featuredImage ? (
                    <Image src={featuredImage.url} alt={title} width={64} height={64} className="w-16 h-16 object-contain" loading="lazy" />
                ) : (
                    <File className="w-16 h-16 text-muted-foreground" />
                )
            ) : (
                <span className="text-6xl">{emoji.emoji}</span>
            )}
          </div>
          <h3 className="font-headline font-semibold text-base leading-tight truncate w-full" title={title}>
            {title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
