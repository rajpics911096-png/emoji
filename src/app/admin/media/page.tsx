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
import { emojis } from '@/lib/data';
import type { EmojiFormatFile } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type MediaFile = EmojiFormatFile & { format: string; emojiId: string; dateAdded: number; };

const initialFiles: MediaFile[] = emojis.flatMap((emoji, emojiIndex) => 
    Object.entries(emoji.formats).flatMap(([format, files], formatIndex) => 
        files.map((file, fileIndex) => ({ 
            ...file, 
            format, 
            emojiId: emoji.id,
            dateAdded: Date.now() - (emojiIndex * 10000 + formatIndex * 1000 + fileIndex), // Simulate different added dates
        }))
    )
);

export default function MediaPage() {
    const { toast } = useToast();
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
        }));

        setMediaFiles(prevFiles => [...newFiles, ...prevFiles]);
        toast({
            title: "Files Uploaded",
            description: `${files.length} file(s) have been added to the library.`
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
        setSelectedFiles(selectedFiles.filter(url => url !== fileToRemove.url));
        if (fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        toast({
            title: "File Deleted",
            description: `"${fileToRemove.name}" has been deleted.`,
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
        const remainingFiles = mediaFiles.filter(file => !selectedFiles.includes(file.url));
        const filesToDelete = mediaFiles.filter(file => selectedFiles.includes(file.url));
        
        filesToDelete.forEach(file => {
            if (file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url);
            }
        });
        
        setMediaFiles(remainingFiles);
        
        toast({
            title: "Files Deleted",
            description: `${selectedFiles.length} file(s) have been deleted.`,
            variant: 'destructive'
        });

        setSelectedFiles([]);
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
    
    const isAllSelected = selectedFiles.length > 0 && selectedFiles.length === mediaFiles.length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Media Library</h1>
                    <p className="text-muted-foreground">Manage your uploaded files here.</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    {selectedFiles.length > 0 && (
                        <div className="flex items-center gap-2">
                             <Button size="sm" variant="destructive" className="gap-1" onClick={handleDeleteSelected}>
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Delete ({selectedFiles.length})</span>
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="select-all"
                            checked={selectedFiles.length > 0 && selectedFiles.length === mediaFiles.length}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                            className='hidden sm:flex'
                        />
                        <Label htmlFor='select-all' className='hidden sm:block text-sm font-medium'>
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                        </Label>
                    </div>
                     <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-1" asChild>
                        <label htmlFor="file-upload">
                            <Upload className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload File</span>
                        </label>
                    </Button>
                </div>
                <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
            </div>

            {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sortedMediaFiles.map((file, index) => (
                        <Card 
                            key={`${file.url}-${file.name}-${file.emojiId}-${index}`}
                            className="group relative cursor-pointer"
                            onClick={() => handleSelectFile(file.url)}
                            data-state={selectedFiles.includes(file.url) ? 'selected' : 'unselected'}
                        >
                            <div className="absolute top-2 left-2 z-10">
                                <Checkbox
                                    checked={selectedFiles.includes(file.url)}
                                    className="bg-background/50 hover:bg-background/80"
                                />
                            </div>
                            <FilePreview file={file} />
                            <CardContent className="p-3">
                                <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                            </CardContent>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
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
                            <div className="absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background transition-all"
                                style={{ opacity: selectedFiles.includes(file.url) ? 1 : 0 }}
                             />
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
