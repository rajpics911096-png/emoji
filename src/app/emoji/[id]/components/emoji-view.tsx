
"use client";

import { useState, useEffect } from 'react';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Download, FileType, Grid } from 'lucide-react';
import { downloadTimer } from '@/lib/data';
import Image from 'next/image';
import { SvgIcon } from '@/components/svg-icon';
import { iconMap } from '@/lib/icon-map';


interface EmojiViewProps {
  emoji: Emoji;
}

export function EmojiView({ emoji }: EmojiViewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [downloading, setDownloading] = useState<{ url: string; timer: number } | null>(null);
  const [currentFile, setCurrentFile] = useState<EmojiFormatFile | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(emoji.emoji);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (file: EmojiFormatFile) => {
    if (downloading) return;
    setCurrentFile(file);
    setDownloading({ url: file.url, timer: downloadTimer });
  };
  
  useEffect(() => {
    if (downloading && downloading.timer > 0) {
      const timeoutId = setTimeout(() => {
        setDownloading(d => d ? { ...d, timer: d.timer - 1 } : null);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else if (downloading && downloading.timer === 0 && currentFile) {
      const link = document.createElement('a');
      link.href = downloading.url;
      link.setAttribute('download', currentFile.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
      setCurrentFile(null);
    }
  }, [downloading, currentFile]);

  const allFiles = Object.entries(emoji.formats).flatMap(([format, files]) => files.map(file => ({ ...file, format })));
  const formatTabs = Object.entries(emoji.formats)
    .filter(([, files]) => files.length > 0)
    .map(([format]) => format);
  
  const tabs = allFiles.length > 0 ? ['all', ...formatTabs] : [];

  const formatIcons: { [key: string]: React.ReactNode } = {
    all: <Grid className="mr-2 h-4 w-4" />,
    png: <SvgIcon svg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' className="mr-2 h-4 w-4" />,
    gif: <SvgIcon svg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h4"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M21 7.5h-4"/><path d="M21 12h-4"/><path d="M21 16.5h-4"/></svg>' className="mr-2 h-4 w-4" />,
    image: <FileType className="mr-2 h-4 w-4" />,
    video: <SvgIcon svg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>' className="mr-2 h-4 w-4" />,
  };
  
  const FilePreview = ({ file, format }: { file: EmojiFormatFile, format: string }) => {
    const formatType = format.split('/')[0];
    const isImage = formatType === 'png' || formatType === 'gif' || formatType === 'image';
    const isVideo = formatType === 'video';

    if (isImage || file.url.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
        return <Image src={file.url} alt={file.name} width={128} height={128} className="w-32 h-32 object-contain bg-secondary/50 rounded-md" />;
    }
    if (isVideo || file.url.match(/\.(mp4|webm)$/)) {
        return <video src={file.url} controls className="w-32 h-32 bg-secondary/50 rounded-md" />;
    }
    return <div className="w-32 h-32 flex items-center justify-center bg-secondary/50 rounded-md"><FileType className="w-12 h-12 text-muted-foreground" /></div>;
  };

  const FileCard = ({ file, format }: { file: EmojiFormatFile, format: string }) => (
    <div key={file.url} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-secondary/50 rounded-md gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <FilePreview file={file} format={format} />
        <div className="truncate">
          <p className="font-semibold truncate">{file.name}</p>
          <p className="text-sm text-muted-foreground">{file.size}</p>
        </div>
      </div>
      <Button 
        onClick={() => handleDownload(file)} 
        disabled={!!downloading} 
        className="w-full sm:w-40 flex-shrink-0"
      >
        {downloading && downloading.url === file.url ? (
            `Downloading in ${downloading.timer}s`
        ) : (
            <>
                <Download className="mr-2 h-4 w-4" /> Download
            </>
        )}
      </Button>
    </div>
  );

  return (
    <article>
        <div className="flex flex-col items-center text-center p-8 border rounded-lg bg-card shadow-sm">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">{emoji.title}</h1>
            <div className="my-8 text-8xl md:text-9xl break-words">{emoji.emoji}</div>
            <Button onClick={handleCopy} size="lg" className="w-48 transition-all">
                {isCopied ? (
                <>
                    <Check className="mr-2 h-5 w-5" /> Copied!
                </>
                ) : (
                <>
                    <Copy className="mr-2 h-5 w-5" /> Copy Emoji
                </>
                )}
            </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold mb-2">Description</h2>
        <p className="text-lg text-foreground/80 leading-relaxed">{emoji.description}</p>
      </div>
      
      {tabs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-headline font-semibold mb-4">Downloads</h2>
          <Tabs defaultValue={tabs[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="capitalize flex-1">
                    {formatIcons[tab]} {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
                <Card>
                    <CardContent className="p-4 sm:p-6 space-y-4">
                        {allFiles.map(file => (
                            <FileCard key={file.url} file={file} format={file.format} />
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
            {Object.entries(emoji.formats).map(([format, files]) =>
              files.length > 0 ? (
                <TabsContent key={format} value={format}>
                  <Card>
                    <CardContent className="p-4 sm:p-6 space-y-4">
                      {files.map((file) => (
                        <FileCard key={file.url} file={file} format={format} />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ) : null
            )}
          </Tabs>
        </div>
      )}
    </article>
  );
}

    