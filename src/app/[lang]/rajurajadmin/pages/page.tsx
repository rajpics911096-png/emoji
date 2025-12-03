
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
import { useTranslations } from "@/context/translations-context";
import { usePageStore } from "@/lib/store";


export default function PagesPage() {
  const { t, language } = useTranslations();
  const { toast } = useToast();
  const { pages, addPage, updatePage, deletePage } = usePageStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handleDelete = (pageId: string, pageTitle: string) => {
    deletePage(pageId);
    toast({
      title: t('pages_toast_deleted_title'),
      description: t('pages_toast_deleted_desc', { title: pageTitle }),
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
    addPage(pageToAdd);
    toast({
      title: t('pages_toast_added_title'),
      description: t('pages_toast_added_desc', { title: newPage.title }),
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPage = (updatedPage: Page) => {
    updatePage(updatedPage);
    toast({
        title: t('pages_toast_updated_title'),
        description: t('pages_toast_updated_desc', { title: updatedPage.title }),
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
                  <CardTitle>{t('pages_title')}</CardTitle>
                  <CardDescription>{t('pages_description')}</CardDescription>
              </div>
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t('pages_add_button')}</span>
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('pages_table_header_title')}</TableHead>
                <TableHead>{t('pages_table_header_slug')}</TableHead>
                <TableHead>{t('pages_table_header_status')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('dialog_actions_label')}</span>
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
                          {t(`pages_status_${page.status}`)}
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
                        <DropdownMenuLabel>{t('dialog_actions_label')}</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/${language}/${page.slug}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('dialog_preview_button')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(page)}>{t('dialog_edit_button')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(page.id, page.title)} className="text-destructive">{t('dialog_delete_button')}</DropdownMenuItem>
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
