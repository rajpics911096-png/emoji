
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Upload, Copy, Download, Trash2, File as FileIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EmojiFormatFile } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from '@/context/translations-context';
import { useEmojiStore } from '@/lib/store';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useParams } from 'next/navigation';


type MediaFile = EmojiFormatFile & { format: string; emojiId: string; dateAdded: number; };

export default function MediaPage() {
    const { t } = useTranslations();
    const { toast } = useToast();
    const { emojis } = useEmojiStore();
    const params = useParams<{ lang: string }>();
    const lang = params.lang;

    const initialFiles: MediaFile[] = useMemo(() => emojis.flatMap((emoji, emojiIndex) => 
        Object.entries(emoji.formats).flatMap(([format, files], formatIndex) => 
            files.map((file, fileIndex) => ({ 
                ...file, 
                format, 
                emojiId: emoji.id,
                dateAdded: Date.now() - (emojiIndex * 10000 + formatIndex * 1000 + fileIndex), // Simulate different added dates
            }))
        )
    ), [emojis]);

    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialFiles);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState('newest');


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles: MediaFile[] = Array.from(files).map(file => ({
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            url: URL.createObjectURL(file),
            format: file.type.split('/')[0] || 'file',
            emojiId: 'local-upload',
            dateAdded: Date.now(),
            type: file.type
        }));

        setMediaFiles(prevFiles => [...newFiles, ...prevFiles]);
        toast({
            title: t('media_toast_files_uploaded_title'),
            description: t('media_toast_files_uploaded_desc', { count: files.length.toString() })
        })
    };
    
    const sortedMediaFiles = useMemo(() => {
        return [...mediaFiles].sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    return b.dateAdded - a.dateAdded;
                case 'oldest':
                    return a.dateAdded - b.dateAdded;
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }, [mediaFiles, sortOrder]);


    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(window.location.origin + url);
        toast({ title: t('media_toast_url_copied_title'), description: t('media_toast_url_copied_desc')});
    }

    const downloadFile = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const deleteFile = (fileToRemove: MediaFile) => {
        // This is a mock deletion. In a real app, you'd call an API.
        // And you'd need to update the emoji in the store to remove this file.
        setMediaFiles(mediaFiles.filter(file => file.url !== fileToRemove.url));
        setSelectedFiles(selectedFiles.filter(url => url !== fileToRemove.url));
        if (fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        toast({
            title: t('media_toast_file_deleted_title'),
            description: t('media_toast_file_deleted_desc', { name: fileToRemove.name }),
            variant: 'destructive'
        });
    }

    const handleSelectFile = (url: string) => {
        setSelectedFiles(prev => 
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    };

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedFiles(mediaFiles.map(file => file.url));
        } else {
            setSelectedFiles([]);
        }
    }

    const handleDeleteSelected = () => {
        // Mock deletion
        const remainingFiles = mediaFiles.filter(file => !selectedFiles.includes(file.url));
        const filesToDelete = mediaFiles.filter(file => selectedFiles.includes(file.url));
        
        filesToDelete.forEach(file => {
            if (file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url);
            }
        });
        
        setMediaFiles(remainingFiles);
        
        toast({
            title: t('media_toast_files_deleted_title'),
            description: t('media_toast_files_deleted_desc', { count: selectedFiles.length.toString() }),
            variant: 'destructive'
        });

        setSelectedFiles([]);
    }

    const FilePreview = ({ file }: { file: MediaFile }) => {
        const isImage = ['png', 'gif', 'image', 'jpeg', 'webp'].includes(file.format) || file.type?.startsWith('image');
        const isVideo = file.format === 'video' || file.type?.startsWith('video');

        return (
            <div className="aspect-square bg-muted flex items-center justify-center relative rounded-t-lg overflow-hidden">
                {isImage ? (
                    <Image src={file.url} alt={file.name} layout="fill" objectFit="contain" className="p-1" />
                ) : isVideo ? (
                    <video src={file.url} controls muted className="w-full h-full object-contain" />
                ) : (
                    <FileIcon className="w-16 h-16 text-muted-foreground" />
                )}
            </div>
        );
    };
    
    const isAllSelected = selectedFiles.length > 0 && selectedFiles.length === mediaFiles.length;

    return (
        <>
        <Header lang={lang} />
        <main className="flex-1 container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-headline font-bold">{t('media_title')}</h1>
                    <p className="text-muted-foreground">{t('media_description')}</p>
                </div>
            </div>

            {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sortedMediaFiles.map((file, index) => (
                        <Card 
                            key={`${file.url}-${file.name}-${file.emojiId}-${index}`}
                            className="group relative"
                        >
                            <FilePreview file={file} />
                            <CardContent className="p-3">
                                <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                                 <Button asChild size="sm" className="w-full mt-2">
                                     <a href={file.url} download={file.name}>
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('downloadButton')}
                                    </a>
                                 </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-xl text-muted-foreground">{t('media_empty_library_title')}</p>
                    <p className="text-muted-foreground">{t('media_empty_library_desc')}</p>
                </div>
            )}
        </main>
        <Footer lang={lang} />
        </>
    );
}
