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
import { MoreHorizontal, PlusCircle, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { emojis as initialEmojis } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { AddEmojiDialog } from "./components/add-emoji-dialog";
import type { Emoji } from "@/lib/types";
import { EditEmojiDialog } from "./components/edit-emoji-dialog";

type SortConfig = {
  key: keyof Emoji;
  direction: 'ascending' | 'descending';
};

export default function EmojisPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [emojiList, setEmojiList] = useState<Emoji[]>(initialEmojis);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'views', direction: 'descending' });

  const sortedEmojiList = useMemo(() => {
    let sortableItems = [...emojiList];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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
  }, [emojiList, sortConfig]);

  const requestSort = (key: keyof Emoji) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof Emoji) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-50" />;
    }
    return sortConfig.direction === 'descending' ? ' ▼' : ' ▲';
  };

  const handleDelete = (emojiId: string, emojiTitle: string) => {
    setEmojiList(emojiList.filter((emoji) => emoji.id !== emojiId));
    toast({
      title: "Emoji Deleted",
      description: `"${emojiTitle}" has been deleted.`,
    });
  };

  const handleEditClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setIsEditDialogOpen(true);
  };

  const handleAddEmoji = (newEmoji: Omit<Emoji, 'id' | 'related' | 'views'>) => {
    const emojiToAdd: Emoji = {
      ...newEmoji,
      id: newEmoji.title.toLowerCase().replace(/ /g, '-'),
      related: [],
      views: 0,
    };
    setEmojiList([emojiToAdd, ...emojiList]);
    toast({
      title: "Emoji Added",
      description: `"${newEmoji.title}" has been added to the list.`,
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditEmoji = (updatedEmoji: Emoji) => {
    setEmojiList(emojiList.map(e => e.id === updatedEmoji.id ? updatedEmoji : e));
    toast({
        title: "Emoji Updated",
        description: `"${updatedEmoji.title}" has been updated.`,
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
                <CardTitle>Emojis</CardTitle>
                <CardDescription>
                  Manage your website&apos;s emojis here. You currently have {emojiList.length} emojis.
                </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Emoji</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Emoji</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('title')} className="group px-0 h-auto hover:bg-transparent">
                    Title {getSortIndicator('title')}
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('category')} className="group px-0 h-auto hover:bg-transparent">
                    Category {getSortIndicator('category')}
                </Button>
              </TableHead>
               <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('views')} className="group px-0 h-auto hover:bg-transparent">
                    Views {getSortIndicator('views')}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Formats</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmojiList.map((emoji) => (
              <TableRow key={emoji.id}>
                <TableCell className="font-medium text-2xl">{emoji.emoji}</TableCell>
                <TableCell className="font-medium">{emoji.title}</TableCell>
                <TableCell className="capitalize">{emoji.category.replace(/-/g, ' ')}</TableCell>
                <TableCell>{emoji.views.toLocaleString()}</TableCell>
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(emoji)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(emoji.id, emoji.title)}>Delete</DropdownMenuItem>
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
