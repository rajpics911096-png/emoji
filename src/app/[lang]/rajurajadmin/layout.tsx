
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/admin-sidebar";
import { AuthGuard } from "@/components/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}
