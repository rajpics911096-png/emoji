
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Emoji } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';

interface FeaturedFilesProps {
  posts: Emoji[];
  lang: string;
}

export function FeaturedFiles({ posts, lang }: FeaturedFilesProps) {
  const { t } = useTranslations();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {posts.map((post) => {
        const allFiles = (Object.entries(post.formats) as [keyof Emoji['formats'], any[]][])
          .flatMap(([format, files]) => files.map(file => ({ ...file, format })));

        const firstFile = allFiles[0];
        const totalFiles = allFiles.length;
        
        const availableFormats = [...new Set(allFiles.map(f => f.format))].map(f => f.toUpperCase());
        const formatsString = availableFormats.join(', ');

        return (
          <Link
            key={post.id}
            href={`/${lang}/emoji/${post.id}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
              {/* Stacked card effect */}
              <div className="absolute inset-0 bg-card rounded-xl transform -translate-x-2 -translate-y-2 group-hover:-translate-x-3 group-hover:-translate-y-3 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-card/80 rounded-xl transform -translate-x-1 -translate-y-1 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300"></div>
              
              <Card className="relative w-full h-full overflow-hidden transition-shadow group-hover:shadow-lg">
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
            </div>
          </Link>
        );
      })}
    </div>
  );
}
