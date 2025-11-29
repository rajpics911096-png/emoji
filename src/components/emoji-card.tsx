
'use client';

import Link from 'next/link';
import type { Emoji } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/context/translations-context';

interface EmojiCardProps {
  emoji: Emoji;
  lang: string;
}

export function EmojiCard({ emoji, lang }: EmojiCardProps) {
  const { t } = useTranslations();
  const title = t(emoji.title);
  
  return (
    <Link href={`/${lang}/emoji/${emoji.id}`} className="group">
      <Card className="h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-3">{emoji.emoji}</div>
          <h3 className="font-headline font-semibold text-base leading-tight truncate w-full" title={title}>
            {title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
