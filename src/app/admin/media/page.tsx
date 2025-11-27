"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Upload, Copy, Download, Trash2, File as FileIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { emojis } from '@/lib/data';
import type { EmojiFormatFile } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type MediaFile = EmojiFormatFile & { format: string; emojiId: string; };

const initialFiles: MediaFile[] = emojis.flatMap(emoji => 
    Object.entries(emoji.formats).flatMap(([format, files]) => 
        files.map(file => ({ ...file, format, emojiId: emoji.id }))
    )
);

export default function MediaPage() {
    const { toast } = useToast();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialFiles);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles: MediaFile[] = Array.from(files).map(file => ({
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            url: URL.createObjectURL(file),
            format: file.type.split('/')[0] || 'file',
            emojiId: 'local-upload'
        }));

        setMediaFiles(prevFiles => [...newFiles, ...prevFiles]);
        toast({
            title: "Files Uploaded",
            description: `${files.length} file(s) have been added to the library.`
        })
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(window.location.origin + url);
        toast({ title: "URL Copied", description: "The file URL has been copied to your clipboard."});
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
        setMediaFiles(mediaFiles.filter(file => file.url !== fileToRemove.url));
        if (fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        toast({
            title: "File Deleted",
            description: `"${fileToRemove.name}" has been deleted.`,
            variant: 'destructive'
        });
    }

    const FilePreview = ({ file }: { file: MediaFile }) => {
        const isImage = ['png', 'gif', 'image', 'jpeg', 'webp'].includes(file.format) || file.url.startsWith('blob:image');
        const isVideo = file.format === 'video' || file.url.startsWith('blob:video');

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

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Media Library</h1>
                    <p className="text-muted-foreground">Manage your uploaded files here.</p>
                </div>
                <Button size="sm" className="gap-1" asChild>
                    <label htmlFor="file-upload">
                        <Upload className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload File</span>
                    </label>
                </Button>
                <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
            </div>

            {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {mediaFiles.map((file, index) => (
                        <Card key={`${index}-${file.name}`} className="group relative">
                            <FilePreview file={file} />
                            <CardContent className="p-3">
                                <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                            </CardContent>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-7 w-7">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => copyToClipboard(file.url)}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            <span>Copy URL</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => downloadFile(file.url, file.name)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            <span>Download</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => deleteFile(file)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-xl text-muted-foreground">Your media library is empty.</p>
                    <p className="text-muted-foreground">Upload some files to get started!</p>
                </div>
            )}
        </div>
    );
}