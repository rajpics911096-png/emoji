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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { EmojiCategory } from "@/lib/types";
import { useTranslations } from "@/context/translations-context";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
  icon: z.string().min(1, "Icon SVG code is required."),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddCategory: (category: Omit<EmojiCategory, 'id'>) => void;
}

export function AddCategoryDialog({ isOpen, onOpenChange, onAddCategory }: AddCategoryDialogProps) {
  const { t } = useTranslations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: CategoryFormData) => {
    onAddCategory(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('add_category_dialog_title')}</DialogTitle>
            <DialogDescription>
              {t('add_category_dialog_desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left md:text-right">
                {t('category_form_name_label')}
              </Label>
              <div className="md:col-span-3">
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
              <Label htmlFor="icon" className="text-left md:text-right pt-2">
                {t('category_form_icon_label')}
              </Label>
              <div className="md:col-span-3">
                <Textarea id="icon" {...register("icon")} placeholder={t('category_form_icon_placeholder')} rows={4} />
                {errors.icon && <p className="text-destructive text-sm mt-1">{errors.icon.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('dialog_cancel_button')}
            </Button>
            <Button type="submit">{t('add_category_dialog_add_button')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
