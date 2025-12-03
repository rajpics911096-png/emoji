
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, File as FileIcon, Video } from 'lucide-react';
import type { EmojiFormatFile } from '@/lib/types';
import { useTranslations } from '@/context/translations-context';

interface UploadedFileCardProps {
  file: EmojiFormatFile;
  format: string;
  onRemove: (format: string, url: string) => void;
}

export function UploadedFileCard({ file, format, onRemove }: UploadedFileCardProps) {
    const { t } = useTranslations();
    const isImage = ['png', 'gif', 'image', 'jpeg', 'webp'].includes(file.type?.split('/')[1] || format);
    const isVideo = file.type?.startsWith('video/') || format === 'video';

    return (
        <Card className="relative group overflow-hidden">
            <CardContent className="p-0">
                 <div className="aspect-square bg-muted flex items-center justify-center">
                    {isImage ? (
                        <Image src={file.url} alt={file.name} width={100} height={100} className="w-full h-full object-contain p-1" />
                    ) : isVideo ? (
                        <Video className="w-8 h-8 text-muted-foreground" />
                    ) : (
                        <FileIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
                <div className="p-2">
                    <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
            </CardContent>
            <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(format, file.url)}
                aria-label={t('dialog_delete_button')}
            >
                <X className="h-4 w-4" />
            </Button>
        </Card>
    );
}
