import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function MediaPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>Manage your uploaded files here.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload File</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-xl text-muted-foreground">The Media Library is under construction.</p>
            <p className="text-muted-foreground">Soon you'll be able to manage all your files from here!</p>
        </div>
      </CardContent>
    </Card>
  );
}
