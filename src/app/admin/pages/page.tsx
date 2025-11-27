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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Page } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const initialPages: Page[] = [
    { id: 'about-us', title: 'About Us', slug: 'about-us', status: 'published' },
    { id: 'contact-us', title: 'Contact Us', slug: 'contact-us', status: 'draft' },
    { id: 'privacy-policy', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published' },
]

export default function PagesPage() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>(initialPages);

  const handleDelete = (pageId: string, pageTitle: string) => {
    setPages(pages.filter((page) => page.id !== pageId));
    toast({
      title: "Page Deleted",
      description: `"${pageTitle}" has been deleted.`,
    });
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
            <Button size="sm" className="gap-1">
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(page.id, page.title)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
