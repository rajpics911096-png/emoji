

"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File as FileIcon, Hourglass } from 'lucide-react';
import Image from 'next/image';
import { useSiteSettings } from '@/context/site-settings-context';
import { useTranslations } from '@/context/translations-context';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


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
    
    // Increment download count in local storage
    const currentCount = parseInt(localStorage.getItem('downloadCount') || '0', 10);
    localStorage.setItem('downloadCount', (currentCount + 1).toString());
  };

  const startCountdown = () => {
    setTimer(settings.downloadTimer);
    setIsCountingDown(true);
  };

  return (
    <Button onClick={startCountdown} disabled={isCountingDown} className="w-full transition-all">
      {isCountingDown ? (
        <>
          <Hourglass className="mr-2 h-4 w-4 animate-spin" />
          {t('downloadingIn', { seconds: timer.toString() })}
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {t('downloadButton')}
        </>
      )}
    </Button>
  );
};


const FilePreview = ({ file, format }: { file: EmojiFormatFile; format: string }) => {
    const isImage = ['png', 'gif', 'image'].includes(format);
    const isVideo = format === 'video';

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square bg-muted flex items-center justify-center relative">
            {isImage ? (
                <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-2" />
            ) : isVideo ? (
                <video src={file.url} controls className="w-full h-full object-contain" />
            ) : (
                <FileIcon className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          <div className="p-4 space-y-2">
            <p className="font-mono text-xs truncate" title={file.name}>{file.name}</p>
            <DownloadButton file={file} />
          </div>
        </CardContent>
      </Card>
    );
};


export function EmojiDownloads({ emoji }: { emoji: Emoji }) {
  const { formats } = emoji;
  const { t } = useTranslations();

  const allFiles = useMemo(() => {
    return (Object.keys(formats) as (keyof typeof formats)[]).flatMap(format => 
        formats[format].map(file => ({ ...file, format }))
    );
  }, [formats]);

  const tabs = [
    { value: 'all', label: t('downloadsTabAll'), files: allFiles },
    { value: 'png', label: 'PNG', files: formats.png.map(f => ({...f, format: 'png'})) },
    { value: 'gif', label: 'GIF', files: formats.gif.map(f => ({...f, format: 'gif'})) },
    { value: 'image', label: t('downloadsTabImages'), files: formats.image.map(f => ({...f, format: 'image'})) },
    { value: 'video', label: t('downloadsTabVideos'), files: formats.video.map(f => ({...f, format: 'video'})) },
  ].filter(tab => tab.files.length > 0);

  if (allFiles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 md:mt-24">
      <h2 className="text-3xl font-headline font-bold text-center mb-10">
        {t('downloadsTitle')}
      </h2>
      <Tabs defaultValue={tabs[0].value}>
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-auto p-1.5 bg-transparent justify-start w-auto mx-auto mb-8">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/80"
                  )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {tab.files.map((file, index) => (
                    <FilePreview key={`${tab.value}-${index}`} file={file} format={file.format} />
                ))}
                </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
