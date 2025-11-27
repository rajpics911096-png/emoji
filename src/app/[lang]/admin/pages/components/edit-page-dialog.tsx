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
import type { Page } from "@/lib/types";
import { useEffect } from "react";
import { useTranslations } from "@/context/translations-context";
import { RichTextEditor } from "@/components/rich-text-editor";


const pageSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required."),
  status: z.enum(["published", "draft"]),
  content: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

interface EditPageDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEditPage: (page: Page) => void;
  page: Page;
}

export function EditPageDialog({ isOpen, onOpenChange, onEditPage, page }: EditPageDialogProps) {
  const { t } = useTranslations();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      status: page.status,
      content: page.content,
    },
  });

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        slug: page.slug,
        status: page.status,
        content: page.content
      });
    }
  }, [page, reset]);

  const onSubmit = (data: PageFormData) => {
    onEditPage({ ...page, ...data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('edit_page_dialog_title')}</DialogTitle>
            <DialogDescription>{t('edit_page_dialog_desc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-left md:text-right">{t('page_form_title_label')}</Label>
              <div className="md:col-span-3">
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-left md:text-right">{t('page_form_slug_label')}</Label>
              <div className="md:col-span-3">
                <Input id="slug" {...register("slug")} disabled />
                 {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>}
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-left md:text-right">{t('page_form_status_label')}</Label>
                <div className="md:col-span-3">
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('page_form_status_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="published">{t('pages_status_published')}</SelectItem>
                            <SelectItem value="draft">{t('pages_status_draft')}</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                    />
                    {errors.status && <p className="text-destructive text-sm mt-1">{errors.status.message}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-left md:text-right pt-2">{t('page_form_content_label')}</Label>
                <div className="md:col-span-3">
                     <Controller
                        name="content"
                        control={control}
                        render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
                    />
                </div>
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
