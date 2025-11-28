
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Emoji, EmojiFormatFile } from "@/lib/types";
import { useTranslations } from "@/context/translations-context";
import { useState } from "react";
import { UploadedFileCard } from "./uploaded-file-card";
import { useCategoryStore } from "@/lib/store";

const emojiSchema = z.object({
  emoji: z.string().min(1, "Emoji character is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type EmojiFormData = z.infer<typeof emojiSchema>;

interface AddEmojiDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddEmoji: (emoji: Omit<Emoji, 'id' | 'related' | 'views'>) => void;
}

export function AddEmojiDialog({ isOpen, onOpenChange, onAddEmoji }: AddEmojiDialogProps) {
  const { t } = useTranslations();
  const { categories } = useCategoryStore();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, EmojiFormatFile[]>>({
    png: [],
    gif: [],
    image: [],
    video: [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmojiFormData>({
    resolver: zodResolver(emojiSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFilesMap = Array.from(files).reduce((acc, file) => {
      const fileType = file.type.split('/')[1];
      const simpleFormat = file.type.startsWith('image/png') ? 'png' :
                           file.type.startsWith('image/gif') ? 'gif' :
                           file.type.startsWith('image/') ? 'image' :
                           file.type.startsWith('video/') ? 'video' : null;

      if (simpleFormat && acc[simpleFormat]) {
        const newFile: EmojiFormatFile = {
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            url: URL.createObjectURL(file),
            type: file.type,
        };
        acc[simpleFormat] = [...acc[simpleFormat], newFile];
      }
      return acc;
    }, { ...uploadedFiles });
    
    setUploadedFiles(newFilesMap);
  };
  
  const removeFile = (format: string, url: string) => {
      setUploadedFiles(prev => {
        const updatedFormatFiles = prev[format].filter(f => f.url !== url);
        const newFiles = {
          ...prev,
          [format]: updatedFormatFiles,
        };

        // Also check if this file exists in other formats (like image) and remove it
        if (format === 'png' || format === 'gif') {
            newFiles.image = newFiles.image.filter(f => f.url !== url);
        }

        return newFiles;
      });
      URL.revokeObjectURL(url);
  };

  const onSubmit = (data: EmojiFormData) => {
    onAddEmoji({ ...data, formats: uploadedFiles });
    reset();
    setUploadedFiles({ png: [], gif: [], image: [], video: [] });
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      Object.values(uploadedFiles).flat().forEach(file => URL.revokeObjectURL(file.url));
      setUploadedFiles({ png: [], gif: [], image: [], video: [] });
    }
    onOpenChange(open);
  }

  const allUploadedFiles = Object.values(uploadedFiles).flat();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('add_emoji_dialog_title')}</DialogTitle>
            <DialogDescription>{t('add_emoji_dialog_desc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="emoji" className="text-left md:text-right">{t('emoji_form_emoji_label')}</Label>
              <div className="md:col-span-3">
                <Input id="emoji" {...register("emoji")} />
                {errors.emoji && <p className="text-destructive text-sm mt-1">{errors.emoji.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-left md:text-right">{t('emoji_form_title_label')}</Label>
              <div className="md:col-span-3">
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="metaTitle" className="text-left md:text-right">Meta Title</Label>
              <div className="md:col-span-3">
                <Input id="metaTitle" {...register("metaTitle")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
              <Label htmlFor="metaDescription" className="text-left md:text-right pt-2">Meta Description</Label>
              <div className="md:col-span-3">
                <Textarea id="metaDescription" {...register("metaDescription")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-left md:text-right pt-2">{t('emoji_form_description_label')}</Label>
              <div className="md:col-span-3">
                <Textarea id="description" {...register("description")} />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-left md:text-right">{t('emoji_form_category_label')}</Label>
              <div className="md:col-span-3">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('emoji_form_category_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.id !== 'all').map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {t(cat.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label className="text-left md:text-right pt-2">{t('emoji_form_upload_title')}</Label>
                 <div className="md:col-span-3 space-y-4">
                    <Input id="file-upload" type="file" multiple onChange={handleFileChange} accept="image/png, image/gif, image/jpeg, image/webp, video/*" />
                    {allUploadedFiles.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">{t('emoji_form_uploaded_title')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.entries(uploadedFiles).map(([format, files]) => (
                                    files.map(file => (
                                        <UploadedFileCard key={file.url} file={file} format={format} onRemove={removeFile} />
                                    ))
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('emoji_form_no_files_uploaded')}</p>
                    )}
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('dialog_cancel_button')}
            </Button>
            <Button type="submit">{t('add_emoji_dialog_add_button')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
