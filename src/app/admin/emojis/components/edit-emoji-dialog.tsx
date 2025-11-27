"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { categories } from "@/lib/data";
import type { Emoji, EmojiFormatFile } from "@/lib/types";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { FileType } from 'lucide-react';


const fileSchema = z.custom<FileList>().optional();

const emojiSchema = z.object({
  emoji: z.string().min(1, "Emoji character is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  png: fileSchema,
  gif: fileSchema,
  image: fileSchema,
  video: fileSchema,
});

type EmojiFormData = z.infer<typeof emojiSchema>;

interface EditEmojiDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditEmoji: (emoji: Emoji) => void;
  emoji: Emoji;
}

export function EditEmojiDialog({ isOpen, onOpenChange, onEditEmoji, emoji: initialEmoji }: EditEmojiDialogProps) {
  const [emoji, setEmoji] = useState<Emoji>(initialEmoji);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmojiFormData>({
    resolver: zodResolver(emojiSchema),
    defaultValues: {
      emoji: emoji.emoji,
      title: emoji.title,
      description: emoji.description,
      category: emoji.category,
    },
  });

  useEffect(() => {
    setEmoji(initialEmoji);
    reset({
      emoji: initialEmoji.emoji,
      title: initialEmoji.title,
      description: initialEmoji.description,
      category: initialEmoji.category,
    });
  }, [initialEmoji, reset]);

  const onSubmit = (data: EmojiFormData) => {
    const updatedFormats = { ...emoji.formats };
    
    const processFiles = (files: FileList | undefined, format: keyof typeof updatedFormats) => {
        if (files && files.length > 0) {
            if(!updatedFormats[format]) {
              updatedFormats[format] = [];
            }
            Array.from(files).forEach(file => {
                updatedFormats[format].push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
            });
        }
    }

    processFiles(data.png, 'png');
    processFiles(data.gif, 'gif');
    processFiles(data.image, 'image');
    processFiles(data.video, 'video');
    
    onEditEmoji({ ...emoji, ...data, formats: updatedFormats });
    onOpenChange(false);
  };
  
  const handleRemoveFile = (format: keyof Emoji['formats'], index: number) => {
    const updatedEmoji = { ...emoji };
    const fileToRemove = updatedEmoji.formats[format][index];
    if (fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    updatedEmoji.formats[format].splice(index, 1);
    setEmoji(updatedEmoji);
  }

  const dialogCategories = categories.filter(c => c.id !== 'all');
  
  const FilePreview = ({ file, format }: { file: EmojiFormatFile, format: string }) => {
    const formatType = format.split('/')[0];
    const isImage = formatType === 'png' || formatType === 'gif' || formatType === 'image' || file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const isVideo = formatType === 'video' || file.url.match(/\.(mp4|webm)$/i);

    if (isImage) {
        return <Image src={file.url} alt={file.name} width={40} height={40} className="w-10 h-10 object-contain bg-secondary/50 rounded-md" />;
    }
    if (isVideo) {
        return <video src={file.url} className="w-10 h-10 bg-secondary/50 rounded-md" />;
    }
    return <div className="w-10 h-10 flex items-center justify-center bg-secondary/50 rounded-md"><FileType className="w-6 h-6 text-muted-foreground" /></div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Emoji</DialogTitle>
            <DialogDescription>
              Update the details for this emoji.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emoji" className="text-right">
                Emoji
              </Label>
              <div className="col-span-3">
                <Input id="emoji" {...register("emoji")} className="w-20 text-2xl text-center p-0 h-12" />
                {errors.emoji && <p className="text-destructive text-sm mt-1">{errors.emoji.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea id="description" {...register("description")} />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {dialogCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>
            <div className="col-span-4 space-y-4">
                <h3 className="font-medium text-center text-sm text-muted-foreground pt-2">Upload New Files</h3>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="png" className="text-right">PNG</Label>
                    <div className="col-span-3">
                        <Input id="png" type="file" {...register("png")} accept="image/png" multiple />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gif" className="text-right">GIF</Label>
                    <div className="col-span-3">
                        <Input id="gif" type="file" {...register("gif")} accept="image/gif" multiple />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">Image</Label>
                    <div className="col-span-3">
                        <Input id="image" type="file" {...register("image")} accept="image/jpeg,image/webp" multiple />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="video" className="text-right">Video</Label>
                    <div className="col-span-3">
                        <Input id="video" type="file" {...register("video")} accept="video/mp4,video/webm" multiple />
                    </div>
                </div>
            </div>

            <div className="col-span-4 space-y-2 pt-4">
              <h3 className="font-medium text-center text-sm text-muted-foreground">Uploaded Files</h3>
              {Object.entries(emoji.formats).map(([format, files]) => (
                files && files.length > 0 && (
                  <div key={format}>
                    <h4 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-1 capitalize">{format}</h4>
                    <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={`${format}-${index}-${file.name}`} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md text-sm">
                        <div className="flex items-center gap-2 truncate">
                           <FilePreview file={file} format={format} />
                           <span className="truncate">{file.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(format as keyof Emoji['formats'], index)}>
                            <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    </div>
                  </div>
                )
              ))}
              {Object.values(emoji.formats).every(f => !f || f.length === 0) && <p className="text-sm text-center text-muted-foreground">No files uploaded yet.</p>}
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
