
'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { SvgIcon } from '@/components/svg-icon';
import { Button } from '@/components/ui/button';
import { Download, File as FileIcon, Hourglass, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { useState, useEffect, useMemo } from 'react';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdSlot } from '@/components/ad-slot';
import { useEmojiStore, useCategoryStore } from '@/lib/store';
import { SocialShareButtons } from '@/components/social-share-buttons';
import { InfiniteFileScroller } from '@/components/infinite-file-scroller';
import { FeaturedFiles } from '@/components/featured-files';

const DownloadButton = ({ file, format, emojiId }: { file: EmojiFormatFile, format: string, emojiId: string }) => {
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

    // Update total download count
    const currentTotalCount = parseInt(localStorage.getItem('downloadCount') || '0', 10);
    localStorage.setItem('downloadCount', (currentTotalCount + 1).toString());

    // Update individual file download count
    const fileDownloads = JSON.parse(localStorage.getItem('fileDownloads') || '{}');
    const fileId = `${emojiId}-${file.name}`;
    fileDownloads[fileId] = (fileDownloads[fileId] || 0) + 1;
    localStorage.setItem('fileDownloads', JSON.stringify(fileDownloads));
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
          {t('downloadButtonWithFormat', { format: format.toUpperCase() })}
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
            <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-4" unoptimized={format === 'gif'} />
        ) : isVideo ? (
            <video src={file.url} autoPlay muted loop className="w-full h-full object-contain" />
        ) : (
            <FileIcon className="w-24 h-24 text-muted-foreground" />
        )}
      </div>
    );
};


export default function FileDownloadPage() {
  const params = useParams<{ id: string; lang: string; format: string; filename: string; }>();
  const { id, lang, format, filename } = params;
  
  const { t } = useTranslations();
  const { emojis, getEmojiById, getRelatedEmojis } = useEmojiStore();
  const emoji = getEmojiById(id);
  const [pageUrl, setPageUrl] = useState('');
  
  const relatedEmojis = useMemo(() => {
    if (!emoji) return [];
    return getRelatedEmojis(emoji.id);
  }, [emoji, getRelatedEmojis]);

  const relatedFiles = useMemo(() => {
     return relatedEmojis.flatMap(relatedEmoji => 
        Object.entries(relatedEmoji.formats).flatMap(([format, files]) => 
            files.map(file => ({
                ...file,
                emojiId: relatedEmoji.id,
                format: format,
                displayName: t(relatedEmoji.title),
            }))
        )
    ).sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [relatedEmojis, t]);


  const allOtherFiles = useMemo(() => {
    const relatedIds = new Set(relatedEmojis.map(e => e.id));
    relatedIds.add(id); // also exclude current emoji's files

    return emojis
      .filter(e => !relatedIds.has(e.id))
      .flatMap(otherEmoji => 
        Object.entries(otherEmoji.formats).flatMap(([format, files]) => 
            files.map(file => ({
                ...file,
                emojiId: otherEmoji.id,
                format: format,
                displayName: t(otherEmoji.title)
            }))
        )
      ).sort(() => 0.5 - Math.random());
  }, [emojis, relatedEmojis, id, t]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setPageUrl(window.location.href);
    }
  }, []);

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

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
            
            <div className="mb-4">
                 <Button asChild variant="outline" className="text-muted-foreground hover:text-primary">
                    <Link href={`/${lang}/emoji/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {t(emoji.title)}
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
                    <DownloadButton file={file} format={format} emojiId={emoji.id} />
                    <SocialShareButtons url={pageUrl} title={`Download ${file.name}`} />
                </div>
                
                <div className="my-4 w-full max-w-5xl">
                    <AdSlot location="below_download" />
                </div>

                <Separator className="my-8" />
                
                <div className="w-full max-w-5xl space-y-12">
                    {relatedFiles.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold text-center mb-6">{t('relatedFilesTitle')}</h2>
                            <FeaturedFiles files={relatedFiles} lang={lang} />
                        </section>
                    )}

                    {allOtherFiles.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold text-center mb-6">Explore More Files</h2>
                            <InfiniteFileScroller allFiles={allOtherFiles} lang={lang} />
                        </section>
                    )}
                </div>
            </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
