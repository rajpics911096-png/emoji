
'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File as FileIcon, Hourglass, ArrowLeft, Video } from 'lucide-react';
import Image from 'next/image';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { useState, useEffect, useMemo } from 'react';
import type { EmojiFormatFile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdSlot } from '@/components/ad-slot';
import { useEmojiStore, useCategoryStore } from '@/lib/store';

const DownloadButton = ({ file }: { file: EmojiFormatFile }) => {
  const { settings } = useSiteSettings();
  const { t } = useTranslations();
  const [timer, setTimer] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isCountingDown && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isCountingDown && timer === 0) {
      handleDownload();
      setIsCountingDown(false);
    }
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCountingDown, timer, file]);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    const currentCount = parseInt(localStorage.getItem('downloadCount') || '0', 10);
    localStorage.setItem('downloadCount', (currentCount + 1).toString());
  };

  const startCountdown = () => {
    setTimer(settings.downloadTimer);
    setIsCountingDown(true);
  };

  return (
    <Button onClick={startCountdown} disabled={isCountingDown} className="w-full transition-all" size="lg">
      {isCountingDown ? (
        <>
          <Hourglass className="mr-2 h-5 w-5 animate-spin" />
          {t('downloadingIn', { seconds: timer.toString() })}
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" />
          {t('downloadButton')}
        </>
      )}
    </Button>
  );
};


const FilePreview = ({ file, format }: { file: EmojiFormatFile; format: string }) => {
    const isImage = ['png', 'gif', 'image'].includes(format) || file.type?.startsWith('image/');
    const isVideo = format === 'video' || file.type?.startsWith('video/');

    return (
      <div className="aspect-square w-full max-w-lg mx-auto bg-muted/50 flex items-center justify-center relative rounded-lg border overflow-hidden shadow-sm">
        {isImage ? (
            <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-4" unoptimized={file.format === 'gif'} />
        ) : isVideo ? (
            <video src={file.url} controls autoPlay muted loop className="w-full h-full object-contain" />
        ) : (
            <FileIcon className="w-24 h-24 text-muted-foreground" />
        )}
      </div>
    );
};


export default function FileDownloadPage() {
  const params = useParams<{ id: string; lang: string; format: string; filename: string }>();
  const { id, lang, format, filename } = params;
  
  const { t } = useTranslations();
  const { getEmojiById } = useEmojiStore();
  const { categories } = useCategoryStore();
  const emoji = getEmojiById(id);

  const file = useMemo(() => {
    if (!emoji) return null;
    const formatKey = format as keyof typeof emoji.formats;
    const files = emoji.formats[formatKey];
    if (!files) return null;
    return files.find(f => encodeURIComponent(f.name) === filename) || null;
  }, [emoji, format, filename]);


  if (!emoji || !file) {
    notFound();
  }

  const relatedFiles = useMemo(() => {
    return (Object.keys(emoji.formats) as (keyof typeof emoji.formats)[])
      .flatMap(fmt => 
        emoji.formats[fmt].map(f => ({ ...f, format: fmt }))
      )
      .filter(f => f.url !== file.url);
  }, [emoji.formats, file.url]);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
            <div className="mb-4">
                 <Button asChild variant="outline" className="text-muted-foreground hover:text-primary">
                    <Link href={`/${lang}/emoji/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {emoji.title}
                    </Link>
                 </Button>
            </div>
            
            <div className="flex flex-col items-center gap-4 text-center">
                 <h1 className="text-3xl font-headline font-bold">{file.name}</h1>
                <div className="w-full max-w-lg">
                  <FilePreview file={file} format={format} />
                </div>
                
                <div className="w-full max-w-lg text-center space-y-4">
                     <div className="flex items-center justify-center gap-4 text-muted-foreground">
                        <Badge variant="outline" className="capitalize">{format}</Badge>
                        <Badge variant="outline">{file.size}</Badge>
                    </div>
                    <DownloadButton file={file} />
                </div>
                
                <div className="my-4 w-full max-w-5xl">
                    <AdSlot location="below_download" />
                </div>

                <Separator className="my-2" />
                
                <div className="w-full max-w-5xl space-y-12">
                    {relatedFiles.length > 0 && (
                        <section>
                          <h2 className="text-2xl font-headline font-bold text-center mb-6">{t('relatedFilesTitle')}</h2>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                              {relatedFiles.map(relatedFile => (
                                  <Link key={relatedFile.url} href={`/${lang}/emoji/${id}/${relatedFile.format}/${encodeURIComponent(relatedFile.name)}`}>
                                      <Card className="group aspect-square flex items-center justify-center p-1 hover:bg-muted/50 transition-colors overflow-hidden">
                                         {relatedFile.type?.startsWith('video') ? (
                                              <video src={relatedFile.url} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                                          ) : (
                                              <Image src={relatedFile.url} alt={relatedFile.name} width={40} height={40} objectFit="contain" unoptimized={relatedFile.format === 'gif'} />
                                          )}
                                      </Card>
                                  </Link>
                              ))}
                          </div>
                        </section>
                    )}

                    <section>
                      <h2 className="text-2xl font-headline font-bold text-center mb-6">{t('exploreCategories')}</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((cat) => (
                          <Link key={cat.id} href={`/${lang}/emojis/${cat.id}`} className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted/50 transition-colors border">
                            <SvgIcon svg={cat.icon} className="w-8 h-8 text-primary" />
                            <p className="font-semibold text-sm text-center group-hover:text-primary transition-colors">{t(cat.name)}</p>
                          </Link>
                        ))}
                      </div>
                    </section>
                </div>
            </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
