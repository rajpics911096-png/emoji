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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Page } from "@/lib/types";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  content: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

type PageFormData = z.infer<typeof pageSchema>;

interface EditPageDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditPage: (page: Page) => void;
  page: Page;
}

export function EditPageDialog({ isOpen, onOpenChange, onEditPage, page }: EditPageDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
  });

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
      });
    }
  }, [page, reset]);

  const onSubmit = (data: PageFormData) => {
    onEditPage({ ...page, ...data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update the details for this page. The slug cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <div className="col-span-3">
                <Input id="slug" {...register("slug")} readOnly disabled />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <div className="col-span-3">
                <Textarea id="content" {...register("content")} placeholder="Write your page content here... (Supports Markdown)" rows={10} />
                 {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                 <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && <p className="text-destructive text-sm mt-1">{errors.status.message}</p>}
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
