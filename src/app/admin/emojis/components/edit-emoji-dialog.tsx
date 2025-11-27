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
import type { Emoji } from "@/lib/types";
import { useEffect } from "react";

const emojiSchema = z.object({
  emoji: z.string().min(1, "Emoji character is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
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
    onEditEmoji({ ...emoji, ...data });
  };

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
