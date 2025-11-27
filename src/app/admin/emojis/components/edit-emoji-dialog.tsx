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
import { useEffect } from "react";
import { X } from "lucide-react";

const fileSchema = z.custom<FileList>().transform(file => file.length > 0 ? file.item(0) : null);

const emojiSchema = z.object({
  emoji: z.string().min(1, "Emoji character is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  png: fileSchema.optional(),
  gif: fileSchema.optional(),
  image: fileSchema.optional(),
  video: fileSchema.optional(),
});

type EmojiFormData = z.infer<typeof emojiSchema>;

interface EditEmojiDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditEmoji: (emoji: Emoji) => void;
  emoji: Emoji;
}

export function EditEmojiDialog({ isOpen, onOpenChange, onEditEmoji, emoji }: EditEmojiDialogProps) {
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
    if (emoji) {
      reset({
        emoji: emoji.emoji,
        title: emoji.title,
        description: emoji.description,
        category: emoji.category,
      });
    }
  }, [emoji, reset]);

  const onSubmit = (data: EmojiFormData) => {
    const updatedFormats = { ...emoji.formats };
    if (data.png) {
        const file = data.png;
        updatedFormats.png.push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
    }
    if (data.gif) {
        const file = data.gif;
        updatedFormats.gif.push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
    }
    if (data.image) {
        const file = data.image;
        updatedFormats.image.push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
    }
    if (data.video) {
        const file = data.video;
        updatedFormats.video.push({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, url: URL.createObjectURL(file) });
    }

    onEditEmoji({ ...emoji, ...data, formats: updatedFormats });
  };
  
  const handleRemoveFile = (format: keyof Emoji['formats'], index: number) => {
    const updatedEmoji = { ...emoji };
    updatedEmoji.formats[format].splice(index, 1);
    onEditEmoji(updatedEmoji);
  }

  const dialogCategories = categories.filter(c => c.id !== 'all');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Emoji</DialogTitle>
            <DialogDescription>
              Update the details for this emoji.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                        <Input id="png" type="file" {...register("png")} accept="image/png" />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gif" className="text-right">GIF</Label>
                    <div className="col-span-3">
                        <Input id="gif" type="file" {...register("gif")} accept="image/gif" />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">Image</Label>
                    <div className="col-span-3">
                        <Input id="image" type="file" {...register("image")} accept="image/jpeg,image/webp" />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="video" className="text-right">Video</Label>
                    <div className="col-span-3">
                        <Input id="video" type="file" {...register("video")} accept="video/mp4,video/webm" />
                    </div>
                </div>
            </div>

            <div className="col-span-4 space-y-2 pt-4">
              <h3 className="font-medium text-center text-sm text-muted-foreground">Uploaded Files</h3>
              {Object.entries(emoji.formats).map(([format, files]) => (
                files.length > 0 && (
                  <div key={format}>
                    <h4 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-1 capitalize">{format}</h4>
                    <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={`${format}-${index}`} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md text-sm">
                        <span className="truncate">{file.name}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(format as keyof Emoji['formats'], index)}>
                            <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    </div>
                  </div>
                )
              ))}
              {Object.values(emoji.formats).every(f => f.length === 0) && <p className="text-sm text-center text-muted-foreground">No files uploaded yet.</p>}
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
