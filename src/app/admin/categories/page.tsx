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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { EmojiCategory } from "@/lib/types";
import { AddCategoryDialog } from "./components/add-category-dialog";
import { EditCategoryDialog } from "./components/edit-category-dialog";
import { iconMap } from "@/lib/icon-map";

export default function CategoriesPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory | null>(null);
  const [categoryList, setCategoryList] = useState<EmojiCategory[]>(categories);

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (categoryId === 'all') {
        toast({
            variant: "destructive",
            title: "Cannot Delete",
            description: `The "All Emojis" category cannot be deleted.`,
        });
        return;
    }
    setCategoryList(categoryList.filter((category) => category.id !== categoryId));
    toast({
      title: "Category Deleted",
      description: `"${categoryName}" has been deleted.`,
    });
  };

  const handleEditClick = (category: EmojiCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleAddCategory = (newCategory: Omit<EmojiCategory, 'id' | 'icon'> & { icon: string }) => {
    const categoryToAdd: EmojiCategory = {
      ...newCategory,
      id: newCategory.name.toLowerCase().replace(/ /g, '-'),
      icon: iconMap[newCategory.icon] || iconMap['smile'],
    };
    setCategoryList([categoryToAdd, ...categoryList]);
    toast({
      title: "Category Added",
      description: `"${newCategory.name}" has been added to the list.`,
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditCategory = (updatedCategory: EmojiCategory) => {
    setCategoryList(categoryList.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    toast({
        title: "Category Updated",
        description: `"${updatedCategory.name}" has been updated.`,
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
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your website&apos;s emoji categories here.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Category</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryList.map((category) => {
              const Icon = category.icon;
              return (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-2xl"><Icon className="h-6 w-6" /></TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id, category.name)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
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
