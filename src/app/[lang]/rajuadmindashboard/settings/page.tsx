
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
import { getAuth, updatePassword, updateEmail, type User, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";


export default function SettingsPage() {
  const { t } = useTranslations();
  const { toast } = useToast();
  const { settings, setSettings, resetSettings } = useSiteSettings();
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");


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

  const reauthenticate = async (password: string): Promise<User | null> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) return null;

    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        return user;
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "The password you entered is incorrect. Please try again.",
        });
        return null;
    }
  }

  const handleChangeEmail = async () => {
      if (!newEmail || !currentPasswordForEmail) {
          toast({ variant: "destructive", title: "Missing Information", description: "Please enter your new email and current password." });
          return;
      }

      const user = await reauthenticate(currentPasswordForEmail);
      if (user) {
          try {
              await updateEmail(user, newEmail);
              toast({ title: "Email Updated", description: "Your email has been successfully updated." });
              setNewEmail("");
              setCurrentPasswordForEmail("");
          } catch (error: any) {
              toast({ variant: "destructive", title: "Email Update Failed", description: error.message });
          }
      }
  };

  const handleChangePassword = async () => {
      if (newPassword !== confirmPassword) {
          toast({ variant: "destructive", title: "Passwords Do Not Match", description: "The new passwords you entered do not match." });
          return;
      }
      if (!newPassword || !currentPasswordForPassword) {
          toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all password fields." });
          return;
      }

      const user = await reauthenticate(currentPasswordForPassword);
      if (user) {
          try {
              await updatePassword(user, newPassword);
              toast({ title: "Password Updated", description: "Your password has been successfully updated." });
              setNewPassword("");
              setConfirmPassword("");
              setCurrentPasswordForPassword("");
          } catch (error: any) {
              toast({ variant: "destructive", title: "Password Update Failed", description: error.message });
          }
      }
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
        <CardContent className="grid md:grid-cols-1 gap-6">
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
            <Label htmlFor="meta-title">{t('settings_meta_title_label')}</Label>
            <Input
              id="meta-title"
              type="text"
              value={settings.metaTitle || ''}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_meta_title_desc')}
            </p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="meta-description">{t('settings_meta_description_label')}</Label>
            <Textarea
              id="meta-description"
              value={settings.metaDescription || ''}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_meta_description_desc')}
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
           <div className="space-y-2">
            <Label htmlFor="site-favicon">{t('settings_favicon_label')}</Label>
            <Textarea
              id="site-favicon"
              value={settings.favicon}
              onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t('settings_favicon_desc')}
            </p>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Change your login email and password here. You must provide your current password for any changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Change Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password-email">Current Password</Label>
                        <Input
                        id="current-password-email"
                        type="password"
                        value={currentPasswordForEmail}
                        onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                        placeholder="Enter your current password"
                        />
                    </div>
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
                </CardContent>
                <CardFooter>
                    <Button onClick={handleChangeEmail}>Change Email</Button>
                </CardFooter>
            </Card>

            <Separator />
            
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password-password">Current Password</Label>
                        <Input
                        id="current-password-password"
                        type="password"
                        value={currentPasswordForPassword}
                        onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
                        placeholder="Enter your current password"
                        />
                    </div>
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
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleChangePassword}>Change Password</Button>
                </CardFooter>
            </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header & Body Scripts</CardTitle>
          <CardDescription>
            Add custom scripts to the &lt;head&gt; and &lt;body&gt; tags of your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="header-scripts">Header Scripts</Label>
            <Textarea
              id="header-scripts"
              value={settings.headerScripts || ''}
              onChange={(e) => setSettings({ ...settings, headerScripts: e.target.value })}
              rows={5}
              placeholder="e.g. <script>...</script> or <meta ...>"
            />
            <p className="text-sm text-muted-foreground">
              Scripts/tags to be injected before the closing &lt;/head&gt; tag.
            </p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="body-scripts">Body Scripts</Label>
            <Textarea
              id="body-scripts"
              value={settings.bodyScripts || ''}
              onChange={(e) => setSettings({ ...settings, bodyScripts: e.target.value })}
              rows={5}
              placeholder="e.g. <script>...</script> for analytics"
            />
            <p className="text-sm text-muted-foreground">
              Scripts/tags to be injected at the start of the &lt;body&gt; tag.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer-scripts">Footer Scripts</Label>
            <Textarea
              id="footer-scripts"
              value={settings.footerScripts || ''}
              onChange={(e) => setSettings({ ...settings, footerScripts: e.target.value })}
              rows={5}
              placeholder="e.g. <script>...</script> for tracking pixels"
            />
            <p className="text-sm text-muted-foreground">
              Scripts/tags to be injected before the closing &lt;/body&gt; tag.
            </p>
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
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sitemap.xml" target="_blank">
                Sitemap Generation
              </Link>
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
   </>
  );
}
