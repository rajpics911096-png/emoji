
"use client";

import { useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Emoji } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Video } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { AdSlot } from '@/components/ad-slot';

export function EmojiDownloads({ emoji, lang }: { emoji: Emoji, lang: string }) {
  const { formats } = emoji;
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const selectedFormat = searchParams.get('format') || 'all';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('format');
    } else {
      params.set('format', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const fileTypes = useMemo(() => {
    const types = new Set(['all']);
    if (formats.png.length > 0) types.add('png');
    if (formats.gif.length > 0) types.add('gif');
    const otherImages = formats.image.filter(f => !['image/png', 'image/gif'].includes(f.type || ''));
    if (otherImages.length > 0) types.add('images');
    if (formats.video.length > 0) types.add('videos');
    return Array.from(types);
  }, [formats]);

  const filteredFiles = useMemo(() => {
    switch (selectedFormat) {
      case 'png':
        return formats.png.map(f => ({ ...f, format: 'png' }));
      case 'gif':
        return formats.gif.map(f => ({ ...f, format: 'gif' }));
      case 'images':
        return formats.image.filter(f => !['image/png', 'image/gif'].includes(f.type || '')).map(f => ({...f, format: 'image'}));
      case 'videos':
        return formats.video.map(f => ({ ...f, format: 'video' }));
      default:
        return (Object.keys(formats) as (keyof typeof formats)[])
          .flatMap(format => formats[format].map(file => ({ ...file, format })));
    }
  }, [formats, selectedFormat]);

  if (fileTypes.length <= 1) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16">
      <Tabs defaultValue={selectedFormat} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-center mb-8">
            <TabsList className="bg-background border rounded-full p-1.5 h-auto flex-wrap">
                {fileTypes.map(format => (
                <TabsTrigger 
                    key={format} 
                    value={format}
                    className="capitalize rounded-full text-sm font-semibold h-auto px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                    {t(`downloadsTab${format.charAt(0).toUpperCase() + format.slice(1)}`)}
                </TabsTrigger>
                ))}
            </TabsList>
        </div>
        <TabsContent value={selectedFormat}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredFiles.flatMap((file, index) => {
              const fileCard = (
                <Card key={`${file.url}-${index}`} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-3 flex flex-col h-full">
                        <Link 
                            href={`/${lang}/emoji/${emoji.id}/${file.format}/${encodeURIComponent(file.name)}`}
                            className="flex-grow"
                        >
                            <div className="aspect-square bg-muted flex items-center justify-center relative rounded-md overflow-hidden mb-3">
                                {file.format === 'video' || file.type?.startsWith('video/') ? (
                                    <video src={file.url} autoPlay muted loop playsInline className="w-full h-full object-contain" />
                                ) : (
                                    <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-2" unoptimized={file.format === 'gif'}/>
                                )}
                            </div>
                            <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                        </Link>
                         <Button asChild size="sm" className="w-full mt-2">
                             <Link href={`/${lang}/emoji/${emoji.id}/${file.format}/${encodeURIComponent(file.name)}`}>
                                <Download className="mr-2 h-4 w-4" />
                                {t('downloadButton')}
                            </Link>
                         </Button>
                    </CardContent>
                </Card>
              );

              if ((index + 1) % 2 === 0) {
                return [fileCard, <AdSlot key={`ad-${index}`} location="in_download_grid" className="flex items-center justify-center" />];
              }
              return fileCard;
            })}
            </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
