
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SvgIcon } from "@/components/svg-icon";
import {
  LayoutDashboard,
  Settings,
  Smile,
  LogOut,
  Tags,
  FileText,
  Library,
  Megaphone,
  Palette,
} from "lucide-react";
import { useSiteSettings } from "@/context/site-settings-context";
import { useTranslations } from "@/context/translations-context";
import { useToast } from "@/hooks/use-toast";


export function AdminSidebar() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { t, language } = useTranslations();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push(`/${language}/login`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  const menuItems = [
    {
      href: `/rajuadmindashboard/dashboard`,
      label: t('admin_dashboard'),
      icon: LayoutDashboard,
      activeMatch: '/rajuadmindashboard/dashboard',
    },
    {
      href: `/rajuadmindashboard/emojis`,
      label: t('admin_emojis'),
      icon: Smile,
      activeMatch: '/rajuadmindashboard/emojis',
    },
    {
      href: `/rajuadmindashboard/pages`,
      label: t('admin_pages'),
      icon: FileText,
      activeMatch: '/rajuadmindashboard/pages',
    },
    {
      href: `/rajuadmindashboard/media`,
      label: t('admin_media'),
      icon: Library,
      activeMatch: '/rajuadmindashboard/media',
    },
    {
      href: `/rajuadmindashboard/categories`,
      label: t('admin_categories'),
      icon: Tags,
      activeMatch: '/rajuadmindashboard/categories',
    },
    {
      href: `/rajuadmindashboard/ads-settings`,
      label: t('admin_ads_settings'),
      icon: Megaphone,
      activeMatch: '/rajuadmindashboard/ads-settings',
    },
    {
      href: `/rajuadmindashboard/footer-settings`,
      label: t('admin_footer_settings'),
      icon: FileText,
      activeMatch: '/rajuadmindashboard/footer-settings',
    },
     {
      href: `/rajuadmindashboard/ads-txt`,
      label: "Ads.txt",
      icon: FileText,
      activeMatch: '/rajuadmindashboard/ads-txt',
    },
     {
      href: `/rajuadmindashboard/colors`,
      label: 'Colors',
      icon: Palette,
      activeMatch: '/rajuadmindashboard/colors',
    },
    {
      href: `/rajuadmindashboard/settings`,
      label: t('admin_settings'),
      icon: Settings,
      activeMatch: '/rajuadmindashboard/settings',
    },
  ];

  const cleanedPathname = pathname.substring(3); // Remove language code

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SvgIcon svg={settings.logo} className="size-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <h3 className="text-lg font-headline font-semibold text-sidebar-foreground">
              {settings.name}
            </h3>
            <p className="text-xs text-sidebar-foreground/70">{t('admin_sidebar_title')}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={cleanedPathname.startsWith(item.activeMatch)}
                tooltip={item.label}
              >
                <Link href={`/${language}${item.href}`}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip={t('admin_logout')}>
              <LogOut />
              <span>{t('admin_logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
