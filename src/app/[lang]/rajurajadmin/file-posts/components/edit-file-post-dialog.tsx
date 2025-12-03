
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Emoji, EmojiFormatFile } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "@/context/translations-context";
import { UploadedFileCard } from "@/app/[lang]/rajurajadmin/components/uploaded-file-card";
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

interface EditFilePostDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditPost: (post: Emoji) => void;
  post: Emoji;
}

export function EditFilePostDialog({ isOpen, onOpenChange, onEditPost, post }: EditFilePostDialogProps) {
  const { t } = useTranslations();
  
  const defaultValues = useMemo(() => ({
    emoji: post.emoji,
    title: t(post.title),
    description: t(post.description),
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  }), [post, t]);

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, EmojiFormatFile[]>>({});

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (post) {
      reset(defaultValues);
      setUploadedFiles(post.formats);
    }
  }, [post, reset, defaultValues]);
  
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
    }, { png: [], gif: [], image: [], video: [], ...uploadedFiles });

    setUploadedFiles(newFilesMap);
  };

  const removeFile = (format: string, url: string) => {
      setUploadedFiles(prev => {
        const updatedFormatFiles = (prev[format] || []).filter(f => f.url !== url);
        const newFiles = { ...prev, [format]: updatedFormatFiles };
        if (format === 'png' || format === 'gif') {
            newFiles.image = (newFiles.image || []).filter(f => f.url !== url);
        }
        return newFiles;
      });
       if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
  };


  const onSubmit = (data: PostFormData) => {
    const isNewTitle = data.title !== t(post.title);
    const isNewDescription = data.description !== t(post.description);

    const finalData: Emoji = {
        ...post,
        ...data,
        emoji: data.emoji || '',
        title: isNewTitle ? data.title : post.title,
        description: isNewDescription ? data.description : post.description,
        formats: uploadedFiles
    };
    onEditPost(finalData);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        Object.values(uploadedFiles).flat().forEach(file => {
            if (file.url.startsWith('blob:') && !Object.values(post.formats).flat().some(f => f.url === file.url)) {
                URL.revokeObjectURL(file.url);
            }
        });
    }
    onOpenChange(open);
  }
  
  const allUploadedFiles = Object.values(uploadedFiles).flat();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit File Post</DialogTitle>
            <DialogDescription>Update the details for this file post.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
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
                    defaultValue={defaultValues.description}
                    render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label className="text-left md:text-right pt-2">Uploaded Files</Label>
                 <div className="md:col-span-3 space-y-4">
                    {allUploadedFiles.length > 0 && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.entries(uploadedFiles).map(([format, files]) => (
                                    files.map((file, index) => (
                                        <UploadedFileCard key={`${file.url}-${file.name}-${index}`} file={file} format={format} onRemove={removeFile} />
                                    ))
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                         <Label htmlFor="file-upload" className="font-medium text-sm">Upload New Files</Label>
                         <Input id="file-upload" type="file" multiple onChange={handleFileChange} accept="image/png, image/gif, image/jpeg, image/webp, video/*" />
                    </div>
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
