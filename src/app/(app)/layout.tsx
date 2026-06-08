import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/data/users";
import { getWorkspace } from "@/lib/data/workspaces";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  let workspace = null;
  if (user?.workspace_id) {
    workspace = await getWorkspace(user.workspace_id);
  }

  const userProfile = {
    name: user?.full_name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar_url ?? "",
  };

  const workspaceData = {
    name: workspace?.name ?? "",
    year: workspace?.year ?? 0,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={userProfile} workspace={workspaceData} />
      <SidebarInset>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
