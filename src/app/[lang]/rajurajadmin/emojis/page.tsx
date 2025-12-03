
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, ArrowUpDown, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { AddEmojiDialog } from "./components/add-emoji-dialog";
import type { Emoji } from "@/lib/types";
import { EditEmojiDialog } from "./components/edit-emoji-dialog";
import Link from "next/link";
import { useTranslations } from "@/context/translations-context";
import { useEmojiStore } from "@/lib/store";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";


type SortConfig = {
  key: keyof Emoji | 'translatedTitle';
  direction: 'ascending' | 'descending';
};

export default function EmojisPage() {
  const { t, language } = useTranslations();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { emojis, addEmoji, updateEmoji, deleteEmoji } = useEmojiStore();
  
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'createdAt', direction: 'descending' });
  
  const emojiPosts = useMemo(() => emojis.filter(p => p.emoji), [emojis]);

  const emojiListWithDetails = useMemo(() => {
    const views = JSON.parse(localStorage.getItem('emojiViews') || '{}');
    return emojiPosts.map(emoji => ({
      ...emoji,
      views: views[emoji.id] || emoji.views || 0,
      createdAt: emoji.createdAt || 0,
      translatedTitle: t(emoji.title)
    }));
  }, [emojiPosts, t]);


  const sortedEmojiList = useMemo(() => {
    let sortableItems = emojiListWithDetails.filter(post => 
      post.translatedTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (aValue.toLowerCase() < bValue.toLowerCase()) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue.toLowerCase() > bValue.toLowerCase()) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [emojiListWithDetails, sortConfig, searchTerm]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-50" />;
    }
    return sortConfig.direction === 'descending' ? ' ▼' : ' ▲';
  };

  const handleDelete = (emojiId: string, emojiTitle: string) => {
    deleteEmoji(emojiId);
    toast({
      title: t('emojis_toast_deleted_title'),
      description: t('emojis_toast_deleted_desc', { title: emojiTitle }),
    });
  };

  const handleEditClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setIsEditDialogOpen(true);
  };

  const handleAddEmoji = (newEmoji: Omit<Emoji, 'id' | 'related' | 'views' | 'createdAt'>) => {
    addEmoji(newEmoji);
    toast({
      title: t('emojis_toast_added_title'),
      description: t('emojis_toast_added_desc', { title: t(newEmoji.title) }),
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditEmoji = (updatedEmoji: Emoji) => {
    updateEmoji(updatedEmoji);
    toast({
        title: t('emojis_toast_updated_title'),
        description: t('emojis_toast_updated_desc', { title: t(updatedEmoji.title) }),
    });
    setIsEditDialogOpen(false);
    setSelectedEmoji(null);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{t('emojis_title')}</CardTitle>
                <CardDescription>
                  {t('emojis_description', { count: emojiPosts.length.toString() })}
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t('emojis_add_button')}</span>
              </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t('emojis_table_header_emoji')}</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('translatedTitle')} className="group px-0 h-auto hover:bg-transparent">
                    {t('emojis_table_header_title')} {getSortIndicator('translatedTitle')}
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('category')} className="group px-0 h-auto hover:bg-transparent">
                    {t('emojis_table_header_category')} {getSortIndicator('category')}
                </Button>
              </TableHead>
               <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('views')} className="group px-0 h-auto hover:bg-transparent">
                    {t('emojis_table_header_views')} {getSortIndicator('views')}
                </Button>
              </TableHead>
               <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('createdAt')} className="group px-0 h-auto hover:bg-transparent">
                    Created At {getSortIndicator('createdAt')}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">{t('emojis_table_header_formats')}</TableHead>
              <TableHead>
                <span className="sr-only">{t('dialog_actions_label')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmojiList.map((emoji) => (
              <TableRow key={emoji.id}>
                <TableCell className="font-medium text-2xl">{emoji.emoji}</TableCell>
                <TableCell className="font-medium">{emoji.translatedTitle}</TableCell>
                <TableCell className="capitalize">{t(`category_${emoji.category}`)}</TableCell>
                <TableCell>{(emoji.views || 0).toLocaleString()}</TableCell>
                <TableCell>
                  {emoji.createdAt ? format(new Date(emoji.createdAt), 'dd MMM yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex gap-1">
                        {Object.entries(emoji.formats).map(([format, files]) => (
                            files.length > 0 && <Badge key={format} variant="secondary" className="capitalize">{format}</Badge>
                        ))}
                    </div>
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
                        <Link href={`/${language}/emoji/${emoji.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t('dialog_preview_button')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(emoji)}>{t('dialog_edit_button')}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(emoji.id, emoji.translatedTitle)} className="text-destructive">{t('dialog_delete_button')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <AddEmojiDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddEmoji={handleAddEmoji}
    />
    {selectedEmoji && (
        <EditEmojiDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEditEmoji={handleEditEmoji}
            emoji={selectedEmoji}
        />
    )}
    </>
  );
}
