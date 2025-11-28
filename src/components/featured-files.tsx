
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { EmojiFormatFile } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';

type FeaturedFile = EmojiFormatFile & {
    emojiId: string;
    format: string;
};

interface FeaturedFilesProps {
  files: FeaturedFile[];
  lang: string;
}

export function FeaturedFiles({ files, lang }: FeaturedFilesProps) {
  const { t } = useTranslations();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {files.map((file) => (
        <Card key={`${file.emojiId}-${file.name}`} className="group overflow-hidden transition-shadow hover:shadow-lg">
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
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
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
      ))}
    </div>
  );
}
