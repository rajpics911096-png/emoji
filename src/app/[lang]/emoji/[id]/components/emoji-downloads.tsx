
"use client";

import { useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Emoji } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Video, File, Download } from 'lucide-react';
import { useTranslations } from '@/context/translations-context';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdSlot } from '@/components/ad-slot';
import { Badge } from '@/components/ui/badge';

export function EmojiDownloads({ emoji, lang }: { emoji: Emoji, lang: string }) {
  const { formats } = emoji;
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const selectedFormat = searchParams.get('format') || 'all';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
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

  if (fileTypes.length <= 1 && filteredFiles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16">
       <h2 className="text-3xl font-headline font-bold text-center mb-4">
        {t('downloadsTitle')}
      </h2>
      <Tabs defaultValue={selectedFormat} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-center mb-8">
            <TabsList className="bg-background border rounded-full p-1 h-auto flex-wrap">
                {fileTypes.map(format => (
                <TabsTrigger 
                    key={format} 
                    value={format}
                    className="capitalize rounded-full text-sm font-semibold h-auto px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                >
                    {t(`downloadsTab${format.charAt(0).toUpperCase() + format.slice(1)}`)}
                </TabsTrigger>
                ))}
            </TabsList>
        </div>
        <TabsContent value={selectedFormat}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredFiles.flatMap((file, index) => {
              const downloadUrl = `/${lang}/download/${emoji.id}/${encodeURIComponent(file.name)}`;
              const fileCard = (
                <Link href={downloadUrl} key={`${file.url}-${index}`} className="group block">
                    <Card className="overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
                        <div className="aspect-square bg-muted flex items-center justify-center relative">
                            {file.format === 'video' || file.type?.startsWith('video/') ? (
                                <video src={file.url} autoPlay muted loop playsInline className="w-full h-full object-contain" />
                            ) : (
                                <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-2" unoptimized={file.format === 'gif'}/>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-2 left-2 right-2 text-white p-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-xs font-bold truncate">{file.name}</p>
                            </div>
                             <Badge variant="secondary" className="absolute top-2 right-2 opacity-80 text-xs">
                                {file.type?.split('/')[1]?.toUpperCase() || file.format.toUpperCase()}
                             </Badge>
                        </div>
                    </Card>
                </Link>
              );

              if ((index + 1) % 4 === 0 && index !== filteredFiles.length - 1) {
                return [fileCard, <AdSlot key={`ad-${index}`} location="in_download_grid" className="flex items-center justify-center rounded-lg bg-muted aspect-square" />];
              }
              return fileCard;
            })}
            </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
