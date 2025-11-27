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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Page } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AddPageDialog } from "./components/add-page-dialog";
import { EditPageDialog } from "./components/edit-page-dialog";
import Link from "next/link";
import { pages as initialPagesData } from "@/lib/data";


export default function PagesPage() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>(initialPagesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handleDelete = (pageId: string, pageTitle: string) => {
    setPages(pages.filter((page) => page.id !== pageId));
    toast({
      title: "Page Deleted",
      description: `"${pageTitle}" has been deleted.`,
    });
  };

  const handleEditClick = (page: Page) => {
    setSelectedPage(page);
    setIsEditDialogOpen(true);
  };

  const handleAddPage = (newPage: Omit<Page, 'id'>) => {
    const pageToAdd: Page = {
      ...newPage,
      id: newPage.slug,
    };
    setPages([pageToAdd, ...pages]);
    toast({
      title: "Page Added",
      description: `"${newPage.title}" has been created.`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPage = (updatedPage: Page) => {
    setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
    toast({
        title: "Page Updated",
        description: `"${updatedPage.title}" has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedPage(null);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Pages</CardTitle>
                  <CardDescription>Manage your website's custom pages here.</CardDescription>
              </div>
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Page</span>
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                  <TableCell>
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                      </Badge>
                  </TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/${page.slug}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(page)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(page.id, page.title)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddPageDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddPage={handleAddPage}
       />
      {selectedPage && (
        <EditPageDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEditPage={handleEditPage}
            page={selectedPage}
        />
      )}
    </>
  );
}
