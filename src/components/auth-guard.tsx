
"use client";

import { useUser } from "@/firebase/use-user";
import { useState, type ReactNode } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/context/translations-context";
import { SvgIcon } from "@/components/svg-icon";
import { useSiteSettings } from "@/context/site-settings-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/app/[lang]/rajurajadmin/components/admin-sidebar";
import { AdminHeader } from "@/app/[lang]/rajurajadmin/components/admin-header";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  const { settings } = useSiteSettings();

  const handleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to redirect, the AuthGuard will re-render the children.
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <SvgIcon svg={settings.logo} className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-headline">{t('admin_sidebar_title')}</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}


export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AdminSidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <AdminHeader />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
  );
}
