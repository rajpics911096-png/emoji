"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { useSiteSettings } from "@/context/site-settings-context";
import { useTranslations } from "@/context/translations-context";


export function AdminSidebar() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { t } = useTranslations();

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: t('admin_dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: "/admin/emojis",
      label: t('admin_emojis'),
      icon: Smile,
    },
    {
      href: "/admin/pages",
      label: t('admin_pages'),
      icon: FileText,
    },
    {
      href: "/admin/media",
      label: t('admin_media'),
      icon: Library,
    },
    {
      href: "/admin/categories",
      label: t('admin_categories'),
      icon: Tags,
    },
    {
      href: "/admin/settings",
      label: t('admin_settings'),
      icon: Settings,
    },
    {
      href: "/admin/footer-settings",
      label: t('admin_footer_settings'),
      icon: FileText,
    },
  ];

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
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
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
            <SidebarMenuButton asChild tooltip={t('admin_logout')}>
              <Link href="/">
                <LogOut />
                <span>{t('admin_logout')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

    