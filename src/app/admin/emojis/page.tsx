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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { emojis } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AddEmojiDialog } from "./components/add-emoji-dialog";
import type { Emoji } from "@/lib/types";
import { EditEmojiDialog } from "./components/edit-emoji-dialog";

export default function EmojisPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [emojiList, setEmojiList] = useState<Emoji[]>(emojis);

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

  const handleAddEmoji = (newEmoji: Omit<Emoji, 'id' | 'formats' | 'related'>) => {
    const emojiToAdd: Emoji = {
      ...newEmoji,
      id: newEmoji.title.toLowerCase().replace(/ /g, '-'),
      formats: { png: [], gif: [], image: [], video: [] },
      related: [],
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
                <CardDescription>Manage your website&apos;s emojis here.</CardDescription>
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
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Formats</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emojiList.map((emoji) => (
              <TableRow key={emoji.id}>
                <TableCell className="font-medium text-2xl">{emoji.emoji}</TableCell>
                <TableCell className="font-medium">{emoji.title}</TableCell>
                <TableCell className="capitalize">{emoji.category.replace(/-/g, ' ')}</TableCell>
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
