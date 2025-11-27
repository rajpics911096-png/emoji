
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import type { Emoji } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Video } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function EmojiDownloads({ emoji, lang }: { emoji: Emoji, lang: string }) {
  const { formats } = emoji;
  const { t } = useTranslations();

  const allFiles = useMemo(() => {
    return (Object.keys(formats) as (keyof typeof formats)[]).flatMap(format => 
        formats[format].map(file => ({ ...file, format }))
    );
  }, [formats]);

  if (allFiles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-20">
      <h2 className="text-3xl font-headline font-bold text-center mb-8">
        {t('downloadsTitle')}
      </h2>
      <ScrollArea>
        <div className="grid grid-flow-col auto-cols-max gap-4 pb-4">
          {allFiles.map((file, index) => (
            <Link 
                key={`${file.url}-${index}`} 
                href={`/${lang}/emoji/${emoji.id}/${file.format}/${encodeURIComponent(file.name)}`}
                target="_blank"
                className="w-40"
            >
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center relative">
                    {file.format === 'video' || file.type?.startsWith('video/') ? (
                        <Video className="w-12 h-12 text-muted-foreground" />
                    ) : (
                        <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-2" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}


    