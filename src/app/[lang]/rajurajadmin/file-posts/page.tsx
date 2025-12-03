
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
import { MoreHorizontal, PlusCircle, ArrowUpDown, ExternalLink, FileUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import type { Emoji } from "@/lib/types";
import Link from "next/link";
import { useTranslations } from "@/context/translations-context";
import { useEmojiStore } from "@/lib/store";
import { format } from 'date-fns';
import { AddFilePostDialog } from "./components/add-file-post-dialog";
import { EditFilePostDialog } from "./components/edit-file-post-dialog";
import { Input } from "@/components/ui/input";


type SortConfig = {
  key: keyof Emoji | 'translatedTitle';
  direction: 'ascending' | 'descending';
};

export default function FilePostsPage() {
  const { t, language } = useTranslations();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Emoji | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { emojis, addEmoji, updateEmoji, deleteEmoji } = useEmojiStore();
  
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'createdAt', direction: 'descending' });
  
  const filePosts = useMemo(() => emojis.filter(p => !p.emoji), [emojis]);
  
  const postList = useMemo(() => {
    const views = JSON.parse(localStorage.getItem('emojiViews') || '{}');
    return filePosts.map(post => ({
      ...post,
      views: views[post.id] || post.views || 0,
      createdAt: post.createdAt || 0,
      translatedTitle: t(post.title)
    }));
  }, [filePosts, t]);


  const sortedPostList = useMemo(() => {
    let sortableItems = postList.filter(post => 
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
  }, [postList, sortConfig, searchTerm]);

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

  const handleDelete = (postId: string, postTitle: string) => {
    deleteEmoji(postId);
    toast({
      title: "File Post Deleted",
      description: `"${postTitle}" has been deleted.`,
    });
  };

  const handleEditClick = (post: Emoji) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handleAddPost = (newPost: Omit<Emoji, 'id' | 'related' | 'views' | 'createdAt'>) => {
    addEmoji(newPost);
    toast({
      title: "File Post Added",
      description: `"${t(newPost.title)}" has been added to the list.`,
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditPost = (updatedPost: Emoji) => {
    updateEmoji(updatedPost);
    toast({
        title: "File Post Updated",
        description: `"${t(updatedPost.title)}" has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedPost(null);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
            <div>
                <CardTitle>File Posts</CardTitle>
                <CardDescription>
                  Manage your website's file posts here. You currently have {filePosts.length} posts.
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
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add File Post</span>
              </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('translatedTitle')} className="group px-0 h-auto hover:bg-transparent">
                    Title {getSortIndicator('translatedTitle')}
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
               <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('createdAt')} className="group px-0 h-auto hover:bg-transparent">
                    Created At {getSortIndicator('createdAt')}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Formats</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPostList.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium text-2xl">{post.emoji || <FileUp className="h-6 w-6 text-muted-foreground" />}</TableCell>
                <TableCell className="font-medium">{post.translatedTitle}</TableCell>
                <TableCell className="capitalize">{t(`category_${post.category}`)}</TableCell>
                <TableCell>{(post.views || 0).toLocaleString()}</TableCell>
                <TableCell>
                  {post.createdAt ? format(new Date(post.createdAt), 'dd MMM yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex gap-1">
                        {Object.entries(post.formats).map(([format, files]) => (
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
                      <DropdownMenuItem asChild>
                        <Link href={`/${language}/file/${post.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(post)}>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(post.id, post.translatedTitle)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <AddFilePostDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddPost={handleAddPost}
    />
    {selectedPost && (
        <EditFilePostDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEditPost={handleEditPost}
            post={selectedPost}
        />
    )}
    </>
  );
}
