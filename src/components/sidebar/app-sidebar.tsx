"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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
  SettingsIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

import { getCurrentUser } from "@/lib/data/user";
import { getUserWorkspace } from "@/lib/data/workspace";
import { getEvents } from "@/lib/data/events";

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<UserProfile>({
    name: "",
    email: "",
    avatar: "",
  });
  const [sidebarEvents, setSidebarEvents] = React.useState<
    { title: string; url: string }[]
  >([]);
  const [workspaceData, setWorkspaceData] = React.useState({
    name: "",
    year: 0,
  });

  React.useEffect(() => {
    async function fetchData() {
      const userData = await getCurrentUser();

      setUser({
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        avatar: userData?.avatar ?? "",
      });

      const workspaceData = await getUserWorkspace(userData?.id ?? "");

      setWorkspaceData({
        name: workspaceData?.name ?? "",
        year: workspaceData?.year ?? 0,
      });

      const eventsData = await getEvents(workspaceData?.id);

      setSidebarEvents(
        eventsData.map((e) => ({
          title: e.title,
          url: `/events/${e.id}`,
        })),
      );
    }

    fetchData();
  }, []);

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

  const NAV_FOOTER = [
    [
      { title: "Settings", url: "/settings", icon: <SettingsIcon /> },
      { title: "Notifications", url: "/notifications", icon: <BellIcon /> },
    ],
    [{ title: "Log out", url: "/logout", icon: <LogOutIcon /> }],
  ];

  const navMainWithActive = NAV_MAIN.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + "/"),
  }));

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
                  {workspaceData.name} · {workspaceData.year}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter user={user} items={NAV_FOOTER} />
      </SidebarFooter>
    </Sidebar>
  );
}
