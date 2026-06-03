import { NavMain } from "@/components/sidebar/nav-main";
import { NavFooter } from "@/components/sidebar/nav-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CheckSquareIcon,
  UsersIcon,
  ArchiveIcon,
  TerminalIcon,
} from "lucide-react";
import { getEvents } from "@/lib/data/events";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  workspace: {
    name: string;
    year: number;
  };
}

export async function AppSidebar({
  user,
  workspace,
  ...props
}: AppSidebarProps) {
  const events = await getEvents();

  const sidebarEvents = events.slice(0, 10).map((e) => ({
    title: e.title,
    url: `/events/${e.id}`,
  }));

  const NAV_MAIN = [
    { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    {
      title: "Events",
      url: "/events",
      icon: <CalendarCheckIcon />,
      items: sidebarEvents,
    },
    { title: "Tasks", url: "/tasks", icon: <CheckSquareIcon /> },
    { title: "Calendar", url: "/calendar", icon: <CalendarDaysIcon /> },
    { title: "Members", url: "/members", icon: <UsersIcon /> },
    { title: "Archive", url: "/archive", icon: <ArchiveIcon /> },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold">
                  Prefect Hub
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {workspace.name} · {workspace.year}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
