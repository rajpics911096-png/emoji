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
import { RichTextEditor } from "@/components/rich-text-editor";

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

interface AddEmojiDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddEmoji: (emoji: Omit<Emoji, 'id' | 'related'>) => void;
}

export function AddEmojiDialog({ isOpen, onOpenChange, onAddEmoji }: AddEmojiDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmojiFormData>({
    resolver: zodResolver(emojiSchema),
    defaultValues: {
      description: "",
    }
  });

  const onSubmit = (data: EmojiFormData) => {
    const newFormats: {
        png: EmojiFormatFile[];
        gif: EmojiFormatFile[];
        image: EmojiFormatFile[];
        video: EmojiFormatFile[];
    } = { png: [], gif: [], image: [], video: [] };

    const processFiles = (files: FileList | undefined, format: keyof typeof newFormats) => {
        if (files) {
            Array.from(files).forEach(file => {
                newFormats[format].push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
            });
        }
    }

    processFiles(data.png, 'png');
    processFiles(data.gif, 'gif');
    processFiles(data.image, 'image');
    processFiles(data.video, 'video');

    onAddEmoji({
        emoji: data.emoji,
        title: data.title,
        description: data.description,
        category: data.category,
        formats: newFormats
    });
    reset();
  };

  const dialogCategories = categories.filter(c => c.id !== 'all');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Emoji</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new emoji to your collection.
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
                <h3 className="font-medium text-center text-sm text-muted-foreground pt-2">Upload Files</h3>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Emoji</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
