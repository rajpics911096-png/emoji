
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/context/site-settings-context";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/context/translations-context";
import { useState } from "react";
import { getAuth, updatePassword, verifyBeforeUpdateEmail, type User, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function SettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings, resetSettings } = useSiteSettings();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [actionToRetry, setActionToRetry] = useState<(() => Promise<void>) | null>(null);


  const handleSave = () => {
    setSettings(settings);
    toast({
      title: t('settings_toast_saved_title'),
      description: t('settings_toast_saved_desc'),
    });
  };
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: t('settings_toast_reset_title'),
      description: t('settings_toast_reset_desc'),
    });
  }

  const handleSitemap = () => {
    toast({
      title: t('settings_toast_sitemap_title'),
      description: t('settings_toast_sitemap_desc'),
    });
  };
  
  const performEmailChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            await verifyBeforeUpdateEmail(user, newEmail);
            toast({
                title: "Verification Email Sent",
                description: `A verification link has been sent to ${newEmail}. Please check your inbox to complete the change.`,
            });
            setNewEmail("");
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                setActionToRetry(() => performEmailChange);
                setShowReauthDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Email Change Failed",
                    description: error.message || "An error occurred.",
                });
            }
        }
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      toast({
        variant: "destructive",
        title: "Email is required",
        description: "Please enter a new email address.",
      });
      return;
    }
    await performEmailChange();
  };

  const performPasswordChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await updatePassword(user, newPassword);
            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                setActionToRetry(() => performPasswordChange);
                setShowReauthDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Password Change Failed",
                    description: error.message || "An error occurred.",
                });
            }
        }
    }
  }

  const handleReauthenticateAndRetry = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        setShowReauthDialog(false);
        setCurrentPassword("");
        if (actionToRetry) {
          await actionToRetry();
          setActionToRetry(null);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message || "Could not re-authenticate. Please check your password.",
        });
      }
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please ensure both password fields are identical.",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Your new password must be at least 6 characters long.",
      });
      return;
    }
    await performPasswordChange();
  };

  return (
    <>
    <div className="mx-auto max-w-4xl flex-1 space-y-4 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('settings_title')}</h1>

       <Card>
        <CardHeader>
          <CardTitle>{t('settings_branding_title')}</CardTitle>
          <CardDescription>
            {t('settings_branding_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="site-name">{t('settings_site_name_label')}</Label>
            <Input
              id="site-name"
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_site_name_desc')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-logo">{t('settings_logo_label')}</Label>
            <Textarea
              id="site-logo"
              value={settings.logo}
              onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_logo_desc')}
            </p>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Change your login email and password here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter your new email"
                />
              </div>
              <Button onClick={handleChangeEmail}>Change Email</Button>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
             <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings_content_title')}</CardTitle>
          <CardDescription>
            {t('settings_content_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="download-timer">{t('settings_download_timer_label')}</Label>
            <Input
              id="download-timer"
              type="number"
              value={settings.downloadTimer}
              onChange={(e) => setSettings({ ...settings, downloadTimer: parseInt(e.target.value, 10) })}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_download_timer_desc')}
            </p>
          </div>
          <div className="space-y-2">
            <Label>{t('settings_sitemap_label')}</Label>
            <Button onClick={handleSitemap} variant="outline" className="w-full">
              {t('settings_sitemap_button')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('settings_sitemap_desc')}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button onClick={handleReset} variant="outline">{t('settings_reset_button')}</Button>
        <Button onClick={handleSave}>{t('settings_save_button')}</Button>
      </div>
    </div>
    <AlertDialog open={showReauthDialog} onOpenChange={setShowReauthDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Please Re-authenticate</AlertDialogTitle>
            <AlertDialogDescription>
                This is a sensitive operation. To continue, please enter your current password to confirm your identity.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
            />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReauthenticateAndRetry}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
   </>
  );
}
