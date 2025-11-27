
'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { getEmojiById, categories } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { SvgIcon } from '@/components/svg-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File as FileIcon, Hourglass, ArrowLeft, Video } from 'lucide-react';
import Image from 'next/image';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { useState, useEffect, useMemo } from 'react';
import type { EmojiFormatFile } from '@/lib/types';

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
      <div className="aspect-square bg-muted flex items-center justify-center relative rounded-lg border overflow-hidden shadow-sm">
        {isImage ? (
            <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-4" />
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

  const category = categories.find(c => c.id === emoji.category);
  
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
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
            <div className="mb-8">
                 <Button asChild variant="outline">
                    <Link href={`/${lang}/emoji/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {emoji.title}
                    </Link>
                 </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div className="md:col-span-2">
                    <div className="space-y-4">
                        <FilePreview file={file} format={format} />
                        <div className="text-center">
                            <h1 className="text-3xl font-headline font-bold">{file.name}</h1>
                            <p className="text-muted-foreground">Part of the {emoji.title} collection</p>
                        </div>
                        <DownloadButton file={file} />
                    </div>
                </div>
                 <aside className="space-y-8">
                     {relatedFiles.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>{t('relatedFilesTitle', {defaultValue: 'Related Files'})}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {relatedFiles.map(relatedFile => (
                                    <Link key={relatedFile.url} href={`/${lang}/emoji/${id}/${relatedFile.format}/${encodeURIComponent(relatedFile.name)}`} target="_blank">
                                        <Card className="group aspect-square flex items-center justify-center p-1 hover:bg-muted/50 transition-colors">
                                           {relatedFile.format === 'video' ? (
                                                <Video className="w-6 h-6 text-muted-foreground" />
                                            ) : (
                                                <Image src={relatedFile.url} alt={relatedFile.name} width={40} height={40} objectFit="contain" />
                                            )}
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                     )}
                     {category && (
                        <Card>
                        <CardHeader>
                            <CardTitle>{t('categoryTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/${lang}/emojis/${category.id}`} className="group flex items-center gap-4">
                                <SvgIcon svg={category.icon} className="w-10 h-10 text-primary" />
                                <div>
                                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">{t(`category_${category.id}`)}</p>
                                    <p className="text-sm text-muted-foreground">{t('viewAllInCategory')}</p>
                                </div>
                            </Link>
                        </CardContent>
                        </Card>
                    )}
                </aside>
            </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
