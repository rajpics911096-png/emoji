
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
import { UploadedFileCard } from "@/app/[lang]/rajurajadmin/components/uploaded-file-card";
import { useCategoryStore } from "@/lib/store";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";

const postSchema = z.object({
  emoji: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface AddFilePostDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddPost: (post: Omit<Emoji, 'id' | 'related' | 'views'>) => void;
}

export function AddFilePostDialog({ isOpen, onOpenChange, onAddPost }: AddFilePostDialogProps) {
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
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFilesMap = Array.from(files).reduce((acc, file) => {
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
        const newFiles = { ...prev, [format]: updatedFormatFiles };
        if (format === 'png' || format === 'gif') {
            newFiles.image = newFiles.image.filter(f => f.url !== url);
        }
        return newFiles;
      });
      URL.revokeObjectURL(url);
  };

  const onSubmit = (data: PostFormData) => {
    onAddPost({ ...data, emoji: data.emoji || '', category: 'uncategorized', formats: uploadedFiles });
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
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New File Post</DialogTitle>
            <DialogDescription>Fill in the details below to add a new file post to your collection.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="emoji" className="text-left md:text-right">Emoji (Optional)</Label>
              <div className="md:col-span-3">
                <Input id="emoji" {...register("emoji")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-left md:text-right">Title</Label>
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
              <Label htmlFor="description" className="text-left md:text-right pt-2">Description</Label>
              <div className="md:col-span-3">
                 <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label className="text-left md:text-right pt-2">Upload Files</Label>
                 <div className="md:col-span-3 space-y-4">
                    <Input id="file-upload" type="file" multiple onChange={handleFileChange} accept="image/png, image/gif, image/jpeg, image/webp, video/*" />
                    {allUploadedFiles.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Uploaded Files</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.entries(uploadedFiles).map(([format, files]) => (
                                    files.map((file, index) => (
                                        <UploadedFileCard key={`${file.url}-${file.name}-${index}`} file={file} format={format} onRemove={removeFile} />
                                    ))
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
                    )}
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add File Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
