"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { categories as initialCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { EmojiCategory } from "@/lib/types";
import { AddCategoryDialog } from "./components/add-category-dialog";
import { EditCategoryDialog } from "./components/edit-category-dialog";
import { SvgIcon } from "@/components/svg-icon";
import Link from "next/link";
import { useTranslations } from "@/context/translations-context";

export default function CategoriesPage() {
  const { t, language } = useTranslations();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory | null>(null);
  const [categoryList, setCategoryList] = useState<EmojiCategory[]>(initialCategories);

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (categoryId === 'all') {
        toast({
            variant: "destructive",
            title: t('categories_toast_cannot_delete_title'),
            description: t('categories_toast_cannot_delete_desc'),
        });
        return;
    }
    setCategoryList(categoryList.filter((category) => category.id !== categoryId));
    toast({
      title: t('categories_toast_deleted_title'),
      description: t('categories_toast_deleted_desc', { name: categoryName }),
    });
  };

  const handleEditClick = (category: EmojiCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleAddCategory = (newCategory: Omit<EmojiCategory, 'id'>) => {
    const categoryToAdd: EmojiCategory = {
      ...newCategory,
      id: newCategory.name.toLowerCase().replace(/ /g, '-'),
    };
    setCategoryList([categoryToAdd, ...categoryList]);
    toast({
      title: t('categories_toast_added_title'),
      description: t('categories_toast_added_desc', { name: newCategory.name }),
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditCategory = (updatedCategory: EmojiCategory) => {
    setCategoryList(categoryList.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    toast({
        title: t('categories_toast_updated_title'),
        description: t('categories_toast_updated_desc', { name: updatedCategory.name }),
    });
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{t('categories_title')}</CardTitle>
                <CardDescription>{t('categories_description')}</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t('categories_add_button')}</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t('categories_table_header_icon')}</TableHead>
              <TableHead>{t('categories_table_header_name')}</TableHead>
              <TableHead>{t('categories_table_header_id')}</TableHead>
              <TableHead>
                <span className="sr-only">{t('dialog_actions_label')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryList.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-2xl">
                  <SvgIcon svg={category.icon} className="h-6 w-6" />
                </TableCell>
                <TableCell className="font-medium">{t(category.name)}</TableCell>
                <TableCell className="font-mono text-sm">{category.id}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('dialog_actions_label')}</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/${language}/emojis/${category.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t('dialog_preview_button')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(category)}>{t('dialog_edit_button')}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(category.id, category.name)} className="text-destructive">{t('dialog_delete_button')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <AddCategoryDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddCategory={handleAddCategory}
    />
    {selectedCategory && (
        <EditCategoryDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEditCategory={handleEditCategory}
            category={selectedCategory}
        />
    )}
    </>
  );
}
