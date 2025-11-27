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
import { RichTextEditor } from "@/components/rich-text-editor";
import { useTranslations } from "@/context/translations-context";


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
  const { t } = useTranslations();
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
    const isImage = ['png', 'gif', 'image'].includes(format) || file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const isVideo = format === 'video' || file.url.match(/\.(mp4|webm)$/i);

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
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('edit_emoji_dialog_title')}</DialogTitle>
            <DialogDescription>
              {t('edit_emoji_dialog_desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="emoji">{t('emoji_form_emoji_label')}</Label>
              <Input id="emoji" {...register("emoji")} className="w-20 text-2xl text-center p-0 h-12" />
              {errors.emoji && <p className="text-destructive text-sm mt-1">{errors.emoji.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">{t('emoji_form_title_label')}</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('emoji_form_description_label')}</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    />
                )}
              />
              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('emoji_form_category_label')}</Label>
              <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                              <SelectValue placeholder={t('emoji_form_category_placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                              {dialogCategories.map(cat => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                      {t(`category_${cat.id}`)}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )}
              />
              {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="font-medium text-center text-sm text-muted-foreground">{t('emoji_form_upload_new_title')}</h3>
                 <div className="space-y-2">
                    <Label htmlFor="png">PNG</Label>
                    <Input id="png" type="file" {...register("png")} accept="image/png" multiple />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gif">GIF</Label>
                    <Input id="gif" type="file" {...register("gif")} accept="image/gif" multiple />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" type="file" {...register("image")} accept="image/jpeg,image/webp" multiple />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="video">Video</Label>
                    <Input id="video" type="file" {...register("video")} accept="video/mp4,video/webm" multiple />
                </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-medium text-center text-sm text-muted-foreground">{t('emoji_form_uploaded_title')}</h3>
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
              {Object.values(emoji.formats).every(f => !f || f.length === 0) && <p className="text-sm text-center text-muted-foreground">{t('emoji_form_no_files_uploaded')}</p>}
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('dialog_cancel_button')}
            </Button>
            <Button type="submit">{t('dialog_save_changes_button')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    