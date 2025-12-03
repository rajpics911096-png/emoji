
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeader() {
    const { isMobile } = useSidebar();
    if (!isMobile) return null;

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
            <div className="ml-auto">
                <ThemeToggle />
            </div>
        </header>
    );
}
