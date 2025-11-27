"use client";

import { useState, useEffect } from 'react';
import type { Emoji, EmojiFormatFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Download, FileType, HardDriveDownload, Image as ImageIcon, Film, FileArchive } from 'lucide-react';
import { downloadTimer } from '@/lib/data';

interface EmojiViewProps {
  emoji: Emoji;
}

export function EmojiView({ emoji }: EmojiViewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [downloading, setDownloading] = useState<{ url: string; timer: number } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(emoji.emoji);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (file: EmojiFormatFile) => {
    if (downloading) return;
    setDownloading({ url: file.url, timer: downloadTimer });
  };
  
  useEffect(() => {
    if (downloading && downloading.timer > 0) {
      const timeoutId = setTimeout(() => {
        setDownloading(d => d ? { ...d, timer: d.timer - 1 } : null);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else if (downloading && downloading.timer === 0) {
      const link = document.createElement('a');
      link.href = downloading.url;
      link.setAttribute('download', downloading.url.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
    }
  }, [downloading]);

  const formatTabs = Object.entries(emoji.formats)
    .filter(([, files]) => files.length > 0)
    .map(([format]) => format);

  const formatIcons: { [key: string]: React.ReactNode } = {
    png: <ImageIcon className="mr-2 h-4 w-4" />,
    gif: <Film className="mr-2 h-4 w-4" />,
    image: <FileType className="mr-2 h-4 w-4" />,
    video: <FileArchive className="mr-2 h-4 w-4" />,
  };

  return (
    <article>
        <div className="flex flex-col items-center text-center p-8 border rounded-lg bg-card shadow-sm">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tighter">{emoji.title}</h1>
            <div className="my-8 text-8xl md:text-9xl">{emoji.emoji}</div>
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
      
      {formatTabs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-headline font-semibold mb-4">Downloads</h2>
          <Tabs defaultValue={formatTabs[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(emoji.formats).map(([format, files]) =>
                files.length > 0 ? (
                    <TabsTrigger key={format} value={format} className="capitalize">
                      {formatIcons[format]} {format}
                    </TabsTrigger>
                ) : null
              )}
            </TabsList>
            {Object.entries(emoji.formats).map(([format, files]) =>
              files.length > 0 ? (
                <TabsContent key={format} value={format}>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                          <div className="flex items-center">
                            <HardDriveDownload className="h-5 w-5 mr-3 text-primary"/>
                            <div>
                                <p className="font-semibold">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownload(file)} 
                            disabled={!!downloading} 
                            className="w-40"
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
